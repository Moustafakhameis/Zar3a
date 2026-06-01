import React from 'react';
import { motion } from 'framer-motion';

import moustafaImg from '../../../assets/Pictures/Moustafa Alaa Mohamed Rady.JPG';
import mostafaImg from '../../../assets/Pictures/Mostafa Ali Emam.PNG';
import ahmedImg from '../../../assets/Pictures/Ahmed Amr Abdelazim Dekhil.jpg';
import sandyImg from '../../../assets/Pictures/Sandy Ehab Elsayed.jpg';
import husseinImg from '../../../assets/Pictures/Mohamed Ahmed Hussein Sayed.jpg';
import tolbaImg from '../../../assets/Pictures/Mohamed Amr Mohamed Tolba.jpg';
import kerolosImg from '../../../assets/Pictures/Kerolos Samir Abd-Elmalak Ghattas.JPG';

const tier1 = [
  { name: "Moustafa Alaa Mohamed Rady", role: "Team Leader & Business Development", image: moustafaImg, desc: "Driving strategic partnerships across the agricultural sector.", pos: "object-top" }
];

const tier2 = [
  { name: "Mostafa Ali Emam", role: "Front-End Developer", image: mostafaImg, desc: "Architecting the core Zar3a ecosystem and user interfaces.", pos: "object-top" },
  { name: "Ahmed Amr Abdelazim Dekhil", role: "Back-End Developer", image: ahmedImg, desc: "Building scalable infrastructure and AI data pipelines.", pos: "object-center" }
];

const tier3 = [
  { name: "Sandy Ehab Elsayed", role: "Front-End Developer", image: sandyImg, desc: "Crafting premium, accessible user interfaces for farmers.", pos: "object-center" },
  { name: "Mohamed Ahmed Hussein Sayed", role: "Business Development", image: husseinImg, desc: "Expanding market reach and onboard verified suppliers.", pos: "object-top" },
  { name: "Mohamed Amr Mohamed Tolba", role: "System Analyst", image: tolbaImg, desc: "Analyzing data flows and optimizing the smart dashboard.", pos: "object-top" },
  { name: "Kerolos Samir Abd-Elmalak Ghattas", role: "System Analyst", image: kerolosImg, desc: "Ensuring seamless integration between hardware and software.", pos: "object-top" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 20 } 
  }
};

const TeamCard = ({ member, isLeader }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -15, scale: 1.05, rotateY: 5 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className={`relative bg-white dark:bg-slate-900/50 backdrop-blur-xl border ${isLeader ? 'border-emerald-500/50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]' : 'border-slate-200 dark:border-white/10'} rounded-3xl p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300 group h-full`}
  >
    {/* Continuous pulsing ring for the leader */}
    {isLeader && (
      <div className="absolute inset-0 border-2 border-emerald-500 rounded-3xl animate-pulse opacity-50 pointer-events-none" />
    )}

    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-slate-50 dark:border-slate-800 shadow-xl group-hover:scale-110 group-hover:shadow-emerald-500/40 transition-all duration-500 z-10">
      <div className="absolute inset-0 bg-emerald-500/30 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      <img 
        src={member.image} 
        alt={member.name} 
        className={`w-full h-full object-cover block filter grayscale group-hover:grayscale-0 transition-all duration-500 ${member.pos || 'object-center'}`}
      />
    </div>
    <motion.h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight relative z-10">
      {member.name}
    </motion.h3>
    <motion.p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider relative z-10">
      {member.role}
    </motion.p>
    <motion.p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10">
      {member.desc}
    </motion.p>
  </motion.div>
);

const ConnectorLine = ({ delay }) => (
  <motion.div 
    initial={{ height: 0, opacity: 0 }}
    whileInView={{ height: 48, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1, delay: delay, ease: "easeOut" }}
    className="w-1 bg-gradient-to-b from-emerald-500/50 to-emerald-500/0 rounded-full"
  />
);

const TeamSection = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating animated blobs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            The Minds Behind Zar3a
          </h2>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            A multidisciplinary team dedicated to revolutionizing agriculture.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center gap-6"
        >
          {/* Tier 1 - Leadership */}
          <div className="w-full max-w-sm mx-auto">
            {tier1.map((member, idx) => <TeamCard key={`t1-${idx}`} member={member} isLeader={true} />)}
          </div>

          {/* Connection to Tier 2 */}
          <ConnectorLine delay={0.4} />

          {/* Tier 2 - Leads */}
          <div className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            {tier2.map((member, idx) => <TeamCard key={`t2-${idx}`} member={member} />)}
          </div>

          {/* Connection to Tier 3 */}
          <ConnectorLine delay={0.6} />

          {/* Tier 3 - Core Team */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tier3.map((member, idx) => <TeamCard key={`t3-${idx}`} member={member} />)}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
