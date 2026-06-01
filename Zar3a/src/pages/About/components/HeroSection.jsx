import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ambientLight intensity={1} />
          <directionalLight position={[1, 2, 3]} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          <Sphere args={[1, 100, 200]} scale={2.5}>
            <MeshDistortMaterial 
              color="#10b981"
              attach="material"
              distort={0.4}
              speed={1.5}
              roughness={0.2}
            />
          </Sphere>
        </Canvas>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl font-['Outfit']">
            Your Soil's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-lg">Sixth Sense.</span>
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-lg md:text-2xl text-slate-800 dark:text-slate-200 font-medium max-w-3xl mx-auto drop-shadow-md font-['Outfit']"
        >
          Egypt's intelligent agricultural network. We connect farmers, suppliers, experts, and AI to eliminate guesswork from farming.
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
