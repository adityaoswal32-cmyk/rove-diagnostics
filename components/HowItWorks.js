'use client';

import { useEffect, useRef, useState } from 'react';

function AnimatedStepIcon({ type }) {
  const icons = {
    home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="step__icon-svg">
        <path d="M3 12l9-8 9 8" className="svg-draw drawn" />
        <path d="M5 10v10h14V10" className="svg-draw drawn" style={{ transitionDelay: '0.2s' }} />
        <rect x="9" y="14" width="6" height="6" className="svg-draw drawn" style={{ transitionDelay: '0.4s' }} />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="step__icon-svg">
        <rect x="6" y="3" width="12" height="18" rx="2" className="svg-draw drawn" />
        <path d="M8 7h8M8 10h8" className="svg-draw drawn" style={{ transitionDelay: '0.2s' }} strokeDasharray="4 2" />
        <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="step__icon-svg">
        <path d="M3 20L3 4" className="svg-draw drawn" />
        <path d="M3 20L21 20" className="svg-draw drawn" style={{ transitionDelay: '0.15s' }} />
        <path d="M5 16Q8 8 12 12Q16 16 20 6" className="svg-draw drawn" style={{ transitionDelay: '0.3s' }} />
        <circle cx="12" cy="12" r="1.5" fill="var(--terracotta)" stroke="none" className="svg-draw drawn" style={{ transitionDelay: '0.5s' }} />
      </svg>
    ),
    insights: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="step__icon-svg">
        <circle cx="12" cy="12" r="9" className="svg-draw drawn" />
        <path d="M12 3v4" className="svg-draw drawn" style={{ transitionDelay: '0.15s' }} />
        <path d="M12 17v4" className="svg-draw drawn" style={{ transitionDelay: '0.2s' }} />
        <path d="M3 12h4" className="svg-draw drawn" style={{ transitionDelay: '0.25s' }} />
        <path d="M17 12h4" className="svg-draw drawn" style={{ transitionDelay: '0.3s' }} />
        <circle cx="12" cy="12" r="3" className="svg-draw drawn" style={{ transitionDelay: '0.4s' }} />
      </svg>
    ),
  };
  return icons[type] || null;
}

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const [lineProgress, setLineProgress] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            const stepIndex = entry.target.dataset.step;
            if (stepIndex !== undefined) {
              setRevealedSteps(prev => new Set([...prev, stepIndex]));
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Progressive line fill on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = Math.min(1, Math.max(0, (viewH - rect.top) / (viewH + rect.height * 0.5)));
        setLineProgress(progress * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { icon: 'home', title: 'Test at Home', text: 'Collect a simple urine sample using our precision test strip. No needles, no lab visits.' },
    { icon: 'phone', title: 'Scan with Your Phone', text: 'Use the Rove app to photograph your test strip. Our computer vision does the rest.' },
    { icon: 'chart', title: 'Get Quantified Data', text: 'Receive precise hormone concentration values — not just positive or negative, but exact levels.' },
    { icon: 'insights', title: 'Receive Insights', text: 'Personalized analysis maps your cycle patterns, flags anomalies, and tracks trends over time.' },
  ];

  return (
    <section className="section section--cream" id="how-it-works" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ justifyContent: 'center' }}>How It Works</p>
          <h2 className="section-title">
            Four steps to <span className="text-highlight">precision</span>.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            From sample to insight in minutes. Clinical-grade diagnostics, simplified.
          </p>
        </div>

        <div className="steps__grid">
          {/* Progressive connection line */}
          <div
            style={{
              position: 'absolute',
              top: 42,
              left: 'calc(12.5% + 1.5rem)',
              right: 'calc(12.5% + 1.5rem)',
              height: '2px',
              display: 'flex',
              zIndex: 0,
            }}
          >
            <div
              style={{
                width: `${lineProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--sage), var(--terracotta))',
                borderRadius: '1px',
                transition: 'width 0.3s ease',
              }}
            />
            <div
              style={{
                flex: 1,
                height: '100%',
                background: 'repeating-linear-gradient(90deg, var(--beige) 0, var(--beige) 8px, transparent 8px, transparent 16px)',
              }}
            />
          </div>

          {steps.map((step, i) => (
            <div className={`step reveal reveal-delay-${i + 1}`} key={i} data-step={i}>
              <div
                className={`step__number ${revealedSteps.has(String(i)) ? 'glow-pulse' : ''}`}
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                0{i + 1}
              </div>
              <div className="step__icon" style={{ width: 28, height: 28 }}>
                <AnimatedStepIcon type={step.icon} />
              </div>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
