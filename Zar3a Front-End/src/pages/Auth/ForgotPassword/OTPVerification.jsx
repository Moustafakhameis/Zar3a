import { useState, useRef, useEffect } from "react";
import api from "../../../API/axiosInstance";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";

/**
 * OTPVerification Component
 * Step 2: User enters 6-digit OTP
 */
const OTPVerification = ({ email, onOTPVerified, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        `/auth/forgot-password/verify-otp`,
        { email, otp: otpValue }
      );

      // OTP verified successfully, move to next step
      onOTPVerified(response.data.verificationToken);
    } catch (err) {
      const message = err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(message);
      
      // Extract attempts left if available
      if (message.includes("attempts")) {
        const match = message.match(/(\d+) attempts/);
        if (match) setAttemptsLeft(parseInt(match[1]));
      }

      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const isExpired = timeLeft <= 0;
  const isLocked = attemptsLeft <= 0;

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-text-main dark:text-white tracking-tight mb-2">
          Verify Email
        </h2>
        <p className="text-text-muted dark:text-text-disabled font-bold text-sm">
          We sent a 6-digit code to <span className="text-primary-base font-black">{email}</span>
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className={`px-4 py-2 rounded-full font-black text-xs tracking-wider uppercase border-2 flex items-center gap-2 ${
          isExpired 
            ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400"
            : timeLeft < 60
            ? "border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900/30 dark:bg-yellow-900/10 dark:text-yellow-500"
            : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-400"
        }`}>
          ⏱️ Expires in: {formatTime(timeLeft)}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-semibold mb-6">
            <FiAlertCircle className="shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2 sm:gap-4" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading || isExpired || isLocked}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all disabled:opacity-50 ${
                digit 
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "bg-surface-secondary/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 focus:border-emerald-400 text-text-main dark:text-white"
              }`}
            />
          ))}
        </div>

        {isExpired && (
          <div className="text-red-500 text-sm font-bold text-center">
            ⏰ Code has expired. Please request a new one.
          </div>
        )}

        {isLocked && (
          <div className="text-red-500 text-sm font-bold text-center">
            🔒 Too many failed attempts. Please request a new code.
          </div>
        )}

        {attemptsLeft > 0 && !isLocked && !isExpired && (
          <p className="text-center text-xs font-bold text-text-disabled">
            {attemptsLeft === 1
              ? "⚠️ Last attempt remaining"
              : `${attemptsLeft} attempts remaining`}
          </p>
        )}

        <motion.button disabled={loading || isExpired || isLocked || otp.some(d => d === "")} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
          className="w-full bg-primary-base hover:bg-primary-hover text-white py-4 rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-3 transition-all mt-4 disabled:opacity-70 disabled:hover:translate-y-0">
          {loading ? (
            <>
              <ClipLoader color="#ffffff" size={20} />
              Verifying...
            </>
          ) : "Verify Code"}
        </motion.button>
      </form>

      <div className="mt-8 text-center border-t border-border-default dark:border-slate-800 pt-6">
        <p className="text-text-muted dark:text-text-disabled font-bold text-sm mb-2">Didn't receive the code?</p>
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="text-primary-base font-black hover:underline disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
        >
          <FiArrowLeft /> Request New Code
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
