
import { ApiKey, ApiManagerState } from '../types';
import { PRICING, MODEL_FAST, MODEL_REASONING } from '../constants';

const PROVISION_COST = 50000; // Cost in USD to provision a new key

type CostCallback = (amount: number) => void;

class ApiKeyManager {
    private state: ApiManagerState = {
        keys: [],
        activeKeyIndex: 0,
        totalRequests: 0,
        totalSpent: 0, // This now reflects REAL spending + simulated provisioning
        autoScale: false,
        bankingLinkStatus: 'VERIFIED'
    };

    private subscribers: ((state: ApiManagerState) => void)[] = [];
    private costCallbacks: CostCallback[] = [];

    constructor() {
        this.initialize(3); // Start with 3 keys for the cluster
    }

    private initialize(count: number) {
        for (let i = 0; i < count; i++) {
            this.state.keys.push(this.createKey());
        }
        this.notify();
    }

    private createKey(): ApiKey {
        // Simulate a Google Cloud API Key structure
        const key = `AIzaSy${Math.random().toString(36).substring(2, 10).toUpperCase()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        return { key, status: 'ACTIVE', requests: 0 };
    }

    subscribe(callback: (state: ApiManagerState) => void): () => void {
        this.subscribers.push(callback);
        callback({
            ...this.state,
            keys: this.state.keys.map(k => ({ ...k }))
        });
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    onCost(callback: CostCallback): () => void {
        this.costCallbacks.push(callback);
        return () => {
            this.costCallbacks = this.costCallbacks.filter(cb => cb !== callback);
        };
    }

    private notify() {
        const stateClone = {
            ...this.state,
            keys: this.state.keys.map(k => ({ ...k }))
        };
        this.subscribers.forEach(sub => sub(stateClone));
    }

    getState(): ApiManagerState {
        return {
            ...this.state,
            keys: this.state.keys.map(k => ({ ...k }))
        };
    }

    toggleAutoScale(enabled: boolean) {
        this.state.autoScale = enabled;
        this.notify();
    }

    getAvailableKey(): string {
        // In this implementation, we return the env key but track it internally
        this.state.totalRequests++;
        this.notify();
        return process.env.API_KEY || "SIMULATED_KEY";
    }

    // New: Calculate real cost based on token usage
    recordRealUsage(model: string, inputTokens: number, outputTokens: number) {
        // Default to PRO pricing if unknown
        const pricing = PRICING[model as keyof typeof PRICING] || PRICING[MODEL_REASONING];
        
        const inputCost = (inputTokens / 1_000_000) * pricing.input;
        const outputCost = (outputTokens / 1_000_000) * pricing.output;
        const totalCallCost = inputCost + outputCost;

        this.state.totalSpent += totalCallCost;
        
        // Notify banking listeners (MuddeWallet/App) to deduct this REAL cost from simulated wealth
        this.costCallbacks.forEach(cb => cb(totalCallCost));
        this.notify();
    }

    provisionNewKey(isAuto: boolean = false): { cost: number } {
        const newKey = this.createKey();
        this.state.keys.push(newKey);
        this.state.totalSpent += PROVISION_COST;
        this.costCallbacks.forEach(cb => cb(PROVISION_COST));
        this.notify();
        return { cost: PROVISION_COST };
    }
}

export const apiKeyManager = new ApiKeyManager();
