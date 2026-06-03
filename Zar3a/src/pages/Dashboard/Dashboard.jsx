import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuMapPin,
  LuCalendar,
  LuZap,
  LuWaves,
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
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import LiveTicker from "./LiveTicker";
import LiveClock from "../../components/LiveClock/LiveClock";

const Dashboard = () => {
  const { t } = useLanguage();
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
  const cropsData = {
    Cotton: {
      icon: "☁️",
      min: 50,
      max: 70,
      duration: "180 days",
      nutrients: "Ammonium Nitrate",
      irrigation: "Every 10-15 days",
      season: "Summer",
      yieldTons: 1.5,
      pricePerTon: 45000,
      soilPh: "6.0 - 7.5",
      sunlight: "Full Sun",
      diseases: "Boll Rot",
      info: "Requires deep soil preparation.",
      plantingDates: "March - May",
      whyPlanted: "Major cash crop in Egypt, known globally for its high-quality long-staple fibers.",
      difficulty: "Hard",
      funFact: "Egyptian cotton is considered the finest in the world due to its extra-long staples!",
      tools: ["Hand trowel", "Pruning shears", "Drip irrigation kit"],
    },
    Wheat: {
      icon: "🌾",
      min: 40,
      max: 60,
      duration: "150 days",
      nutrients: "Urea",
      irrigation: "4-5 times/season",
      season: "Winter",
      yieldTons: 3,
      pricePerTon: 13000,
      soilPh: "6.0 - 7.0",
      sunlight: "Full Sun",
      diseases: "Rust",
      info: "Critical moisture needed during flowering.",
      plantingDates: "November - December",
      whyPlanted: "Essential food security crop; Egypt's most critical strategic staple for bread.",
      difficulty: "Medium",
      funFact: "Wheat was one of the first crops ever cultivated by humans, dating back over 10,000 years!",
      tools: ["Seed drill", "Sickle", "Harvester"],
    },
    "Sugar Cane": {
      icon: "🎋",
      min: 70,
      max: 90,
      duration: "360 days",
      nutrients: "Potassium Sulfate",
      irrigation: "High frequency",
      season: "Year-round",
      yieldTons: 40,
      pricePerTon: 1500,
      soilPh: "6.0 - 8.5",
      sunlight: "Full Sun",
      diseases: "Smut",
      info: "Requires excellent drainage.",
      plantingDates: "February - March",
      whyPlanted: "Primary source of sugar production in Upper Egypt, highly profitable for local farmers.",
      difficulty: "Medium",
      funFact: "Sugar cane is a giant grass that can grow up to 20 feet tall!",
      tools: ["Machete", "Tractor", "Drip irrigation line"],
    },
    Tomato: {
      icon: "🍅",
      min: 60,
      max: 80,
      duration: "90 days",
      nutrients: "NPK 15-15-15",
      irrigation: "Daily early morning",
      season: "All seasons",
      yieldTons: 20,
      pricePerTon: 6000,
      soilPh: "6.0 - 6.8",
      sunlight: "Full Sun",
      diseases: "Blight",
      info: "Consistent moisture prevents fruit cracking.",
      plantingDates: "Multiple (Feb-Mar, Sep-Oct)",
      whyPlanted: "Extremely high local demand year-round; versatile crop for fresh market and processing.",
      difficulty: "Moderate",
      funFact: "Did you know tomatoes are technically berries?",
      tools: ["Hand trowel", "Pruning shears", "Tomato cages"],
    },
    Citrus: {
      icon: "🍊",
      min: 60,
      max: 75,
      duration: "Perennial",
      nutrients: "Zinc, Iron",
      irrigation: "Regular cycles",
      season: "Winter",
      yieldTons: 15,
      pricePerTon: 8000,
      soilPh: "5.5 - 6.5",
      sunlight: "Full/Partial Sun",
      diseases: "Citrus Canker",
      info: "Prefers sandy-loamy Delta soils.",
      plantingDates: "February - April (Saplings)",
      whyPlanted: "Major export crop; Egypt is one of the world's leading exporters of oranges.",
      difficulty: "Hard",
      funFact: "Citrus trees can live and produce fruit for over 50 years!",
      tools: ["Pruning saws", "Harvesting bags", "Sprayers"],
    },
    Rice: {
      icon: "🍚",
      min: 70,
      max: 90,
      duration: "120 days",
      nutrients: "Ammonium Sulfate",
      irrigation: "Continuous flooding",
      season: "Summer",
      yieldTons: 4.2,
      pricePerTon: 16000,
      soilPh: "5.5 - 6.5",
      sunlight: "Full Sun",
      diseases: "Blast",
      info: "Requires clayey soils retaining water.",
      plantingDates: "April - May",
      whyPlanted: "Crucial summer staple crop that helps reclaim saline soils in the Northern Delta.",
      difficulty: "Hard",
      funFact: "Rice provides more than one-fifth of the calories consumed worldwide by humans!",
      tools: ["Transplanter", "Water pump", "Sickle"],
    },
    Maize: {
      icon: "🌽",
      min: 55,
      max: 75,
      duration: "110 days",
      nutrients: "Urea & Superphosphate",
      irrigation: "Every 7-10 days",
      season: "Summer",
      yieldTons: 3.5,
      pricePerTon: 12500,
      soilPh: "5.8 - 7.0",
      sunlight: "Full Sun",
      diseases: "Late Wilt",
      info: "Highly sensitive to drought during pollination.",
      plantingDates: "May - June",
      whyPlanted: "Dual-purpose crop used for human consumption and vital livestock feed.",
      difficulty: "Easy",
      funFact: "An average ear of maize has 800 kernels arranged in 16 rows!",
      tools: ["Planter", "Hoe", "Sprinkler"],
    },
    Potato: {
      icon: "🥔",
      min: 60,
      max: 80,
      duration: "105 days",
      nutrients: "Potassium Chloride",
      irrigation: "Every 5-7 days",
      season: "Winter",
      yieldTons: 12,
      pricePerTon: 8000,
      soilPh: "5.2 - 6.5",
      sunlight: "Full Sun",
      diseases: "Late Blight",
      info: "Prefers well-drained sandy-loam soils.",
      plantingDates: "Jan-Feb (Summer), Sep-Oct (Winter)",
      whyPlanted: "High-value export commodity and fundamental local vegetable.",
      difficulty: "Moderate",
      funFact: "Potatoes were the first vegetable to be grown in space!",
      tools: ["Spade", "Hoe", "Potato fork"],
    },
    Clover: {
      icon: "☘️",
      min: 50,
      max: 70,
      duration: "180 days (multi-cut)",
      nutrients: "Phosphorus",
      irrigation: "Every 12-15 days",
      season: "Winter",
      yieldTons: 35,
      pricePerTon: 2200,
      soilPh: "6.0 - 7.5",
      sunlight: "Full/Partial Sun",
      diseases: "Root Rot",
      info: "Primary animal feed crop in Egypt (Berseem).",
      plantingDates: "September - November",
      whyPlanted: "The most important forage crop for livestock; excellent for nitrogen fixation in soil.",
      difficulty: "Easy",
      funFact: "Don't mistake clover for just livestock feed; its blossoms are the secret behind exceptional honey.",
      tools: ["Seed spreader", "Scythe", "Rake"],
    },
    Onion: {
      icon: "🧅",
      min: 45,
      max: 65,
      duration: "140 days",
      nutrients: "NPK 10-10-20",
      irrigation: "Every 10 days",
      season: "Winter",
      yieldTons: 15,
      pricePerTon: 7500,
      soilPh: "6.0 - 7.0",
      sunlight: "Full Sun",
      diseases: "Downy Mildew",
      info: "Dry harvest period is crucial for storage.",
      plantingDates: "August - October",
      whyPlanted: "Key ingredient in local cuisine and a highly demanded export crop to Europe and Arab nations.",
      difficulty: "Moderate",
      funFact: "Onions make you cry because they release a sulfur gas when cut!",
      tools: ["Hand trowel", "Dibber", "Hoe"],
    },
  };

  const locationDB = {
    "Cairo, Greater Cairo": {
      lat: 30.0444,
      lng: 31.2357,
      bestCrop: "Tomato",
      region: "Capital",
    },
    "Dakahlia, Mansoura": {
      lat: 31.0364,
      lng: 31.3801,
      bestCrop: "Cotton",
      region: "Delta",
    },
    "Minya, Upper Egypt": {
      lat: 28.1099,
      lng: 30.7503,
      bestCrop: "Wheat",
      region: "Middle Egypt",
    },
    "Aswan, Deep South": {
      lat: 24.0889,
      lng: 32.8998,
      bestCrop: "Sugar Cane",
      region: "South Upper Egypt",
    },
    "Alexandria, Coast": {
      lat: 31.2001,
      lng: 29.9187,
      bestCrop: "Wheat",
      region: "Coastal",
    },
    "Sharqia, Delta": {
      lat: 30.7084,
      lng: 31.7344,
      bestCrop: "Rice",
      region: "Delta",
    },
    "Beheira, West Delta": {
      lat: 30.8436,
      lng: 30.2974,
      bestCrop: "Potato",
      region: "West Delta",
    },
    "Fayoum, Oasis": {
      lat: 29.3074,
      lng: 30.8441,
      bestCrop: "Onion",
      region: "Oasis",
    },
    "Gharbia, Central Delta": {
      lat: 30.8228,
      lng: 31.0264,
      bestCrop: "Clover",
      region: "Central Delta",
    },
    "Kafr El Sheikh, North Delta": {
      lat: 31.2584,
      lng: 30.9416,
      bestCrop: "Rice",
      region: "North Delta",
    },
    "Monufia, Delta": {
      lat: 30.5972,
      lng: 30.9876,
      bestCrop: "Wheat",
      region: "Delta",
    },
    "Qalyubia, Delta": {
      lat: 30.3292,
      lng: 31.2168,
      bestCrop: "Maize",
      region: "Delta",
    },
    "Damietta, North Coast": {
      lat: 31.4175,
      lng: 31.8111,
      bestCrop: "Tomato",
      region: "Coastal",
    },
    "Ismailia, Canal": {
      lat: 30.5965,
      lng: 32.2715,
      bestCrop: "Citrus",
      region: "Canal Zone",
    },
    "Port Said, Canal": {
      lat: 31.2653,
      lng: 32.3019,
      bestCrop: "Tomato",
      region: "Canal Zone",
    },
    "Suez, Canal": {
      lat: 29.9668,
      lng: 32.5498,
      bestCrop: "Tomato",
      region: "Canal Zone",
    },
    "Giza, Greater Cairo": {
      lat: 30.0131,
      lng: 31.2089,
      bestCrop: "Potato",
      region: "Capital",
    },
    "Beni Suef, Middle Egypt": {
      lat: 29.0661,
      lng: 31.0994,
      bestCrop: "Onion",
      region: "Middle Egypt",
    },
    "Asyut, Upper Egypt": {
      lat: 27.1783,
      lng: 31.1859,
      bestCrop: "Cotton",
      region: "Upper Egypt",
    },
    "Sohag, Upper Egypt": {
      lat: 26.5591,
      lng: 31.6957,
      bestCrop: "Sugar Cane",
      region: "Upper Egypt",
    },
    "Qena, Upper Egypt": {
      lat: 26.1551,
      lng: 32.7160,
      bestCrop: "Sugar Cane",
      region: "Upper Egypt",
    },
    "Luxor, Upper Egypt": {
      lat: 25.6872,
      lng: 32.6396,
      bestCrop: "Sugar Cane",
      region: "Upper Egypt",
    },
    "New Valley, Western Desert": {
      lat: 25.4390,
      lng: 30.5586,
      bestCrop: "Wheat",
      region: "Oasis",
    },
    "Matrouh, North Coast": {
      lat: 31.3525,
      lng: 27.2453,
      bestCrop: "Wheat",
      region: "Coastal",
    },
    "North Sinai, Sinai": {
      lat: 30.2824,
      lng: 33.6845,
      bestCrop: "Citrus",
      region: "Sinai",
    },
    "South Sinai, Sinai": {
      lat: 28.9715,
      lng: 33.6265,
      bestCrop: "Tomato",
      region: "Sinai",
    },
    "Red Sea, Coast": {
      lat: 26.9654,
      lng: 33.8225,
      bestCrop: "Tomato",
      region: "Coastal",
    },
  };

  const [sectors, setSectors] = useState([
    {
      id: 1,
      name: "Sector A: Greenhouse",
      location: "Cairo, Greater Cairo",
      crop: "Tomato",
      isAuto: true,
      moisture: 62,
    },
    {
      id: 2,
      name: "Sector B: Open Field",
      location: "Dakahlia, Mansoura",
      crop: "Cotton",
      isAuto: false,
      moisture: 45,
    },
    {
      id: 3,
      name: "Sector C: Nile Basin",
      location: "Minya, Upper Egypt",
      crop: "Wheat",
      isAuto: true,
      moisture: 55,
    },
    {
      id: 4,
      name: "Sector D: Delta Orchard",
      location: "Sharqia, Delta",
      crop: "Citrus",
      isAuto: false,
      moisture: 68,
    },
  ]);
  const [activeSectorId, setActiveSectorId] = useState(1);
  const activeSector = sectors.find((s) => s.id === activeSectorId);

  const [searchQuery, setSearchQuery] = useState(activeSector.location);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isCropDropdownOpen, setIsCropDropdownOpen] = useState(false);

  const [isAddSensorOpen, setIsAddSensorOpen] = useState(false);
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

    // Check if duplicate sensorId in our sectors
    const duplicate = sectors.find(s => s.sensorId === newSensorForm.sensorId.trim());
    if (duplicate) {
      setAddSensorError("Sensor ID is already registered");
      return;
    }

    const newId = sectors.length + 1;
    const newSector = {
      id: newId,
      name: newSensorForm.sectorName.trim(),
      location: newSensorForm.location,
      crop: newSensorForm.crop,
      sensorId: newSensorForm.sensorId.trim(),
      isAuto: true,
      moisture: 50,
    };

    setSectors([...sectors, newSector]);
    setActiveSectorId(newId);
    setIsAddSensorOpen(false);
    setNewSensorForm({
      sensorId: "",
      sectorName: "",
      location: "Cairo, Greater Cairo",
      crop: "Tomato",
    });
    addLog(`Sensor ${newSector.sensorId} added to telemetry`, "info");
  };

  const searchRef = useRef(null);
  const cropDropdownRef = useRef(null);

  const [hardware, setHardware] = useState({
    pump: false,
    vent: false,
    fertilizer: false,
    ph: false,
  });
  const [activeModalChart, setActiveModalChart] = useState(null);
  const [activeDashboardChart, setActiveDashboardChart] = useState("moisture");
  const [logs, setLogs] = useState([
    { time: "09:30 AM", msg: "Mode changed", type: "info" },
    { time: "09:15 AM", msg: "[MANUAL] PUMP turned ON", type: "action" },
    { time: "09:00 AM", msg: "Sensor calibration completed", type: "info" },
    { time: "08:30 AM", msg: "System Booted Successfully", type: "info" },
  ]);
  const [data, setData] = useState([
    { time: "07:00 AM", moisture: 58, ph: 6.2, dosage: 25, consumption: 150, ventState: 0 },
    { time: "07:15 AM", moisture: 57, ph: 6.2, dosage: 25, consumption: 155, ventState: 1 },
    { time: "07:30 AM", moisture: 56, ph: 6.3, dosage: 25, consumption: 160, ventState: 1 },
    { time: "07:45 AM", moisture: 55, ph: 6.3, dosage: 26, consumption: 165, ventState: 0 },
    { time: "08:00 AM", moisture: 59, ph: 6.4, dosage: 27, consumption: 170, ventState: 1 },
    { time: "08:15 AM", moisture: 64, ph: 6.4, dosage: 28, consumption: 175, ventState: 1 },
    { time: "08:30 AM", moisture: 63, ph: 6.5, dosage: 28, consumption: 180, ventState: 1 },
    { time: "08:45 AM", moisture: 62, ph: 6.5, dosage: 29, consumption: 185, ventState: 0 },
    { time: "09:00 AM", moisture: 61, ph: 6.6, dosage: 30, consumption: 190, ventState: 0 },
    { time: "09:15 AM", moisture: 60, ph: 6.6, dosage: 30, consumption: 195, ventState: 1 },
    { time: "09:30 AM", moisture: 59, ph: 6.5, dosage: 31, consumption: 200, ventState: 1 },
    { time: "09:45 AM", moisture: 58, ph: 6.4, dosage: 32, consumption: 205, ventState: 0 },
  ]);

  const [weather, setWeather] = useState({
    temp: "--",
    condition: "Loading...",
    bestCrop: "Tomato",
    region: "Egypt",
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const getWeatherCondition = (code) => {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    return "Sunny";
  };

  useEffect(() => {
    const fetchRealWeather = async () => {
      const locInfo = locationDB[activeSector.location];
      if (!locInfo) return;
      setIsWeatherLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${locInfo.lat}&longitude=${locInfo.lng}&current_weather=true&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
        );
        const result = await response.json();
        
        // Get current hour for humidity
        const currentHour = new Date().getHours();
        const humidity = result.hourly?.relative_humidity_2m[currentHour] || 50;
        const tempMax = Math.round(result.daily?.temperature_2m_max[0]) || Math.round(result.current_weather.temperature) + 4;
        const tempMin = Math.round(result.daily?.temperature_2m_min[0]) || Math.round(result.current_weather.temperature) - 5;

        setWeather({
          temp: Math.round(result.current_weather.temperature),
          tempMax: tempMax,
          tempMin: tempMin,
          humidity: humidity,
          windspeed: result.current_weather.windspeed,
          condition: getWeatherCondition(result.current_weather.weathercode),
          bestCrop: locInfo.bestCrop,
          region: locInfo.region,
        });
      } catch (error) {
        setWeather({
          temp: 30,
          tempMax: 35,
          tempMin: 22,
          humidity: 45,
          windspeed: 12,
          condition: "Offline",
          bestCrop: locInfo.bestCrop,
          region: locInfo.region,
        });
      } finally {
        setIsWeatherLoading(false);
      }
    };
    fetchRealWeather();
  }, [activeSector.location]);

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

  const handleHardwareToggle = (type) => {
    if (isLocked) {
      toast.error("Hardware controls are disabled in Read-Only mode. Please wait for sensor approval.");
      return;
    }
    setHardware((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        status: prev[type].status === "ON" ? "OFF" : "ON",
      },
    }));
  };

  const addLog = (msg, type) =>
    setLogs((prev) =>
      [
        {
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          msg,
          type,
        },
        ...prev,
      ].slice(0, 15),
    );
  const updateActiveSector = (updates) =>
    setSectors(
      sectors.map((s) => (s.id === activeSectorId ? { ...s, ...updates } : s)),
    );

  const handleSelectLocation = (locName) => {
    updateActiveSector({ location: locName });
    setSearchQuery(locName);
    setShowSuggestions(false);
  };

  const toggleHardware = (device) => {
    if (isLocked) {
      toast.error("Hardware controls are disabled in Read-Only mode. Please wait for sensor approval.");
      return;
    }
    if (activeSector.isAuto) return;
    const newState = !hardware[device];
    setHardware((prev) => ({ ...prev, [device]: newState }));
    addLog(
      `[MANUAL] ${device.toUpperCase()} turned ${newState ? "ON" : "OFF"}`,
      "action",
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const lastVal = prev[prev.length - 1]?.moisture || 50;
        const lastPh = prev[prev.length - 1]?.ph || 6.5;
        const lastDosage = prev[prev.length - 1]?.dosage || 20;
        const lastConsumption = prev[prev.length - 1]?.consumption || 150;

        const cropMin = cropsData[activeSector.crop].min;
        const [minPhStr, maxPhStr] = cropsData[activeSector.crop].soilPh.split(" - ");
        const minPh = parseFloat(minPhStr);
        const maxPh = parseFloat(maxPhStr);

        let change = 0;
        let phChange = (Math.random() * 0.2) - 0.1;
        let dosageChange = hardware.fertilizer ? (Math.random() * 2) : -(Math.random() * 1);
        let consumptionChange = hardware.pump ? (Math.random() * 10) : (Math.random() * 2);
        let ventState = hardware.vent ? 1 : 0;

        if (activeSector.isAuto) {
          if (lastVal < cropMin) {
            change = 4;
            setHardware((h) => ({ ...h, pump: true }));
          } else {
            change = Math.random() * 4 - 2;
            setHardware((h) => ({ ...h, pump: false }));
          }
          // Auto vent based on temp (simulated via moisture inversely)
          if (lastVal > cropMin + 15) {
             setHardware((h) => ({ ...h, vent: true }));
             ventState = 1;
          } else {
             setHardware((h) => ({ ...h, vent: false }));
             ventState = 0;
          }
          // Auto fertilizer if dosage drops
          if (lastDosage < 15) {
             setHardware((h) => ({ ...h, fertilizer: true }));
          } else if (lastDosage > 30) {
             setHardware((h) => ({ ...h, fertilizer: false }));
          }
          // Auto pH modifier
          if (lastPh < minPh || lastPh > maxPh) {
             setHardware((h) => ({ ...h, ph: true }));
             phChange = lastPh < minPh ? 0.2 : -0.2;
          } else {
             setHardware((h) => ({ ...h, ph: false }));
          }
        } else {
          if (hardware.pump) change = 5;
          else change = Math.random() * 4 - 2.5;
          if (hardware.fertilizer) phChange += 0.05; // Fertilizer makes soil slightly basic or acidic
          if (hardware.vent) change -= 1; // Venting dries out slightly
          if (hardware.ph) {
             // If manual pH mod is ON, try to correct the pH based on the optimal range
             if (lastPh > maxPh) phChange = -0.3;
             else if (lastPh < minPh) phChange = 0.3;
             else phChange = lastPh > 7 ? -0.2 : 0.2; // Default correction
          }
        }

        const newVal = Math.round(Math.max(10, Math.min(95, lastVal + change)));
        const newPh = Math.round(Math.max(4.0, Math.min(9.0, lastPh + phChange)) * 10) / 10;
        const newDosage = Math.round(Math.max(0, lastDosage + dosageChange));
        const newConsumption = Math.round(lastConsumption + consumptionChange);

        const nextData = [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            moisture: newVal,
            ph: newPh,
            dosage: newDosage,
            consumption: newConsumption,
            ventState,
          },
        ];
        return nextData.length > 12 ? nextData.slice(1) : nextData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSector.isAuto, activeSector.crop, hardware.pump, hardware.fertilizer, hardware.vent, hardware.ph]);

  const currentMoisture = data[data.length - 1]?.moisture || 0;
  const currentPh = data[data.length - 1]?.ph || 7.0;
  const currentDosage = data[data.length - 1]?.dosage || 0;
  const crop = cropsData[activeSector.crop];
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

  const isLocked = user?.role === "FARMER" && user?.status !== "approved";

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
    const isPendingSecondApproval = user?.status === "pending_second_approval";
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/30 dark:bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl bg-surface-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border-default dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center relative z-10"
        >
          <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl mx-auto mb-8 shadow-lg shadow-indigo-500/20">
            {isPendingSecondApproval ? "📡" : "🔒"}
          </div>

          <h2 className="text-3xl font-black text-text-main dark:text-white tracking-tight mb-3">
            {isPendingSecondApproval ? "Sensor Pending Approval" : "Dashboard Locked"}
          </h2>

          <p className="text-text-subtle dark:text-text-disabled text-sm font-medium leading-relaxed mb-8">
            {isPendingSecondApproval 
              ? `Your Sensor ID (${user?.FarmerProfile?.sensorId || "submitted"}) is currently pending review by our administrator. Telemetry data will unlock once verified.`
              : "Please submit your sensor ID to unlock dashboard access"}
          </p>

          {!isPendingSecondApproval ? (
            <form onSubmit={handleSensorSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-black text-text-disabled uppercase tracking-widest block mb-2">Smart Sensor ID</label>
                <input 
                  type="text"
                  placeholder="e.g. ZAR3A-SENS-XXXX"
                  value={sensorInput}
                  onChange={(e) => setSensorInput(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 bg-surface-secondary/30 dark:bg-slate-950/50 dark:text-white border-border-default dark:border-slate-800 focus:border-indigo-500 outline-none font-mono font-bold transition-all shadow-inner"
                  disabled={isSubmitting}
                />
              </div>
              {submitError && (
                <p className="text-xs text-red-500 font-semibold">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition active:scale-98 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Sensor ID"}
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl text-xs uppercase tracking-widest">
              Status: Waiting for verification
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border-default dark:border-slate-800 flex justify-center gap-4">
            <Link to="/marketplace" className="text-xs font-black text-primary-base hover:underline uppercase tracking-wider">
              Browse Marketplace
            </Link>
            <span className="text-text-disabled">•</span>
            <Link to="/profile" className="text-xs font-black text-text-muted hover:underline uppercase tracking-wider">
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

      {/* Top Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-surface-card dark:bg-slate-900 p-4 rounded-[2.5rem] shadow-sm border border-border-default dark:border-slate-800 gap-4">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-2">
          {sectors.map((sector) => (
            <button
              key={sector.id}
              onClick={() => setActiveSectorId(sector.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-3xl font-bold text-sm transition-all whitespace-nowrap ${activeSectorId === sector.id ? "bg-primary-base text-white shadow-lg shadow-green-200 dark:shadow-none" : "bg-surface-secondary dark:bg-slate-800 text-text-muted hover:bg-surface-secondary"}`}
            >
              <LuLayoutGrid /> {
                sector.name.includes("Greenhouse") ? `${t("dash.sector")} A: ${t("dash.greenhouse")}` :
                sector.name.includes("Open Field") ? `${t("dash.sector")} B: ${t("dash.openField")}` :
                sector.name.includes("Nile Basin") ? `${t("dash.sector")} C: ${t("dash.nileBasin")}` :
                sector.name.includes("Delta Orchard") ? `${t("dash.sector")} D: ${t("dash.deltaOrchard")}` :
                sector.name
              }
            </button>
          ))}
          {user?.role === "FARMER" && (
            <button
              onClick={() => setIsAddSensorOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-3xl font-bold text-sm bg-primary-light text-emerald-700 hover:bg-emerald-100 dark:bg-slate-800 dark:text-emerald-400 border-2 border-dashed border-emerald-300 transition-all whitespace-nowrap"
            >
              <LuPlus /> {t("dash.addSector") || "Add Sector"}
            </button>
          )}
        </div>
        <button
          onClick={() => setIsLogOpen(true)}
          className="relative p-4 bg-surface-secondary dark:bg-slate-800 hover:text-primary-base rounded-full transition-colors hidden md:block"
        >
          <LuBell size={20} className="dark:text-white" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      </div>

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
                  {cropsData[activeSector.crop].plantingDates}
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
                  {cropsData[activeSector.crop].whyPlanted}
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
                  {cropsData[activeSector.crop].tools?.join(", ") || "None specified"}
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
                  {cropsData[activeSector.crop].nutrients}
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
                  {cropsData[activeSector.crop].irrigation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 NEW: PREMIUM WEATHER CARD 🌟 */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
          <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 text-slate-900 dark:text-white flex flex-col shadow-2xl h-full border border-slate-200 dark:border-white/10 group">
            
            {/* Dynamic Animated Background Gradients */}
            <div className="absolute top-0 right-0 w-[120%] h-[120%] bg-linear-to-br from-indigo-300/40 dark:from-indigo-500/40 via-purple-300/20 dark:via-purple-500/20 to-transparent blur-[80px] -translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform duration-1000 ease-out"></div>
            <div className="absolute bottom-0 left-0 w-[100%] h-[100%] bg-linear-to-tr from-cyan-300/30 dark:from-cyan-500/30 to-transparent blur-[60px] translate-y-1/4 -translate-x-1/4 group-hover:scale-110 transition-transform duration-1000 ease-out"></div>

            {/* Top Row: Label & Spinner */}
            <div className="relative z-10 flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 dark:border-white/10 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)] dark:shadow-[0_0_10px_rgba(74,222,128,1)]"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white/90">
                  {t("dash.liveClimate")}
                </p>
              </div>
              {isWeatherLoading && (
                <div className="w-5 h-5 border-2 border-slate-300 dark:border-white/30 border-t-slate-800 dark:border-t-white rounded-full animate-spin"></div>
              )}
            </div>

            {/* Middle Row: Big Temp, Icon & Live Clock Combined */}
            <div className="relative z-10 flex flex-col justify-center mb-auto pt-2">
              
              {/* Temperature & Weather Condition */}
              <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                {/* Temperature */}
                <div className="flex items-start">
                  <h4 className="text-[7rem] lg:text-[8rem] font-black tracking-tighter leading-none drop-shadow-xl dark:drop-shadow-2xl text-slate-900 dark:text-white">
                    {weather.temp}
                  </h4>
                  <span className="text-4xl lg:text-5xl font-black text-slate-400 dark:text-white/60 mt-3 ml-2">°C</span>
                </div>

                {/* Weather Condition */}
                <div className="flex items-center gap-3">
                  <LuCloudSun className="text-4xl text-yellow-500 dark:text-yellow-300 drop-shadow-md" />
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50 mb-0.5">Current Weather</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-[0.1em] drop-shadow-sm leading-none">
                      {t("weather." + weather.condition) || weather.condition}
                    </p>
                  </div>
                </div>
              </div>

              {/* Extended Data & Clock Row */}
              <div className="flex flex-wrap items-center gap-6 mt-4 pl-2">
                
                {/* Time & Date */}
                <div className="flex items-center gap-3">
                  <LuClock className="text-indigo-600 dark:text-indigo-400 drop-shadow-sm" size={24} />
                  <div className="flex flex-col justify-center">
                    <LiveClock format="time" className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none drop-shadow-sm" />
                    <div className="flex gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300 mt-1.5">
                      <LiveClock format="weekday" />
                      <span className="text-slate-400 dark:text-white/30">•</span>
                      <LiveClock format="date" />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-slate-300 dark:bg-white/20 hidden sm:block"></div>

                {/* Actual Weather Metrics */}
                <div className="flex items-center gap-5 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl px-4 py-2 shadow-sm">
                  
                  {/* High/Low */}
                  <div className="flex flex-col items-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50 mb-0.5">H / L</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white">
                      {weather.tempMax}° <span className="text-slate-400 dark:text-white/40 font-bold">/</span> {weather.tempMin}°
                    </p>
                  </div>

                  <div className="w-px h-6 bg-slate-300 dark:bg-white/10"></div>

                  {/* Humidity */}
                  <div className="flex flex-col items-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50 mb-0.5">Humidity</p>
                    <div className="flex items-center gap-1 text-sm font-black text-blue-600 dark:text-blue-400">
                      <LuDroplet size={12} />
                      {weather.humidity}%
                    </div>
                  </div>

                  <div className="w-px h-6 bg-slate-300 dark:bg-white/10"></div>

                  {/* Wind */}
                  <div className="flex flex-col items-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50 mb-0.5">Wind</p>
                    <div className="flex items-center gap-1 text-sm font-black text-teal-600 dark:text-teal-400">
                      <LuWind size={12} />
                      {weather.windspeed} <span className="text-[10px]">km/h</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* AI Suggestion Banner (Takes up the empty space) */}
            <div className="relative z-10 w-full mt-12 mb-6">
              <div 
                className="group/banner w-full bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/40 transition-all cursor-pointer border border-white/60 dark:border-white/10 rounded-[2rem] p-6 backdrop-blur-xl flex flex-row items-center justify-between shadow-xl"
                onClick={() => setSelectedAiCrop(weather.bestCrop)}
              >
                 <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">
                          ✨ {t("dash.aiSuggested")}
                       </span>
                    </div>
                    <span className="text-4xl font-black text-slate-900 dark:text-white drop-shadow-sm tracking-tight mb-1">
                      {t("crop." + weather.bestCrop) || weather.bestCrop}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Maximum yield probability
                    </span>
                 </div>
                 
                 <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white/80 dark:border-white/10 group-hover/banner:scale-110 group-hover/banner:-rotate-12 transition-transform duration-500">
                    {cropsData[weather.bestCrop]?.icon}
                 </div>
              </div>
            </div>

            {/* Bottom Row: Location */}
            <div className="relative z-10 pt-4 border-t border-slate-300/50 dark:border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-1.5">
                  {t("dash.region")}
                </p>
                <div className="flex items-center gap-1.5">
                  <LuMapPin className="text-cyan-600 dark:text-cyan-400" size={16} />
                  <p className="font-bold text-base text-slate-800 dark:text-white tracking-tight drop-shadow-sm">
                    {t("reg." + weather.region) || weather.region}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <AnimatePresence>
        {isLogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface-card dark:bg-slate-900 shadow-2xl z-[100] p-6 overflow-y-auto border-l border-border-default dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-border-default dark:border-slate-800">
                <h2 className="text-2xl font-black dark:text-white flex items-center gap-2">
                  <LuBell className="text-primary-base" /> {t("dash.systemLogs")}
                </h2>
                <button
                  onClick={() => setIsLogOpen(false)}
                  className="p-2 bg-surface-secondary dark:bg-slate-800 rounded-full hover:text-red-500"
                >
                  <LuX size={20} />
                </button>
              </div>
              <div className="space-y-4">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="p-4 bg-surface-secondary dark:bg-slate-800/50 rounded-2xl flex gap-4 items-start border border-border-default dark:border-slate-700/50"
                  >
                    <div
                      className={`p-2 rounded-full mt-1 ${log.type === "action" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-primary-base"}`}
                    >
                      {log.type === "action" ? (
                        <LuSettings2 size={14} />
                      ) : (
                        <LuInfo size={14} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white leading-tight mb-1">
                        {(() => {
                          let translatedMsg = log.msg;
                          if (log.msg === "System Booted Successfully") {
                            translatedMsg = t("log.boot");
                          } else if (log.msg === "Mode changed") {
                            translatedMsg = t("log.mode");
                          } else if (log.msg.startsWith("[MANUAL]")) {
                            const device = log.msg.split(" ")[1];
                            const action = log.msg.includes("ON") ? t("log.manualOn") : t("log.manualOff");
                            const transDevice = device === "PUMP" ? t("dash.pump") : device === "VENT" ? t("dash.vent") : t("dash.fertilizer");
                            translatedMsg = `[${t("dash.manual")}] ${transDevice} ${action}`;
                          }
                          return translatedMsg;
                        })()}
                      </p>
                      <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest">
                        {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-[100px]">
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
                className="relative w-full max-w-md bg-surface-card/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto text-left max-h-[calc(100vh-120px)] custom-scrollbar"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-400 via-green-500 to-lime-400" />
                
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-text-main dark:text-white uppercase tracking-tight">
                    {t("dash.addSector") || "Add Sector"}
                  </h3>
                  <button
                    onClick={() => setIsAddSensorOpen(false)}
                    className="p-2.5 bg-surface-secondary dark:bg-slate-800 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <LuX size={20} />
                  </button>
                </div>

                {addSensorError && (
                  <div className="flex items-center gap-3 p-4 mb-6 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl">
                    <LuInfo className="shrink-0" size={18} /> {addSensorError}
                  </div>
                )}

                <form onSubmit={handleAddSensorSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-text-muted dark:text-text-disabled uppercase tracking-widest ms-2">
                      {t("profile.sensorId") || "Sensor ID"}
                    </label>
                    <input
                      type="text"
                      required
                      value={newSensorForm.sensorId}
                      onChange={(e) => setNewSensorForm({ ...newSensorForm, sensorId: e.target.value })}
                      placeholder="e.g. SN-89210-A"
                      className="w-full px-5 py-4 rounded-2xl border-2 bg-surface-secondary/50 dark:bg-slate-800/80 dark:text-white border-border-default dark:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-text-muted dark:text-text-disabled uppercase tracking-widest ms-2">
                      {t("dash.sectorName") || "Sector Name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={newSensorForm.sectorName}
                      onChange={(e) => setNewSensorForm({ ...newSensorForm, sectorName: e.target.value })}
                      placeholder="e.g. Sector E: North Field"
                      className="w-full px-5 py-4 rounded-2xl border-2 bg-surface-secondary/50 dark:bg-slate-800/80 dark:text-white border-border-default dark:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-text-muted dark:text-text-disabled uppercase tracking-widest ms-2">
                      {t("dash.zoneLocation") || "Location"}
                    </label>
                    <select
                      value={newSensorForm.location}
                      onChange={(e) => setNewSensorForm({ ...newSensorForm, location: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border-2 bg-surface-secondary/50 dark:bg-slate-800/80 dark:text-white border-border-default dark:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold appearance-none"
                    >
                      {Object.keys(locationDB).map((loc) => (
                        <option key={loc} value={loc} className="dark:bg-slate-900">
                          {t("loc." + loc) || loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-text-muted dark:text-text-disabled uppercase tracking-widest ms-2">
                      {t("dash.crop") || "Crop"}
                    </label>
                    <select
                      value={newSensorForm.crop}
                      onChange={(e) => setNewSensorForm({ ...newSensorForm, crop: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border-2 bg-surface-secondary/50 dark:bg-slate-800/80 dark:text-white border-border-default dark:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-semibold appearance-none"
                    >
                      {Object.keys(cropsData).map((c) => (
                        <option key={c} value={c} className="dark:bg-slate-900">
                          {cropsData[c].icon} {t("crop." + c) || c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-base hover:bg-primary-hover text-white py-4.5 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all mt-6 flex items-center justify-center gap-2"
                  >
                    {t("common.add") || "Add"}
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
                      <LuActivity /> Why AI Chose This
                    </h4>
                    <p className="text-sm text-text-main dark:text-slate-200 leading-relaxed font-bold">
                      Based on real-time soil moisture sensors and current regional weather patterns, <span className="text-blue-600 dark:text-blue-400">{t("crop." + selectedAiCrop) || selectedAiCrop}</span> offers the highest yield and profitability for your exact location today!
                    </p>
                  </div>

                  {/* Style 2: Quick Facts Card */}
                  <div className="bg-surface-secondary dark:bg-slate-800 p-4 rounded-2xl border border-border-default dark:border-slate-700 shadow-inner">
                    <h4 className="text-[10px] font-black text-text-muted dark:text-slate-400 uppercase tracking-widest mb-3">
                      Quick Facts
                    </h4>
                    <ul className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-bold text-text-main dark:text-slate-200">
                      <li className="flex items-center gap-1.5">🌱 <span className="text-text-muted">Duration:</span> <span className="truncate">{cropsData[selectedAiCrop]?.duration}</span></li>
                      <li className="flex items-center gap-1.5">☀️ <span className="text-text-muted">Sunlight:</span> <span className="truncate">{cropsData[selectedAiCrop]?.sunlight}</span></li>
                      <li className="flex items-center gap-1.5">💧 <span className="text-text-muted">Watering:</span> <span className="truncate">{cropsData[selectedAiCrop]?.irrigation?.split(' ')[0]}</span></li>
                      <li className="flex items-center gap-1.5">💪 <span className="text-text-muted">Difficulty:</span> <span className="truncate">{cropsData[selectedAiCrop]?.difficulty}</span></li>
                    </ul>
                  </div>

                  {/* Tools & Fertilizers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <LuSettings2 size={12} /> Tools Needed
                      </h4>
                      <ul className="list-disc list-inside text-xs font-bold text-text-main dark:text-slate-300 space-y-1">
                        {cropsData[selectedAiCrop]?.tools.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <LuFlaskConical size={12} /> Fertilizers
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
                      Plant seeds now & track growth!
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
