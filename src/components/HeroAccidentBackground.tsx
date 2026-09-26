import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  pulseSpeed: number;
}

export const HeroAccidentBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse parallax state with smooth damping
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      
      const normX = (clientX / rect.width) * 2 - 1; // -1 to 1
      const normY = (clientY / rect.height) * 2 - 1; // -1 to 1

      // Subtle parallax range (±14px)
      targetOffset.current = {
        x: normX * 14,
        y: normY * 10,
      };
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Parallax damping animation loop
    let animId: number;
    const animateParallax = () => {
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * 0.05;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * 0.05;
      
      setMouseOffset({
        x: currentOffset.current.x,
        y: currentOffset.current.y,
      });

      animId = requestAnimationFrame(animateParallax);
    };
    animId = requestAnimationFrame(animateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // HTML5 Canvas particles for floating light particles & subtle red emergency sparks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(229, 57, 53, 0.75)',   // Emergency Red
      'rgba(255, 107, 107, 0.7)',  // Soft Crimson
      'rgba(56, 217, 255, 0.65)',  // Cyber Cyan
      'rgba(255, 255, 255, 0.8)',  // Starlight White
      'rgba(254, 226, 226, 0.6)'   // Light Rose
    ];

    const particleCount = Math.min(36, Math.floor(width / 35));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.4 + 0.15), // Gentle upward drift
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle floating light particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Subtle pulsing opacity
        const dynamicAlpha = p.alpha + Math.sin(frame * p.pulseSpeed) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(0.9, dynamicAlpha));

        ctx.save();
        ctx.globalAlpha = clampedAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.radius * 3.5;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* 1. KEN BURNS + PARALLAX IMAGE WRAPPER */}
      <div
        className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
        }}
      >
        <img
          src="/hero-accident.jpg"
          alt="ResQTag Emergency Accident Response Background"
          className="w-full h-full object-cover object-[70%_center] sm:object-center animate-ken-burns"
          loading="eager"
        />
      </div>

      {/* 2. SUBTLE DARK NAVY TRANSPARENT OVERLAY (Ensures pristine text readability while keeping full scene visible) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070D1D]/75 via-[#0B1528]/60 to-[#070D1D]/88 backdrop-blur-[1.5px]" />

      {/* 3. SOFT RED EMERGENCY LIGHT PULSE & BEACONS OVERLAY */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#E53935]/20 blur-3xl animate-emergency-glow pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-red-600/15 blur-3xl animate-emergency-glow pointer-events-none delay-1000" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full bg-[#38D9FF]/15 blur-3xl pointer-events-none" />

      {/* 4. MOVING LIGHT GRADIENT SWEEP ACROSS BACKGROUND */}
      <div className="absolute -inset-y-10 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] animate-gradient-sweep pointer-events-none" />

      {/* 5. CANVAS PARTICLES & GLOWING SPARKS */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 6. BOTTOM GRADIENT BLEND INTO MAIN PAGE */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#FFF7F7] via-[#FFF7F7]/60 to-transparent" />
    </div>
  );
};
