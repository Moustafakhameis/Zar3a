import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// استبدلنا Lu بـ Fi عشان نضمن وجود الأيقونات وتجنب الـ SyntaxError
import { FiHome, FiArrowLeft } from "react-icons/fi"; 
import { LuSprout } from "react-icons/lu"; // دي عادة بتكون موجودة، لو عملت مشكلة استبدلها بـ GiSprout
import { useLanguage } from "../../context/LanguageContext";

const NotFound = () => {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        staggerChildren: 0.2 
      } 
    },
  };

  const sproutVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0, 
      transition: { type: "spring", stiffness: 120, damping: 10, delay: 0.5 } 
    },
    hover: { scale: 1.15, rotate: 15, transition: { type: "spring", stiffness: 400, damping: 10 } }
  };

  const swayingAnimation = {
    y: [0, -8, 0],
    rotate: [-3, 3, -3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen relative flex flex-col items-center justify-center bg-[#fdfcf8] dark:bg-[#020617] font-sans overflow-hidden transition-colors duration-500"
    >
      {/* 🌟 Background Glows with Infinite Floating Animation */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -30, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-300/30 dark:bg-emerald-900/30 blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, 40, 0] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-300/20 dark:bg-teal-900/20 blur-[120px] pointer-events-none" 
      />

      {/* 🏠 Back Button */}
      <Link to="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 px-5 py-2.5 bg-surface-card dark:bg-slate-900 border border-border-default dark:border-slate-800 rounded-2xl shadow-sm text-text-subtle dark:text-slate-300 font-bold hover:text-primary-base transition-all group">
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        {t("notFound.backHome")}
      </Link>

      <div className="relative z-10 text-center px-4 font-['Outfit']">
        <div className="flex items-center justify-center gap-2 sm:gap-6 font-black text-text-main dark:text-white mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -50, rotate: -10 }} 
            animate={{ opacity: 1, x: 0, rotate: 0 }} 
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="text-[120px] sm:text-[180px] md:text-[220px] leading-none tracking-tighter drop-shadow-xl dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
            4
          </motion.h1>
          
          <div className="relative flex items-center justify-center w-28 sm:w-40 md:w-48 aspect-square">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/20 rounded-[2.5rem] sm:rounded-[3.5rem] rotate-3 border border-emerald-200 dark:border-emerald-800/50 shadow-2xl" 
            />
            <motion.div variants={sproutVariants} whileHover="hover" animate={swayingAnimation} className="relative text-emerald-500 drop-shadow-lg dark:drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <LuSprout size={120} className="sm:w-36 sm:h-36 drop-shadow-md" />
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, x: 50, rotate: 10 }} 
            animate={{ opacity: 1, x: 0, rotate: 0 }} 
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="text-[120px] sm:text-[180px] md:text-[220px] leading-none tracking-tighter drop-shadow-xl dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
            4
          </motion.h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, delay: 0.6 }}>
          <h2 className="text-4xl md:text-6xl font-black text-text-main dark:text-white mb-6 tracking-tight">
            {t("notFound.fieldNotFound").split(" ")[0]} <span className="text-primary-base">{t("notFound.fieldNotFound").split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-text-muted dark:text-text-disabled text-lg md:text-xl max-w-md mx-auto mb-10 font-medium">
            {t("notFound.notCultivated")}
          </p>
          
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }} 
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-[length:200%_auto] animate-gradient text-white px-10 py-5 rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.6)] transition-shadow duration-300 dark:ring-1 dark:ring-emerald-400/50"
            >
              {/* 🌟 Shimmer Overlay Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
              
              <FiHome className="relative z-10 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-150" /> 
              <span className="relative z-10">{t("notFound.return")}</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;