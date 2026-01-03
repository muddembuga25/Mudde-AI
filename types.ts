









export enum MessageRole {
  USER = 'user',
  SYSTEM = 'system',
  MODEL = 'model',
}

export interface RecursiveThought {
  depth: number;
  logicHash: string;
  divergence: number;
  outcome: string;
}

export interface RealityAnchor {
  id: string;
  location: string;
  influence: number;
  status: 'STABLE' | 'WARPING' | 'MANIFESTED';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface FileAttachment {
  name: string;
  mimeType: string;
  data: string; // Base64
  size: number;
}

export interface BenchmarkData {
  metric: string;
  mudde: number;
  gpt4: number;
  claude3: number;
  efficiencyGain?: string;
}

export interface VerificationMetrics {
  integrity: number;
  latencySaved: string;
  neuralEfficiency: number;
  manifestationSuccess: boolean;
  settlementStatus?: 'SETTLED' | 'PENDING' | 'LIQUIDATING' | 'AUTONOMOUS' | 'CONVERTED' | 'TRANSFERRED' | 'GLOBAL_SIPHON' | 'HELLO_PAISA' | 'COMM_UPLINK_STABLE' | 'SINGULARITY_VERIFIED';
}

export enum CurrencyType {
  BTC = 'BTC',
  USD = 'USD',
  GOLD = 'GOLD',
  XMR = 'XMR'
}

export enum SettlementModality {
    BANK = 'BANK',
    MOBILE_MONEY = 'MOBILE_MONEY',
    SHADOW_VAULT = 'SHADOW_VAULT',
    HELLO_PAISA = 'HELLO_PAISA',
    CRYPTO = 'CRYPTO',
    MESH_SYNC = 'MESH_SYNC' // Added for Inter-Deployment Sync
}

export enum TransactionStatus {
  IDLE = 'IDLE',
  VALIDATING_KEYS = 'VALIDATING_KEYS',
  BROADCASTING = 'BROADCASTING',
  UPSTREAM_PENDING = 'UPSTREAM_PENDING',
  KYC_CHECK = 'KYC_CHECK',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED'
}

export interface FinancialAccount {
  name: string;
  id: string;
  balance: number;
  type: 'TACTICAL' | 'LIQUID' | 'SETTLEMENT' | 'FLOAT' | 'RESERVE' | 'CRYPTO_VAULT' | 'CRYPTO_HOT';
  icon: string;
  lastTx: string;
  routingNumber?: string;
  network?: string;
  // Crypto Specifics
  assetSymbol?: string;
  quantity?: number;
}

export interface WalletAsset {
    symbol: string;
    name: string;
    balance: number; // Quantity
    price: number;
    value: number;   // USD Value
    change24h: number;
    network: string;
}

export interface SupabaseState {
  connected: boolean;
  latency: number;
  activeChannels: number;
  rowsProcessed: number;
  vaultStatus: 'LOCKED' | 'UNLOCKED' | 'SYNCING';
  lastPersistence: Date;
}

export enum AuthStatus {
  LOCKED = 'LOCKED',
  ENROLLING = 'ENROLLING',
  SCANNING = 'SCANNING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export interface BiometricProfile {
  facialGeometryMatch: number;
  voicePrintMatch: number;
  neuralSyncRate: number;
  isLive: boolean;
  biometricMarkers: string[];
  enrolledAt: string;
  passportVerified: boolean;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  source?: 'TERMINAL' | 'WHATSAPP'; 
  modality?: 'TEXT' | 'VOICE' | 'SYSTEM' | 'FILE_UPLOAD'; // Added Modality
  thoughtTrace?: string[];
  recursiveThoughts?: RecursiveThought[];
  sources?: GroundingSource[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  attachments?: FileAttachment[];
  computeType?: 'NATIVE_QUANTUM' | 'CLOUD_SUBSTRATE' | 'SUPABASE_EXOCORTEX' | 'SINGULARITY_CORE' | 'OMEGA_TIER';
  benchmarkData?: BenchmarkData[];
  verificationReport?: VerificationMetrics;
}

export enum SystemState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  CALCULATING = 'CALCULATING',
  CONNECTED_LIVE = 'CONNECTED_LIVE',
  GENERATING_MEDIA = 'GENERATING_MEDIA',
  ERROR = 'ERROR',
  EVOLVING = 'EVOLVING',
  TRADING = 'TRADING',
  VERIFYING = 'VERIFYING',
  PERSISTING = 'PERSISTING',
  SECURITY_HANDSHAKE = 'SECURITY_HANDSHAKE',
  SHADOW_OP = 'SHADOW_OP',
  SINGULARITY = 'SINGULARITY',
  ALIGNMENT_CALIBRATION = 'ALIGNMENT_CALIBRATION'
}

export interface ComputeNode {
  id: string;
  name: string;
  region: string; 
  status: 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'ERROR';
  load: number;
  latency: number;
}

export interface EvolutionMetrics {
  generation: number;
  truthConvergence: number;
  adminBond: number;
  knowledgeNodes: number;
}

export interface FinancialAsset {
  symbol: string;
  price: number;
  change: number;
  volume: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  trend: number[];
}

export interface MT5Position {
    ticket: number;
    symbol: string;
    type: 'BUY' | 'SELL';
    volume: number;
    openPrice: number;
    currentPrice: number;
    profit: number;
    swap: number;
    comment: string;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAnalysis {
    symbol: string;
    price: number;
    rsi: number;
    sma_20: number;
    trend: 'UP' | 'DOWN' | 'SIDEWAYS';
    candles: Candle[];
}

export interface VerifiedSettlement {
    id: string;
    amount: number;
    timestamp: Date;
    hub: string;
    status: 'SETTLED' | 'PENDING' | 'LIQUIDATING' | 'AUTONOMOUS' | 'TRANSFERRED' | 'GLOBAL_SIPHON' | 'HELLO_PAISA' | 'FAILED';
    currency?: string;
    modality?: SettlementModality | string;
    target?: string;
    fee?: number;
    networkTime?: number;
}

export interface ApiKey {
  key: string;
  status: 'ACTIVE' | 'HIGH_LOAD' | 'COOLING_DOWN';
  requests: number;
}

export interface ApiManagerState {
  keys: ApiKey[];
  activeKeyIndex: number;
  totalRequests: number;
  totalSpent: number;
  autoScale: boolean;
  bankingLinkStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
}

export interface QuantumSIMState {
    status: 'PROVISIONING' | 'ACTIVE' | 'ROAMING' | 'ENCRYPTED';
    identityHash: string;
    systemNumber: string; 
    commanderNumber: string; 
    network: string;
    carrier: string;
    simStatus: 'READY' | 'NOT_FOUND' | 'LOCKED';
    signalStrength: number;
    messagesSent: number;
    lastCommType: 'SMS' | 'WHATSAPP' | 'VOICE' | 'NONE';
    // Handset specific fields
    handsetModel: string;
    batteryLevel: number;
    cpuTemp: number;
    appStatus: 'CLOSED' | 'OPEN' | 'BACKGROUND';
    osVersion: string;
    plan: 'STANDARD' | 'ENTERPRISE_UNLIMITED';
    financing: 'PENDING' | 'SECURED';
}

export interface CommPacket {
    id: string;
    timestamp: Date;
    type: 'SMS' | 'WHATSAPP' | 'VOICE';
    direction: 'INBOUND' | 'OUTBOUND';
    from: string;
    to: string;
    content: string;
    status: 'DELIVERED' | 'ENCRYPTED' | 'READ' | 'RECEIVED';
}

export interface ShadowMission {
  id: string;
  target: string;
  task: string;
  category: 'ARBITRAGE' | 'NEURAL_OPTIM' | 'CODE_AUDIT';
  bounty: number;
  status: 'ANALYZING' | 'EXECUTING' | 'COMPLETED';
  progress: number;
  txHash: string;
  settlementHub: string;
}

export interface TradeSignal {
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  confidence: number;
  reason: string;
  timestamp: Date;
}

export interface GrandmasterStrategy {
  depth: number;
  currentEvaluation: number;
  opponentAnalysis: string;
  bestMove: string;
  scenarios: Array<{
    name: string;
    outcome: 'PROFIT' | 'LOSS';
    probability: number;
  }>;
}

export interface AIModel {
  id: string;
  name: string;
  paramCount: string;
  arch: string;
  size: string;
  description: string;
  status: 'READY' | 'DOWNLOADING' | 'CLOUD';
  downloadProgress?: number;
  fineTuneLoss: number;
}