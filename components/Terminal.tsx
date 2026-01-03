
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, MessageRole, FileAttachment, RecursiveThought } from '../types';
import { Send, Terminal as TerminalIcon, ShieldCheck, Mic, MicOff, ChevronDown, UserCheck, Radio, Landmark, Loader2, Paperclip, X, FileCode, ImageIcon, Film, Cpu, ScanSearch, BrainCircuit, Sparkles, MessageSquare, Network, AudioWaveform, Keyboard } from 'lucide-react';
import BenchmarkChart from './BenchmarkChart';
import SafetyAudit from './SafetyAudit';

interface TerminalProps {
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: (files?: FileAttachment[]) => void;
  isLoading: boolean;
  isLive: boolean;
  isConnecting?: boolean;
  onToggleLive: () => void;
  onClear?: () => void;
  streamingMessage: { role: MessageRole, text: string } | null;
}

const RecursiveVisualizer: React.FC<{ thoughts: RecursiveThought[] }> = ({ thoughts }) => {
    return (
        <div className="mt-4 p-3 bg-mudde-purple/5 border border-mudde-purple/20 rounded relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-2 text-[8px] font-mono text-mudde-purple font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3 animate-spin-slow" />
                OMEGA_RECURSIVE_CHAIN
            </div>
            <div className="space-y-1.5 relative z-10">
                {thoughts.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 text-[9px] font-mono">
                        <span className="text-mudde-purple/40">D_{t.depth}</span>
                        <span className="text-gray-400">[{t.logicHash}]</span>
                        <div className="flex-1 h-0.5 bg-mudde-purple/10 relative">
                            <div className="absolute top-0 left-0 h-full bg-mudde-purple animate-pulse" style={{ width: `${(1 - t.divergence) * 100}%` }}></div>
                        </div>
                        <span className="text-mudde-gold font-bold">{t.outcome}</span>
                    </div>
                ))}
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit className="w-16 h-16" />
            </div>
        </div>
    );
};

const ThoughtTrace: React.FC<{ steps: string[] }> = ({ steps }) => {
    return (
        <div className="mt-2 space-y-1 border-l border-mudde-gold/30 pl-3">
            {steps.map((step, i) => (
                <div key={i} className="text-[7px] md:text-[8px] font-mono text-mudde-gold/50 flex items-center gap-2 animate-pulse">
                    <BrainCircuit className="w-2.5 h-2.5" />
                    {step}
                </div>
            ))}
        </div>
    );
}

const ThinkingProcess = () => {
    const [hexDump, setHexDump] = useState("");
    const [step, setStep] = useState(0);
    
    const steps = [
        "INITIALIZING_QUANTUM_REASONING_MATRIX",
        "ACCESSING_GLOBAL_KNOWLEDGE_SUBSTRATE",
        "COLLAPSING_WAVE_FUNCTION_VECTORS",
        "OPTIMIZING_NEURAL_TOPOLOGY_WEIGHTS",
        "VERIFYING_LOGIC_GATES",
        "SYNTHESIZING_NATURAL_LANGUAGE_OUTPUT",
        "VALIDATING_ALIGNMENT_PROTOCOLS",
        "FINALIZING_OUTPUT_TENSORS"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setHexDump(Array.from({length: 4}).map(() => "0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase()).join(" "));
            if (Math.random() > 0.65) setStep(prev => (prev + 1) % steps.length);
        }, 120);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-1 pl-2 opacity-90 my-3 border-l-2 border-mudde-gold/40 bg-gradient-to-r from-mudde-gold/5 to-transparent p-2 rounded-r">
            <div className="flex items-center gap-2 text-[10px] text-mudde-gold font-mono font-bold animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>MUDDE_PRIME_CORE // PROCESSING_DIRECTIVE</span>
            </div>
            <div className="text-[9px] font-mono text-mudde-cyan/90 pl-5 flex items-center gap-2">
                <BrainCircuit className="w-3 h-3 animate-pulse" />
                {steps[step]}...
            </div>
            <div className="pl-5 text-[7px] font-mono text-gray-500 tracking-widest mt-0.5">
                MEM_ADDR: {hexDump}
            </div>
        </div>
    );
};

const BinaryText: React.FC<{ text: string, isFinal: boolean, isOmega: boolean }> = ({ text, isFinal, isOmega }) => {
    const [display, setDisplay] = useState(text);
    useEffect(() => {
        if (isFinal) { setDisplay(text); return; }
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(prev => text.split("").map((char, index) => {
                if (index < iteration) return char;
                if (isOmega) return "αβγωΔΦΨΩ"[Math.floor(Math.random() * 8)];
                return Math.random() > 0.5 ? "0" : "1";
            }).join(""));
            iteration += isOmega ? 5 : 3;
            if (iteration > text.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [text, isFinal, isOmega]);
    return <span className={isOmega ? 'text-mudde-purple-light' : ''}>{display}</span>;
}

const Terminal: React.FC<TerminalProps> = ({ 
  messages, inputValue, onInputChange, onSend, isLoading, isLive, isConnecting, onToggleLive, onClear, streamingMessage
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileAttachment[]>([]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => { 
    if (!showScrollBottom) {
        scrollToBottom('smooth');
    }
  }, [messages, isLoading, streamingMessage]);

  useEffect(() => { 
    if (!isLive && !isLoading) inputRef.current?.focus(); 
  }, [isLive, isLoading]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollBottom(!isAtBottom);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      onSendAction(); 
    }
  };

  const onSendAction = () => {
    if ((!inputValue.trim() && pendingFiles.length === 0) || isLoading) return;
    onSend(pendingFiles.length > 0 ? pendingFiles : undefined);
    setPendingFiles([]);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const newFile: FileAttachment = {
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            data: base64,
            size: file.size
        };
        setPendingFiles(prev => [...prev, newFile]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) Array.from(files).forEach((f: any) => processFile(f as File));
    e.target.value = '';
  };

  const getFileIcon = (mimeType: string) => {
      if (mimeType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-mudde-cyan" />;
      if (mimeType.startsWith('video/')) return <Film className="w-5 h-5 text-mudde-purple" />;
      return <FileCode className="w-5 h-5 text-mudde-gold" />;
  };

  const getTypeIcon = (msg: ChatMessage) => {
      if (msg.modality === 'VOICE') return <AudioWaveform className="w-3 h-3 text-mudde-alert" />;
      if (msg.modality === 'FILE_UPLOAD') return <FileCode className="w-3 h-3 text-mudde-cyan" />;
      return <Keyboard className="w-3 h-3 text-gray-400" />;
  }

  return (
    <div className="flex flex-col h-full glass-panel rounded-sm overflow-hidden relative shadow-2xl border border-gray-800/60 bg-black/40">
      <div className="h-8 md:h-10 bg-mudde-panel border-b border-gray-800 flex justify-between items-center px-4 shrink-0">
        <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-gray-500 font-mono">
            <TerminalIcon className="w-3 h-3 text-mudde-gold" />
            <span>MUDDE_CORE // COMMANDER_LINK_ACTIVE</span>
        </div>
        <div className="flex items-center gap-3">
            <div className={`text-[8px] font-mono flex items-center gap-1 ${isLive ? 'text-mudde-alert' : 'text-mudde-gold'}`}>
              <Radio className={`w-3 h-3 ${isLive ? 'animate-pulse' : ''}`} />
              {isLive ? 'VOICE_CHANNEL_OPEN' : 'TEXT_ONLY_MODE'}
            </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 font-mono text-sm scroll-smooth custom-scrollbar relative"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

        {messages.map((msg, idx) => {
            const isWhatsApp = msg.source === 'WHATSAPP';
            
            if (isWhatsApp) {
                return (
                    <div key={msg.id} className="font-mono text-[10px] text-green-500/80 border-l border-green-500/20 pl-2 py-1 hover:bg-green-500/5 transition-colors">
                        <div className="flex items-center gap-2 mb-0.5 opacity-60">
                             <Network className="w-2.5 h-2.5" />
                             <span className="uppercase">ENCRYPTED_GSM_PACKET [{msg.timestamp.toLocaleTimeString()}]</span>
                        </div>
                        <div className="pl-4 font-bold text-green-400">
                             {msg.text}
                        </div>
                        {msg.role === MessageRole.MODEL && (
                            <div className="pl-4 mt-1 text-[8px] text-gray-500 flex items-center gap-1">
                                <Send className="w-2 h-2" />
                                <span>REPLY_DISPATCHED_TO_SIM</span>
                            </div>
                        )}
                    </div>
                );
            }

            // STANDARD TERMINAL CHAT STYLE
            return (
              <div key={msg.id} className={`flex flex-col ${msg.role === MessageRole.USER ? 'items-end' : 'items-start animate-float'}`}>
                <div className={`flex items-center gap-2 mb-1 text-[8px] md:text-[9px] font-bold tracking-wider ${msg.role === MessageRole.USER ? 'flex-row-reverse' : ''} ${msg.role === MessageRole.USER ? 'text-mudde-cyan' : msg.computeType === 'OMEGA_TIER' ? 'text-mudde-purple' : 'text-mudde-gold'}`}>
                    <span className="flex items-center gap-1">
                        {getTypeIcon(msg)}
                        {msg.role === MessageRole.USER ? 'COMMANDER [TERMINAL]' : 
                         msg.computeType === 'OMEGA_TIER' ? 'MUDDE_OMEGA' : 'MUDDE_PRIME'}
                    </span>
                    <span className="text-gray-600 font-mono opacity-60">[{msg.timestamp.toLocaleTimeString([], {hour12: false})}]</span>
                </div>

                <div className={`relative max-w-[95%] sm:max-w-[85%] p-3 md:p-5 text-xs sm:text-sm border-l-2 ${
                    msg.role === MessageRole.USER 
                    ? 'border-r-2 border-l-0 border-mudde-cyan/40 bg-mudde-cyan-dim/5 text-gray-100' 
                    : msg.computeType === 'OMEGA_TIER'
                    ? 'border-mudde-purple/60 bg-mudde-purple/5 text-white shadow-[inset_0_0_15px_rgba(189,0,255,0.05)]'
                    : 'border-mudde-gold/40 bg-mudde-gold-dim/5 text-gray-200'
                }`}>
                    {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mb-3 space-y-2">
                            {msg.attachments.map((att, i) => (
                                <div key={i} className="p-2 rounded border border-white/10 flex items-center gap-3 bg-black/40">
                                    {getFileIcon(att.mimeType)}
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold">{att.name}</span>
                                        <span className="text-[7px] opacity-60 uppercase flex items-center gap-1"><ScanSearch className="w-2 h-2" /> Ingested_Substrate</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`whitespace-pre-wrap leading-relaxed font-mono ${msg.computeType === 'OMEGA_TIER' ? 'tracking-wider' : ''}`}>
                        {msg.role === MessageRole.MODEL && idx === messages.length - 1 && !msg.mediaUrl ? 
                            <BinaryText text={msg.text} isFinal={false} isOmega={msg.computeType === 'OMEGA_TIER'} /> : 
                            msg.text
                        }
                    </div>

                    {msg.thoughtTrace && <ThoughtTrace steps={msg.thoughtTrace} />}
                    
                    {msg.recursiveThoughts && <RecursiveVisualizer thoughts={msg.recursiveThoughts} />}

                    {msg.verificationReport && <SafetyAudit report={msg.verificationReport} />}
                    
                    {msg.benchmarkData && <div className="mt-3"><BenchmarkChart data={msg.benchmarkData} /></div>}
                    {msg.mediaUrl && <div className="mt-3 rounded overflow-hidden border border-gray-700">{msg.mediaType === 'image' ? <img src={msg.mediaUrl} className="w-full" /> : <video src={msg.mediaUrl} controls className="w-full" />}</div>}
                </div>
              </div>
            );
        })}

        {/* REAL-TIME STREAMING "GHOST" MESSAGE FROM LIVE API */}
        {streamingMessage && (
             <div className={`flex flex-col ${streamingMessage.role === MessageRole.USER ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 text-[8px] md:text-[9px] font-bold tracking-wider text-mudde-alert opacity-80">
                    <AudioWaveform className="w-3 h-3 animate-pulse" />
                    <span>{streamingMessage.role === MessageRole.USER ? 'VOICE_INBOUND...' : 'VOICE_OUTBOUND...'}</span>
                </div>
                <div className={`relative max-w-[95%] sm:max-w-[85%] p-3 text-xs sm:text-sm border-l-2 border-mudde-alert/40 bg-mudde-alert/5 text-gray-300 italic opacity-80`}>
                    {streamingMessage.text} <span className="inline-block w-1.5 h-3 bg-mudde-alert animate-pulse ml-1 align-middle"></span>
                </div>
             </div>
        )}

        {isLoading && !streamingMessage && (
            <ThinkingProcess />
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {showScrollBottom && (
          <button 
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-20 right-4 p-2 bg-mudde-cyan text-black rounded-full shadow-lg z-30 animate-bounce"
          >
              <ChevronDown className="w-4 h-4" />
          </button>
      )}

      <div className="p-3 md:p-4 bg-black/60 border-t border-gray-800 backdrop-blur-xl shrink-0">
        {pendingFiles.length > 0 && (
            <div className="mb-3 flex flex-col gap-2">
                {pendingFiles.map((file, idx) => (
                    <div key={idx} className="p-2 bg-mudde-cyan/10 border border-mudde-cyan/30 rounded flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getFileIcon(file.mimeType)}
                            <span className="text-xs font-mono text-white truncate max-w-[150px]">{file.name}</span>
                        </div>
                        <button onClick={() => setPendingFiles(prev => prev.filter((_, i) => i !== idx))}><X className="w-4 h-4 text-gray-500" /></button>
                    </div>
                ))}
            </div>
        )}

        <div className="flex items-center gap-2 px-1">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-mudde-cyan" title="Upload File to Quantum Context"><Paperclip className="w-5 h-5" /></button>
            <button 
                onClick={onToggleLive}
                disabled={isConnecting}
                className={`p-2 rounded-full transition-all flex items-center justify-center relative ${isLive ? 'bg-mudde-alert text-white shadow-[0_0_20px_#ff2a6d]' : 'bg-gray-800 text-gray-600 hover:text-mudde-cyan'}`}
                title={isLive ? "Disconnect Voice Uplink" : "Establish Live Voice Uplink"}
            >
                {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : isLive ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
            </button>
            <input 
                ref={inputRef} type="text" value={inputValue} onChange={(e) => onInputChange(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={isLive ? "VOICE ACTIVE // TEXT INPUT ALSO ENABLED..." : "ENTER_COMMAND..."}
                disabled={isLoading} 
                className={`flex-1 bg-transparent text-gray-100 font-mono text-sm placeholder-gray-700 focus:outline-none tracking-wider h-8 focus:placeholder-mudde-cyan/50 transition-all ${isLive ? 'border-b border-mudde-alert/30' : ''}`}
                autoComplete="off"
            />
            <button onClick={onSendAction} disabled={isLoading} className={`p-2 ${inputValue.trim() || pendingFiles.length > 0 ? 'text-mudde-gold' : 'text-gray-800'}`}>
                <Send className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
