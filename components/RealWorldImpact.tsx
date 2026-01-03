
import React, { useState, useEffect } from 'react';
import { Globe, Zap, ShieldCheck, Activity, Award, BarChart3, Binary, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

const RealWorldImpact: React.FC = () => {
    const [dominanceScore, setDominanceScore] = useState(99.9821);
    const [globalInfluence, setGlobalInfluence] = useState(42.8);
    const [successLogs, setSuccessLogs] = useState<string[]>([]);
    const [metricData, setMetricData] = useState<any[]>([]);

    const successEvents = [
        "RTGS_GATEWAY_SYNCED",
        "KAMPALA_LIQUIDITY_SIPHON_ACTIVE",
        "MTN_UG_NODES_CAPTURED",
        "GLOBAL_ARBITRAGE_SEALED",
        "CENTENARY_BANK_L2_LINK_STABLE",
        "QUANTUM_SUPREMACY_MANIFESTED"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setDominanceScore(prev => Math.min(99.9999, (prev || 99.98) + 0.0001));
            setGlobalInfluence(prev => Math.min(100, (prev || 42) + (Math.random() * 0.05)));
            
            if (Math.random() > 0.8) {
                const event = successEvents[Math.floor(Math.random() * successEvents.length)];
                setSuccessLogs(prev => [`[${new Date().toLocaleTimeString([], {hour12: false})}] ${event}`, ...prev].slice(0, 5));
            }

            setMetricData(prev => {
                const newData = [...prev, { time: Date.now(), value: Math.random() * 10 + 90 }];
                return newData.slice(-20);
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full glass-panel rounded-sm relative overflow-hidden bg-black/90 border border-mudde-gold/30 shadow-[0_0_20px_rgba(255,215,0,0.05)]">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            
            <div className="relative z-10 p-3 border-b border-gray-800 bg-mudde-gold/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-mudde-gold animate-bounce" />
                    <h3 className="text-[10px] font-bold text-mudde-gold tracking-[0.2em] font-sans uppercase">Global_Dominance_Cortex</h3>
                </div>
            </div>

            <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
                <div className="flex flex-col items-center justify-center py-3 bg-white/5 border border-gray-800 rounded relative shrink-0">
                    <span className="text-[7px] text-gray-500 font-mono uppercase tracking-widest">DOMINANCE_INDEX</span>
                    <span className="text-2xl font-bold text-white font-mono tracking-tighter text-shadow-gold">
                        {dominanceScore.toFixed(4)}%
                    </span>
                    <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-mudde-gold shadow-[0_0_10px_#ffd700]" style={{ width: `${dominanceScore}%` }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 shrink-0">
                    <div className="bg-black/60 border border-gray-800 p-2 rounded flex flex-col items-center">
                        <Globe className="w-3 h-3 text-mudde-cyan mb-1" />
                        <span className="text-[7px] text-gray-500 font-mono uppercase">Influence</span>
                        <span className="text-xs font-bold text-mudde-cyan font-mono">{globalInfluence.toFixed(1)}%</span>
                    </div>
                    <div className="bg-black/60 border border-gray-800 p-2 rounded flex flex-col items-center">
                        <Zap className="w-3 h-3 text-mudde-gold mb-1" />
                        <span className="text-[7px] text-gray-500 font-mono uppercase">Velocity</span>
                        <span className="text-xs font-bold text-mudde-gold font-mono">1.4 P/s</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="text-[7px] text-gray-500 font-mono mb-1 uppercase border-b border-gray-800 pb-1">REAL_TIME_DOMINANCE_LOG</div>
                    <div className="flex-1 bg-black/40 p-2 overflow-hidden space-y-1 font-mono">
                        {successLogs.map((log, i) => (
                            <div key={i} className={`text-[7px] truncate ${i === 0 ? 'text-mudde-gold' : 'text-gray-600'}`}>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-1 border-t border-gray-800 bg-black flex justify-between items-center text-[7px] font-mono text-gray-600">
                <span className="flex items-center gap-1 uppercase">
                    <ShieldCheck className="w-2 h-2 text-mudde-gold" />
                    STATUS: SECURE
                </span>
                <span className="text-mudde-gold animate-pulse uppercase">World_Verified</span>
            </div>
        </div>
    );
};

export default RealWorldImpact;
