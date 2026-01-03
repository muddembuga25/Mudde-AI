import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Box, Maximize, Cpu, Wind, Hexagon, Aperture, Globe, Orbit, Dna, Zap, Trophy, Sparkles, Sliders, Activity } from 'lucide-react';

interface RealityEngineProps {
  active: boolean;
  simulationType?: 'COSMOS' | 'TERRA_GENESIS' | 'QUANTUM_LATTICE' | 'BIO_SWARM' | 'WEALTH_SINGULARITY' | 'VERIFIED_OMNISCIENCE' | 'SINGULARITY';
}

const RealityEngine: React.FC<RealityEngineProps> = ({ active, simulationType = 'WEALTH_SINGULARITY' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const requestRef = useRef<number>(0);
  
  const timeDilationRef = useRef(0.3);
  const dimensionalityRef = useRef(0.5);
  const simTypeRef = useRef(simulationType);
  const objectsRef = useRef<any>({});

  const [timeDilation, setTimeDilation] = useState(0.3);
  const [dimensionality, setDimensionality] = useState(0.5);
  const [stats, setStats] = useState({ polygons: 0, fps: 0 });

  useEffect(() => { timeDilationRef.current = timeDilation; }, [timeDilation]);
  useEffect(() => { dimensionalityRef.current = dimensionality; }, [dimensionality]);
  useEffect(() => { simTypeRef.current = simulationType; }, [simulationType]);

  const cleanScene = useCallback(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.traverse((object) => {
          if ((object as any).isMesh) {
              (object as any).geometry.dispose();
              if (Array.isArray((object as any).material)) {
                  (object as any).material.forEach((m: any) => m.dispose());
              } else {
                  (object as any).material.dispose();
              }
          }
      });
      scene.clear();
      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      scene.add(ambientLight);
      const sunLight = new THREE.DirectionalLight(0xffffff, 2);
      sunLight.position.set(20, 20, 20);
      scene.add(sunLight);
      
      // Add a subtle grid helper
      const gridHelper = new THREE.GridHelper(50, 50, 0x333333, 0x111111);
      scene.add(gridHelper);
      
      objectsRef.current = {};
  }, []);

  const buildScene = useCallback((type: string) => {
      const scene = sceneRef.current;
      if (!scene) return;
      cleanScene();
      
      if (type === 'SINGULARITY') {
          // The Ultimate Intelligence Visualization
          const geometry = new THREE.TorusKnotGeometry(8, 2, 120, 32);
          const material = new THREE.MeshStandardMaterial({ 
              color: 0xbd00ff, 
              emissive: 0xbd00ff, 
              emissiveIntensity: 0.5,
              wireframe: true,
              transparent: true,
              opacity: 0.4
          });
          const knot = new THREE.Mesh(geometry, material);
          scene.add(knot);

          const coreGeo = new THREE.SphereGeometry(3, 64, 64);
          const coreMat = new THREE.MeshStandardMaterial({ 
              color: 0xffffff, 
              emissive: 0xffffff, 
              emissiveIntensity: 10,
              transparent: true,
              opacity: 0.9
          });
          const core = new THREE.Mesh(coreGeo, coreMat);
          scene.add(core);

          // Particle field around core
          const particlesCount = 800;
          const pGeo = new THREE.BufferGeometry();
          const pPos = new Float32Array(particlesCount * 3);
          for(let i=0; i<particlesCount * 3; i++) {
              pPos[i] = (Math.random() - 0.5) * 60;
          }
          pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
          const pMat = new THREE.PointsMaterial({ color: 0xffd700, size: 0.2, transparent: true, opacity: 0.8 });
          const points = new THREE.Points(pGeo, pMat);
          scene.add(points);

          objectsRef.current.knot = knot;
          objectsRef.current.core = core;
          objectsRef.current.points = points;

      } else if (type === 'WEALTH_SINGULARITY') {
          const count = 1000;
          const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
          const material = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.6 });
          const mesh = new THREE.InstancedMesh(geometry, material, count);
          const dummy = new THREE.Object3D();
          
          // Initial layout
          for(let i=0; i<count; i++) {
              dummy.position.set(0,0,0);
              dummy.updateMatrix();
              mesh.setMatrixAt(i, dummy.matrix);
          }
          scene.add(mesh);
          
          const coreGeo = new THREE.SphereGeometry(2, 32, 32);
          const coreMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 1, wireframe: true });
          const core = new THREE.Mesh(coreGeo, coreMat);
          scene.add(core);
          
          objectsRef.current.mesh = mesh;
          objectsRef.current.core = core;
          objectsRef.current.dummy = dummy;
      } else if (type === 'VERIFIED_OMNISCIENCE') {
          const coreGeo = new THREE.IcosahedronGeometry(4, 2);
          const coreMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.5, wireframe: true, transparent: true, opacity: 0.8 });
          const core = new THREE.Mesh(coreGeo, coreMat);
          scene.add(core);
          
          const innerGeo = new THREE.SphereGeometry(2, 32, 32);
          const innerMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 2 });
          const inner = new THREE.Mesh(innerGeo, innerMat);
          scene.add(inner);
          
          const ringGeo = new THREE.TorusGeometry(8, 0.1, 16, 100);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          scene.add(ring);
          
          objectsRef.current.core = core;
          objectsRef.current.inner = inner;
          objectsRef.current.ring = ring;
      } else {
          // Default fallback
          const geometry = new THREE.BoxGeometry(10, 10, 10);
          const material = new THREE.MeshStandardMaterial({ color: 0x00f0ff, wireframe: true });
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
          objectsRef.current.main = mesh;
      }
  }, [cleanScene]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial Setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    
    // Initial build
    buildScene(simulationType);

    // Resize Handler
    const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const animate = (time: number) => {
        requestRef.current = requestAnimationFrame(animate);
        const dt = timeDilationRef.current;
        const dim = dimensionalityRef.current;
        const seconds = time * 0.001;
        const type = simTypeRef.current;
        
        // Camera movement based on dimensionality
        if (cameraRef.current) {
            const radius = 30 - (dim * 10); // Zoom in as dimensionality increases
            cameraRef.current.position.x = Math.sin(seconds * 0.2) * (radius * 0.2);
            cameraRef.current.position.y = Math.cos(seconds * 0.1) * (radius * 0.2);
            cameraRef.current.position.z = radius;
            cameraRef.current.lookAt(0, 0, 0);
        }

        if (type === 'SINGULARITY') {
            const knot = objectsRef.current.knot;
            const core = objectsRef.current.core;
            const points = objectsRef.current.points;
            if (knot) {
                knot.rotation.x += 0.5 * dt;
                knot.rotation.y += 0.8 * dt;
                knot.scale.setScalar(1 + Math.sin(seconds) * 0.1 + (dim * 0.5));
            }
            if (core) {
                core.scale.setScalar(1 + Math.cos(seconds * 5) * 0.1);
            }
            if (points) {
                points.rotation.y += 0.1 * dt;
                points.rotation.z += 0.05 * dt;
            }
        } else if (type === 'WEALTH_SINGULARITY') {
            const mesh = objectsRef.current.mesh;
            const core = objectsRef.current.core;
            const dummy = objectsRef.current.dummy;
            if (mesh && core && dummy) {
                core.rotation.y += 0.1 * dt;
                core.scale.setScalar(1 + Math.sin(seconds * 4) * 0.1);
                
                // Vortex effect
                for(let i=0; i<1000; i++) {
                    const angle = seconds + (i * 0.05) + (dim * 10);
                    const radius = 10 + Math.sin(seconds * 0.5 + i) * 5 * dim;
                    const y = Math.cos(angle * 0.5) * 5 * dim;
                    
                    dummy.position.set(
                        Math.cos(angle) * radius,
                        y,
                        Math.sin(angle) * radius
                    );
                    dummy.rotation.x = angle;
                    dummy.rotation.y = angle;
                    dummy.scale.setScalar(0.5 + Math.sin(i + seconds) * 0.5);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                }
                mesh.instanceMatrix.needsUpdate = true;
            }
        } else if (type === 'VERIFIED_OMNISCIENCE') {
            const core = objectsRef.current.core;
            const ring = objectsRef.current.ring;
            if (core) { 
                core.rotation.x += 1.0 * dt; 
                core.rotation.y += 0.5 * dt; 
            }
            if (ring) { 
                ring.rotation.x = (Math.PI / 2) + Math.sin(seconds); 
                ring.rotation.z += 0.5 * dt; 
                ring.scale.setScalar(1 + Math.sin(seconds * 5) * 0.05 * dim); 
            }
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            // Update stats occasionally
            if (Math.floor(time) % 60 === 0) setStats({ polygons: rendererRef.current.info.render.triangles, fps: 60 });
        }
    };
    requestRef.current = requestAnimationFrame(animate);
    
    return () => { 
        cancelAnimationFrame(requestRef.current); 
        window.removeEventListener('resize', handleResize);
        cleanScene(); 
        if (rendererRef.current) {
            rendererRef.current.dispose();
            rendererRef.current.forceContextLoss();
        }
    };
  }, []);

  useEffect(() => { buildScene(simulationType); }, [simulationType, buildScene]);

  return (
    <div className="h-full w-full flex flex-col glass-panel p-1 rounded-sm relative overflow-hidden bg-[#000000] border border-mudde-cyan/40 shadow-[0_0_30px_rgba(0,240,255,0.05)] group">
        {/* Overlay UI */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 pointer-events-none">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-mudde-cyan font-mono text-[10px] tracking-[0.2em] uppercase font-bold flex items-center gap-2 bg-black/40 px-2 py-1 rounded backdrop-blur border border-mudde-cyan/20">
                        {simulationType === 'SINGULARITY' ? <Sparkles className="w-4 h-4 text-mudde-purple animate-ping" /> : <Trophy className="w-4 h-4 text-mudde-gold animate-bounce" />}
                        {simulationType === 'SINGULARITY' ? 'OMNI_SINGULARITY_MAX' : 'REALITY_MANIFEST_v4'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                         <div className={`px-2 py-0.5 border text-[7px] font-mono uppercase rounded flex items-center gap-1 ${simulationType === 'SINGULARITY' ? 'bg-mudde-purple/10 border-mudde-purple text-mudde-purple' : 'bg-mudde-cyan/10 border-mudde-cyan/50 text-mudde-cyan'}`}>
                            <Activity className="w-2 h-2 animate-pulse" />
                            {simulationType === 'SINGULARITY' ? 'SINGULARITY_LOCKED' : 'STABLE'}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end bg-black/60 p-1.5 rounded border border-gray-800 backdrop-blur">
                    <span className="text-[7px] font-mono text-gray-500 uppercase">MESH_DENSITY</span>
                    <span className="text-[10px] font-mono text-mudde-gold font-bold tracking-wider">{stats.polygons.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 pointer-events-auto items-end">
                <div className="bg-black/80 backdrop-blur border border-gray-800 p-2 rounded w-full max-w-[200px] hover:border-mudde-cyan/50 transition-colors">
                    <div className="flex justify-between text-[7px] font-mono text-gray-400 mb-1 uppercase items-center">
                        <span className="flex items-center gap-1"><Sliders className="w-3 h-3" /> Flux_Intercept</span>
                        <span className="text-mudde-cyan font-bold">{(dimensionality * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="1" step="0.01" 
                        value={dimensionality} onChange={(e) => setDimensionality(parseFloat(e.target.value))} 
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-1 accent-mudde-cyan" 
                    />
                </div>
            </div>
        </div>

        {/* Scanline Overlay */}
        <div className="absolute top-0 left-0 w-full h-1 bg-mudde-purple/40 shadow-[0_0_15px_#bd00ff] animate-scanline z-10 opacity-30 pointer-events-none"></div>

        {/* 3D Container */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />
    </div>
  );
};

export default RealityEngine;