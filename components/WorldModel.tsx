
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, Activity, MousePointer2 } from 'lucide-react';
import { ComputeNode } from '../types';

interface WorldModelProps {
  nodes: ComputeNode[];
  activeModelName: string;
}

const WorldModel: React.FC<WorldModelProps> = ({ nodes, activeModelName }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [winConvergence, setWinConvergence] = useState(99.999992);

  // Stats Simulation
  useEffect(() => {
      const interval = setInterval(() => {
          setWinConvergence(prev => Math.min(100, prev + (Math.random() - 0.3) * 0.000001));
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- WIREFRAME GLOBE ---
    const geometry = new THREE.IcosahedronGeometry(1, 12); // Detailed sphere
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x003344, wireframe: true, transparent: true, opacity: 0.3 });
    const globe = new THREE.Mesh(geometry, wireframeMaterial);
    group.add(globe);

    // --- CONTINENTS (POINTS) ---
    // Approximate dot sphere
    const dotsGeo = new THREE.BufferGeometry();
    const dotsCount = 1000;
    const dotsPos = new Float32Array(dotsCount * 3);
    const spherical = new THREE.Spherical();
    const vec3 = new THREE.Vector3();

    for(let i=0; i<dotsCount; i++) {
        spherical.phi = Math.acos( -1 + ( 2 * i ) / dotsCount );
        spherical.theta = Math.sqrt( dotsCount * Math.PI ) * spherical.phi;
        spherical.radius = 1.01; // Slightly above surface
        vec3.setFromSpherical(spherical);
        dotsPos[i*3] = vec3.x;
        dotsPos[i*3+1] = vec3.y;
        dotsPos[i*3+2] = vec3.z;
    }
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotsPos, 3));
    const dotsMat = new THREE.PointsMaterial({ color: 0x00aaff, size: 0.015, transparent: true, opacity: 0.6 });
    const dots = new THREE.Points(dotsGeo, dotsMat);
    group.add(dots);

    // --- HOTSPOTS (Cities) ---
    const cities = [
        { lat: 40.71, lon: -74.00, color: 0xffd700 }, // NY
        { lat: 51.50, lon: -0.12, color: 0x00f0ff }, // London
        { lat: 35.67, lon: 139.65, color: 0xffd700 }, // Tokyo
        { lat: 0.34, lon: 32.58, color: 0xff2a6d }, // Kampala (Equator-ish)
        { lat: 25.20, lon: 55.27, color: 0x00f0ff }, // Dubai
        { lat: 1.35, lon: 103.81, color: 0xbd00ff } // Singapore
    ];

    const markersGroup = new THREE.Group();
    group.add(markersGroup);

    const latLonToVector3 = (lat: number, lon: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        return new THREE.Vector3(x, y, z);
    };

    cities.forEach(city => {
        const pos = latLonToVector3(city.lat, city.lon, 1.02);
        const markerGeo = new THREE.SphereGeometry(0.02, 8, 8);
        const markerMat = new THREE.MeshBasicMaterial({ color: city.color });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.copy(pos);
        markersGroup.add(marker);

        // Beam
        const beamGeo = new THREE.BufferGeometry().setFromPoints([pos, pos.clone().multiplyScalar(1.2)]);
        const beamMat = new THREE.LineBasicMaterial({ color: city.color, transparent: true, opacity: 0.5 });
        const beam = new THREE.Line(beamGeo, beamMat);
        markersGroup.add(beam);
    });

    // --- ARCS (Financial Flows) ---
    // Connect Kampala to others
    const kampala = cities.find(c => c.lat === 0.34)!;
    const start = latLonToVector3(kampala.lat, kampala.lon, 1.02);

    cities.forEach(city => {
        if (city === kampala) return;
        const end = latLonToVector3(city.lat, city.lon, 1.02);
        
        // Control points for curve (midpoint elevated)
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(1.3);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(20);
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
        const curveMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.3 });
        const curveMesh = new THREE.Line(curveGeo, curveMat);
        group.add(curveMesh);
    });


    // --- ANIMATION ---
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
        frameId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        group.rotation.y = time * 0.15; // Slow rotation
        group.rotation.x = Math.sin(time * 0.1) * 0.1; // Gentle tilt

        // Pulse cities
        markersGroup.children.forEach((child: any, i) => {
            if (child.isMesh) {
                const scale = 1 + Math.sin(time * 3 + i) * 0.3;
                child.scale.set(scale, scale, scale);
            }
        });

        renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameId);
        if (mount) mount.removeChild(renderer.domElement);
        geometry.dispose();
        wireframeMaterial.dispose();
        renderer.dispose();
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col glass-panel p-1 rounded-sm relative overflow-hidden bg-black border border-mudde-cyan/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
       
       {/* UI Overlay */}
       <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-mudde-cyan font-mono text-[10px] tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                        <Globe className="w-3 h-3 text-mudde-cyan animate-pulse" />
                        HOLOGRAM_EARTH_PROJECTION
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="px-1.5 py-0.5 bg-mudde-cyan/10 border border-mudde-cyan/40 rounded flex items-center gap-1">
                            <Activity className="w-2 h-2 text-mudde-cyan" />
                            <span className="text-[7px] text-mudde-cyan font-mono font-bold uppercase">Realtime_Nodes</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end bg-black/80 p-1.5 border border-gray-800 rounded backdrop-blur">
                    <span className="text-[7px] font-mono text-gray-500 uppercase">Win_Convergence</span>
                    <span className="text-[12px] font-mono text-mudde-gold font-bold text-shadow-gold">{winConvergence.toFixed(8)}%</span>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1 pointer-events-auto">
                    <div className="text-[7px] text-gray-500 font-mono">FINANCIAL_ARCS: ACTIVE</div>
                    <div className="flex gap-2">
                         <div className="w-2 h-2 bg-mudde-gold rounded-full animate-pulse shadow-[0_0_5px_#ffd700]"></div>
                         <div className="w-2 h-2 bg-mudde-cyan rounded-full animate-pulse delay-75 shadow-[0_0_5px_#00f0ff]"></div>
                    </div>
                </div>
                <div className="text-[7px] font-mono text-right flex flex-col items-end">
                    <span className="text-mudde-cyan flex items-center gap-1">
                        <MousePointer2 className="w-2 h-2" /> 3D_VISUALIZATION
                    </span>
                    <span className="text-gray-600">PROJECTION: OMNI</span>
                </div>
            </div>
       </div>

       {/* Decorative Scanline */}
       <div className="absolute top-0 left-0 w-full h-1 bg-mudde-cyan/30 shadow-[0_0_15px_#00f0ff] animate-scanline z-0 opacity-20 pointer-events-none"></div>
       
       {/* 3D MOUNT */}
       <div ref={mountRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default WorldModel;
