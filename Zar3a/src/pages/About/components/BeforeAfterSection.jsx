import React from 'react';
import { motion } from 'framer-motion';
import { LuX, LuCheck, LuDroplets, LuTrendingDown, LuTrendingUp, LuWifi, LuWifiOff } from 'react-icons/lu';
import { useLanguage } from '../../../context/LanguageContext';

const BeforeAfterSection = () => {
  const { t } = useLanguage();

  const beforeItems = [
    { icon: <LuX />, text: t("about.before.guess") },
    { icon: <LuDroplets />, text: t("about.before.water") },
    { icon: <LuTrendingDown />, text: t("about.before.disease") },
    { icon: <LuWifiOff />, text: t("about.before.fragment") }
  ];

  const beforeStats = [
    { value: "-15%", label: t("about.before.cropLoss"), pos: "-top-2 -left-4 md:-top-4 md:-left-8" },
    { value: "+40%", label: t("about.before.waterWaste"), pos: "bottom-4 -left-6 md:bottom-8 md:-left-12" },
    { value: "-20%", label: t("about.before.profits"), pos: "top-1/3 -right-6 md:top-1/4 md:-right-10" }
  ];

  const afterItems = [
    { icon: <LuCheck />, text: t("about.after.ai") },
    { icon: <LuDroplets />, text: t("about.after.irrigation") },
    { icon: <LuTrendingUp />, text: t("about.after.iot") },
    { icon: <LuWifi />, text: t("about.after.dataFarm") }
  ];

  const afterStats = [
    { value: "+40%", label: t("about.after.cropYield"), pos: "-top-2 -left-4 md:-top-4 md:-left-8" },
    { value: "-30%", label: t("about.after.waterWaste"), pos: "bottom-4 -left-6 md:bottom-8 md:-left-12" },
    { value: "+25%", label: t("about.after.profits"), pos: "top-1/3 -right-6 md:top-1/4 md:-right-10" }
  ];

  return (
    <section className="relative py-24 md:py-32 flex flex-col gap-16 md:gap-32">
      {/* BEFORE ZAR3A SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
        >
          {/* Background Image for Before */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1598463428987-9759c8e1ba42?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-luminosity" />
          
          <div className="relative z-10 p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-red-600 dark:text-red-500 mb-6 tracking-tighter drop-shadow-md font-['Outfit']">
                {t("about.before.title")}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium mb-8 font-['Outfit']">
                {t("about.before.desc")}
              </p>
              <ul className="space-y-4">
                {beforeItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg font-bold text-slate-600 dark:text-slate-400">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex shrink-0 items-center justify-center text-red-600 dark:text-red-500">
                      {item.icon}
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-56 h-56 md:w-72 md:h-72 border-4 border-red-500/20 dark:border-red-900/30 rounded-full flex items-center justify-center relative">
                 <div className="w-40 h-40 md:w-56 md:h-56 border-4 border-red-500/30 dark:border-red-900/50 rounded-full flex items-center justify-center animate-pulse">
                    <LuTrendingDown size={64} className="text-red-500/80 dark:text-red-900/50" />
                 </div>
                 {/* Floating Bad Nodes orbiting the circle */}
                 {beforeStats.map((stat, i) => (
                    <motion.div 
                      key={i}
                      animate={{ y: [-6, 6, -6] }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
                      className={`absolute ${stat.pos} group flex items-center h-10 md:h-12 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-red-500/20 text-red-600 dark:text-red-400 font-black cursor-pointer overflow-hidden z-20 hover:shadow-[0_8px_30px_rgb(239,68,68,0.2)] transition-shadow duration-300`}
                    >
                      <div className="flex items-center justify-center px-4 h-full shrink-0 text-sm md:text-base">
                        {stat.value}
                      </div>
                      <div className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-[max-width] duration-500 ease-out whitespace-nowrap text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center">
                        <span className="pr-4">{stat.label}</span>
                      </div>
                    </motion.div>
                 ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AFTER ZAR3A SECTION */}
      <div className="relative max-w-7xl mx-auto px-4 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 shadow-2xl shadow-emerald-500/10"
        >
          {/* Background effects for After */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2f254552b3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/90 to-teal-50/90 dark:from-emerald-900/90 dark:to-indigo-950/90" />

          <div className="relative z-10 p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 mb-6 tracking-tighter drop-shadow-sm font-['Outfit']">
                {t("about.after.title")}
              </h2>
              <p className="text-xl text-slate-800 dark:text-slate-200 font-medium mb-8 font-['Outfit']">
                {t("about.after.desc")}
              </p>
              <ul className="space-y-4">
                {afterItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg font-bold text-slate-800 dark:text-slate-100">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md">
                      {item.icon}
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-56 h-56 md:w-72 md:h-72 border-4 border-emerald-500/30 rounded-full flex items-center justify-center relative">
                 <div className="w-40 h-40 md:w-56 md:h-56 border-4 border-emerald-500/50 rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/10 animate-pulse" />
                    <LuTrendingUp size={64} className="text-emerald-600 dark:text-emerald-400 relative z-10" />
                 </div>
                 {/* Floating Data Nodes orbiting the circle */}
                 {afterStats.map((stat, i) => (
                    <motion.div 
                      key={i}
                      animate={{ y: [-6, 6, -6] }}
                      transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
                      className={`absolute ${stat.pos} group flex items-center h-10 md:h-12 rounded-full bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black cursor-pointer overflow-hidden z-20 hover:shadow-[0_8px_30px_rgb(16,185,129,0.2)] transition-shadow duration-300`}
                    >
                      <div className="flex items-center justify-center px-4 h-full shrink-0 text-sm md:text-base">
                        {stat.value}
                      </div>
                      <div className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-[max-width] duration-500 ease-out whitespace-nowrap text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center">
                        <span className="pr-4">{stat.label}</span>
                      </div>
                    </motion.div>
                 ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-24"></div> {/* Empty space below them as requested */}
    </section>
  );
};

export default BeforeAfterSection;
