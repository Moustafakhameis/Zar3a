import { useState } from "react";
import api from "../../../API/axiosInstance";
import { FiMail, FiArrowRight, FiArrowLeft, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";

/**
 * ForgotPasswordRequest Component
 * Step 1: User enters email to request OTP
 */
const ForgotPasswordRequest = ({ onOTPRequested, onCancel }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post(
        `/auth/forgot-password/request-otp`,
        { email: email.trim().toLowerCase() }
      );

      setMessage(response.data.message);
      setSent(true);
    } catch (err) {
      let msg = err.response?.data?.message || err.response?.data?.error || "Failed to send OTP. Please try again.";
      if (typeof msg === "object" && msg !== null) msg = msg.message || "Failed to send OTP. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-text-main dark:text-white tracking-tight mb-2">
          Reset Password
        </h2>
        <p className="text-text-muted dark:text-text-disabled font-bold text-sm">
          Enter your email address to receive a verification code
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-semibold mb-6">
            <FiAlertCircle className="shrink-0" /> {error}
          </motion.div>
        )}
        {message && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-6">
            <FiCheckCircle className="shrink-0" /> {message}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-text-disabled uppercase tracking-widest ms-1">Email Address</label>
          <div className="relative group">
            <FiMail className="absolute start-4 top-1/2 -translate-y-1/2 z-10 text-text-disabled group-focus-within:text-emerald-500" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSent(false);
                setMessage("");
                setError("");
              }}
              disabled={loading || sent}
              required
              className="w-full ps-12 pe-4 py-4 rounded-2xl border-2 bg-surface-secondary/50 dark:bg-slate-800/50 text-text-main dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border-slate-50 dark:border-slate-700 focus:border-emerald-500 outline-none transition-all font-medium disabled:opacity-50"
            />
          </div>
        </div>

        {!sent ? (
          <motion.button disabled={loading || !email.trim()} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            className="w-full bg-primary-base hover:bg-primary-hover text-white py-4 rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-3 transition-all mt-2 disabled:opacity-70 disabled:hover:translate-y-0">
            {loading ? (
              <>
                <ClipLoader color="#ffffff" size={20} />
                Sending...
              </>
            ) : (
              <>
                Send Verification Code <FiArrowRight />
              </>
            )}
          </motion.button>
        ) : (
          <motion.button type="button" onClick={() => onOTPRequested(email)} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-3 transition-all mt-2">
            Continue to Enter OTP <FiArrowRight />
          </motion.button>
        )}
      </form>

      <button onClick={onCancel} className="mt-6 flex items-center justify-center gap-2 text-text-disabled hover:text-primary-base font-bold transition-colors w-max mx-auto">
        <FiArrowLeft /> Back to Login
      </button>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-2xl">
        <p className="text-xs text-yellow-800 dark:text-yellow-500 font-bold leading-relaxed">
          💡 <span className="font-black uppercase tracking-wider ms-1">Tip:</span> Make sure to check your spam folder if you don't see the email in a few seconds.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordRequest;
