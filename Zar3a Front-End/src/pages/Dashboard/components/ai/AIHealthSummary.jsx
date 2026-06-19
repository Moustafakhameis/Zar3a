import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

const AIHealthSummary = ({ healthScore = 100, assessment = "Excellent" }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const controls = animate(0, healthScore, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (value) => {
        setDisplayScore(Math.round(value));
      }
    });
    return () => controls.stop();
  }, [healthScore]);

  // Determine color based on score
  let strokeColor = "text-emerald-500";
  let bgGradient = "from-emerald-500/20 to-transparent";
  
  if (healthScore < 60) {
    strokeColor = "text-red-500";
    bgGradient = "from-red-500/20 to-transparent";
  } else if (healthScore < 85) {
    strokeColor = "text-amber-500";
    bgGradient = "from-amber-500/20 to-transparent";
  }

  // Calculate SVG circle dash offset for the score (0-100)
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (healthScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface-card dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${bgGradient} opacity-30 blur-3xl`} />

      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-muted dark:text-gray-400 mb-8 z-10">Farm Health Index</h3>

      <div className="relative w-full max-w-56 aspect-square flex items-center justify-center z-10">
        <svg viewBox="0 0 224 224" className="absolute inset-0 w-full h-full transform -rotate-90 overflow-visible">
          {/* Outer dashed boundary */}
          <circle
            cx="112"
            cy="112"
            r={radius + 14}
            strokeWidth="1"
            strokeDasharray="4 6"
            fill="transparent"
            className="stroke-gray-200 dark:stroke-slate-700/40"
          />
          
          {/* Main fat background track */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            strokeWidth="10"
            fill="transparent"
            className="stroke-gray-50 dark:stroke-slate-800/80"
          />
          
          {/* Inner precision dots */}
          <circle
            cx="112"
            cy="112"
            r={radius - 18}
            strokeWidth="2"
            strokeDasharray="1 8"
            strokeLinecap="round"
            fill="transparent"
            className="stroke-gray-300 dark:stroke-slate-600/40"
          />

          {/* Progress circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            cx="112"
            cy="112"
            r={radius}
            strokeWidth="10"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            className={`stroke-current ${strokeColor}`}
            style={{ filter: "drop-shadow(0px 0px 12px currentColor)" }}
          />
        </svg>

        {/* Ambient breathing ring */}
        <motion.div
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-6 rounded-full ${bgGradient} blur-xl`}
        />

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <motion.span 
            className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-text-main to-gray-400 dark:from-white dark:to-gray-400 mt-3 py-2 px-4 leading-none"
          >
            {displayScore}
          </motion.span>
          <span className="text-[9px] font-black text-text-muted tracking-[0.25em] uppercase mt-1">
            Score
          </span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-center z-10 relative group"
      >
        <motion.div 
          animate={{ boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 20px currentColor", "0px 0px 0px rgba(0,0,0,0)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase border backdrop-blur-md ${
          healthScore >= 85 ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/20" :
          healthScore >= 60 ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-500/20" :
          "bg-red-500/10 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-500/20"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${healthScore >= 85 ? "bg-emerald-500" : healthScore >= 60 ? "bg-amber-500" : "bg-red-500"}`}></span>
          {assessment}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(AIHealthSummary);
