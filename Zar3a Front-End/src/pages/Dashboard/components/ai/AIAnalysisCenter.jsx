import React from 'react';
import { motion } from 'framer-motion';
import { LuSparkles, LuRefreshCw, LuTrendingUp, LuCalendar, LuActivity } from 'react-icons/lu';
import { useAIAnalysis } from '../../../../hooks/useAIAnalysis';
import AISkeleton from './AISkeleton';
import AIHealthSummary from './AIHealthSummary';
import AIRecommendationCard from './AIRecommendationCard';

const AIAnalysisCenter = ({ activeSector, hardware, weather, data }) => {
  const isManualMode = !activeSector?.isAuto;

  // We feed current state into our AI hook to get contextual recommendations
  const telemetryContext = {
    cropType: activeSector?.crop || 'Unknown',
    hardware,
    weather,
  };

  const { analysisData, isLoading, error } = useAIAnalysis(telemetryContext, data, isManualMode);

  if (isLoading || !analysisData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full min-h-[600px] p-6"
      >
        <AISkeleton />
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-text-muted">
        <p className="font-bold text-lg mb-2">Analysis Failed</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const { assessment, healthScore, recommendations, metrics, executiveSummary } = analysisData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6 relative">
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 dark:border-indigo-400/30 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-400">Live Engine Active</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-text-main dark:text-white flex items-center gap-3 tracking-tight"
          >
            AI Agriculture Center
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted dark:text-gray-400 font-medium mt-3 max-w-xl text-sm md:text-base leading-relaxed"
          >
            Enterprise-grade predictive analytics and real-time recommendations for <span className="text-text-main dark:text-gray-200 font-bold">{activeSector?.location || 'Unknown'}</span>.
          </motion.p>
        </div>
      </div>

      {/* Executive Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10 relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-emerald-500/10 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl -z-10" />
        <div className="bg-surface-card dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
            <LuSparkles size={120} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <LuSparkles size={24} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">Executive Summary</h3>
              <p className="text-lg md:text-xl text-text-main dark:text-gray-200 font-bold leading-relaxed">
                "{executiveSummary}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Resource Efficiency", value: `${metrics.resourceEfficiency}%`, icon: LuActivity, color: "blue" },
          { label: "Yield Trend", value: metrics.yieldTrend, icon: LuTrendingUp, color: "emerald" },
          { label: "Harvest Window", value: metrics.harvestWindow, icon: LuCalendar, color: "amber" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const colorStyles = {
            blue: "from-blue-500/20 to-transparent text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30",
            emerald: "from-emerald-500/20 to-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30",
            amber: "from-amber-500/20 to-transparent text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30"
          }[stat.color];

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1, type: "spring" }}
              className="bg-surface-card dark:bg-slate-800/40 rounded-3xl p-5 border border-gray-100 dark:border-slate-700/50 flex items-center gap-5 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300 group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${colorStyles} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 bg-white dark:bg-slate-900 ${colorStyles}`}>
                <Icon size={24} />
              </div>
              <div className="relative z-10">
                <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Health Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <AIHealthSummary healthScore={healthScore} assessment={assessment} />
            
            <div className="mt-6 bg-surface-card dark:bg-slate-800/50 backdrop-blur-sm border border-gray-100 dark:border-white/5 shadow-sm rounded-3xl p-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                <LuRefreshCw className="animate-spin-slow" />
                Continuous Analysis
              </h4>
              <p className="text-sm font-medium text-text-muted dark:text-gray-400 leading-relaxed">
                The Zar3a AI Engine constantly monitors 14+ data points including soil telemetry, localized weather forecasts, and historical yield models to provide these insights.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations Feed */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-text-main dark:text-white">Active Recommendations</h3>
            <span className="text-sm font-bold text-text-muted bg-surface-card dark:bg-slate-800 px-3 py-1 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
              {recommendations.length} Items
            </span>
          </div>
          
          {recommendations.map((rec, index) => (
            <AIRecommendationCard key={rec.id} data={rec} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(AIAnalysisCenter);
