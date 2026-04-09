'use client';

import { useEffect, useRef, useState } from 'react';
import { Target, TrendingUp, Microscope } from 'lucide-react';

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
            setCount(isDecimal ? parseFloat(current.toFixed(2)) : Math.round(current));
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
  accuracy: <Target strokeWidth={1.5} size={40} color="var(--sage)" style={{ marginBottom: 'var(--space-sm)' }} />,
  correlation: <TrendingUp strokeWidth={1.5} size={40} color="var(--sage)" style={{ marginBottom: 'var(--space-sm)' }} />,
  detection: <Microscope strokeWidth={1.5} size={40} color="var(--sage)" style={{ marginBottom: 'var(--space-sm)' }} />,
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
