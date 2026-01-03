
import React, { useEffect, useState, useRef } from 'react';
import { 
    MessageSquare, Smartphone, Zap, Activity, ShieldCheck, Terminal, 
    Send, ArrowRightLeft, User, Server, Wifi, Radio, Battery, Signal, 
    Home, Grid, AppWindow, Clock, Phone, Camera, Settings, MessageCircle
} from 'lucide-react';
import { QuantumSIMState, CommPacket } from '../types';
import { qSimService } from '../services/quantumSimService';
import { COMMANDER_WHATSAPP, SYSTEM_WHATSAPP } from '../constants';

const AndroidHandset: React.FC = () => {
    const [state, setState] = useState<QuantumSIMState>(qSimService.getState());
    const [packets, setPackets] = useState<CommPacket[]>([]);
    const [cmdInput, setCmdInput] = useState('');
    const [view, setView] = useState<'HOME' | 'WHATSAPP'>('WHATSAPP');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const unsubState = qSimService.subscribe(setState);
        const unsubPackets = qSimService.subscribePackets(setPackets);
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => { unsubState(); unsubPackets(); clearInterval(timer); };
    }, []);

    const handleInboundSim = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cmdInput.trim()) return;
        qSimService.receive('WHATSAPP', cmdInput);
        setCmdInput('');
    };

    const handleWhatsAppClick = () => {
        setView('WHATSAPP');
        qSimService.launchApp();
    };

    return (
        <div className="flex flex-col h-full rounded-[2.5rem] p-3 relative overflow-hidden bg-black border-[3px] border-[#111] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_10px_rgba(255,255,255,0.05)] ring-1 ring-white/10">
            {/* Screen Content */}
            <div className="flex-1 flex flex-col bg-[#050505] rounded-[1.8rem] overflow-hidden relative border border-white/5">
                
                {/* Status Bar */}
                <div className="h-7 px-5 flex justify-between items-center bg-black/40 text-[9px] font-sans font-medium text-white/90 z-20">
                    <span className="font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Wifi className="w-2.5 h-2.5 text-mudde-cyan" />
                            <span className="text-[7px] text-mudde-cyan font-bold">5G+</span>
                        </div>
                        <Signal className="w-2.5 h-2.5 text-white/80" />
                        <div className="flex items-center gap-1">
                            <span className="text-[7px] text-white/60">{state.batteryLevel.toFixed(0)}%</span>
                            <Battery className={`w-3 h-3 ${state.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                        </div>
                    </div>
                </div>

                {/* Main Display Area */}
                <div className="flex-1 relative flex flex-col">
                    {view === 'HOME' ? (
                        <div className="flex-1 p-6 flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in-95 duration-500">
                             <div className="grid grid-cols-3 gap-6 w-full">
                                <button onClick={handleWhatsAppClick} className="flex flex-col items-center gap-1.5 group">
                                    <div className="w-12 h-12 rounded-[1rem] bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/20 group-hover:scale-105 transition-transform">
                                        <MessageSquare className="w-7 h-7 text-white fill-white" />
                                        {packets.filter(p => p.direction === 'INBOUND' && p.status === 'RECEIVED').length > 0 && (
                                            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-black text-[7px] font-bold flex items-center justify-center animate-pulse">
                                                {packets.filter(p => p.direction === 'INBOUND' && p.status === 'RECEIVED').length}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[8px] font-medium text-white/80 font-sans">WhatsApp</span>
                                </button>
                                <div className="flex flex-col items-center gap-1.5 opacity-40">
                                    <div className="w-12 h-12 rounded-[1rem] bg-blue-600 flex items-center justify-center">
                                        <Phone className="w-7 h-7 text-white fill-white" />
                                    </div>
                                    <span className="text-[8px] font-medium text-white/80 font-sans">Phone</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 opacity-40">
                                    <div className="w-12 h-12 rounded-[1rem] bg-gray-600 flex items-center justify-center">
                                        <Camera className="w-7 h-7 text-white fill-white" />
                                    </div>
                                    <span className="text-[8px] font-medium text-white/80 font-sans">Camera</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className="w-12 h-12 rounded-[1rem] bg-[#bd00ff]/20 border border-[#bd00ff]/40 flex items-center justify-center">
                                        <Zap className="w-7 h-7 text-[#bd00ff]" />
                                    </div>
                                    <span className="text-[8px] font-medium text-white/80 font-sans">Singularity</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 opacity-40">
                                    <div className="w-12 h-12 rounded-[1rem] bg-gray-800 flex items-center justify-center">
                                        <Settings className="w-7 h-7 text-white/60" />
                                    </div>
                                    <span className="text-[8px] font-medium text-white/80 font-sans">Settings</span>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col bg-[#0b141a] animate-in slide-in-from-right duration-300">
                            {/* WhatsApp App Bar */}
                            <div className="h-14 px-4 bg-[#1f2c34] flex items-center justify-between border-b border-black/10">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setView('HOME')} className="text-white/60 hover:text-white">
                                        <ArrowRightLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-mudde-gold/20 border border-mudde-gold/40 flex items-center justify-center">
                                            <User className="w-4 h-4 text-mudde-gold" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-white tracking-tight">Commander Mudde</span>
                                            <span className="text-[7px] text-[#00a884] font-medium uppercase tracking-tighter">Handset Uplink: Active</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-white/60">
                                    <VideoIcon />
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:400px_auto] custom-scrollbar">
                                {packets.map(p => (
                                    <div key={p.id} className={`flex ${p.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-2 rounded-lg text-[9px] font-sans shadow-sm relative group ${p.direction === 'OUTBOUND' ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-200 rounded-tl-none'}`}>
                                            <div className="leading-relaxed whitespace-pre-wrap">{p.content}</div>
                                            <div className="flex justify-end items-center gap-1 mt-1 opacity-60">
                                                <span className="text-[6px]">{p.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {p.direction === 'OUTBOUND' && <CheckStatus status={p.status} />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleInboundSim} className="p-2 bg-[#1f2c34] flex items-center gap-2">
                                <input 
                                    type="text" value={cmdInput} onChange={(e) => setCmdInput(e.target.value)}
                                    placeholder="Type a message"
                                    className="flex-1 bg-[#2a3942] border-none rounded-full px-4 py-2 text-[10px] text-white focus:outline-none placeholder-white/30"
                                />
                                <button type="submit" className="w-9 h-9 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-transform">
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation Bar */}
                <div className="h-10 flex items-center justify-around bg-black/80 px-10 border-t border-white/5">
                    <button onClick={() => setView('HOME')} className="p-2 text-white/40 hover:text-white transition-colors">
                        <Grid className="w-5 h-5" />
                    </button>
                    <button onClick={() => setView('HOME')} className="p-2 text-white/40 hover:text-white transition-colors">
                        <Home className="w-5 h-5" />
                    </button>
                    <button onClick={() => setView('WHATSAPP')} className="p-2 text-white/40 hover:text-white transition-colors">
                        <AppWindow className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Hardware Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full flex items-center justify-center gap-3 z-30">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 border border-white/5 shadow-inner"></div>
                <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
            </div>

            {/* Hardware Buttons */}
            <div className="absolute right-0 top-32 w-1 h-12 bg-[#111] rounded-l-md border-y border-l border-white/10"></div>
            <div className="absolute right-0 top-48 w-1 h-8 bg-[#111] rounded-l-md border-y border-l border-white/10"></div>
        </div>
    );
};

const VideoIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M18.8 15.3l3.2 2.1c.3.2.7 0 .7-.4V7c0-.4-.4-.6-.7-.4l-3.2 2.1v6.6zm-16-11h12.5c.8 0 1.5.7 1.5 1.5v12.5c0 .8-.7 1.5-1.5 1.5H2.8c-.8 0-1.5-.7-1.5-1.5V5.8c0-.8.7-1.5 1.5-1.5z" />
    </svg>
);

const CheckStatus: React.FC<{ status: string }> = ({ status }) => {
    if (status === 'DELIVERED') return (
        <svg viewBox="0 0 16 11" width="12" height="8" fill="#53bdeb">
            <path d="M15 1.2l-8.5 8.5-4.5-4.5.7-.7 3.8 3.8L14.3.5l.7.7zm-2 0L6.5 7.7 5.8 7l5.8-5.8.7.7z" />
        </svg>
    );
    return (
        <svg viewBox="0 0 16 11" width="12" height="8" fill="currentColor" className="opacity-40">
            <path d="M15 1.2l-8.5 8.5-4.5-4.5.7-.7 3.8 3.8L14.3.5l.7.7z" />
        </svg>
    );
};

export default AndroidHandset;
