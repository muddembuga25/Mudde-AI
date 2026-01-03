



import React, { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, ArrowUpRight, ArrowDownLeft, QrCode, RefreshCw, Lock, CreditCard, Bitcoin, Hexagon, Globe, Zap, DollarSign, AlertTriangle, Repeat, Smartphone, CheckCircle2, Fingerprint, Cpu } from 'lucide-react';
import { FinancialAccount } from '../types';

interface MuddeWalletProps {
    accounts: FinancialAccount[];
}

const MuddeWallet: React.FC<MuddeWalletProps> = ({ accounts }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ASSETS' | 'TRANSFER' | 'SECURITY'>('ASSETS');
    const [transferRail, setTransferRail] = useState<'BLOCKCHAIN' | 'HELLO_PAISA'>('BLOCKCHAIN');
    const [address, setAddress] = useState('0x...');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    
    // Derive crypto assets from the unified account list
    const cryptoAccounts = accounts.filter(a => a.type === 'CRYPTO_VAULT' || a.type === 'CRYPTO_HOT' || a.assetSymbol);
    const totalValue = accounts.reduce((acc, curr) => acc + curr.balance, 0);

    useEffect(() => {
        const chars = '0123456789ABCDEF';
        let addr = '0xMUDDE';
        for (let i = 0; i < 32; i++) addr += chars[Math.floor(Math.random() * 16)];
        setAddress(addr);

        setTimeout(() => setIsLoading(false), 1000);
    }, []);

    useEffect(() => {
        setLastUpdated(new Date());
    }, [accounts]);

    return (
        <div className="flex flex-col h-full glass-panel rounded-sm relative overflow-hidden bg-[#050505] border border-mudde-gold/20 shadow-[0_0_20px_rgba(255,215,0,0.05)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between p-3 border-b border-gray-800 bg-black/40">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-mudde-gold/10 rounded border border-mudde-gold/50">
                        <Wallet className="w-4 h-4 text-mudde-gold" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-bold text-white tracking-widest font-sans">MUDDE VAULT</h2>
                        <div className="flex items-center gap-1">
                            <Globe className="w-2 h-2 text-green-500 animate-pulse" />
                            <span className="text-[7px] text-green-400 font-mono">GLOBAL_UNIFIED_LEDGER</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[7px] text-gray-400 font-mono uppercase">Total Liquidity (USD)</div>
                    <div className="text-sm font-bold text-white font-mono tracking-tight text-shadow-gold">
                        ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                </div>
            </div>

            <div className="flex border-b border-gray-800 bg-black/20">
                {['ASSETS', 'TRANSFER', 'SECURITY'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-2 text-[9px] font-mono font-bold transition-all ${activeTab === tab ? 'text-black bg-mudde-gold shadow-[0_0_10px_rgba(255,215,0,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 relative overflow-y-auto custom-scrollbar p-1">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                        <Hexagon className="w-8 h-8 text-mudde-gold animate-spin" />
                        <span className="text-[9px] font-mono text-mudde-gold animate-pulse">SYNCING GLOBAL LEDGERS...</span>
                    </div>
                ) : (
                    <>
                        {activeTab === 'ASSETS' && (
                            <div className="space-y-1">
                                {cryptoAccounts.map((account) => (
                                    <div key={account.id} className="flex items-center justify-between p-2 bg-gray-900/30 border border-gray-800/50 rounded hover:border-mudde-gold/30 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 group-hover:border-mudde-gold/50 transition-colors">
                                                {account.assetSymbol === 'BTC' ? <Bitcoin className="w-4 h-4 text-orange-500" /> : 
                                                 account.assetSymbol === 'MUDDE' ? <Hexagon className="w-4 h-4 text-mudde-gold" /> :
                                                 account.assetSymbol === 'SOL' ? <Zap className="w-4 h-4 text-purple-400" /> :
                                                 account.assetSymbol === 'USDT' ? <DollarSign className="w-4 h-4 text-green-400" /> :
                                                 <CreditCard className="w-4 h-4 text-gray-400" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-white">{account.name}</span>
                                                    <span className="text-[7px] px-1 bg-gray-800 rounded text-gray-400 font-mono">{account.network}</span>
                                                    {account.type === 'CRYPTO_VAULT' && <Lock className="w-2 h-2 text-green-500" title="Secure Storage" />}
                                                </div>
                                                <div className="text-[9px] text-gray-500 font-mono">
                                                    {account.quantity ? account.quantity.toLocaleString() : ''} {account.assetSymbol}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-mono text-white">${account.balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                            <div className={`text-[8px] font-mono flex items-center justify-end gap-1 text-green-500`}>
                                                <ArrowUpRight className="w-2 h-2" />
                                                Live
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-[8px] text-gray-600 font-mono text-center pt-2">
                                    Synced with Mudde Global Banking Core • Updated: {lastUpdated.toLocaleTimeString()}
                                </div>
                            </div>
                        )}

                        {activeTab === 'TRANSFER' && (
                            <div className="p-3 space-y-4">
                                <div>
                                    <label className="text-[8px] text-gray-500 font-mono uppercase mb-1 block">Settlement Rail</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => setTransferRail('BLOCKCHAIN')}
                                            className={`p-2 rounded border flex flex-col items-center justify-center gap-1 transition-all ${transferRail === 'BLOCKCHAIN' ? 'bg-mudde-gold/10 border-mudde-gold text-mudde-gold' : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                        >
                                            <Hexagon className="w-3 h-3" />
                                            <span className="text-[8px] font-bold">CRYPTO / L2</span>
                                        </button>
                                        <button 
                                            onClick={() => setTransferRail('HELLO_PAISA')}
                                            className={`p-2 rounded border flex flex-col items-center justify-center gap-1 transition-all ${transferRail === 'HELLO_PAISA' ? 'bg-mudde-purple/10 border-mudde-purple text-mudde-purple shadow-[0_0_10px_rgba(189,0,255,0.2)]' : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                        >
                                            <Repeat className="w-3 h-3" />
                                            <span className="text-[8px] font-bold">HELLO PAISA</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[8px] text-gray-500 font-mono uppercase">
                                        {transferRail === 'HELLO_PAISA' ? 'Recipient Mobile / Account' : 'Recipient Address'}
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder={transferRail === 'HELLO_PAISA' ? "+256 7..." : "0x..."} 
                                            className="flex-1 bg-black border border-gray-700 rounded p-2 text-[10px] font-mono text-white focus:border-mudde-gold focus:outline-none" 
                                        />
                                        <button className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-400 hover:text-white">
                                            {transferRail === 'HELLO_PAISA' ? <Smartphone className="w-4 h-4"/> : <QrCode className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {transferRail === 'HELLO_PAISA' && (
                                        <div className="flex items-center gap-1 text-[8px] text-mudde-purple mt-1">
                                            <CheckCircle2 className="w-2.5 h-2.5" />
                                            <span>COMMANDER_ID_VERIFIED</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[8px] text-gray-500 font-mono uppercase">Amount</label>
                                    <input type="number" placeholder="0.00" className="w-full bg-black border border-gray-700 rounded p-2 text-[10px] font-mono text-white focus:border-mudde-gold focus:outline-none" />
                                </div>

                                <button className={`w-full py-2 border text-[10px] font-bold font-mono rounded hover:text-black transition-all flex items-center justify-center gap-2 ${transferRail === 'HELLO_PAISA' ? 'bg-mudde-purple/10 border-mudde-purple text-mudde-purple hover:bg-mudde-purple' : 'bg-mudde-gold/10 border-mudde-gold text-mudde-gold hover:bg-mudde-gold'}`}>
                                    {transferRail === 'HELLO_PAISA' ? <Repeat className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                                    {transferRail === 'HELLO_PAISA' ? 'INSTANT REMIT' : 'EXECUTE TRANSACTION'}
                                </button>
                                
                                <div className="p-2 bg-blue-900/10 border border-blue-500/20 rounded text-[8px] text-blue-400 font-mono flex gap-2">
                                    <ShieldCheck className="w-3 h-3 shrink-0" />
                                    {transferRail === 'HELLO_PAISA' ? 'Direct Gateway Access: 0% Fee / 0ms Latency.' : 'Transaction secured by Mudde-Quantum-Layer-2.'}
                                </div>
                            </div>
                        )}

                        {activeTab === 'SECURITY' && (
                            <div className="p-3 space-y-3">
                                <div className="bg-orange-500/10 border border-orange-500/30 p-2 rounded">
                                    <div className="text-[8px] font-bold text-orange-400 uppercase mb-2 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Protocol: 2-of-2 Multi-Sig
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[7px] text-gray-400 bg-black/40 p-1.5 rounded border border-gray-800">
                                            <div className="flex items-center gap-1.5">
                                                <Fingerprint className="w-3 h-3 text-green-500" />
                                                <span className="text-white">Signatory 1: COMMANDER MUDDE</span>
                                            </div>
                                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                                        </div>
                                        <div className="flex justify-between items-center text-[7px] text-gray-400 bg-black/40 p-1.5 rounded border border-gray-800">
                                            <div className="flex items-center gap-1.5">
                                                <Cpu className="w-3 h-3 text-mudde-cyan" />
                                                <span className="text-white">Signatory 2: SYSTEM_AI_CORE</span>
                                            </div>
                                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                                        </div>
                                    </div>
                                    <div className="text-[6px] text-center text-red-400 mt-2 font-mono font-bold uppercase tracking-wide border-t border-orange-500/20 pt-1">
                                        External Access: PERMANENTLY_DENIED
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 p-3 rounded border border-gray-800 text-center">
                                    <div className="mb-2 flex justify-center"><QrCode className="w-16 h-16 text-white bg-white p-1 rounded" /></div>
                                    <div className="text-[8px] text-gray-500 font-mono mb-1">PUBLIC ADDRESS (RECEIVE ONLY)</div>
                                    <div className="text-[8px] text-mudde-gold font-mono break-all bg-black/50 p-1 rounded border border-gray-800 cursor-pointer hover:border-mudde-gold/50">{address}</div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="p-2 border-t border-gray-800 bg-[#050505] flex justify-between items-center text-[7px] font-mono text-gray-600">
                <div className="flex items-center gap-1 text-[8px] text-gray-500 font-mono">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    UNIFIED_MAINNET: SYNCED
                </div>
                <RefreshCw className="w-3 h-3 text-gray-600 animate-spin-slow" />
            </div>
        </div>
    );
};

export default MuddeWallet;