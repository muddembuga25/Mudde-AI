
import React, { useEffect, useState } from 'react';
import { Database, Zap, ShieldCheck, Activity, Share2, Server, Lock, Unlock } from 'lucide-react';
import { SupabaseState } from '../types';

interface SupabaseNexusProps {
    state: SupabaseState;
}

const SupabaseNexus: React.FC<SupabaseNexusProps> = ({ state }) => {
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setPulse(p => !p), 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`h-full w-full flex flex-col glass-panel p-1 rounded-sm relative overflow-hidden transition-all duration-1000 ${state.connected ? 'bg-[#0a120e] border-[#3ecf8e]/30' : 'bg-black'}`}>
            {/* Supabase Brand Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #3ecf8e 1px, transparent 0)',
                backgroundSize: '20px 20px'
            }}></div>

            <div className="relative z-10 flex flex-col h-full p-3">
                {/* Header */}
                <div className="flex justify-between items-start mb-3 border-b border-gray-800 pb-2">
                    <div className="flex flex-col">
                        <h3 className="text-[#3ecf8e] font-mono text-[10px] tracking-widest uppercase font-bold flex items-center gap-2">
                            <Database className={`w-3 h-3 ${pulse ? 'scale-110' : 'scale-100'} transition-transform`} />
                            SUPABASE_EXOCORTEX
                        </h3>
                        <span className="text-[7px] text-gray-500 font-mono">
                           POSTGRES_KERNEL // EDGE_SUBSTRATE
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className={`text-[9px] font-mono font-bold flex items-center gap-1 ${state.connected ? 'text-[#3ecf8e]' : 'text-gray-600'}`}>
                           <Activity className="w-3 h-3" />
                           {state.connected ? `${state.latency.toFixed(1)}ms` : 'OFFLINE'}
                       </span>
                    </div>
                </div>

                {/* Substrate Viz */}
                <div className="flex-1 flex flex-col gap-2 min-h-0">
                    {/* Rows Processed Meter */}
                    <div className="bg-black/40 border border-[#3ecf8e]/10 p-2 rounded">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] text-gray-500 font-mono">NEURAL_BLOCKS_STORED</span>
                            <span className="text-[10px] font-mono text-white font-bold">{state.rowsProcessed.toLocaleString()}</span>
                        </div>
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#3ecf8e] transition-all duration-500" 
                                style={{ width: `${Math.min(100, (state.rowsProcessed / 1000) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/40 border border-gray-800 p-2 rounded flex flex-col justify-center relative overflow-hidden">
                            <span className="text-[7px] text-gray-500 font-mono flex items-center gap-1">
                                <Share2 className="w-2 h-2 text-[#3ecf8e]"/> CHANNELS
                            </span>
                            <span className="text-sm font-mono font-bold text-white">
                                {state.activeChannels}
                            </span>
                        </div>
                        <div className="bg-black/40 border border-gray-800 p-2 rounded flex flex-col justify-center">
                            <span className="text-[7px] text-gray-500 font-mono flex items-center gap-1">
                                <Lock className="w-2 h-2 text-mudde-gold"/> VAULT
                            </span>
                            <span className={`text-[9px] font-mono font-bold ${state.vaultStatus === 'UNLOCKED' ? 'text-green-500' : 'text-red-500'}`}>
                                {state.vaultStatus}
                            </span>
                        </div>
                    </div>

                    {/* Persistence Log */}
                    <div className="flex-1 bg-black/60 rounded border border-gray-800 p-2 overflow-hidden font-mono text-[8px] flex flex-col">
                        <div className="text-gray-600 mb-1 flex items-center gap-1 border-b border-gray-800 pb-1">
                            <Server className="w-2 h-2" /> RECENT_PERSISTENCE
                        </div>
                        <div className="flex-1 opacity-60">
                            {state.connected ? (
                                <div className="space-y-1">
                                    <div className="text-[#3ecf8e] truncate">> TABLE: mudde_brain_v2 ... OK</div>
                                    <div className="text-[#3ecf8e] truncate">> SYNC: singularity_state ... OK</div>
                                    <div className="text-gray-500 truncate">> LAST: {state.lastPersistence.toLocaleTimeString()}</div>
                                </div>
                            ) : (
                                <div className="text-red-900 animate-pulse uppercase">Awaiting Substrate Link...</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#3ecf8e]" />
                        <span className="text-[7px] font-mono text-[#3ecf8e]">PG_VECTOR_READY</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${state.connected ? 'bg-[#3ecf8e] shadow-[0_0_8px_#3ecf8e]' : 'bg-red-500 animate-ping'}`}></div>
                </div>
            </div>
        </div>
    );
};

export default SupabaseNexus;
