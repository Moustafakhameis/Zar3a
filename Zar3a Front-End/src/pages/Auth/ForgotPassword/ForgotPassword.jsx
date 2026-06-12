import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiSun, FiMoon, FiCheck } from "react-icons/fi";
import ForgotPasswordRequest from "./ForgotPasswordRequest";
import OTPVerification from "./OTPVerification";
import ResetPasswordWithOTP from "./ResetPasswordWithOTP";
import Logo2 from "../../../assets/Logo2.png";
import { useTheme } from "../../../context/ThemeContext";

/**
 * ForgotPassword Component
 * Coordinates the three-step OTP-based password reset flow:
 * 1. Request OTP (email entry)
 * 2. Verify OTP (6-digit code entry)
 * 3. Reset Password (new password entry)
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [step, setStep] = useState("request"); // 'request' | 'verify' | 'reset'
  const [email, setEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  const handleOTPRequested = (userEmail) => {
    setEmail(userEmail);
    setStep("verify");
  };

  const handleOTPVerified = (token) => {
    setVerificationToken(token);
    setStep("reset");
  };

  const handleResetSuccess = () => {
    // Navigating is handled inside the ResetPassword component usually
  };

  const handleBack = () => {
    setStep("request");
    setEmail("");
    setVerificationToken("");
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const FloatingLeaf = ({ className, delay, size = "140" }) => (
    <motion.div
      animate={{ y: [0, -25, 0], rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute text-primary-base/10 dark:text-emerald-400/5 hidden lg:block pointer-events-none ${className}`}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,3 14,3.5 9,9C8.44,9.62 8,10.3 7.65,11C11.3,7.64 15.5,6.11 15.5,6.11C15.5,6.11 11,8.5 7.65,12.3C7.2,13.2 6.88,14.23 6.7,15.3C6.1,13.6 5.33,12.14 4.54,11.26C4.06,10.71 3.56,10.23 3,9.81C3,9.81 7,2 14,2C17,2 20,3 22,3C22,3 20.19,6.03 17,8Z" />
      </svg>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#fdfcf8] dark:bg-[#020617] font-sans transition-colors duration-500">
      {/* Background Decor */}
      <FloatingLeaf className="top-20 end-[10%]" delay={0} size="160" />
      <FloatingLeaf className="bottom-20 start-[8%] -scale-x-100" delay={2} size="130" />
      <div className="absolute top-[-10%] start-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[50%] h-[50%] rounded-full bg-green-200/20 dark:bg-green-900/10 blur-[120px] pointer-events-none" />

      {/* Top Controls */}
      <motion.button whileHover={{ x: -5 }} onClick={() => navigate("/")}
        className="absolute top-8 start-8 z-50 flex items-center gap-2 px-5 py-2.5 bg-surface-card dark:bg-slate-800 border border-border-default dark:border-slate-700 rounded-2xl shadow-sm text-text-subtle dark:text-slate-300 font-bold hover:text-primary-base transition-all">
        <FiHome /> Home
      </motion.button>

      <div className="absolute top-8 end-8 z-50 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
          className="w-12 h-12 flex items-center justify-center bg-surface-card dark:bg-slate-800 border border-border-default dark:border-slate-700 rounded-2xl shadow-sm text-text-subtle dark:text-yellow-400 transition-all">
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md sm:max-w-lg z-10 mt-20 sm:mt-0">
        <div className="bg-surface-card/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-white dark:border-slate-800 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 start-0 w-full h-2 bg-linear-to-r from-emerald-400 via-green-500 to-lime-400" />

          {/* Header */}
          <header className="text-center mb-8">
            <div onClick={() => navigate("/")}
              className="inline-flex items-center justify-center w-20 h-20 bg-primary-light dark:bg-emerald-900/30 rounded-3xl mb-6 shadow-inner border border-emerald-100 dark:border-emerald-800 cursor-pointer">
              <img src={Logo2} alt="Logo" className="object-contain transform scale-400 w-full h-6" />
            </div>
            
            {/* Stepper */}
            <div className="flex items-center justify-center gap-4 mt-2">
              <Step indicator="1" active={step === "request"} completed={step === "verify" || step === "reset"} />
              <div className={`h-1 w-12 rounded-full ${step === "verify" || step === "reset" ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"} transition-colors duration-500`} />
              <Step indicator="2" active={step === "verify"} completed={step === "reset"} />
              <div className={`h-1 w-12 rounded-full ${step === "reset" ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"} transition-colors duration-500`} />
              <Step indicator="3" active={step === "reset"} completed={false} />
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === "request" && (
                <ForgotPasswordRequest onOTPRequested={handleOTPRequested} onCancel={handleCancel} />
              )}
              {step === "verify" && (
                <OTPVerification email={email} onOTPVerified={handleOTPVerified} onBack={handleBack} />
              )}
              {step === "reset" && (
                <ResetPasswordWithOTP verificationToken={verificationToken} email={email} onSuccess={handleResetSuccess} />
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
};

const Step = ({ indicator, active, completed }) => {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
        completed
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
          : active
          ? "bg-primary-base text-white ring-4 ring-emerald-100 dark:ring-emerald-900/50 shadow-lg shadow-emerald-500/40"
          : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
      }`}
    >
      {completed ? <FiCheck strokeWidth={3} /> : indicator}
    </div>
  );
};

export default ForgotPassword;
