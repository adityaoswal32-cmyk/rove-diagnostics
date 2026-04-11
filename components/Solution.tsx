'use client';

import { useEffect, useRef, useState } from 'react';

function TypewriterText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, text, delay]);

  return (
    <span ref={ref} className="solution__tagline">
      {'\u201C'}{displayed}
      <span style={{
        borderRight: displayed.length < text.length ? '2px solid var(--sage)' : 'none',
        marginLeft: '2px',
      }} />
      {displayed.length >= text.length && '\u201D'}
    </span>
  );
}

export default function Solution() {
  const sectionRef = useRef(null);
  const featuresRef = useRef(null);
  const [progressHeight, setProgressHeight] = useState(0);
  const ticking = useRef(false);
  const frameRef = useRef<number | null>(null);
  const progressHeightRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            entry.target.querySelectorAll('.text-highlight').forEach(el => {
              el.classList.add('active');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const els = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll-linked progress line — throttled with rAF
  useEffect(() => {
    const updateProgress = () => {
      frameRef.current = null;
      ticking.current = false;
      if (!featuresRef.current) return;

      const rect = featuresRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      let nextProgress = 0;

      if (rect.top < viewH && rect.bottom > 0) {
        const progress = Math.min(1, Math.max(0, (viewH - rect.top) / (viewH + rect.height)));
        nextProgress = Math.round(progress * 100);
      } else if (rect.bottom <= 0) {
        nextProgress = 100;
      }

      if (nextProgress === progressHeightRef.current) return;
      progressHeightRef.current = nextProgress;
      setProgressHeight(nextProgress);
    };

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const features = [
    {
      marker: 'FSH',
      title: 'Multi-Hormone Tracking',
      text: 'Simultaneously measure FSH, LH, E3G, and PDG — the four pillars of hormonal health — from a single test.',
    },
    {
      marker: 'AI',
      title: 'Smartphone-Based Interpretation',
      text: 'Scan your test strip. Our algorithms quantify hormone levels with lab-grade accuracy, directly on your phone.',
    },
    {
      marker: 'Q',
      title: 'Quantitative, Not Qualitative',
      text: 'Move beyond simple positive/negative. Get precise concentration values and track changes over every cycle.',
    },
    {
      marker: '⊕',
      title: 'Cycle Intelligence',
      text: 'AI-powered analysis maps your hormonal patterns across cycles, revealing trends invisible to single-point tests.',
    },
  ];

  return (
    <section className="section" id="solution" ref={sectionRef}>
      <div className="container">
        <div className="solution__layout">
          <div className="reveal-left">
            <p className="section-label">The Solution</p>
            <h2 className="section-title">
              <span className="text-highlight">Precision</span> hormone diagnostics, designed for real life.
            </h2>
            <p className="section-subtitle">
              Rove replaces the single-snapshot blood draw with continuous,
              multi-hormone tracking you can do at home. The same biomarkers.
              Clinical-grade accuracy. No clinic required.
            </p>
            <TypewriterText text="What gets measured, gets understood." delay={800} />
          </div>

          <div className="solution__features-wrapper" ref={featuresRef}>
            <div
              className="solution__progress-line"
              style={{ height: `${progressHeight}%` }}
            />
            <div className="solution__features">
              {features.map((f, i) => (
                <div className={`solution__feature reveal reveal-delay-${i + 1}`} key={i}>
                  <div className="solution__feature-marker">{f.marker}</div>
                  <div>
                    <p className="solution__feature-title">{f.title}</p>
                    <p className="solution__feature-text">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
