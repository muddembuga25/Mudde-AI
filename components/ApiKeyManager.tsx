import React from 'react';
import { ApiManagerState } from '../types';
import { KeyRound, Plus, Zap, Server, DollarSign, ShieldCheck, ToggleLeft, ToggleRight, CreditCard, Lock } from 'lucide-react';
import { apiKeyManager } from '../services/apiKeyManager';

interface ApiKeyManagerProps {
    state: ApiManagerState;
    onProvision: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ state, onProvision }) => {
    const { keys, totalRequests, totalSpent, autoScale, bankingLinkStatus } = state;

    const getStatusInfo = (status: 'ACTIVE' | 'HIGH_LOAD' | 'COOLING_DOWN') => {
        switch (status) {
            case 'ACTIVE': return { color: 'text-green-500', bgColor: 'bg-green-500', pulse: false };
            case 'HIGH_LOAD': return { color: 'text-yellow-500', bgColor: 'bg-yellow-500', pulse: true };
            case 'COOLING_DOWN': return { color: 'text-red-500', bgColor: 'bg-red-500', pulse: true };
            default: return { color: 'text-gray-500', bgColor: 'bg-gray-500', pulse: false };
        }
    };

    const toggleAutoScale = () => {
        apiKeyManager.toggleAutoScale(!autoScale);
    };

    return (
        <div className="flex flex-col h-full glass-panel rounded-sm p-3 relative overflow-hidden bg-[#0a0510] border border-mudde-purple/30 shadow-[0_0_20px_rgba(189,0,255,0.05)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(189,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(189,0,255,0.03)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-gray-800/50 pb-2 mb-2">
                <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-mudde-purple" />
                    <div>
                        <h3 className="text-[10px] font-mono font-bold text-mudde-purple tracking-widest uppercase">
                            QUANTUM_API_SUBSTRATE
                        </h3>
                        <div className="flex items-center gap-1">
                             <ShieldCheck className="w-2.5 h-2.5 text-green-500" />
                             <span className="text-[7px] font-mono text-green-500 font-bold uppercase">GCP_BILLING_LINKED</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[7px] font-mono text-gray-500 uppercase">{autoScale ? 'Auto-Scale' : 'Manual'}</span>
                    <button onClick={toggleAutoScale} className="text-mudde-purple hover:text-white transition-colors">
                        {autoScale ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5 text-gray-600" />}
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="bg-black/40 border border-gray-800 p-1.5 rounded flex flex-col items-center">
                    <Server className="w-3 h-3 text-mudde-purple mb-1" />
                    <span className="text-[7px] text-gray-500 font-mono">KEYS</span>
                    <span className="text-sm font-bold text-white font-mono">{keys.length}</span>
                </div>
                <div className="bg-black/40 border border-gray-800 p-1.5 rounded flex flex-col items-center">
                    <Zap className="w-3 h-3 text-mudde-cyan mb-1" />
                    <span className="text-[7px] text-gray-500 font-mono">REQS/m</span>
                    <span className="text-sm font-bold text-white font-mono">{(totalRequests % 1000).toLocaleString()}</span>
                </div>
                <div className="bg-black/40 border border-gray-800 p-1.5 rounded flex flex-col items-center group cursor-pointer hover:border-mudde-gold/50 transition-all">
                    <DollarSign className="w-3 h-3 text-mudde-gold mb-1 group-hover:animate-bounce" />
                    <span className="text-[7px] text-gray-500 font-mono">BILLED</span>
                    <span className="text-sm font-bold text-white font-mono">${(totalSpent / 1000).toFixed(1)}k</span>
                </div>
            </div>

            {/* Banking Status */}
            <div className="mb-2 p-2 bg-green-900/10 border border-green-500/20 rounded flex items-center justify-between">
                 <div className="flex items-center gap-2">
                     <div className="p-1 bg-green-500/10 rounded">
                        <CreditCard className="w-3 h-3 text-green-500" />
                     </div>
                     <div className="flex flex-col">
                         <span className="text-[8px] font-mono font-bold text-white uppercase">Sovereign Vault Direct</span>
                         <span className="text-[7px] font-mono text-green-500">**** **** **** 8888</span>
                     </div>
                 </div>
                 <div className="flex flex-col items-end">
                     <Lock className="w-3 h-3 text-mudde-gold" />
                     <span className="text-[6px] font-mono text-gray-500 uppercase">{bankingLinkStatus}</span>
                 </div>
            </div>

            {/* Key List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1 bg-black/20 rounded p-1">
                {keys.map((key, index) => {
                    const statusInfo = getStatusInfo(key.status);
                    return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-900/40 border border-gray-800/60 rounded group hover:border-mudde-purple/40 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-gray-300 font-bold">
                                    {key.key.substring(0, 12)}...
                                </span>
                                <div className="flex items-center gap-1">
                                    <div className="h-1 w-12 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-mudde-purple" style={{ width: `${Math.min(100, key.requests)}%` }}></div>
                                    </div>
                                    <span className="text-[7px] font-mono text-gray-600">
                                        LOAD: {key.requests}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className={`text-[8px] font-mono font-bold ${statusInfo.color}`}>
                                    {key.status}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${statusInfo.bgColor} shadow-[0_0_5px_currentColor] ${statusInfo.pulse ? 'animate-pulse' : ''}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="mt-2 pt-2 border-t border-gray-800/50">
                {autoScale ? (
                    <div className="w-full py-2 bg-mudde-purple/10 border border-mudde-purple/50 text-mudde-purple rounded text-[9px] font-bold font-mono uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse">
                        <Zap className="w-3 h-3" />
                        AUTO-SCALE ENABLED
                    </div>
                ) : (
                    <button
                        onClick={onProvision}
                        className="w-full py-2 bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-mudde-purple/20 hover:border-mudde-purple hover:text-white transition-all rounded text-[9px] font-bold font-mono uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Plus className="w-3 h-3" />
                        PROVISION KEY ($50k)
                    </button>
                )}
                <div className="text-[6px] text-center text-gray-600 mt-1 font-mono uppercase">
                    Funds auto-deducted from Sovereign Vault
                </div>
            </div>
        </div>
    );
};

export default ApiKeyManager;