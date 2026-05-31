import { useState } from "react";
import { motion } from "framer-motion";
import { LuCheck, LuLock, LuLoader } from "react-icons/lu";
import { FiAlertTriangle } from "react-icons/fi";
import { paymentsAPI } from "../../API/axiosInstance";

export default function Subscription() {
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
            Choose Your <span className="text-primary-base text-emerald-600 dark:text-emerald-400">Zar3a Plan</span>
          </h1>
          <p className="text-lg text-text-muted dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Unlock powerful tools to monitor, manage, and boost your farm's productivity. Choose the plan that fits your growth.
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
                Tier 1 — Starter
              </span>
              <h3 className="text-2xl font-black text-text-main dark:text-white mb-2">Basic Monitor</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900 dark:text-white">500</span>
                <span className="text-sm font-bold text-text-muted dark:text-slate-400">EGP / month</span>
              </div>
              <p className="text-sm text-text-muted dark:text-slate-400 font-medium leading-relaxed">
                Core monitoring, trading, and consultations — at an accessible entry price.
              </p>
            </div>
            
            <div className="p-8 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">Monitoring</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Dashboard access (read-only)</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>1 greenhouse sensor connection</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Basic soil & temp readings</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Email notifications (daily digest)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">Marketplace & Consultation</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Buy & sell on marketplace</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Expert consultation & chat</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Basic order tracking</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">Locked Features</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">AI crop diagnosis</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">Real-time alerts</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">Multiple sensors</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">Analytics & charts</span>
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
                    Redirecting...
                  </>
                ) : (
                  "Select Starter"
                )}
              </button>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800">
              <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 mb-4">
                Tier 2 — Growth
              </span>
              <h3 className="text-2xl font-black text-text-main dark:text-white mb-2">Field Manager</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900 dark:text-white">1,000</span>
                <span className="text-sm font-bold text-text-muted dark:text-slate-400">EGP / month</span>
              </div>
              <p className="text-sm text-text-muted dark:text-slate-400 font-medium leading-relaxed">
                More sensors, live alerts and data history — still missing the AI edge.
              </p>
            </div>
            
            <div className="p-8 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">Everything in Starter, plus</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Up to 5 sensor connections</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Real-time alerts & SMS</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>pH, moisture, humidity full readings</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Historical data logs (30 days)</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Basic crop calendar</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <LuCheck className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                      <span>Full order tracking</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">Still Locked</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">AI crop diagnosis</span>
                      <span className="text-[9px] font-black bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-2 py-0.5 rounded">Tier 3</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">Automated schedules</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-400 dark:text-slate-600">
                      <LuLock className="mt-0.5 shrink-0" size={16} />
                      <span className="flex-1 line-through decoration-slate-300 dark:decoration-slate-700">Analytics dashboard</span>
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
                    Redirecting...
                  </>
                ) : (
                  "Select Growth"
                )}
              </button>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-white dark:bg-slate-900 border-[3px] border-emerald-500 dark:border-emerald-500 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl shadow-green-500/10 hover:-translate-y-2 transition-all duration-300 relative scale-[1.02] z-10">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 relative">
              <div className="absolute top-8 right-8 text-primary-base text-emerald-500 dark:text-emerald-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              
              <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white mb-4 shadow-md shadow-emerald-500/20">
                Tier 3 — Pro · Best Value
              </span>
              <h3 className="text-2xl font-black text-text-main dark:text-white mb-2">Full Platform</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-emerald-500 dark:text-emerald-400">2,000</span>
                <span className="text-sm font-bold text-text-muted dark:text-slate-400">EGP / month</span>
              </div>
              <p className="text-sm text-text-muted dark:text-slate-400 font-medium leading-relaxed">
                The complete Zar3a ecosystem — with AI that pays for itself in saved crops alone.
              </p>
            </div>
            
            <div className="p-8 flex-1 flex flex-col bg-green-50/30 dark:bg-emerald-950/10">
              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-text-muted dark:text-slate-400 mb-3">Everything in Growth, plus</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>Unlimited sensor connections</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>AI crop diagnosis (Groq LLaMA) — Arabic & English</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>Automated watering & fertilization schedules</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>Analytics dashboard — sales, yield & charts</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>Historical data logs (unlimited)</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>Offline AI fallback support</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>Stripe payment gateway & checkout</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-semibold text-text-main dark:text-slate-200">
                      <div className="mt-0.5 shrink-0 bg-primary-light dark:bg-emerald-900/50 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                        <LuCheck size={12} strokeWidth={4} />
                      </div>
                      <span>Priority 24/7 technical support</span>
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
                    Redirecting...
                  </>
                ) : (
                  "Select Pro Plan"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
