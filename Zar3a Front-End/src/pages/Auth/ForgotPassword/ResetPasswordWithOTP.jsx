import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/axiosInstance";
import { toast } from "sonner";
import { FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";

/**
 * ResetPasswordWithOTP Component
 * Step 3: User enters new password
 */
const ResetPasswordWithOTP = ({ verificationToken, email, onSuccess }) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  const calculateStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 1;
    if (/\d/.test(pwd)) strength += 1;
    if (/[!@#$%^&*]/.test(pwd)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    setPasswordStrength(calculateStrength(pwd));
  };

  const getStrengthLabel = () => {
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    return labels[passwordStrength] || "Very Weak";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength >= 3) return "bg-emerald-500";
    return "bg-slate-300 dark:bg-slate-700";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength < 2) {
      setError("Password is too weak. Include uppercase, lowercase, and numbers.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/auth/forgot-password/reset-password`,
        {
          verificationToken,
          newPassword,
          confirmPassword,
        }
      );

      // Success! Show message and redirect
      toast.success("Password reset successfully!", {
        description: "You can now login with your new password.",
      });
      onSuccess?.();
      navigate("/login");
    } catch (err) {
      let msg = err.response?.data?.message || err.response?.data?.error || "Failed to reset password. Please try again.";
      if (typeof msg === "object" && msg !== null) msg = msg.message || "Failed to reset password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-text-main dark:text-white tracking-tight mb-2">
          Create New Password
        </h2>
        <p className="text-text-muted dark:text-text-disabled font-bold text-sm">
          Enter a strong password for your Zar3a account
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-semibold mb-6">
            <FiAlertCircle className="shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-text-disabled uppercase tracking-widest ms-1">New Password</label>
          <div className="relative group">
            <FiLock className="absolute start-4 top-1/2 -translate-y-1/2 z-10 text-text-disabled group-focus-within:text-emerald-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={handlePasswordChange}
              disabled={loading}
              required
              className="w-full ps-12 pe-12 py-4 rounded-2xl border-2 bg-surface-secondary/50 dark:bg-slate-800/50 text-text-main dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border-slate-50 dark:border-slate-700 focus:border-emerald-500 outline-none transition-all font-medium"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-text-disabled hover:text-primary-base transition-colors z-10">
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {newPassword && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-2 pt-2">
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? getStrengthColor() : "bg-slate-200 dark:bg-slate-700"}`} />
                ))}
              </div>
              <p className={`text-xs font-bold ${passwordStrength >= 3 ? "text-emerald-500" : passwordStrength === 2 ? "text-yellow-500" : "text-red-500"}`}>
                {getStrengthLabel()}
              </p>
            </motion.div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-text-disabled uppercase tracking-widest ms-1">Confirm Password</label>
          <div className="relative group">
            <FiLock className={`absolute start-4 top-1/2 -translate-y-1/2 z-10 ${confirmPassword && newPassword !== confirmPassword ? "text-red-400" : confirmPassword && newPassword === confirmPassword ? "text-emerald-500" : "text-text-disabled group-focus-within:text-emerald-500"}`} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
              className={`w-full ps-12 pe-12 py-4 rounded-2xl border-2 bg-surface-secondary/50 dark:bg-slate-800/50 text-text-main dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all font-medium ${confirmPassword && newPassword !== confirmPassword ? "border-red-200 dark:border-red-900/50 focus:border-red-500" : confirmPassword && newPassword === confirmPassword ? "border-emerald-200 dark:border-emerald-900/50 focus:border-emerald-500" : "border-slate-50 dark:border-slate-700 focus:border-emerald-500"}`}
            />
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500 font-semibold ms-2">Passwords do not match</p>
          )}
          {confirmPassword && newPassword === confirmPassword && (
            <p className="text-xs text-emerald-500 font-semibold ms-2 flex items-center gap-1"><FiCheckCircle /> Passwords match</p>
          )}
        </div>

        <motion.button disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
          className="w-full bg-primary-base hover:bg-primary-hover text-white py-4 rounded-2xl font-black text-lg shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-3 transition-all mt-4 disabled:opacity-70 disabled:hover:translate-y-0">
          {loading ? (
            <>
              <ClipLoader color="#ffffff" size={20} />
              Resetting...
            </>
          ) : "Reset Password"}
        </motion.button>
      </form>

      <div className="mt-8 p-4 bg-surface-secondary/50 dark:bg-slate-900/50 rounded-2xl border border-border-default dark:border-slate-800">
        <p className="text-xs text-text-muted dark:text-text-disabled font-medium leading-relaxed">
          <span className="font-black text-text-main dark:text-slate-300">🔒 Security:</span> Your password is encrypted and never shared. After resetting, you'll need to login again with your new password.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordWithOTP;
