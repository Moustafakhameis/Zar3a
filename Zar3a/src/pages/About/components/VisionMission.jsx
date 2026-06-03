import React from 'react';
import { motion } from 'framer-motion';
import { LuEye, LuRocket } from 'react-icons/lu';
import { useLanguage } from '../../../context/LanguageContext';

const VisionMission = () => {
  const { t } = useLanguage();

  // Staggered animation for the list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const missionItems = [
    t("about.mission.ai"),
    t("about.mission.iot"),
    t("about.mission.data"),
    t("about.mission.market"),
    t("about.mission.expert")
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-10 w-[40rem] h-[40rem] bg-emerald-300/40 dark:bg-emerald-900/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-[blob_7s_infinite]" />
        <div className="absolute bottom-0 right-10 w-[40rem] h-[40rem] bg-indigo-300/40 dark:bg-indigo-900/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-[blob_7s_infinite_animation-delay-2000]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Vision Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="group relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl overflow-hidden cursor-pointer"
        >
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-500 z-0" />
          
          <div className="relative z-10">
            <motion.div 
              className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-8 shadow-inner"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <LuEye size={40} className="text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{t("about.vision.title")}</h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {t("about.vision.desc")}
            </p>
          </div>
        </motion.div>

        {/* Mission Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="group relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl overflow-hidden cursor-pointer"
        >
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-transparent transition-all duration-500 z-0" />

          <div className="relative z-10">
            <motion.div 
              className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 rounded-3xl flex items-center justify-center mb-8 shadow-inner"
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
            >
              <LuRocket size={40} className="text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{t("about.mission.title")}</h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8">
              {t("about.mission.desc")}
            </p>
            
            <motion.ul 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {missionItems.map((item, idx) => (
                <motion.li key={idx} variants={itemVariants} className="flex items-center gap-4 text-lg font-bold text-slate-800 dark:text-slate-200">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    ✓
                  </span>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default VisionMission;

