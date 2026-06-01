import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LuUsers, LuMap, LuStore, LuBrainCircuit } from 'react-icons/lu';

const Counter = ({ from = 0, to, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(from);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration,
        onUpdate: (val) => setCount(Math.floor(val)),
        ease: "easeOut"
      });
      return () => controls.stop();
    }
  }, [from, to, duration, inView]);

  return (
    <div ref={ref} className="flex items-baseline justify-center gap-1 mb-4">
      {/* Number gets the gradient, padding added to prevent any top/bottom clipping */}
      <span className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 py-2">
        {count}
      </span>
      {/* Suffix is separated and not gradient-clipped, making it impossible to be cut off by bounding boxes */}
      {suffix && (
        <span className="text-4xl md:text-5xl lg:text-6xl font-black text-teal-500 py-2">
          {suffix}
        </span>
      )}
    </div>
  );
};

const NumbersSection = () => {
  const stats = [
    {
      to: 2800,
      suffix: "+",
      title: "Registered Farmers",
      icon: <LuUsers size={32} strokeWidth={2.5} />
    },
    {
      to: 12,
      suffix: "",
      title: "Governorates Active",
      icon: <LuMap size={32} strokeWidth={2.5} />
    },
    {
      to: 1200,
      suffix: "+",
      title: "Market Listings",
      icon: <LuStore size={32} strokeWidth={2.5} />
    },
    {
      to: 94,
      suffix: ".2%",
      title: "AI Diagnostic Accuracy",
      icon: <LuBrainCircuit size={32} strokeWidth={2.5} />
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-white/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-black/20 backdrop-blur-md hover:-translate-y-2 hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-300 group"
            >
              <div className="p-4 rounded-2xl bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-all duration-300">
                {stat.icon}
              </div>
              <Counter to={stat.to} suffix={stat.suffix} />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center leading-relaxed">
                {stat.title}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default NumbersSection;
