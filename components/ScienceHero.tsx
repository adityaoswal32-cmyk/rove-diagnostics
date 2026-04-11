'use client';

import { useEffect, useRef, useState } from 'react';
import { createRevealObserver } from '@/lib/scrollReveal';

function FloatingParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setParticles(
        Array.from({ length: 8 }, () => ({
          left: `${Math.random() * 100}%`,
          animationDuration: `${10 + Math.random() * 15}s`,
          animationDelay: `${Math.random() * 5}s`,
          width: `${2 + Math.random() * 2}px`,
          height: `${2 + Math.random() * 2}px`,
          backgroundColor: 'rgba(163, 177, 138, 0.15)',
        }))
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (particles.length === 0) return <div className="particles-container" aria-hidden="true" />;

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            width: p.width,
            height: p.height,
            backgroundColor: p.backgroundColor,
          }}
        />
      ))}
    </div>
  );
}

export default function ScienceHero() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = createRevealObserver({ threshold: 0.15 });

    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="science-hero" ref={sectionRef}>
      <div className="science-hero__bg">
        <FloatingParticles />
      </div>
      <div className="container container--narrow" style={{ position: 'relative', zIndex: 1 }}>
        <div className="reveal">
          <p className="section-label" style={{ justifyContent: 'center' }}>Research & Methodology</p>
          <h1 className="science-hero__title">
            <span className="science-hero__title-word">Built</span>
            {' '}
            <span className="science-hero__title-word">on</span>
            {' '}
            <span className="science-hero__title-word">Science</span>
          </h1>
          <div className="science-hero__divider" />
        </div>
        <p className="science-hero__subtitle reveal reveal-delay-1">
          Every Rove test measures four key reproductive hormones simultaneously —
          providing the multi-dimensional view needed to truly understand
          hormonal health. Our approach is grounded in peer-reviewed endocrinology
          and validated against clinical laboratory standards.
        </p>
      </div>
    </section>
  );
}
