

import React, { useEffect, useState, useRef } from 'react';
import { Activity, Server, Terminal, CheckCircle2, DollarSign, Zap, Lock } from 'lucide-react';
import { MT5Position } from '../types';

interface MetaTraderBridgeProps {
  activePositions: MT5Position[];
  netWorth: number;
  marketPrices: Record<string, number>;
  realizedProfit?: number; // New Prop for HFT earnings
}

const MetaTraderBridge: React.FC<MetaTraderBridgeProps> = ({ activePositions, netWorth, marketPrices, realizedProfit = 0 }) => {
  const [connectionLatency, setConnectionLatency] = useState(0.5);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activePositions, logs]);

  useEffect(() => {
     const keys = Object.keys(marketPrices);
     // Defensive check: Only attempt to log ticks if market data is actually present
     if (keys.length > 0 && Math.random() > 0.4) {
         const symbol = keys[Math.floor(Math.random() * keys.length)];
         const price = marketPrices[symbol];
         
         // Verification: Ensure price is a valid number before calling .toFixed()
         if (typeof price === 'number' && !isNaN(price)) {
             const now = new Date();
             const time = now.toLocaleTimeString([], { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
             const msg = `TICK: ${symbol} :: ${price.toFixed(2)}`;
             setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 30));
         }
     }
  }, [marketPrices]);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionLatency(Math.random() * 2 + 0.1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Safeguard: Handle potential undefined activePositions or position properties
  const totalOpenProfit = (activePositions || []).reduce((acc, pos) => acc + (pos.profit || 0), 0);

  return (
    <div className="flex flex-col h-full glass-panel rounded-sm relative overflow-hidden bg-[#0a0a0a] border border-gray-800">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <div className="relative z-10 flex items-center justify-between p-3 border-b border-gray-800 bg-black/60 backdrop-blur-md">
            <div className="flex items-center gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-900/20 border border-blue-500/50 rounded flex items-center justify-center shrink-0 relative">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/MetaTrader_5_Logo.svg" alt="MT5" className="w-4 h-4 md:w-5 md:h-5 opacity-80" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full animate-pulse"></div>
                </div>
                <div className="min-w-0">
                    <h2 className="text-[9px] md:text-[11px] font-bold text-blue-400 tracking-widest font-mono flex items-center gap-2 truncate">
                        MT5_BRIDGE
                        <span className="text-[6px] md:text-[8px] bg-blue-500/10 text-blue-300 px-1 rounded border border-blue-500/30 hidden sm:inline uppercase">HFT_Active</span>
                    </h2>
                    <div className="flex items-center gap-1.5 md:gap-2 mt-0.5">
                        <Zap className="w-2.5 h-2.5 text-mudde-gold animate-bounce" />
                        <span className="text-[7px] md:text-[8px] text-mudde-gold font-mono font-bold">ALGO: ALWAYS_WIN_V9</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-end shrink-0">
                <span className="text-[10px] md:text-[12px] font-mono font-bold leading-none text-white">
                    ${(netWorth + totalOpenProfit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-[7px] text-gray-500 font-mono uppercase">REALIZED:</span>
                    <span className="text-[8px] font-mono text-green-400 font-bold">
                        +${realizedProfit.toLocaleString()}
                    </span>
                    <Lock className="w-2 h-2 text-green-500" />
                </div>
            </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-black/20">
                <table className="w-full text-left border-collapse min-w-[450px] sm:min-w-0">
                    <thead className="sticky top-0 bg-[#0f1115] border-b border-gray-800 text-[7px] md:text-[8px] font-mono text-gray-500 uppercase z-10">
                        <tr>
                            <th className="p-2">Symbol</th>
                            <th className="p-2">Type</th>
                            <th className="p-2 text-right">Vol</th>
                            <th className="p-2 text-right">Entry</th>
                            <th className="p-2 text-right">Price</th>
                            <th className="p-2 text-right">P/L</th>
                        </tr>
                    </thead>
                    <tbody className="text-[9px] md:text-[10px] font-mono divide-y divide-gray-800/50">
                        {!activePositions || activePositions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-6 text-center text-gray-600 italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <Activity className="w-4 h-4 animate-spin" />
                                        <span>SCANNING_MARKET_VECTORS...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            activePositions.map((pos) => (
                                <tr key={pos.ticket} className="hover:bg-white/5 transition-colors group animate-in fade-in">
                                    <td className="p-2 font-bold text-white whitespace-nowrap flex items-center gap-1">
                                        {pos.symbol}
                                        {pos.comment === "HFT_WIN_PROTOCOL" && <Zap className="w-2 h-2 text-mudde-gold" />}
                                    </td>
                                    <td className={`p-2 font-bold ${pos.type === 'BUY' ? 'text-blue-400' : 'text-orange-400'}`}>{pos.type}</td>
                                    <td className="p-2 text-right text-gray-300">{(pos.volume || 0).toFixed(2)}</td>
                                    <td className="p-2 text-right text-gray-500 hidden sm:table-cell">{(pos.openPrice || 0).toFixed(2)}</td>
                                    <td className="p-2 text-right text-white font-bold">{(pos.currentPrice || 0).toFixed(2)}</td>
                                    <td className={`p-2 text-right font-bold ${pos.profit >= 0 ? 'text-green-400 bg-green-900/10' : 'text-red-400'}`}>
                                        {(pos.profit || 0).toFixed(1)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="h-24 bg-black border-t border-gray-800 flex flex-col font-mono">
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {logs.map((log, i) => (
                        <div key={i} className="text-[8px] md:text-[9px] text-green-500/60 truncate flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            {log}
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>

        <div className="p-1 border-t border-gray-800 bg-[#050505] flex justify-between items-center text-[7px] font-mono text-gray-600">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-2 h-2 text-green-500"/> OK</span>
            <span className="text-mudde-gold animate-pulse font-bold tracking-wider">ALWAYS_WIN_ENGINE :: ENGAGED</span>
        </div>
    </div>
  );
};

export default MetaTraderBridge;