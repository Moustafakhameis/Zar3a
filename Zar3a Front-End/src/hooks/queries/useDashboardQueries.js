import { useState, useEffect, useMemo } from 'react';
import { useGetFarms, useCreateFarm, useDeleteFarm, useCreateSector, useDeleteSector } from './useFarmQueries';
import { useWeather } from '../../hooks/api/useWeather';
import { getCropsData } from '../../pages/Dashboard/constants/crops';
import { locationDB } from '../../pages/Dashboard/constants/locations';
import { toast } from 'sonner';
import { useAlerts } from './useAlerts';

export const useDashboardQueries = (user, isArabic) => {
  // Queries
  const { data: dbFarms, isLoading: isLoadingFarms } = useGetFarms();
  const createFarmMutation = useCreateFarm();
  const deleteFarmMutation = useDeleteFarm();
  const createSectorMutation = useCreateSector();
  const deleteSectorMutation = useDeleteSector();

  const farmsList = dbFarms || [];
  const cropsData = getCropsData(isArabic);

  // States
  const [localSectorOverrides, setLocalSectorOverrides] = useState({});
  const [activeFarmName, setActiveFarmName] = useState("");
  const [activeSectorId, setActiveSectorId] = useState(null);

  const [hardware, setHardware] = useState({
    pump: false,
    vent: false,
    fertilizer: false,
    ph: false,
  });

  const {
    alerts,
    addAlert,
    markAsRead,
    markAllAsRead,
    archiveAlert,
    unarchiveAlert,
    unreadCount,
  } = useAlerts();

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

  // Derived state
  const sectors = useMemo(() => {
    const allSectors = [];
    farmsList.forEach(farm => {
      if (farm.Sectors) {
        farm.Sectors.forEach(sector => {
          allSectors.push({
            ...sector,
            farmName: farm.name,
            ...(localSectorOverrides[sector.id] || {})
          });
        });
      }
    });
    allSectors.sort((a, b) => a.name.localeCompare(b.name));
    return allSectors;
  }, [farmsList, localSectorOverrides]);

  useEffect(() => {
    if (farmsList.length > 0 && !activeFarmName) {
      setActiveFarmName(farmsList[0].name);
      if (farmsList[0].Sectors && farmsList[0].Sectors.length > 0) {
        setActiveSectorId(farmsList[0].Sectors[0].id);
      }
    }
  }, [farmsList, activeFarmName]);

  const activeSector = sectors.find((s) => s.id === activeSectorId) || sectors[0] || { 
    crop: "Tomato", 
    isAuto: true, 
    location: "", 
    id: null, 
    name: "No Sector", 
    farmName: "No Farm" 
  };

  const { data: weatherData, isLoading: isWeatherLoading, isError: isWeatherError } = useWeather(activeSector.location);

  const weather = weatherData || {
    temp: "--",
    tempMax: "--",
    tempMin: "--",
    humidity: "--",
    windspeed: "--",
    condition: isWeatherError ? "Offline" : "Loading...",
    bestCrop: locationDB[activeSector.location]?.bestCrop || "Tomato",
    region: locationDB[activeSector.location]?.region || "Egypt",
  };

  const isLocked = user?.role !== 'ADMIN' && (user?.status === "pending" || user?.status === "pending_sensor");

  const addLog = (msg, type) => {
    // Map legacy addLog calls to addAlert
    let category = "Information";
    let title = "System Notification";
    if (type === "action") category = "Resolved"; // Manual action
    if (msg.toLowerCase().includes("critical") || msg.toLowerCase().includes("error")) category = "Critical";
    addAlert(category, title, msg);
  };

  const updateActiveSector = (updates) => {
    if (!activeSectorId) return;
    setLocalSectorOverrides(prev => ({
      ...prev,
      [activeSectorId]: {
        ...(prev[activeSectorId] || {}),
        ...updates
      }
    }));
  };

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

  const toggleHardware = (device) => {
    if (isLocked) {
      toast.error("Hardware controls are disabled in Read-Only mode. Please wait for sensor approval.");
      return;
    }
    if (activeSector.isAuto) return;
    const newState = !hardware[device];
    setHardware((prev) => ({ ...prev, [device]: newState }));
    addLog(`[MANUAL] ${device.toUpperCase()} turned ${newState ? "ON" : "OFF"}`, "action");
  };

  // Real-time telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const lastVal = prev[prev.length - 1]?.moisture || 50;
        const lastPh = prev[prev.length - 1]?.ph || 6.5;
        const lastDosage = prev[prev.length - 1]?.dosage || 20;
        const lastConsumption = prev[prev.length - 1]?.consumption || 150;

        const safeCropInfo = cropsData[activeSector?.crop] || cropsData["Tomato"];
        const cropMin = safeCropInfo.min;
        const [minPhStr, maxPhStr] = safeCropInfo.soilPh.split(" - ");
        const minPh = parseFloat(minPhStr);
        const maxPh = parseFloat(maxPhStr);

        let change = 0;
        let phChange = (Math.random() * 0.2) - 0.1;
        let dosageChange = hardware.fertilizer ? (Math.random() * 2) : -(Math.random() * 1);
        let consumptionChange = hardware.pump ? (Math.random() * 10) : (Math.random() * 2);
        let ventState = hardware.vent ? 1 : 0;

        if (activeSector.isAuto) {
          if (lastVal < cropMin) {
            if (change !== 4) addAlert("Critical", "Soil Moisture Below Safe Range", `Sector moisture dropped below ${cropMin}%. Auto-irrigating.`);
            change = 4;
            setHardware((h) => ({ ...h, pump: true }));
          } else {
            change = Math.random() * 4 - 2;
            if (hardware.pump && lastVal >= cropMin) addAlert("Resolved", "Irrigation Restored", "Moisture levels have reached safe zones.");
            setHardware((h) => ({ ...h, pump: false }));
          }
          if (lastVal > cropMin + 15) {
             setHardware((h) => ({ ...h, vent: true }));
             ventState = 1;
          } else {
             setHardware((h) => ({ ...h, vent: false }));
             ventState = 0;
          }
          if (lastDosage < 15) {
             setHardware((h) => ({ ...h, fertilizer: true }));
          } else if (lastDosage > 30) {
             setHardware((h) => ({ ...h, fertilizer: false }));
          }
          if (lastPh < minPh || lastPh > maxPh) {
             if (!hardware.ph) addAlert("Warning", "pH Approaching Threshold", `Soil pH is outside the safe range of ${minPh}-${maxPh}. Correcting.`);
             setHardware((h) => ({ ...h, ph: true }));
             phChange = lastPh < minPh ? 0.2 : -0.2;
          } else {
             setHardware((h) => ({ ...h, ph: false }));
          }
        } else {
          if (hardware.pump) change = 5;
          else change = Math.random() * 4 - 2.5;
          if (hardware.fertilizer) phChange += 0.05;
          if (hardware.vent) change -= 1;
          if (hardware.ph) {
             if (lastPh > maxPh) phChange = -0.3;
             else if (lastPh < minPh) phChange = 0.3;
             else phChange = lastPh > 7 ? -0.2 : 0.2;
          }
        }

        const newVal = Math.round(Math.max(10, Math.min(95, lastVal + change)));
        const newPh = Math.round(Math.max(4.0, Math.min(9.0, lastPh + phChange)) * 10) / 10;
        const newDosage = Math.round(Math.max(0, lastDosage + dosageChange));
        const newConsumption = Math.round(lastConsumption + consumptionChange);

        const nextData = [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            moisture: newVal,
            ph: newPh,
            dosage: newDosage,
            consumption: newConsumption,
            ventState: ventState,
          },
        ];
        if (nextData.length > 20) return nextData.slice(nextData.length - 20);
        return nextData;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [hardware, activeSector, cropsData]);

  return {
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
  };
};
