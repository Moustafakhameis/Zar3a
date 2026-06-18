import { useState, useCallback, useMemo } from 'react';

// Categories: "Critical", "Warning", "Information", "Resolved"
const initialAlerts = [
  {
    id: 1,
    category: "Critical",
    title: "Soil Moisture Below Safe Range",
    msg: "Sector A moisture dropped to 15%. Irrigation needed immediately.",
    time: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
    isRead: false,
    isArchived: false,
  },
  {
    id: 2,
    category: "Warning",
    title: "pH Approaching Threshold",
    msg: "Sector B soil pH is at 7.4. Max optimal is 7.5.",
    time: new Date(Date.now() - 30 * 60000).toISOString(), // 30 mins ago
    isRead: false,
    isArchived: false,
  },
  {
    id: 3,
    category: "Resolved",
    title: "Irrigation Restored",
    msg: "Water pump successfully activated. Moisture levels rising.",
    time: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    isRead: true,
    isArchived: false,
  },
  {
    id: 4,
    category: "Information",
    title: "System Booted Successfully",
    msg: "Telemetry services initialized correctly.",
    time: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
    isRead: true,
    isArchived: true,
  }
];

export const useAlerts = () => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const addAlert = useCallback((category, title, msg) => {
    setAlerts((prev) => [
      {
        id: Date.now() + Math.random(),
        category,
        title,
        msg,
        time: new Date().toISOString(),
        isRead: false,
        isArchived: false,
      },
      ...prev,
    ].slice(0, 500)); // Keep last 500
  }, []);

  const markAsRead = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
  }, []);

  const archiveAlert = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, isArchived: true } : alert))
    );
  }, []);

  const unarchiveAlert = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, isArchived: false } : alert))
    );
  }, []);

  const unreadCount = useMemo(() => {
    return alerts.filter((a) => !a.isRead && !a.isArchived).length;
  }, [alerts]);

  return {
    alerts,
    addAlert,
    markAsRead,
    markAllAsRead,
    archiveAlert,
    unarchiveAlert,
    unreadCount,
  };
};
