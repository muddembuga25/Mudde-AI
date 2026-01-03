
import React, { useState, useEffect } from 'react';
import { Cpu, Server, Activity, ShieldCheck, Zap, Maximize2, Hexagon, Lock, Fan } from 'lucide-react';

interface QuantumShellProps {
  children: React.ReactNode;
  isOverclocked: boolean;
  systemState: string;
}

const QuantumShell: React.FC<QuantumShellProps> = ({ children, isOverclocked, systemState }) => {
  const [qubits, setQubits] = useState(4096);
  const [temp, setTemp] = useState(0.015); // Kelvin
  const [coherence, setCoherence] = useState(99.9999);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(u => u + 1);
      
      // Simulate hardware fluctuations
      setTemp(t => {
        const target = isOverclocked ? 0.045 : 0.015;
        return t + (target - t) * 0.1 + (Math.random() - 0.5) * 0.001;
      });

      setCoherence(c => {
        const base = isOverclocked ? 99.99 : 99.99999;
        return Math.min(100, base + (Math.random() - 0.5) * 0.001);
      });

      if (isOverclocked) setQubits(prev => Math.min(1000000, prev + 1024)); // Dynamic allocation
    }, 1000);
    return () => clearInterval(interval);
  }, [isOverclocked]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col transition-colors duration-1000 ${isOverclocked ? 'bg-[#0f0000]' : 'bg-black'}`}>
      
      {/* --- HARDWARE HUD TOP --- */}
      <div className="h-8 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <Hexagon className={`w-4 h-4 ${isOverclocked ? 'text-red-500 animate-spin-slow' : 'text-mudde-cyan'}`} />
                <span className="text-[10px] font-mono font-bold text-gray-300 tracking-widest uppercase">
                    MUDDE_SUPER_COMPUTER_HOST
                </span>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
                <span className="text-[9px] text-gray-500 font-mono">QUBITS:</span>
                <span className={`text-[10px] font-mono font-bold ${isOverclocked ? 'text-red-400' : 'text-mudde-cyan'}`}>
                    {qubits.toLocaleString()}
                </span>
            </div>
            <div className="hidden md:flex items-center gap-2 border-l border-gray-800 pl-4">
                <span className="text-[9px] text-gray-500 font-mono">COHERENCE:</span>
                <span className="text-[10px] font-mono font-bold text-green-400">
                    {coherence.toFixed(6)}%
                </span>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <Fan className={`w-3 h-3 ${isOverclocked ? 'text-red-500 animate-spin' : 'text-blue-400'}`} />
                <span className="text-[10px] font-mono font-bold text-gray-300">{temp.toFixed(3)} K</span>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
                <Activity className="w-3 h-3 text-mudde-gold" />
                <span className="text-[10px] font-mono font-bold text-mudde-gold">{formatUptime(uptime)}</span>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="flex-1 relative overflow-hidden flex">
          
          {/* Left Hardware Rail */}
          <div className="w-6 border-r border-gray-800 bg-[#050505] flex flex-col items-center py-4 gap-4 z-40 hidden md:flex">
              <div className="writing-vertical-lr text-[8px] font-mono text-gray-600 tracking-widest uppercase rotate-180">
                  Rack_Unit_01
              </div>
              <div className="flex-1 w-[1px] bg-gray-800/50"></div>
              <div className="flex flex-col gap-2">
                  {[1,2,3,4].map(i => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${Math.random() > 0.5 ? 'bg-green-500' : 'bg-gray-700'} animate-pulse`}></div>
                  ))}
              </div>
          </div>

          {/* APP INJECTION POINT */}
          <div className="flex-1 relative z-10 flex flex-col bg-black/50">
              {children}
          </div>

          {/* Right Hardware Rail */}
          <div className="w-6 border-l border-gray-800 bg-[#050505] flex flex-col items-center py-4 gap-4 z-40 hidden md:flex">
               <div className="flex flex-col gap-1">
                  {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="w-3 h-0.5 bg-gray-800"></div>
                  ))}
              </div>
              <div className="flex-1 w-[1px] bg-gray-800/50"></div>
              <div className="writing-vertical-lr text-[8px] font-mono text-gray-600 tracking-widest uppercase rotate-180">
                  Quantum_Bus_A
              </div>
          </div>
      </div>

      {/* --- HARDWARE HUD BOTTOM --- */}
      <div className="h-6 bg-[#0a0a0a] border-t border-gray-800 flex items-center justify-between px-4 shrink-0 z-50">
          <div className="flex items-center gap-2">
              <Server className="w-3 h-3 text-green-500" />
              <span className="text-[9px] font-mono text-green-500 uppercase">HOST_ENVIRONMENT: STABLE</span>
          </div>
          <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Container_Isolation: Locked
              </span>
              <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Power: Fusion_Cell
              </span>
          </div>
      </div>

      {/* Overlay Scanlines for the "Inside a monitor" feel */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};

export default QuantumShell;
