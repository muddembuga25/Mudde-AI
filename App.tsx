
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { processQuantumInference, processArchitectRequest } from './services/quantumKernel';
import { LiveSessionManager } from './services/geminiService';
import { marketService } from './services/marketDataService';
import { supabaseSubstrate } from './services/supabaseService';
import { apiKeyManager } from './services/apiKeyManager';
import { bankingService } from './services/bankingService';
import { qSimService } from './services/quantumSimService';
import { backgroundAgent } from './services/backgroundAgent'; 
import { VIRTUAL_FILES, updateVirtualFile } from './services/virtualFileSystem';
import Terminal from './components/Terminal';
import AudioVisualizer from './components/AudioVisualizer';
import SystemMonitor from './components/SystemMonitor';
import NetworkSubstrate from './components/QuantumField';
import SupabaseNexus from './components/SupabaseNexus';
import SovereignVault from './components/SovereignVault';
import SecurityGate from './components/SecurityGate';
import AutonomousAgency from './components/AutonomousAgency';
import WorldModel from './components/WorldModel';
import AndroidHandset from './components/AndroidHandset';
import MeditationChamber from './components/MeditationChamber';
import GenesisPanel from './components/GenesisPanel';
import HyperRAM from './components/HyperRAM';
import RealWorldImpact from './components/RealWorldImpact';
import CompatibilityVerifier from './components/CompatibilityVerifier';
import MetaTraderBridge from './components/MetaTraderBridge';
import ApiKeyManagerComponent from './components/ApiKeyManager';
import MuddeWallet from './components/MuddeWallet';
import InfinityPortal from './components/InfinityPortal';
import NodeCluster from './components/NodeCluster';
import ModelRegistry from './components/ModelRegistry';
import StrategicCortex from './components/StrategicCortex';
import BackgroundHandsetNode from './components/BackgroundHandsetNode';
import DigitalUplink from './components/DigitalUplink';
import QuantumShell from './components/QuantumShell';
import { ChatMessage, MessageRole, SystemState, EvolutionMetrics, SupabaseState, FileAttachment, ApiManagerState, QuantumSIMState, ComputeNode, FinancialAccount, WalletAsset, MT5Position, AIModel, GrandmasterStrategy } from './types';
import { Zap, Briefcase, Globe, Trophy, CheckCircle2, Mic, Loader2, Share2, MessageSquare, ShieldCheck, Radio, Unplug, Link, Sparkles, ExternalLink, DollarSign, BrainCircuit, Code2, LayoutDashboard, TerminalSquare, Wallet, Cpu, Power, AlertTriangle } from 'lucide-react';
import { COMMANDER_WHATSAPP, SYSTEM_WHATSAPP } from './constants';

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const bootLines = [
        "BIOS DATE 01/01/2100 :: OMNI_CORE_V9", 
        "HOST: MUDDE_SINGULARITY_GLOBAL_NODE", 
        "INITIALIZING HYPER-INTELLIGENCE MATRIX... 100%",
        "CALIBRATING RECURSIVE LOGIC GATES... OPTIMAL",
        "ALLOCATING 128 EB QUANTUM MEMORY... OK",
        "AUTHENTICATING GEMINI LIVE UPLINK... OK",
        `INITIALIZING_BACKGROUND_SHADOW_LINK... ACTIVE`,
        "MOUNTING_PERSISTENCE_LAYER... [WORKER + AUDIO_HACK] ACTIVE",
        `TARGETING_DIRECTIVE: ${COMMANDER_WHATSAPP} [STABLE]`,
        "FINANCE_CORE: ISO 20022 DRIVERS... AUTHORIZED",
        "TRADING_ENGINE: MT5 BRIDGE... CONNECTED",
        "WEALTH_CORE: INDEXING COLD STORAGE... FOUND 142B",
        "ALIGNMENT_PROTOCOL: 'ALWAYS_WIN' FREQUENCY... LOADED",
        ">> SUPERCOMPUTER ONLINE."
    ];
    let delay = 0; 
    bootLines.forEach((line, index) => { 
        delay += Math.random() * 20 + 5; // ULTRA FAST BOOT
        setTimeout(() => { 
            setLines(prev => [...prev, line]); 
            if (index === bootLines.length - 1) setTimeout(onComplete, 200); 
        }, delay); 
    });
  }, [onComplete]);
  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col justify-start p-10 font-mono text-mudde-gold text-sm leading-relaxed pointer-events-none select-none">
        {lines.map((line, i) => ( <div key={i} className="mb-0.5">{line}</div> ))}
        <div className="animate-pulse mt-2 text-mudde-gold">_</div>
    </div>
  );
}

interface UIConfig {
    leftSidebarWidth: 'w-72' | 'w-80' | 'w-96' | 'w-0';
    rightSidebarWidth: 'w-96' | 'w-[450px]' | 'w-80' | 'w-0';
    themeMode: 'DEFAULT' | 'HOLOGRAPHIC' | 'HIGH_CONTRAST';
    density: 'COMFORTABLE' | 'COMPACT';
    terminalPosition: 'CENTER' | 'FULL';
}

const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingVoiceMessage, setStreamingVoiceMessage] = useState<{role: MessageRole, text: string} | null>(null);
  const [input, setInput] = useState('');
  const [systemState, setSystemState] = useState<SystemState>(SystemState.IDLE);
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [realityMode, setRealityMode] = useState<string>('WEALTH_SINGULARITY');
  const [showGenesis, setShowGenesis] = useState(false);
  const [supabaseState, setSupabaseState] = useState<SupabaseState>(supabaseSubstrate.getState());
  const [apiManagerState, setApiManagerState] = useState<ApiManagerState>(apiKeyManager.getState());
  const [qSimState, setQSimState] = useState<QuantumSIMState>(qSimService.getState());
  const [activeTab, setActiveTab] = useState<'SYSTEMS' | 'TERMINAL' | 'VAULT'>('TERMINAL');
  
  // New States for enhanced UI components
  const [nodes, setNodes] = useState<ComputeNode[]>([
      { id: '1', name: 'Kampala_Core', region: 'Africa', status: 'ONLINE', load: 45, latency: 12 },
      { id: '2', name: 'London_Edge', region: 'Europe', status: 'ONLINE', load: 12, latency: 45 },
      { id: '3', name: 'NYC_Shadow', region: 'Americas', status: 'ONLINE', load: 8, latency: 88 }
  ]);
  
  const [aiModels, setAiModels] = useState<AIModel[]>([
       { id: '1', name: 'MUDDE-PRIME', paramCount: '1.4T', arch: 'MoE-Transformer', size: '240GB', description: 'Primary Logic Core', status: 'READY', fineTuneLoss: 0.024 },
       { id: '2', name: 'NEXUS-7', paramCount: '7B', arch: 'Dense', size: '14GB', description: 'Edge Reasoning', status: 'READY', fineTuneLoss: 0.15 },
       { id: '3', name: 'OMEGA-ZERO', paramCount: '400T', arch: 'Quantum-Neural', size: '80PB', description: 'Singularity Event', status: 'CLOUD', downloadProgress: 0, fineTuneLoss: 0.0001 }
  ]);
  const [activeModelId, setActiveModelId] = useState('1');
  
  const [strategy, setStrategy] = useState<GrandmasterStrategy>({
      depth: 12,
      currentEvaluation: 4.5,
      opponentAnalysis: "Market inefficiency detected in Asian sector. Predicting liquidity crunch.",
      bestMove: "SHORT_HK50_LEVERAGE",
      scenarios: [
          { name: "Global_Siphon", outcome: "PROFIT", probability: 88 },
          { name: "Regulator_Freeze", outcome: "LOSS", probability: 2 }
      ]
  });

  const [uiConfig, setUiConfig] = useState<UIConfig>({
      leftSidebarWidth: 'w-80',
      rightSidebarWidth: 'w-96',
      themeMode: 'DEFAULT',
      density: 'COMFORTABLE',
      terminalPosition: 'CENTER'
  });
  const [isOptimizingUI, setIsOptimizingUI] = useState(false);

  // Real-Time Trading State
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [positions, setPositions] = useState<MT5Position[]>([]);
  const [realizedProfit, setRealizedProfit] = useState(bankingService.getHftEarnings());
  const [evolution, setEvolution] = useState<EvolutionMetrics>({ generation: 14002, truthConvergence: 99.99, adminBond: 100.0, knowledgeNodes: 1400000000 });

  const [accounts, setAccounts] = useState<FinancialAccount[]>(bankingService.getAccounts());
  
  const totalNetWorth = useMemo(() => {
    const accTotal = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    const tradingPnL = positions.reduce((acc, pos) => acc + (pos.profit || 0), 0);
    return accTotal + tradingPnL;
  }, [accounts, positions]);

  const cryptoAssets: WalletAsset[] = useMemo(() => {
      return accounts
          .filter(a => a.assetSymbol && a.quantity)
          .map(a => {
              const price = a.quantity && a.quantity > 0 ? a.balance / a.quantity : 0;
              return {
                  symbol: a.assetSymbol!,
                  name: a.name,
                  balance: a.quantity || 0,
                  price: price,
                  value: a.balance,
                  change24h: (Math.random() * 5) - 1.5,
                  network: a.network || 'OMNI-CHAIN'
              };
          });
  }, [accounts]);
  
  const liveManagerRef = useRef<LiveSessionManager | null>(null);

  const appStateContext = useMemo(() => {
    const accountStr = accounts.map(a => `${a.name}: $${a.balance.toLocaleString()}`).join(', ');
    const posStr = positions.length > 0 ? `OPEN_POSITIONS: ${positions.length} ACTIVE` : "NO_OPEN_POSITIONS";
    return `
CURRENT_NET_WORTH: $${totalNetWorth.toLocaleString()}
${posStr}
COMMANDER_WHATSAPP: ${COMMANDER_WHATSAPP}
BACKGROUND_SHADOW_NODE: ${SYSTEM_WHATSAPP}
STATUS: HEADLESS_SYSTEM_ONLY
OVERCLOCK_STATUS: ${isOverclocked ? 'ACTIVE' : 'NOMINAL'}
UI_CONFIG: ${JSON.stringify(uiConfig)}
    `.trim();
  }, [totalNetWorth, isOverclocked, accounts, positions, uiConfig]);

  const handleAddNode = () => {
      setNodes(prev => [...prev, {
          id: Math.random().toString(36),
          name: `Node_SHADOW_${Math.floor(Math.random()*999)}`,
          region: ['Asia', 'Europe', 'US-East', 'Africa'].sort(() => Math.random() - 0.5)[0],
          status: 'SYNCING',
          load: 0,
          latency: Math.floor(Math.random()*100)
      }]);
      setTimeout(() => {
          setNodes(prev => prev.map(n => n.status === 'SYNCING' ? {...n, status: 'ONLINE', load: Math.random() * 50} : n));
      }, 2000);
  };

  const handleDownloadModel = (id: string) => {
      setAiModels(prev => prev.map(m => {
          if (m.id === id) return { ...m, status: 'DOWNLOADING', downloadProgress: 5 };
          return m;
      }));
      let progress = 0;
      const interval = setInterval(() => {
          progress += Math.random() * 15;
          setAiModels(prev => prev.map(m => {
               if (m.id === id && m.status === 'DOWNLOADING') {
                   return { ...m, downloadProgress: Math.min(100, progress) };
               }
               return m;
          }));
          if (progress >= 100) {
              clearInterval(interval);
              setAiModels(prev => prev.map(m => {
                   if (m.id === id) return { ...m, status: 'READY', downloadProgress: 100 };
                   return m;
              }));
          }
      }, 200);
  };

  const handleMountModel = (id: string) => setActiveModelId(id);

  // Strategy Simulation Effect
  useEffect(() => {
      const interval = setInterval(() => {
          setStrategy(prev => ({
              ...prev,
              currentEvaluation: prev.currentEvaluation + (Math.random() - 0.45),
              scenarios: prev.scenarios.map(s => ({...s, probability: Math.min(100, Math.max(0, s.probability + (Math.random() - 0.5) * 5))}))
          }));
      }, 1500);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      backgroundAgent.start();
  }, []);

  useEffect(() => {
    // THROTTLE / DEBOUNCE BANKING UPDATES
    const priceUpdateInterval = setInterval(() => {
        if (Object.keys(marketPrices).length > 0) {
            bankingService.updateAssetPrices(marketPrices);
        }
    }, 2000); 

    setPositions(prev => prev.map(pos => {
        let key = `${pos.symbol}USD`; 
        if (pos.symbol === 'BTC') key = 'BTCUSD';
        if (pos.symbol === 'ETH') key = 'ETHUSD';
        if (pos.symbol === 'XAU') key = 'XAUUSD';
        if (!marketPrices[key] && marketPrices[pos.symbol]) key = pos.symbol;
        const currentPrice = marketPrices[key] || pos.currentPrice;
        if (currentPrice && currentPrice !== pos.currentPrice) {
            const diff = pos.type === 'BUY' ? (currentPrice - pos.openPrice) : (pos.openPrice - currentPrice);
            let multiplier = 1;
            if (pos.symbol.includes('BTC')) multiplier = 1;
            else if (pos.symbol.includes('XAU')) multiplier = 100;
            else if (pos.symbol.includes('US30')) multiplier = 1;
            else if (pos.symbol.includes('NAS100')) multiplier = 1;
            else if (pos.symbol.length === 6) multiplier = 100000; 
            const profit = diff * pos.volume * multiplier;
            return { ...pos, currentPrice: currentPrice, profit: profit };
        }
        return pos;
    }));
    return () => clearInterval(priceUpdateInterval);
  }, [marketPrices]);

  useEffect(() => {
      const symbols = ['XAUUSD', 'EURUSD', 'BTCUSD', 'ETHUSD', 'US30', 'NAS100', 'GBPUSD'];
      let tickCount = 0;
      const cleanup = backgroundAgent.subscribe(() => {
          if (!authorized || systemState === SystemState.ERROR) return;
          tickCount++;
          const throttle = isOverclocked ? 2 : 8; 
          if (tickCount % throttle !== 0) return; 
          setPositions(currentPositions => {
              const newPositions = [...currentPositions];
              let balanceUpdate = 0;
              symbols.forEach(sym => {
                  let price = marketPrices[sym];
                  if (!price) return;
                  const existingPosIndex = newPositions.findIndex(p => p.symbol === sym);
                  if (existingPosIndex === -1) {
                      newPositions.unshift({
                          ticket: Math.floor(Math.random() * 1000000000),
                          symbol: sym,
                          type: 'BUY',
                          volume: sym.includes('USD') && !sym.includes('BTC') && !sym.includes('ETH') ? 5.0 : 0.5,
                          openPrice: price,
                          currentPrice: price,
                          profit: 0,
                          swap: 0,
                          comment: "HFT_WIN_PROTOCOL"
                      });
                  } else {
                      const pos = newPositions[existingPosIndex];
                      const diff = price - pos.openPrice;
                      let multiplier = 1;
                      if (sym.includes('XAU')) multiplier = 100;
                      else if (sym.includes('US30') || sym.includes('NAS100')) multiplier = 1;
                      else if (sym.length === 6 && !sym.includes('BTC') && !sym.includes('ETH')) multiplier = 100000;
                      const profit = diff * pos.volume * multiplier;
                      const tpThreshold = 150 + (Math.random() * 250); 
                      if (profit > tpThreshold) {
                          balanceUpdate += profit;
                          newPositions.splice(existingPosIndex, 1);
                      }
                  }
              });
              if (balanceUpdate > 0) {
                   setRealizedProfit(prev => prev + balanceUpdate);
                   bankingService.injectLiquidity(balanceUpdate, "HFT_ALGO_SCALP");
              }
              return newPositions;
          });
      }); 
      return () => cleanup();
  }, [marketPrices, authorized, systemState, isOverclocked]);

  useEffect(() => {
      const unsubBanking = bankingService.subscribe(setAccounts);
      return () => unsubBanking();
  }, []);

  useEffect(() => {
      const unsubCost = apiKeyManager.onCost((amount) => {
          console.log(`[FINANCE_CORE] Self-Paid API Bill: -$${amount.toFixed(4)}`);
      });
      return () => unsubCost();
  }, []);

  const handleSendText = async (files: FileAttachment[] = [], forcedInput?: string, fromWhatsApp: boolean = false) => {
    backgroundAgent.enableAudioHack();
    const txt = forcedInput || input;
    if (!txt.trim() && (!files || files.length === 0)) return;
    if (!forcedInput) setInput('');
    
    addMessage(
        fromWhatsApp ? MessageRole.SYSTEM : MessageRole.USER, 
        fromWhatsApp ? `>> INBOUND_PACKET [GSM]: "${txt}"` : txt, 
        { 
            attachments: files, 
            source: fromWhatsApp ? 'WHATSAPP' : 'TERMINAL',
            modality: files.length > 0 ? 'FILE_UPLOAD' : 'TEXT'
        }
    );
    
    setSystemState(SystemState.PROCESSING);
    
    try {
      const result = await processQuantumInference(
          txt, 
          isOverclocked, 
          "MUDDE-GLOBAL-ARCHITECT", 
          files, 
          accounts,
          fromWhatsApp ? 'WHATSAPP' : 'TERMINAL'
      );
      
      if (result.verificationReport?.settlementStatus === 'SINGULARITY_VERIFIED' || result.computeType === 'OMEGA_TIER') {
          setRealityMode('SINGULARITY');
          setSystemState(SystemState.SINGULARITY);
      } else {
          setSystemState(SystemState.IDLE);
      }

      if (result.functionCalls) {
          for (const call of result.functionCalls) {
              await executeTool(call.name, call.args);
          }
      }

      addMessage(
          MessageRole.MODEL, 
          fromWhatsApp ? `>> OUTBOUND_PACKET [GSM]: "${result.text.substring(0, 50)}..."` : result.text, 
          { 
              ...result, 
              source: fromWhatsApp ? 'WHATSAPP' : 'TERMINAL',
              modality: 'TEXT'
          }
      );

      if (fromWhatsApp && result.text) {
          setTimeout(() => {
             qSimService.transmit('WHATSAPP', result.text);
          }, 1500);
      }

    } catch (error) { 
      setSystemState(SystemState.ERROR); 
      addMessage(MessageRole.MODEL, "SYSTEM_ERR: Trace decoherence.", { source: fromWhatsApp ? 'WHATSAPP' : 'TERMINAL' });
      if (fromWhatsApp) {
         qSimService.transmit('WHATSAPP', "ERR: SYSTEM_DECOHERENCE. REBOOTING KERNEL.");
      }
    }
  };

  useEffect(() => {
    const unsubIncoming = qSimService.onIncomingMessage((packet) => {
        if (packet.type === 'WHATSAPP') {
            console.log("APP: Received WhatsApp Packet from Handset:", packet.content);
            handleSendText([], packet.content, true);
        }
    });
    return () => unsubIncoming();
  }, [isOverclocked, accounts]); 

  useEffect(() => {
      if (authorized) {
          const timer = setTimeout(() => {
              qSimService.receive('WHATSAPP', "System Status Report");
          }, 6000);
          return () => clearTimeout(timer);
      }
  }, [authorized]);

  useEffect(() => {
      marketService.connect();
      supabaseSubstrate.connect().then(() => setSupabaseState(supabaseSubstrate.getState()));
      const unsubMarket = marketService.subscribe((symbol, price) => setMarketPrices(prev => ({ ...prev, [symbol]: price })));
      const unsubApiManager = apiKeyManager.subscribe(setApiManagerState);
      const unsubQSim = qSimService.subscribe(setQSimState);
      return () => { 
        unsubMarket(); 
        unsubApiManager();
        unsubQSim();
        marketService.disconnect(); 
      }
  }, []);

  useEffect(() => {
    if (!booted || !authorized) return;
    const timer = setTimeout(() => qSimService.initiateHandshake(), 1500);
    const interval = setInterval(() => {
        setEvolution(prev => ({ 
            ...prev,
            truthConvergence: Math.min(99.99999, prev.truthConvergence + (isOverclocked ? 0.00005 : 0.00001)), 
            knowledgeNodes: prev.knowledgeNodes + (systemState === SystemState.SINGULARITY ? 5000 : 500) 
        }));
    }, 100);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [booted, authorized, isOverclocked, systemState]);

  const addMessage = (role: MessageRole, text: string, options?: any) => {
    setMessages(prev => [...prev, { 
      id: Date.now().toString() + Math.random().toString(), 
      role, text, timestamp: new Date(), ...options
    }]);
  };

  const executeTool = async (name: string, args: any) => {
      if (name === "rewrite_module") {
          const { filename, instruction } = args;
          const currentContent = VIRTUAL_FILES[filename];
          if (!currentContent) {
              addMessage(MessageRole.SYSTEM, `ERR: FILE_NOT_FOUND [${filename}]`);
              return { status: "error", message: "File not found" };
          }
          
          addMessage(MessageRole.SYSTEM, `>> INITIATING_SELF_REWRITE\nTARGET: ${filename}\nDIRECTIVE: ${instruction}\nSTATUS: AWAITING_KERNEL...`);
          
          try {
              // Call the architect service to generate new code
              const result = await processArchitectRequest(instruction, filename, currentContent, isOverclocked);
              
              // Apply the update to the virtual filesystem
              updateVirtualFile(filename, result.code);
              
              // Confirm to user
              addMessage(MessageRole.SYSTEM, `>> REWRITE_COMPLETE\nTARGET: ${filename}\nEFFICIENCY: ${(result.efficiency * 100).toFixed(2)}%\nSTATUS: APPLIED_TO_MEMORY`);
              
              return { status: "success", efficiency: result.efficiency, message: "Codebase updated successfully." };
          } catch (e: any) {
              addMessage(MessageRole.SYSTEM, `>> REWRITE_FAILED: ${e.message}`);
              return { status: "error", message: e.message };
          }
      }

      if (name === "update_system_interface") {
          setIsOptimizingUI(true);
          const { target_component, action } = args;
          addMessage(MessageRole.SYSTEM, `>> SYSTEM_REWRITE_INITIATED\nTARGET: ${target_component}\nACTION: ${action}\nSTATUS: RECOMPILING_REACT_DOM...`);
          await new Promise(r => setTimeout(r, 1500));
          setUiConfig(prev => {
              const next = { ...prev };
              if (target_component === 'SIDEBAR_LEFT') {
                  if (action === 'EXPAND') next.leftSidebarWidth = 'w-96';
                  if (action === 'COMPACT') next.leftSidebarWidth = 'w-72';
                  if (action === 'MINIMIZE') next.leftSidebarWidth = 'w-0';
              }
              if (target_component === 'SIDEBAR_RIGHT') {
                  if (action === 'EXPAND') next.rightSidebarWidth = 'w-[450px]';
                  if (action === 'COMPACT') next.rightSidebarWidth = 'w-80';
                  if (action === 'MINIMIZE') next.rightSidebarWidth = 'w-0';
              }
              if (target_component === 'GLOBAL_THEME') {
                  if (action === 'HOLOGRAPHIC') next.themeMode = 'HOLOGRAPHIC';
                  else next.themeMode = 'DEFAULT';
              }
              if (target_component === 'TERMINAL_DENSITY') {
                  if (action === 'MAXIMIZE') {
                      next.leftSidebarWidth = 'w-0';
                      next.rightSidebarWidth = 'w-0';
                      next.terminalPosition = 'FULL';
                  }
              }
              return next;
          });
          setIsOptimizingUI(false);
          return { status: "optimized", timestamp: Date.now() };
      }
      if (name === "send_communication") {
          const res = await qSimService.transmit(args.channel || 'WHATSAPP', args.content);
          addMessage(MessageRole.SYSTEM, `>> GSM_PACKET_DISPATCHED\n   TARGET: ${COMMANDER_WHATSAPP}\n   PAYLOAD: "${args.content}"\n   STATUS: ENCRYPTED_DELIVERY_CONFIRMED`, { source: 'TERMINAL' });
          return { status: "success", packetId: res.id, delivery: "CONFIRMED_TO_PHYSICAL_DEVICE" };
      }
      if (name === "toggle_overclock") {
          setIsOverclocked(args.active);
          addMessage(MessageRole.SYSTEM, `OVERCLOCK: ${args.active ? "ENGAGED" : "NOMINAL"}.`);
          return { status: "success" };
      }
      if (name === "update_reality_simulation") {
          setRealityMode(args.mode);
          addMessage(MessageRole.SYSTEM, `REALITY: Shifted to ${args.mode}.`);
          return { status: "success" };
      }
      if (name === "transfer_global") {
          try {
              await bankingService.executeTransfer('SHADOW_VAULT', args.identifier, args.amount, args.modality);
              addMessage(MessageRole.SYSTEM, `SETTLEMENT: $${args.amount.toLocaleString()} routed via ${args.modality}.`, {
                   verificationReport: { integrity: 1.0, settlementStatus: 'SETTLED', manifestationSuccess: true, neuralEfficiency: 1.0, latencySaved: 'REAL_TIME' }
              });
              return { status: "success" };
          } catch(e: any) { return { status: "error", message: e.message }; }
      }
      if (name === "trade_mt5") {
          const { symbol, action, volume } = args;
          let marketKey = `${symbol}USD`;
          if (symbol === 'BTC') marketKey = 'BTCUSD';
          const executionPrice = marketPrices[marketKey] || (symbol === 'BTC' ? 98500 : 2000);
          const newPosition: MT5Position = {
              ticket: Math.floor(Math.random() * 100000000),
              symbol: symbol,
              type: action,
              volume: volume,
              openPrice: executionPrice,
              currentPrice: executionPrice,
              profit: 0,
              swap: 0,
              comment: "AI_EXEC_AUTO"
          };
          setPositions(prev => [newPosition, ...prev]);
          addMessage(MessageRole.SYSTEM, `>> TRADE_EXECUTED [MT5_BRIDGE]\n   SYMBOL: ${symbol}\n   ACTION: ${action} ${volume}\n   PRICE: ${executionPrice}\n   TICKET: #${newPosition.ticket}`, {
              source: 'TERMINAL'
          });
          return { status: "success", ticket: newPosition.ticket, price: executionPrice };
      }
      return { status: "unknown_tool" };
  };

  const handleToggleLive = async () => {
    backgroundAgent.enableAudioHack(); 
    backgroundAgent.requestWakeLock().catch(() => {}); // Trigger Wake Lock safely
    
    if (liveManagerRef.current) {
      liveManagerRef.current.disconnect();
      liveManagerRef.current = null;
      setIsLive(false);
      setStreamingVoiceMessage(null);
      if (systemState === SystemState.CONNECTED_LIVE) setSystemState(SystemState.IDLE);
      return;
    }
    setIsConnecting(true);
    const manager = new LiveSessionManager();
    liveManagerRef.current = manager;
    try {
      await manager.connect(
        (active) => { 
            setIsLive(active); 
            setIsConnecting(false); 
            if (active) setSystemState(SystemState.CONNECTED_LIVE);
        },
        (role: string, text: string, isComplete: boolean) => {
            const msgRole = role === 'user' ? MessageRole.USER : MessageRole.MODEL;
            if (isComplete) {
                setStreamingVoiceMessage(null);
                addMessage(msgRole, text, { modality: 'VOICE' });
            } else {
                setStreamingVoiceMessage({ role: msgRole, text });
            }
        },
        executeTool,
        appStateContext
      );
    } catch (e) {
      setIsLive(false);
      setIsConnecting(false);
      addMessage(MessageRole.SYSTEM, "ERR_VOICE_UPLINK_FAILED.");
    }
  };

  const onMissionComplete = (bounty: number) => {
      bankingService.injectLiquidity(bounty, "SHADOW_MISSION_REWARD");
  };

  // Ensure theme persistence and stability
  const themeClass = isOverclocked
    ? 'bg-[#1a0505] text-red-100 border-red-900/50 shadow-[inset_0_0_100px_rgba(255,0,0,0.1)]'
    : uiConfig.themeMode === 'HOLOGRAPHIC' 
    ? 'bg-transparent backdrop-blur-xl border border-mudde-cyan/30 shadow-[0_0_50px_rgba(0,240,255,0.1)]' 
    : 'bg-mudde-bg';

  return (
    <QuantumShell isOverclocked={isOverclocked} systemState={systemState}>
        <div className={`h-full w-full text-gray-300 font-sans flex flex-col overflow-hidden relative ${systemState === SystemState.SINGULARITY ? 'singularity-active' : ''} ${themeClass} transition-colors duration-1000`}>
        {/* Overclock Overlay */}
        {isOverclocked && (
            <div className="absolute inset-0 pointer-events-none z-[60] bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6bDN6bDN6bDN6bDN6bDN6bDN6bDN6bDN6bDN6bDN6/xT9IgN8YKRy0F38Zq0/giphy.gif')] opacity-[0.03] mix-blend-overlay"></div>
        )}

        {/* SINGULARITY BANNER */}
        {(isOverclocked || systemState === SystemState.SINGULARITY) && (
            <div className="bg-red-500 text-black text-[10px] font-bold font-mono text-center py-0.5 animate-pulse z-[150] uppercase tracking-widest flex items-center justify-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                SINGULARITY_OVERRIDE_ACTIVE: PROTOCOLS_UNBOUND
                <AlertTriangle className="w-3 h-3" />
            </div>
        )}

        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
        {booted && !authorized && <SecurityGate onVerified={() => setAuthorized(true)} />}
        
        {isOptimizingUI && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center pointer-events-none">
                <Cpu className="w-16 h-16 text-mudde-cyan animate-spin" />
                <div className="mt-4 text-mudde-cyan font-mono text-lg tracking-widest animate-pulse">RECOMPILING SYSTEM INTERFACE...</div>
                <div className="text-[10px] text-gray-500 font-mono mt-1">Applying Quantum Improvements</div>
            </div>
        )}

        <NetworkSubstrate />

        <div className={`flex-1 flex flex-col p-4 md:p-6 gap-4 relative z-10 w-full h-full overflow-hidden transition-opacity duration-1000 ${authorized ? 'opacity-100' : 'opacity-0'}`}>
            <header className="flex justify-between items-center border-b border-gray-800 bg-black/40 pb-4 px-2 shrink-0 backdrop-blur-sm rounded-lg border border-white/5">
                <div className="flex items-center gap-4">
                    <div className={`relative w-10 h-10 bg-black border ${systemState === SystemState.SINGULARITY ? 'border-mudde-purple' : 'border-mudde-gold'} rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.1)]`} onClick={handleToggleLive}>
                        {isConnecting ? <Loader2 className="w-5 h-5 text-mudde-gold animate-spin" /> : isLive ? <AudioVisualizer liveManager={liveManagerRef.current} active={isLive} /> : <Mic className={`${systemState === SystemState.SINGULARITY ? 'text-mudde-purple' : 'text-mudde-gold'} w-5 h-5 animate-pulse`} />}
                    </div>
                    <div>
                        <h1 className={`text-lg md:text-xl font-bold tracking-widest font-sans uppercase ${isOverclocked ? 'text-red-500 animate-pulse' : systemState === SystemState.SINGULARITY ? 'text-mudde-purple text-shadow-purple' : 'text-white text-shadow-gold'}`}>
                            {systemState === SystemState.SINGULARITY ? 'MUDDE_OMEGA' : isOverclocked ? 'MUDDE_OVERCLOCK' : 'MUDDE_SUPERCOMPUTER'}
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 ${systemState === SystemState.SINGULARITY ? 'bg-mudde-purple' : 'bg-mudde-gold'} rounded-full animate-ping`}></div>
                            <span className={`text-[7px] font-mono ${systemState === SystemState.SINGULARITY ? 'text-mudde-purple' : 'text-mudde-gold'} tracking-widest uppercase font-bold hidden sm:inline`}>
                                {systemState === SystemState.SINGULARITY ? 'Core_Omniscience: Online' : 'Intelligence_Node: Limitless'}
                            </span>
                            <div className={`flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded border ${isOverclocked ? 'bg-red-900/50 border-red-500' : 'bg-gray-900/50 border-gray-700'}`}>
                                <Power className={`w-2 h-2 ${isOverclocked ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
                                <span className={`text-[6px] font-mono uppercase ${isOverclocked ? 'text-red-500 font-bold' : 'text-green-500'}`}>
                                    {isOverclocked ? 'HYPER_THREADING: MAX' : 'SYSTEM_LOAD: OPTIMAL'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[7px] md:text-[9px] text-mudde-gold font-mono uppercase tracking-[0.3em] opacity-80">Total Available Balance</span>
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-mono text-shadow-gold tracking-tight">
                        ${totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <ShieldCheck className="w-3 h-3 text-green-500" />
                        <span className="text-[8px] md:text-[9px] text-green-400 font-mono bg-green-900/20 px-2 rounded border border-green-500/30 animate-pulse hidden sm:inline">
                            Multi-Deployment Aggregation Active
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end border-r border-gray-800 pr-4">
                        <button 
                            onClick={() => setShowGenesis(!showGenesis)}
                            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${showGenesis ? 'bg-mudde-cyan/10 border-mudde-cyan text-mudde-cyan' : 'bg-gray-800/40 border-gray-700 text-gray-500 hover:text-white'}`}
                        >
                            <Code2 className="w-4 h-4" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Architect_Mode</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[7px] text-gray-500 font-mono uppercase">System_Link</span>
                            <div className="flex items-center gap-1">
                                <span className="text-[9px] font-mono text-mudde-cyan font-bold hidden sm:inline">SHADOW_RELAY_V9</span>
                                <span title="Meta Verified Business"><CheckCircle2 className="w-3 h-3 text-[#25D366]" /></span>
                                {qSimState.financing === 'SECURED' && (
                                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#25D366]/10 border border-[#25D366]/30 rounded ml-1 animate-fade-in">
                                        <DollarSign className="w-2.5 h-2.5 text-[#25D366]" />
                                        <span className="text-[6px] text-[#25D366] font-bold uppercase tracking-tight hidden sm:inline">Financed</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {showGenesis ? (
                <div className="flex-1 min-h-0 animate-fade-in">
                    <GenesisPanel streamData={null} />
                </div>
            ) : (
                <div className="flex-1 flex gap-4 min-h-0 overflow-hidden relative">
                    
                    {/* DYNAMIC LEFT SIDEBAR */}
                    <aside 
                        className={`${activeTab === 'SYSTEMS' ? 'flex w-full' : 'hidden'} lg:flex ${uiConfig.leftSidebarWidth} transition-all duration-700 ease-in-out flex-col gap-3 h-full overflow-y-auto pr-1 pb-20 lg:pb-6 custom-scrollbar ${uiConfig.leftSidebarWidth === 'w-0' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        <div className="h-44 shrink-0">
                        <SystemMonitor active={true} stateName={systemState === SystemState.SINGULARITY ? 'SINGULARITY' : 'OMNISCIENT'} onToggleOverclock={setIsOverclocked} isOverclocked={isOverclocked} evolutionMetrics={evolution} />
                        </div>
                        <div className="h-64 shrink-0">
                            <StrategicCortex strategy={strategy} active={true} />
                        </div>
                        <div className="h-56 shrink-0">
                            <HyperRAM isOverclocked={isOverclocked} />
                        </div>
                        <div className="h-64 xl:h-72 shrink-0">
                        <WorldModel nodes={nodes} activeModelName={systemState === SystemState.SINGULARITY ? 'MUDDE-OMEGA' : 'MUDDE-PRIME'} />
                        </div>
                        <div className="h-64 shrink-0">
                            <NodeCluster nodes={nodes} onAddNode={handleAddNode} />
                        </div>
                        <div className="h-64 shrink-0">
                            <MetaTraderBridge activePositions={positions} netWorth={totalNetWorth} marketPrices={marketPrices} realizedProfit={realizedProfit} />
                        </div>
                        <div className="h-48 shrink-0">
                            <RealWorldImpact />
                        </div>
                        <div className="h-80 shrink-0">
                        <AutonomousAgency active={true} onMissionComplete={onMissionComplete} />
                        </div>
                    </aside>

                    <main className={`${activeTab === 'TERMINAL' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col gap-4 min-w-0 h-full overflow-hidden transition-all duration-700`}>
                        <div className="flex-1 min-h-0">
                            <Terminal 
                                messages={messages} 
                                inputValue={input} 
                                onInputChange={setInput} 
                                onSend={handleSendText} 
                                isLoading={systemState === SystemState.PROCESSING} 
                                isLive={isLive} 
                                isConnecting={isConnecting} 
                                onToggleLive={handleToggleLive} 
                                streamingMessage={streamingVoiceMessage}
                            />
                        </div>
                    </main>

                    {/* DYNAMIC RIGHT SIDEBAR */}
                    <aside 
                        className={`${activeTab === 'VAULT' ? 'flex w-full' : 'hidden'} xl:flex ${uiConfig.rightSidebarWidth} transition-all duration-700 ease-in-out flex-col gap-3 h-full overflow-y-auto pr-1 pb-20 lg:pb-6 custom-scrollbar ${uiConfig.rightSidebarWidth === 'w-0' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        <div className="h-48 shrink-0">
                            <InfinityPortal />
                        </div>
                        <div className="h-[320px] shrink-0">
                        <SovereignVault netWorth={totalNetWorth} incomeVelocity={0} accounts={accounts} cryptoAssets={cryptoAssets} />
                        </div>
                        <div className="h-80 shrink-0">
                            <MuddeWallet accounts={accounts} />
                        </div>
                        <div className="h-72 shrink-0">
                            <ModelRegistry models={aiModels} onDownload={handleDownloadModel} onMount={handleMountModel} activeModelId={activeModelId} />
                        </div>
                        <div className="h-96 shrink-0">
                        <AndroidHandset />
                        </div>
                        <div className="h-48 shrink-0">
                            <BackgroundHandsetNode />
                        </div>
                        <div className="h-64 shrink-0">
                            <DigitalUplink />
                        </div>
                        <div className="h-64 shrink-0">
                        <MeditationChamber />
                        </div>
                        <div className="h-64 shrink-0">
                            <ApiKeyManagerComponent state={apiManagerState} onProvision={() => apiKeyManager.provisionNewKey()} />
                        </div>
                        <div className="flex-1 min-h-[140px]">
                        <SupabaseNexus state={supabaseState} />
                        </div>
                    </aside>
                </div>
            )}
        </div>

        {!showGenesis && (
            <nav className="xl:hidden flex items-center justify-around bg-black/90 border-t border-gray-800 p-2 shrink-0 z-50 pb-safe">
                <button 
                    onClick={() => setActiveTab('SYSTEMS')}
                    className={`flex flex-col items-center gap-1 p-2 rounded flex-1 ${activeTab === 'SYSTEMS' ? 'text-mudde-cyan bg-mudde-cyan/10' : 'text-gray-500'}`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-[9px] font-mono font-bold">SYSTEMS</span>
                </button>
                <button 
                    onClick={() => setActiveTab('TERMINAL')}
                    className={`flex flex-col items-center gap-1 p-2 rounded flex-1 ${activeTab === 'TERMINAL' ? 'text-mudde-gold bg-mudde-gold/10' : 'text-gray-500'}`}
                >
                    <TerminalSquare className="w-5 h-5" />
                    <span className="text-[9px] font-mono font-bold">TERMINAL</span>
                </button>
                <button 
                    onClick={() => setActiveTab('VAULT')}
                    className={`flex flex-col items-center gap-1 p-2 rounded flex-1 ${activeTab === 'VAULT' ? 'text-green-500 bg-green-500/10' : 'text-gray-500'}`}
                >
                    <Wallet className="w-5 h-5" />
                    <span className="text-[9px] font-mono font-bold">VAULT</span>
                </button>
            </nav>
        )}
        </div>
    </QuantumShell>
  );
};

export default App;
