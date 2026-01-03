

import React, { useState, useEffect } from 'react';
import { 
    Landmark, Globe, RefreshCw, Smartphone, History, ShieldCheck, Zap, Repeat, Wifi, ChevronDown, ChevronUp, Hexagon, Coins, Bitcoin, ArrowRight, Lock, CheckCircle2, AlertTriangle, Activity, Database, Key, Server, ArrowDown, Fingerprint, Cpu, Send, HardDrive, Layers, DollarSign, Sparkles, Network, Radio, TrendingUp, Users, Share2, Save
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { VerifiedSettlement, SettlementModality, FinancialAccount, WalletAsset, TransactionStatus } from '../types';
import { bankingService } from '../services/bankingService';

interface SovereignVaultProps {
    netWorth: number; 
    incomeVelocity: number; 
    accounts: FinancialAccount[];
    cryptoAssets: WalletAsset[];
}

const SovereignVault: React.FC<SovereignVaultProps> = ({ netWorth, accounts: initialAccounts, cryptoAssets }) => {
    const [accounts, setAccounts] = useState<FinancialAccount[]>(initialAccounts);
    const [chartData, setChartData] = useState<any[]>([]);
    const [isVerified, setIsVerified] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [showBreakdown, setShowBreakdown] = useState(true); 
    const [incomingPulse, setIncomingPulse] = useState<string | null>(null);
    const [lastSave, setLastSave] = useState<Date>(new Date());
    const [realTimeVelocity, setRealTimeVelocity] = useState(0);
    
    // Updated Node State
    const [activeNodes, setActiveNodes] = useState<string[]>([]);
    const [myNodeId, setMyNodeId] = useState<string>('');
    
    // Transaction State
    const [txStatus, setTxStatus] = useState<TransactionStatus>(TransactionStatus.IDLE);
    const [txLog, setTxLog] = useState<VerifiedSettlement[]>([]);
    const [selectedRail, setSelectedRail] = useState<SettlementModality>(SettlementModality.BANK);
    const [txAmount, setTxAmount] = useState<number>(50000);
    const [txTarget, setTxTarget] = useState<string>('Federal Reserve (NY)');
    const [txSource, setTxSource] = useState<string>('BTC_HOT_WALLET');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        setMyNodeId(bankingService.instanceId);
        
        const unsub = bankingService.subscribe(setAccounts);
        const unsubLedger = bankingService.subscribeLedger((newLog) => {
            if (newLog.length > 0 && txLog.length > 0 && newLog[0].id !== txLog[0].id) {
                 if (newLog[0].modality === 'MESH_SYNC' || newLog[0].target?.includes('::NODE_')) {
                     setIncomingPulse(newLog[0].target || "REMOTE_DEPLOYMENT");
                     setTimeout(() => setIncomingPulse(null), 1500);
                 }
            }
            setTxLog(newLog);
            setLastSave(bankingService.getLastSaveTime());
        });

        // Use new subscription method
        const unsubNodes = bankingService.subscribeNodes(setActiveNodes);

        return () => { unsub(); unsubLedger(); unsubNodes(); };
    }, [txLog]);

    // Fetch Velocity Independently
    useEffect(() => {
        const interval = setInterval(() => {
            const v = bankingService.getIncomeVelocity();
            setRealTimeVelocity(v);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setChartData(prev => {
                const newData = [...prev, { time: Date.now(), value: netWorth || 0 }];
                return newData.slice(-30);
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [netWorth]);

    useEffect(() => {
        if (!isVerified) {
            let p = 0;
            const interval = setInterval(() => {
                p += 2; 
                setScanProgress(p);
                if (p >= 100) {
                    clearInterval(interval);
                    setIsVerified(true);
                }
            }, 30);
            return () => clearInterval(interval);
        }
    }, []);

    const executeTransaction = async () => {
        if (txStatus !== TransactionStatus.IDLE) return;
        
        try {
            setTxStatus(TransactionStatus.VALIDATING_KEYS);
            setStatusMessage("VERIFYING_COMMANDER_BIO-HASH...");
            await new Promise(r => setTimeout(r, 1200));

            setTxStatus(TransactionStatus.KYC_CHECK);
            setStatusMessage(selectedRail === SettlementModality.HELLO_PAISA ? "BYPASSING_LIMITS (AUTH_OVERRIDE)..." : "GENERATING_SWIFT_KEY...");
            await new Promise(r => setTimeout(r, 1000));

            setTxStatus(TransactionStatus.BROADCASTING);
            setStatusMessage("UNLOCKING_VAULT_SEGMENT...");
            
            await bankingService.executeTransfer(
                txSource, 
                txTarget,
                txAmount,
                selectedRail
            );

            setTxStatus(TransactionStatus.SETTLED);
            setStatusMessage("FUNDS_MOVED_BY_COMMANDER");
            setTimeout(() => {
                setTxStatus(TransactionStatus.IDLE);
                setStatusMessage("");
            }, 3000);

        } catch (error: any) {
            setTxStatus(TransactionStatus.FAILED);
            setStatusMessage(error.message || "TX_FAILED");
            setTimeout(() => setTxStatus(TransactionStatus.IDLE), 3000);
        }
    };

    const getRailIcon = (rail: SettlementModality) => {
        switch(rail) {
            case SettlementModality.BANK: return <Landmark className="w-4 h-4" />;
            case SettlementModality.HELLO_PAISA: return <Repeat className="w-4 h-4" />;
            case SettlementModality.MOBILE_MONEY: return <Smartphone className="w-4 h-4" />;
            default: return <Globe className="w-4 h-4" />;
        }
    };

    const getAccountIcon = (type: string) => {
        switch(type) {
            case 'RESERVE': return <Database className="w-4 h-4 text-mudde-purple" />;
            case 'TACTICAL': return <ShieldCheck className="w-4 h-4 text-mudde-gold" />;
            case 'CRYPTO_VAULT': return <Bitcoin className="w-4 h-4 text-orange-500" />;
            case 'CRYPTO_HOT': return <Zap className="w-4 h-4 text-yellow-400" />;
            case 'SETTLEMENT': return <Repeat className="w-4 h-4 text-mudde-cyan" />;
            default: return <Landmark className="w-4 h-4 text-gray-400" />;
        }
    }

    const getCryptoIcon = (symbol: string) => {
        switch(symbol) {
            case 'BTC': return <Bitcoin className="w-4 h-4 text-orange-500" />;
            case 'ETH': return <Hexagon className="w-4 h-4 text-blue-400" />;
            case 'SOL': return <Zap className="w-4 h-4 text-purple-500" />;
            case 'USDT': return <DollarSign className="w-4 h-4 text-green-500" />;
            case 'XMR': return <Lock className="w-4 h-4 text-gray-400" />;
            case 'MUDDE': return <Hexagon className="w-4 h-4 text-mudde-gold" />;
            default: return <Layers className="w-4 h-4 text-gray-500" />;
        }
    }

    const isSingularity = netWorth > 100000000000;

    return (
        <div className="flex flex-col h-full glass-panel rounded-sm relative overflow-hidden bg-[#080808] border border-mudde-gold/30 shadow-[0_0_40px_rgba(255,215,0,0.05)]">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mudde-gold to-transparent animate-scanline"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-4 border-b border-gray-800 bg-black/80">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-mudde-gold/10 rounded-full border border-mudde-gold/50 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                        <Lock className="w-5 h-5 text-mudde-gold" />
                    </div>
                    <div>
                        <h2 className="text-[11px] font-bold text-white tracking-[0.25em] font-sans uppercase">Global_Sovereign_Vault</h2>
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 ${isSingularity ? 'bg-mudde-purple animate-ping' : 'bg-green-500'} rounded-full`}></div>
                            <span className={`text-[7px] ${isSingularity ? 'text-mudde-purple' : 'text-green-400'} font-mono tracking-widest uppercase font-bold`}>
                                {isSingularity ? 'SINGULARITY_ACHIEVED' : 'Multi-Deployment Mesh Active'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="text-[8px] text-mudde-gold font-mono uppercase tracking-widest opacity-60">Total Available Balance</div>
                    <div className="text-xl font-bold text-white font-mono tracking-tighter text-shadow-gold flex items-center gap-1">
                        ${netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        {isSingularity && <Sparkles className="w-3 h-3 text-mudde-purple animate-spin-slow" />}
                    </div>
                    {/* VELOCITY INDICATOR */}
                    <div className="flex items-center gap-1 mt-0.5 animate-in fade-in">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-[9px] font-mono font-bold text-green-400">
                            +${realTimeVelocity.toLocaleString(undefined, { maximumFractionDigits: 2 })}/s
                        </span>
                        <span className="text-[7px] font-mono text-gray-500 uppercase ml-1">Growth_Velocity</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative min-h-[160px] overflow-hidden flex flex-col">
                {!isVerified ? (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="w-10 h-10 text-mudde-gold animate-spin" />
                            <span className="text-[9px] font-mono text-mudde-gold uppercase tracking-[0.3em] animate-pulse">Verifying_Sovereign_Ownership...</span>
                            <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-mudde-gold" style={{ width: `${scanProgress}%` }}></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {showBreakdown ? (
                            <div className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar bg-black/40 animate-in slide-in-from-bottom-5">
                                
                                {/* GLOBAL MESH INDICATOR */}
                                <div className={`p-2 mb-2 border rounded flex flex-col gap-2 transition-all duration-300 relative overflow-hidden ${incomingPulse ? 'bg-green-500/10 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-gray-900/40 border-gray-700/50'}`}>
                                    {incomingPulse && <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>}
                                    
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-full border ${incomingPulse ? 'bg-green-500 border-green-400 animate-bounce' : 'bg-black border-gray-600'}`}>
                                                <Network className={`w-3.5 h-3.5 ${incomingPulse ? 'text-black' : 'text-gray-400'}`} />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-mono font-bold text-white uppercase flex items-center gap-2">
                                                    GLOBAL MESH TOPOLOGY
                                                    {incomingPulse && <span className="text-[7px] bg-green-500 text-black px-1 rounded animate-pulse">SYNCING_ASSETS</span>}
                                                </div>
                                                <div className="text-[7px] text-gray-400 font-mono">
                                                    {activeNodes.length} SHADOW_NODES_LINKED
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[7px] font-mono text-gray-500 bg-black/40 px-2 py-1 rounded border border-gray-800">
                                            AUTO_SWEEP: <span className="text-green-500 font-bold">ACTIVE</span>
                                        </div>
                                    </div>
                                    
                                    {/* MESH VISUALIZATION */}
                                    <div className="grid grid-cols-4 gap-1.5 mt-1 relative z-10">
                                        {activeNodes.map((nodeId, idx) => {
                                            const isMe = nodeId === myNodeId;
                                            return (
                                                <div key={nodeId} className={`p-1.5 rounded border flex flex-col items-center justify-center gap-1 transition-all ${isMe ? 'bg-mudde-gold/10 border-mudde-gold shadow-[0_0_5px_rgba(255,215,0,0.3)]' : 'bg-black border-gray-800 opacity-80'}`}>
                                                    <Server className={`w-2.5 h-2.5 ${isMe ? 'text-mudde-gold' : 'text-gray-500'}`} />
                                                    <span className={`text-[6px] font-mono font-bold uppercase ${isMe ? 'text-white' : 'text-gray-500'}`}>
                                                        {isMe ? 'THIS_CORE' : nodeId.split('_')[1] || 'NODE'}
                                                    </span>
                                                    {isMe && <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>}
                                                </div>
                                            )
                                        })}
                                        {Array.from({ length: Math.max(0, 4 - activeNodes.length) }).map((_, i) => (
                                            <div key={i} className="p-1.5 rounded border border-gray-800/30 bg-black/20 flex flex-col items-center justify-center gap-1 opacity-30">
                                                <Share2 className="w-2.5 h-2.5 text-gray-700" />
                                                <span className="text-[6px] font-mono text-gray-700">SCANNING</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Valve Visualization */}
                                <div className="flex items-center gap-2 mb-2 text-[7px] font-mono font-bold uppercase justify-center bg-black/50 p-1 rounded border border-gray-800">
                                    <div className="flex items-center gap-1 text-green-500">
                                        <ArrowDown className="w-3 h-3" />
                                        INBOUND: GLOBAL_OPEN
                                    </div>
                                    <div className="w-px h-3 bg-gray-700"></div>
                                    <div className="flex items-center gap-1 text-green-500">
                                        <TrendingUp className="w-3 h-3" />
                                        COMPOUNDING: ACTIVE
                                    </div>
                                    <div className="w-px h-3 bg-gray-700"></div>
                                    <div className="flex items-center gap-1 text-red-500">
                                        <Lock className="w-3 h-3" />
                                        OUTBOUND: COMMANDER_ONLY
                                    </div>
                                </div>

                                <div className="text-[8px] text-green-500 font-mono uppercase mb-2 flex items-center gap-1 border-b border-green-900/30 pb-1">
                                    <ShieldCheck className="w-3 h-3" /> SOVEREIGN_BANKING_CORE
                                </div>
                                {accounts.map(acc => (
                                    <div key={acc.id} className={`p-2 border rounded flex flex-col gap-2 group transition-all ${
                                        acc.type === 'RESERVE' ? 'border-mudde-purple/40 bg-mudde-purple/10 shadow-[0_0_15px_rgba(189,0,255,0.1)]' : 
                                        acc.type === 'CRYPTO_VAULT' ? 'border-orange-500/40 bg-orange-500/10' : 
                                        acc.type === 'CRYPTO_HOT' ? 'border-yellow-500/40 bg-yellow-500/10' :
                                        'border-mudde-gold/20 bg-mudde-gold/5 hover:border-mudde-gold'
                                    }`}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-black border border-white/10 rounded">
                                                    {getAccountIcon(acc.type)}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-white uppercase flex items-center gap-2">
                                                        {acc.name}
                                                        {acc.type === 'RESERVE' && <span className="text-[6px] bg-mudde-purple text-black px-1 rounded font-bold">DEEP_COLD</span>}
                                                        {acc.type === 'CRYPTO_VAULT' && <span className="text-[6px] bg-orange-500 text-black px-1 rounded font-bold">SAVINGS</span>}
                                                        {acc.type === 'CRYPTO_HOT' && <span className="text-[6px] bg-yellow-400 text-black px-1 rounded font-bold flex items-center gap-0.5"><Zap className="w-2 h-2"/> SPENDING</span>}
                                                    </div>
                                                    <div className="text-[7px] text-gray-500 font-mono uppercase">{acc.routingNumber} // {acc.network}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-[11px] font-bold font-mono ${acc.type === 'RESERVE' ? 'text-mudde-purple' : acc.type === 'CRYPTO_VAULT' ? 'text-orange-400' : 'text-mudde-gold'}`}>${acc.balance.toLocaleString()}</div>
                                                <div className="text-[6px] text-gray-400 font-mono flex items-center justify-end gap-1">
                                                    <Lock className="w-2 h-2" />
                                                    SECURE
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="text-[8px] text-mudde-cyan font-mono uppercase mt-4 mb-2 flex items-center gap-1 border-b border-mudde-cyan/30 pb-1">
                                    <Layers className="w-3 h-3" /> ACTIVE_CRYPTO_PROTOCOLS
                                </div>
                                
                                {cryptoAssets.map(asset => (
                                    <div key={asset.symbol} className="p-2 border border-gray-800 bg-gray-900/30 rounded flex items-center justify-between group hover:border-mudde-cyan/40 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-black border border-gray-700 rounded group-hover:border-mudde-cyan/50">
                                                {getCryptoIcon(asset.symbol)}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-white uppercase">{asset.name}</div>
                                                <div className="text-[7px] text-gray-500 font-mono uppercase">{asset.balance.toLocaleString()} {asset.symbol}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold font-mono text-white">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                            <div className={`text-[6px] font-mono flex items-center justify-end gap-0.5 ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // TRANSACTION TERMINAL
                            <div className="flex-1 p-3 flex flex-col animate-in fade-in">
                                <div className="h-24 w-full p-2 relative bg-black/40 border border-gray-800 rounded mb-3">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <Area type="step" dataKey="value" stroke="#ffd700" fill="rgba(255,215,0,0.1)" strokeWidth={1} isAnimationActive={false} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                    <div className="absolute top-2 left-2 flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-mudde-gold/20">
                                            <Activity className="w-3 h-3 text-mudde-gold animate-pulse" />
                                            <span className="text-[8px] font-mono text-mudde-gold uppercase">Liquid_Flow</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Controls */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="p-2 bg-red-900/10 border border-red-500/20 rounded flex items-center gap-2 mb-1">
                                        <Key className="w-4 h-4 text-red-500" />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-red-400 font-bold uppercase">Restricted Access</span>
                                            <span className="text-[7px] text-gray-500">Only Commander Mudde can authorize outbound transfers.</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-mono text-gray-500 uppercase">Settlement Rail</label>
                                            <div className="flex gap-1">
                                                {[SettlementModality.BANK, SettlementModality.HELLO_PAISA, SettlementModality.MOBILE_MONEY].map((m) => (
                                                    <button
                                                        key={m}
                                                        onClick={() => setSelectedRail(m)}
                                                        className={`p-2 rounded border flex-1 flex items-center justify-center transition-all ${selectedRail === m ? 'bg-mudde-gold/20 border-mudde-gold text-mudde-gold' : 'bg-gray-900 border-gray-800 text-gray-600'}`}
                                                        title={m}
                                                    >
                                                        {getRailIcon(m)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-mono text-gray-500 uppercase">Source Wallet</label>
                                            <select 
                                                className="w-full bg-black border border-gray-700 rounded p-1.5 text-[9px] font-mono text-white focus:border-mudde-gold outline-none"
                                                value={txSource}
                                                onChange={(e) => setTxSource(e.target.value)}
                                            >
                                                {accounts.map(a => (
                                                    <option key={a.id} value={a.id}>{a.name} (${(a.balance/1000000).toFixed(1)}M)</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                         <label className="text-[8px] font-mono text-gray-500 uppercase">Target Hub</label>
                                         <select 
                                             className="w-full bg-black border border-gray-700 rounded p-1.5 text-[9px] font-mono text-white focus:border-mudde-gold outline-none"
                                             value={txTarget}
                                             onChange={(e) => setTxTarget(e.target.value)}
                                         >
                                             <option value="BTC_HOT_WALLET">INTERNAL: Bitcoin Hot Wallet</option>
                                             <option value="SHADOW_VAULT">INTERNAL: Shadow Vault</option>
                                             <option disabled>──────────</option>
                                             <option>Federal Reserve (NY)</option>
                                             <option>HSBC Global (LDN)</option>
                                             <option>Hello Paisa (Direct)</option>
                                             <option>MTN MoMo (Uganda)</option>
                                             <option>Binance Cold Storage</option>
                                         </select>
                                    </div>

                                    <div className="flex items-end gap-2">
                                        <div className="space-y-1 flex-1">
                                            <label className="text-[8px] font-mono text-gray-500 uppercase">Amount (USD)</label>
                                            <div className="relative">
                                                <span className="absolute left-2 top-1.5 text-gray-500 text-[10px]">$</span>
                                                <input 
                                                    type="number" 
                                                    value={txAmount}
                                                    onChange={(e) => setTxAmount(Number(e.target.value))}
                                                    className="w-full bg-black border border-gray-700 rounded p-1.5 pl-4 text-[10px] font-mono text-white focus:border-mudde-gold outline-none"
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={executeTransaction}
                                            disabled={txStatus !== TransactionStatus.IDLE}
                                            className={`h-[28px] px-4 rounded border text-[9px] font-bold font-mono uppercase tracking-widest transition-all flex items-center gap-2 ${
                                                txStatus === TransactionStatus.IDLE 
                                                ? 'bg-mudde-gold/10 border-mudde-gold text-mudde-gold hover:bg-mudde-gold hover:text-black' 
                                                : txStatus === TransactionStatus.SETTLED ? 'bg-green-500 text-black border-green-500' : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                                            }`}
                                        >
                                            {txStatus === TransactionStatus.IDLE ? (
                                                <> <Zap className="w-3 h-3" /> COMMANDER_AUTH </>
                                            ) : (
                                                <> <RefreshCw className="w-3 h-3 animate-spin" /> {txStatus} </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex-1 bg-black/60 border border-gray-800 rounded p-2 overflow-y-auto custom-scrollbar font-mono">
                                        {statusMessage && (
                                            <div className={`text-[8px] mb-2 font-bold flex items-center gap-2 ${txStatus === TransactionStatus.FAILED ? 'text-red-500' : 'text-green-400'}`}>
                                                {txStatus === TransactionStatus.FAILED ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                                {statusMessage}
                                            </div>
                                        )}
                                        {txLog.map((tx) => (
                                            <div key={tx.id} className="flex justify-between items-center text-[7px] text-gray-500 mb-1 border-b border-gray-900 pb-1 last:border-0">
                                                <div className="flex items-center gap-1">
                                                    {tx.modality === 'MESH_SYNC' ? (
                                                        <Globe className="w-2 h-2 text-blue-400" />
                                                    ) : tx.status === 'SETTLED' ? (
                                                        <CheckCircle2 className="w-2 h-2 text-green-500" />
                                                    ) : (
                                                        <RefreshCw className="w-2 h-2 text-yellow-500" />
                                                    )}
                                                    <span className={tx.modality === 'MESH_SYNC' ? 'text-blue-300 font-bold' : ''}>
                                                        {tx.target || tx.id}
                                                    </span>
                                                </div>
                                                <span className={`font-bold ${tx.modality === 'MESH_SYNC' ? 'text-blue-400' : 'text-gray-300'}`}>
                                                    ${tx.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="p-2 border-t border-gray-800 bg-[#050505] flex justify-between items-center text-[7px] font-mono text-gray-600">
                <span className="flex items-center gap-1 uppercase">
                    <Save className="w-3 h-3 text-mudde-gold" />
                    VAULT_PERSISTENCE: <span className="text-green-500 font-bold">ACTIVE</span>
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">SAVED: {lastSave ? lastSave.toLocaleTimeString() : 'INIT...'}</span>
                    <span className="text-mudde-gold animate-pulse tracking-widest font-bold">VERIFIED_SECURE</span>
                </div>
            </div>
        </div>
    );
};

export default SovereignVault;
