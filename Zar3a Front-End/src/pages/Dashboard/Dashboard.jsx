import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  LuMapPin,
  LuCalendar,
  LuZap,
  LuWaves,
  LuHash,
  LuLeaf,
  LuTrendingUp,
  LuPower,
  LuSearch,
  LuBell,
  LuWallet,
  LuDroplet,
  LuLayoutGrid,
  LuX,
  LuWind,
  LuSettings2,
  LuFlaskConical,
  LuThermometer,
  LuChevronDown,
  LuPlus,
  LuInfo,
  LuSprout,
  LuCloudSun,
  LuActivity,
  LuMaximize2,
  LuWrench,
  LuClock,
  LuCpu,
  LuSparkles
} from "react-icons/lu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import LiveTicker from "./components/LiveTicker";
import LiveClock from "../../components/LiveClock/LiveClock";
import WeatherCard from './components/WeatherCard';
import { getCropsData } from './constants/crops';
import { locationDB } from './constants/locations';
import { useDashboardQueries } from '../../hooks/queries/useDashboardQueries';
import SensorMonitoringCenter from './components/SensorMonitoringCenter';
import AlertCenter from './components/AlertCenter/AlertCenter';
import AIAnalysisCenter from './components/ai/AIAnalysisCenter';

const Dashboard = () => {
  const { t, isArabic } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [selectedAiCrop, setSelectedAiCrop] = useState(null);

  const navigate = useNavigate();

  // Restrict dashboard access: only Admin and Farmer can access
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const allowedRoles = ['ADMIN', 'FARMER'];
    if (!allowedRoles.includes(user.role)) {
      navigate('/');
    }
  }, [user, navigate]);
  const cropsData = getCropsData(isArabic);
  const {
    farmsList,
    isLoadingFarms,
    sectors,
    activeFarmName,
    setActiveFarmName,
    activeSectorId,
    setActiveSectorId,
    activeSector,
    updateActiveSector,
    weather,
    isWeatherLoading,
    isWeatherError,
    data,
    hardware,
    setHardware,
    toggleHardware,
    handleHardwareToggle,
    alerts,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveAlert,
    unarchiveAlert,
    addLog,
    createFarmMutation,
    deleteFarmMutation,
    createSectorMutation,
    deleteSectorMutation,
    isLocked
  } = useDashboardQueries(user, isArabic);

  const [activeDashboardView, setActiveDashboardView] = useState("overview");
  const [searchQuery, setSearchQuery] = useState(activeSector?.location || "");
  const [activeModalChart, setActiveModalChart] = useState(null);
  const [activeDashboardChart, setActiveDashboardChart] = useState("moisture");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isCropDropdownOpen, setIsCropDropdownOpen] = useState(false);
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [newFarmName, setNewFarmName] = useState("");

  const [isAddSensorOpen, setIsAddSensorOpen] = useState(false);
  const [isAddSectorLocationOpen, setIsAddSectorLocationOpen] = useState(false);
  const [isAddSectorCropOpen, setIsAddSectorCropOpen] = useState(false);
  const [newSensorForm, setNewSensorForm] = useState({
    sensorId: "",
    sectorName: "",
    location: "Cairo, Greater Cairo",
    crop: "Tomato",
  });
  const [addSensorError, setAddSensorError] = useState("");

  const handleAddSensorSubmit = (e) => {
    e.preventDefault();
    setAddSensorError("");

    if (!newSensorForm.sensorId.trim() || !newSensorForm.sectorName.trim()) {
      setAddSensorError("All fields are required");
      return;
    }

    const activeFarm = farmsList.find(f => f.name === activeFarmName);
    if (!activeFarm) {
      setAddSensorError("No active farm selected.");
      return;
    }

    let finalSectorName = newSensorForm.sectorName.trim();
    if (!/^Sector\s+[A-Z]+:/i.test(finalSectorName)) {
      const nextLetter = String.fromCharCode(65 + (activeFarm.Sectors?.length || 0));
      finalSectorName = `Sector ${nextLetter}: ${finalSectorName}`;
    }

    createSectorMutation.mutate({
      farmId: activeFarm.id,
      data: {
        name: finalSectorName,
        location: newSensorForm.location,
        crop: newSensorForm.crop,
        sensorId: newSensorForm.sensorId.trim(),
        isAuto: true,
        moisture: 50,
      }
    }, {
      onSuccess: (newSector) => {
        setIsAddSensorOpen(false);
        setNewSensorForm({
          sensorId: "",
          sectorName: "",
          location: "Cairo, Greater Cairo",
          crop: "Tomato",
        });
        if (newSector && newSector.id) {
          setActiveSectorId(newSector.id);
        }
        addLog(`Sensor ${newSensorForm.sensorId} added to telemetry`, "info");
      }
    });
  };

  const handleAddFarm = () => {
    setIsAddFarmOpen(true);
  };

  const handleAddFarmSubmit = (e) => {
    e.preventDefault();
    if (newFarmName && newFarmName.trim()) {
      const trimmedName = newFarmName.trim();
      createFarmMutation.mutate({ name: trimmedName }, {
        onSuccess: (newFarm) => {
          setIsAddFarmOpen(false);
          setNewFarmName("");
          setActiveFarmName(trimmedName);
          toast.success(t("dash.farmAdded") || "Farm successfully added!");
        }
      });
    }
  };

  const handleRemoveFarm = (farmName, farmId, e) => {
    e.stopPropagation();
    toast.error(t("dash.confirmRemoveFarm") || `Are you sure you want to remove ${farmName} and all its sectors?`, {
      duration: 5000,
      position: 'top-center',
      action: {
        label: "Delete",
        onClick: () => {
          deleteFarmMutation.mutate(farmId, {
            onSuccess: () => {
              if (activeFarmName === farmName) {
                setActiveFarmName(""); 
                setActiveSectorId(null);
              }
            }
          });
        }
      },
      cancel: {
        label: "Cancel"
      }
    });
  };

  const handleRemoveSector = (sectorId, e) => {
    e.stopPropagation();
    toast.error(t("dash.confirmRemoveSector") || "Are you sure you want to remove this sector?", {
      duration: 5000,
      position: 'top-center',
      action: {
        label: "Delete",
        onClick: () => {
          deleteSectorMutation.mutate(sectorId);
        }
      },
      cancel: {
        label: "Cancel"
      }
    });
  };

  const searchRef = useRef(null);
  const cropDropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target))
        setShowSuggestions(false);
      if (
        cropDropdownRef.current &&
        !cropDropdownRef.current.contains(event.target)
      )
        setIsCropDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (locName) => {
    updateActiveSector({ location: locName });
    setSearchQuery(locName);
    setShowSuggestions(false);
  };

  const currentMoisture = data[data.length - 1]?.moisture || 0;
  const currentPh = data[data.length - 1]?.ph || 7.0;
  const currentDosage = data[data.length - 1]?.dosage || 0;
  const crop = cropsData[activeSector?.crop] || cropsData["Tomato"];
  const filteredLocs = Object.keys(locationDB).filter((loc) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const analyzeStatus = () => {
    let adviceParts = [];
    let color = "text-green-500";
    let pumpStatus = t("pump.idle");
    const cropNameTranslated = t("crop." + activeSector.crop);

    // Moisture analysis
    if (currentMoisture < crop.min) {
      color = "text-red-500";
      pumpStatus = hardware.pump?.status === "ON" ? t("pump.active") : t("pump.critical");
      adviceParts.push(hardware.pump?.status === "ON" ? `${t("advice.irrigating")} ${crop.min}%.` : `${t("advice.critical")} ${weather.temp}${t("advice.criticalEnd")}`);
    } else if (currentMoisture > crop.max) {
      color = "text-orange-500";
      pumpStatus = t("pump.halted");
      adviceParts.push(t("advice.warning") || `Moisture too high for ${cropNameTranslated}.`);
    } else {
      pumpStatus = hardware.pump?.status === "ON" ? t("pump.activeStop") : t("pump.standby");
      adviceParts.push(`${t("advice.optimal")} ${cropNameTranslated}${t("advice.optimalEnd")}`);
    }

    // pH analysis (basic parsing of "6.0 - 6.8")
    const phRange = crop.soilPh ? crop.soilPh.split('-').map(n => parseFloat(n.trim())) : [5.5, 7.5];
    if (phRange.length === 2) {
      if (currentPh < phRange[0]) adviceParts.push(`Soil is too acidic (pH ${currentPh}). Consider adding lime.`);
      else if (currentPh > phRange[1]) adviceParts.push(`Soil is too alkaline (pH ${currentPh}). Consider sulfur additives.`);
    }

    // Vent & Fertilizer Context
    if (hardware.vent) adviceParts.push(`Active ventilation is cooling the sector.`);
    if (hardware.fertilizer) adviceParts.push(`Fertilizer pump is active (Dosage: ${currentDosage}kg).`);
    if (hardware.ph) adviceParts.push(`pH modifying agents are being applied.`);

    return {
      color,
      advice: (activeSector.isAuto ? `[${t("dash.auto")}] ` : `[${t("dash.manual")}] `) + adviceParts.join(" "),
      pumpStatus,
    };
  };
  const aiRes = analyzeStatus();



  const [sensorInput, setSensorInput] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSensorSubmit = async (e) => {
    e.preventDefault();
    if (!sensorInput.trim()) {
      setSubmitError("Sensor ID is required.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await updateProfile({ sensorId: sensorInput.trim() });
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Failed to submit Sensor ID. It may already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLocked) {
    const hasSubmittedSensor = Boolean(user?.FarmerProfile?.sensorId);
    const isPendingSecondApproval = user?.status === "pending_second_approval" || hasSubmittedSensor;
    
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="w-full max-w-xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-center relative z-10"
        >
          {/* Animated Icon Container */}
          <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white text-4xl mx-auto mb-8 shadow-[0_0_40px_rgba(99,102,241,0.4)] border border-white/20 relative">
            {isPendingSecondApproval ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
                📡
              </motion.div>
            ) : (
              <motion.div initial={{ y: -5 }} animate={{ y: 5 }} transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}>
                🔒
              </motion.div>
            )}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-indigo-400/30 animate-ping opacity-20"></div>
          </div>

          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-4">
            {isPendingSecondApproval ? "Verification in Progress" : "Dashboard Locked"}
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mb-10 px-4">
            {isPendingSecondApproval 
              ? `Your Sensor ID (${user?.FarmerProfile?.sensorId || "submitted"}) is currently pending review by an administrator. Your telemetry dashboard will automatically unlock once verified.`
              : "Welcome to Zar3a! To access your smart telemetry dashboard, please link your IoT sensor by providing its unique ID below."}
          </p>

          {!isPendingSecondApproval ? (
            <form onSubmit={handleSensorSubmit} className="space-y-6 text-left relative">
              <div className="relative group">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2 pl-1">Smart Sensor ID</label>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <input 
                  type="text"
                  placeholder="e.g. ZAR3A-SENS-XXXX"
                  value={sensorInput}
                  onChange={(e) => setSensorInput(e.target.value)}
                  className="relative w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono font-bold transition-all shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  disabled={isSubmitting}
                />
              </div>
              {submitError && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/30 px-3 py-2 rounded-lg border border-rose-100 dark:border-rose-900/50">
                  {submitError}
                </motion.p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 hover:bg-[length:200%_auto] hover:bg-right text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(99,102,241,0.3)] transition-all duration-500 active:scale-95 disabled:opacity-60 disabled:hover:bg-left"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Linking Sensor...
                  </span>
                ) : "Link Sensor"}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="inline-flex items-center justify-center w-full px-6 py-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-black rounded-2xl text-xs uppercase tracking-widest gap-3"
            >
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </div>
              Waiting for Verification
            </motion.div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-center items-center gap-6">
            <Link to="/marketplace" className="text-xs font-black text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider flex items-center gap-1">
              Browse Marketplace
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            <Link to="/profile" className="text-xs font-black text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors uppercase tracking-wider flex items-center gap-1">
              Farmer Profile
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 px-4 text-left relative z-10">
      {/* Live Ticker */}
      <LiveTicker />

      {isLocked && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <LuZap size={20} />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 dark:text-amber-400">Dashboard is in Read-Only Mode</h3>
              <p className="text-xs text-amber-700 dark:text-amber-500 font-medium">
                {user?.FarmerProfile?.sensorId 
                  ? "Your IoT Sensor is pending approval. You can view data but hardware controls are disabled."
                  : "Register a Sensor ID in your profile to unlock hardware controls."}
              </p>
            </div>
          </div>
          <Link to="/profile" className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors text-sm whitespace-nowrap">
            Go to Profile
          </Link>
        </div>
      )}

      {/* Top Tabs - Grouped by Farm */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-surface-card dark:bg-slate-900 p-4 rounded-[2.5rem] shadow-sm border border-border-default dark:border-slate-800 gap-4">
        
        {/* Left side: Farms and Sectors */}
        <div className="flex flex-col gap-3 w-full md:w-auto overflow-hidden">
          {/* Level 1: Farms */}
          <div className="flex gap-2 w-full overflow-x-auto custom-scrollbar pb-2 border-b border-border-default dark:border-slate-800/60">
            {isLoadingFarms ? (
              <div className="px-6 py-2 text-sm text-text-muted"><ClipLoader size={16} /> Loading Farms...</div>
            ) : farmsList.map((farm) => (
            <button
              key={farm.id}
              onClick={() => {
                setActiveFarmName(farm.name);
                if (farm.Sectors && farm.Sectors.length > 0) setActiveSectorId(farm.Sectors[0].id);
              }}
              className={`group flex items-center gap-2 px-6 py-2 rounded-t-2xl font-black text-sm transition-all whitespace-nowrap ${
                activeFarmName === farm.name 
                ? "text-primary-base border-b-2 border-primary-base" 
                : "text-text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <LuLayoutGrid /> {farm.name}
              {(user?.role === "FARMER" || user?.role?.toUpperCase() === "ADMIN") && (
                <span role="button" onClick={(e) => handleRemoveFarm(farm.name, farm.id, e)} className="ml-2 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <LuX size={14} />
                </span>
              )}
            </button>
          ))}
          {(user?.role === "FARMER" || user?.role?.toUpperCase() === "ADMIN") && (
            <button
              onClick={handleAddFarm}
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 shadow-sm border border-emerald-200 dark:border-emerald-800/50 transition-all whitespace-nowrap ml-auto"
            >
              <LuPlus size={16} /> Add Farm
            </button>
          )}
        </div>

        {/* Level 2: Sectors */}
        <div className="flex gap-2 w-full overflow-x-auto custom-scrollbar pb-2">
          {sectors.filter(s => s.farmName === activeFarmName).map((sector) => (
            <button
              key={sector.id}
              onClick={() => setActiveSectorId(sector.id)}
              className={`group flex items-center gap-2 px-6 py-3 rounded-3xl font-bold text-sm transition-all whitespace-nowrap ${
                activeSectorId === sector.id 
                ? "bg-primary-base text-white shadow-lg shadow-green-200 dark:shadow-none" 
                : "bg-surface-secondary dark:bg-slate-800 text-text-muted hover:bg-surface-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700"
              }`}
            >
              <LuLayoutGrid /> {
                sector.name.includes("Greenhouse") ? `${t("dash.sector")} A: ${t("dash.greenhouse")}` :
                sector.name.includes("Open Field") ? `${t("dash.sector")} B: ${t("dash.openField")}` :
                sector.name.includes("Nile Basin") ? `${t("dash.sector")} C: ${t("dash.nileBasin")}` :
                sector.name.includes("Delta Orchard") ? `${t("dash.sector")} D: ${t("dash.deltaOrchard")}` :
                sector.name
              }
              {(user?.role === "FARMER" || user?.role?.toUpperCase() === "ADMIN") && (
                <span role="button" onClick={(e) => handleRemoveSector(sector.id, e)} className="ml-2 hover:text-red-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <LuX size={14} />
                </span>
              )}
            </button>
          ))}
          {(user?.role === "FARMER" || user?.role?.toUpperCase() === "ADMIN") && (
            <button
              onClick={() => setIsAddSensorOpen(true)}
              disabled={farmsList.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border border-dashed transition-all whitespace-nowrap shadow-sm ${
                farmsList.length === 0 
                ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-gray-500'
                : 'border-emerald-400 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-500 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40'
              }`}
            >
              <LuPlus size={16} /> {t("dash.addSector") || "Add Sector"}
            </button>
          )}
        </div>
      </div>

      {/* Right side: Notification Button */}
        <button
          onClick={() => setIsLogOpen(true)}
          className="relative p-4 bg-surface-secondary dark:bg-slate-800 hover:text-primary-base rounded-full transition-colors hidden md:block shrink-0 self-start mt-2"
        >
          <LuBell size={20} className="dark:text-white" />
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 flex h-3 w-3 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[8px] font-bold text-white items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </button>
      </div>

      {/* --- DASHBOARD VIEW TOGGLE --- */}
      <div className="flex justify-center mb-6">
        <div className="flex p-1 bg-surface-secondary dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-border-default dark:border-white/5 shadow-sm w-fit relative z-10">
          {[
            { id: "overview", label: isArabic ? "نظرة عامة على المزرعة" : "Farm Overview", icon: LuLayoutGrid, activeColor: "text-emerald-600 dark:text-emerald-400", activeBg: "bg-surface-card dark:bg-slate-900 border-white/5 shadow-md" },
            { id: "sensors", label: isArabic ? "مركز المراقبة" : "Monitoring Center", icon: LuCpu, activeColor: "text-emerald-600 dark:text-emerald-400", activeBg: "bg-surface-card dark:bg-slate-900 border-white/5 shadow-md" },
            { id: "ai", label: isArabic ? "مركز الذكاء الاصطناعي" : "AI Center", icon: LuSparkles, activeColor: "text-indigo-600 dark:text-indigo-400", activeBg: "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800/50 shadow-md" }
          ].map((tab) => {
            const isActive = activeDashboardView === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDashboardView(tab.id)}
                className={`relative flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-colors z-10 ${
                  isActive ? tab.activeColor : "text-text-muted dark:text-gray-400 hover:text-text-main dark:hover:text-gray-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDashboardTab"
                    className={`absolute inset-0 rounded-full border ${tab.activeBg}`}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeDashboardView === "ai" ? (
          <motion.div
            key="ai-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <AIAnalysisCenter activeSector={activeSector} hardware={hardware} weather={weather} data={data} />
          </motion.div>
        ) : activeDashboardView === "sensors" ? (
          <motion.div
            key="sensors-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <SensorMonitoringCenter sectors={sectors} />
          </motion.div>
        ) : (
          <motion.div
            key={`overview-${activeSectorId}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Search */}
            <div
              ref={searchRef}
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="relative z-40 bg-surface-card dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-border-default dark:border-slate-800 flex items-center p-3 cursor-pointer hover:bg-surface-secondary dark:hover:bg-slate-800 transition-colors"
            >
              <div className="p-3 bg-primary-light text-primary-base rounded-3xl">
                <LuMapPin size={22} />
              </div>
              <div className="flex-1 px-4 flex flex-col justify-center">
                <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest">
                  {t("dash.zoneLocation")}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-black text-lg truncate dark:text-white">
                    {t("loc." + activeSector.location) || activeSector.location}
                  </span>
                  <LuChevronDown className={`text-text-disabled transition-transform ${showSuggestions ? "rotate-180" : ""}`} />
                </div>
              </div>
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[110%] left-0 w-full bg-surface-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border-default dark:border-slate-700/50 rounded-[2.5rem] shadow-2xl z-50 p-2 max-h-75 overflow-y-auto custom-scrollbar"
                  >
                    {Object.keys(locationDB).map((loc) => (
                      <div
                        key={loc}
                        onClick={() => handleSelectLocation(loc)}
                        className="p-4 hover:bg-primary-light dark:hover:bg-green-900/20 rounded-3xl cursor-pointer flex justify-between items-center border-b border-transparent"
                      >
                        <div>
                          <h4 className="font-bold dark:text-white text-sm">
                            {t("loc." + loc) || loc.split(",")[0]}
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-primary-base font-bold uppercase">
                            {t("dash.best")}: {t("crop." + locationDB[loc].bestCrop)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown & Mode */}
            <div className="bg-surface-card dark:bg-slate-900 p-3 rounded-[2.5rem] border border-border-default dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div
                ref={cropDropdownRef}
                className="relative w-1/2 border-r border-border-default dark:border-slate-800 pr-2 z-30"
              >
                <div
                  onClick={() => setIsCropDropdownOpen(!isCropDropdownOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 bg-surface-secondary dark:bg-slate-800 hover:bg-surface-secondary dark:hover:bg-slate-700 rounded-3xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{crop.icon}</span>
                    <span className="font-black text-text-main dark:text-white truncate">
                      {t("crop." + activeSector.crop)}
                    </span>
                  </div>
                  <LuChevronDown
                    className={`text-text-disabled transition-transform ${isCropDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
                <AnimatePresence>
                  {isCropDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-full min-w-50 bg-surface-card/95 dark:bg-slate-800/95 backdrop-blur-xl border border-border-default dark:border-slate-700 rounded-3xl shadow-xl z-50 overflow-hidden p-2"
                    >
                      {Object.keys(cropsData).map((c) => (
                        <div
                          key={c}
                          onClick={() => {
                            updateActiveSector({ crop: c });
                            setIsCropDropdownOpen(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${activeSector.crop === c ? "bg-primary-light dark:bg-green-900/20 text-primary-base" : "hover:bg-surface-secondary dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"}`}
                        >
                          <span className="text-2xl">{cropsData[c].icon}</span>
                          <span className="font-bold">{t("crop." + c)}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-1/2 flex items-center justify-between px-4">
                <p className="text-[10px] font-black text-text-disabled uppercase">
                  {activeSector.isAuto ? t("dash.auto") : t("dash.manual")}
                </p>
                <div
                  onClick={() => {
                    updateActiveSector({ isAuto: !activeSector.isAuto });
                    addLog(`Mode changed`, "info");
                  }}
                  className="w-14 h-7 bg-gray-200 dark:bg-slate-700 rounded-full p-1 cursor-pointer flex"
                >
                  <motion.div
                    animate={{ x: activeSector.isAuto ? 28 : 0 }}
                    className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center ${activeSector.isAuto ? "bg-green-500 text-white" : "bg-surface-card text-text-disabled"}`}
                  >
                    <LuPower size={10} />
                  </motion.div>
                </div>
              </div>

            </div>
          </div>

          {/* Crop Insights Card */}
          <div className="bg-surface-card dark:bg-slate-900 p-6 rounded-[2.5rem] border border-border-default dark:border-slate-800 shadow-sm">
            <h4 className="font-black dark:text-white flex items-center gap-2 mb-4">
              <LuSprout className="text-primary-base" /> {t("dash.cropInsights")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Planting Window */}
              <div className="bg-linear-to-br from-surface-secondary to-surface-card dark:from-slate-800 dark:to-slate-900 p-5 rounded-3xl flex flex-col justify-center border border-border-default dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                    <LuCalendar size={18} />
                  </div>
                  <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest">
                    {t("dash.plantingDates")}
                  </p>
                </div>
                <p className="font-bold text-sm text-text-main dark:text-white">
                  {crop.plantingDates}
                </p>
              </div>

              {/* Strategic Importance - Spans 2 columns */}
              <div className="md:col-span-2 bg-linear-to-br from-surface-secondary to-surface-card dark:from-slate-800 dark:to-slate-900 p-5 rounded-3xl flex flex-col justify-center border border-border-default dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 dark:bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                    <LuInfo size={18} />
                  </div>
                  <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest">
                    {t("dash.whyPlanted")}
                  </p>
                </div>
                <p className="font-bold text-sm sm:text-base text-text-main dark:text-white leading-relaxed relative z-10">
                  {crop.whyPlanted}
                </p>
              </div>

              {/* Tools Needed */}
              <div className="bg-linear-to-br from-surface-secondary to-surface-card dark:from-slate-800 dark:to-slate-900 p-5 rounded-3xl flex flex-col justify-center border border-border-default dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                    <LuWrench size={18} />
                  </div>
                  <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest">
                    {t("dash.tools")}
                  </p>
                </div>
                <p className="font-bold text-sm text-text-main dark:text-white leading-tight">
                  {crop.tools?.join(", ") || "None specified"}
                </p>
              </div>

              {/* Fertilizer */}
              <div className="bg-linear-to-br from-surface-secondary to-surface-card dark:from-slate-800 dark:to-slate-900 p-5 rounded-3xl flex flex-col justify-center border border-border-default dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                    <LuFlaskConical size={18} />
                  </div>
                  <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest">
                    {t("dash.fertilizer")}
                  </p>
                </div>
                <p className="font-bold text-sm text-text-main dark:text-white leading-tight">
                  {crop.nutrients}
                </p>
              </div>

              {/* Water / Irrigation */}
              <div className="bg-linear-to-br from-surface-secondary to-surface-card dark:from-slate-800 dark:to-slate-900 p-5 rounded-3xl flex flex-col justify-center border border-border-default dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl text-cyan-600 dark:text-cyan-400">
                    <LuDroplet size={18} />
                  </div>
                  <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest">
                    {t("dash.irrigation")}
                  </p>
                </div>
                <p className="font-bold text-sm text-text-main dark:text-white leading-tight">
                  {crop.irrigation}
                </p>
              </div>
            </div>
          </div>

          {/* Hardware Panel */}
          <div
            className={`p-6 rounded-[2.5rem] border transition-all ${activeSector.isAuto ? "bg-surface-secondary dark:bg-slate-800/50 border-border-default dark:border-slate-800 opacity-60" : "bg-surface-card dark:bg-slate-900 border-green-200 dark:border-green-900/50 shadow-lg"}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black dark:text-white flex items-center gap-2">
                <LuSettings2 className="text-text-disabled" /> {t("dash.hardwareControl")}
              </h4>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => toggleHardware("pump")}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all border ${hardware.pump ? "bg-blue-500 border-blue-600 text-white" : "bg-surface-secondary dark:bg-slate-800 text-text-disabled"}`}
              >
                <LuDroplet
                  size={24}
                  className={hardware.pump ? "animate-bounce" : ""}
                />
                <span className="text-[10px] font-black uppercase mt-2">
                  {t("dash.pump")}
                </span>
              </button>
              <button
                onClick={() => toggleHardware("vent")}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all border ${hardware.vent ? "bg-emerald-500 border-emerald-600 text-white" : "bg-surface-secondary dark:bg-slate-800 text-text-disabled"}`}
              >
                <LuWind
                  size={24}
                  className={hardware.vent ? "animate-spin-slow" : ""}
                />
                <span className="text-[10px] font-black uppercase mt-2">
                  {t("dash.vent")}
                </span>
              </button>
              <button
                onClick={() => toggleHardware("fertilizer")}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all border ${hardware.fertilizer ? "bg-purple-500 border-purple-600 text-white" : "bg-surface-secondary dark:bg-slate-800 text-text-disabled"}`}
              >
                <LuFlaskConical
                  size={24}
                  className={hardware.fertilizer ? "animate-pulse" : ""}
                />
                <span className="text-[10px] font-black uppercase mt-2">
                  {t("dash.fertilizer")}
                </span>
              </button>
              <button
                onClick={() => toggleHardware("ph")}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all border ${hardware.ph ? "bg-yellow-500 border-yellow-600 text-white" : "bg-surface-secondary dark:bg-slate-800 text-text-disabled"}`}
              >
                <LuThermometer
                  size={24}
                  className={hardware.ph ? "animate-pulse" : ""}
                />
                <span className="text-[10px] font-black uppercase mt-2">
                  {t("dash.phPump") || "pH Mod"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 🌟 PREMIUM WEATHER CARD 🌟 */}
        <WeatherCard 
          t={t} 
          weather={weather} 
          isWeatherLoading={isWeatherLoading} 
          setSelectedAiCrop={setSelectedAiCrop} 
          cropsData={cropsData} 
        />
      </div>


      {/* --- CHARTS & AI --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: GRAPHS STACK */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* TAB BUTTONS */}
          <div className="flex flex-wrap gap-2 p-2 bg-surface-secondary dark:bg-slate-800 rounded-3xl shadow-inner">
            <button 
              onClick={() => setActiveDashboardChart("moisture")} 
              className={`px-6 py-3 rounded-2xl font-black text-sm flex-1 transition-all whitespace-nowrap ${activeDashboardChart === "moisture" ? "bg-surface-card dark:bg-slate-900 shadow-md text-emerald-500" : "text-text-muted dark:text-text-disabled hover:bg-surface-card/50 dark:hover:bg-slate-900/50"}`}
            >
              {t("dash.moistureTelemetry") || "Moisture"}
            </button>
            <button 
              onClick={() => setActiveDashboardChart("vent")} 
              className={`px-6 py-3 rounded-2xl font-black text-sm flex-1 transition-all whitespace-nowrap ${activeDashboardChart === "vent" ? "bg-surface-card dark:bg-slate-900 shadow-md text-cyan-500" : "text-text-muted dark:text-text-disabled hover:bg-surface-card/50 dark:hover:bg-slate-900/50"}`}
            >
              {t("dash.ventilationTelemetry") || "Ventilation"}
            </button>
            <button 
              onClick={() => setActiveDashboardChart("fertilizer")} 
              className={`px-6 py-3 rounded-2xl font-black text-sm flex-1 transition-all whitespace-nowrap ${activeDashboardChart === "fertilizer" ? "bg-surface-card dark:bg-slate-900 shadow-md text-violet-500" : "text-text-muted dark:text-text-disabled hover:bg-surface-card/50 dark:hover:bg-slate-900/50"}`}
            >
              {t("dash.fertilizerTelemetry") || "Fertilizer"}
            </button>
            <button 
              onClick={() => setActiveDashboardChart("ph")} 
              className={`px-6 py-3 rounded-2xl font-black text-sm flex-1 transition-all whitespace-nowrap ${activeDashboardChart === "ph" ? "bg-surface-card dark:bg-slate-900 shadow-md text-yellow-500" : "text-text-muted dark:text-text-disabled hover:bg-surface-card/50 dark:hover:bg-slate-900/50"}`}
            >
              {t("dash.phLevelTelemetry") !== "dash.phLevelTelemetry" ? t("dash.phLevelTelemetry") : "pH Level Telemetry"}
            </button>
          </div>

          <div onClick={() => setActiveModalChart(activeDashboardChart)} className="bg-surface-card dark:bg-slate-900 p-8 rounded-[3.5rem] border border-border-default dark:border-slate-800 shadow-sm relative cursor-pointer hover:shadow-lg transition-all group">
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-surface-card/5 rounded-[3.5rem] transition-all flex items-center justify-center z-20 pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 bg-surface-card dark:bg-slate-800 text-text-main dark:text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"><LuMaximize2 size={20}/> Click to Expand</span>
            </div>
            {activeDashboardChart === "moisture" && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black dark:text-white tracking-tight">
                      {t("dash.moistureTelemetry")}
                    </h3>
                    <p className="text-sm font-bold text-text-disabled uppercase mt-1">
                      {t("dash.pumpStatus")}:{" "}
                      <span className={aiRes.color}>{aiRes.pumpStatus}</span>
                    </p>
                  </div>
                  <div className="p-2 bg-primary-light dark:bg-slate-800 rounded-2xl text-primary-base dark:text-emerald-400">
                    <LuDroplet size={20} />
                  </div>
                </div>
                <div className="h-96 min-h-[400px] w-full">
                  <ResponsiveContainer width="100%" height={400} minWidth={1} debounce={50}>
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip contentStyle={{ borderRadius: "20px", border: "none", backgroundColor: "rgba(30, 41, 59, 0.9)", color: "#fff" }} />
                      <ReferenceLine y={crop.min} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Min", position: "left", fill: "#94a3b8", fontSize: 10 }} />
                      <ReferenceLine y={crop.max} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Max", position: "left", fill: "#94a3b8", fontSize: 10 }} />
                      <Area type="monotone" dataKey="moisture" stroke="#10b981" strokeWidth={5} fill="url(#g)" animationDuration={500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeDashboardChart === "vent" && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black dark:text-white tracking-tight">
                      {t("dash.ventilationTelemetry") || "Ventilation Telemetry"}
                    </h3>
                    <p className="text-xs font-bold text-text-disabled uppercase mt-1">
                      {t("dash.ventilationActive") || "Current State"}:{" "}
                      <span className={hardware.vent ? "text-emerald-500 font-black" : "text-text-disabled font-black"}>{hardware.vent ? "● ACTIVE" : "○ INACTIVE"}</span>
                    </p>
                  </div>
                  <div className="p-2 bg-cyan-50 dark:bg-slate-800 rounded-2xl text-cyan-600 dark:text-cyan-400">
                    <LuWind size={20} />
                  </div>
                </div>
                <div className="h-96 min-h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height={400} minWidth={1} debounce={50}>
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 10 } }} />
                      <Tooltip contentStyle={{ borderRadius: "20px", border: "none", backgroundColor: "rgba(30, 41, 59, 0.9)", color: "#fff" }} labelStyle={{ fontWeight: "bold" }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      <Bar name="Vent State (0/1)" dataKey="ventState" fill="#06b6d4" radius={[10, 10, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeDashboardChart === "fertilizer" && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black dark:text-white tracking-tight">
                      {t("dash.fertilizerTelemetry") || "Fertilizer Telemetry"}
                    </h3>
                    <p className="text-xs font-bold text-text-disabled uppercase mt-1">
                      {t("dash.fertilizerConsumption") || "Usage & Consumption Trends"}
                    </p>
                  </div>
                  <div className="p-2 bg-violet-50 dark:bg-slate-800 rounded-2xl text-violet-600 dark:text-violet-400">
                    <LuFlaskConical size={20} />
                  </div>
                </div>
                <div className="h-96 min-h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height={400} minWidth={1} debounce={50}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: "20px", border: "none", backgroundColor: "rgba(30, 41, 59, 0.9)", color: "#fff" }} labelStyle={{ fontWeight: "bold" }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      <Line name="Dosage (kg)" type="monotone" dataKey="dosage" stroke="#10b981" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                      <Line name="Consumption (L)" type="monotone" dataKey="consumption" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeDashboardChart === "ph" && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black dark:text-white tracking-tight">
                      {t("dash.phLevelTelemetry") || "pH Level Telemetry"}
                    </h3>
                    <p className="text-xs font-bold text-text-disabled uppercase mt-1">
                      {t("dash.soilAcidity") || "Soil Acidity Monitoring"}
                    </p>
                  </div>
                  <div className="p-2 bg-yellow-50 dark:bg-slate-800 rounded-2xl text-yellow-600 dark:text-yellow-400">
                    <LuThermometer size={20} />
                  </div>
                </div>
                <div className="h-96 min-h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height={400} minWidth={1} debounce={50}>
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis domain={[4, 9]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: "20px", border: "none", backgroundColor: "rgba(30, 41, 59, 0.9)", color: "#fff" }} labelStyle={{ fontWeight: "bold" }} />
                      <ReferenceLine y={6.0} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Min', fill: '#ef4444', fontSize: 10 }} />
                      <ReferenceLine y={7.5} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Max', fill: '#ef4444', fontSize: 10 }} />
                      <Area name="pH Level" type="monotone" dataKey="ph" stroke="#eab308" strokeWidth={4} fill="url(#phGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY AI ENGINE */}
        <div className="space-y-6 lg:sticky lg:top-8 self-start">
          <motion.div className="bg-surface-card dark:bg-slate-900 p-8 rounded-[3rem] border border-border-default dark:border-slate-800 shadow-xl border-t-4 border-t-green-500 flex flex-col justify-between h-auto min-h-[300px]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl">
                  <LuActivity size={20} className="fill-yellow-600" />
                </div>
                <h3 className="font-black dark:text-white uppercase text-sm tracking-widest">
                  {t("dash.aiEngine")}
                </h3>
              </div>
              <p className="text-text-subtle dark:text-gray-300 font-medium leading-relaxed italic mb-8 border-l-2 border-green-500 pl-4 bg-surface-secondary dark:bg-slate-800/50 p-4 rounded-r-2xl">
                "{aiRes.advice}"
              </p>
            </div>
            <button
              onClick={() => setIsReportOpen(true)}
              className="w-full mt-auto py-4 bg-gray-900 dark:bg-primary-base text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg"
            >
              {t("dash.viewProfileRevenue")}
            </button>
          </motion.div>
        </div>
      </div>
      </motion.div>
      )}
      </AnimatePresence>

      {/* --- CHART EXPAND MODAL --- */}
      {createPortal(
        <AnimatePresence>
          {activeModalChart && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModalChart(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-[100px] left-1/2 -translate-x-1/2 w-11/12 max-w-5xl max-h-[calc(100vh-120px)] bg-surface-card dark:bg-slate-900 rounded-[3.5rem] shadow-2xl z-[100] border border-border-default dark:border-slate-800 overflow-y-auto flex flex-col"
              >
                <div className="p-10 md:p-12 pb-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black dark:text-white tracking-tight">
                      {activeModalChart === 'moisture' && (t("dash.moistureTelemetry") || "Moisture Telemetry")}
                      {activeModalChart === 'vent' && (t("dash.ventilationTelemetry") || "Ventilation Telemetry")}
                      {activeModalChart === 'fertilizer' && (t("dash.fertilizerTelemetry") || "Fertilizer Telemetry")}
                      {activeModalChart === 'ph' && (t("dash.phLevelTelemetry") !== "dash.phLevelTelemetry" ? t("dash.phLevelTelemetry") : "pH Level Telemetry")}
                    </h3>
                    <div className="text-sm font-medium mt-4 max-w-3xl leading-relaxed space-y-2">
                      {activeModalChart === 'moisture' && (
                        <div className="space-y-3">
                          <p className="text-base font-bold text-gray-700 dark:text-gray-300">Tracks real-time soil moisture percentage relative to the crop's ideal hydration zone.</p>
                          <ul className="list-disc pl-5 space-y-1 text-text-muted dark:text-text-disabled">
                            <li><strong>Green Zone:</strong> The optimal moisture range between the Min and Max lines.</li>
                            <li><strong>Impact:</strong> Keeps roots healthy, preventing dehydration or fungal rot from overwatering.</li>
                            <li><strong>Automation:</strong> Zar3a AI automatically activates water pumps if levels drop below the threshold.</li>
                          </ul>
                        </div>
                      )}
                      {activeModalChart === 'vent' && (
                        <div className="space-y-3">
                          <p className="text-base font-bold text-gray-700 dark:text-gray-300">Monitors greenhouse ventilation fan activity over time to maintain optimal airflow.</p>
                          <ul className="list-disc pl-5 space-y-1 text-text-muted dark:text-text-disabled">
                            <li><strong>Bar Height:</strong> A value of 1 means active (running), while 0 means idle.</li>
                            <li><strong>Impact:</strong> Proper airflow reduces trapped humidity, preventing airborne diseases.</li>
                            <li><strong>Automation:</strong> Zar3a AI turns on the vent if the temperature or humidity spikes inside the facility.</li>
                          </ul>
                        </div>
                      )}
                      {activeModalChart === 'fertilizer' && (
                        <div className="space-y-3">
                          <p className="text-base font-bold text-gray-700 dark:text-gray-300">Displays automated fertilizer dosage (kg) applied alongside overall water consumption (L).</p>
                          <ul className="list-disc pl-5 space-y-1 text-text-muted dark:text-text-disabled">
                            <li><strong>Nutrient Balance:</strong> Balancing fertilizer with irrigation volume ensures safe absorption.</li>
                            <li><strong>Impact:</strong> Prevents nutrient lockout and root burn, significantly maximizing crop yield.</li>
                            <li><strong>Efficiency:</strong> Tracks overall farm consumption to minimize waste and reduce operational costs.</li>
                          </ul>
                        </div>
                      )}
                      {activeModalChart === 'ph' && (
                        <div className="space-y-3">
                          <p className="text-base font-bold text-gray-700 dark:text-gray-300">Monitors the soil pH levels, indicating acidity or alkalinity of the planting environment.</p>
                          <ul className="list-disc pl-5 space-y-1 text-text-muted dark:text-text-disabled">
                            <li><strong>Ideal Range:</strong> A slightly acidic to neutral pH (typically 6.0 to 7.5) is ideal for most crops.</li>
                            <li><strong>Impact:</strong> Correct pH maximizes the availability of essential macro and micro-nutrients in the soil.</li>
                            <li><strong>Correction:</strong> If pH leaves the optimal zone, immediate soil amendment is recommended to restore balance.</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModalChart(null)}
                    className="w-12 h-12 bg-surface-secondary dark:bg-slate-800 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-full flex items-center justify-center transition-colors shrink-0 text-text-muted"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-10 md:p-12 pt-4 h-[60vh] min-h-[400px]">
                  <ResponsiveContainer width="99%" height="100%" minHeight={400} debounce={50}>
                    {activeModalChart === 'moisture' ? (
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="gModal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" />
                        <Tooltip contentStyle={{ borderRadius: "20px", border: "none" }} />
                        <ReferenceLine y={crop.min} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Min", position: "left", fill: "#94a3b8" }} />
                        <ReferenceLine y={crop.max} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Max", position: "left", fill: "#94a3b8" }} />
                        <Area type="monotone" dataKey="moisture" stroke="#10b981" strokeWidth={5} fill="url(#gModal)" animationDuration={500} />
                      </AreaChart>
                    ) : activeModalChart === 'vent' ? (
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ borderRadius: "20px", border: "none" }} />
                        <Legend />
                        <Bar name="Vent State" dataKey="ventState" fill="#06b6d4" radius={[10, 10, 0, 0]} maxBarSize={60} />
                      </BarChart>
                    ) : activeModalChart === 'fertilizer' ? (
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ borderRadius: "20px", border: "none" }} />
                        <Legend />
                        <Line name="Dosage (kg)" type="monotone" dataKey="dosage" stroke="#10b981" strokeWidth={5} />
                        <Line name="Consumption (L)" type="monotone" dataKey="consumption" stroke="#8b5cf6" strokeWidth={5} />
                      </LineChart>
                    ) : activeModalChart === 'ph' ? (
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="phModal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis domain={[4, 9]} stroke="#94a3b8" />
                        <Tooltip contentStyle={{ borderRadius: "20px", border: "none" }} />
                        <ReferenceLine y={6.0} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Min', fill: '#ef4444' }} />
                        <ReferenceLine y={7.5} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'Max', fill: '#ef4444' }} />
                        <Area name="pH Level" type="monotone" dataKey="ph" stroke="#eab308" strokeWidth={5} fill="url(#phModal)" />
                      </AreaChart>
                    ) : null}
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* --- NOTIFICATIONS --- */}
      {/* --- ALERT CENTER --- */}
      <AlertCenter
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        alerts={alerts}
        markAsRead={markAsRead}
        markAllAsRead={markAllAsRead}
        archiveAlert={archiveAlert}
        unarchiveAlert={unarchiveAlert}
        t={t}
      />

      {/* --- CROP PROFILE MODAL --- */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-card dark:bg-slate-900 w-full max-w-4xl rounded-[3.5rem] p-8 md:p-12 relative overflow-y-auto max-h-[90vh] shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-end mb-8 border-b border-border-default dark:border-slate-800 pb-6">
                <div>
                  <h2 className="text-4xl font-black dark:text-white">
                    {crop.icon} {t("crop." + activeSector.crop)} Profile
                  </h2>
                </div>
                <button
                  onClick={() => setIsReportOpen(false)}
                  className="p-3 bg-surface-secondary dark:bg-slate-800 rounded-full hover:text-red-500"
                >
                  <LuX size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <section className="bg-surface-secondary dark:bg-slate-800/50 p-6 rounded-4xl">
                  <h4 className="font-black dark:text-white mb-4 uppercase text-xs tracking-widest border-l-4 border-green-500 pl-4">
                    {t("dash.financialProj")}
                  </h4>
                  <p className="text-sm dark:text-gray-300 mb-2">
                    <strong>{t("dash.expectedYield")}:</strong> {crop.yieldTons} Tons/Acre
                  </p>
                  <p className="text-sm dark:text-gray-300 mb-2">
                    <strong>{t("dash.marketPrice")}:</strong> EGP{" "}
                    {crop.pricePerTon.toLocaleString()} / Ton
                  </p>
                  <p className="text-xl text-primary-base font-black mt-4">
                    {t("dash.revenue")}: EGP{" "}
                    {(crop.yieldTons * crop.pricePerTon).toLocaleString()}
                  </p>
                </section>
                <section className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-4xl">
                  <h4 className="font-black dark:text-white mb-4 uppercase text-xs tracking-widest border-l-4 border-blue-500 pl-4">
                    {t("dash.careThreats")}
                  </h4>
                  <p className="text-sm dark:text-blue-200 font-bold text-blue-900 mb-2">
                    {t("dash.nutrients")}: {crop.nutrients}
                  </p>
                  <p className="text-sm dark:text-blue-200 font-bold text-red-500 mb-2">
                    {t("dash.commonDiseases")}: {crop.diseases}
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sleek Add Sensor Modal */}
      {createPortal(
        <AnimatePresence>
          {isAddSensorOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddSensorOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 backdrop-blur-xl border border-gray-100 dark:border-slate-800 rounded-[2rem] shadow-2xl p-8 overflow-y-auto text-left max-h-[calc(100vh-120px)] custom-scrollbar ring-1 ring-black/5 dark:ring-white/5"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                      <LuPlus size={24} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-text-main dark:text-white tracking-tight">
                        {t("dash.addSector") || "Add New Sector"}
                      </h3>
                      <p className="text-sm text-text-muted dark:text-gray-400 font-medium mt-0.5">Configure your new farm zone</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddSensorOpen(false)}
                    className="p-2 bg-gray-50 text-gray-400 dark:bg-slate-800 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-full transition-all mt-1"
                  >
                    <LuX size={18} className="stroke-[2.5]" />
                  </button>
                </div>

                {addSensorError && (
                  <div className="flex items-center gap-3 p-4 mb-6 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl">
                    <LuInfo className="shrink-0" size={18} /> {addSensorError}
                  </div>
                )}

                <form onSubmit={handleAddSensorSubmit} className="space-y-4">
                  <div className="space-y-1.5 group">
                    <label className="text-[11px] font-bold text-text-muted dark:text-gray-400 uppercase tracking-widest ms-1 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                      {t("profile.sensorId") || "Sensor ID"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                        <LuHash size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={newSensorForm.sensorId}
                        onChange={(e) => setNewSensorForm({ ...newSensorForm, sensorId: e.target.value })}
                        placeholder="e.g. SN-89210-A"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-[11px] font-bold text-text-muted dark:text-gray-400 uppercase tracking-widest ms-1 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                      {t("dash.sectorName") || "Sector Name"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                        <LuLayoutGrid size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={newSensorForm.sectorName}
                        onChange={(e) => setNewSensorForm({ ...newSensorForm, sectorName: e.target.value })}
                        placeholder="e.g. Greenhouse"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-[11px] font-bold text-text-muted dark:text-gray-400 uppercase tracking-widest ms-1 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                      {t("dash.zoneLocation") || "Zone Location"}
                    </label>
                    <div className="relative">
                      {isAddSectorLocationOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsAddSectorLocationOpen(false)} />
                      )}
                      <button
                        type="button"
                        onClick={() => setIsAddSectorLocationOpen(!isAddSectorLocationOpen)}
                        className="peer w-full text-left pl-11 pr-10 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700/50 hover:bg-emerald-50 dark:hover:bg-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-medium cursor-pointer relative z-20 shadow-sm hover:shadow-md"
                      >
                        {t("loc." + newSensorForm.location) || newSensorForm.location}
                      </button>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 peer-hover:text-emerald-500 group-focus-within:text-emerald-500 transition-colors z-30">
                        <LuMapPin size={18} />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 peer-hover:text-emerald-500 group-focus-within:text-emerald-500 transition-colors z-30">
                        <LuChevronDown size={18} className={`transition-transform duration-200 ${isAddSectorLocationOpen ? 'rotate-180' : ''}`} />
                      </div>
                      
                      <AnimatePresence>
                        {isAddSectorLocationOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 py-2 max-h-56 overflow-y-auto custom-scrollbar"
                          >
                            {Object.keys(locationDB).map((loc) => (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => {
                                  setNewSensorForm({ ...newSensorForm, location: loc });
                                  setIsAddSectorLocationOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors font-medium text-sm ${
                                  newSensorForm.location === loc ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/5' : 'text-text-main dark:text-gray-300'
                                }`}
                              >
                                {t("loc." + loc) || loc}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-[11px] font-bold text-text-muted dark:text-gray-400 uppercase tracking-widest ms-1 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                      {t("dash.crop") || "Crop"}
                    </label>
                    <div className="relative">
                      {isAddSectorCropOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsAddSectorCropOpen(false)} />
                      )}
                      <button
                        type="button"
                        onClick={() => setIsAddSectorCropOpen(!isAddSectorCropOpen)}
                        className="peer w-full text-left pl-11 pr-10 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700/50 hover:bg-emerald-50 dark:hover:bg-slate-700/80 hover:border-emerald-400 dark:hover:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 font-medium cursor-pointer relative z-20 flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <span className="text-lg transition-transform duration-300 peer-hover:scale-110">{cropsData[newSensorForm.crop]?.icon}</span>
                        {t("crop." + newSensorForm.crop) || newSensorForm.crop}
                      </button>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 peer-hover:text-emerald-500 group-focus-within:text-emerald-500 transition-colors z-30">
                        <LuLeaf size={18} />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 peer-hover:text-emerald-500 group-focus-within:text-emerald-500 transition-colors z-30">
                        <LuChevronDown size={18} className={`transition-transform duration-200 ${isAddSectorCropOpen ? 'rotate-180' : ''}`} />
                      </div>

                      <AnimatePresence>
                        {isAddSectorCropOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 py-2 max-h-56 overflow-y-auto custom-scrollbar"
                          >
                            {Object.keys(cropsData).map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setNewSensorForm({ ...newSensorForm, crop: c });
                                  setIsAddSectorCropOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors font-medium text-sm ${
                                  newSensorForm.crop === c ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/5' : 'text-text-main dark:text-gray-300'
                                }`}
                              >
                                <span className="text-lg">{cropsData[c].icon}</span>
                                {t("crop." + c) || c}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-base shadow-md shadow-emerald-500/20 transition-all mt-8 flex items-center justify-center gap-2"
                  >
                    {t("common.add") || "Add Sector"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Sleek Add Farm Modal */}
      {createPortal(
        <AnimatePresence>
          {isAddFarmOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddFarmOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 backdrop-blur-xl border border-gray-100 dark:border-slate-800 rounded-[2rem] shadow-2xl p-8 overflow-y-auto text-left"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                      <LuLayoutGrid size={24} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-text-main dark:text-white tracking-tight">
                        {t("dash.addFarm") || "Add New Farm"}
                      </h3>
                      <p className="text-sm text-text-muted dark:text-gray-400 font-medium mt-0.5">Start managing a new area</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddFarmOpen(false)}
                    className="p-2 bg-gray-50 text-gray-400 dark:bg-slate-800 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-full transition-all mt-1"
                  >
                    <LuX size={18} className="stroke-[2.5]" />
                  </button>
                </div>

                <form onSubmit={handleAddFarmSubmit} className="space-y-4">
                  <div className="space-y-1.5 group">
                    <label className="text-[11px] font-bold text-text-muted dark:text-gray-400 uppercase tracking-widest ms-1 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                      {t("dash.farmName") || "Farm Name"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                        <LuLayoutGrid size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        autoFocus
                        value={newFarmName}
                        onChange={(e) => setNewFarmName(e.target.value)}
                        placeholder="e.g. Omega Farm"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 dark:bg-slate-800/50 dark:text-white dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-base shadow-md shadow-emerald-500/20 transition-all mt-8 flex items-center justify-center gap-2"
                  >
                    {t("common.add") || "Create Farm"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* AI Suggested Popup Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedAiCrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedAiCrop(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-surface-card/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-white/20 dark:border-slate-700 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl max-w-lg w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedAiCrop(null)}
                  className="absolute top-6 right-6 p-2 bg-surface-secondary dark:bg-slate-800 rounded-full hover:bg-red-500 hover:text-white transition-colors z-10"
                >
                  <LuX size={20} />
                </button>

                <div className="flex items-center gap-4 mb-6 border-b border-border-default dark:border-slate-700 pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/10 dark:border-slate-600">
                    {cropsData[selectedAiCrop]?.icon}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em]">
                      {t("dash.aiSuggested") || "AI SUGGESTED"}
                    </h3>
                    <h2 className="text-3xl font-black text-text-main dark:text-white">
                      {t("crop." + selectedAiCrop) || selectedAiCrop}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  {/* Style 1: Why AI Approach */}
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <LuActivity /> {t("dash.whyAiChoseThis")}
                    </h4>
                    <p className="text-sm text-text-main dark:text-slate-200 leading-relaxed font-bold">
                      {isArabic ? `بناءً على مستشعرات رطوبة التربة في الوقت الفعلي وأنماط الطقس الإقليمية الحالية، يقدم محصول ${t("crop." + selectedAiCrop) || selectedAiCrop} أعلى إنتاجية وربحية لموقعك الحالي اليوم!` : `Based on real-time soil moisture sensors and current regional weather patterns, ${t("crop." + selectedAiCrop) || selectedAiCrop} offers the highest yield and profitability for your exact location today!`}
                    </p>
                  </div>

                  {/* Style 2: Quick Facts Card */}
                  <div className="bg-surface-secondary dark:bg-slate-800 p-4 rounded-2xl border border-border-default dark:border-slate-700 shadow-inner">
                    <h4 className="text-[10px] font-black text-text-muted dark:text-slate-400 uppercase tracking-widest mb-3">
                      {t("dash.quickFacts")}
                    </h4>
                    <ul className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-bold text-text-main dark:text-slate-200">
                      <li className="flex items-center gap-1.5">🌱 <span className="text-text-muted">{t("dash.duration")}</span> <span className="truncate">{cropsData[selectedAiCrop]?.duration}</span></li>
                      <li className="flex items-center gap-1.5">☀️ <span className="text-text-muted">{t("dash.sunlight")}</span> <span className="truncate">{cropsData[selectedAiCrop]?.sunlight}</span></li>
                      <li className="flex items-center gap-1.5">💧 <span className="text-text-muted">{t("dash.watering")}</span> <span className="truncate">{cropsData[selectedAiCrop]?.irrigation?.split(' ')[0]}</span></li>
                      <li className="flex items-center gap-1.5">💪 <span className="text-text-muted">{t("dash.difficulty")}</span> <span className="truncate">{cropsData[selectedAiCrop]?.difficulty}</span></li>
                    </ul>
                  </div>

                  {/* Tools & Fertilizers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <LuSettings2 size={12} /> {t("dash.toolsNeeded")}
                      </h4>
                      <ul className="list-disc list-inside text-xs font-bold text-text-main dark:text-slate-300 space-y-1">
                        {cropsData[selectedAiCrop]?.tools.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <LuFlaskConical size={12} /> {t("dash.fertilizers")}
                      </h4>
                      <p className="text-xs font-bold text-text-main dark:text-slate-300 leading-snug">
                        {cropsData[selectedAiCrop]?.nutrients}
                      </p>
                    </div>
                  </div>

                  {/* Style 3: Fun Fact */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4 rounded-2xl text-center shadow-inner mt-2">
                    <p className="text-sm font-black text-purple-700 dark:text-purple-300 italic">
                      "{cropsData[selectedAiCrop]?.funFact}"
                    </p>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-3 opacity-80">
                      {t("dash.plantSeedsNow")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Dashboard;
