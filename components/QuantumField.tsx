
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NetworkSubstrate: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    // Dark fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // --- PARTICLES ---
    const geometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    
    // Spread particles
    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 150; 
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Neural Material
    const material = new THREE.PointsMaterial({
        size: 0.2,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // --- INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.1;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // Gentle rotation
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Mouse influence
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y) * 0.01;
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x) * 0.01;

        // Pulse effect
        const scale = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
        particlesMesh.scale.set(scale, scale, scale);

        // Color shift based on time
        const r = Math.sin(elapsedTime * 0.2) * 0.2 + 0.2; // Darkish
        const g = Math.cos(elapsedTime * 0.3) * 0.2 + 0.5; // Green/Blue-ish
        const b = Math.sin(elapsedTime * 0.4) * 0.2 + 0.8; // Blue-ish
        material.color.setRGB(r, g, b);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (mount) mount.removeChild(renderer.domElement);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40"
    />
  );
};

export default NetworkSubstrate;
