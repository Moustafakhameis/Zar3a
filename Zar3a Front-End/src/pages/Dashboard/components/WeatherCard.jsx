import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { LuCloudSun, LuMapPin, LuWind, LuDroplet } from "react-icons/lu";
import LiveClock from "../../../components/LiveClock/LiveClock";

const WeatherCard = ({ t, weather, isWeatherLoading, setSelectedAiCrop, cropsData }) => {
  return (
    <div className="lg:col-span-4 grid grid-cols-1 gap-4">
      <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 text-slate-900 dark:text-white flex flex-col shadow-2xl h-full border border-slate-200 dark:border-white/10 group">
        
        {/* Dynamic Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[120%] h-[120%] bg-linear-to-br from-indigo-300/40 dark:from-indigo-500/40 via-purple-300/20 dark:via-purple-500/20 to-transparent blur-[80px] -translate-y-1/4 translate-x-1/4 group-hover:scale-110 transition-transform duration-1000 ease-out"></div>
        <div className="absolute bottom-0 left-0 w-[100%] h-[100%] bg-linear-to-tr from-cyan-300/30 dark:from-cyan-500/30 to-transparent blur-[60px] translate-y-1/4 -translate-x-1/4 group-hover:scale-110 transition-transform duration-1000 ease-out"></div>

        {/* Top Row: Label & Spinner */}
        <div className="relative z-10 flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 dark:border-white/10 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)] dark:shadow-[0_0_10px_rgba(74,222,128,1)]"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white/90">
              {t("dash.liveClimate")}
            </p>
          </div>
          <AnimatePresence>
            {isWeatherLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <ClipLoader size={20} color="#10b981" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Middle Row: Centered Big Temp & Data */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-auto pt-2 pb-2">
          
          {/* Temperature & Weather Condition */}
          <div className="flex flex-col items-center gap-0">
            {/* Weather Condition */}
            <div className="flex items-center gap-2 bg-white/40 dark:bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/60 dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.08)] mb-1 transition-transform hover:scale-105 cursor-default">
              <LuCloudSun className="text-xl text-yellow-500 dark:text-yellow-300 drop-shadow-md" />
              <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.15em] drop-shadow-sm">
                {t("weather." + weather.condition) || weather.condition}
              </p>
            </div>

            {/* Temperature */}
            <div className="flex items-start">
              <h4 className="text-[6rem] lg:text-[7rem] font-black tracking-tighter leading-none drop-shadow-2xl dark:drop-shadow-[0_15px_35px_rgba(0,0,0,0.4)] text-slate-900 dark:text-white ml-4">
                {weather.temp}
              </h4>
              <span className="text-3xl lg:text-4xl font-black text-slate-400 dark:text-white/40 mt-4 ml-1.5">°C</span>
            </div>
          </div>

          {/* Extended Data & Clock Stack */}
          <div className="flex flex-col items-center gap-5 mt-4 w-full">
            
            {/* Time & Date */}
            <div className="flex flex-col items-center justify-center gap-1">
              <LiveClock format="time" className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none drop-shadow-md" />
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300 drop-shadow-sm">
                <LiveClock format="weekday" />
                <span className="text-slate-400 dark:text-white/30">•</span>
                <LiveClock format="date" />
              </div>
            </div>

            {/* Actual Weather Metrics */}
            <div className="flex items-center justify-center gap-4 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-fit transition-all hover:scale-[1.02]">
              
              {/* High/Low */}
              <div className="flex flex-col items-center">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-1">H / L</p>
                <p className="text-sm font-black text-slate-800 dark:text-white drop-shadow-sm whitespace-nowrap">
                  {weather.tempMax}° <span className="text-slate-400 dark:text-white/40 font-bold mx-0.5">/</span> {weather.tempMin}°
                </p>
              </div>

              <div className="w-px h-8 bg-slate-300 dark:bg-white/10"></div>

              {/* Humidity */}
              <div className="flex flex-col items-center">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-1">Humidity</p>
                <div className="flex items-center gap-1 text-sm font-black text-blue-600 dark:text-blue-400 drop-shadow-sm">
                  <LuDroplet size={14} />
                  {weather.humidity}%
                </div>
              </div>

              <div className="w-px h-8 bg-slate-300 dark:bg-white/10"></div>

              {/* Wind */}
              <div className="flex flex-col items-center">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-1">Wind</p>
                <div className="flex items-center gap-1 text-sm font-black text-teal-600 dark:text-teal-400 drop-shadow-sm whitespace-nowrap">
                  <LuWind size={14} />
                  {weather.windspeed} <span className="text-[9px] ml-0.5">km/h</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* AI Suggestion Banner (Takes up the empty space) */}
        <div className="relative z-10 w-full mt-12 mb-6">
          <div 
            className="group/banner w-full bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/40 transition-all cursor-pointer border border-white/60 dark:border-white/10 rounded-[2rem] p-6 backdrop-blur-xl flex flex-row items-center justify-between shadow-xl"
            onClick={() => setSelectedAiCrop(weather.bestCrop)}
          >
             <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">
                      ✨ {t("dash.aiSuggested")}
                   </span>
                </div>
                <span className="text-4xl font-black text-slate-900 dark:text-white drop-shadow-sm tracking-tight mb-1">
                  {t("crop." + weather.bestCrop) || weather.bestCrop}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {t("dash.maxYieldProb")}
                </span>
             </div>
             
             <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white/80 dark:border-white/10 group-hover/banner:scale-110 group-hover/banner:-rotate-12 transition-transform duration-500">
                {cropsData[weather.bestCrop]?.icon}
             </div>
          </div>
        </div>

        {/* Bottom Row: Location */}
        <div className="relative z-10 pt-4 border-t border-slate-300/50 dark:border-white/10 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-1.5">
              {t("dash.region")}
            </p>
            <div className="flex items-center gap-1.5">
              <LuMapPin className="text-cyan-600 dark:text-cyan-400" size={16} />
              <p className="font-bold text-base text-slate-800 dark:text-white tracking-tight drop-shadow-sm">
                {t("reg." + weather.region) || weather.region}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
