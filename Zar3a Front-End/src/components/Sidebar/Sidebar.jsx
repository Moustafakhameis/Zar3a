import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  FcDataSheet,
  FcShop,
  FcConferenceCall,
  FcAssistant,
  FcAdvertising,
  FcSettings,
  FcShipped,
  FcPrivacy,
  FcExport,
  FcManager,
  FcCancel,
  FcAbout,
  FcHome,
} from "react-icons/fc";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size to switch layout modes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

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
  const menuItems = [];

  // Home: Only when NOT logged in
  if (!user) {
    menuItems.push({ path: "/", label: t("nav.home") || "Home", icon: <FcHome /> });
  }

  // Dashboard: Only for FARMER, ADMIN (NOT for EXPERT, SUPPLIER, or BUYER)
  if (user?.role && !['AGRO_EXPERT', 'SUPPLIER', 'BUYER'].includes(user.role)) {
    menuItems.push({ path: "/dashboard", label: t("nav.dashboard"), icon: <FcDataSheet /> });
  }

  // AI Assistant: Hide from unregistered users
  if (user?.role) {
    menuItems.push({ path: "/chatbot", label: t("nav.aiAssistant"), icon: <FcAssistant /> });
  }

  // Marketplace: Everyone (including unregistered)
  menuItems.push({ path: "/marketplace", label: t("nav.marketplace"), icon: <FcShop /> });

  // About: Only when NOT logged in
  if (!user) {
    menuItems.push({ path: "/about", label: t("nav.aboutUs") || "About Us", icon: <FcAbout /> });
  }

  // Track Orders: For all registered users
  if (user?.role) {
    menuItems.push({ path: "/track-orders", label: t("nav.trackOrders"), icon: <FcShipped /> });
  }



  // Experts: Hide from BUYER and unregistered users
  if (user?.role && user.role !== 'BUYER') {
    menuItems.push({ path: "/experts", label: t("nav.experts"), icon: <FcConferenceCall /> });
  }


  // Animation variants
  const mobileVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" }
  };

  // Create a reusable internal JSX element for the sidebar content
  const sidebarContent = (
    <>
      {/* Menu Items */}
      <div className="p-4 flex-1 space-y-2 overflow-y-auto">
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="px-4 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2"
        >
          {t("nav.mainMenu")}
        </motion.p>
        {menuItems.map((item, i) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 + 0.1, duration: 0.3, ease: "easeOut" }}
            whileHover={{ x: 6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            whileTap={{ scale: 0.98 }}
          >
            <NavLink
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              className="relative block"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute inset-0 bg-primary-light dark:bg-emerald-900/30 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div
                    className={`relative z-10 flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                      isActive
                        ? "text-primary-base dark:text-emerald-400 font-bold"
                        : "text-text-subtle dark:text-text-disabled hover:bg-surface-secondary/50 dark:hover:bg-slate-800/50 hover:text-primary-hover"
                    }`}
                  >
                    <motion.span 
                      className="text-xl shrink-0"
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span>{item.label}</span>
                  </div>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border-default dark:border-slate-800 space-y-1">
        {/* My Profile - Mobile Only */}
        {isMobile && user && profileLink && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ x: 6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            whileTap={{ scale: 0.98 }}
          >
            <NavLink
              to={profileLink}
              onClick={onClose}
              className="relative block"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute inset-0 bg-primary-light dark:bg-emerald-900/30 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div
                    className={`relative z-10 flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                      isActive ? "text-primary-base font-bold" : "text-text-subtle dark:text-text-disabled hover:bg-surface-secondary/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <motion.span whileHover={{ scale: 1.15 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className="text-2xl shrink-0">
                      <FcManager />
                    </motion.span>
                    <span>{t("nav.myProfile")}</span>
                  </div>
                </>
              )}
            </NavLink>
          </motion.div>
        )}

        {/* Settings (Desktop + Mobile) */}
        {user?.role && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ x: 6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            whileTap={{ scale: 0.98 }}
          >
            <NavLink
              to="/settings"
              onClick={isMobile ? onClose : undefined}
              className="relative block"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute inset-0 bg-primary-light dark:bg-emerald-900/30 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div
                    className={`relative z-10 flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                      isActive ? "text-primary-base font-bold" : "text-text-subtle dark:text-text-disabled hover:bg-surface-secondary/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <motion.span whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="text-2xl shrink-0">
                      <FcSettings />
                    </motion.span>
                    <span>{t("nav.settings")}</span>
                  </div>
                </>
              )}
            </NavLink>
          </motion.div>
        )}

        {/* Logout/Sign In - Mobile Only */}
        {isMobile && (
          user ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-status-danger dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300 text-start font-bold cursor-pointer"
              >
                <motion.span whileHover={{ x: 5 }} transition={{ duration: 0.3 }} className="text-2xl shrink-0">
                  <FcExport />
                </motion.span>
                <span>{t("nav.logout")}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavLink
                to="/login"
                onClick={onClose}
                className="relative block"
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        className="absolute inset-0 bg-primary-light dark:bg-emerald-900/30 rounded-xl"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <div
                      className={`relative z-10 flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                        isActive ? "text-primary-base font-bold" : "text-text-subtle dark:text-slate-300 hover:bg-surface-secondary/50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <motion.span whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} className="text-2xl shrink-0">
                        <FcManager />
                      </motion.span>
                      <span>{t("nav.signIn")}</span>
                    </div>
                  </>
                )}
              </NavLink>
            </motion.div>
          )
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar (Uses Framer Motion for slide-in) */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.aside
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 start-0 z-50 w-64 bg-surface-card dark:bg-slate-900 border-e border-border-default dark:border-slate-800 flex flex-col shadow-2xl overflow-hidden h-full"
          >
            {/* Mobile Header with Close Button */}
            <div className="p-4 border-b border-border-default dark:border-slate-800 flex justify-between items-center shrink-0">
              <span className="font-black text-lg text-primary-base uppercase tracking-wider">Zar3a</span>
              <button 
                onClick={onClose}
                className="p-2 bg-surface-secondary dark:bg-slate-800 rounded-xl text-text-muted hover:text-status-danger transition-colors cursor-pointer"
              >
              <FcCancel size={22} />
            </button>
            </div>
            
            {/* Inner Content JSX */}
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Uses smooth CSS transition for width to prevent lag) */}
      {!isMobile && (
        <aside
          className={`h-full bg-surface-card dark:bg-slate-900 border-e border-border-default dark:border-slate-800 transition-[width,opacity] duration-300 ease-in-out overflow-hidden shrink-0 z-30 ${
            isOpen ? "w-64 opacity-100" : "w-0 opacity-0 border-transparent"
          }`}
        >
          {/* Fixed width container prevents contents from text-wrapping and lagging the browser while the parent aside shrinks */}
          <div className="w-64 h-full flex flex-col">
            {sidebarContent}
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;