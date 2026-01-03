
import React from 'react';
import { GrandmasterStrategy } from '../types';
import { Target, GitBranch, ShieldAlert, Swords, BrainCircuit, ArrowRight } from 'lucide-react';

interface StrategicCortexProps {
  strategy: GrandmasterStrategy | null;
  active: boolean;
}

const StrategicCortex: React.FC<StrategicCortexProps> = ({ strategy, active }) => {
  if (!active) return null;

  return (
    <div className="flex flex-col h-full glass-panel rounded-sm relative overflow-hidden bg-[#030305] border border-mudde-purple/30 group transition-all">
       <div className="absolute inset-0 bg-[linear-gradient(rgba(189,0,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(189,0,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none"></div>

       <div className="relative z-10 flex flex-col h-full p-2 md:p-3">
          <div className="flex justify-between items-center mb-2 border-b border-mudde-purple/20 pb-2">
             <div className="flex items-center gap-2">
                 <Swords className="w-4 h-4 text-mudde-purple animate-pulse" />
                 <span className="text-[9px] md:text-[10px] font-mono font-bold text-mudde-purple tracking-widest">STRAT_CORTEX</span>
             </div>
             <span className="text-[7px] md:text-[8px] font-mono text-gray-500 uppercase">DEPTH: {strategy?.depth || 0}</span>
          </div>

          {!strategy ? (
              <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                  <BrainCircuit className="w-6 h-6 md:w-8 md:h-8 text-mudde-purple animate-pulse mb-2" />
                  <span className="text-[8px] font-mono text-mudde-purple">SYNCING_DATA...</span>
              </div>
          ) : (
              <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                  
                  <div className="flex flex-col gap-1 shrink-0">
                      <div className="flex justify-between text-[7px] md:text-[8px] font-mono text-gray-400">
                          <span>BEAR</span>
                          <span className="text-white">EVAL: {strategy.currentEvaluation > 0 ? '+' : ''}{strategy.currentEvaluation}</span>
                          <span>BULL</span>
                      </div>
                      <div className="h-1.5 md:h-2 w-full bg-gray-800 rounded-full overflow-hidden relative">
                          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 z-10"></div>
                          <div 
                              className={`h-full transition-all duration-1000 ${strategy.currentEvaluation >= 0 ? 'bg-green-500 shadow-[0_0_5px_#00ff00]' : 'bg-red-500 shadow-[0_0_5px_#ff0000]'}`}
                              style={{ 
                                  width: `${Math.min(50, Math.abs(strategy.currentEvaluation) * 5)}%`,
                                  marginLeft: strategy.currentEvaluation >= 0 ? '50%' : `calc(50% - ${Math.min(50, Math.abs(strategy.currentEvaluation) * 5)}%)`
                              }}
                          ></div>
                      </div>
                  </div>

                  <div className="bg-red-900/10 border border-red-500/20 p-2 rounded shrink-0 hidden sm:block">
                      <div className="flex items-center gap-2 text-[8px] font-mono text-red-400 mb-1">
                          <Target className="w-3 h-3" /> INTENT_ANALYSIS
                      </div>
                      <p className="text-[8px] md:text-[9px] font-mono text-gray-300 leading-tight italic line-clamp-2">
                          "{strategy.opponentAnalysis}"
                      </p>
                  </div>

                  <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar pr-1">
                      <div className="text-[8px] font-mono text-gray-500 mb-0.5">PREDICTED_BRANCHES</div>
                      {strategy.scenarios.map((scenario, i) => (
                          <div key={i} className="flex items-center justify-between p-1.5 md:p-2 bg-gray-900/40 border border-gray-800 rounded group transition-all">
                               <div className="flex flex-col flex-1 min-w-0">
                                   <div className="flex items-center gap-2">
                                       <span className="text-[8px] md:text-[9px] font-bold text-white truncate">{scenario.name}</span>
                                       <span className={`text-[6px] px-1 rounded ${scenario.outcome === 'PROFIT' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                                           {scenario.outcome}
                                       </span>
                                   </div>
                               </div>
                               <div className="flex items-center gap-2 shrink-0">
                                   <span className="text-[8px] md:text-[9px] font-mono text-mudde-purple">{scenario.probability}%</span>
                               </div>
                          </div>
                      ))}
                  </div>

                  <div className="mt-auto p-2 bg-mudde-purple/10 border border-mudde-purple/50 rounded flex items-center justify-between shrink-0">
                      <span className="text-[8px] font-mono text-mudde-purple font-bold">OPTIMAL</span>
                      <div className="flex items-center gap-2">
                          <span className="text-base md:text-lg font-bold text-white tracking-widest">{strategy.bestMove}</span>
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-mudde-purple animate-pulse" />
                      </div>
                  </div>

              </div>
          )}
       </div>
    </div>
  );
};

export default StrategicCortex;
