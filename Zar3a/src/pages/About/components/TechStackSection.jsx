import React from 'react';
import { motion } from 'framer-motion';
import { LuLayoutDashboard, LuServer, LuDatabase, LuNetwork } from 'react-icons/lu';

const stack = [
  {
    category: "Frontend",
    icon: LuLayoutDashboard,
    items: ["React 19", "Vite", "Tailwind CSS 4", "Framer Motion", "React Three Fiber"]
  },
  {
    category: "Backend",
    icon: LuServer,
    items: ["Node.js", "Express.js"]
  },
  {
    category: "Database",
    icon: LuDatabase,
    items: ["MySQL", "Prisma", "Sequelize"]
  },
  {
    category: "Integrations",
    icon: LuNetwork,
    items: ["Groq AI", "Stripe", "IoT Sensors", "JWT Auth", "Nodemailer"]
  }
];

const TechStackSection = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Built For Scale
          </h2>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            We leverage bleeding-edge technologies to ensure real-time performance and maximum reliability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 200 }}
              className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] hover:border-emerald-500/50 transition-colors duration-300 relative overflow-hidden group"
            >
              {/* Animated background blob on hover */}
              <div className="absolute -inset-x-0 -bottom-32 h-32 bg-emerald-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <group.icon size={24} />
                </div>
                {group.category}
              </h3>
              
              <ul className="space-y-4 relative z-10">
                {group.items.map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (idx * 0.1) + (i * 0.1) + 0.3 }}
                    viewport={{ once: true }}
                    className="text-slate-600 dark:text-slate-300 font-bold flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-emerald-500 group-hover:scale-150 transition-all duration-300" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
