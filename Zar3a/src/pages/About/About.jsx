import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import BeforeAfterSection from './components/BeforeAfterSection';
import TechnologySection from './components/TechnologySection';
import EcosystemSection from './components/EcosystemSection';
import VisionMission from './components/VisionMission';
import ValuesSection from './components/ValuesSection';
import ComparisonSection from './components/ComparisonSection';
import NumbersSection from './components/NumbersSection';
import EgyptMapSection from './components/EgyptMapSection';
import TeamSection from './components/TeamSection';
import CTASection from './components/CTASection';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { isDarkMode } = useTheme();

  // Master Background Transition based on scroll
  const darkColors = ["#0f172a", "#064e3b", "#1e1b4b", "#0f172a"]; // Slightly brighter, more vibrant dark mode
  const lightColors = ["#f1f5f9", "#d1fae5", "#e0e7ff", "#f1f5f9"]; // More noticeable, fresh light mode
  
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    isDarkMode ? darkColors : lightColors
  );

  return (
    <motion.div 
      ref={containerRef}
      style={{ backgroundColor }}
      className="overflow-x-hidden relative transition-colors duration-1000 ease-out"
    >
      <div className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <BeforeAfterSection />
        <TechnologySection />
        <EcosystemSection />
        <VisionMission />
        <ValuesSection />
        <ComparisonSection />
        <NumbersSection />
        <EgyptMapSection />
        <TeamSection />
        <CTASection />
      </div>
    </motion.div>
  );
}
