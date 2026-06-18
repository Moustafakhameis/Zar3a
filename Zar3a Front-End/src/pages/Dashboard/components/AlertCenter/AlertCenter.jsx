import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import { createPortal } from "react-dom";
import {
  LuX,
  LuSearch,
  LuArchive,
  LuCircleCheck,
  LuCheck,
  LuFilter
} from "react-icons/lu";
import AlertCard from "./AlertCard";
import AlertDetailsModal from "./AlertDetailsModal";

const CATEGORIES = ["All", "Critical", "Warning", "Information", "Resolved"];

const AlertCenter = ({
  isOpen,
  onClose,
  alerts,
  markAsRead,
  markAllAsRead,
  archiveAlert,
  unarchiveAlert,
  t // Optional: if using i18n
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Filter alerts based on search, category, and archived state
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Archived filter
      if (showArchived ? !alert.isArchived : alert.isArchived) return false;
      // Category filter
      if (activeCategory !== "All" && alert.category !== activeCategory) return false;
      // Search filter
      if (
        searchQuery &&
        !alert.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.msg.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [alerts, searchQuery, activeCategory, showArchived]);

  // Virtualizer setup
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredAlerts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height of AlertCard
    overscan: 5,
  });

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 top-20 bg-black/20 backdrop-blur-sm z-[90]"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-[92px] right-4 bottom-4 w-[calc(100%-2rem)] max-w-md bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-[90] flex flex-col border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-border-default dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-base/10 dark:bg-emerald-900/30 text-primary-base dark:text-emerald-400 rounded-xl">
                    <LuCircleCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-text-main dark:text-white tracking-tight leading-none">
                      Alert Center
                    </h2>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                      System Monitoring
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="p-2 text-text-muted hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full transition-all"
                    title="Mark all as read"
                  >
                    <LuCheck size={20} />
                  </button>
                  <button
                    onClick={() => setShowArchived(!showArchived)}
                    className={`p-2 rounded-full transition-all ${
                      showArchived 
                        ? "text-primary-base bg-primary-light dark:bg-green-900/30" 
                        : "text-text-muted hover:bg-surface-secondary dark:hover:bg-slate-800"
                    }`}
                    title="Toggle Archived"
                  >
                    <LuArchive size={20} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full transition-all ml-2"
                  >
                    <LuX size={20} />
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="p-5 pb-3 space-y-4">
                {/* Search */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-base transition-colors">
                    <LuSearch size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all font-medium"
                  />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        activeCategory === cat
                          ? "bg-primary-base text-white shadow-sm"
                          : "bg-surface-secondary dark:bg-slate-800 text-text-muted hover:text-text-main dark:hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Virtualized List Container */}
              <div
                ref={parentRef}
                className="flex-1 overflow-y-auto px-5 py-2 custom-scrollbar"
              >
                {filteredAlerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <LuCircleCheck size={48} className="text-emerald-500 mb-4" />
                    <p className="text-lg font-black dark:text-white">All clear!</p>
                    <p className="text-sm font-bold text-text-muted mt-1">
                      No alerts match your criteria.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                      const alert = filteredAlerts[virtualItem.index];
                      return (
                        <div
                          key={alert.id}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start}px)`,
                            paddingBottom: "12px", // spacing between cards
                          }}
                        >
                          <AlertCard
                            alert={alert}
                            onRead={() => markAsRead(alert.id)}
                            onArchive={() => archiveAlert(alert.id)}
                            onUnarchive={() => unarchiveAlert(alert.id)}
                            onClick={() => {
                              markAsRead(alert.id);
                              setSelectedAlert(alert);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AlertDetailsModal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        alert={selectedAlert}
      />
    </>,
    document.body
  );
};

export default AlertCenter;
