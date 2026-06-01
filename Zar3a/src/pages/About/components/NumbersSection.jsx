import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
    <div ref={ref} className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 mb-2 drop-shadow-xl py-2 leading-normal">
      {count}{suffix}
    </div>
  );
};

const NumbersSection = () => {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Counter to={2800} suffix="+" />
            <p className="text-lg font-bold text-text-muted dark:text-slate-400 uppercase tracking-widest">Registered Farmers</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Counter to={12} />
            <p className="text-lg font-bold text-text-muted dark:text-slate-400 uppercase tracking-widest">Governorates Active</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Counter to={1200} suffix="+" />
            <p className="text-lg font-bold text-text-muted dark:text-slate-400 uppercase tracking-widest">Market Listings</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Counter to={94} suffix=".2%" />
            <p className="text-lg font-bold text-text-muted dark:text-slate-400 uppercase tracking-widest">AI Diagnostic Accuracy</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default NumbersSection;
