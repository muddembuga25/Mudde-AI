
import React, { useEffect, useState } from 'react';
import { Database, Download, CheckCircle2, PlayCircle, Cpu, Wifi, RefreshCw } from 'lucide-react';
import { AIModel } from '../types';

interface ModelRegistryProps {
  models: AIModel[];
  onDownload: (id: string) => void;
  onMount: (id: string) => void;
  activeModelId: string;
}

const ModelRegistry: React.FC<ModelRegistryProps> = ({ models, onDownload, onMount, activeModelId }) => {
  const [lossData, setLossData] = useState<number[]>([]);
  
  // Simulate continuous fine-tuning loss graph
  useEffect(() => {
    const interval = setInterval(() => {
      setLossData(prev => {
        const last = prev[prev.length - 1] || 1.5;
        // Random walk downwards (simulating improvement)
        const next = Math.max(0.001, last + (Math.random() - 0.6) * 0.05);
        return [...prev, next].slice(-20);
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const activeModel = models.find(m => m.id === activeModelId);

  return (
    <div className="flex flex-col h-full glass-panel rounded-sm p-3 relative overflow-hidden group border border-gray-800 bg-black/60">
      
      {/* Background Tech */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:15px_15px]"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-gray-800/50 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-mudde-cyan" />
          <span className="text-[10px] font-mono font-bold text-mudde-cyan tracking-widest uppercase">
            MUDDE_KERNEL_MGR
          </span>
        </div>
        <div className="flex items-center gap-2">
             <div className="flex items-center gap-1">
                 <RefreshCw className="w-3 h-3 text-mudde-gold animate-spin-slow" />
                 <span className="text-[8px] font-mono text-gray-400">AUTO_TUNING</span>
             </div>
        </div>
      </div>

      {/* Active Kernel Info Area */}
      {activeModel && (
          <div className="relative z-10 bg-mudde-cyan/5 border border-mudde-cyan/20 p-2 rounded mb-3 flex justify-between items-center">
              <div>
                  <div className="text-[8px] text-gray-500 font-mono">MOUNTED_INTELLIGENCE</div>
                  <div className="text-sm font-bold font-mono text-mudde-cyan">{activeModel.name}</div>
                  <div className="text-[9px] text-gray-400 font-mono">{activeModel.paramCount} PARAMS // {activeModel.arch}</div>
              </div>
              <div className="flex flex-col items-end">
                  <div className="text-[8px] text-gray-500 font-mono">OPTIMIZATION_LOSS</div>
                  <div className="text-xs font-mono text-mudde-gold font-bold">
                      {activeModel.fineTuneLoss.toFixed(5)}
                  </div>
                  {/* Mini Graph */}
                  <div className="flex items-end h-4 gap-0.5 mt-1">
                      {lossData.map((val, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-mudde-gold/50 rounded-t-sm" 
                            style={{ height: `${Math.min(100, val * 10)}%`}}
                          ></div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Model List */}
      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {models.map((model) => {
            const isActive = model.id === activeModelId;
            const isReady = model.status === 'READY';
            const isDownloading = model.status === 'DOWNLOADING';
            const isCloud = model.status === 'CLOUD';

            return (
                <div 
                    key={model.id}
                    className={`relative p-2 rounded border transition-all duration-300 ${
                        isActive 
                        ? 'bg-mudde-cyan/10 border-mudde-cyan/50' 
                        : 'bg-gray-900/30 border-gray-800 hover:border-gray-600'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            {isActive ? (
                                <Cpu className="w-4 h-4 text-mudde-cyan animate-pulse" />
                            ) : (
                                <Wifi className={`w-4 h-4 ${isCloud ? 'text-gray-600' : 'text-green-500'}`} />
                            )}
                            <div>
                                <div className={`text-[10px] font-bold font-mono ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                    {model.name}
                                </div>
                                <div className="text-[8px] text-gray-600 font-mono">{model.size} • {model.description}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center">
                            {isActive && (
                                <span className="text-[8px] font-mono text-mudde-cyan border border-mudde-cyan/30 px-1 rounded bg-black/50">
                                    MOUNTED
                                </span>
                            )}
                            
                            {isReady && !isActive && (
                                <button 
                                    onClick={() => onMount(model.id)}
                                    className="p-1 hover:text-mudde-cyan text-gray-400 transition-colors"
                                    title="Mount Kernel"
                                >
                                    <PlayCircle className="w-4 h-4" />
                                </button>
                            )}

                            {isCloud && (
                                <button 
                                    onClick={() => onDownload(model.id)}
                                    className="p-1 hover:text-white text-gray-500 transition-colors"
                                    title="Download from Hub"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar for Downloading */}
                    {isDownloading && (
                        <div className="mt-2">
                             <div className="flex justify-between text-[8px] font-mono text-mudde-cyan mb-0.5">
                                 <span>DOWNLOADING_WEIGHTS...</span>
                                 <span>{model.downloadProgress}%</span>
                             </div>
                             <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-mudde-cyan transition-all duration-300"
                                    style={{ width: `${model.downloadProgress}%` }}
                                 ></div>
                             </div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 mt-auto pt-2 border-t border-gray-800/50 flex justify-between items-center text-[8px] font-mono text-gray-500">
          <span>REPO: HUGGINGFACE/MUDDE_MIRROR</span>
          <span className="text-mudde-gold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              FINETUNE_ACTIVE
          </span>
      </div>
      
    </div>
  );
};

export default ModelRegistry;