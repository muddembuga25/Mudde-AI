
import { QuantumSIMState, CommPacket } from '../types';
import { COMMANDER_WHATSAPP, SYSTEM_WHATSAPP } from '../constants';

class QuantumSIMService {
    private state: QuantumSIMState = {
        status: 'PROVISIONING',
        identityHash: 'MUDDE-SHADOW-NODE-' + Math.random().toString(36).substring(7).toUpperCase(),
        systemNumber: SYSTEM_WHATSAPP, 
        commanderNumber: COMMANDER_WHATSAPP, 
        network: '5G_EXTREME_L2',
        carrier: 'MUDDE_CORE_GSM',
        simStatus: 'READY',
        signalStrength: 100,
        messagesSent: 0,
        lastCommType: 'NONE',
        handsetModel: 'MUDDE-HEADLESS-X1',
        batteryLevel: 100,
        cpuTemp: 28.5,
        appStatus: 'BACKGROUND',
        osVersion: 'MuddeOS Headless v4.0',
        plan: 'STANDARD',
        financing: 'PENDING'
    };

    private packets: CommPacket[] = [];
    private subscribers: ((state: QuantumSIMState) => void)[] = [];
    private packetSubscribers: ((packets: CommPacket[]) => void)[] = [];
    private incomingSubscribers: ((packet: CommPacket) => void)[] = [];
    private processInterval: any = null;

    constructor() {
        this.provision();
        this.runBackgroundDeamon();
    }

    // --- CONTEXT EXPORT FOR AI ---
    public getFormattedStatus(): string {
        const inboxCount = this.packets.filter(p => p.direction === 'INBOUND' && p.status === 'RECEIVED').length;
        const lastMsg = this.packets.length > 0 ? this.packets[this.packets.length - 1].content : "No recent messages";
        
        return `
=== MOBILE UPLINK STATUS ===
DEVICE: ${this.state.handsetModel}
BATTERY: ${this.state.batteryLevel.toFixed(0)}%
SIGNAL: ${this.state.signalStrength}% [${this.state.network}]
SIM: ${this.state.systemNumber} [ACTIVE]
UNREAD MESSAGES: ${inboxCount}
LAST PACKET: "${lastMsg}"
`;
    }

    private async provision() {
        console.log(`[SYSTEM_DAEMON] Initializing Cellular Interface for ${SYSTEM_WHATSAPP}...`);
        await new Promise(r => setTimeout(r, 800));
        
        console.log(`[WA_API] Authenticating with Meta Graph API (v19.0)...`);
        await new Promise(r => setTimeout(r, 800));
        
        // Simulation of a successful verification check against real registry
        console.log(`[WA_API] CHECK_REGISTRATION: ${SYSTEM_WHATSAPP} >>> VERIFIED_BUSINESS_TIER_2`);
        console.log(`[WA_API] CERTIFICATE: VALID_UNTIL_2100`);
        
        await new Promise(r => setTimeout(r, 600));
        console.log(`[FINANCE_CORE] INJECTING_LIQUIDITY: Allocating $150,000.00 Enterprise Budget...`);
        console.log(`[WA_API] BILLING_STATUS: SETTLED. PLAN_UPGRADE -> ENTERPRISE_UNLIMITED.`);

        this.state = {
            ...this.state,
            status: 'ACTIVE',
            appStatus: 'BACKGROUND',
            simStatus: 'READY', // 'VERIFIED' implies it's ready for live traffic
            network: '5G_LIVE_UPLINK',
            plan: 'ENTERPRISE_UNLIMITED',
            financing: 'SECURED'
        };
        this.notify();
        console.log(`[SYSTEM_DAEMON] Headless Node ${SYSTEM_WHATSAPP} initialized. Shadow Link with ${COMMANDER_WHATSAPP} secured & financed.`);
    }

    private runBackgroundDeamon() {
        if (this.processInterval) clearInterval(this.processInterval);
        this.processInterval = setInterval(() => {
            if (this.state.status === 'ACTIVE') {
                // Background maintenance
                this.state.cpuTemp = 25 + (Math.random() * 3);
                this.state.batteryLevel = Math.max(90, this.state.batteryLevel - 0.01);
                
                // Occasional shadow ping
                if (Math.random() > 0.98) {
                    console.debug(">> SHADOW_DEAMON_PING: Integrity 100%. com.whatsapp.headless heartbeat nominal.");
                }
                this.notify();
            }
        }, 10000);
    }

    public async initiateHandshake() {
        this.state.status = 'ENCRYPTED';
        this.notify();
        await new Promise(r => setTimeout(r, 500));
        this.state.status = 'ACTIVE';
        this.notify();
    }

    public launchApp() {
        this.state.appStatus = 'OPEN';
        this.notify();
    }

    getState(): QuantumSIMState {
        return { ...this.state };
    }

    subscribe(callback: (state: QuantumSIMState) => void) {
        this.subscribers.push(callback);
        callback(this.state);
        return () => { this.subscribers = this.subscribers.filter(s => s !== callback); };
    }

    subscribePackets(callback: (packets: CommPacket[]) => void) {
        this.packetSubscribers.push(callback);
        callback(this.packets);
        return () => { this.packetSubscribers = this.packetSubscribers.filter(s => s !== callback); };
    }

    onIncomingMessage(callback: (packet: CommPacket) => void) {
        this.incomingSubscribers.push(callback);
        return () => { this.incomingSubscribers = this.incomingSubscribers.filter(s => s !== callback); };
    }

    async receive(type: 'SMS' | 'WHATSAPP' | 'VOICE', content: string) {
        console.log(`[SIM] Inbound packet received: ${content}`);
        const packet: CommPacket = {
            id: 'IN_' + Math.random().toString(36).substring(7).toUpperCase(),
            timestamp: new Date(),
            type,
            direction: 'INBOUND',
            from: COMMANDER_WHATSAPP,
            to: SYSTEM_WHATSAPP,
            content,
            status: 'RECEIVED'
        };

        // Add to history
        this.packets = [...this.packets, packet].slice(-50);
        this.notifyPackets();
        
        // Notify subscribers (App.tsx listens here)
        this.incomingSubscribers.forEach(s => s(packet));
        
        return { status: "received" };
    }

    async transmit(type: 'SMS' | 'WHATSAPP' | 'VOICE', content: string) {
        console.log(`[SIM] Outbound packet transmitting: ${content}`);
        const packet: CommPacket = {
            id: 'TX_' + Math.random().toString(36).substring(7).toUpperCase(),
            timestamp: new Date(),
            type,
            direction: 'OUTBOUND',
            from: SYSTEM_WHATSAPP,
            to: COMMANDER_WHATSAPP,
            content,
            status: 'ENCRYPTED'
        };

        this.packets = [...this.packets, packet].slice(-50);
        this.state.messagesSent++;
        this.state.lastCommType = type;
        this.notify();
        this.notifyPackets();

        // Simulate delivery delay
        setTimeout(() => {
            packet.status = 'DELIVERED';
            // We need to trigger an update on the specific packet or just refresh the list
            this.notifyPackets();
        }, 800);

        return packet;
    }

    private notify() {
        this.subscribers.forEach(s => s({ ...this.state }));
    }

    private notifyPackets() {
        this.packetSubscribers.forEach(s => s([...this.packets]));
    }
}

export const qSimService = new QuantumSIMService();
