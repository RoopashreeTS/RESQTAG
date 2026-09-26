import React, { useEffect, useRef } from 'react';

export const GlobalRoseBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle pool with soft rose and emergency red tones
    const particleCount = width < 768 ? 40 : 75;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      alpha: number;
      alphaSpeed: number;
      color: string;
    }> = [];

    const colors = [
      '#E53935', // Primary Red
      '#FF6B6B', // Accent Red
      '#FF8E8E', // Soft Coral
      '#FFA4A4', // Light Rose
      '#C62828', // Crimson Red
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1, // gentle upward drift
        radius: Math.random() * 2.2 + 0.8,
        baseAlpha: Math.random() * 0.25 + 0.1,
        alpha: Math.random() * 0.25 + 0.08,
        alphaSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      time += prefersReducedMotion ? 0.001 : 0.006;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle flowing safety data curves
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const waveHeight = height * (0.35 + w * 0.25);
        const frequency = 0.0015 + w * 0.0006;
        const amplitude = height * 0.04 + w * 8;
        const speed = time * (0.6 + w * 0.2);

        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 16) {
          const y = waveHeight +
            Math.sin(x * frequency + speed + w * 2) * amplitude +
            Math.cos(x * (frequency * 0.5) - speed * 0.4) * (amplitude * 0.4);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const strokeAlpha = 0.045 - w * 0.01;
        ctx.strokeStyle = `rgba(229, 57, 53, ${Math.max(0.015, strokeAlpha)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 2. Draw subtle connected network lines between nearby emergency nodes
      const maxDistance = width < 768 ? 85 : 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.055;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(229, 57, 53, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 3. Draw floating soft particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          p.alpha += p.alphaSpeed;
          if (p.alpha > p.baseAlpha + 0.15 || p.alpha < 0.05) {
            p.alphaSpeed = -p.alphaSpeed;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Base Gradient Foundation (#FFF7F7 -> #FFEFEF -> #FFF2F2) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7F7] via-[#FFEFEF] to-[#FFF1F1]" />

      {/* 2. Slow-Moving Organic Glowing Ambient Red/Rose Blobs */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-[#FFE5E5]/70 blur-3xl animate-blob-slow" />
      <div className="absolute top-1/4 -right-28 w-[32rem] h-[32rem] rounded-full bg-[#FFDADA]/60 blur-3xl animate-blob-slow [animation-delay:4s]" />
      <div className="absolute top-2/3 -left-20 w-[36rem] h-[36rem] rounded-full bg-[#FFE5E5]/65 blur-3xl animate-blob-slow [animation-delay:8s]" />
      <div className="absolute -bottom-24 right-1/4 w-[30rem] h-[30rem] rounded-full bg-[#FFECEC]/75 blur-3xl animate-blob-slow [animation-delay:2s]" />

      {/* 3. Subtle Radial Warmth in Center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,229,229,0.5),_transparent_70%)]" />

      {/* 4. Smooth Particle & Safety Wave Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block opacity-85"
      />
    </div>
  );
};
