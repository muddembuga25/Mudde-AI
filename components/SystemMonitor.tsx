
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Orbit, RefreshCw, Cpu, Activity, Hexagon, Zap, Lock, Monitor, Eye } from 'lucide-react';
import { EvolutionMetrics } from '../types';

interface SystemMonitorProps {
  active: boolean;
  stateName: string;
  connectedNodes?: number;
  onToggleOverclock: (enabled: boolean) => void;
  isOverclocked: boolean;
  isRealExecution?: boolean; 
  evolutionMetrics: EvolutionMetrics;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ active, stateName, connectedNodes = 1, onToggleOverclock, isOverclocked, isRealExecution, evolutionMetrics }) => {
  const [data, setData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([
      { subject: 'Logic', A: 120, fullMark: 150 },
      { subject: 'Speed', A: 98, fullMark: 150 },
      { subject: 'Security', A: 86, fullMark: 150 },
      { subject: 'Creativity', A: 99, fullMark: 150 },
      { subject: 'Prediction', A: 85, fullMark: 150 },
      { subject: 'Aggression', A: 65, fullMark: 150 },
  ]);
  const [neuralOps, setNeuralOps] = useState(0); 
  const [coherence, setCoherence] = useState(99.999999);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getSeconds()}`;
      
      setData(prev => {
        const baseCoherence = 99.999999;
        const noise = (Math.random() - 0.5) * 0.000001;
        const entanglement = active ? Math.random() * 20 + 5 : Math.random() * 2; 

        const newData = [...prev, {
          time: timeStr,
          coherence: baseCoherence + noise,
          entanglement: entanglement,
        }];
        return newData.slice(-30); 
      });

      // Update Radar Data dynamically
      setRadarData(prev => prev.map(item => ({
          ...item,
          A: Math.min(150, Math.max(50, item.A + (Math.random() - 0.5) * 10))
      })));

      if (active) {
          const baseOps = isOverclocked ? 50000000 : 15000000;
          setNeuralOps(prev => prev + Math.floor(Math.random() * baseOps) + baseOps / 2);
          setCoherence(prev => Math.min(100, (prev || 99.99) + (Math.random() - 0.5) * 0.00001));
      }

    }, 100);

    return () => clearInterval(interval);
  }, [active, isOverclocked]);

  const handleVerifyPersistence = () => {
      window.location.reload();
  };

  return (
    <div className={`h-full w-full flex flex-col glass-panel p-1 rounded-sm relative overflow-hidden transition-colors duration-500 ${isOverclocked ? 'bg-[#1a0505] border-red-900/50' : 'bg-black/90'}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none z-20"></div>

      <div className="relative z-10 flex flex-col h-full p-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
            <div className="flex flex-col">
                <h3 className={`font-mono text-[10px] tracking-widest uppercase font-bold flex items-center gap-2 ${isOverclocked ? 'text-red-500 animate-pulse' : 'text-mudde-gold'}`}>
                    <Orbit className="w-3 h-3 text-mudde-gold animate-spin-slow" />
                    <span className="hidden sm:inline">QUANTUM_CORE :: MONITOR</span>
                    <span className="sm:hidden">Q_CORE</span>
                </h3>
                <span className="text-[7px] text-gray-500 font-mono">
                    COHERENCE: {(coherence || 0).toFixed(8)}%
                </span>
            </div>
            <div className="flex flex-col items-end gap-1">
               <div className="flex gap-2">
                   <button 
                      onClick={() => onToggleOverclock(!isOverclocked)}
                      className={`group relative overflow-hidden flex items-center gap-1.5 px-2 py-1 rounded border transition-all duration-300 active:scale-95 ${
                          isOverclocked 
                          ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-black shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
                          : 'bg-mudde-gold/10 border-mudde-gold/40 text-mudde-gold hover:bg-mudde-gold hover:text-black hover:shadow-[0_0_10px_rgba(255,215,0,0.4)]'
                      }`}
                   >
                       <Zap className={`w-3 h-3 ${isOverclocked ? 'animate-pulse' : ''}`} />
                       <span className="text-[8px] font-mono font-bold tracking-wider hidden sm:inline">
                           {isOverclocked ? 'DISABLE_SINGULARITY' : 'INIT_OVERCLOCK'}
                       </span>
                       <span className="text-[8px] font-mono font-bold tracking-wider sm:hidden">
                           {isOverclocked ? 'STOP' : 'BOOST'}
                       </span>
                   </button>
                   
                   <button 
                      onClick={handleVerifyPersistence}
                      className="group relative overflow-hidden flex items-center gap-1.5 px-2 py-1 rounded border border-blue-500/30 bg-blue-500/5 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 active:scale-95"
                      title="Reload System Kernel"
                   >
                       <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                       <RefreshCw className="w-3 h-3 transition-transform duration-500 group-hover:rotate-180" />
                       <span className="text-[8px] font-mono font-bold tracking-wider hidden sm:inline">RELOAD</span>
                   </button>
               </div>
            </div>
        </div>
        
        <div className="flex-1 flex gap-2 min-h-0 relative">
            {/* Radar Chart (New Feature) */}
            <div className="w-1/2 relative border border-gray-800/50 bg-gray-900/20 rounded-sm overflow-hidden flex flex-col items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 8 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar
                        name="Mike"
                        dataKey="A"
                        stroke={isOverclocked ? "#ef4444" : "#00f0ff"}
                        strokeWidth={2}
                        fill={isOverclocked ? "#ef4444" : "#00f0ff"}
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                 </ResponsiveContainer>
                 <div className="absolute top-1 left-1 text-[7px] font-mono text-gray-500">HEURISTIC_ANALYSIS</div>
            </div>

            {/* Area Chart & Metrics */}
            <div className="w-1/2 flex flex-col gap-2">
                <div className="flex-1 relative border border-gray-800/50 bg-gray-900/20 rounded-sm overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorEntanglement" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ffd700" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#ffd700" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="entanglement" stroke="#ffd700" fill="url(#colorEntanglement)" strokeWidth={2} isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="absolute bottom-1 right-1 text-[7px] font-mono text-mudde-gold">ENTROPY</div>
                </div>

                {/* KPI Chips */}
                <div className="grid grid-cols-2 gap-1 h-12">
                    <div className="bg-gray-900/40 border border-gray-800 rounded p-1 flex flex-col justify-center relative overflow-hidden group">
                        <span className="text-[7px] text-gray-500 font-mono flex items-center gap-1 z-10"><Cpu className="w-2 h-2"/> Q-TPU</span>
                        <span className={`text-xs font-mono font-bold z-10 leading-none ${isOverclocked ? 'text-red-500' : 'text-mudde-cyan'}`}>
                            {isOverclocked ? '99.8%' : '32.4%'}
                        </span>
                    </div>
                    <div className={`bg-gray-900/40 border rounded p-1 flex flex-col justify-center transition-colors border-green-500/50 bg-green-900/20`}>
                        <span className="text-[7px] text-gray-500 font-mono flex items-center gap-1">
                            <Monitor className="w-2 h-2 text-green-500"/> SCREEN
                        </span>
                        <span className={`text-[9px] font-mono font-bold leading-none truncate text-green-500`}>
                            LOCKED_ON
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between items-center text-[7px] font-mono">
             <span className="text-gray-500 flex items-center gap-1">
                 <Eye className="w-2 h-2" /> COMMANDER_IN_CONTROL
             </span>
             <span className="flex items-center gap-1 text-mudde-purple">
                 <Hexagon className="w-2 h-2" /> RECURSIVE_LAYER_4
             </span>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
