import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX, LuOctagonAlert, LuTriangleAlert, LuInfo, LuCircleCheck } from "react-icons/lu";

const AlertDetailsModal = ({ isOpen, onClose, alert }) => {
  if (!alert) return null;

  const { category, title, msg, time } = alert;

  let icon = <LuInfo size={32} />;
  let colorClass = "text-blue-600 dark:text-blue-400";
  let bgClass = "bg-blue-100 dark:bg-blue-900/30";
  let borderClass = "border-blue-200 dark:border-blue-800/50";
  let badgeClass = "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50";
  
  switch (category) {
    case "Critical":
      icon = <LuOctagonAlert size={32} />;
      colorClass = "text-red-600 dark:text-red-400";
      bgClass = "bg-red-100 dark:bg-red-900/30";
      borderClass = "border-red-200 dark:border-red-800/50";
      badgeClass = "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50";
      break;
    case "Warning":
      icon = <LuTriangleAlert size={32} />;
      colorClass = "text-amber-600 dark:text-amber-400";
      bgClass = "bg-amber-100 dark:bg-amber-900/30";
      borderClass = "border-amber-200 dark:border-amber-800/50";
      badgeClass = "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50";
      break;
    case "Resolved":
      icon = <LuCircleCheck size={32} />;
      colorClass = "text-emerald-600 dark:text-emerald-400";
      bgClass = "bg-emerald-100 dark:bg-emerald-900/30";
      borderClass = "border-emerald-200 dark:border-emerald-800/50";
      badgeClass = "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50";
      break;
    default:
      break;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 backdrop-blur-xl border border-gray-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header / Banner */}
            <div className={`p-8 pb-12 border-b ${borderClass} ${bgClass} relative overflow-hidden`}>
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                {icon}
              </div>

              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-widest ${badgeClass}`}>
                  {category}
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors bg-white/50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 ${colorClass}`}
                >
                  <LuX size={20} />
                </button>
              </div>
              <h2 className={`text-3xl font-black tracking-tight relative z-10 ${colorClass}`}>
                {title}
              </h2>
            </div>

            {/* Body */}
            <div className="p-8 pt-6 relative bg-white dark:bg-slate-900">
              <div className="absolute top-0 right-8 -translate-y-1/2 p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700">
                <div className={colorClass}>{icon}</div>
              </div>

              <div className="mt-2">
                <p className="text-xs font-black text-text-disabled uppercase tracking-widest mb-3">
                  Timestamp: {new Date(time).toLocaleString()}
                </p>
                <p className="text-base text-text-muted dark:text-gray-300 font-medium leading-relaxed bg-surface-secondary dark:bg-slate-800/50 p-5 rounded-3xl border border-gray-100 dark:border-slate-700/50">
                  {msg}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-main dark:text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-colors"
                >
                  Close
                </button>
                {category === "Critical" && (
                  <button
                    onClick={onClose}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-colors bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30`}
                  >
                    Take Action
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AlertDetailsModal;
