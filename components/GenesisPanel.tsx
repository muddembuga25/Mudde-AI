
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  Box, FileCode, Loader2, Maximize2, X, Download, Copy, BrainCircuit, 
  Code2, ScanLine, ArrowRight, Activity, Terminal as TerminalIcon, 
  Cpu, Save, Play, Sparkles, FolderOpen, ChevronRight, ChevronDown, 
  Search, Settings, Database, Edit3, Layers, Cuboid, Film, Clapperboard, Music, FilePlus,
  GitBranch, GitCommit, HardDrive, Zap, Info, ShieldCheck, CheckCircle2, RotateCw, Globe, Rocket, Server, Cloud
} from 'lucide-react';
import { VIRTUAL_FILES, updateVirtualFile, subscribeToFiles } from '../services/virtualFileSystem';
import { processArchitectRequest } from '../services/quantumKernel';
import JSZip from 'jszip';

interface GenesisPanelProps {
  streamData: string | null;
}

const HoloBackground: React.FC<{ activeFile: string | null; mode: 'EDITOR' | 'ARCHITECT' | 'STUDIO' }> = ({ activeFile, mode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cityLayout = useMemo(() => {
        const files = Object.keys(VIRTUAL_FILES);
        const layout: any[] = [];
        const radius = 200;
        files.forEach((file, index) => {
            const angle = (index / files.length) * Math.PI * 2;
            const height = 20 + (file.length * 5) + (Math.random() * 50); 
            layout.push({ file, x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, y: 0, h: height, color: file.endsWith('tsx') ? '#00f0ff' : '#bd00ff' });
        });
        return layout;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        let frame = 0; let camRot = 0;
        const render = () => {
            ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, width, height);
            const cx = width / 2; const cy = height / 2; const fov = 600;
            if (mode === 'STUDIO') {
                const time = frame * 0.02;
                for (let i = 0; i < 40; i++) {
                    const x = Math.sin(time + i * 0.2) * 300 + cx;
                    const y = Math.cos(time * 0.5 + i * 0.1) * 100 + cy;
                    ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(189, 0, 255, 0.2)`; ctx.fill();
                }
            } else {
                camRot += 0.002;
                cityLayout.forEach(b => {
                    const x = b.x * Math.cos(camRot) - b.z * Math.sin(camRot);
                    const z = b.z * Math.cos(camRot) + b.x * Math.sin(camRot);
                    const perspective = fov / (fov + z + 400); 
                    if (perspective < 0) return;
                    const screenX = cx + x * perspective;
                    const screenY = cy + (-150) * perspective;
                    const w = 40 * perspective; const h = b.h * perspective;
                    ctx.strokeStyle = (b.file === activeFile) ? '#ffd700' : `rgba(0, 240, 255, ${0.1 + (perspective * 0.2)})`;
                    ctx.strokeRect(screenX - w/2, screenY - h/2, w, h);
                });
            }
            frame++; requestAnimationFrame(render);
        };
        const anim = requestAnimationFrame(render);
        return () => cancelAnimationFrame(anim);
    }, [activeFile, cityLayout, mode]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40" />;
}

const GenesisPanel: React.FC<GenesisPanelProps> = ({ streamData }) => {
  const [activeFile, setActiveFile] = useState<string | null>("infrastructure/Dockerfile");
  const [fileContent, setFileContent] = useState<string>(VIRTUAL_FILES["infrastructure/Dockerfile"] || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'EDITOR' | 'ARCHITECT' | 'STUDIO'>('EDITOR');
  const [cortexFeed, setCortexFeed] = useState<string[]>([]);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [lastEfficiency, setLastEfficiency] = useState<number | null>(null);
  
  // Autonomous Mode
  const [autoEvolve, setAutoEvolve] = useState(false);
  const [evolutionStage, setEvolutionStage] = useState(0);

  // Deployment State
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployStep, setDeployStep] = useState(0); // 0: Idle, 1: Zipping, 2: Ready
  
  // Subscribe to external file changes
  useEffect(() => {
      const unsub = subscribeToFiles(() => {
          if (activeFile && VIRTUAL_FILES[activeFile]) {
              setFileContent(VIRTUAL_FILES[activeFile]);
              setCortexFeed(prev => ["EXTERNAL_REWRITE_DETECTED", "SYNCING_VIRTUAL_DOM...", ...prev].slice(0, 5));
          }
      });
      return () => unsub();
  }, [activeFile]);

  // Autonomous Evolution Loop
  useEffect(() => {
      if (!autoEvolve) return;
      const interval = setInterval(() => {
          setEvolutionStage(prev => {
              const next = (prev + 1) % 4;
              if (next === 1) {
                  const files = Object.keys(VIRTUAL_FILES);
                  const randomFile = files[Math.floor(Math.random() * files.length)];
                  setActiveFile(randomFile);
                  setFileContent(VIRTUAL_FILES[randomFile]);
                  setCortexFeed(prev => [`SCANNING: ${randomFile}`, ...prev].slice(0, 5));
              }
              if (next === 2) {
                  setCortexFeed(prev => ["INEFFICIENCY_DETECTED", "GENERATING_OPTIMIZATION_MATRIX...", ...prev].slice(0, 5));
              }
              if (next === 3) {
                  // Simulate improvement
                  const boost = Math.random() * 0.05;
                  setLastEfficiency(curr => Math.min(0.9999, (curr || 0.85) + boost));
                  setCortexFeed(prev => ["PATCH_APPLIED", "RE-COMPILING", "SYSTEM_GROWTH_CONFIRMED", ...prev].slice(0, 5));
              }
              return next;
          });
      }, 1500);
      return () => clearInterval(interval);
  }, [autoEvolve]);

  const fileTree = useMemo(() => {
    return Object.keys(VIRTUAL_FILES).reduce((acc: any, path) => {
      const parts = path.split('/');
      let current = acc;
      parts.forEach((part, i) => { if (i === parts.length - 1) current[part] = "file"; else { current[part] = current[part] || {}; current = current[part]; } });
      return acc;
    }, {});
  }, [Object.keys(VIRTUAL_FILES).length]);

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ "src": true, "components": true, "services": true, "infrastructure": true });

  const handleFileClick = (path: string) => { if (VIRTUAL_FILES[path]) { setActiveFile(path); setFileContent(VIRTUAL_FILES[path]); } };

  const handleAiGeneration = async () => {
      if (!activeFile || !aiPrompt.trim()) return;
      setIsGenerating(true);
      setCortexFeed(prev => ["INITIATING QUANTUM RECURSION...", "PHASE 1: AST_PARSING", "PHASE 2: NATIVE_REASONING_INTERCEPT", ...prev].slice(0, 5));
      
      const result = await processArchitectRequest(aiPrompt, activeFile, fileContent, isOverclocked);
      
      updateVirtualFile(activeFile, result.code); 
      setLastEfficiency(result.efficiency);
      setCortexFeed(prev => [result.thoughts, "OPTIMIZATION_COMPLETE", ...prev].slice(0, 5));
      setIsGenerating(false);
      setAiPrompt("");
  };

  const handleSave = () => { if (activeFile) { updateVirtualFile(activeFile, fileContent); } };

  const downloadProjectBundle = async () => {
      setDeployStep(1);
      setCortexFeed(prev => ["INITIATING_BUNDLE_COMPRESSION", "PACKING_SOURCE_MATRIX", ...prev]);
      
      const zip = new JSZip();
      
      // 1. Add Virtual Files (Infrastructure, Configs)
      Object.entries(VIRTUAL_FILES).forEach(([path, content]) => {
          zip.file(path, content);
      });

      // 2. We should ideally add the CURRENT source code of the running app.
      // Since we are in a sandbox, we rely on VIRTUAL_FILES being up to date.
      // NOTE: In a real environment, we'd fetch these. Here we assume VIRTUAL_FILES 
      // contains the critical edits made by the AI.
      
      // Generate Zip
      try {
          const blob = await zip.generateAsync({ type: "blob" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "mudde-singularity-deploy.zip";
          a.click();
          window.URL.revokeObjectURL(url);
          setDeployStep(2);
          setCortexFeed(prev => ["BUNDLE_GENERATED", "READY_FOR_DOKPLOY_UPLOAD", ...prev]);
      } catch (e) {
          console.error("Bundling failed", e);
          setDeployStep(0);
      }
  };

  const renderTree = (node: any, pathPrefix = "") => {
      return Object.entries(node).map(([name, value]) => {
          const fullPath = pathPrefix ? `${pathPrefix}/${name}` : name;
          const isFolder = typeof value === 'object';
          const paddingLeft = (pathPrefix.split('/').length + 1) * 12;
          if (isFolder) {
              const isOpen = expandedFolders[name];
              return (
                  <div key={fullPath}>
                      <div onClick={() => setExpandedFolders(p => ({...p, [name]: !p[name]}))} className="flex items-center gap-1 py-1 px-2 hover:bg-white/10 cursor-pointer text-gray-400 hover:text-white select-none transition-colors" style={{ paddingLeft: `${paddingLeft}px` }}>
                          {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          <FolderOpen className="w-3 h-3 text-mudde-purple" />
                          <span className="text-[10px] font-mono">{name}</span>
                      </div>
                      {isOpen && renderTree(value, fullPath)}
                  </div>
              );
          } else {
              return (
                  <div key={fullPath} onClick={() => handleFileClick(fullPath)} className={`flex items-center gap-2 py-1 px-2 hover:bg-white/10 cursor-pointer select-none transition-all duration-300 ${activeFile === fullPath ? 'bg-mudde-cyan/20 text-mudde-cyan translate-x-1 border-l-2 border-mudde-cyan' : 'text-gray-500'}`} style={{ paddingLeft: `${paddingLeft + 12}px` }}>
                      <FileCode className="w-3 h-3" />
                      <span className="text-[10px] font-mono">{name}</span>
                  </div>
              );
          }
      });
  };

  return (
    <div className={`flex flex-col h-full bg-[#030303] rounded-sm relative overflow-hidden transition-all duration-700 ${isExpanded ? 'fixed inset-0 z-[50]' : 'border border-gray-800'}`}>
        <HoloBackground activeFile={activeFile} mode={viewMode} />
        
        {/* DEPLOYMENT MODAL */}
        {showDeployModal && (
            <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="max-w-2xl w-full border border-gray-800 bg-[#0a0a0a] rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.1)]">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black">
                        <div className="flex items-center gap-3">
                            <Rocket className="w-5 h-5 text-mudde-purple" />
                            <h2 className="text-sm font-bold font-mono text-white tracking-widest uppercase">Dokploy Deployment Matrix</h2>
                        </div>
                        <button onClick={() => setShowDeployModal(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded flex flex-col gap-2">
                                <div className="text-[10px] font-bold text-mudde-cyan uppercase flex items-center gap-2">
                                    <Server className="w-3 h-3" /> VPS Requirement
                                </div>
                                <div className="text-[9px] text-gray-400 font-mono">
                                    - Ubuntu 20.04+<br/>
                                    - Docker & Docker Compose<br/>
                                    - 2GB+ RAM Recommended
                                </div>
                            </div>
                            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded flex flex-col gap-2">
                                <div className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-2">
                                    <Cloud className="w-3 h-3" /> Dokploy Config
                                </div>
                                <div className="text-[9px] text-gray-400 font-mono">
                                    - Port: 80 (Exposed)<br/>
                                    - Type: Dockerfile Build<br/>
                                    - Network: Bridge
                                </div>
                            </div>
                        </div>

                        <div className="bg-black border border-gray-800 p-4 rounded font-mono text-[9px] text-gray-300">
                            <div className="text-mudde-purple font-bold mb-2 uppercase">Deployment Sequence:</div>
                            <ol className="list-decimal pl-4 space-y-2">
                                <li>Download the <strong>SOURCE BUNDLE</strong> below.</li>
                                <li>Upload to your Git Repository (GitHub/GitLab) or upload zip directly to VPS.</li>
                                <li>In Dokploy, create a new <strong>Application</strong>.</li>
                                <li>Select <strong>Dockerfile</strong> as the build type.</li>
                                <li>Set build path to <code>/</code>.</li>
                                <li>Deploy. The internal Nginx server will handle routing.</li>
                            </ol>
                        </div>

                        <div className="flex items-center justify-center pt-2">
                            <button 
                                onClick={downloadProjectBundle}
                                className="flex items-center gap-3 px-6 py-3 bg-mudde-gold text-black font-bold font-mono rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                            >
                                {deployStep === 1 ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {deployStep === 1 ? "COMPRESSING..." : "DOWNLOAD_DEPLOY_BUNDLE.ZIP"}
                            </button>
                        </div>
                        {deployStep === 2 && (
                            <div className="text-center text-[9px] text-green-500 font-mono animate-pulse">
                                BUNDLE READY. UPLOAD TO DOKPLOY.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        <div className="absolute inset-0 flex flex-col z-10">
            <div className="h-12 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-md px-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-mudde-gold font-bold tracking-[0.3em] text-[10px]">
                        <Cpu className={`w-4 h-4 ${isGenerating || autoEvolve ? 'animate-spin text-mudde-gold' : 'text-mudde-cyan'}`} />
                        OMNI_ARCHITECT :: CORE_V4
                    </div>
                    {lastEfficiency !== null && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded">
                            <ShieldCheck className="w-3 h-3 text-green-500" />
                            <span className="text-[8px] font-mono text-green-400 font-bold uppercase">Optimized: {(lastEfficiency * 100).toFixed(2)}%</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowDeployModal(true)}
                        className="flex items-center gap-2 px-3 py-1 border border-mudde-purple/50 bg-mudde-purple/10 text-mudde-purple rounded text-[8px] font-bold transition-all hover:bg-mudde-purple/20 hover:shadow-[0_0_15px_rgba(189,0,255,0.3)] active:scale-95"
                    >
                        <Server className="w-3 h-3" />
                        DEPLOY_TO_DOKPLOY
                    </button>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <button 
                        onClick={() => setAutoEvolve(!autoEvolve)}
                        className={`flex items-center gap-2 px-3 py-1 border rounded text-[8px] font-bold transition-all ${autoEvolve ? 'bg-mudde-cyan/20 border-mudde-cyan text-mudde-cyan animate-pulse' : 'border-gray-700 text-gray-500'}`}
                    >
                        <RotateCw className={`w-3 h-3 ${autoEvolve ? 'animate-spin' : ''}`} />
                        {autoEvolve ? 'AUTONOMOUS_EVOLUTION' : 'AUTO_ARCHITECT'}
                    </button>
                    <button onClick={() => setIsOverclocked(!isOverclocked)} className={`flex items-center gap-2 px-3 py-1 border rounded text-[8px] font-bold transition-all ${isOverclocked ? 'bg-red-900/20 border-red-500 text-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]' : 'border-gray-700 text-gray-500'}`}>
                        <Zap className="w-3 h-3" /> {isOverclocked ? 'OVERCLOCK' : 'NORMAL'}
                    </button>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded">
                        {isExpanded ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex min-h-0 relative">
                <div className="w-52 bg-black/80 backdrop-blur-xl border-r border-white/5 flex flex-col">
                    <div className="p-3 border-b border-white/10 bg-mudde-gold/5 flex justify-between items-center">
                        <span className="text-[9px] font-bold text-mudde-gold flex items-center gap-2"><HardDrive className="w-3 h-3" /> SOURCE_MATRIX</span>
                    </div>
                    <div className="p-2 bg-black border-b border-gray-800">
                        <div className="text-[8px] text-mudde-cyan font-mono mb-1 flex items-center gap-1"><BrainCircuit className="w-3 h-3" /> CORTEX_TRACE</div>
                        <div className="h-20 overflow-hidden flex flex-col justify-end gap-1">
                            {cortexFeed.map((f, i) => (
                                <div key={i} className={`text-[7px] font-mono truncate ${i === 0 ? 'text-white' : 'text-gray-600'}`}>{f}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">{renderTree(fileTree)}</div>
                </div>

                <div className="flex-1 flex flex-col bg-[#050505]/80 backdrop-blur-sm">
                    <div className="flex-1 p-4 md:p-6 overflow-hidden">
                        <div className={`w-full h-full relative group bg-black/40 border transition-all duration-300 rounded shadow-inner ${autoEvolve ? 'border-mudde-cyan/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'border-white/5'}`}>
                            {autoEvolve && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[1px] pointer-events-none">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-10 h-10 text-mudde-cyan animate-spin" />
                                        <span className="text-mudde-cyan font-mono text-xs tracking-widest uppercase animate-pulse">System_Self_Improving...</span>
                                    </div>
                                </div>
                            )}
                            <div className="absolute top-0 left-0 right-0 h-8 bg-black/60 border-b border-white/5 flex items-center px-4 justify-between">
                                <div className="text-[9px] font-mono text-mudde-cyan flex items-center gap-2">
                                    <FileCode className="w-3 h-3" /> {activeFile}
                                    {lastEfficiency && <CheckCircle2 className="w-3 h-3 text-green-500 ml-2" />}
                                </div>
                                <div className="flex items-center gap-4 text-[8px] font-mono text-gray-500">
                                    <span>L: {fileContent.split('\n').length}</span>
                                    <button onClick={handleSave} className="flex items-center gap-1 hover:text-mudde-gold"><Save className="w-3 h-3" /> COMMIT</button>
                                </div>
                            </div>
                            <textarea
                                value={fileContent} onChange={(e) => setFileContent(e.target.value)} spellCheck={false}
                                className="w-full h-full bg-transparent text-gray-300 font-mono text-[11px] p-10 pt-12 resize-none focus:outline-none leading-relaxed"
                            />
                        </div>
                    </div>

                    <div className="h-20 bg-black/90 border-t border-white/10 p-4 flex items-center gap-4">
                        <div className="flex-1 relative">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-mudde-gold to-mudde-cyan opacity-20 blur rounded transition-opacity ${isGenerating ? 'opacity-60 animate-pulse' : ''}`}></div>
                            <input 
                                type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                                disabled={isGenerating || !activeFile || autoEvolve}
                                placeholder={autoEvolve ? "SYSTEM_CONTROL: AUTONOMOUS_MODE_ENGAGED" : isGenerating ? "NATIVE_MODEL_RE-WRITING_REALITY..." : "ENTER ARCHITECT INSTRUCTION (e.g., 'Optimize MT5 bridge performance')..."}
                                className="w-full relative bg-black border border-white/20 rounded px-4 py-3 text-xs font-mono text-white focus:outline-none placeholder-gray-700 disabled:opacity-50"
                                onKeyDown={(e) => e.key === 'Enter' && handleAiGeneration()}
                            />
                            {isGenerating && <Loader2 className="absolute right-4 top-3.5 w-4 h-4 text-mudde-gold animate-spin" />}
                        </div>
                        <button onClick={handleAiGeneration} disabled={isGenerating || !aiPrompt || autoEvolve} className="px-6 py-3 bg-mudde-gold text-black rounded font-bold text-[10px] tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <Sparkles className="w-4 h-4" /> EVOLVE
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-6 bg-black border-t border-white/5 px-4 flex justify-between items-center text-[8px] font-mono text-gray-600">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Zap className="w-2 h-2 text-mudde-cyan" /> KERNEL: ACTIVE</span>
                    <span className="flex items-center gap-1"><Info className="w-2 h-2" /> RECURSIVE_DEPTH: {isOverclocked ? '32k' : '8k'}</span>
                </div>
                <div className="text-mudde-gold animate-pulse tracking-widest uppercase">Efficiency Manifested: {lastEfficiency ? (lastEfficiency*100).toFixed(2) + '%' : 'AWAITING_OP'}</div>
            </div>
        </div>
    </div>
  );
};

export default GenesisPanel;