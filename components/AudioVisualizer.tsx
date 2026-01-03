
import React, { useEffect, useRef } from 'react';
import { LiveSessionManager } from '../services/geminiService';

interface AudioVisualizerProps {
  liveManager: LiveSessionManager | null;
  active: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ liveManager, active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!active) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const { input, output } = liveManager ? liveManager.getAudioLevels() : { input: 0, output: 0 };
      
      const baseRadius = 15;
      const maxExtra = 25;
      
      // --- INPUT VISUALIZATION (Commander - Cyan) ---
      const inputRadius = baseRadius + (input * maxExtra);
      ctx.shadowBlur = 10 * input;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, inputRadius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(0, 240, 255, ${0.1 + input * 0.5})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 + input * 0.7})`;
      ctx.lineWidth = 1 + input * 2;
      ctx.stroke();

      // --- OUTPUT VISUALIZATION (MUDDE - Gold) ---
      const outputRadius = baseRadius + 8 + (output * maxExtra * 1.5);
      ctx.shadowBlur = 15 * output;
      ctx.shadowColor = '#ffd700';
      ctx.beginPath();
      ctx.arc(centerX, centerY, outputRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.4 + output * 0.6})`;
      ctx.lineWidth = 2 + (output * 4);
      ctx.stroke();

      // Particle rings for speech
      if (output > 0.1) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, outputRadius + 5, 0, 2 * Math.PI);
          ctx.setLineDash([2, 4]);
          ctx.strokeStyle = `rgba(255, 215, 0, 0.2)`;
          ctx.stroke();
          ctx.setLineDash([]);
      }

      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, liveManager]);

  return (
    <div className={`transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
        <canvas ref={canvasRef} width={120} height={80} className="w-[120px] h-[80px]" />
    </div>
  );
};

export default AudioVisualizer;
