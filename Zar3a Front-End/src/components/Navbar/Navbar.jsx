import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LuBell,
  LuUser,
  LuSun,
  LuMoon,
  LuMenu,
  LuX,
  LuLayoutDashboard,
  LuShoppingBag,
  LuUsers,
  LuMessageSquare,
  LuSettings,
  LuShield,
  LuLogOut,
  LuChevronDown,
  LuLanguages,
  LuLeaf,
} from "react-icons/lu";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../assets/Logo.png";

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout, unreadCount } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const { isDarkMode: isDark, toggleTheme } = useTheme();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLinkClick = () => {
    if (isSidebarOpen) {
      onToggleSidebar();
    }
  };

  const chatPath = user?.role === 'ADMIN'
    ? "/admin/chat"
    : user?.role === 'AGRO_EXPERT'
    ? "/consultations"
    : "/messages";

  const handleChatClick = (e) => {
    e.preventDefault();
    if (pathname === chatPath) {
      navigate(-1);
    } else {
      navigate(chatPath);
    }
  };

  const handleNotificationsClick = (e) => {
    e.preventDefault();
    if (pathname === "/notifications") {
      navigate(-1);
    } else {
      navigate("/notifications");
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get profile link based on user role
  const getProfileLink = () => {
    if (!user?.role && !user?.pendingRole) return null;
    const roleToUse = user.role || user.pendingRole;
    const profileMap = {
      'FARMER': '/profile/farmer',
      'BUYER': '/profile/buyer',
      'SUPPLIER': '/profile/supplier',
      'AGRO_EXPERT': '/profile/expert',
      'ADMIN': '/profile/admin',
    };
    return profileMap[roleToUse] || null;
  };

  const profileLink = getProfileLink();

  const navMap = {
    ADMIN: [
      { path: "/dashboard",          label: t("nav.dashboard"),        icon: <LuLayoutDashboard /> },
      { path: "/products-dashboard", label: t("nav.productDashboard"), icon: <LuLayoutDashboard /> },
      { path: "/crop-market",        label: t("nav.cropMarket"),       icon: <LuShoppingBag /> },
      { path: "/agri-shop",          label: t("nav.agriShop"),         icon: <LuShoppingBag /> },
      { path: "/experts",            label: t("nav.experts"),          icon: <LuUsers /> },
      { path: "/chatbot",            label: t("nav.aiAssistant"),      icon: <LuMessageSquare /> },
      { path: "/admin/chat",         label: t("admin.chatTitle") || "Messages", icon: <LuMessageSquare /> },
      { path: "/track-orders",       label: t("nav.trackOrder"),       icon: <LuShoppingBag /> },
      { path: "/admin",              label: t("nav.admin"),            icon: <LuShield /> },
    ],
    FARMER: [
      { path: "/dashboard",          label: t("nav.smartFarming"),     icon: <LuLayoutDashboard /> },
      { path: "/products-dashboard", label: t("nav.productDashboard"), icon: <LuLayoutDashboard /> },
      { path: "/crop-market",        label: t("nav.cropMarket"),       icon: <LuShoppingBag /> },
      { path: "/agri-shop",          label: t("nav.agriShop"),         icon: <LuShoppingBag /> },
      { path: "/experts",            label: t("nav.experts"),          icon: <LuUsers /> },
      { path: "/track-orders",       label: t("nav.trackOrder"),       icon: <LuShoppingBag /> },
    ],
    SUPPLIER: [
      { path: "/products-dashboard", label: t("nav.productDashboard"), icon: <LuLayoutDashboard /> },
      { path: "/crop-market",        label: t("nav.cropMarket"),       icon: <LuShoppingBag /> },
      { path: "/agri-shop",          label: t("nav.agriShop"),         icon: <LuShoppingBag /> },
      { path: "/experts",            label: t("nav.experts"),          icon: <LuUsers /> },
      { path: "/track-orders",       label: t("nav.trackOrder"),       icon: <LuShoppingBag /> },
    ],
    BUYER: [
      { path: "/crop-market", label: t("nav.cropMarket"), icon: <LuShoppingBag /> },
      { path: "/agri-shop",   label: t("nav.agriShop"),   icon: <LuShoppingBag /> },
      { path: "/track-orders", label: t("nav.trackOrder"), icon: <LuShoppingBag /> },
    ],
    AGRO_EXPERT: [
      { path: "/crop-market",   label: t("nav.cropMarket"),       icon: <LuShoppingBag /> },
      { path: "/agri-shop",     label: t("nav.agriShop"),         icon: <LuShoppingBag /> },
      { path: "/chatbot",       label: t("nav.aiAssistant"),      icon: <LuMessageSquare /> },
      { path: "/consultations", label: t("nav.consultations") || "Consultations", icon: <LuMessageSquare /> },
      { path: "/track-orders",  label: t("nav.trackOrder"),       icon: <LuShoppingBag /> },
    ],
  };

  const navItems = user
    ? navMap[user?.role] || [{ path: "/marketplace", label: t("nav.marketplace"), icon: <LuShoppingBag /> }]
    : [{ path: "/marketplace", label: t("nav.marketplace"), icon: <LuShoppingBag /> }];

  const allNavItems = navItems;

  return (
    <>
      <nav className="h-20 bg-surface-card/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-border-default dark:border-slate-800 px-4 md:px-8 flex justify-between items-center sticky top-0 z-[100] transition-all duration-500">

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Menu Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 sm:p-2.5 text-text-subtle dark:text-slate-300 bg-surface-secondary dark:bg-slate-800 rounded-xl hover:bg-primary-light dark:hover:bg-emerald-900/20 transition-all cursor-pointer"
            title="Toggle Menu"
          >
            {isSidebarOpen ? <LuX size={20} className="sm:w-[22px] sm:h-[22px]" /> : <LuMenu size={20} className="sm:w-[22px] sm:h-[22px]" />}
          </button>

          <Link to="/" className="group flex items-center gap-3 sm:gap-4" onClick={handleLinkClick}>
            <div className="relative flex items-center justify-center h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105">
              <img src={Logo} alt="Zar3a Logo" className="h-full w-auto object-contain drop-shadow-md dark:drop-shadow-[0_0_18px_rgba(16,185,129,0.9)] dark:brightness-150 dark:saturate-150" />
            </div>
            <div className="flex flex-col hidden sm:flex justify-center">
              <span className="text-2xl md:text-[28px] font-black font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 bg-[length:200%_auto] animate-gradient tracking-tight leading-none uppercase drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                Zar3a
              </span>
              <span className="hidden sm:block text-[10px] font-bold font-['Outfit'] text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] mt-1.5 dark:drop-shadow-[0_0_5px_rgba(148,163,184,0.3)]">
                {t("nav.smartAgri")}
              </span>
            </div>
          </Link>

        </div>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">

          {/* Subscribe Button (Farmer & Admin) */}
          {(['FARMER', 'ADMIN'].includes(user?.role) || user?.pendingRole === 'FARMER') && (
            <Link 
              to="/subscribe"
              onClick={handleLinkClick}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <LuShield size={16} /> {t("nav.subscribe")}
            </Link>
          )}

          {/* Utility Icons Group (Language, Theme, Chat, Notifications) */}
          <div className="flex items-center bg-surface-card/50 dark:bg-slate-800/80 backdrop-blur-md rounded-full p-1.5 border border-border-default/50 dark:border-slate-700/50 shadow-sm">
            
            {/* 🌐 Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLang}
              title={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
              className="flex items-center gap-1.5 px-3 py-2 text-text-subtle dark:text-slate-300 rounded-full hover:bg-surface-secondary dark:hover:bg-slate-700 hover:text-primary-base transition-colors font-bold text-xs"
            >
              <LuLanguages size={18} />
              <span className="hidden sm:inline">{t("lang.toggle")}</span>
            </motion.button>

            <div className="w-[1px] h-5 bg-border-default dark:bg-slate-700 mx-1"></div>

            {/* Dark/Light Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 text-text-muted dark:text-text-disabled rounded-full hover:bg-surface-secondary dark:hover:bg-slate-700 hover:text-primary-base transition-colors"
            >
              {isDark ? <LuSun size={18} className="text-yellow-400" /> : <LuMoon size={18} />}
            </motion.button>

            {user && (
              <>
                <div className="w-[1px] h-5 bg-border-default dark:bg-slate-700 mx-1"></div>
                
                {/* Chat Icon */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChatClick}
                  className="p-2 text-text-muted dark:text-text-disabled rounded-full hover:bg-surface-secondary dark:hover:bg-slate-700 hover:text-primary-base transition-colors relative" 
                  title={t("nav.chat") || "Chat"}
                >
                  <LuMessageSquare size={18} />
                </motion.button>

                {/* Notifications Icon */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNotificationsClick}
                  className="p-2 text-text-muted dark:text-text-disabled rounded-full hover:bg-surface-secondary dark:hover:bg-slate-700 hover:text-status-info transition-colors relative"
                  title={t("nav.notifications") || "Notifications"}
                >
                  <LuBell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-surface-card dark:border-slate-800 animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </motion.button>
              </>
            )}
          </div>

          {/* User Profile Dropdown or Login Button */}
          {user ? (
            <div className="relative" ref={profileDropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 pl-1.5 pr-3 sm:pr-4 py-1.5 bg-surface-card/50 dark:bg-slate-800/80 backdrop-blur-md text-text-subtle dark:text-slate-300 rounded-full border border-border-default/50 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:border-border-default dark:hover:border-slate-600 transition-all"
              >
                <div className="relative">
                  {user.profilePicture ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/${user.profilePicture.replace(/^\//, '')}`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white text-sm font-black shadow-inner">
                      {user.fullName?.charAt(0)}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface-card dark:border-slate-800"></div>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="font-bold text-sm leading-none text-text-main dark:text-white">
                    {user.fullName?.split(" ")[0]}
                  </span>
                  <span className="text-[10px] font-semibold text-text-muted dark:text-text-disabled uppercase tracking-wider mt-0.5">
                    {user.role}
                  </span>
                </div>
                <LuChevronDown size={16} className={`transition-transform duration-300 text-text-muted dark:text-text-disabled hidden sm:block ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-surface-card/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border-default/50 dark:border-slate-700/50 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="px-5 py-4 border-b border-border-default dark:border-slate-700/50 bg-surface-secondary/30 dark:bg-slate-900/30">
                      <p className="font-bold text-text-main dark:text-white truncate">{user.fullName}</p>
                      <p className="text-xs text-text-muted dark:text-text-disabled mt-0.5 truncate">{user.email}</p>
                    </div>

                    <nav className="p-2 space-y-1">
                      {profileLink && (
                        <Link
                          to={profileLink}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-subtle dark:text-slate-300 hover:bg-surface-secondary dark:hover:bg-slate-700/50 hover:text-primary-base transition-colors"
                        >
                          <LuUser size={18} className="text-text-muted dark:text-text-disabled" />
                          <span className="font-semibold text-sm">{t("nav.myProfile")}</span>
                        </Link>
                      )}

                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-subtle dark:text-slate-300 hover:bg-surface-secondary dark:hover:bg-slate-700/50 hover:text-primary-base transition-colors"
                        >
                          <LuShield size={18} className="text-text-muted dark:text-text-disabled" />
                          <span className="font-semibold text-sm">{t("nav.adminPanel") || "Admin Panel"}</span>
                        </Link>
                      )}

                      <Link
                        to="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-subtle dark:text-slate-300 hover:bg-surface-secondary dark:hover:bg-slate-700/50 hover:text-primary-base transition-colors"
                      >
                        <LuSettings size={18} className="text-text-muted dark:text-text-disabled" />
                        <span className="font-semibold text-sm">{t("nav.settings")}</span>
                      </Link>

                      <div className="h-px bg-border-default/50 dark:bg-slate-700/50 my-1 mx-2" />

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-start"
                      >
                        <LuLogOut size={18} className="text-red-500/70 dark:text-red-400/70" />
                        <span className="font-semibold text-sm">{t("nav.logout")}</span>
                      </button>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-primary-base text-white rounded-full hover:opacity-90 hover:shadow-lg transition-all font-black text-xs">
              <LuUser size={16} />
              <span className="hidden sm:inline">{t("nav.signIn")}</span>
              <span className="sm:hidden">Login</span>
            </Link>
          )}
        </div>
      </nav>

    </>
  );
};

export default Navbar;