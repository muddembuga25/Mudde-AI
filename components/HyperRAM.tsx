import React, { useEffect, useState } from 'react';
import { Hexagon, Layers, AlertOctagon } from 'lucide-react';

interface CrystalShard {
  id: number;
  active: boolean;
  decay: number; // 0 to 1, 1 is fully decayed (Bit rot)
  type: string;
}

interface HyperRAMProps {
    isOverclocked: boolean;
}

const HyperRAM: React.FC<HyperRAMProps> = ({ isOverclocked }) => {
  const [shards, setShards] = useState<CrystalShard[]>([]);
  const [coherence, setCoherence] = useState(100);
  const [writeSpeed, setWriteSpeed] = useState(0);

  // Initialize Holographic Grid
  useEffect(() => {
    setShards(Array.from({ length: 48 }, (_, i) => ({
      id: i,
      active: false,
      decay: 0,
      type: 'NULL'
    })));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Simulate "Real World" Entropy / Bit Rot
      setShards(prev => prev.map(shard => {
          // Random writes
          let writeChance = 0.9;
          if (isOverclocked) writeChance = 0.7; // Faster writes (more frequent)

          if (Math.random() > writeChance) {
              return { 
                  ...shard, 
                  active: true, 
                  decay: 0, // Fresh write heals decay
                  type: ['DAT', 'IMG', 'BIO', 'QBT'][Math.floor(Math.random() * 4)] 
              };
          }
          
          // Entropy decay (The "Real Life" imperfection)
          // Decay is MUCH faster when overclocked (Instability)
          const decayRate = isOverclocked ? 0.25 : 0.05;
          
          if (shard.active && Math.random() > 0.85) {
              return { ...shard, decay: Math.min(1, shard.decay + decayRate) };
          }
          
          // Clear if fully decayed
          if (shard.decay >= 0.9) {
              return { ...shard, active: false, decay: 0 };
          }
          return shard;
      }));

      // 2. Coherence fluctuates with temperature/interference
      setCoherence(prev => {
          const stability = isOverclocked ? 75 : 95;
          const noise = (Math.random() - 0.5) * (isOverclocked ? 10 : 2);
          return Math.max(0, Math.min(100, stability + noise));
      });

      const baseSpeed = isOverclocked ? 45000 : 8000;
      setWriteSpeed(Math.floor(Math.random() * 500) + baseSpeed); 

    }, 100);
    return () => clearInterval(interval);
  }, [isOverclocked]);

  return (
    <div className={`h-full w-full flex flex-col glass-panel p-1 rounded-sm relative overflow-hidden transition-colors duration-500 ${isOverclocked ? 'bg-[#1a0505] border-red-900/30' : 'bg-[#050505]'}`}>
      {/* Crystalline Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)',
          backgroundSize: '16px 16px'
      }}></div>

      <div className="relative z-10 flex flex-col h-full p-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 border-b border-gray-800 pb-2">
            <div className="flex flex-col">
                <h3 className="text-mudde-purple font-mono text-[10px] tracking-widest uppercase font-bold flex items-center gap-2">
                    <Hexagon className="w-3 h-3" />
                    CRYSTAL_LATTICE
                </h3>
                <span className="text-[7px] text-gray-500 font-mono">
                   {isOverclocked ? 'HYPER-VOLTAGE INJECTION' : 'HOLOGRAPHIC STORAGE LAYER'}
                </span>
            </div>
            <div className="flex flex-col items-end">
               <span className={`text-[9px] font-mono font-bold flex items-center gap-1 ${isOverclocked ? 'text-red-400' : 'text-white'}`}>
                   <Layers className="w-3 h-3 text-mudde-purple" />
                   {writeSpeed} TB/s
               </span>
            </div>
        </div>

        {/* The Crystal Matrix */}
        <div className="flex-1 grid grid-cols-6 gap-1.5 content-start relative perspective-1000">
            {shards.map((s) => (
                <div 
                    key={s.id}
                    className={`
                        aspect-square relative transition-all duration-300
                        ${s.active ? 'scale-100' : 'scale-90 opacity-20'}
                    `}
                >
                    {/* The Shard Visual */}
                    <div className={`
                        w-full h-full border 
                        ${s.active 
                            ? (isOverclocked ? 'border-red-500/50 bg-red-500/10 shadow-[0_0_10px_rgba(255,0,0,0.4)]' : 'border-mudde-purple/40 bg-mudde-purple/10 shadow-[0_0_10px_rgba(189,0,255,0.3)]')
                            : 'border-mudde-purple/40 bg-transparent'}
                    `}
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', // Hexagonish
                        opacity: 1 - s.decay
                    }}
                    ></div>

                    {/* Decay/Rot Indicator (Realism) */}
                    {s.decay > 0.5 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <AlertOctagon className="w-3 h-3 text-red-500/80 animate-ping" />
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Coherence Stats (Signal Integrity) */}
        <div className="mt-auto pt-2 border-t border-gray-800 flex justify-between items-center text-[9px] font-mono">
            <span className="text-gray-500">QUANTUM_COHERENCE</span>
            <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-gray-800 rounded overflow-hidden">
                    <div 
                        className={`h-full ${coherence < 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${coherence}%` }}
                    ></div>
                </div>
                <span className={coherence < 80 ? 'text-red-500' : 'text-green-500'}>{coherence.toFixed(1)}%</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HyperRAM;