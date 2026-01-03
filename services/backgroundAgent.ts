
type TickCallback = () => void;

class BackgroundAgent {
    private worker: Worker | null = null;
    private audioCtx: AudioContext | null = null;
    private listeners: TickCallback[] = [];
    private isRunning = false;
    private wakeLockSentinel: any = null;
    private videoEl: HTMLVideoElement | null = null;
    private wakeLockActive = false;

    constructor() {
        this.init();
    }

    private init() {
        if (typeof window === 'undefined') return;

        // 1. Create a Web Worker from a Blob to avoid external file dependencies.
        const workerCode = `
            let interval = null;
            self.onmessage = function(e) {
                if (e.data === 'START') {
                    if (interval) clearInterval(interval);
                    interval = setInterval(() => {
                        self.postMessage('TICK');
                    }, 100); // 100ms High Frequency Tick
                } else if (e.data === 'STOP') {
                    if (interval) clearInterval(interval);
                }
            };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));

        this.worker.onmessage = (e) => {
            if (e.data === 'TICK') {
                this.dispatchTick();
            }
        };

        // Start the worker immediately
        this.start();
        
        // Attempt Wake Lock silently on init
        this.requestWakeLock().catch(() => {}); 

        // Re-acquire wake lock on visibility change if it was active
        document.addEventListener("visibilitychange", async () => {
            if (this.wakeLockActive && document.visibilityState === "visible") {
                console.log("[BACKGROUND_AGENT] Visibility restored, re-acquiring Wake Lock...");
                await this.requestWakeLock();
            }
        });
    }

    public start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.worker?.postMessage('START');
        this.enableAudioHack();
    }

    public enableAudioHack() {
        if (!this.audioCtx && typeof (window as any).AudioContext !== 'undefined') {
            try {
                const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
                this.audioCtx = new AudioContext();
                const oscillator = this.audioCtx.createOscillator();
                const gainNode = this.audioCtx.createGain();
                gainNode.gain.value = 0.0001; 
                oscillator.connect(gainNode);
                gainNode.connect(this.audioCtx.destination);
                oscillator.start();
            } catch (e) {
                console.warn("[BACKGROUND_AGENT] Audio Context Warning", e);
            }
        }
        
        if (this.audioCtx?.state === 'suspended') {
            const resume = () => {
                this.audioCtx?.resume().catch(() => {});
                window.removeEventListener('click', resume);
                window.removeEventListener('keydown', resume);
                window.removeEventListener('touchstart', resume);
            };
            window.addEventListener('click', resume);
            window.addEventListener('keydown', resume);
            window.addEventListener('touchstart', resume);
        }
    }
    
    public async requestWakeLock() {
        this.wakeLockActive = true;
        
        // A. Native Wake Lock API
        if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
            try {
                if (this.wakeLockSentinel && !this.wakeLockSentinel.released) {
                    // Already active
                    return;
                }
                this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
                console.log("[BACKGROUND_AGENT] Native Wake Lock Active");
                this.wakeLockSentinel.addEventListener('release', () => {
                    console.log("[BACKGROUND_AGENT] Wake Lock Released");
                });
            } catch (err) {
                // Silently fail if permissions denied or no gesture
                // console.debug("Wake Lock request failed:", err);
            }
        }

        // B. Video Hack (NoSleep Fallback) - Always keep this active as backup
        if (typeof document !== 'undefined' && !this.videoEl) {
            this.videoEl = document.createElement('video');
            this.videoEl.setAttribute('playsinline', '');
            this.videoEl.setAttribute('no-fullscreen', '');
            this.videoEl.setAttribute('loop', '');
            this.videoEl.setAttribute('muted', ''); 
            // Tiny blank video
            this.videoEl.src = "data:video/mp4;base64,AAAAHGZ0eXBNNEVAAAAAAAEAAAAAATEAAABtb292AAAAbG12aGQAAAAA61q5AAAAAAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAGGlvZHMAAAAAEICAgAcAT////3//AAACQXRyYWsAAABcdGtoZAAAAADrWrkAAAAAAAEAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAEAAAABAAAAAAACEDZWR0cwAAABxlbHN0AAAAAAAAAAEAAAABAAAAAAABAAAAAAACMmdtZGlhAAAAIG1kaGQAAAAA61q5AAAAAAABAAAAAAABAAAAAAAAAAAAAAA1aGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAAVbWluZgAAAAR2bWhkAAAAAAAkbGluZgAAAAR1cmwgAAAAAAAAAAEAAAAsZGluaQAAABRkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAACKdHN0YgAAAExpc3RzAAAADHN0c2QAAAAAAAAAAQAAAIhhdmMxAAAAAAAAAAEAAAABAAAAAQAAABAAAAAQAAAAAAAAAAEAACAAAAB0AAAAP//AAAANNh2Y2MMAAAAHhrY2RjZHQAAAABAAAAAAAIAAAACAAAAAAABAAAAAAIAAAACAAAAAAABAAAAAAJBgAAAAAAHGF2Y0MAAAAAAAAAAAAAAAEAACspAAAAAAAEAAAJc3RzYwAAAAAAAAABAAAAAQAAAAEAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAAQAAAAEAAAA0c3RjbwAAAAAAAAABAAAAIAAAAAF1ZHRhAAAAH21ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXIAAAAAAAAAAAAAAAAAAAA=";
            
            this.videoEl.style.position = 'fixed';
            this.videoEl.style.width = '1px';
            this.videoEl.style.height = '1px';
            this.videoEl.style.left = '0';
            this.videoEl.style.top = '0';
            this.videoEl.style.opacity = '0.01';
            this.videoEl.style.pointerEvents = 'none';
            this.videoEl.style.zIndex = '-100';
            
            document.body.appendChild(this.videoEl);
        }
        
        if (this.videoEl) {
            this.videoEl.play().catch(() => {});
        }
    }

    public async releaseWakeLock() {
        this.wakeLockActive = false;
        if (this.wakeLockSentinel) {
            await this.wakeLockSentinel.release();
            this.wakeLockSentinel = null;
        }
        if (this.videoEl) {
            this.videoEl.pause();
        }
    }

    public subscribe(callback: TickCallback): () => void {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private dispatchTick() {
        this.listeners.forEach(cb => cb());
    }
}

export const backgroundAgent = new BackgroundAgent();
