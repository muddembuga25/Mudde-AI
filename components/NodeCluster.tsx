import React, { useState, useEffect } from 'react';
import { Network, Server, Share2, Plus, Lock, ShieldCheck, Power } from 'lucide-react';
import { ComputeNode } from '../types';

interface NodeClusterProps {
  nodes: ComputeNode[];
  onAddNode: () => void;
}

const NodeCluster: React.FC<NodeClusterProps> = ({ nodes, onAddNode }) => {
  const [authStage, setAuthStage] = useState(0); // 0: Locked, 1: Scanning, 2: Authorized
  const [blink, setBlink] = useState(false);

  // Blinking effect for cursors/status
  useEffect(() => {
    const interval = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(interval);
  }, []);

  const handleAuthorize = () => {
    setAuthStage(1);
    setTimeout(() => setAuthStage(2), 1500);
  };

  const totalLoad = nodes.reduce((acc, n) => acc + n.load, 0) / (nodes.length || 1);
  const activeNodes = nodes.filter(n => n.status === 'ONLINE').length;

  return (
    <div className="h-full w-full flex flex-col glass-panel p-1 rounded-sm relative overflow-hidden bg-[#020406] border border-mudde-cyan/20">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]"></div>

      <div className="relative z-10 flex flex-col h-full p-3">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-3 border-b border-gray-800 pb-2">
            <div className="flex flex-col">
                <h3 className="text-mudde-cyan font-mono text-[10px] tracking-widest uppercase font-bold flex items-center gap-2">
                    <Network className="w-3 h-3" />
                    HIVE_MIND :: CLUSTER
                </h3>
                <span className="text-[7px] text-gray-500 font-mono">
                   DISTRIBUTED COMPUTE LAYER
                </span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-mono text-white font-bold flex items-center gap-1">
                   <Share2 className="w-3 h-3 text-mudde-cyan" />
                   {activeNodes} / {nodes.length} ACT
               </span>
            </div>
        </div>

        {/* Security / Auth Layer */}
        {authStage < 2 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border border-gray-700 rounded-full flex items-center justify-center relative">
                    <div className={`absolute inset-0 border-t-2 border-mudde-alert rounded-full animate-spin ${authStage === 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                    <Lock className={`w-6 h-6 ${authStage === 0 ? 'text-gray-500' : 'text-mudde-alert'}`} />
                </div>
                
                <div className="text-center space-y-1">
                    <div className="text-[10px] font-mono text-gray-400">ADMIN_PRIVILEGES_REQUIRED</div>
                    {authStage === 1 && <div className="text-[9px] font-mono text-mudde-alert animate-pulse">VERIFYING BIOMETRICS...</div>}
                </div>

                {authStage === 0 && (
                    <button 
                        onClick={handleAuthorize}
                        className="px-4 py-1 bg-mudde-alert/10 border border-mudde-alert/50 text-mudde-alert text-[10px] font-mono hover:bg-mudde-alert/20 transition-all"
                    >
                        AUTHENTICATE_COMMANDER
                    </button>
                )}
            </div>
        ) : (
            <>
                {/* Node List */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {nodes.map((node) => (
                        <div key={node.id} className="bg-gray-900/40 border border-gray-800 p-2 flex items-center justify-between group hover:border-mudde-cyan/30 transition-colors">
                            <div className="flex items-center gap-2">
                                <Server className={`w-3 h-3 ${node.status === 'ONLINE' ? 'text-mudde-cyan' : 'text-gray-600'}`} />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono font-bold text-gray-300">{node.name}</span>
                                    <span className="text-[7px] font-mono text-gray-500">{node.region}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-mono text-gray-400">{node.latency}ms</span>
                                    <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${node.load > 90 ? 'bg-red-500' : 'bg-mudde-cyan'}`} 
                                            style={{ width: `${node.load}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'ONLINE' ? 'bg-mudde-cyan shadow-[0_0_5px_#00f0ff]' : 'bg-gray-700'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Controls */}
                <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-mudde-gold" />
                        <span className="text-[8px] font-mono text-mudde-gold">COMMANDER_AUTH_ACTIVE</span>
                    </div>
                    
                    <button 
                        onClick={onAddNode}
                        className="flex items-center gap-1 px-2 py-1 bg-mudde-cyan/10 border border-mudde-cyan/40 hover:bg-mudde-cyan/20 rounded text-[9px] font-mono text-mudde-cyan transition-all active:scale-95"
                    >
                        <Plus className="w-3 h-3" />
                        DEPLOY_NODE
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default NodeCluster;