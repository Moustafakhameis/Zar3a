import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LuUsers, LuShoppingCart, LuCpu, LuShieldCheck, LuActivity, LuWifi, LuDroplets, LuLeaf, LuPlus, LuMinus, LuArrowUp, LuArrowDown, LuArrowLeft, LuArrowRight } from 'react-icons/lu';

const NODES = [
  { id: 'alex', lat: 31.20, lng: 29.91, name: 'Alexandria Hub', status: 'Optimal', type: 'pulse', farmers: '1,200+', market: 'High', experts: '45', iot: '98%' },
  { id: 'delta_w', lat: 30.95, lng: 30.40, name: 'Western Delta', status: 'Normal', type: 'static', farmers: '850+', market: 'Medium', experts: '30', iot: '92%' },
  { id: 'delta_c', lat: 31.04, lng: 31.38, name: 'Central Delta Node', status: 'Optimal', type: 'pulse', farmers: '950+', market: 'High', experts: '25', iot: '95%' },
  { id: 'cairo', lat: 30.04, lng: 31.23, name: 'Cairo Main Control', status: 'Active', type: 'pulse', farmers: '1,500+', market: 'Very High', experts: '50', iot: '88%' },
  { id: 'ismailia', lat: 30.60, lng: 32.27, name: 'Suez Canal Farm', status: 'Warning', type: 'static', farmers: '2,100+', market: 'Very High', experts: '65', iot: '85%' },
  { id: 'fayoum', lat: 29.30, lng: 30.84, name: 'Fayoum Oasis', status: 'Optimal', type: 'pulse', farmers: '400+', market: 'Emerging', experts: '20', iot: '100%' },
  { id: 'minya', lat: 28.10, lng: 30.75, name: 'Upper Egypt North', status: 'Normal', type: 'static', farmers: '600+', market: 'High', experts: '22', iot: '90%' },
  { id: 'asyut', lat: 27.18, lng: 31.18, name: 'Asyut Agri-Center', status: 'Optimal', type: 'pulse', farmers: '700+', market: 'Growing', experts: '15', iot: '75%' }
];

const LINKS = [
  ['alex', 'delta_w'], ['delta_w', 'delta_c'], ['delta_c', 'cairo'],
  ['alex', 'cairo'], ['cairo', 'ismailia'], ['delta_c', 'ismailia'],
  ['cairo', 'fayoum'], ['cairo', 'minya'], ['fayoum', 'minya'],
  ['minya', 'asyut']
];

const NILE_PATH = [
  // Main Nile (South to Cairo)
  [
    [24.0, 32.9], [25.7, 32.6], [27.1, 31.3], [29.3, 31.1], [30.16, 31.23]
  ],
  // Rosetta Branch (West)
  [
    [30.16, 31.23], [30.8, 30.8], [31.40, 30.42]
  ],
  // Damietta Branch (East)
  [
    [30.16, 31.23], [30.9, 31.3], [31.41, 31.81]
  ]
];

const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    .agri-map-container .leaflet-layer,
    .agri-map-container .leaflet-control-zoom-in,
    .agri-map-container .leaflet-control-zoom-out,
    .agri-map-container .leaflet-control-attribution {
        transition: filter 0.8s ease-in-out;
    }

    .dark .agri-map-container .leaflet-layer {
        filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
    }

    html:not(.dark) .agri-map-container .leaflet-layer {
        filter: grayscale(10%) contrast(105%) brightness(102%);
    }
    
    .agri-map-container .leaflet-bottom.leaflet-right {
        display: none;
    }

    .glowing-node {
        background-color: #10b981;
        border-radius: 50%;
        border: 2px solid #ffffff;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
        width: 14px;
        height: 14px;
        position: relative;
    }
    
    .dark .glowing-node {
        box-shadow: 0 0 10px 2px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.4);
        border-color: #020617;
    }
    
    html:not(.dark) .glowing-node {
        box-shadow: 0 0 8px 1px rgba(16, 185, 129, 0.5);
        border-color: #ffffff;
    }

    @keyframes pulse-ring {
        0% { transform: scale(0.8); opacity: 0.8; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        100% { transform: scale(2.5); opacity: 0; box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
    }
    
    .pulse-node::after {
        content: '';
        position: absolute;
        top: -2px; left: -2px; right: -2px; bottom: -2px;
        border-radius: 50%;
        animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        z-index: -1;
    }

    .glowing-node:hover {
        transform: scale(1.5) rotate(45deg);
        background-color: #34d399;
        z-index: 1000 !important;
    }

    .network-link-animated {
        stroke-dasharray: 10, 15;
        animation: data-flow 30s linear infinite;
    }
    
    @keyframes data-flow {
        from { stroke-dashoffset: 1000; }
        to { stroke-dashoffset: 0; }
    }

    .leaflet-popup-content-wrapper {
        border-radius: 12px !important;
        overflow: hidden;
        padding: 0 !important;
        transition: all 0.4s ease;
        animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    
    @keyframes pop-in {
        0% { opacity: 0; transform: translateY(10px) scale(0.9); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    .dark .leaflet-popup-content-wrapper {
        background-color: rgba(15, 23, 42, 0.95) !important;
        backdrop-filter: blur(8px);
        color: white !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px rgba(16, 185, 129, 0.1) !important;
    }
    
    html:not(.dark) .leaflet-popup-content-wrapper {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(8px);
        color: #0f172a !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 0 15px rgba(16, 185, 129, 0.05) !important;
    }

    .dark .leaflet-popup-tip { background-color: rgba(15, 23, 42, 0.95) !important; }
    html:not(.dark) .leaflet-popup-tip { background-color: rgba(255, 255, 255, 0.95) !important; }
    
    .leaflet-popup-content { margin: 0 !important; width: 220px !important; }

    .animate-float-in {
        animation: slideInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards, float 6s ease-in-out infinite 0.7s;
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-50px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }
  `}} />
);

const EgyptMapSection = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);

  const handleZoom = (delta) => {
    if (!mapInstance.current) return;
    const currentZoom = mapInstance.current.getZoom();
    mapInstance.current.setZoom(currentZoom + delta, { animate: true, duration: 0.5 });
  };

  const handlePan = (dx, dy) => {
    if (!mapInstance.current) return;
    mapInstance.current.panBy([dx, dy], { animate: true, duration: 0.5 });
  };

  useEffect(() => {
    if (window.L) {
      setIsLeafletLoaded(true);
      return;
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setIsLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isLeafletLoaded || !mapRef.current) return;
    
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    const L = window.L;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: 'center', // Allow zooming with mouse wheel smoothly
      dragging: true,
    }).setView([29.5, 31.0], 6.5);
    
    mapInstance.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap © CartoDB'
    }).addTo(map);

    L.polyline(NILE_PATH, {
      color: '#0ea5e9',
      weight: 5,
      opacity: 0.15,
      smoothFactor: 1,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Track all timeouts to prevent memory leaks and unmount crashes
    const activeTimeouts = [];

    LINKS.forEach((linkPair, index) => {
      const node1 = NODES.find(n => n.id === linkPair[0]);
      const node2 = NODES.find(n => n.id === linkPair[1]);
      
      if (node1 && node2) {
        const timeoutId = setTimeout(() => {
          L.polyline([
            [node1.lat, node1.lng],
            [node2.lat, node2.lng]
          ], {
            color: '#10b981',
            weight: 2,
            opacity: 0.5,
            className: 'network-link-animated'
          }).addTo(map);
        }, index * 100);
        activeTimeouts.push(timeoutId);
      }
    });

    NODES.forEach((node, index) => {
      const timeoutId = setTimeout(() => {
        const pulseClass = node.type === 'pulse' ? 'pulse-node' : '';
        
        const customIcon = L.divIcon({
          className: 'custom-marker-wrapper',
          html: `<div class="w-8 h-8 flex items-center justify-center cursor-pointer pointer-events-auto group"><div class="glowing-node ${pulseClass}"></div></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        const statusColor = node.status === 'Optimal' ? 'bg-emerald-500' : node.status === 'Warning' ? 'bg-yellow-500' : 'bg-blue-500';
        const statusText = node.status === 'Optimal' ? 'text-emerald-500' : node.status === 'Warning' ? 'text-yellow-500' : 'text-blue-500';

        const popupHtml = `
          <div class="p-4" style="font-family: inherit;">
              <div class="flex items-center gap-2 border-b border-opacity-20 pb-3 mb-3 border-gray-500 dark:border-gray-500 border-gray-300">
                  <div class="w-2 h-2 rounded-full ${statusColor} animate-pulse"></div>
                  <h4 class="text-emerald-500 font-bold text-sm tracking-wider uppercase m-0">${node.name}</h4>
              </div>
              <div class="space-y-3">
                  <div class="flex justify-between items-center text-xs">
                      <span class="opacity-60 flex items-center gap-1">Status</span>
                      <span class="font-semibold ${statusText}">${node.status}</span>
                  </div>
                  <div class="flex justify-between items-center text-xs">
                      <span class="opacity-60 flex items-center gap-1">Farmers</span>
                      <span class="font-semibold">${node.farmers}</span>
                  </div>
                  <div class="flex justify-between items-center text-xs">
                      <span class="opacity-60 flex items-center gap-1">IoT Cov.</span>
                      <span class="font-semibold text-sky-400">${node.iot}</span>
                  </div>
              </div>
          </div>
        `;

        L.marker([node.lat, node.lng], { icon: customIcon })
          .bindPopup(popupHtml, { closeButton: false })
          .addTo(map);
      }, index * 150);
      activeTimeouts.push(timeoutId);
    });

    const resizeTimeout = setTimeout(() => map.invalidateSize(), 500);
    activeTimeouts.push(resizeTimeout);

    // Precise stealth patch to tightly cover the original text
    const wipeIcon = L.divIcon({
      className: 'wipe-label',
      html: `<div style="width: 90px; height: 18px; background-color: rgba(128,128,128,0.02); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 4px; pointer-events: none;"></div>`,
      iconSize: [90, 18],
      iconAnchor: [45, 9]
    });
    L.marker([30.75, 34.8], { icon: wipeIcon, interactive: false }).addTo(map);

    // Native-styled replacement text placed slightly higher
    const palestineIcon = L.divIcon({
      className: 'palestine-label',
      html: `<div style="color: #888888; font-family: Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; white-space: nowrap; pointer-events: none; margin-left: 2px;">PALESTINE</div>`,
      iconSize: [90, 18],
      iconAnchor: [45, 9]
    });
    L.marker([31.25, 34.8], { icon: palestineIcon, interactive: false }).addTo(map);

    return () => {
      // Clear all pending animations if the user navigates away before they finish
      activeTimeouts.forEach(clearTimeout);
      
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isLeafletLoaded]);

  return (
    <section className="py-32 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <CustomStyles />
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
            Growing Across Egypt
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            One connected agricultural ecosystem powering the nation's food security.
          </p>
        </motion.div>

        <div className="relative w-full max-w-6xl mx-auto h-[600px] rounded-3xl border border-slate-900/10 dark:border-white/10 overflow-hidden shadow-2xl p-2 md:p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl">
          
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />

          {/* Inner Map Container */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-900/10 dark:border-white/10 shadow-inner bg-slate-50 dark:bg-[#050a11] transition-colors duration-700">
            
            <div 
              ref={mapRef} 
              className="w-full h-full z-0 agri-map-container"
            />
            
            {/* Floating Panel (Live Network) */}
            <div className="absolute top-4 left-4 z-[400] backdrop-blur-xl border p-4 md:p-5 rounded-3xl w-64 md:w-72 animate-float-in transition-colors duration-500 bg-white/90 dark:bg-[#0f172a]/90 border-slate-200 dark:border-gray-700/50 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 overflow-hidden">
              <div className="flex items-center gap-2 mb-2 border-b pb-3 border-slate-200 dark:border-gray-700/50">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <h3 className="text-xs font-black tracking-widest uppercase text-slate-800 dark:text-gray-200">Live Network</h3>
              </div>
              
              <div className="space-y-1">
                {/* Active Nodes */}
                <div className="group cursor-pointer p-3 -mx-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="flex items-center gap-1.5 transition-colors font-bold text-slate-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      <LuActivity size={16}/> Active Nodes
                    </span>
                    <span className="text-emerald-500 font-black group-hover:scale-110 transition-transform">8 / 8</span>
                  </div>
                  <div className="w-full rounded-full h-1.5 group-hover:h-2 transition-all duration-300 overflow-hidden bg-slate-200 dark:bg-gray-800">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full relative group-hover:shadow-[0_0_10px_rgba(16,185,129,0.8)]" style={{ width: '100%' }}>
                      <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                  {/* Expanded details */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-4 transition-all duration-500 overflow-hidden">
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700/50">
                      <div>
                        <span className="block text-slate-400 font-medium mb-0.5">Latency</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">12ms</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium mb-0.5">Uptime</span>
                        <span className="font-bold text-emerald-500">99.99%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Data Sync */}
                <div className="group cursor-pointer p-3 -mx-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="flex items-center gap-1.5 transition-colors font-bold text-slate-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <LuWifi size={16}/> Data Sync
                    </span>
                    <span className="text-blue-500 font-black group-hover:scale-110 transition-transform">98%</span>
                  </div>
                  <div className="w-full rounded-full h-1.5 group-hover:h-2 transition-all duration-300 overflow-hidden bg-slate-200 dark:bg-gray-800">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ width: '98%' }}></div>
                  </div>
                  {/* Expanded details */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-4 transition-all duration-500 overflow-hidden">
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700/50">
                      <div>
                        <span className="block text-slate-400 font-medium mb-0.5">Last Sync</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">2s ago</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium mb-0.5">Rate</span>
                        <span className="font-bold text-blue-500">1.2 GB/s</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Avg Moisture */}
                <div className="group cursor-pointer p-3 -mx-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="flex items-center gap-1.5 transition-colors font-bold text-slate-500 dark:text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                      <LuDroplets size={16}/> Avg Moisture
                    </span>
                    <span className="text-cyan-500 font-black group-hover:scale-110 transition-transform">42%</span>
                  </div>
                  <div className="w-full rounded-full h-1.5 group-hover:h-2 transition-all duration-300 overflow-hidden bg-slate-200 dark:bg-gray-800">
                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full group-hover:shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ width: '42%' }}></div>
                  </div>
                  {/* Expanded details */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-4 transition-all duration-500 overflow-hidden">
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700/50">
                      <div>
                        <span className="block text-slate-400 font-medium mb-0.5">Status</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">Optimal</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium mb-0.5">Irrigation</span>
                        <span className="font-bold text-cyan-500">Standby</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Map Controls */}
            <div className="absolute bottom-6 right-6 z-[400] flex flex-col gap-4 animate-float-in" style={{animationDelay: '1.2s'}}>
              {/* Pan Controls */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/50 border border-slate-200 dark:border-gray-700/50 p-2 grid grid-cols-3 grid-rows-3 gap-1">
                <div />
                <button onClick={() => handlePan(0, -150)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center" title="Pan Up">
                  <LuArrowUp size={18} strokeWidth={2.5} />
                </button>
                <div />
                <button onClick={() => handlePan(-150, 0)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center" title="Pan Left">
                  <LuArrowLeft size={18} strokeWidth={2.5} />
                </button>
                <button onClick={() => { if(mapInstance.current) mapInstance.current.setView([29.5, 31.0], 6.5, { animate: true, duration: 1 }) }} className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center justify-center group" title="Reset View">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:bg-white transition-colors duration-300"></div>
                </button>
                <button onClick={() => handlePan(150, 0)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center" title="Pan Right">
                  <LuArrowRight size={18} strokeWidth={2.5} />
                </button>
                <div />
                <button onClick={() => handlePan(0, 150)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center" title="Pan Down">
                  <LuArrowDown size={18} strokeWidth={2.5} />
                </button>
                <div />
              </div>

              {/* Zoom Controls */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/50 border border-slate-200 dark:border-gray-700/50 p-2 flex flex-col gap-1">
                <button onClick={() => handleZoom(1)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center">
                  <LuPlus size={20} strokeWidth={2.5} />
                </button>
                <div className="w-full h-px bg-slate-200 dark:bg-slate-700/50 my-1" />
                <button onClick={() => handleZoom(-1)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center">
                  <LuMinus size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            
            {/* Loading Overlay */}
            {!isLeafletLoaded && (
              <div className="absolute inset-0 z-[2000] flex items-center justify-center backdrop-blur-sm bg-slate-50/80 dark:bg-[#050a11]/80">
                <div className="flex flex-col items-center gap-5">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <LuLeaf size={20} className="absolute inset-0 m-auto text-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-sm font-bold tracking-widest uppercase animate-pulse text-emerald-600 dark:text-emerald-500">
                    Initializing System...
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default EgyptMapSection;
