
import React, { useEffect, useRef, useState } from 'react';
import { Globe, Database, Infinity, Zap, ShieldCheck, Lock, Eye, Scan, Aperture } from 'lucide-react';

const InfinityPortal: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ingestRate, setIngestRate] = useState(0);

  // Matrix / Vortex Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;
    
    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
        width = canvas.width = canvas.clientWidth;
        height = canvas.height = canvas.clientHeight;
    });
    resizeObserver.observe(canvas);

    const chars = "01MUDDEΩπΣ∞";
    const columns = Math.floor(width / 10);
    const drops: number[] = new Array(columns).fill(1);
    
    // Vortex particles
    const particles: {x: number, y: number, angle: number, speed: number, r: number}[] = [];
    for(let i=0; i<50; i++) {
        particles.push({
            x: width/2, 
            y: height/2, 
            angle: Math.random() * Math.PI * 2, 
            speed: 1 + Math.random() * 3,
            r: Math.random() * 100
        });
    }

    let frame = 0;

    const draw = () => {
        // Fade effect
        ctx.fillStyle = 'rgba(0, 5, 10, 0.15)';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        // 1. Digital Rain (Background Layer)
        ctx.fillStyle = '#00f0ff';
        ctx.font = '8px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * 10;
            const y = drops[i] * 10;
            
            // Circular mask for the vortex center (don't draw rain in the eye)
            const dist = Math.sqrt((x-cx)**2 + (y-cy)**2);
            
            if (dist > 60) {
                const alpha = Math.min(1, (dist - 60) / 100);
                ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.3})`;
                ctx.fillText(text, x, y);
                
                if (drops[i] * 10 > height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }

        // 2. The Vortex (Event Horizon)
        particles.forEach(p => {
            p.angle += 0.05 * p.speed;
            p.r = Math.max(10, p.r - 0.5); // Suck inwards
            
            if (p.r <= 10) {
                // Reset to outer rim
                p.r = Math.max(width, height) / 2;
                p.speed = 1 + Math.random() * 3;
            }

            const px = cx + Math.cos(p.angle) * p.r;
            const py = cy + Math.sin(p.angle) * p.r;

            // Trail
            ctx.beginPath();
            ctx.strokeStyle = `rgba(189, 0, 255, ${p.r / 200})`; // Purple fading in
            ctx.lineWidth = 2;
            ctx.moveTo(px, py);
            ctx.lineTo(px - Math.cos(p.angle)*10, py - Math.sin(p.angle)*10);
            ctx.stroke();
        });

        // 3. The Singular Eye
        const eyePulse = Math.sin(frame * 0.1) * 5;
        ctx.beginPath();
        ctx.arc(cx, cy, 30 + eyePulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner Iris
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();

        frame++;
        requestAnimationFrame(draw);
    };

    const anim = requestAnimationFrame(draw);

    // Simulation logic for stats
    const interval = setInterval(() => {
        setIngestRate(prev => Math.floor(Math.random() * 500) + 4000);
    }, 100);

    return () => {
        cancelAnimationFrame(anim);
        clearInterval(interval);
        resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col h-full glass-panel rounded-sm relative overflow-hidden bg-black group border border-mudde-cyan/30">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-80" />

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col h-full p-4 pointer-events-none">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-2 bg-black/40 backdrop-blur-sm p-2 rounded-t">
              <div>
                  <h3 className="text-mudde-cyan font-mono text-[10px] tracking-[0.2em] font-bold uppercase flex items-center gap-2">
                      <Aperture className="w-4 h-4 text-mudde-cyan animate-spin-slow" />
                      OMNISCIENCE_GATEWAY
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-[7px] text-red-500 font-mono font-bold uppercase">LIVE_INTERCEPT_ACTIVE</span>
                  </div>
              </div>
              <div className="text-right">
                  <div className="text-[7px] text-gray-400 font-mono uppercase">Data Velocity</div>
                  <div className="text-lg font-mono font-bold text-white text-shadow-neon">{ingestRate.toLocaleString()} TB/s</div>
              </div>
          </div>

          {/* Center Target */}
          <div className="flex-1 flex items-center justify-center">
              <div className="w-40 h-40 border border-mudde-cyan/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                  <div className="w-32 h-32 border border-dashed border-mudde-purple/30 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
              </div>
          </div>

          {/* Footer Stats */}
          <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-md p-2 rounded border border-white/5">
              <div className="flex flex-col items-center border-r border-white/10">
                  <Eye className="w-4 h-4 text-mudde-gold mb-1" />
                  <span className="text-[7px] text-gray-500 font-mono uppercase">Global_Vision</span>
                  <span className="text-[9px] text-white font-mono font-bold">100%</span>
              </div>
              <div className="flex flex-col items-center border-r border-white/10">
                  <Database className="w-4 h-4 text-mudde-purple mb-1" />
                  <span className="text-[7px] text-gray-500 font-mono uppercase">Retention</span>
                  <span className="text-[9px] text-white font-mono font-bold">∞ PB</span>
              </div>
              <div className="flex flex-col items-center">
                  <Lock className="w-4 h-4 text-green-500 mb-1" />
                  <span className="text-[7px] text-gray-500 font-mono uppercase">Encryption</span>
                  <span className="text-[9px] text-white font-mono font-bold">Q-PROOF</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default InfinityPortal;
