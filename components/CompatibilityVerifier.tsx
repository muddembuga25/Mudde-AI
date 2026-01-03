import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Server, Cpu, Globe, CheckCircle2, ShieldCheck, Laptop, Watch, Car } from 'lucide-react';

const CompatibilityVerifier: React.FC = () => {
  const [deviceLog, setDeviceLog] = useState<string[]>([]);
  const [industryLog, setIndustryLog] = useState<string>('INITIALIZING...');
  const [successRate, setSuccessRate] = useState(98.00);
  const [scannedCount, setScannedCount] = useState(124000);

  const platforms = [
    { name: 'iOS 18 (Neural Engine)', icon: Smartphone },
    { name: 'Android 15 (Pixel Tensor)', icon: Smartphone },
    { name: 'Windows 11 (x86_64)', icon: Monitor },
    { name: 'macOS Sequoia (M4)', icon: Laptop },
    { name: 'Linux Kernel 6.9 (ARM64)', icon: Server },
    { name: 'Tesla FSD (v12 HW)', icon: Car },
    { name: 'SpaceX FlightOS', icon: Globe },
    { name: 'Apple Watch Ultra', icon: Watch },
    { name: 'NVIDIA H100 Cluster', icon: Cpu },
    { name: 'Quantum Qubit Array', icon: Cpu },
  ];

  const industries = [
    "FINANCE :: ISO 20022 :: COMPLIANT",
    "HEALTH :: HIPAA/GDPR :: SECURE",
    "AEROSPACE :: DO-178C :: VERIFIED",
    "ENERGY :: GRID_PROTOCOLS :: STABLE",
    "MILITARY :: ENC_AES_256 :: LOCKED"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Simulate Device Verification
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const id = Math.floor(Math.random() * 999);
      const log = `>> TARGET: ${platform.name} [ID:${id}] ... VERIFIED`;
      
      setDeviceLog(prev => [log, ...prev].slice(0, 5));

      // 2. Simulate Stats Increase
      setScannedCount(prev => prev + Math.floor(Math.random() * 500));
      setSuccessRate(prev => {
        const next = prev + (Math.random() * 0.01);
        return next > 99.9999 ? 99.9999 : next;
      });

      // 3. Rotate Industry Compliance
      if (Math.random() > 0.7) {
        setIndustryLog(industries[Math.floor(Math.random() * industries.length)]);
      }

    }, 200); // Fast updates

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full glass-panel rounded-sm p-3 relative overflow-hidden group">
       {/* Ambient Success Glow */}
       <div className="absolute inset-0 bg-green-500/5 animate-pulse pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-gray-800/50 pb-2 mb-2">
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-mudde-cyan" />
            <span className="text-[10px] font-mono font-bold text-mudde-cyan tracking-widest">UNIVERSAL_VERIFIER</span>
        </div>
        <div className="flex items-center gap-1">
            <span className="text-[8px] text-gray-400 font-mono">GLOBAL_COMPATIBILITY</span>
            <span className="text-[10px] text-green-400 font-mono font-bold">{successRate.toFixed(4)}%</span>
        </div>
      </div>

      {/* Central Visual: Device Grid */}
      <div className="relative z-10 flex justify-between items-center px-4 py-2 border border-mudde-cyan/10 bg-black/40 rounded mb-2">
          <Smartphone className="w-4 h-4 text-gray-600 animate-[pulse_1s_infinite]" />
          <Laptop className="w-4 h-4 text-gray-600 animate-[pulse_1.2s_infinite]" />
          <Server className="w-4 h-4 text-gray-600 animate-[pulse_0.8s_infinite]" />
          <Car className="w-4 h-4 text-gray-600 animate-[pulse_1.5s_infinite]" />
          <Cpu className="w-4 h-4 text-gray-600 animate-[pulse_0.5s_infinite]" />
          
          {/* Scanning Beam */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-mudde-cyan/50 shadow-[0_0_10px_#00f0ff] animate-[shimmer_2s_infinite_linear]"></div>
      </div>

      {/* Industry Banner */}
      <div className="relative z-10 flex items-center justify-center bg-mudde-cyan/10 border border-mudde-cyan/30 rounded p-1 mb-2">
          <Globe className="w-3 h-3 text-mudde-cyan mr-2" />
          <span className="text-[9px] font-mono text-mudde-cyan font-bold tracking-wider">{industryLog}</span>
      </div>

      {/* Verification Stream */}
      <div className="relative z-10 flex-1 overflow-hidden">
         <div className="flex flex-col gap-1">
             {deviceLog.map((log, i) => (
                 <div key={i} className="flex items-center gap-2 text-[8px] font-mono">
                     <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                     <span className={`truncate ${i === 0 ? 'text-white brightness-125' : 'text-gray-500'}`}>
                         {log}
                     </span>
                 </div>
             ))}
         </div>
         {/* Fade at bottom */}
         <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-mudde-panel to-transparent pointer-events-none"></div>
      </div>

      {/* Footer Stats */}
      <div className="relative z-10 mt-auto pt-2 border-t border-gray-800/50 flex justify-between items-center text-[8px] font-mono text-gray-500">
          <span>DEVICES_SCANNED: {scannedCount.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-mudde-cyan">
              <span className="w-1.5 h-1.5 bg-mudde-cyan rounded-full animate-pulse"></span>
              ACTIVE
          </span>
      </div>
      
      <style>{`
        @keyframes shimmer {
            0% { left: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CompatibilityVerifier;