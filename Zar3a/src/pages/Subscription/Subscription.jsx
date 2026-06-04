import { useState } from "react";
import { motion } from "framer-motion";
import { LuCheck, LuLock, LuLoader } from "react-icons/lu";
import { FiAlertTriangle } from "react-icons/fi";
import { paymentsAPI } from "../../API/axiosInstance";
import { useLanguage } from "../../context/LanguageContext";

export default function Subscription() {
  const { t } = useLanguage();
  const [loadingTier, setLoadingTier] = useState(null);
  const [error, setError] = useState("");

  const handleSubscribe = async (tier) => {
    setLoadingTier(tier);
    setError("");
    try {
      const response = await paymentsAPI.subscribe({ tier });
      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Redirect URL not received from server");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError(err?.response?.data?.message || "Failed to initialize subscription checkout");
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900 py-16 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-black text-text-main dark:text-white tracking-tight">
            {t("sub.title")} <span className="text-primary-base text-emerald-600 dark:text-emerald-400">{t("sub.titleAccent")}</span>
          </h1>
          <p className="text-lg text-text-muted dark:text-slate-400 max-w-2xl mx-auto font-medium">
            {t("sub.subtitle")}
          </p>
        </motion.div>

        {/* Error Alert Block */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/30 p-4 text-rose-700 dark:text-rose-300 text-sm font-semibold flex items-center gap-3"
          >
            <FiAlertTriangle size={20} className="shrink-0" />
            <div>{error}</div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {/* Tier 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800">
              <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-4">
                {t("sub.tier1.badge")}
              </span>
              <h3 className="text-2xl font-black text-text-main dark:text-white mb-2">{t("sub.tier1.title")}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900 dark:text-white">500</span>
                <span className="text-sm font-bold text-text-muted dark:text-slate-400">{t("sub.period")}</span>
              </div>
              <p className="text-sm text-text-muted dark:text-slate-400 font-medium leading-relaxed">
                {t("sub.tier1.desc")}
              </p>
            </div>
            
            <div className="p-8 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">{t("sub.group.monitoring")}</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.readOnly")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.oneSensor")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.basicReadings")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.emailDaily")}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">{t("sub.group.market")}</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.buySell")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.expertChat")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.basicTrack")}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">{t("sub.group.locked")}</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">{t("sub.feature.aiCrop")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">{t("sub.feature.realtimeAlerts")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">{t("sub.feature.multiSensors")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">{t("sub.feature.analyticsCharts")}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <button 
                onClick={() => handleSubscribe("STARTER")}
                disabled={loadingTier !== null}
                className="w-full mt-8 py-4 rounded-2xl font-black text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
              >
                {loadingTier === "STARTER" ? (
                  <>
                    <LuLoader className="animate-spin" size={16} />
                    {t("sub.redirecting")}
                  </>
                ) : (
                  t("sub.btn.starter")
                )}
              </button>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800">
              <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 mb-4">
                {t("sub.tier2.badge")}
              </span>
              <h3 className="text-2xl font-black text-text-main dark:text-white mb-2">{t("sub.tier2.title")}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900 dark:text-white">1,000</span>
                <span className="text-sm font-bold text-text-muted dark:text-slate-400">{t("sub.period")}</span>
              </div>
              <p className="text-sm text-text-muted dark:text-slate-400 font-medium leading-relaxed">
                {t("sub.tier2.desc")}
              </p>
            </div>
            
            <div className="p-8 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">{t("sub.group.plusStarter")}</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.fiveSensors")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.realtimeSms")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.fullReadings")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.history30")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.cropCalendar")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>{t("sub.feature.fullTrack")}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">{t("sub.group.stillLocked")}</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">{t("sub.feature.aiCrop")}</span>
                      <span className="text-[9px] font-black bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-2 py-0.5 rounded">{t("sub.locked")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">{t("sub.feature.autoSchedules")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">{t("sub.feature.analyticsDashboard")}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <button 
                onClick={() => handleSubscribe("GROWTH")}
                disabled={loadingTier !== null}
                className="w-full mt-8 py-4 rounded-2xl font-black text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
              >
                {loadingTier === "GROWTH" ? (
                  <>
                    <LuLoader className="animate-spin" size={16} />
                    {t("sub.redirecting")}
                  </>
                ) : (
                  t("sub.btn.growth")
                )}
              </button>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-white dark:bg-slate-900 border-[3px] border-emerald-500 dark:border-emerald-500 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl shadow-green-500/10 hover:-translate-y-2 transition-all duration-300 relative scale-[1.02] z-10">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 relative">
              <div className="absolute top-8 ltr:right-8 rtl:left-8 text-primary-base text-emerald-500 dark:text-emerald-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              
              <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white mb-4 shadow-md shadow-emerald-500/20">
                {t("sub.tier3.badge")}
              </span>
              <h3 className="text-2xl font-black text-text-main dark:text-white mb-2">{t("sub.tier3.title")}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-emerald-500 dark:text-emerald-400">2,000</span>
                <span className="text-sm font-bold text-text-muted dark:text-slate-400">{t("sub.period")}</span>
              </div>
              <p className="text-sm text-text-muted dark:text-slate-400 font-medium leading-relaxed">
                {t("sub.tier3.desc")}
              </p>
            </div>
            
            <div className="p-8 flex-1 flex flex-col bg-green-50/30 dark:bg-emerald-950/10">
              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">{t("sub.group.plusGrowth")}</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>{t("sub.feature.unlimitedSensors")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>{t("sub.feature.aiDetail")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>{t("sub.feature.wateringSchedules")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>{t("sub.feature.analyticsSales")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>{t("sub.feature.unlimitedHistory")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>{t("sub.feature.aiOffline")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>{t("sub.feature.stripeGateway")}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>{t("sub.feature.prioritySupport")}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <button 
                onClick={() => handleSubscribe("PRO")}
                disabled={loadingTier !== null}
                className="w-full mt-8 py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
              >
                {loadingTier === "PRO" ? (
                  <>
                    <LuLoader className="animate-spin" size={16} />
                    {t("sub.redirecting")}
                  </>
                ) : (
                  t("sub.btn.pro")
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
