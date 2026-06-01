import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LuArrowRight, LuLeaf } from 'react-icons/lu';

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* High-Energy Animated Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] max-w-4xl bg-emerald-400/40 dark:bg-emerald-600/20 rounded-full blur-[120px] dark:mix-blend-screen animate-pulse" />
        
        {/* Extra floating animated orbs for more movement */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-64 h-64 bg-teal-400/30 dark:bg-teal-600/20 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-green-400/30 dark:bg-green-600/20 rounded-full blur-[80px]"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.02, rotateY: 2, rotateX: 2, transition: { type: "spring", stiffness: 400, damping: 20 } }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="bg-white/40 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/60 dark:border-slate-700 p-12 md:p-24 rounded-[4rem] shadow-2xl shadow-emerald-500/10 dark:shadow-none relative overflow-hidden group perspective-1000"
        >
          {/* Subtle inner animated shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 dark:via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-1000 -translate-x-full group-hover:translate-x-full pointer-events-none" />

          {/* Floating leaf decoration */}
          <motion.div 
            animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-12 text-emerald-500/20 dark:text-emerald-500/10"
          >
            <LuLeaf size={80} />
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 relative z-10 leading-tight">
            Ready to Transform <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 inline-block drop-shadow-sm group-hover:scale-105 transition-transform duration-500">
              Agriculture?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium mb-12 max-w-2xl mx-auto leading-relaxed relative z-10">
            Join thousands of farmers, experts, and suppliers who are already building the future of farming in Egypt.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, y: -4, transition: { type: "spring", stiffness: 500, damping: 15 } }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-colors duration-300"
              >
                Join Zar3a <LuArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05, y: -4, transition: { type: "spring", stiffness: 500, damping: 15 } }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white font-black rounded-2xl text-xl shadow-lg flex items-center justify-center transition-colors duration-300"
              >
                Explore Marketplace
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
