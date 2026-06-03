import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LuCpu, LuCloud, LuBrainCircuit, LuUsers, LuShoppingCart, LuSprout, LuTrendingUp, LuBanknote } from 'react-icons/lu';

const steps = [
  { id: 1, icon: <LuCpu />, title: "Smart Sensors", desc: "IoT devices collect soil and climate data 24/7.", border: "border-emerald-500/30 hover:border-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-500", line: "bg-emerald-500/30 group-hover:bg-emerald-500", node: "bg-emerald-500 shadow-emerald-500/50" },
  { id: 2, icon: <LuCloud />, title: "Secure Cloud", desc: "Data is instantly transmitted to our secure cloud.", border: "border-sky-500/30 hover:border-sky-500", bg: "bg-sky-500/10", text: "text-sky-500", line: "bg-sky-500/30 group-hover:bg-sky-500", node: "bg-sky-500 shadow-sky-500/50" },
  { id: 3, icon: <LuBrainCircuit />, title: "AI Analysis", desc: "Machine learning models analyze patterns.", border: "border-indigo-500/30 hover:border-indigo-500", bg: "bg-indigo-500/10", text: "text-indigo-500", line: "bg-indigo-500/30 group-hover:bg-indigo-500", node: "bg-indigo-500 shadow-indigo-500/50" },
  { id: 4, icon: <LuUsers />, title: "Expert Network", desc: "Agro-experts review edge cases and provide advice.", border: "border-purple-500/30 hover:border-purple-500", bg: "bg-purple-500/10", text: "text-purple-500", line: "bg-purple-500/30 group-hover:bg-purple-500", node: "bg-purple-500 shadow-purple-500/50" },
  { id: 5, icon: <LuShoppingCart />, title: "Marketplace", desc: "Direct connection to buyers and suppliers.", border: "border-orange-500/30 hover:border-orange-500", bg: "bg-orange-500/10", text: "text-orange-500", line: "bg-orange-500/30 group-hover:bg-orange-500", node: "bg-orange-500 shadow-orange-500/50" },
  { id: 6, icon: <LuSprout />, title: "Farmer Decisions", desc: "Farmers receive actionable insights.", border: "border-teal-500/30 hover:border-teal-500", bg: "bg-teal-500/10", text: "text-teal-500", line: "bg-teal-500/30 group-hover:bg-teal-500", node: "bg-teal-500 shadow-teal-500/50" },
  { id: 7, icon: <LuTrendingUp />, title: "Higher Yield", desc: "Optimized resources lead to better harvests.", border: "border-green-500/30 hover:border-green-500", bg: "bg-green-500/10", text: "text-green-500", line: "bg-green-500/30 group-hover:bg-green-500", node: "bg-green-500 shadow-green-500/50" },
  { id: 8, icon: <LuBanknote />, title: "Higher Profit", desc: "Direct sales and lower costs maximize revenue.", border: "border-yellow-500/30 hover:border-yellow-500", bg: "bg-yellow-500/10", text: "text-yellow-500", line: "bg-yellow-500/30 group-hover:bg-yellow-500", node: "bg-yellow-500 shadow-yellow-500/50" }
];

const EcosystemSection = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section ref={containerRef} className="py-32 relative">
      <div className="max-w-4xl mx-auto px-4 relative">
        
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
            The Ecosystem Flow
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
            How a single drop of water translates into higher profits.
          </p>
        </div>

        {/* Central Vertical Line */}
        <div className="absolute left-1/2 top-48 bottom-0 w-1 bg-slate-800 -translate-x-1/2 rounded-full overflow-hidden">
           <motion.div 
             style={{ scaleY: scrollYProgress, originY: 0 }}
             className="w-full h-full bg-gradient-to-b from-emerald-500 via-sky-500 to-yellow-500"
           />
        </div>

        <div className="space-y-24 relative z-10">
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`flex items-center w-full ${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`w-1/2 flex ${isLeft ? 'justify-end pr-8 md:pr-12' : 'justify-start pl-8 md:pl-12'}`}>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border ${step.border} p-6 rounded-3xl shadow-xl hover:shadow-2xl max-w-sm w-full relative group transition-all duration-300`}
                  >
                    <div className={`absolute top-1/2 ${isLeft ? '-right-8 md:-right-12' : '-left-8 md:-left-12'} w-8 md:w-12 h-0.5 ${step.line} transition-colors -translate-y-1/2`} />
                    
                    <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.text} flex items-center justify-center text-2xl mb-4`}>
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      {step.desc}
                    </p>
                  </motion.div>
                </div>
                
                {/* Center Node */}
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 z-20">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className={`w-full h-full rounded-full ${step.node} shadow-lg`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default EcosystemSection;
