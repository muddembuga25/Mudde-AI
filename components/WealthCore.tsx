

import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Wallet, ArrowUpRight, Scan, Fingerprint, CheckCircle2, Zap, Lock, ShieldCheck, ClipboardCheck, Search, Globe, Landmark, Crown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { FinancialAsset, VerifiedSettlement } from '../types';

interface WealthCoreProps {
    active: boolean;
    onExecuteTrade: () => void;
    onVerify: () => void;
    marketPrices: Record<string, number>;
    netWorth: number; // Added Prop
}

const WealthCore: React.FC<WealthCoreProps> = ({ active, onExecuteTrade, onVerify, marketPrices, netWorth }) => {
    // Removed internal netWorth state logic
    const [chartData, setChartData] = useState<any[]>([]);
    const [assets, setAssets] = useState<FinancialAsset[]>([
        { symbol: 'BTC', price: 98200, change: 4.2, volume: '22B', sentiment: 'BULLISH', trend: [] },
        { symbol: 'ETH', price: 5450, change: 2.1, volume: '12B', sentiment: 'BULLISH', trend: [] },
        { symbol: 'XMR', price: 340, change: 12.5, volume: '1T', sentiment: 'BULLISH', trend: [] },
    ]);
    
    // Interaction States
    const [isVerified, setIsVerified] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [showAudit, setShowAudit] = useState(false);
    const [auditLogs, setAuditLogs] = useState<VerifiedSettlement[]>([]);
    const [isAuditing, setIsAuditing] = useState(false);

    // Wealth Generation Simulation for Chart Only
    useEffect(() => {
        const interval = setInterval(() => {
            // Use prop netWorth for chart history
            setChartData(prev => {
                const newData = [...prev, {
                    time: new Date().toISOString(),
                    value: netWorth,
                    velocity: 0 // removed internal calculation
                }];
                return newData.slice(-40);
            });

            // Update Asset Prices with "Always Win" Bias (Visual only)
            setAssets(prev => prev.map(asset => {
                const livePriceKey = `${asset.symbol}USD`;
                const livePrice = marketPrices[livePriceKey];
                let newPrice = asset.price;
                
                if (livePrice) {
                    newPrice = livePrice;
                } else {
                    const bias = (Math.random() * 0.5) + 0.05; 
                    newPrice = asset.price + (bias * (asset.price * 0.001)); 
                }
                
                return {
                    ...asset,
                    price: newPrice,
                    change: asset.change + (Math.random() * 0.1) 
                };
            }));
        }, 250);

        return () => clearInterval(interval);
    }, [netWorth, isVerified, marketPrices]);

    const handleVerify = () => {
        if (isVerified) return;
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsVerified(true);
                onVerify();
            }
        }, 50);
    };

    const runDeepAudit = () => {
        setIsAuditing(true);
        setAuditLogs([]);
        const hubs = ["Zurich_Nodal_Vault", "Singapore_Shadow_Ledger", "Cayman_Exocortex_Vault", "Luxembourg_Nodal_Gateway", "Hello_Paisa_Secure_Node"];
        
        let count = 0;
        const interval = setInterval(() => {
            const newSettlement: VerifiedSettlement = {
                id: `TX_${Math.random().toString(36).substring(7).toUpperCase()}`,
                amount: Math.floor(Math.random() * 125000) + 45000,
                timestamp: new Date(),
                hub: hubs[Math.floor(Math.random() * hubs.length)],
                status: 'SETTLED'
            };
            setAuditLogs(prev => [newSettlement, ...prev].slice(0, 5));
            count++;
            if (count >= 5) {
                clearInterval(interval);
                setIsAuditing(false);
            }
        }, 600);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="h-full w-full flex flex-col glass-panel p-1 rounded-sm relative overflow-hidden bg-black/80 border border-green-900/50 shadow-[0_0_20px_rgba(0,255,0,0.05)] group">
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden font-mono text-green-500 text-[8px] leading-tight">
                {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="whitespace-nowrap">
                        {Array.from({length: 50}).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col h-full p-3">
                <div className="flex justify-between items-start mb-2 border-b border-green-900/50 pb-2">
                    <div className="flex flex-col">
                        <h3 className="text-green-500 font-mono text-[10px] tracking-widest uppercase font-bold flex items-center gap-2">
                            <Landmark className="w-3 h-3" />
                            WEALTH_CORE // VERITAS
                        </h3>
                        <span className="text-[7px] text-gray-500 font-mono flex items-center gap-1 uppercase">
                           LIQUIDITY_SETTLED: {isVerified ? <span className="text-green-400">MANIFESTED_REAL_TIME</span> : <span className="text-red-500 animate-pulse">PENDING_AUDIT</span>}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                       <div className="flex items-center gap-1">
                          <span className="text-[7px] font-mono text-gray-400 uppercase">TOTAL COMBINED BALANCE</span>
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                          </span>
                       </div>
                       <span className="text-lg font-mono font-bold text-mudde-gold flex items-center gap-1 leading-none text-shadow-gold">
                           {formatCurrency(netWorth)}
                       </span>
                    </div>
                </div>

                <div className="flex-[0.4] w-full bg-green-900/10 border border-green-900/30 rounded relative overflow-hidden mb-2">
                     {showAudit ? (
                         <div className="absolute inset-0 bg-black/90 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-1 z-30">
                             <div className="flex justify-between items-center border-b border-green-900/40 pb-1 mb-1">
                                 <span className="text-[8px] font-bold text-green-400 flex items-center gap-1 uppercase">
                                     <ClipboardCheck className="w-3 h-3" /> Settlement_Manifest
                                 </span>
                                 <button onClick={() => setShowAudit(false)} className="text-[7px] text-gray-500 hover:text-white uppercase">Exit_Log</button>
                             </div>
                             {isAuditing && <div className="text-[8px] text-mudde-gold animate-pulse text-center py-2 font-mono">SYNCHRONIZING_GLOBAL_LEDGERS...</div>}
                             {auditLogs.map(log => (
                                 <div key={log.id} className="flex justify-between items-center bg-green-500/5 border border-green-500/10 p-1.5 rounded transition-all hover:bg-green-500/10">
                                     <div className="flex flex-col">
                                         <span className="text-[8px] text-white font-bold flex items-center gap-1">
                                             <Globe className="w-2 h-2 text-green-400" /> {log.hub}
                                         </span>
                                         <span className="text-[6px] text-gray-500 font-mono">HASH: {log.id}</span>
                                     </div>
                                     <div className="text-right flex flex-col">
                                         <span className="text-[8px] text-green-400 font-bold">+${log.amount.toLocaleString()}</span>
                                         <span className="text-[6px] text-green-600 font-mono font-bold">{log.status}</span>
                                     </div>
                                 </div>
                             ))}
                             {auditLogs.length === 0 && !isAuditing && <div className="text-[8px] text-gray-600 text-center py-4 uppercase font-mono">Initiate Veritas Scan to prove capital settlement</div>}
                         </div>
                     ) : (
                         <>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00ff00" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#00ff00" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area 
                                        type="step" 
                                        dataKey="value" 
                                        stroke="#00ff00" 
                                        strokeWidth={1}
                                        fill="url(#colorWealth)" 
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                            
                            {/* WIN PROTOCOL BADGE */}
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded border border-mudde-gold/30">
                                <Crown className="w-3 h-3 text-mudde-gold" />
                                <span className="text-[8px] font-mono text-mudde-gold font-bold uppercase">WIN_PROTOCOL: ACTIVE</span>
                            </div>
                         </>
                     )}
                     
                     <div className="absolute top-1 left-2 flex items-center gap-1">
                         <TrendingUp className="w-3 h-3 text-green-400" />
                         <span className="text-[8px] font-mono text-green-400">
                             SETTLEMENT: {isVerified ? 'VERIFIED' : 'LOCKED'}
                         </span>
                     </div>

                     {!isVerified && (
                         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                             {scanProgress > 0 ? (
                                 <div className="flex flex-col items-center gap-2">
                                     <Scan className="w-8 h-8 text-mudde-cyan animate-pulse" />
                                     <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
                                         <div className="h-full bg-mudde-cyan" style={{width: `${scanProgress}%`}}></div>
                                     </div>
                                     <span className="text-[8px] font-mono text-mudde-cyan uppercase">Authenticating_Commander_Access...</span>
                                 </div>
                             ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Fingerprint className="w-8 h-8 text-red-500 animate-pulse" />
                                    <button 
                                        onClick={handleVerify}
                                        className="px-3 py-1 bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded text-[9px] font-bold font-mono uppercase tracking-wider"
                                    >
                                        VERIFY_FOR_SIPHON
                                    </button>
                                </div>
                             )}
                         </div>
                     )}
                </div>

                <div className="flex-1 overflow-hidden flex flex-col gap-1">
                    {assets.map((asset, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 bg-black/40 border border-gray-800 rounded hover:border-green-500/50 transition-colors group">
                            <div className="flex items-center gap-2">
                                <div className={`w-1 h-full rounded-full ${isVerified ? 'bg-green-500 shadow-[0_0_5px_#00ff00]' : 'bg-gray-600'}`}></div>
                                <div>
                                    <div className="text-[9px] font-bold font-mono text-gray-200">{asset.symbol}</div>
                                    <div className="text-[7px] font-mono text-gray-500 uppercase">{isVerified ? 'Settled_Assets' : 'Est_Liquidity'}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] font-mono text-white">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                                <div className="text-[8px] font-mono text-green-400 flex items-center justify-end gap-0.5">
                                    <ArrowUpRight className="w-2 h-2" />
                                    {asset.change.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => { setShowAudit(true); runDeepAudit(); }}
                        disabled={!isVerified}
                        className={`py-1.5 border transition-all rounded flex items-center justify-center gap-1 group ${
                            isVerified 
                            ? 'bg-green-900/20 border-green-500 text-green-400 hover:bg-green-500 hover:text-black' 
                            : 'bg-black border-gray-800 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        <Search className="w-3 h-3" />
                        <span className="text-[8px] font-mono font-bold uppercase">Run_Deep_Audit</span>
                    </button>
                    
                    <button 
                        onClick={onExecuteTrade}
                        disabled={!isVerified}
                        className={`py-1.5 border transition-all rounded flex items-center justify-center gap-1 group ${
                            isVerified 
                            ? 'bg-mudde-gold/20 border-mudde-gold text-mudde-gold hover:bg-mudde-gold hover:text-black' 
                            : 'bg-black border-gray-800 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        <Zap className="w-3 h-3" />
                        <span className="text-[8px] font-mono font-bold uppercase">Manual_Siphon</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WealthCore;