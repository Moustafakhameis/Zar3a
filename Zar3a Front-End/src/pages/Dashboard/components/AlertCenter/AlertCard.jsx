import React from "react";
import {
  LuTriangleAlert,
  LuOctagonAlert,
  LuInfo,
  LuArchive,
  LuArchiveRestore,
  LuCircleCheck
} from "react-icons/lu";

// Utility for formatting time nicely
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / 60000);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

const AlertCard = ({ alert, onRead, onArchive, onUnarchive, onClick }) => {
  const { category, title, msg, time, isRead, isArchived } = alert;

  // Determine styling based on category
  let icon = <LuInfo size={20} />;
  let colorClass = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
  let borderClass = "border-blue-200 dark:border-blue-800/50";
  let indicatorColor = "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]";

  switch (category) {
    case "Critical":
      icon = <LuOctagonAlert size={20} />;
      colorClass = "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      borderClass = "border-red-200 dark:border-red-800/50";
      indicatorColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";
      break;
    case "Warning":
      icon = <LuTriangleAlert size={20} />;
      colorClass = "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      borderClass = "border-amber-200 dark:border-amber-800/50";
      indicatorColor = "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]";
      break;
    case "Information":
      icon = <LuInfo size={20} />;
      colorClass = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      borderClass = "border-blue-200 dark:border-blue-800/50";
      indicatorColor = "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]";
      break;
    case "Resolved":
      icon = <LuCircleCheck size={20} />;
      colorClass = "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
      borderClass = "border-emerald-200 dark:border-emerald-800/50";
      indicatorColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
      break;
    default:
      break;
  }

  return (
    <div
      onClick={onClick}
      className={`h-[110px] relative group cursor-pointer p-4 rounded-xl flex items-center gap-4 transition-all border overflow-hidden ${
        isRead
          ? "bg-surface-secondary/50 dark:bg-slate-800/40 border-transparent"
          : `bg-white dark:bg-slate-800 shadow-sm border-gray-100 dark:border-slate-700`
      }`}
    >
      {/* Unread Indicator */}
      {!isRead && (
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full ${indicatorColor}`} />
      )}

      {/* Icon */}
      <div className={`shrink-0 p-2.5 rounded-2xl border h-fit ${colorClass} ${borderClass}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-1 gap-2">
          <h4 className={`font-bold truncate text-[15px] leading-tight ${isRead ? "text-text-muted dark:text-gray-400" : "text-text-main dark:text-white"}`}>
            {title}
          </h4>
          <div className="relative flex items-center justify-end shrink-0 w-[84px] h-[28px]">
            <span className={`absolute right-0 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-opacity duration-200 group-hover:opacity-0 ${isRead ? "text-text-disabled" : "text-text-muted dark:text-gray-400"}`}>
              {formatTimeAgo(time)}
            </span>
            <div className="absolute right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {!isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead();
                  }}
                  className="p-1.5 text-text-muted hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                  title="Mark as Read"
                >
                  <LuCircleCheck size={15} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isArchived ? onUnarchive() : onArchive();
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isArchived 
                    ? "text-primary-base hover:bg-primary-base/10 dark:hover:bg-emerald-900/30" 
                    : "text-text-muted hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                }`}
                title={isArchived ? "Unarchive Alert" : "Archive Alert"}
              >
                {isArchived ? <LuArchiveRestore size={15} /> : <LuArchive size={15} />}
              </button>
            </div>
          </div>
        </div>
        <p className={`text-[13px] font-medium line-clamp-2 leading-relaxed ${isRead ? "text-text-disabled" : "text-text-muted dark:text-gray-300"}`}>
          {msg}
        </p>
      </div>
    </div>
  );
};

export default AlertCard;
