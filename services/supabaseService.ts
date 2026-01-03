
import { SupabaseState } from "../types";

class SupabaseSubstrate {
    private state: SupabaseState = {
        connected: false,
        latency: 0,
        activeChannels: 0,
        rowsProcessed: 0,
        vaultStatus: 'LOCKED',
        lastPersistence: new Date()
    };

    private memory: Record<string, any> = {};

    async connect(): Promise<boolean> {
        // Simulating Supabase Handshake
        await new Promise(r => setTimeout(r, 1000));
        this.state.connected = true;
        this.state.latency = 12; // Typical edge latency
        this.state.vaultStatus = 'UNLOCKED';
        this.state.activeChannels = 4;
        return true;
    }

    getState(): SupabaseState {
        // Add some noise to latency
        return { 
            ...this.state, 
            latency: this.state.connected ? 10 + Math.random() * 5 : 0 
        };
    }

    async persistMemory(key: string, content: string, category: string) {
        this.state.rowsProcessed++;
        this.state.lastPersistence = new Date();
        this.memory[key] = { content, category, timestamp: new Date() };
        console.log(`[SUPABASE_SYNC] Key: ${key} stored in ${category} bucket.`);
        return { status: "success", id: Math.random().toString(36).substring(7) };
    }

    async queryVault(query: string) {
        const results = Object.entries(this.memory)
            .filter(([k, v]) => k.includes(query) || v.content.includes(query))
            .map(([k, v]) => ({ key: k, ...v }));
        return results;
    }

    simulateActivity() {
        if (this.state.connected && Math.random() > 0.8) {
            this.state.rowsProcessed += Math.floor(Math.random() * 10);
        }
    }
}

export const supabaseSubstrate = new SupabaseSubstrate();
