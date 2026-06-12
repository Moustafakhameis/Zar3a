import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { Toaster } from "sonner";
import { useAuth } from "./context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { LuLogOut } from "react-icons/lu";
import { useLanguage } from "./context/LanguageContext";
import { PuffLoader } from "react-spinners";

function App() {
  const { isLoggingOut } = useAuth();
  const { t } = useLanguage();

  return (
    <>
      <Toaster position="bottom-right" richColors theme="system" />
      <RouterProvider router={router} />

      {/* Global Smooth Logout Animation */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-surface-card/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-6 text-primary-base dark:text-emerald-400"
            >
              <div className="relative flex items-center justify-center">
                <PuffLoader color="#10b981" size={100} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LuLogOut size={32} className="text-primary-base opacity-80" />
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <h2 className="text-2xl font-black tracking-tight text-text-main dark:text-white">
                  {t("nav.loggingOut") || "Logging out..."}
                </h2>
                <p className="text-text-subtle dark:text-text-disabled font-medium text-sm animate-pulse">
                  See you soon!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
