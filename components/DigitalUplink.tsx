
import React, { useEffect, useState, useRef } from 'react';
import { 
    Wifi, Signal, Activity, ShieldCheck, Server, Send, 
    Smartphone, Globe, Radio, Lock, RefreshCw, Terminal, 
    MessageSquare, ArrowDown, ArrowUp, Zap
} from 'lucide-react';
import { QuantumSIMState, CommPacket } from '../types';
import { qSimService } from '../services/quantumSimService';
import { COMMANDER_WHATSAPP, SYSTEM_WHATSAPP } from '../constants';

const DigitalUplink: React.FC = () => {
    const [state, setState] = useState<QuantumSIMState>(qSimService.getState());
    const [packets, setPackets] = useState<CommPacket[]>([]);
    const [debugInput, setDebugInput] = useState('');
    const [isLinking, setIsLinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubState = qSimService.subscribe(setState);
        const unsubPackets = qSimService.subscribePackets(setPackets);
        return () => { unsubState(); unsubPackets(); };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [packets]);

    const handleDebugInject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!debugInput.trim()) return;
        // Simulates a packet arriving FROM the physical phone TO the system
        qSimService.receive('WHATSAPP', debugInput);
        setDebugInput('');
    };

    return (
        <div className="flex flex-col h-full glass-panel rounded-sm relative overflow-hidden bg-[#050505] border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            {/* Header: System Node Info */}
            <div className="relative z-10 flex items-center justify-between p-3 border-b border-gray-800 bg-black/60">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded border border-green-500/30 relative">
                        <Server className="w-5 h-5 text-green-500" />
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                    </div>
                    <div>
                        <h2 className="text-[10px] font-bold text-white tracking-[0.2em] font-mono uppercase">Digital_Node_Uplink</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] text-gray-400 font-mono">ENCRYPTED_UPLINK</span>
                            <span className="text-[7px] bg-green-900/40 text-green-400 px-1 rounded border border-green-900/60 uppercase">System_Active</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-[8px] font-mono text-green-400 uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        <span>E2E_Encrypted</span>
                    </div>
                    <span className="text-[7px] text-gray-500 font-mono">Carrier: MUDDE_CORE_GSM</span>
                </div>
            </div>

            {/* Connection Visualization */}
            <div className="p-3 bg-black/40 border-b border-gray-800 flex items-center justify-between relative overflow-hidden">
                <div className="flex flex-col items-center gap-1 z-10">
                    <Server className="w-4 h-4 text-green-500" />
                    <span className="text-[7px] font-mono text-gray-400 uppercase">Digital_Node</span>
                </div>

                <div className="flex-1 px-4 relative flex items-center justify-center">
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-800"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-green-500/50 animate-pulse"></div>
                    
                    {/* Traffic particles using reliable animate-ping-slow */}
                    <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full animate-ping-slow"></div>
                    <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-mudde-gold rounded-full animate-ping-slow" style={{ animationDelay: '1s' }}></div>
                    
                    <div className="bg-[#050505] px-2 relative z-10 flex flex-col items-center border border-gray-800 rounded py-0.5">
                        <span className="text-[7px] font-mono text-white font-bold uppercase tracking-wider">SECURE_TUNNEL</span>
                        <span className="text-[6px] font-mono text-green-500">TLS 1.3 :: 0ms Latency</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1 z-10 opacity-60">
                    <Smartphone className="w-4 h-4 text-white" />
                    <span className="text-[7px] font-mono text-gray-400 uppercase">Commander_Phys</span>
                </div>
            </div>

            {/* Data Stream / Logs */}
            <div className="flex-1 relative overflow-hidden bg-black/20 flex flex-col">
                <div className="px-3 py-1 bg-gray-900/50 border-b border-gray-800 flex justify-between items-center text-[7px] font-mono text-gray-500 uppercase">
                    <span>Packet_Log</span>
                    <span>Target: {COMMANDER_WHATSAPP}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar font-mono">
                    {packets.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-4">
                            <Radio className="w-8 h-8 text-green-500 mb-2 animate-pulse" />
                            <span className="text-[8px] text-gray-400 uppercase">Awaiting Uplink Traffic from Physical Device...</span>
                        </div>
                    )}
                    {packets.map((p) => (
                        <div key={p.id} className={`flex ${p.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'} animate-slide-in-right`}>
                            <div className={`max-w-[90%] p-1.5 rounded border flex flex-col ${
                                p.direction === 'OUTBOUND' 
                                ? 'bg-green-900/10 border-green-500/30 text-green-100' 
                                : 'bg-gray-800/40 border-gray-700 text-gray-300'
                            }`}>
                                <div className="flex items-center gap-2 mb-0.5 border-b border-white/5 pb-0.5">
                                    {p.direction === 'OUTBOUND' ? <ArrowUp className="w-2 h-2 text-green-500" /> : <ArrowDown className="w-2 h-2 text-mudde-cyan" />}
                                    <span className="text-[7px] font-bold opacity-70 uppercase">
                                        {p.direction === 'OUTBOUND' ? 'SYSTEM_TX' : 'COMMANDER_RX'}
                                    </span>
                                    <span className="text-[6px] ml-auto opacity-50">{p.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <div className="text-[9px] break-words leading-relaxed whitespace-pre-wrap">
                                    {p.content}
                                </div>
                                <div className="mt-1 flex justify-end">
                                    <span className="text-[6px] uppercase font-bold opacity-60 flex items-center gap-1">
                                        {p.status} {p.status === 'DELIVERED' && <div className="w-1 h-1 bg-green-500 rounded-full"></div>}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Debug / Simulation Controls */}
            <div className="p-2 bg-gray-900/30 border-t border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-3 h-3 text-mudde-gold" />
                    <span className="text-[7px] font-mono text-mudde-gold font-bold uppercase tracking-wider">Debug: Simulate_Physical_Inbound_Signal</span>
                </div>
                <form onSubmit={handleDebugInject} className="flex gap-2">
                    <input 
                        type="text" 
                        value={debugInput}
                        onChange={(e) => setDebugInput(e.target.value)}
                        placeholder="Inject packet from 'Real Phone'..."
                        className="flex-1 bg-black border border-gray-700 rounded px-2 py-1.5 text-[9px] font-mono text-white focus:border-mudde-gold focus:outline-none placeholder-gray-700"
                    />
                    <button 
                        type="submit"
                        className="px-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white text-gray-400 rounded transition-colors"
                    >
                        <Send className="w-3 h-3" />
                    </button>
                </form>
            </div>
            
            <div className="h-5 bg-black flex items-center justify-between px-2 text-[6px] font-mono text-gray-600 border-t border-gray-900">
                <span>PROTOCOL: WHATSAPP_BUSINESS_API</span>
                <span className="flex items-center gap-1">
                    <Activity className="w-2 h-2 text-green-500" />
                    UPLINK_STABLE
                </span>
            </div>
        </div>
    );
};

export default DigitalUplink;
