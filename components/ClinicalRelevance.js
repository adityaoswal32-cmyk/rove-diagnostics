'use client';

import { useEffect, useRef, useState } from 'react';

function AnimatedStat({ value, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericValue = parseFloat(value);
          const isDecimal = String(value).includes('.');
          const duration = 1500;
          const start = performance.now();

          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * numericValue;
            // Use 2 decimal places to avoid rounding 0.96 to 1.0
            setCount(isDecimal ? current.toFixed(2) : Math.round(current));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="clinical__stat-container" style={{ marginBottom: 'var(--space-sm)' }}>
      <span className="counter clinical__stat-number" style={{
        fontFamily: 'var(--heading-font)',
        fontSize: 'var(--fs-h1)',
        color: 'var(--sage)',
        display: 'inline-block',
      }}>
        {prefix}{count}
      </span>
      {suffix && (
        <span style={{ 
          fontSize: 'var(--fs-h4)', 
          color: 'var(--sage)', 
          marginLeft: '4px',
          fontWeight: 'normal'
        }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

const clinicalIcons = {
  accuracy: (
    <svg viewBox="0 0 40 40" fill="none" stroke="var(--sage)" strokeWidth="1.2" style={{ width: 40, height: 40, marginBottom: 'var(--space-sm)' }}>
      <circle cx="20" cy="20" r="16" />
      <circle cx="20" cy="20" r="10" strokeDasharray="3 2" />
      <circle cx="20" cy="20" r="4" />
      <circle cx="20" cy="20" r="1.5" fill="var(--terracotta)" stroke="none" />
    </svg>
  ),
  correlation: (
    <svg viewBox="0 0 40 40" fill="none" stroke="var(--sage)" strokeWidth="1.2" style={{ width: 40, height: 40, marginBottom: 'var(--space-sm)' }}>
      <path d="M6 34L14 22L22 28L30 14L38 8" />
      <circle cx="14" cy="22" r="2" fill="var(--sage)" stroke="none" opacity="0.4" />
      <circle cx="22" cy="28" r="2" fill="var(--sage)" stroke="none" opacity="0.4" />
      <circle cx="30" cy="14" r="2" fill="var(--sage)" stroke="none" opacity="0.4" />
    </svg>
  ),
  detection: (
    <svg viewBox="0 0 40 40" fill="none" stroke="var(--sage)" strokeWidth="1.2" style={{ width: 40, height: 40, marginBottom: 'var(--space-sm)' }}>
      <rect x="4" y="4" width="32" height="32" rx="4" />
      <path d="M4 20h32" strokeDasharray="3 2" />
      <path d="M10 28Q15 12 20 20Q25 28 30 14" />
      <circle cx="20" cy="20" r="2" fill="var(--terracotta)" stroke="none" />
    </svg>
  ),
};

export default function ClinicalRelevance() {
  const sectionRef = useRef(null);

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

    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      icon: 'accuracy',
      highlight: 'Quantitative Precision',
      title: 'Beyond Binary Outcomes',
      text: 'We are engineering our computer vision algorithms to move past simplistic positive/negative lines, delivering exact concentration levels.',
    },
    {
      icon: 'correlation',
      highlight: 'Clinical Concordance',
      title: 'Designed for Reliability',
      text: 'Our lateral flow assays are being developed to bridge the gap between home convenience and rigorous analytical reliability.',
    },
    {
      icon: 'detection',
      highlight: 'Comprehensive Tracking',
      title: 'Multi-Analyte Detection',
      text: 'Simultaneously prioritizing four key reproductive hormones from a single test strip — bringing complex clinical capabilities into your home.',
    },
  ];

  return (
    <section className="section" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
           <p className="section-label" style={{ justifyContent: 'center' }}>Clinical Standards</p>
          <h2 className="section-title">
            Engineering for <span className="text-highlight">excellence</span>.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            We are designing our diagnostics to match gold-standard laboratory
            methods, building a future where you never have to guess.
          </p>
        </div>

        <div className="clinical__grid">
          {cards.map((card, i) => (
            <div className={`clinical__card reveal reveal-delay-${i + 1}`} key={i}>
              {clinicalIcons[card.icon]}
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <span style={{
                  fontFamily: 'var(--heading-font)',
                  fontSize: 'var(--fs-h3)',
                  color: 'var(--sage)',
                  display: 'block',
                }}>
                  {card.highlight}
                </span>
              </div>
              <h3 className="clinical__card-title">{card.title}</h3>
              <p className="clinical__card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
