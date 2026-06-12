import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

const LiveClock = ({ format = 'time', className = "" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar-EG" : "en-US";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (format === 'weekday') {
    return <span className={className}>{currentTime.toLocaleDateString(locale, { weekday: 'long' })}</span>;
  }
  if (format === 'date') {
    return <span className={className}>{currentTime.toLocaleDateString(locale, { month: 'short', day: 'numeric' })}</span>;
  }
  if (format === 'time-with-seconds') {
    return (
      <span className={className}>
        {currentTime.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })}
      </span>
    );
  }

  return (
    <span className={className}>
      {currentTime.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
};

export default LiveClock;
