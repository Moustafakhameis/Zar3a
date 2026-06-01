import React from 'react';
import { motion } from 'framer-motion';
import { LuX, LuCheck } from 'react-icons/lu';

const ComparisonSection = () => {
  const traditional = [
    "Guesswork & Assumptions",
    "Delayed Disease Detection",
    "Middlemen Exploitation",
    "No Real-Time Data",
    "Disconnected Supply Chain"
  ];

  const zar3a = [
    "AI-Powered Decisions",
    "Instant IoT Monitoring",
    "Direct Farmer-to-Buyer Sales",
    "Real-Time Sensor Insights",
    "Integrated Ecosystem"
  ];

  return (
    <section className="py-32 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black text-text-main dark:text-white tracking-tight">
            Why Zar3a is Different
          </h2>
          <p className="mt-6 text-xl text-text-muted dark:text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            We are completely rewiring how agriculture works in Egypt.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto" style={{ perspective: "1000px" }}>
          
          {/* Traditional Farming */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -5, boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.15)" }}
            className="bg-surface-card dark:bg-slate-900 border border-red-500/20 p-10 rounded-[3rem] shadow-lg relative cursor-default transition-shadow duration-300"
          >
            <div className="absolute inset-0 bg-red-500/5 rounded-[3rem]" />
            <motion.h3 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-text-main dark:text-slate-900 dark:text-white mb-8 relative z-10 flex items-center gap-4"
            >
              Traditional Farming
            </motion.h3>
            <ul className="space-y-6 relative z-10">
              {traditional.map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (idx * 0.1), type: "spring", stiffness: 300 }}
                  whileHover={{ x: 10, color: "#ef4444" }}
                  className="flex items-center gap-4 text-lg font-bold text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <motion.div 
                    whileHover={{ rotate: 90, scale: 1.2 }}
                    className="w-8 h-8 rounded-full bg-red-500/20 dark:bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0"
                  >
                    <LuX size={16} strokeWidth={3} />
                  </motion.div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Zar3a */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -5, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.3)" }}
            className="bg-emerald-500/10 dark:bg-emerald-900/20 border border-emerald-500/30 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden cursor-default transition-shadow duration-300"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500 blur-3xl rounded-full pointer-events-none" 
            />
            
            <motion.h3 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-black text-text-main dark:text-slate-900 dark:text-white mb-8 relative z-10 flex items-center gap-4"
            >
              The Zar3a Way
            </motion.h3>
            <ul className="space-y-6 relative z-10">
              {zar3a.map((item, idx) => (
                <motion.li 
                  key={idx} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (idx * 0.1), type: "spring", stiffness: 300 }}
                  whileHover={{ x: -10, color: "#10b981" }}
                  className="flex items-center gap-4 text-lg font-black text-emerald-700 dark:text-emerald-300 transition-colors"
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: [0, -15, 15, -15, 0] }}
                    transition={{ duration: 0.4 }}
                    className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-500/30"
                  >
                    <LuCheck size={16} strokeWidth={3} />
                  </motion.div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
