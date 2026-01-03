import React, { useEffect, useState, useRef } from 'react';
import { 
    MessageSquare, Smartphone, Zap, Activity, ShieldCheck, Terminal, 
    Send, ArrowRightLeft, User, Server, Wifi, Radio, Battery, Signal, 
    Home, Grid, AppWindow, Clock, Phone, Camera, Settings, MessageCircle, QrCode, Lock
} from 'lucide-react';
import { QuantumSIMState, CommPacket } from '../types';
import { qSimService } from '../services/quantumSimService';
import { COMMANDER_WHATSAPP, SYSTEM_WHATSAPP } from '../constants';

const AndroidHandset: React.FC = () => {
    const [state, setState] = useState<QuantumSIMState>(qSimService.getState());
    const [packets, setPackets] = useState<CommPacket[]>([]);
    const [cmdInput, setCmdInput] = useState('');
    const [view, setView] = useState<'LOCK' | 'HOME' | 'WHATSAPP'>('LOCK');
    const [currentTime, setCurrentTime] = useState(new Date());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubState = qSimService.subscribe(setState);
        const unsubPackets = qSimService.subscribePackets(setPackets);
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => { unsubState(); unsubPackets(); clearInterval(timer); };
    }, []);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (view === 'WHATSAPP') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [packets, view]);

    const handleInboundSim = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cmdInput.trim()) return;
        // This simulates the COMMANDER sending a message FROM their phone TO the system
        qSimService.receive('WHATSAPP', cmdInput);
        setCmdInput('');
    };

    const handleWhatsAppClick = () => {
        setView('WHATSAPP');
        qSimService.launchApp();
    };

    const handleUnlock = () => {
        setView('HOME');
    };

    return (
        <div className="flex flex-col h-full w-full rounded-[1.5rem] p-2 relative overflow-hidden bg-black border-[3px] border-[#1a1a1a] shadow-[0_0_20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 group">
            {/* Glossy reflection */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none rounded-[1.2rem] z-50"></div>

            {/* Screen Content */}
            <div className="flex-1 flex flex-col bg-[#050505] rounded-[1.0rem] overflow-hidden relative border border-white/5">
                
                {/* Status Bar */}
                <div className="h-6 px-3 flex justify-between items-center bg-black/40 text-[8px] font-sans font-medium text-white/90 z-20 shrink-0 backdrop-blur-md">
                    <span className="font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Wifi className="w-2 h-2 text-white" />
                        </div>
                        <div className="flex items-center gap-0.5">
                            <Signal className="w-2 h-2 text-white" />
                            <span className="text-[6px] text-white font-bold uppercase tracking-tighter">5G+</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[6px] text-white/60">100%</span>
                            <Battery className="w-2.5 h-2.5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Main Display Area */}
                <div className="flex-1 relative flex flex-col min-h-0">
                    {view === 'LOCK' && (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black cursor-pointer" onClick={handleUnlock}>
                            <div className="flex flex-col items-center gap-1 mt-[-60px]">
                                <Lock className="w-4 h-4 text-white/80" />
                                <span className="text-[32px] font-light text-white font-sans tracking-tight">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </span>
                                <span className="text-[10px] text-white/80 font-sans tracking-wide">
                                    {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <div className="absolute bottom-4 flex flex-col items-center gap-2 animate-bounce">
                                <span className="text-[8px] text-white/60 font-sans tracking-widest uppercase">Swipe to Unlock</span>
                            </div>
                        </div>
                    )}

                    {view === 'HOME' && (
                        <div className="flex-1 p-4 grid grid-cols-4 content-start gap-4 animate-in fade-in zoom-in-95 duration-500 pt-8 bg-gradient-to-b from-gray-900 to-black">
                                <button onClick={handleWhatsAppClick} className="flex flex-col items-center gap-1 group relative">
                                    <div className="w-11 h-11 rounded-[12px] bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/20 group-hover:scale-105 transition-transform">
                                        <MessageSquare className="w-6 h-6 text-white fill-white" />
                                    </div>
                                    <span className="text-[8px] font-medium text-white drop-shadow-md font-sans">WhatsApp</span>
                                    {packets.filter(p => p.direction === 'OUTBOUND' && p.status === 'RECEIVED').length > 0 && (
                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border border-white flex items-center justify-center text-[7px] text-white font-bold">1</div>
                                    )}
                                </button>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-11 h-11 rounded-[12px] bg-blue-500 flex items-center justify-center shadow-lg">
                                        <Phone className="w-6 h-6 text-white fill-white" />
                                    </div>
                                    <span className="text-[8px] font-medium text-white drop-shadow-md font-sans">Phone</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-11 h-11 rounded-[12px] bg-gray-200 flex items-center justify-center shadow-lg">
                                        <Settings className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <span className="text-[8px] font-medium text-white drop-shadow-md font-sans">Settings</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-11 h-11 rounded-[12px] bg-black/80 backdrop-blur flex items-center justify-center border border-mudde-gold/50">
                                        <Zap className="w-6 h-6 text-mudde-gold fill-mudde-gold" />
                                    </div>
                                    <span className="text-[8px] font-medium text-mudde-gold drop-shadow-md font-sans">Mudde Link</span>
                                </div>
                        </div>
                    )}

                    {view === 'WHATSAPP' && (
                        <div className="flex-1 flex flex-col bg-[#0b141a] animate-in slide-in-from-right duration-300 min-h-0">
                            {/* WhatsApp App Bar */}
                            <div className="h-10 px-2 bg-[#1f2c34] flex items-center justify-between border-b border-black/10 shrink-0">
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setView('HOME')} className="text-white/60 hover:text-white">
                                        <ArrowRightLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                    <div className="flex items-center gap-2 ml-1">
                                        <div className="w-7 h-7 rounded-full bg-mudde-gold/10 border border-mudde-gold/30 flex items-center justify-center relative">
                                            <User className="w-4 h-4 text-mudde-gold" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-[#1f2c34]"></div>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[9px] font-bold text-white tracking-tight truncate">Mudde System AI</span>
                                            <span className="text-[7px] font-medium text-white/60 truncate">
                                                Business Account
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-white/60 pr-1">
                                    <VideoIcon />
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                            </div>

                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-[#0b141a] custom-scrollbar" style={{backgroundImage: 'radial-gradient(circle, #202c33 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                                <div className="flex justify-center my-2">
                                     <span className="text-[8px] bg-[#1f2c34] text-[#8696a0] px-2 py-1 rounded shadow-sm uppercase tracking-wide">Today</span>
                                </div>
                                <div className="text-[8px] text-center text-[#ffd700] bg-[#1f2c34]/80 py-1.5 rounded-lg mx-2 mb-2 border border-[#ffd700]/20 shadow-sm flex items-center justify-center gap-1">
                                    <Lock className="w-2 h-2" />
                                    Messages are end-to-end encrypted.
                                </div>
                                {packets.map(p => (
                                    <div key={p.id} className={`flex ${p.direction === 'INBOUND' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-1.5 px-2 rounded-lg text-[9px] font-sans shadow-sm relative group ${p.direction === 'INBOUND' ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-white rounded-tl-none'}`}>
                                            <div className="leading-relaxed whitespace-pre-wrap break-words">{p.content}</div>
                                            <div className="flex justify-end items-center gap-0.5 mt-0.5 opacity-60">
                                                <span className="text-[7px]">{p.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {p.direction === 'INBOUND' && <CheckStatus status={p.status} />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Commander Uplink Input */}
                            <form onSubmit={handleInboundSim} className="p-1.5 bg-[#1f2c34] flex items-center gap-2 shrink-0 border-t border-white/5">
                                <button type="button" className="text-[#8696a0]">
                                    <div className="w-5 h-5 rounded-full border border-[#8696a0] flex items-center justify-center">
                                        <span className="text-[10px] font-bold">+</span>
                                    </div>
                                </button>
                                <input 
                                    type="text" value={cmdInput} onChange={(e) => setCmdInput(e.target.value)}
                                    placeholder="Message"
                                    className="flex-1 bg-[#2a3942] border-none rounded-full px-3 py-1.5 text-[10px] text-white focus:outline-none placeholder-[#8696a0]"
                                />
                                <button type="submit" className="w-7 h-7 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-transform">
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation Bar */}
                <div className="h-4 flex items-center justify-center bg-black/80 border-t border-white/5 shrink-0">
                    <div className="w-20 h-1 bg-white/20 rounded-full"></div>
                </div>
            </div>

            {/* Hardware Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-b-xl flex items-center justify-center gap-2 z-30">
                <div className="w-3 h-0.5 bg-gray-800 rounded-full"></div>
                <div className="w-0.5 h-0.5 rounded-full bg-blue-900/50"></div>
            </div>

            <div className="absolute -right-2 top-24 w-1 h-8 bg-gray-800 rounded-l-md"></div>
            <div className="absolute -right-2 top-36 w-1 h-8 bg-gray-800 rounded-l-md"></div>
        </div>
    );
};

const VideoIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M18.8 15.3l3.2 2.1c.3.2.7 0 .7-.4V7c0-.4-.4-.6-.7-.4l-3.2 2.1v6.6zm-16-11h12.5c.8 0 1.5.7 1.5 1.5v12.5c0 .8-.7 1.5-1.5 1.5H2.8c-.8 0-1.5-.7-1.5-1.5V5.8c0-.8.7-1.5 1.5-1.5z" />
    </svg>
);

const CheckStatus: React.FC<{ status: string }> = ({ status }) => {
    if (status === 'RECEIVED' || status === 'DELIVERED') return (
        <svg viewBox="0 0 16 11" width="10" height="8" fill="#53bdeb">
            <path d="M15 1.2l-8.5 8.5-4.5-4.5.7-.7 3.8 3.8L14.3.5l.7.7zm-2 0L6.5 7.7 5.8 7l5.8-5.8.7.7z" />
        </svg>
    );
    return (
        <svg viewBox="0 0 16 11" width="10" height="8" fill="currentColor" className="opacity-40">
            <path d="M15 1.2l-8.5 8.5-4.5-4.5.7-.7 3.8 3.8L14.3.5l.7.7z" />
        </svg>
    );
};

export default AndroidHandset;