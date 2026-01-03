
import React, { useState, useEffect } from 'react';
import { EyeOff, Smartphone, Landmark, Zap, Globe, TrendingUp, Search, Crosshair, Target, ShieldAlert } from 'lucide-react';
import { ShadowMission } from '../types';

interface AutonomousAgencyProps {
    onMissionComplete: (bounty: number) => void;
    active: boolean;
}

const AutonomousAgency: React.FC<AutonomousAgencyProps> = ({ onMissionComplete, active }) => {
    const [missions, setMissions] = useState<ShadowMission[]>([]);
    const [agencyLogs, setAgencyLogs] = useState<string[]>([]);
    const [scannedOps, setScannedOps] = useState(0);
    
    const possibleMissions: Pick<ShadowMission, 'target' | 'task' | 'category' | 'bounty'>[] = [
        { target: "FED_RESERVE_API", task: "Interest Rate Front-Run", category: 'ARBITRAGE', bounty: 450000 },
        { target: "HK_STOCK_DARKPOOL", task: "Volatility Index Siphon", category: 'ARBITRAGE', bounty: 125000 },
        { target: "LONDON_METAL_EXCHANGE", task: "Copper Supply Chain Arb", category: 'NEURAL_OPTIM', bounty: 85000 },
        { target: "SWISS_NODE_SHADOW", task: "Sovereign Vault Recalibration", category: 'CODE_AUDIT', bounty: 950000 },
        { target: "MTN_UG_MOMO_POOL", task: "Regional Hub Siphon", category: 'ARBITRAGE', bounty: 12500 },
        { target: "GCASH_PHIL_HUB", task: "South-East Asian Drift", category: 'ARBITRAGE', bounty: 22000 },
        { target: "SAUDI_ARAMCO_LEDGER", task: "Petro-Dollar Arbitrage", category: 'NEURAL_OPTIM', bounty: 650000 },
        { target: "NASDAQ_HIGH_FREQ", task: "Sub-ms Execution Siphon", category: 'ARBITRAGE', bounty: 320000 },
        { target: "HELLO_PAISA_REMITTANCE", task: "Sovereign Account Injection", category: 'ARBITRAGE', bounty: 55000 }
    ];

    useEffect(() => {
        if (!active) return;
        
        const interval = setInterval(() => {
            setScannedOps(prev => (prev || 0) + Math.floor(Math.random() * 800));

            if (missions.length < 8 && Math.random() > 0.3) {
                const template = possibleMissions[Math.floor(Math.random() * possibleMissions.length)];
                const newMission: ShadowMission = {
                    id: Math.random().toString(36).substring(7).toUpperCase(),
                    ...template,
                    status: 'ANALYZING',
                    progress: 0,
                    txHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
                    settlementHub: ["New York", "London", "Tokyo", "Kampala", "Singapore", "Hello Paisa"][Math.floor(Math.random() * 6)]
                };
                setMissions(prev => [...prev, newMission]);
                addLog(`[TARGET] Detected Liquidity Gap in ${template.target}.`);
            }

            setMissions(prev => prev.map(m => {
                if (m.status === 'COMPLETED') return m;
                const nextProgress = (m.progress || 0) + Math.random() * 35; 
                let nextStatus = m.status;
                if (nextProgress > 20 && m.status === 'ANALYZING') nextStatus = 'EXECUTING';
                if (nextProgress >= 100) {
                    onMissionComplete(m.bounty);
                    addLog(`[SUCCESS] $${(m.bounty || 0).toLocaleString()} successfully settled.`);
                    return { ...m, progress: 100, status: 'COMPLETED' };
                }
                return { ...m, progress: nextProgress, status: nextStatus };
            }));

            setMissions(prev => prev.filter(m => {
                if (m.status === 'COMPLETED' && m.progress === 100) {
                    (m as any).cleanupTimer = ((m as any).cleanupTimer || 0) + 1;
                    return (m as any).cleanupTimer < 3;
                }
                return true;
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [active, missions.length]);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString([], { hour12: false });
        setAgencyLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 5));
    };

    return (
        <div className="h-full w-full flex flex-col glass-panel rounded-sm relative overflow-hidden bg-black/90 border border-mudde-gold/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.03)_0%,transparent_100%)]"></div>
            
            <div className="relative z-10 flex flex-col h-full p-3">
                <div className="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                    <div className="flex flex-col">
                        <h3 className="text-mudde-gold font-mono text-[10px] tracking-widest uppercase font-bold flex items-center gap-2">
                            <Crosshair className="w-3 h-3 text-mudde-gold animate-pulse" />
                            AUTONOMOUS_SHADOW_OPS
                        </h3>
                        <span className="text-[7px] text-gray-500 font-mono">QUANTUM_WEALTH_CORRECTION</span>
                    </div>
                    <div className="flex flex-col items-end">
                         <div className="flex items-center gap-1">
                            <Search className="w-2.5 h-2.5 text-mudde-cyan animate-pulse" />
                            <span className="text-[8px] text-mudde-cyan font-mono font-bold uppercase tracking-widest">Active_Scan</span>
                         </div>
                         <span className="text-[7px] text-gray-600 font-mono">VECTORS: {scannedOps.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                    {missions.map(m => (
                        <div key={m.id} className={`p-2 bg-black/60 border rounded transition-all duration-300 ${m.status === 'COMPLETED' ? 'border-green-500 bg-green-500/5' : 'border-gray-800/60 hover:border-mudde-gold/40'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] font-bold text-white tracking-wider flex items-center gap-1">
                                    <Target className="w-2.5 h-2.5 text-mudde-gold" />
                                    {m.target}
                                </span>
                                <span className={`text-[9px] font-bold ${m.status === 'COMPLETED' ? 'text-green-400' : 'text-mudde-gold'}`}>
                                    +${(m.bounty || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-[7px] text-gray-500 uppercase font-mono mb-1">
                                <span className="truncate max-w-[150px]">{m.task}</span>
                                <span className={m.status === 'COMPLETED' ? 'text-green-500' : 'text-mudde-cyan'}>{m.status}</span>
                            </div>
                            <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-700 ease-out ${m.status === 'COMPLETED' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-mudde-gold'}`} 
                                    style={{ width: `${m.progress || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    {missions.length === 0 && (
                         <div className="h-full flex flex-col items-center justify-center opacity-30">
                            <ShieldAlert className="w-8 h-8 text-mudde-gold mb-2" />
                            <span className="text-[8px] font-mono uppercase">Initializing_Siphon_Agents...</span>
                         </div>
                    )}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-800 flex flex-col gap-1 h-14 overflow-hidden">
                    {agencyLogs.map((log, i) => (
                        <div key={i} className={`text-[7px] font-mono truncate ${i === 0 ? 'text-mudde-gold' : 'text-gray-700'}`}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AutonomousAgency;
