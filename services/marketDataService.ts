
import { Candle, MarketAnalysis } from "../types";
import { backgroundAgent } from "./backgroundAgent";

type TickCallback = (symbol: string, price: number) => void;
type CandleCallback = (analysis: MarketAnalysis) => void;

export class MarketDataService {
    private ws: WebSocket | null = null;
    private listeners: TickCallback[] = [];
    private candleListeners: CandleCallback[] = [];
    private cleanupTick: (() => void) | null = null;

    // Technical Analysis State
    private candles: Record<string, Candle[]> = {};
    private currentCandle: Record<string, Candle> = {};
    private CANDLE_PERIOD = 5000; 

    connect() {
        // Crypto via CoinCap (Live Public WebSocket) - WebSockets usually stay open in background
        this.ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,monero,solana,xrp');
        
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const map: Record<string, string> = {
                    bitcoin: 'BTCUSD',
                    ethereum: 'ETHUSD',
                    monero: 'XMRUSD',
                    solana: 'SOLUSD',
                    xrp: 'XRPUSD'
                };

                Object.entries(data).forEach(([id, priceStr]) => {
                    const symbol = map[id];
                    if (symbol) {
                        const price = parseFloat(priceStr as string);
                        this.notify(symbol, price);
                        this.processTick(symbol, price);
                    }
                });
            } catch (e) {
                console.error("Market Data Parse Error", e);
            }
        };

        // Simulate Forex (XAUUSD, EURUSD) & Indices (US30, NAS100)
        let goldPrice = 2340.50;
        let eurPrice = 1.0850;
        let us30Price = 39150.00;
        let nas100Price = 17950.00;
        let gbpPrice = 1.2750;

        // CRITICAL: Use backgroundAgent instead of setInterval
        // This ensures the simulated market continues to move even when the tab is hidden
        this.cleanupTick = backgroundAgent.subscribe(() => {
            // Volatility for Gold
            goldPrice += (Math.random() - 0.45) * 2.5; 
            this.notify('XAUUSD', goldPrice);
            this.processTick('XAUUSD', goldPrice);

            // EURUSD
            eurPrice += (Math.random() - 0.48) * 0.0008; 
            this.notify('EURUSD', eurPrice);
            this.processTick('EURUSD', eurPrice);

            // US30
            us30Price += (Math.random() - 0.4) * 12;
            this.notify('US30', us30Price);
            this.processTick('US30', us30Price);

            // NAS100
            nas100Price += (Math.random() - 0.4) * 8;
            this.notify('NAS100', nas100Price);
            this.processTick('NAS100', nas100Price);

            // GBPUSD
            gbpPrice += (Math.random() - 0.48) * 0.0010;
            this.notify('GBPUSD', gbpPrice);
            this.processTick('GBPUSD', gbpPrice);
        });
    }

    private processTick(symbol: string, price: number) {
        const now = Date.now();
        
        if (!this.currentCandle[symbol]) {
            this.currentCandle[symbol] = {
                time: Math.floor(now / this.CANDLE_PERIOD) * this.CANDLE_PERIOD,
                open: price, high: price, low: price, close: price, volume: 0
            };
        }

        const candle = this.currentCandle[symbol];
        
        if (price > candle.high) candle.high = price;
        if (price < candle.low) candle.low = price;
        candle.close = price;
        candle.volume += Math.random(); 

        if (now >= candle.time + this.CANDLE_PERIOD) {
            if (!this.candles[symbol]) this.candles[symbol] = [];
            const history = this.candles[symbol];
            history.push({ ...candle });
            if (history.length > 50) history.shift();

            this.currentCandle[symbol] = {
                time: Math.floor(now / this.CANDLE_PERIOD) * this.CANDLE_PERIOD,
                open: price, high: price, low: price, close: price, volume: 0
            };

            this.broadcastAnalysis(symbol, price, history);
        }
    }

    private broadcastAnalysis(symbol: string, currentPrice: number, history: Candle[]) {
        if (history.length < 14) return;

        let gains = 0;
        let losses = 0;
        for (let i = history.length - 14; i < history.length; i++) {
            const diff = history[i].close - history[i].open;
            if (diff >= 0) gains += diff;
            else losses -= diff;
        }
        const rs = gains / (losses || 1);
        const rsi = 100 - (100 / (1 + rs));

        const sum = history.slice(-20).reduce((acc, c) => acc + c.close, 0);
        const sma = sum / Math.min(history.length, 20);

        const analysis: MarketAnalysis = {
            symbol,
            price: currentPrice,
            rsi,
            sma_20: sma,
            trend: currentPrice > sma ? 'UP' : 'DOWN',
            candles: history
        };

        this.candleListeners.forEach(l => l(analysis));
    }

    subscribe(callback: TickCallback) {
        this.listeners.push(callback);
        return () => { this.listeners = this.listeners.filter(l => l !== callback); };
    }

    subscribeToAnalysis(callback: CandleCallback) {
        this.candleListeners.push(callback);
        return () => { this.candleListeners = this.candleListeners.filter(l => l !== callback); };
    }

    private notify(symbol: string, price: number) {
        this.listeners.forEach(l => l(symbol, price));
    }

    disconnect() {
        if (this.ws) this.ws.close();
        if (this.cleanupTick) this.cleanupTick();
    }
}

export const marketService = new MarketDataService();
