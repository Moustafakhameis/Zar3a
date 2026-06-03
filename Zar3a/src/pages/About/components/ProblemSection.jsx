import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';

const ProblemSection = () => {
  const { t } = useLanguage();

  const problems = [
    t("about.problem.water"),
    t("about.problem.climate"),
    t("about.problem.disease"),
    t("about.problem.supply"),
    t("about.problem.data"),
    t("about.problem.expert")
  ];

  return (
    <section className="min-h-screen relative flex items-center py-32 overflow-hidden">
      {/* Emotional Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585834825950-84561dc3b754?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-overlay opacity-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-slate-100 tracking-tighter mb-8">
            {t("about.problem.title")}
          </h2>
          <p className="text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-16">
            {t("about.problem.desc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-red-600 dark:text-red-500/80 font-black text-xl md:text-3xl tracking-tight uppercase drop-shadow-sm">
                {problem}
              </div>
              <div className="w-12 h-1 bg-red-500/50 dark:bg-red-900/50 mt-4 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
