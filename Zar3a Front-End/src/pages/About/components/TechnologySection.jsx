import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, Cylinder, Sphere, Environment, RoundedBox, Box } from '@react-three/drei';
import { motion } from 'framer-motion';

const SmartNode = () => {
  const groupRef = useRef(null);
  const [hoveredPart, setHoveredPart] = useState(null);

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        
        {/* Main Enclosure (Hover: AI Processing) */}
        <group 
          position={[0, 0.5, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredPart('core'); }}
          onPointerOut={() => setHoveredPart(null)}
          className="cursor-pointer"
        >
          <RoundedBox args={[1.2, 1.8, 1.2]} radius={0.15} smoothness={4}>
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
          </RoundedBox>
          
          {/* LED Indicator */}
          <Sphere args={[0.08, 16, 16]} position={[0, 0.4, 0.61]}>
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
          </Sphere>

          {/* Branding Logo Placeholder */}
          <Sphere args={[0.15, 16, 16]} position={[0, -0.2, 0.6]}>
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
          </Sphere>

          {hoveredPart === 'core' && (
            <Html position={[1.5, 0, 0]} center>
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 p-4 rounded-2xl shadow-2xl text-slate-900 dark:text-white text-xs font-bold whitespace-nowrap z-50">
                <div className="text-emerald-500 mb-1 uppercase tracking-widest text-[10px]">Main Brain</div>
                Edge AI Data Processing
              </div>
            </Html>
          )}
        </group>

        {/* Solar Panel (Hover: Power) */}
        <group 
          position={[0, 1.45, 0]} 
          rotation={[0.2, 0, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredPart('solar'); }}
          onPointerOut={() => setHoveredPart(null)}
          className="cursor-pointer"
        >
          <RoundedBox args={[1.6, 0.1, 1.6]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.3} />
          </RoundedBox>
          <Box args={[1.4, 0.11, 1.4]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
          </Box>
          {hoveredPart === 'solar' && (
            <Html position={[1.5, 0.5, 0]} center>
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-yellow-500/50 p-4 rounded-2xl shadow-2xl text-slate-900 dark:text-white text-xs font-bold whitespace-nowrap z-50">
                <div className="text-yellow-500 mb-1 uppercase tracking-widest text-[10px]">Power Source</div>
                Continuous Solar Charging
              </div>
            </Html>
          )}
        </group>

        {/* Antenna (Hover: Connectivity) */}
        <group 
          position={[0.4, 1.8, -0.4]}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredPart('antenna'); }}
          onPointerOut={() => setHoveredPart(null)}
          className="cursor-pointer"
        >
          <Cylinder args={[0.03, 0.03, 1, 16]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
          </Cylinder>
          <Sphere args={[0.06, 16, 16]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
          </Sphere>
          {hoveredPart === 'antenna' && (
            <Html position={[0.5, 0.5, 0]} center>
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-red-500/50 p-4 rounded-2xl shadow-2xl text-slate-900 dark:text-white text-xs font-bold whitespace-nowrap z-50">
                <div className="text-red-500 mb-1 uppercase tracking-widest text-[10px]">Connectivity</div>
                Long-range LoRaWAN
              </div>
            </Html>
          )}
        </group>

        {/* Soil Probe (Hover: Soil Data) */}
        <group 
          position={[0, -1.2, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredPart('probe'); }}
          onPointerOut={() => setHoveredPart(null)}
          className="cursor-pointer"
        >
          <Cylinder args={[0.08, 0.02, 2.5, 16]} position={[0, -1, 0]}>
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </Cylinder>
          <Cylinder args={[0.15, 0.15, 0.2, 16]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.4} />
          </Cylinder>
          {hoveredPart === 'probe' && (
            <Html position={[-1.5, -1, 0]} center>
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-blue-500/50 p-4 rounded-2xl shadow-2xl text-slate-900 dark:text-white text-xs font-bold whitespace-nowrap z-50">
                <div className="text-blue-500 mb-1 uppercase tracking-widest text-[10px]">Sensors</div>
                Moisture, NPK & Temp
              </div>
            </Html>
          )}
        </group>

      </Float>
    </group>
  );
};

const TechnologySection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-emerald-200/50 dark:bg-emerald-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-sky-200/50 dark:bg-indigo-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-400 dark:to-teal-500 mb-6 tracking-tighter">
            Meet The Technology Behind Zar3a
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 font-medium mb-8 leading-relaxed">
            Our custom-built IoT hardware is designed specifically for Egyptian agriculture. It continuously monitors soil health, climate conditions, and crop status in real-time.
          </p>
          <div className="space-y-6">
            {[
              "Military-grade soil moisture probes",
              "Real-time temperature & humidity tracking",
              "Edge AI processing for immediate alerts",
              "Solar-powered for continuous operation"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 text-slate-800 dark:text-slate-200 font-bold text-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                {item}
              </div>
            ))}
          </div>
          <p className="mt-12 text-sm font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] animate-bounce">
            Hover over the model to explore →
          </p>
        </motion.div>

        <div className="h-[600px] w-full rounded-[3rem] border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur-3xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl">
          {/* Floating Data Particles Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10">
             {[...Array(10)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ y: 600, opacity: 0, x: Math.random() * 400 - 200 }}
                 animate={{ y: -100, opacity: [0, 1, 0] }}
                 transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 5 }}
                 className="absolute bottom-0 left-1/2 w-1 h-12 bg-gradient-to-t from-transparent to-emerald-500 rounded-full blur-[2px]"
               />
             ))}
          </div>
          
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#38bdf8" />
            <Environment preset="city" />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} maxPolarAngle={Math.PI / 2 + 0.2} minPolarAngle={Math.PI / 3} />
            <SmartNode />
          </Canvas>
        </div>

      </div>
    </section>
  );
};

export default TechnologySection;
