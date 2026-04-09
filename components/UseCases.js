'use client';

import { useEffect, useRef } from 'react';

const useCaseIcons = {
  pcos: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="24" cy="24" r="14" strokeDasharray="4 3" />
      <circle cx="24" cy="24" r="8" />
      <circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" opacity="0.4" />
      <circle cx="30" cy="20" r="1.5" fill="currentColor" stroke="none" opacity="0.4" />
      <circle cx="26" cy="32" r="1.8" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  ),
  fertility: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="24" cy="20" r="10" />
      <path d="M24 30v10" />
      <path d="M20 36h8" />
      <circle cx="24" cy="20" r="3" fill="currentColor" stroke="none" opacity="0.3" />
      <path d="M14 20a10 10 0 0120 0" strokeDasharray="3 3" />
    </svg>
  ),
  cycle: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="24" cy="24" r="14" />
      <path d="M24 10v14l8 6" />
      <path d="M18 24a6 6 0 0112 0" strokeDasharray="2 2" />
      <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  ),
  preventive: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M24 8l14 8v12c0 8-6 14-14 16C16 42 10 36 10 28V16l14-8z" />
      <path d="M18 24l4 4 8-8" />
    </svg>
  ),
};

const miniCharts = {
  pcos: "M0,20 Q10,5 20,18 Q30,30 40,12 Q50,0 60,15 Q70,25 80,10",
  fertility: "M0,25 Q10,25 20,20 Q30,10 40,5 Q50,15 60,22 Q70,25 80,25",
  cycle: "M0,15 Q10,10 20,20 Q30,25 40,15 Q50,5 60,15 Q70,20 80,15",
  preventive: "M0,20 Q10,18 20,15 Q30,12 40,10 Q50,8 60,6 Q70,5 80,5",
};

export default function UseCases() {
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
      { threshold: 0.1 }
    );

    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const cases = [
    {
      key: 'pcos',
      title: 'PCOS Management',
      text: 'Track hormonal imbalances associated with PCOS. Monitor LH:FSH ratios and androgen markers to understand your condition beyond a single diagnosis.',
    },
    {
      key: 'fertility',
      title: 'Trying to Conceive',
      text: 'Identify your fertile window with multi-hormone confirmation. Go beyond LH surge detection — track E3G and PDG for complete ovulation verification.',
    },
    {
      key: 'cycle',
      title: 'Cycle Optimization',
      text: 'Understand your unique hormonal rhythm. Align nutrition, exercise, and lifestyle with your cycle phases backed by quantified data.',
    },
    {
      key: 'preventive',
      title: 'Preventive Health',
      text: 'Establish your hormonal baseline. Detect subtle shifts early — before symptoms manifest. Proactive monitoring for long-term reproductive health.',
    },
  ];

  return (
    <section className="section" id="use-cases" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <p className="section-label" style={{ justifyContent: 'center' }}>Use Cases</p>
          <h2 className="section-title">
            Designed for your <span className="text-highlight">biology</span>.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Whether you&apos;re managing a condition or optimizing your health,
            Rove adapts to your needs.
          </p>
        </div>

        <div className="usecases__grid">
          {cases.map((c, i) => (
            <div className={`usecase tilt-card reveal reveal-delay-${i + 1}`} key={i}>
              <svg className="usecase__mini-chart" viewBox="0 0 80 30" preserveAspectRatio="none">
                <path d={miniCharts[c.key]} fill="none" stroke="var(--sage)" strokeWidth="1.5" />
              </svg>
              <div className="usecase__icon-wrapper">
                {useCaseIcons[c.key]}
              </div>
              <h3 className="usecase__title">{c.title}</h3>
              <p className="usecase__text">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
