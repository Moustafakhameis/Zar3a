import React from 'react';
import { motion } from 'framer-motion';
import { LuLockOpen, LuMap, LuTrendingUp } from 'react-icons/lu';

const values = [
  {
    id: 1,
    title: "Transparency Over Opacity",
    description: "Every price. Every rating. Every sensor reading. Visible to the farmer.",
    icon: <LuLockOpen size={32} />,
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    title: "Local Roots, Modern Tools",
    description: "Built specifically for Egyptian agriculture. Designed for Egyptian soil, weather, and seasons.",
    icon: <LuMap size={32} />,
    gradient: "from-emerald-500 to-teal-400"
  },
  {
    id: 3,
    title: "Data That Acts",
    description: "We don't collect data to display it. We collect data to guide actions.",
    icon: <LuTrendingUp size={32} />,
    gradient: "from-purple-500 to-pink-400"
  }
];

const ValuesSection = () => {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-4">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black text-text-main dark:text-white tracking-tight">
            Our Core Values
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-[3rem]`} />
              
              <div className="relative h-full bg-surface-card dark:bg-slate-900 border border-border-default dark:border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-lg overflow-hidden">
                {/* Decorative Number */}
                <div className="absolute -top-10 -right-6 text-[10rem] font-black text-slate-100 dark:text-slate-200 dark:text-slate-800/50 opacity-50 pointer-events-none select-none">
                  {value.id}
                </div>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white mb-8 shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {value.icon}
                </div>
                
                <h3 className="text-2xl font-black text-text-main dark:text-slate-900 dark:text-white mb-4 relative z-10">
                  {value.title}
                </h3>
                
                <p className="text-lg text-text-muted dark:text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ValuesSection;
