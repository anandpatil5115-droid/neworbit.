'use client';

import { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vy: number;
      vx: number;
      opacity: number;
      life: number;
      maxLife: number;
    }> = [];

    const createParticle = () => {
      return {
        x: Math.random() * width,
        y: height + Math.random() * 20,
        radius: Math.random() * 2 + 1,
        vy: -Math.random() * 0.5 - 0.2, // Drifting upwards
        vx: (Math.random() - 0.5) * 0.3, // Slight horizontal drift
        opacity: Math.random() * 0.3 + 0.1, // rgba(99, 102, 241, 0.3) max
        life: 0,
        maxLife: Math.random() * 300 + 200, // Frames before fading out
      };
    };

    // Initialize with some particles
    for (let i = 0; i < 40; i++) {
        particles.push({
            ...createParticle(),
            y: Math.random() * height // distribute initially
        });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw grid manually or use CSS (we are using CSS for grid below)
      
      // Update & Draw particles
      particles.forEach((p, index) => {
        p.y += p.vy;
        p.x += p.vx;
        p.life++;

        // Fade in/out logic based on life
        let currentOpacity = p.opacity;
        if (p.life < 50) {
            currentOpacity = (p.life / 50) * p.opacity;
        } else if (p.life > p.maxLife - 50) {
            currentOpacity = ((p.maxLife - p.life) / 50) * p.opacity;
        }

        if (currentOpacity < 0) currentOpacity = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${currentOpacity})`;
        ctx.fill();

        // Reset particle if dead or strictly off-screen
        if (p.life >= p.maxLife || p.y < -10) {
          particles[index] = createParticle();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <div 
        className="fixed inset-0 z-[-2] pointer-events-none"
        style={{
          background: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      <div 
        className="fixed inset-0 z-[-3] pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, #0a0a0f, #0d1117, #0f0a1a)',
          backgroundSize: '400% 400%',
          animation: 'gradient-bg 10s ease infinite'
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[-1] pointer-events-none"
      />
    </>
  );
}
