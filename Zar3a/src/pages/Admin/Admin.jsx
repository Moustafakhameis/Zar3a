import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUserCheck,
  FiMail,
  FiPhone,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
  FiShield,
  FiUsers,
  FiAlertCircle,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiChevronDown
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { adminAPI } from "../../API/axiosInstance";

const CustomSelect = ({ value, onChange, options, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer"
      >
        <span className="truncate">{selectedOption.label}</span>
        <FiChevronDown className={`ml-2 flex-shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 mt-2 w-full min-w-[140px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden py-1"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${value === opt.value ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Admin() {
  const { t } = useLanguage();
  const {
    user,
    loading: authLoading,
    getPendingUsers,
    approveUser,
    rejectUser,
    getAllUsers,
    changeUserRole,
    deleteUserById,
    getAdminStats,
  } = useAuth();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState("ALL");
  const [pendingRoleFilter, setPendingRoleFilter] = useState("ALL");

  useEffect(() => {
    if (!user) return;

    if (user.role !== "ADMIN") {
      setError(t("admin.noPermission"));
      setLoading(false);
      return;
    }

    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [pendingList, userData, adminStats, inquiriesData] = await Promise.all([
        getPendingUsers(),
        getAllUsers({ limit: 50 }),
        getAdminStats(),
        adminAPI.getInquiries().catch(() => ({ data: { inquiries: [] } }))
      ]);

      setPendingUsers(pendingList || []);
      setUsers(userData.users || []);
      setStats(adminStats?.stats || null);
      
      const pendingInquiries = (inquiriesData?.data?.inquiries || []).filter(i => i.status === 'PENDING');
      setInquiries(pendingInquiries);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load admin dashboard.");
      console.error(err);
    } finally {
      loadAdminDataFinished();
    }
  };

  const loadAdminDataFinished = () => {
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionLoading(userId);
      setError("");
      setSuccess("");
      await changeUserRole(userId, newRole);
      setUsers((prev) => prev.map((item) => (item.id === userId ? { ...item, role: newRole } : item)));
      setSuccess("User role updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to change user role.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setActionLoading(userId);
      setError("");
      setSuccess("");
      await deleteUserById(userId);
      setUsers((prev) => prev.filter((item) => item.id !== userId));
      setSuccess("User deleted successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setActionLoading(userId);
      setError("");
      setSuccess("");
      await approveUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      setSuccess("User approved successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve user.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    try {
      setActionLoading(userId);
      setError("");
      setSuccess("");
      await rejectUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      setSuccess("User request rejected successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reject user request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleInquiryStatus = async (id, status) => {
    try {
      setActionLoading(`inquiry-${id}`);
      setError("");
      setSuccess("");
      await adminAPI.updateInquiryStatus(id, status);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setSuccess(`Inquiry ${status.toLowerCase()} successfully.`);
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${status.toLowerCase()} inquiry.`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.fullName || "").toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(userSearchQuery.toLowerCase());
    
    const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
    
    let matchesStatus = true;
    if (userStatusFilter === "ACTIVE") matchesStatus = u.isActive === true;
    if (userStatusFilter === "INACTIVE") matchesStatus = u.isActive === false;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredPendingUsers = pendingUsers.filter((user) => {
    if (pendingRoleFilter === "ALL") return true;
    const userRole = user.pendingRole || user.role;
    return userRole === pendingRoleFilter;
  });

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-secondary dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-subtle dark:text-slate-300 mb-2">{t("admin.loading")}</h2>
          <p className="text-text-muted dark:text-text-disabled">{t("admin.loadingDesc")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-secondary dark:bg-slate-900">
        <div className="text-center">
          <FiShield className="mx-auto h-16 w-16 text-text-disabled mb-4" />
          <h2 className="text-2xl font-bold text-text-subtle dark:text-slate-300 mb-2">{t("admin.authRequired")}</h2>
          <p className="text-text-muted dark:text-text-disabled">{t("admin.loginToAccess")}</p>
        </div>
      </div>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-secondary dark:bg-slate-900">
        <div className="text-center">
          <FiAlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-text-subtle dark:text-slate-300 mb-2">{t("admin.accessDenied")}</h2>
          <p className="text-text-muted dark:text-text-disabled mb-6">{t("admin.noPermission")}</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-primary-base transition-colors"><FiArrowLeft /> {t("admin.backToDashboard")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-text-muted dark:text-text-disabled">{t("admin.title")}</p>
            <h1 className="text-4xl font-black text-text-main dark:text-white">{t("admin.manageUsers")}</h1>
            <p className="mt-2 max-w-2xl text-text-subtle dark:text-text-disabled">{t("admin.manageDesc")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/products-dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-primary-base px-5 py-3 text-white shadow-lg transition hover:bg-primary-hover font-bold text-sm">{t("admin.prodDash")}</Link>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-lg transition hover:bg-slate-700 font-bold text-sm"><FiArrowLeft size={18} /> {t("admin.backDash")}</Link>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl bg-surface-card p-6 shadow-sm border border-border-default dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-primary-base dark:bg-emerald-900/20 dark:text-emerald-400"><FiUsers size={20} /></div>
              <div>
                <p className="text-sm text-text-muted dark:text-text-disabled">{t("admin.totalUsers")}</p>
                <p className="text-3xl font-bold text-text-main dark:text-white">{stats?.totalUsers ?? '-'}</p>
              </div>
            </div>
            <p className="text-sm text-text-muted dark:text-text-disabled">{t("admin.usersDesc")}</p>
          </div>
          <div className="rounded-3xl bg-surface-card p-6 shadow-sm border border-border-default dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"><FiFileText size={20} /></div>
              <div>
                <p className="text-sm text-text-muted dark:text-text-disabled">{t("admin.activeProducts")}</p>
                <p className="text-3xl font-bold text-text-main dark:text-white">{stats?.totalProducts ?? '-'}</p>
              </div>
            </div>
            <p className="text-sm text-text-muted dark:text-text-disabled">{t("admin.prodDesc")}</p>
          </div>
          <div className="rounded-3xl bg-surface-card p-6 shadow-sm border border-border-default dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"><FiClock size={20} /></div>
              <div>
                <p className="text-sm text-text-muted dark:text-text-disabled">{t("admin.pending")}</p>
                <p className="text-3xl font-bold text-text-main dark:text-white">{pendingUsers.length}</p>
              </div>
            </div>
            <p className="text-sm text-text-muted dark:text-text-disabled">{t("admin.pendingDesc")}</p>
          </div>
        </div>

        {error && <div className="rounded-3xl bg-rose-50 p-5 text-rose-700 border border-rose-100">{error}</div>}
        {success && <div className="rounded-3xl bg-primary-light p-5 text-emerald-700 border border-emerald-100">{success}</div>}

        <section className="rounded-3xl overflow-hidden bg-surface-card shadow-sm border border-border-default dark:bg-slate-800 dark:border-slate-700">
          <div className="border-b border-border-default px-6 py-5 dark:border-slate-700 bg-surface-secondary dark:bg-slate-900 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-main dark:text-white">{t("admin.usersTable")}</h2>
              <p className="text-sm text-text-muted dark:text-text-disabled">{t("admin.usersTableDesc")}</p>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-emerald-500 dark:text-white transition-colors"
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <CustomSelect
                  value={userRoleFilter}
                  onChange={setUserRoleFilter}
                  className="w-full sm:w-[140px]"
                  options={[
                    { value: "ALL", label: "All Roles" },
                    { value: "ADMIN", label: "Admin" },
                    { value: "FARMER", label: "Farmer" },
                    { value: "SUPPLIER", label: "Supplier" },
                    { value: "BUYER", label: "Buyer" },
                    { value: "AGRO_EXPERT", label: "Agro Expert" },
                  ]}
                />
                <CustomSelect
                  value={userStatusFilter}
                  onChange={setUserStatusFilter}
                  className="w-full sm:w-[140px]"
                  options={[
                    { value: "ALL", label: "All Statuses" },
                    { value: "ACTIVE", label: "Active" },
                    { value: "INACTIVE", label: "Inactive" },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-text-subtle dark:text-slate-300">
              <thead className="bg-surface-secondary text-text-muted uppercase tracking-[0.2em] text-xs dark:bg-slate-900 dark:text-text-disabled">
                <tr>
                  <th className="px-6 py-4 w-[25%]">{t("admin.tableName")}</th>
                  <th className="px-6 py-4 w-[30%]">{t("admin.tableEmail")}</th>
                  <th className="px-6 py-4 w-[15%]">{t("admin.tableRole")}</th>
                  <th className="px-6 py-4 w-[10%]">{t("admin.tableStatus")}</th>
                  <th className="px-6 py-4 w-[20%]">{t("admin.tableActions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-text-muted dark:text-text-disabled">
                      No users match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item) => (
                  <tr key={item.id} className="border-t border-border-default dark:border-slate-700">
                    <td className="px-6 py-4 font-semibold text-text-main dark:text-white">{item.fullName}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold px-3 py-1.5 rounded-full text-xs uppercase tracking-wide whitespace-nowrap">
                        {item.role === "ADMIN" ? t("admin.roleAdmin") :
                         item.role === "FARMER" ? t("admin.roleFarmer") :
                         item.role === "SUPPLIER" ? t("admin.roleSupplier") :
                         item.role === "BUYER" ? t("admin.roleBuyer") :
                         item.role === "AGRO_EXPERT" ? t("admin.roleExpert") :
                         t("admin.roleUnassigned")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold px-3 py-1.5 rounded-full text-xs uppercase tracking-wide whitespace-nowrap ${item.isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {item.isActive ? t("admin.statusActive") : t("admin.statusInactive")}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3 whitespace-nowrap">
                      <CustomSelect
                        value={item.role || ''}
                        onChange={(val) => handleRoleChange(item.id, val)}
                        className="w-[140px]"
                        options={[
                          { value: "", label: t("admin.selectRole") },
                          { value: "ADMIN", label: t("admin.roleAdmin") },
                          { value: "FARMER", label: t("admin.roleFarmer") },
                          { value: "SUPPLIER", label: t("admin.roleSupplier") },
                          { value: "BUYER", label: t("admin.roleBuyer") },
                          { value: "AGRO_EXPERT", label: t("admin.roleExpert") },
                        ]}
                      />
                      <button
                        onClick={() => handleDeleteUser(item.id)}
                        disabled={actionLoading === item.id}
                        className="flex items-center gap-2 rounded-2xl bg-rose-50 dark:bg-rose-500/10 px-4 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 transition-all hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        <FiTrash2 size={16} />
                        {t("admin.delete")}
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl overflow-hidden bg-surface-card shadow-sm border border-border-default dark:bg-slate-800 dark:border-slate-700">
          <div className="border-b border-border-default px-6 py-5 dark:border-slate-700 bg-surface-secondary dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-main dark:text-white">{t("admin.pendingRequests")}</h2>
              <p className="text-sm text-text-muted dark:text-text-disabled">{t("admin.pendingTableDesc")}</p>
            </div>
            <CustomSelect
              value={pendingRoleFilter}
              onChange={setPendingRoleFilter}
              className="w-full sm:w-[160px]"
              options={[
                { value: "ALL", label: "All Requests" },
                { value: "FARMER", label: "Farmer" },
                { value: "SUPPLIER", label: "Supplier" },
                { value: "AGRO_EXPERT", label: "Agro Expert" },
              ]}
            />
          </div>
          {filteredPendingUsers.length === 0 ? (
            <div className="p-10 text-center text-text-muted dark:text-text-disabled">{pendingUsers.length === 0 ? t("admin.noPending") : "No pending requests match this filter."}</div>
          ) : (
            <div className="space-y-4 p-6">
              {filteredPendingUsers.map((item) => {
                const isFarmer = item.role === "FARMER" || item.pendingRole === "FARMER";
                const isSupplier = item.role === "SUPPLIER" || item.pendingRole === "SUPPLIER";
                const isExpert = item.role === "AGRO_EXPERT" || item.pendingRole === "AGRO_EXPERT";

                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border-default bg-surface-secondary p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-text-main dark:text-white">{item.fullName}</h3>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isFarmer ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" :
                            isSupplier ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400" :
                            "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}>
                            {isFarmer ? "Farmer 🌾" : isSupplier ? "Supplier 📦" : "Expert 🎓"}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'pending_second_approval' ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400" :
                            item.status === 'pending_sensor' ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400" :
                            "bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-400"
                          }`}>
                            {item.status === 'pending_second_approval' ? "Pending Sensor ID Approval 📡" :
                             item.status === 'pending_sensor' ? "Waiting for Sensor ID 🔒" :
                             "Pending Profile Approval ⏳"}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted dark:text-text-disabled">{item.email} | {item.phone}</p>
                        
                        {isFarmer && item.FarmerProfile && (
                          <div className="mt-3 space-y-1.5 border-t border-border-default pt-3 text-xs text-text-subtle dark:border-slate-800 dark:text-text-disabled">
                            <p><strong>Sensor ID:</strong> <span className="bg-primary-light text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">{item.FarmerProfile.sensorId || "N/A"}</span></p>
                            <p><strong>Location:</strong> {item.FarmerProfile.location || "N/A"}</p>
                            <p><strong>Soil Type:</strong> {item.FarmerProfile.soilType || "N/A"}</p>
                            <p><strong>Farm Size:</strong> {item.FarmerProfile.farmSize || "N/A"}</p>
                          </div>
                        )}

                        {isSupplier && item.SupplierProfile && (
                          <div className="mt-3 space-y-1.5 border-t border-border-default pt-3 text-xs text-text-subtle dark:border-slate-800 dark:text-text-disabled">
                            <p><strong>Trade License:</strong> <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">{item.SupplierProfile.tradeLicense || "N/A"}</span></p>
                            <p><strong>Business Location:</strong> {item.SupplierProfile.location || "N/A"}</p>
                          </div>
                        )}

                        {isExpert && item.AgroExpertProfile && (
                          <div className="mt-3 space-y-1.5 border-t border-border-default pt-3 text-xs text-text-subtle dark:border-slate-800 dark:text-text-disabled">
                            <p><strong>{t("admin.degree")}:</strong> {item.AgroExpertProfile.academicDegree || t("admin.cvNA")}</p>
                            <p><strong>{t("admin.experience")}:</strong> {item.AgroExpertProfile.experienceYears ?? '0'} {t("admin.cvYears")}</p>
                            <p><strong>{t("admin.bio")}:</strong> {item.AgroExpertProfile.bio || t("admin.noBio")}</p>
                            {(item.AgroExpertProfile.cvFilePath || item.cv) && (
                              <p>
                                <strong>CV:</strong>{' '}
                                <a
                                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/${item.AgroExpertProfile.cvFilePath || item.cv}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-500 hover:underline font-bold"
                                >
                                  {t("admin.viewCv")}
                                </a>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          disabled={actionLoading === item.id}
                          onClick={() => handleApprove(item.id)}
                          className="rounded-2xl bg-emerald-500 px-4 py-2 text-white transition hover:bg-primary-base disabled:opacity-50 font-bold text-xs"
                        >
                          {t("admin.approve")}
                        </button>
                        <button
                          disabled={actionLoading === item.id}
                          onClick={() => handleReject(item.id)}
                          className="rounded-2xl bg-rose-500 px-4 py-2 text-white transition hover:bg-rose-600 disabled:opacity-50 font-bold text-xs"
                        >
                          {t("admin.reject")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* ───────────────────────────────────────────────────────── */}
        {/* PENDING QUOTE REQUESTS SECTION */}
        {/* ───────────────────────────────────────────────────────── */}
        <section className="rounded-3xl overflow-hidden bg-surface-card shadow-sm border border-border-default dark:bg-slate-800 dark:border-slate-700">
          <div className="border-b border-border-default px-6 py-5 dark:border-slate-700 bg-surface-secondary dark:bg-slate-900">
            <h2 className="text-xl font-bold text-text-main dark:text-white">Pending Quote Requests</h2>
            <p className="text-sm text-text-muted dark:text-text-disabled">Manage sensor quote inquiries from farmers and buyers.</p>
          </div>
          {inquiries.length === 0 ? (
            <div className="p-10 text-center text-text-muted dark:text-text-disabled">No pending quote requests.</div>
          ) : (
            <div className="space-y-4 p-6">
              {inquiries.map((inquiry) => (
                <motion.div key={`inquiry-${inquiry.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border-default bg-surface-secondary p-5 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-text-main dark:text-white">{inquiry.User?.fullName}</h3>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                          {inquiry.User?.role}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted dark:text-text-disabled">{inquiry.User?.email} | {inquiry.User?.phone}</p>
                      
                      <div className="mt-3 space-y-1.5 border-t border-border-default pt-3 text-xs text-text-subtle dark:border-slate-800 dark:text-text-disabled">
                        <p><strong>Product:</strong> {inquiry.Product?.title}</p>
                        <p><strong>Quantity:</strong> <span className="bg-primary-light text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">{inquiry.quantity}</span></p>
                        <p><strong>Location:</strong> {inquiry.location || "N/A"}</p>
                        <p><strong>Message:</strong> {inquiry.message}</p>
                        <p><strong>Date:</strong> {new Date(inquiry.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        disabled={actionLoading === `inquiry-${inquiry.id}`}
                        onClick={() => handleInquiryStatus(inquiry.id, 'ACCEPTED')}
                        className="rounded-2xl bg-emerald-500 px-4 py-2 text-white transition hover:bg-primary-base disabled:opacity-50 font-bold text-xs"
                      >
                        Accept
                      </button>
                      <button
                        disabled={actionLoading === `inquiry-${inquiry.id}`}
                        onClick={() => handleInquiryStatus(inquiry.id, 'REJECTED')}
                        className="rounded-2xl bg-rose-500 px-4 py-2 text-white transition hover:bg-rose-600 disabled:opacity-50 font-bold text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
