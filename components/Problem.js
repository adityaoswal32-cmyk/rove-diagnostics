'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

function AnimatedCounter({ target, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref} className="counter">{count}{suffix}</span>;
}

function AnimatedSVGIcon({ paths, viewBox = "0 0 48 48" }) {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setDrawn(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <svg ref={ref} className="problem__icon" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.2">
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          className={`svg-draw ${drawn ? 'drawn' : ''}`}
          style={{ transitionDelay: `${i * 0.2}s` }}
        />
      ))}
    </svg>
  );
}

export default function Problem() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Activate text highlights
            entry.target.querySelectorAll('.text-highlight').forEach(el => {
              el.classList.add('active');
            });
          }
        });
      },
      { threshold: 0.12 }
    );

    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      stat: { value: 93, suffix: '%' },
      icon: [
        "M24 8C15.2 8 8 15.2 8 24s7.2 16 16 16 16-7.2 16-16S32.8 8 24 8z",
        "M16 24h16",
        "M24 16v16"
      ],
      title: 'Dismissed',
      text: 'Up to 93% of women report feeling dismissed when seeking help for hormonal symptoms. Pain is culturally normalized. Root causes go uninvestigated.',
    },
    {
      stat: { value: 9, suffix: ' yrs' },
      icon: [
        "M8 14h32v20a2 2 0 01-2 2H10a2 2 0 01-2-2V14z",
        "M8 22h32",
        "M16 30a2 2 0 100-4 2 2 0 000 4z",
        "M32 30a2 2 0 100-4 2 2 0 000 4z"
      ],
      title: 'Delayed Diagnostics',
      text: 'In India, the average diagnostic delay for endometriosis is nearly 9 years. For PCOS, affecting up to 36% of women, vague symptoms lead to massive diagnosis gaps.',
    },
    {
      stat: { value: 1, suffix: '%' },
      icon: [
        "M24 8a12 12 0 100 24 12 12 0 000-24z",
        "M10 40c0-7.7 6.3-14 14-14s14 6.3 14 14",
        "M32 16l4-4"
      ],
      title: 'Underfunded R&D',
      text: 'Globally, a mere 1% of healthcare research and innovation funding is invested in female-specific conditions beyond oncology. We are building the data infrastructure to fix this.',
    },
  ];

  return (
    <section className="section section--cream dot-pattern" id="problem" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">The Problem</p>
          <h2 className="section-title">
            Women&apos;s health deserves more than a <span className="text-highlight">best guess</span>.
          </h2>
          <p className="section-subtitle">
            Half the population. A fraction of the research. The diagnostic
            tools available to women today were not designed for the complexity
            of their biology.
          </p>
        </div>

        <div className="problem__grid">
          {cards.map((card, i) => (
            <div className={`problem__card reveal reveal-delay-${i + 1}`} key={i}>
              <div className="problem__stat">
                <AnimatedCounter target={card.stat.value} suffix={card.stat.suffix} />
              </div>
              <AnimatedSVGIcon paths={card.icon} />
              <h3 className="problem__card-title">{card.title}</h3>
              <p className="problem__card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
