import React from 'react';
import { motion } from 'framer-motion';
import { LuDroplet, LuActivity, LuStore, LuUsers } from 'react-icons/lu';

const features = [
  {
    icon: <LuDroplet size={32} />,
    title: "Smart Dashboard",
    items: ["IoT Sensors", "Soil Moisture", "Temperature & Humidity", "Crop Health Monitoring", "Real-Time Analytics"],
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: <LuActivity size={32} />,
    title: "AI Assistant",
    items: ["Arabic & English Support", "Disease Detection", "Farming Recommendations", "Smart Decision Making"],
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    icon: <LuStore size={32} />,
    title: "Agri Marketplace",
    items: ["Verified Suppliers", "Transparent Pricing", "Farmer-to-Buyer Selling", "Product Listings"],
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: <LuUsers size={32} />,
    title: "Expert Network",
    items: ["Agricultural Specialists", "Real-Time Consultations", "Direct Communication"],
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
];

const StorySection = () => {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* The Problem */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-32"
        >
          <h2 className="text-4xl md:text-5xl font-black text-text-main dark:text-white mb-8 tracking-tight">
            The Problem We Solve
          </h2>
          <p className="text-xl md:text-2xl text-text-muted dark:text-slate-400 font-medium leading-relaxed">
            Egyptian farmers face water waste, crop diseases, lack of expert access, unclear market prices, and middleman exploitation.
            <br /><br />
            <span className="text-text-main dark:text-slate-200 font-bold">
              Most decisions are made using outdated methods. Zar3a changes that.
            </span>
          </p>
        </motion.div>

        {/* What We Built (Timeline/Showcase) */}
        <div className="space-y-24">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center text-text-main dark:text-white tracking-tight"
          >
            What We Built
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {features.map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-surface-card dark:bg-slate-900 border border-border-default dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-300`}>
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-black text-text-main dark:text-white mb-6">
                  {feat.title}
                </h3>
                <ul className="space-y-4">
                  {feat.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-muted dark:text-slate-300 font-semibold">
                      <div className={`w-2 h-2 rounded-full ${feat.color.replace('text', 'bg')} flex-shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default StorySection;
