import React, { useEffect, useRef } from 'react';

interface TechWaveBackgroundProps {
  className?: string;
  variant?: 'hero' | 'safejourney' | 'cta';
  showNetwork?: boolean;
}

export const TechWaveBackground: React.FC<TechWaveBackgroundProps> = ({
  className = '',
  variant = 'hero',
  showNetwork = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Particle setup
    const particleCount = width < 768 ? 45 : 90;
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
      waveOffset: number;
    }> = [];

    const colors = variant === 'safejourney' 
      ? ['#38C6B5', '#38D9FF', '#1687FF', '#087EA4', '#FFFFFF']
      : ['#38D9FF', '#1687FF', '#087EA4', '#38C6B5', '#FFFFFF'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 0.8,
        baseAlpha: Math.random() * 0.4 + 0.15,
        alpha: Math.random() * 0.5 + 0.1,
        alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
        waveOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let isVisible = true;

    // Use IntersectionObserver to pause rendering when not in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      if (isVisible) {
        time += prefersReducedMotion ? 0.001 : 0.008;
        ctx.clearRect(0, 0, width, height);

        // 1. Draw Flowing Data Wave Curves (Digital Stream)
        const waveCount = variant === 'safejourney' ? 3 : 4;
        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const waveHeight = height * (0.55 + w * 0.12);
          const frequency = 0.002 + w * 0.0008;
          const amplitude = (height * 0.08) + w * 12;
          const speed = time * (0.8 + w * 0.3);

          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 12) {
            const y = waveHeight +
              Math.sin(x * frequency + speed + w * 1.5) * amplitude +
              Math.cos(x * (frequency * 0.5) - speed * 0.5) * (amplitude * 0.5);
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          // Subtle gradient stroke for wave
          const strokeAlpha = 0.18 - w * 0.035;
          ctx.strokeStyle = w % 2 === 0
            ? `rgba(56, 217, 255, ${strokeAlpha})`
            : `rgba(56, 198, 181, ${strokeAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Wave Stream Particles (Dots along the digital flow)
          if (!prefersReducedMotion) {
            const step = width < 768 ? 48 : 36;
            for (let px = 0; px <= width; px += step) {
              const py = waveHeight +
                Math.sin(px * frequency + speed + w * 1.5) * amplitude +
                Math.cos(px * (frequency * 0.5) - speed * 0.5) * (amplitude * 0.5);
              
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(56, 217, 255, ${strokeAlpha * 1.8})`;
              ctx.fill();
            }
          }
        }

        // 2. Draw Connected Network Points & Connecting Mesh Lines
        if (showNetwork) {
          const maxDistance = width < 768 ? 90 : 125;
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < maxDistance) {
                const lineAlpha = (1 - dist / maxDistance) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(56, 217, 255, ${lineAlpha})`;
                ctx.lineWidth = 0.75;
                ctx.stroke();
              }
            }
          }
        }

        // 3. Draw Floating Glowing Particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (!prefersReducedMotion) {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce / wrap around edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Animate alpha opacity
            p.alpha += p.alphaSpeed;
            if (p.alpha > p.baseAlpha + 0.2 || p.alpha < 0.08) {
              p.alphaSpeed = -p.alphaSpeed;
            }
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = p.radius > 1.8 ? 8 : 0;
          ctx.shadowColor = '#38D9FF';
          ctx.fill();
          ctx.shadowBlur = 0; // Reset
          ctx.globalAlpha = 1.0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [variant, showNetwork]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Background Gradient Foundation */}
      <div
        className={`absolute inset-0 ${
          variant === 'safejourney'
            ? 'bg-gradient-to-br from-[#062846] via-[#073B66] to-[#0A4D68]'
            : variant === 'cta'
            ? 'bg-gradient-to-br from-[#05233D] via-[#073B66] to-[#087EA4]'
            : 'bg-gradient-to-br from-[#051C33] via-[#073B66] to-[#0B2545]'
        }`}
      />

      {/* Large Glowing Ambient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#1687FF]/20 blur-3xl animate-pulse duration-10000" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#38D9FF]/15 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 w-[28rem] h-[28rem] rounded-full bg-[#38C6B5]/15 blur-3xl" />
      <div className="absolute top-2/3 left-10 w-72 h-72 rounded-full bg-[#087EA4]/25 blur-3xl" />

      {/* Subtle Radial Glow in Center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent" />

      {/* High-Performance Canvas Stream & Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block opacity-90"
      />

      {/* Subtle Bottom Transition Gradient Fade to light background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
    </div>
  );
};
