"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import Logo from "@/../public/assets/Logo.svg";
import { gsap } from "gsap";
import * as THREE from "three";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [loading, setLoading] = useState(true);
  const [outroStarted, setOutroStarted] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);

  // Set up GSAP entrance and heartbeat animations
  useEffect(() => {
    if (!logoRef.current) return;

    // Initial entrance animation with smoother easing
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.3, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)", // Elastic easing for smoother entrance
      },
    );

    // Improved heartbeat/pulsating animation with smoother transitions
    const heartbeat = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.3, // Add slight pause between beats
    });

    heartbeat.to(logoRef.current, {
      scale: 1.08, // Reduced scale for subtler effect
      duration: 0.6,
      ease: "sine.inOut", // Smoother sine wave easing
    });

    heartbeat.to(logoRef.current, {
      scale: 0.95, // Slight compression
      duration: 0.2,
      ease: "sine.in",
    });

    heartbeat.to(logoRef.current, {
      scale: 1,
      duration: 0.4,
      ease: "sine.out",
    });

    return () => {
      heartbeat.kill();
    };
  }, []);

  // Handle loading timeout and outro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setOutroStarted(true);

      // Logo outro animation
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          opacity: 0,
          scale: 1.8,
          duration: 1.2,
          ease: "power3.inOut", // Smoother power3 easing
          onComplete: () => {
            // After logo fades out, complete loading
            setTimeout(() => setLoading(false), 600);
          },
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // ThreeJS effect setup
  useEffect(() => {
    if (!outroStarted || !threeContainerRef.current) return;

    // Set up Three.js scene
    const container = threeContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Added antialiasing

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create particles with improved appearance
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800; // Increased particle count

    const posArray = new Float32Array(particlesCount * 3);

    // Create particles in a more spherical formation
    for (let i = 0; i < particlesCount; i++) {
      // Spherical distribution
      const radius = 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const idx = i * 3;
      posArray[idx] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[idx + 2] = radius * Math.cos(phi);
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );

    // Material for particles with improved appearance
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x58d68d,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending, // Additive blending for glow effect
    });

    // Create particle system
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial,
    );
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Animation function
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;

      // Explode particles outward with smoother animation
      gsap.to(particlesMesh.scale, {
        x: 2.5,
        y: 2.5,
        z: 2.5,
        duration: 1.8,
        ease: "expo.out", // Exponential easing for more natural explosion
      });

      // Fade out particles
      gsap.to(particlesMaterial, {
        opacity: 0,
        duration: 1.8,
        ease: "power2.out",
      });

      renderer.render(scene, camera);

      // Clean up after animation is done
      setTimeout(() => {
        cancelAnimationFrame(animationId);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }, 1800);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [outroStarted]);

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="h-screen w-screen flex items-center justify-center bg-[#1F2833] relative overflow-hidden"
      >
        <div ref={logoRef} className="z-10">
          <Image src={Logo} alt="the logo of the website pulsating" />
        </div>
        <div
          ref={threeContainerRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return <>{children}</>;
}
