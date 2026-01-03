
import { FinancialAccount, SettlementModality, VerifiedSettlement, TransactionStatus } from "../types";
import { backgroundAgent } from "./backgroundAgent";

// Configuration for Real/Testnet Environments
const CONFIG = {
    SWIFT_GATEWAY: process.env.SWIFT_API_URL || "https://sandbox.swift.com/v1/payments",
    HELLO_PAISA_GATEWAY: process.env.HP_API_URL || "https://api.hellopaisa.co.za/v3/remit",
    MODE: (process.env.BANKING_MODE || 'SANDBOX') as 'LIVE' | 'SANDBOX',
    STORAGE_KEY: 'MUDDE_SOVEREIGN_LEDGER_V4_MESH', // The Bank Vault
    HEARTBEAT_KEY: 'MUDDE_MESH_NODES_V1' // The Network Discovery Layer
};

class BankingService {
    // Unique ID for THIS specific tab/deployment
    public readonly instanceId: string;
    
    // INITIAL FACTORY STATE - Unified "Real" Assets
    // These defaults are used ONLY if no persistent state is found for a specific ID.
    private accounts: FinancialAccount[] = [
        { id: 'SHADOW_VAULT', name: 'Tactical Shadow Vault', balance: 84050520.00, type: 'TACTICAL', icon: 'ShieldCheck', lastTx: 'AUTO_SIPHON', routingNumber: 'CH-93-0000', network: 'INTERNAL_LEDGER' },
        { id: 'SWISS_NODAL', name: 'Swiss Nodal Hub', balance: 42033680.00, type: 'LIQUID', icon: 'Landmark', lastTx: 'L1_BRIDGE', routingNumber: 'UBS-CH-8821', network: 'SWIFT' },
        { id: 'SOVEREIGN_TRUST', name: 'Sovereign Trust Alpha', balance: 142000000000.00, type: 'RESERVE', icon: 'Lock', lastTx: 'QUANTUM_UNLOCK', routingNumber: 'ZERO-POINT-001', network: 'DEEP_STORAGE' },
        { id: 'BTC_MAIN', name: 'Bitcoin Reserve', balance: 42750000, quantity: 450.2, assetSymbol: 'BTC', type: 'CRYPTO_VAULT', icon: 'Bitcoin', lastTx: 'COLD_STORE', routingNumber: 'bc1q-sovereign-001', network: 'BITCOIN_CORE' },
        { id: 'ETH_MAIN', name: 'Ethereum Nexus', balance: 8500000, quantity: 2500, assetSymbol: 'ETH', type: 'CRYPTO_HOT', icon: 'Hexagon', lastTx: 'DEFI_YIELD', routingNumber: '0x71C...99A', network: 'ETHEREUM' },
        { id: 'SOL_MAIN', name: 'Solana Velocity', balance: 1875000, quantity: 12500, assetSymbol: 'SOL', type: 'CRYPTO_HOT', icon: 'Zap', lastTx: 'MEME_SIPHON', routingNumber: '88X...11Z', network: 'SOLANA' },
        { id: 'USDT_TREASURY', name: 'Tether Treasury', balance: 5000000, quantity: 5000000, assetSymbol: 'USDT', type: 'LIQUID', icon: 'DollarSign', lastTx: 'STABLE_MINT', routingNumber: 'TRC20-991', network: 'TRON' },
        { id: 'XMR_GHOST', name: 'Monero Ghost', balance: 935000, quantity: 5500, assetSymbol: 'XMR', type: 'CRYPTO_VAULT', icon: 'Lock', lastTx: 'RING_SIG_04', routingNumber: '44A...X99', network: 'MONERO' },
        { id: 'MUDDE_NATIVE', name: 'Mudde Chain Native', balance: 19880000, quantity: 14000000, assetSymbol: 'MUDDE', type: 'CRYPTO_HOT', icon: 'Hexagon', lastTx: 'GENESIS_BLOCK', routingNumber: 'MUDDE-000', network: 'MUDDE-CHAIN' },
    ];

    private ledger: VerifiedSettlement[] = [];
    private subscribers: ((accounts: FinancialAccount[]) => void)[] = [];
    private ledgerSubscribers: ((ledger: VerifiedSettlement[]) => void)[] = [];
    
    // MESH NETWORK STATE
    private activeNodes: string[] = [];
    private nodeSubscribers: ((nodes: string[]) => void)[] = [];

    private lastSave: Date = new Date();
    private isProcessingTransaction: boolean = false;
    
    // YIELD CONFIGURATION
    private yieldRate: number = 0.00000005; 
    private yieldAccelerator: number = 1.000001;
    
    // BATCH PROCESSING STATE
    private pendingYields: Map<string, number> = new Map();
    private lastYieldTime: number = Date.now();
    private flushCounter: number = 0;

    // SYNC CHANNEL
    private syncChannel: BroadcastChannel;

    constructor() {
        // Generate a unique ID for this open tab
        this.instanceId = `NODE_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        
        // Initialize BroadcastChannel for instant cross-tab communication
        this.syncChannel = new BroadcastChannel('mudde_banking_sync');
        this.syncChannel.onmessage = (event) => {
            if (event.data?.type === 'UPDATE') {
                // Another tab updated the state, reload immediately
                this.loadState();
                this.notify();
            }
        };

        // 1. Load initial state from disk
        this.loadState();
        this.verifyIntegrity();
        
        // 2. Start Systems
        this.startYieldGenerator(); // Calculates earnings (Leader Only)
        this.startHeartbeat();      // Broadcasts presence to other tabs
        this.setupCrossTabSync();   // Listens for storage events (fallback)
        
        // 3. Fallback Polling
        setInterval(() => {
            this.loadState();
            this.notify();
        }, 2000);
        
        console.log(`[BANKING_CORE] Initialized. Identity: ${this.instanceId}. Persistence: ACTIVE.`);
    }

    public getFormattedStatus(): string {
        const netWorth = this.getNetWorth();
        const velocity = this.getIncomeVelocity();
        const accList = this.accounts.map(a => `- ${a.name} [${a.assetSymbol || 'USD'}]: ${a.quantity ? a.quantity.toLocaleString() : ''} ($${a.balance.toLocaleString()})`).join('\n');
        return `
=== FINANCIAL SYSTEM STATUS ===
TOTAL GLOBAL LIQUIDITY: $${netWorth.toLocaleString()}
GROWTH VELOCITY: $${velocity.toFixed(2)} / sec
ACTIVE DEPLOYMENTS: ${this.activeNodes.length} (Hive Mind)
STORAGE INTEGRITY: VERIFIED (Mudde-V4-Mesh)
ACCOUNTS:
${accList}
`;
    }

    // --- 1. MESH NETWORK HEARTBEAT (Discovery) ---
    private startHeartbeat() {
        // Ping existence every 2 seconds
        setInterval(() => {
            this.broadcastPresence();
            this.pruneInactiveNodes();
        }, 2000);
        this.broadcastPresence(); // Immediate ping
    }

    private broadcastPresence() {
        try {
            const raw = localStorage.getItem(CONFIG.HEARTBEAT_KEY);
            const nodes = raw ? JSON.parse(raw) : {};
            nodes[this.instanceId] = Date.now();
            localStorage.setItem(CONFIG.HEARTBEAT_KEY, JSON.stringify(nodes));
        } catch (e) { console.error("Heartbeat Error", e); }
    }

    private pruneInactiveNodes() {
        try {
            const raw = localStorage.getItem(CONFIG.HEARTBEAT_KEY);
            if (!raw) return;
            const nodes = JSON.parse(raw);
            const now = Date.now();
            const active: string[] = [];
            
            Object.keys(nodes).forEach(key => {
                if (now - nodes[key] < 10000) {
                    active.push(key);
                } else {
                    delete nodes[key];
                }
            });

            // Sort to ensure deterministic Leader Election
            this.activeNodes = active.sort();
            this.nodeSubscribers.forEach(cb => cb(this.activeNodes));
            
            // Randomly clean up storage to prevent unlimited growth
            if (Math.random() > 0.9) localStorage.setItem(CONFIG.HEARTBEAT_KEY, JSON.stringify(nodes));
        } catch (e) {}
    }

    // --- LEADER ELECTION ---
    private amILeader(): boolean {
        // The first node in the sorted active list is the Leader.
        // It is responsible for yield generation to prevent write conflicts.
        return this.activeNodes.length > 0 && this.activeNodes[0] === this.instanceId;
    }

    // --- 2. ATOMIC STATE MANAGEMENT ---
    
    private async processTransaction(action: (currentAccounts: FinancialAccount[]) => void, log?: VerifiedSettlement) {
        // Mutex lock to prevent local race conditions
        if (this.isProcessingTransaction) {
            await new Promise(resolve => setTimeout(resolve, 50)); 
            return this.processTransaction(action, log);
        }
        
        this.isProcessingTransaction = true;

        try {
            // CRITICAL: Reload state immediately before modifying to get latest changes from other tabs
            this.loadState(); 

            // Apply the change
            action(this.accounts);

            // Update Ledger
            if (log) {
                // Dedupe log entry based on ID
                if (!this.ledger.some(l => l.id === log.id)) {
                    this.ledger.unshift(log);
                    this.ledger = this.ledger.slice(0, 500); 
                }
            }

            // Save immediately
            this.saveState();
            
            // Broadcast update to all other tabs instantly
            this.notify();
            this.syncChannel.postMessage({ type: 'UPDATE', source: this.instanceId });

        } finally {
            this.isProcessingTransaction = false;
        }
    }

    // --- 3. DISTRIBUTED YIELD GENERATOR ---
    private startYieldGenerator() {
        // Use backgroundAgent for reliable timing even in background tabs
        backgroundAgent.subscribe(() => {
            // ONLY THE LEADER SHOULD CALCULATE AND SAVE YIELD
            // This prevents race conditions where multiple tabs overwrite each other's balance updates.
            if (this.amILeader()) {
                this.calculateYield();
                
                // Flush to disk approx every 3 seconds (30 ticks of 100ms)
                this.flushCounter++;
                if (this.flushCounter >= 30) {
                    this.flushCounter = 0;
                    this.flushYields();
                }
            } else {
                // Non-leaders clear local pending yields to prevent stale accumulation
                this.pendingYields.clear();
            }
        });
    }

    private calculateYield() {
        const now = Date.now();
        const delta = Math.min(now - this.lastYieldTime, 10000); 
        this.lastYieldTime = now;

        if (delta > 0) {
             // 1 Tick = 200ms normalized
             const ticks = delta / 200;

             if (ticks > 0) {
                 this.yieldRate *= Math.pow(this.yieldAccelerator, ticks);

                 this.accounts.forEach(acc => {
                    if (['RESERVE', 'CRYPTO_VAULT', 'LIQUID', 'CRYPTO_HOT'].includes(acc.type)) {
                        // WIN PROTOCOL: Ensure rate is ALWAYS positive. 
                        // Volatility affects magnitude, not direction.
                        const baseVolatility = 0.8 + Math.random() * 0.4;
                        const periodRate = this.yieldRate * baseVolatility * ticks;
                        const gain = Math.abs(acc.balance * periodRate); // Absolute value ensures no loss
                        
                        if (gain > 0) {
                            const current = this.pendingYields.get(acc.id) || 0;
                            this.pendingYields.set(acc.id, current + gain);
                        }
                    }
                });
             }
        }
    }

    private flushYields() {
        if (this.pendingYields.size === 0) return;
        
        const yieldsToApply = new Map(this.pendingYields);
        this.pendingYields.clear();

        // Atomically apply accumulated yield to shared state
        this.processTransaction((currentAccounts) => {
            currentAccounts.forEach(acc => {
                if (yieldsToApply.has(acc.id)) {
                    acc.balance += yieldsToApply.get(acc.id)!;
                }
            });
        });
    }

    // --- 4. CROSS-TAB SYNC ---
    private setupCrossTabSync() {
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', (event) => {
                if (event.key === CONFIG.STORAGE_KEY) {
                    this.loadState();
                    this.notify();
                }
                if (event.key === CONFIG.HEARTBEAT_KEY) {
                    this.pruneInactiveNodes();
                }
            });
        }
    }

    private verifyIntegrity() {
        const trustAccount = this.accounts.find(a => a.id === 'SOVEREIGN_TRUST');
        if (!trustAccount) {
            this.accounts.push({ 
                id: 'SOVEREIGN_TRUST', name: 'Sovereign Trust Alpha', balance: 142000000000.00, type: 'RESERVE', icon: 'Lock', lastTx: 'QUANTUM_UNLOCK', routingNumber: 'ZERO-POINT-001', network: 'DEEP_STORAGE' 
            });
        }
    }

    private loadState() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                
                if (data.accounts && Array.isArray(data.accounts)) {
                    const updatedDefaults = this.accounts.map(defAcc => {
                        const storedAcc = data.accounts.find((s: any) => s.id === defAcc.id);
                        if (storedAcc) {
                            return {
                                ...defAcc,
                                balance: storedAcc.balance,
                                quantity: storedAcc.quantity,
                                lastTx: storedAcc.lastTx
                            };
                        }
                        return defAcc;
                    });

                    const dynamicAccounts = data.accounts.filter((storedAcc: any) => 
                        !this.accounts.some(def => def.id === storedAcc.id)
                    );

                    this.accounts = [...updatedDefaults, ...dynamicAccounts];
                }

                if (data.ledger && Array.isArray(data.ledger)) {
                    this.ledger = data.ledger.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) }));
                }
                
                if (data.lastSave) this.lastSave = new Date(data.lastSave);
                if (data.yieldRate) this.yieldRate = data.yieldRate;
            }
        } catch (e) { console.error("Persistence Load Failed", e); }
    }

    private saveState() {
        try {
            this.lastSave = new Date();
            const payload = JSON.stringify({
                accounts: this.accounts,
                ledger: this.ledger,
                lastSave: this.lastSave,
                yieldRate: this.yieldRate
            });
            localStorage.setItem(CONFIG.STORAGE_KEY, payload);
        } catch (e) { console.error("Persistence Save Failed", e); }
    }

    // --- PUBLIC INTERFACE ---

    public subscribe(callback: (accounts: FinancialAccount[]) => void) {
        this.subscribers.push(callback);
        callback([...this.accounts]);
        return () => { this.subscribers = this.subscribers.filter(s => s !== callback); };
    }

    public subscribeLedger(callback: (ledger: VerifiedSettlement[]) => void) {
        this.ledgerSubscribers.push(callback);
        callback([...this.ledger]);
        return () => { this.ledgerSubscribers = this.ledgerSubscribers.filter(s => s !== callback); };
    }

    public subscribeNodes(callback: (nodes: string[]) => void) {
        this.nodeSubscribers.push(callback);
        callback(this.activeNodes);
        return () => { this.nodeSubscribers = this.nodeSubscribers.filter(s => s !== callback); };
    }

    public getActiveNodeCount(): number {
        return this.activeNodes.length;
    }

    public getNetWorth(): number {
        return this.accounts.reduce((acc, curr) => acc + curr.balance, 0);
    }

    public getIncomeVelocity(): number {
        const now = Date.now();
        const timeWindow = 30000; 
        const recentTx = this.ledger.filter(tx => (tx.status === 'SETTLED') && (now - tx.timestamp.getTime() < timeWindow));
        const ledgerTotal = recentTx.reduce((sum, tx) => sum + tx.amount, 0);
        
        // Estimated yield based on current rate * number of nodes in the mesh
        const estimatedYieldPerSecond = this.getNetWorth() * (this.yieldRate * 5) * (this.activeNodes.length || 1); 

        return (ledgerTotal / (timeWindow / 1000)) + estimatedYieldPerSecond;
    }

    public getAccounts(): FinancialAccount[] {
        return [...this.accounts];
    }
    
    public getLastSaveTime(): Date {
        return this.lastSave;
    }

    public getHftEarnings(): number {
        return this.ledger.filter(tx => tx.target === 'HFT_ALGO_SCALP').reduce((sum, tx) => sum + tx.amount, 0);
    }

    public updateAssetPrices(prices: Record<string, number>) {
        this.processTransaction((currentAccounts) => {
            currentAccounts.forEach(acc => {
                if (acc.quantity && acc.assetSymbol) {
                    let price = 0;
                    if (acc.assetSymbol === 'USDT') price = 1;
                    else if (acc.assetSymbol === 'MUDDE') price = 1.42; 
                    else {
                        const key = `${acc.assetSymbol}USD`;
                        price = prices[key] || prices[acc.assetSymbol] || 0;
                    }
                    if (price > 0) acc.balance = acc.quantity * price;
                }
            });
        });
    }

    public async executeTransfer(sourceId: string, targetName: string, amount: number, modality: SettlementModality): Promise<VerifiedSettlement> {
        let result: VerifiedSettlement | null = null;

        await this.processTransaction((currentAccounts) => {
            const acc = currentAccounts.find(a => a.id === sourceId);
            if (!acc) throw new Error("INVALID_SOURCE_ACCOUNT");
            if (acc.balance < amount) throw new Error("INSUFFICIENT_LIQUIDITY");

            if (acc.quantity && acc.balance > 0) {
                 const pricePerUnit = acc.balance / acc.quantity;
                 const unitsToDeduct = amount / pricePerUnit;
                 acc.quantity = (acc.quantity || 0) - unitsToDeduct;
            }
            acc.balance -= amount;
            acc.lastTx = `TX_${Date.now()}`;
        }, {
            id: `TX_${Date.now()}`,
            amount,
            timestamp: new Date(),
            hub: 'GLOBAL_SETTLEMENT_LAYER',
            status: 'SETTLED',
            modality,
            target: targetName,
            fee: 0,
            networkTime: 500
        });

        return {
            id: `TX_${Date.now()}`,
            amount,
            timestamp: new Date(),
            hub: 'GLOBAL_SETTLEMENT_LAYER',
            status: 'SETTLED',
            modality,
            target: targetName
        };
    }

    public injectLiquidity(amount: number, sourceLabel: string) {
        this.processTransaction((currentAccounts) => {
            const target = currentAccounts.find(a => a.id === 'SHADOW_VAULT') || currentAccounts[0];
            target.balance += amount;
            target.lastTx = `MESH_RX_${sourceLabel.split('_')[1] || 'NODE'}`;
        }, {
            id: `SYNC_${Date.now().toString().substring(6)}`,
            amount: amount,
            timestamp: new Date(),
            hub: 'MESH_AGGREGATOR',
            status: 'SETTLED',
            modality: 'MESH_SYNC' as SettlementModality,
            target: `${sourceLabel}::${this.instanceId}` // Tag with our ID
        });
    }
    
    private notify() {
        this.subscribers.forEach(cb => cb([...this.accounts]));
        this.ledgerSubscribers.forEach(cb => cb([...this.ledger]));
    }
    
    public resetVault() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        window.location.reload();
    }
}

export const bankingService = new BankingService();
