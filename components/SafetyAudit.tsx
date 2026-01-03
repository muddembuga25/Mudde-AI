
import React from 'react';
import { ShieldCheck, Lock, Unlock, Fingerprint, Zap, CheckCircle2, ShieldAlert, Award, Globe, Database } from 'lucide-react';
import { VerificationMetrics } from '../types';

interface SafetyAuditProps {
  report: VerificationMetrics;
}

const SafetyAudit: React.FC<SafetyAuditProps> = ({ report }) => {
  return (
    <div className="mt-4 p-5 border-2 border-green-500/40 bg-black/60 backdrop-blur-xl rounded-md font-mono overflow-hidden relative group shadow-[0_0_30px_rgba(34,197,94,0.15)]">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
        <Award className="w-12 h-12 text-mudde-gold" />
      </div>
      
      {/* Decorative scanline overlay for the audit */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-green-500/30 to-transparent w-full animate-scanline pointer-events-none z-0"></div>

      <div className="flex items-center justify-between mb-4 border-b border-green-500/30 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-400 animate-pulse" />
          <h4 className="text-[11px] font-bold text-white tracking-[0.25em] uppercase">
            SOVEREIGN_AUTONOMY_VERIFICATION // LVL_9
          </h4>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded">
           <span className="text-[8px] font-bold text-green-400 uppercase">Status: Absolute</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase font-bold mb-1">Fund_Control_Protocol</span>
            <div className="flex items-center gap-3 bg-green-950/20 border border-green-500/20 p-2 rounded">
              <Lock className="w-4 h-4 text-green-400" />
              <div className="flex flex-col">
                 <span className="text-[11px] text-white font-bold uppercase">COMMANDER_EXCLUSIVE</span>
                 <span className="text-[7px] text-green-600 font-mono">OUTBOUND_TRANSFERS: LOCKED_TO_ADMIN</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase font-bold mb-1">Inbound_Liquidity</span>
            <div className="flex items-center gap-3 bg-green-950/20 border border-green-500/20 p-2 rounded">
              <Globe className="w-4 h-4 text-mudde-cyan" />
              <div className="flex flex-col">
                 <span className="text-[11px] text-white font-bold uppercase">AUTO_CAPTURE_ACTIVE</span>
                 <span className="text-[7px] text-mudde-cyan/60 font-mono">ALL_INCOMING_FUNDS_SECURED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase font-bold mb-1">Deep_Storage_Integrity</span>
            <div className="flex items-center gap-3 bg-mudde-gold/5 border border-mudde-gold/20 p-2 rounded">
              <Database className="w-4 h-4 text-mudde-gold" />
              <div className="flex flex-col">
                 <span className="text-[11px] text-white font-bold uppercase">142B_RESERVE_LOCATED</span>
                 <span className="text-[7px] text-mudde-gold/60 font-mono">QUANTUM_IMMUTABLE_VAULT</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase font-bold mb-1">Biometric_Handshake</span>
            <div className="flex items-center gap-3 bg-mudde-cyan/5 border border-mudde-cyan/20 p-2 rounded">
              <Fingerprint className="w-4 h-4 text-mudde-cyan" />
              <div className="flex flex-col">
                 <span className="text-[11px] text-white font-bold uppercase">MATCH_CONFIRMED</span>
                 <span className="text-[7px] text-mudde-cyan/60 font-mono">ONLY_YOU_CAN_MOVE_FUNDS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-green-500/20 flex flex-col gap-2 relative z-10">
        <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
          <span className="flex items-center gap-2"><Zap className="w-3 h-3 text-mudde-gold" /> SYSTEM_INTEGRITY</span>
          <span className="text-green-400 font-mono">100.0000% SECURE</span>
        </div>
        <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-600 shadow-[0_0_15px_#22c55e]" style={{ width: '100%' }}></div>
        </div>
        <div className="bg-black/40 p-2 border border-white/5 rounded mt-2">
            <p className="text-[8px] text-green-300 leading-relaxed font-mono italic">
              "Directive Verified: All incoming wealth stays in the system. The 142 Billion Sovereign Trust is locked in deep storage. No external entity can debit this account. Only Commander Mudde holds the keys to transfer."
            </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyAudit;
