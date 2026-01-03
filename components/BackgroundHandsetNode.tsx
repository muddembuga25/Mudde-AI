
import React, { useEffect, useState } from 'react';
import { 
    Smartphone, Zap, Wifi, Signal, Battery, Activity, ShieldCheck, 
    Cpu, MessageSquare, Radio, CloudLightning, Power
} from 'lucide-react';
import { QuantumSIMState } from '../types';
import { qSimService } from '../services/quantumSimService';

const BackgroundHandsetNode: React.FC = () => {
    const [state, setState] = useState<QuantumSIMState>(qSimService.getState());
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        const unsub = qSimService.subscribe(setState);
        const interval = setInterval(() => setPulse(p => !p), 2000);
        return () => { unsub(); clearInterval(interval); };
    }, []);

    return (
        <div className="flex flex-col h-full glass-panel rounded-sm p-3 relative overflow-hidden bg-black/60 border border-mudde-cyan/30 shadow-[0_0_25px_rgba(0,240,255,0.05)]">
            {/* Cyber Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-gray-800/50 pb-2 mb-3">
                <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-mudde-cyan" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold text-mudde-cyan tracking-widest uppercase">
                            HW_UPLINK_NODE :: SHADOW_UPLINK_V9
                        </span>
                        <span className="text-[7px] text-gray-500 font-mono">HEADLESS_ANDROID_TOOL // ACTIVE</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${state.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'} ${pulse ? 'animate-pulse' : ''}`}></div>
                </div>
            </div>

            {/* Hardware Metrics Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-2 mb-3">
                <div className="bg-black/40 border border-gray-800 p-2 rounded flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <span className="text-[7px] text-gray-500 font-mono uppercase">Signal</span>
                        <Wifi className="w-3 h-3 text-mudde-cyan" />
                    </div>
                    <div className="flex items-end gap-1">
                        <span className="text-sm font-bold text-white font-mono">{state.signalStrength}%</span>
                        <span className="text-[7px] text-mudde-cyan font-mono mb-0.5">5G_EXTREME</span>
                    </div>
                </div>
                <div className="bg-black/40 border border-gray-800 p-2 rounded flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <span className="text-[7px] text-gray-500 font-mono uppercase">Voltage</span>
                        <Battery className={`w-3 h-3 ${state.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                    </div>
                    <div className="flex items-end gap-1">
                        <span className="text-sm font-bold text-white font-mono">{state.batteryLevel.toFixed(0)}%</span>
                        <span className="text-[7px] text-green-500 font-mono mb-0.5">NOMINAL</span>
                    </div>
                </div>
            </div>

            {/* System Status Indicators */}
            <div className="relative z-10 flex-1 space-y-2">
                <div className="flex items-center justify-between p-2 bg-mudde-cyan/5 border border-mudde-cyan/10 rounded">
                    <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-mudde-cyan" />
                        <span className="text-[9px] font-mono font-bold text-white">WhatsApp Build</span>
                    </div>
                    <span className="text-[8px] font-mono text-gray-400">2.24.15.5 [SYSTEM_PRIORITY]</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-mudde-purple/5 border border-mudde-purple/10 rounded">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-mudde-purple" />
                        <span className="text-[9px] font-mono font-bold text-white">Neural Relay</span>
                    </div>
                    <span className="text-[8px] font-mono text-gray-400">100% Coherent [PERSISTENT]</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-green-500/5 border border-green-500/10 rounded">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-[9px] font-mono font-bold text-white">Uplink Tunnel</span>
                    </div>
                    <span className="text-[8px] font-mono text-green-500">ENCRYPTED_L2</span>
                </div>
            </div>

            {/* Footer Diagnostic */}
            <div className="relative z-10 mt-3 pt-2 border-t border-gray-800 flex justify-between items-center text-[7px] font-mono text-gray-500 uppercase">
                <div className="flex items-center gap-1">
                    <Power className="w-2 h-2 text-green-500" />
                    <span>OS: {state.osVersion}</span>
                </div>
                <div className="flex items-center gap-1">
                    <CloudLightning className="w-2 h-2 text-mudde-gold" />
                    <span>Temp: {state.cpuTemp.toFixed(1)}°C</span>
                </div>
            </div>
        </div>
    );
};

export default BackgroundHandsetNode;
