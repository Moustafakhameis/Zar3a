import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuWifi, 
  LuBattery, 
  LuBatteryFull,
  LuBatteryLow,
  LuBatteryWarning,
  LuActivity, 
  LuServer, 
  LuSettings2,
  LuTriangleAlert,
  LuCircleCheck,
  LuClock,
  LuX,
  LuCpu
} from 'react-icons/lu';
import { createPortal } from 'react-dom';

// Utility for Battery Icon
const getBatteryIcon = (percent) => {
  if (percent > 80) return <LuBatteryFull className="text-emerald-500" />;
  if (percent > 30) return <LuBattery className="text-emerald-400" />;
  if (percent > 15) return <LuBatteryLow className="text-yellow-500" />;
  return <LuBatteryWarning className="text-red-500 animate-pulse" />;
};

// Utility for Status
const getStatusConfig = (status) => {
  switch(status) {
    case 'Online': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <LuCircleCheck /> };
    case 'Warning': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <LuTriangleAlert /> };
    case 'Maintenance': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <LuSettings2 /> };
    case 'Offline': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <LuX /> };
    default: return { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: <LuServer /> };
  }
};

const SensorDetailsPanel = ({ sensor, onClose }) => {
  if (!sensor) return null;

  const statusCfg = getStatusConfig(sensor.status);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9990]"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-card dark:bg-slate-900 shadow-2xl z-[9999] overflow-y-auto border-l border-border-default dark:border-slate-800 flex flex-col"
      >
        <div className="p-6 border-b border-border-default dark:border-slate-800 bg-surface-secondary/50 dark:bg-slate-900/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${statusCfg.bg} ${statusCfg.color} border ${statusCfg.border}`}>
              <LuCpu size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-text-main dark:text-white tracking-tight leading-none mb-1">
                {sensor.sensorId}
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span className={statusCfg.color}>{sensor.status}</span>
                <span className="text-text-disabled">•</span>
                <span className="text-text-muted dark:text-slate-400">{sensor.sectorName}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-surface-card dark:bg-slate-800 rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/20 transition-all border border-border-default dark:border-slate-700"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Health Diagnostics Grid */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted dark:text-slate-400 mb-4 flex items-center gap-2">
              <LuActivity /> Realtime Diagnostics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-secondary/50 dark:bg-slate-800/50 p-4 rounded-3xl border border-border-default/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-text-muted dark:text-slate-400 mb-2">
                  <LuBattery size={16} /> <span className="text-[10px] font-bold uppercase">Battery Life</span>
                </div>
                <p className="text-2xl font-black dark:text-white flex items-end gap-1">
                  {sensor.battery}% <span className="text-sm font-medium text-text-disabled mb-1">/ 100</span>
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className={`h-full rounded-full ${sensor.battery > 20 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${sensor.battery}%` }}></div>
                </div>
              </div>

              <div className="bg-surface-secondary/50 dark:bg-slate-800/50 p-4 rounded-3xl border border-border-default/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-text-muted dark:text-slate-400 mb-2">
                  <LuWifi size={16} /> <span className="text-[10px] font-bold uppercase">Signal Strength</span>
                </div>
                <p className="text-2xl font-black dark:text-white flex items-end gap-1">
                  {sensor.signal}% <span className="text-sm font-medium text-text-disabled mb-1">/ 100</span>
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${sensor.signal}%` }}></div>
                </div>
              </div>

              <div className="bg-surface-secondary/50 dark:bg-slate-800/50 p-4 rounded-3xl border border-border-default/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-text-muted dark:text-slate-400 mb-2">
                  <LuServer size={16} /> <span className="text-[10px] font-bold uppercase">Network Latency</span>
                </div>
                <p className="text-2xl font-black dark:text-white flex items-end gap-1">
                  {sensor.latency} <span className="text-sm font-medium text-text-disabled mb-1">ms</span>
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className={`h-full rounded-full ${sensor.latency < 50 ? 'bg-emerald-500' : sensor.latency < 100 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min((sensor.latency / 200) * 100, 100)}%` }}></div>
                </div>
              </div>

              <div className="bg-surface-secondary/50 dark:bg-slate-800/50 p-4 rounded-3xl border border-border-default/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-text-muted dark:text-slate-400 mb-2">
                  <LuClock size={16} /> <span className="text-[10px] font-bold uppercase">Uptime</span>
                </div>
                <p className="text-lg font-black dark:text-white leading-tight">
                  99.9%
                </p>
                <p className="text-xs font-bold text-text-disabled mt-1">Since last reboot</p>
              </div>
            </div>
          </section>

          {/* Location & Meta */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted dark:text-slate-400 mb-4">Device Metadata</h3>
            <div className="bg-surface-card dark:bg-slate-900 border border-border-default dark:border-slate-700 rounded-3xl divide-y divide-border-default dark:divide-slate-700">
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-bold text-text-muted dark:text-slate-400">Location</span>
                <span className="text-sm font-black dark:text-white">{sensor.location}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-bold text-text-muted dark:text-slate-400">Monitored Crop</span>
                <span className="text-sm font-black dark:text-white">{sensor.crop}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-bold text-text-muted dark:text-slate-400">Firmware</span>
                <span className="text-sm font-black dark:text-white">v2.4.1-stable</span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted dark:text-slate-400 mb-4">Maintenance Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-surface-secondary dark:bg-slate-800 rounded-2xl hover:bg-primary-light dark:hover:bg-emerald-900/20 transition-colors group">
                <span className="font-bold text-sm text-text-main dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Run Remote Diagnostic</span>
                <LuActivity className="text-text-disabled group-hover:text-emerald-500 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-surface-secondary dark:bg-slate-800 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group">
                <span className="font-bold text-sm text-text-main dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Reboot Sensor Node</span>
                <LuSettings2 className="text-text-disabled group-hover:text-orange-500 transition-colors" />
              </button>
            </div>
          </section>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

const SensorMonitoringCenter = ({ sectors }) => {
  const [telemetry, setTelemetry] = useState({});
  const [selectedSensor, setSelectedSensor] = useState(null);

  // Initialize and simulate real-time telemetry
  useEffect(() => {
    if (!sectors || sectors.length === 0) return;

    // Initial setup
    const initialTelemetry = {};
    sectors.forEach(sector => {
      if (sector.sensorId) {
        initialTelemetry[sector.sensorId] = {
          sensorId: sector.sensorId,
          sectorName: sector.name,
          location: sector.location,
          crop: sector.crop,
          battery: Math.floor(Math.random() * 60) + 40, // 40-100%
          signal: Math.floor(Math.random() * 40) + 60,  // 60-100%
          latency: Math.floor(Math.random() * 30) + 10, // 10-40ms
          status: Math.random() > 0.1 ? 'Online' : 'Warning',
          lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
    });
    setTelemetry(initialTelemetry);

    // Simulation Interval
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newTelemetry = { ...prev };
        Object.keys(newTelemetry).forEach(id => {
          const s = newTelemetry[id];
          
          // Slight fluctuations
          const latencyFluctuation = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const signalFluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
          
          s.latency = Math.max(5, Math.min(200, s.latency + latencyFluctuation));
          s.signal = Math.max(10, Math.min(100, s.signal + signalFluctuation));
          
          // Very rare battery drop (1 in 10 chance per tick)
          if (Math.random() > 0.9) {
            s.battery = Math.max(0, s.battery - 1);
          }

          // Status updates based on health
          if (s.battery < 15 || s.latency > 150 || s.signal < 30) {
             s.status = 'Warning';
          } else if (s.battery === 0) {
             s.status = 'Offline';
          } else {
             s.status = 'Online';
          }

          s.lastSync = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
        return newTelemetry;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [sectors]);

  const sensorArray = Object.values(telemetry);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-main dark:text-white flex items-center gap-2">
            <LuCpu className="text-primary-base" /> Sensor Monitoring Center
          </h2>
          <p className="text-sm font-bold text-text-muted dark:text-slate-400 mt-1">
            Enterprise-grade hardware telemetry and network diagnostics
          </p>
        </div>
        
        <div className="flex items-center gap-5 bg-surface-card/60 dark:bg-slate-900/60 backdrop-blur-md border border-border-default dark:border-slate-800 p-2.5 px-5 rounded-full shadow-lg">
          <div className="flex items-center gap-2.5 pr-4 border-r border-border-default dark:border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{sensorArray.filter(s => s.status === 'Online').length} Online</span>
          </div>
          <div className="flex items-center gap-2.5 pr-4 border-r border-border-default dark:border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{sensorArray.filter(s => s.status === 'Warning').length} Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black dark:text-white">{sensorArray.length}</span>
            <span className="text-[10px] font-black text-text-disabled uppercase tracking-widest">Total</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sensorArray.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-surface-card dark:bg-slate-900 border border-border-default dark:border-slate-800 rounded-[2.5rem] shadow-sm">
            <LuCpu size={48} className="text-text-disabled mb-4" />
            <h3 className="text-lg font-black dark:text-white mb-1">No Sensors Active</h3>
            <p className="text-sm text-text-muted dark:text-slate-400 font-medium">Add a sector to this farm to register and monitor a sensor.</p>
          </div>
        ) : (
          sensorArray.map(sensor => {
            const statusCfg = getStatusConfig(sensor.status);
            return (
              <motion.div
                key={sensor.sensorId}
                layout
                onClick={() => setSelectedSensor(sensor)}
                className="bg-surface-card/80 dark:bg-slate-900/80 backdrop-blur-lg border border-border-default dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group"
              >
                {/* Status Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${statusCfg.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity`}></div>

                <div className="flex justify-between items-start mb-6 relative z-10 gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-lg dark:text-white leading-tight truncate">{sensor.sensorId}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted dark:text-slate-400 mt-1 truncate">{sensor.sectorName}</p>
                  </div>
                  <div className={`shrink-0 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} shadow-sm backdrop-blur-sm`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"></span>
                    {sensor.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
                  <div className="bg-gradient-to-br from-surface-secondary/80 to-transparent dark:from-slate-800/80 dark:to-slate-800/20 rounded-2xl p-3 sm:p-4 border border-border-default/50 dark:border-slate-700/50 group-hover:border-primary-light dark:group-hover:border-emerald-500/30 transition-colors flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-text-muted dark:text-slate-400 mb-1">
                      {getBatteryIcon(sensor.battery)}
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Battery</span>
                    </div>
                    <p className="font-black text-xl lg:text-2xl dark:text-white tracking-tight">{sensor.battery}%</p>
                    <div className="w-full bg-surface-secondary dark:bg-slate-700/50 h-1 mt-1.5 sm:mt-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${sensor.battery}%` }} transition={{ duration: 0.5 }} className={`h-full rounded-full ${sensor.battery > 20 ? 'bg-emerald-500' : 'bg-red-500'}`}></motion.div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-surface-secondary/80 to-transparent dark:from-slate-800/80 dark:to-slate-800/20 rounded-2xl p-3 sm:p-4 border border-border-default/50 dark:border-slate-700/50 group-hover:border-primary-light dark:group-hover:border-emerald-500/30 transition-colors flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-text-muted dark:text-slate-400 mb-1">
                      <LuWifi size={14} className={sensor.signal > 50 ? 'text-blue-500' : 'text-red-500'} />
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Signal</span>
                    </div>
                    <p className="font-black text-xl lg:text-2xl dark:text-white tracking-tight">{sensor.signal}%</p>
                    <div className="w-full bg-surface-secondary dark:bg-slate-700/50 h-1 mt-1.5 sm:mt-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${sensor.signal}%` }} transition={{ duration: 0.5 }} className={`h-full rounded-full ${sensor.signal > 50 ? 'bg-blue-500' : 'bg-red-500'}`}></motion.div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-surface-secondary/80 to-transparent dark:from-slate-800/80 dark:to-slate-800/20 rounded-2xl p-3 sm:p-4 border border-border-default/50 dark:border-slate-700/50 group-hover:border-primary-light dark:group-hover:border-emerald-500/30 transition-colors flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-text-muted dark:text-slate-400 mb-1">
                      <LuActivity size={14} className={sensor.latency > 100 ? 'text-red-500' : 'text-emerald-500'} />
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Latency</span>
                    </div>
                    <p className="font-black text-lg lg:text-xl dark:text-white tracking-tight">{sensor.latency}ms</p>
                    <div className="w-full bg-surface-secondary dark:bg-slate-700/50 h-1 mt-1.5 sm:mt-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (sensor.latency / 200) * 100)}%` }} transition={{ duration: 0.5 }} className={`h-full rounded-full ${sensor.latency > 100 ? 'bg-red-500' : 'bg-emerald-500'}`}></motion.div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-surface-secondary/80 to-transparent dark:from-slate-800/80 dark:to-slate-800/20 rounded-2xl p-3 sm:p-4 border border-border-default/50 dark:border-slate-700/50 group-hover:border-primary-light dark:group-hover:border-emerald-500/30 transition-colors flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-text-muted dark:text-slate-400 mb-1">
                      <LuClock size={14} className="text-purple-500" />
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Last Sync</span>
                    </div>
                    <p className="font-black text-[13px] sm:text-base lg:text-lg dark:text-white tracking-tighter sm:tracking-tight leading-tight truncate">{sensor.lastSync}</p>
                    <div className="w-full bg-transparent h-1 mt-1.5 sm:mt-2"></div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <SensorDetailsPanel 
        sensor={selectedSensor} 
        onClose={() => setSelectedSensor(null)} 
      />
    </div>
  );
};

export default SensorMonitoringCenter;
