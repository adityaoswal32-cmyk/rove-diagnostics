'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function WordReveal({ text, className }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span ref={ref} className={`word-reveal ${className || ''}`}>
      {words.map((word, i) => {
        // Check if word should be italic (marked with *word*)
        const isItalic = word.startsWith('*') && word.endsWith('*');
        const cleanWord = isItalic ? word.slice(1, -1) : word;

        return (
          <span
            key={i}
            className={`word-reveal__word ${visible ? 'visible' : ''}`}
            style={{ transitionDelay: `${0.5 + i * 0.08}s` }}
          >
            {isItalic ? <em>{cleanWord}</em> : cleanWord}
          </span>
        );
      })}
    </span>
  );
}

function DNAHelix() {
  return (
    <svg className="dna-helix" viewBox="0 0 200 500" aria-hidden="true">
      {/* Left strand */}
      <path
        className="dna-helix__strand"
        d="M60,0 Q100,25 60,50 Q20,75 60,100 Q100,125 60,150 Q20,175 60,200 Q100,225 60,250 Q20,275 60,300 Q100,325 60,350 Q20,375 60,400 Q100,425 60,450 Q20,475 60,500"
        strokeDasharray="10 5"
      />
      {/* Right strand */}
      <path
        className="dna-helix__strand"
        d="M140,0 Q100,25 140,50 Q180,75 140,100 Q100,125 140,150 Q180,175 140,200 Q100,225 140,250 Q180,275 140,300 Q100,325 140,350 Q180,375 140,400 Q100,425 140,450 Q180,475 140,500"
        strokeDasharray="10 5"
        style={{ animationDelay: '-4s' }}
      />
      {/* Connecting rungs */}
      {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((y, i) => (
        <line
          key={i}
          x1={i % 2 === 0 ? 60 : 20}
          y1={y}
          x2={i % 2 === 0 ? 140 : 180}
          y2={y}
          stroke="var(--beige)"
          strokeWidth="0.5"
          strokeDasharray="3 3"
        />
      ))}
      {/* Dots at intersections */}
      {[50, 150, 250, 350, 450].map((y, i) => (
        <circle
          key={i}
          className="dna-helix__dot"
          cx={i % 2 === 0 ? 60 : 140}
          cy={y}
          r="2.5"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </svg>
  );
}

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;
    let time = 0;

    // Floating particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.3 + 0.05,
    }));

    let lastW = 0, lastH = 0;
    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === lastW && Math.abs(h - lastH) < 80) return; // Prevent mobile address-bar resize glitches
      lastW = w; lastH = h;
      
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      time += 0.002;

      // Molecular grid
      const gridSize = 55;
      for (let x = 0; x < w; x += gridSize) {
        for (let y = 0; y < h; y += gridSize) {
          const offsetX = Math.sin(time + y * 0.008) * 8;
          const offsetY = Math.cos(time + x * 0.008) * 8;
          const px = x + offsetX;
          const py = y + offsetY;

          ctx.fillStyle = 'rgba(163, 177, 138, 0.08)';
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Connection lines between nearby grid points
      ctx.strokeStyle = 'rgba(163, 177, 138, 0.035)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += gridSize) {
        for (let y = 0; y < h; y += gridSize) {
          const offsetX = Math.sin(time + y * 0.008) * 8;
          const offsetY = Math.cos(time + x * 0.008) * 8;
          if (x + gridSize < w) {
            const nextOffsetX = Math.sin(time + y * 0.008) * 8;
            ctx.beginPath();
            ctx.moveTo(x + offsetX, y + offsetY);
            ctx.lineTo(x + gridSize + nextOffsetX, y + offsetY);
            ctx.stroke();
          }
          if (y + gridSize < h) {
            const nextOffsetY = Math.cos(time + x * 0.008) * 8;
            ctx.beginPath();
            ctx.moveTo(x + offsetX, y + offsetY);
            ctx.lineTo(x + offsetX, y + gridSize + nextOffsetY);
            ctx.stroke();
          }
        }
      }

      // Floating particles with connections
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        ctx.fillStyle = `rgba(176, 137, 104, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections between close particles
      ctx.strokeStyle = 'rgba(176, 137, 104, 0.04)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (particles[i].x - particles[j].x) * w;
          const dy = (particles[i].y - particles[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.globalAlpha = 1 - dist / 120;
            ctx.beginPath();
            ctx.moveTo(particles[i].x * w, particles[i].y * h);
            ctx.lineTo(particles[j].x * w, particles[j].y * h);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Primary waveform
      ctx.strokeStyle = 'rgba(176, 137, 104, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const y = h * 0.55 + Math.sin(x * 0.006 + time * 3) * 50 + Math.sin(x * 0.012 + time * 2) * 25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary waveform
      ctx.strokeStyle = 'rgba(163, 177, 138, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const y = h * 0.4 + Math.sin(x * 0.005 + time * 2.5 + 1) * 60 + Math.cos(x * 0.01 + time * 1.5) * 30;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isVisible) {
        animFrame = requestAnimationFrame(draw);
      }
    };

    let isVisible = false;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (animFrame) cancelAnimationFrame(animFrame);
        draw();
      }
    }, { threshold: 0 });
    
    visibilityObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animFrame);
      visibilityObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <canvas ref={canvasRef} className="hero__canvas" />
      <DNAHelix />
      <div className="hero__content">
        <p className="hero__label">Precision Women&apos;s Health</p>
        <h1 className="hero__title">
          <WordReveal text="Your hormones tell a *story.* We help you *read* it." />
        </h1>
        <p className="hero__subtitle">
          Four hormones. Every cycle. Quantitative tracking with clinical-grade accuracy
          — no lab visit required.
        </p>
        <div className="hero__data-stream">
          <div className="data-stream" />
        </div>
        <div className="hero__actions">
          <Link href="#waitlist" className="btn btn--primary btn--shimmer">Join Waitlist</Link>
          <Link href="/science" className="btn btn--secondary">Explore Science</Link>
        </div>
      </div>
      <div className="hero__scroll-indicator">
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
