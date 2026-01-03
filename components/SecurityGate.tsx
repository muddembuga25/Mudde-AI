
import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Mic, Fingerprint, Lock, Activity, KeyRound, Radio } from 'lucide-react';
import { AuthStatus } from '../types';

interface SecurityGateProps {
  onVerified: () => void;
}

const SecurityGate: React.FC<SecurityGateProps> = ({ onVerified }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOCKED);
  const [scanProgress, setScanProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'TOUCH' | 'VOICE' | 'KEY'>('TOUCH');
  const [feedback, setFeedback] = useState("AWAITING_COMMANDER_HANDSHAKE");
  
  const intervalRef = useRef<any>(null);

  const handleHoldStart = () => {
    if (authStatus === AuthStatus.VERIFIED) return;
    setIsHolding(true);
    setFeedback("SCANNING_BIOMETRIC_SIGNATURE...");
    
    let progress = 0;
    intervalRef.current = setInterval(() => {
        progress += 4;
        setScanProgress(progress);
        
        if (Math.random() > 0.8) setFeedback("DECRYPTING_NEURAL_PATH...");
        
        if (progress >= 100) {
            clearInterval(intervalRef.current);
            unlockSystem("NEURAL_MATCH_CONFIRMED");
        }
    }, 20);
  };

  const handleHoldEnd = () => {
    if (authStatus === AuthStatus.VERIFIED) return;
    setIsHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (scanProgress < 100) {
        setScanProgress(0);
        setFeedback("HANDSHAKE_INTERRUPTED");
        setTimeout(() => setFeedback("AWAITING_COMMANDER_HANDSHAKE"), 1000);
    }
  };

  const handleVoiceAuth = () => {
      setFeedback("LISTENING_FOR_VOICE_PRINT...");
      setScanProgress(30);
      
      setTimeout(() => {
          setScanProgress(60);
          setFeedback("ANALYZING_FREQUENCY...");
      }, 600);

      setTimeout(() => {
          setScanProgress(100);
          unlockSystem("VOICE_PATTERN_RECOGNIZED");
      }, 1400);
  };

  const handleKeyAuth = (e: React.FormEvent) => {
      e.preventDefault();
      const validKeys = ["COMMANDER_PRIME", "admin", "mudde"];
      if (validKeys.includes(password)) {
          setScanProgress(100);
          unlockSystem("OVERRIDE_CODE_ACCEPTED");
      } else {
          setFeedback("INVALID_SOVEREIGN_KEY");
          setPassword('');
          setTimeout(() => setFeedback("AWAITING_COMMANDER_HANDSHAKE"), 2000);
      }
  };

  const unlockSystem = (successMessage: string) => {
      setAuthStatus(AuthStatus.VERIFIED);
      setFeedback(successMessage);
      setTimeout(() => {
          onVerified();
      }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#010203] flex flex-col items-center justify-center p-6 font-mono overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10 flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-[0.4em] font-sans text-shadow-neon">
                MUDDE ACCESS
            </h1>
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-mudde-gold" />
                <span>Sovereign Security Layer v9.0</span>
            </div>
        </div>

        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border border-gray-800 transition-all duration-500 ${authStatus === AuthStatus.VERIFIED ? 'border-green-500 shadow-[0_0_50px_#22c55e]' : isHolding ? 'border-mudde-cyan animate-spin-slow shadow-[0_0_30px_#00f0ff]' : ''}`}></div>
            <div className={`absolute inset-4 rounded-full border border-gray-900 border-dashed ${isHolding ? 'animate-[spin_3s_linear_infinite_reverse]' : ''}`}></div>

            {mode === 'TOUCH' && (
                <button
                    onMouseDown={handleHoldStart}
                    onMouseUp={handleHoldEnd}
                    onMouseLeave={handleHoldEnd}
                    onTouchStart={handleHoldStart}
                    onTouchEnd={handleHoldEnd}
                    className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 group ${
                        authStatus === AuthStatus.VERIFIED 
                        ? 'bg-green-500 text-black scale-110' 
                        : 'bg-black border-2 border-mudde-cyan/30 hover:border-mudde-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                    }`}
                >
                    {authStatus === AuthStatus.VERIFIED ? (
                        <Lock className="w-12 h-12" />
                    ) : (
                        <Fingerprint className={`w-16 h-16 text-mudde-cyan transition-all duration-200 ${isHolding ? 'scale-110 opacity-100' : 'opacity-50 group-hover:opacity-100'}`} />
                    )}
                    
                    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                        <div 
                            className="absolute bottom-0 left-0 right-0 bg-mudde-cyan/20 transition-all duration-75 ease-linear"
                            style={{ height: `${scanProgress}%` }}
                        ></div>
                    </div>
                </button>
            )}

            {mode === 'VOICE' && (
                <button
                    onClick={handleVoiceAuth}
                    className="relative w-40 h-40 rounded-full flex items-center justify-center bg-black border-2 border-mudde-gold/30 hover:border-mudde-gold"
                >
                    <Mic className={`w-16 h-16 text-mudde-gold ${scanProgress > 0 && scanProgress < 100 ? 'animate-pulse' : ''}`} />
                </button>
            )}

            {mode === 'KEY' && (
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <form onSubmit={handleKeyAuth} className="w-full flex flex-col gap-2">
                        <input 
                            type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="ENTER CODE" 
                            className="w-full bg-black border border-mudde-purple/50 rounded py-3 text-center text-white font-mono text-sm focus:outline-none focus:border-mudde-purple"
                        />
                        <button type="submit" className="w-full py-2 bg-mudde-purple/20 text-mudde-purple border border-mudde-purple/50 rounded text-[10px] font-bold tracking-widest hover:bg-mudde-purple hover:text-white transition-colors">
                            UNLOCK
                        </button>
                    </form>
                </div>
            )}
        </div>

        <div className="h-8 flex flex-col items-center justify-center">
            <span className={`text-xs font-mono tracking-widest font-bold ${
                authStatus === AuthStatus.VERIFIED ? 'text-green-500' : 'text-mudde-cyan'
            }`}>
                {feedback}
            </span>
        </div>

        <div className="flex gap-4 mt-4">
            <button onClick={() => setMode('TOUCH')} className={`p-3 rounded-full border transition-all ${mode === 'TOUCH' ? 'bg-mudde-cyan/20 border-mudde-cyan text-mudde-cyan' : 'bg-black border-gray-800 text-gray-600 hover:border-gray-600'}`}>
                <Fingerprint className="w-5 h-5" />
            </button>
            <button onClick={() => setMode('VOICE')} className={`p-3 rounded-full border transition-all ${mode === 'VOICE' ? 'bg-mudde-gold/20 border-mudde-gold text-mudde-gold' : 'bg-black border-gray-800 text-gray-600 hover:border-gray-600'}`}>
                <Radio className="w-5 h-5" />
            </button>
            <button onClick={() => setMode('KEY')} className={`p-3 rounded-full border transition-all ${mode === 'KEY' ? 'bg-mudde-purple/20 border-mudde-purple text-mudde-purple' : 'bg-black border-gray-800 text-gray-600 hover:border-gray-600'}`}>
                <KeyRound className="w-5 h-5" />
            </button>
        </div>

        <div className="absolute bottom-6 flex flex-col items-center gap-1 text-[8px] text-gray-600 uppercase tracking-widest font-mono">
            <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-green-900" />
                <span>System Status: Optimal</span>
            </div>
            <span>Encrypted via Mudde-Prime-Substrate</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityGate;
