'use client';

import { useEffect, useRef, useState } from 'react';
import { UserX, Clock, FlaskConical } from 'lucide-react';

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
      icon: <UserX strokeWidth={1.5} size={36} color="currentColor" />,
      title: 'Dismissed',
      text: 'Up to 93% of women report feeling dismissed when seeking help for hormonal symptoms. Pain is culturally normalized. Root causes go uninvestigated.',
    },
    {
      stat: { value: 9, suffix: ' yrs' },
      icon: <Clock strokeWidth={1.5} size={36} color="currentColor" />,
      title: 'Delayed Diagnostics',
      text: 'In India, the average diagnostic delay for endometriosis is nearly 9 years. For PCOS, affecting up to 36% of women, vague symptoms lead to massive diagnosis gaps.',
    },
    {
      stat: { value: 1, suffix: '%' },
      icon: <FlaskConical strokeWidth={1.5} size={36} color="currentColor" />,
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
              <div className="problem__icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                {card.icon}
              </div>
              <div className="problem__stat">
                <AnimatedCounter target={card.stat.value} suffix={card.stat.suffix} />
              </div>
              <h3 className="problem__card-title">{card.title}</h3>
              <p className="problem__card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
