import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LuUsers, LuMap, LuStore, LuBrainCircuit } from 'react-icons/lu';

const Counter = ({ from = 0, to, duration = 2.5, suffix = "" }) => {
  const [count, setCount] = useState(from);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration,
        onUpdate: (val) => setCount(Math.floor(val)),
        ease: "circOut"
      });
      return () => controls.stop();
    }
  }, [from, to, duration, inView]);

  return (
    <div ref={ref} className="flex items-baseline justify-center gap-1 mb-4">
      <motion.span 
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 py-2"
      >
        {count}
      </motion.span>
      {suffix && (
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-teal-500 py-2"
        >
          {suffix}
        </motion.span>
      )}
    </div>
  );
};

const NumbersSection = () => {
  const stats = [
    { to: 2800, suffix: "+", title: "Registered Farmers", icon: <LuUsers size={32} strokeWidth={2.5} /> },
    { to: 12, suffix: "", title: "Governorates Active", icon: <LuMap size={32} strokeWidth={2.5} /> },
    { to: 1200, suffix: "+", title: "Market Listings", icon: <LuStore size={32} strokeWidth={2.5} /> },
    { to: 94, suffix: ".2%", title: "AI Diagnostic Accuracy", icon: <LuBrainCircuit size={32} strokeWidth={2.5} /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -20 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 80, damping: 12 } }
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ perspective: "1000px" }}>
      {/* Animated background glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 blur-[120px] rounded-full pointer-events-none"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              whileHover={{ y: -15, scale: 1.05, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)" }}
              className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-white/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-black/20 backdrop-blur-md transition-colors duration-300 group cursor-default"
            >
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-600 dark:text-emerald-400 mb-6 shadow-inner"
              >
                {stat.icon}
              </motion.div>
              
              <Counter to={stat.to} suffix={stat.suffix} />
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
                className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center leading-relaxed"
              >
                {stat.title}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default NumbersSection;
