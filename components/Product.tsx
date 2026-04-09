'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Product() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: 'I',
      icon: '⬡',
      title: 'Precision Test Strip',
      text: 'Engineered with lateral flow immunoassay technology. Four antibody-conjugate zones capture FSH, LH, E3G, and PDG simultaneously from a single urine sample.',
    },
    {
      number: 'II',
      icon: '⊞',
      title: 'Smartphone Scanning',
      text: 'Our computer vision pipeline processes the test strip image in real-time. Color intensity mapping converts visual signals to quantitative concentration values with clinical-grade accuracy.',
    },
    {
      number: 'III',
      icon: '⎔',
      title: 'AI Interpretation',
      text: 'Machine learning models trained on thousands of cycles analyze your results in context. Pattern recognition identifies anomalies, predicts phase transitions, and generates personalized insights.',
    },
  ];

  return (
    <section className="section section--dark" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <p className="section-label">Product Experience</p>
          <h2 className="section-title">From sample to insight.</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Clinical diagnostics, reimagined for daily life. 
            No lab visits. No waiting rooms. Just precision.
          </p>
        </div>

        <div className="product__flow">
          {steps.map((step, i) => (
            <div className={`product__step reveal reveal-delay-${i + 1}`} key={i}>
              <p className="product__step-number">{step.number}</p>
              <div className="product__step-icon">{step.icon}</div>
              <p className="product__step-title">{step.title}</p>
              <p className="product__step-text">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="data-line" />

        <div className="reveal reveal-delay-4" style={{ textAlign: 'center' }}>
          <Link href="/#waitlist" className="btn btn--light">
            Get Early Access
          </Link>
        </div>
      </div>
    </section>
  );
}
