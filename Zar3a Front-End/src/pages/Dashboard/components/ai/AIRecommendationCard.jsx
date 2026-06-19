import React from 'react';
import { motion } from 'framer-motion';
import { 
  LuDroplets, 
  LuThermometerSun, 
  LuZap, 
  LuCircleCheck,
  LuInfo
} from 'react-icons/lu';

const AIRecommendationCard = ({ data, index }) => {
  const { title, riskLevel, confidence, recommendation, expectedImpact, predictedIssue, iconType } = data;

  let Icon = LuCircleCheck;
  let iconBg = "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
  let badgeColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400";
  let borderGlow = "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-emerald-500/30";

  let pulseColor = "bg-emerald-500";

  // Customize based on iconType / riskLevel
  if (riskLevel === "High") {
    badgeColor = "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400";
    borderGlow = "hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:border-red-500/30";
    pulseColor = "bg-red-500";
  } else if (riskLevel === "Medium") {
    badgeColor = "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400";
    borderGlow = "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-500/30";
    pulseColor = "bg-amber-500";
  }

  if (iconType === "moisture_low" || iconType === "moisture_high") {
    Icon = LuDroplets;
    iconBg = riskLevel === "High" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
  } else if (iconType === "ph") {
    Icon = LuThermometerSun;
    iconBg = "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
  } else if (iconType === "energy") {
    Icon = LuZap;
    iconBg = "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
  } else if (riskLevel !== "None") {
    Icon = LuInfo;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`bg-surface-card dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 border border-white/40 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 ${borderGlow} cursor-default`}
    >
      <div className="flex flex-col md:flex-row gap-5">
        
        {/* Left Icon Area */}
        <div className="flex-shrink-0 flex justify-between md:justify-start">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: index * 0.05 + 0.1 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 dark:border-slate-600/50 ${iconBg} shadow-sm`}
          >
            <Icon size={24} />
          </motion.div>
          {/* Mobile badges (shown only on small screens next to icon) */}
          <div className="flex md:hidden items-center gap-2">
            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${badgeColor}`}>
              {riskLevel !== "None" ? `${riskLevel} RISK` : "OPTIMAL"}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-lg font-bold text-text-main dark:text-white mb-1 leading-tight">
                {title}
              </h4>
              {predictedIssue !== "None detected." && (
                <p className="text-sm font-medium text-text-muted dark:text-gray-400">
                  Predicted: <span className="text-text-main dark:text-gray-300">{predictedIssue}</span>
                </p>
              )}
            </div>
            
            {/* Desktop badges */}
            <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
              <span className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl ${badgeColor} shadow-sm`}>
                {riskLevel !== "None" ? `${riskLevel} RISK` : "OPTIMAL"}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted">
                <span className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse`} />
                {confidence}% Confidence
              </div>
            </div>
          </div>

          {/* Actionable Advice Box */}
          <div className="mt-4 relative pl-5 py-2">
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '100%', opacity: 1 }}
              transition={{ duration: 0.25, delay: index * 0.05 + 0.15, ease: "easeOut" }}
              className={`absolute left-0 top-0 w-1.5 rounded-full bg-gradient-to-b from-primary-base to-emerald-400 dark:to-emerald-500`} 
            />
            <div className="flex items-start gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-text-muted dark:text-gray-400 mb-2">
                  AI Recommendation
                </p>
                <p className="text-base font-bold text-text-main dark:text-white mb-3 leading-snug">
                  {recommendation}
                </p>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: index * 0.05 + 0.2 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase tracking-widest shadow-sm"
                >
                  <LuCircleCheck size={14} />
                  Impact: {expectedImpact}
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Mobile confidence (since desktop is hidden) */}
          <div className="flex md:hidden items-center gap-1.5 text-xs font-bold text-text-muted mt-4">
            <span className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse`} />
            {confidence}% Confidence
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(AIRecommendationCard);
