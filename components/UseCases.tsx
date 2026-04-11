'use client';

import { useEffect, useRef } from 'react';
import { Activity, HeartPulse, RefreshCcw, ShieldCheck } from 'lucide-react';
import { createRevealObserver } from '@/lib/scrollReveal';

const useCaseIcons = {
  pcos: <Activity strokeWidth={1.5} size={32} color="var(--sage)" />,
  fertility: <HeartPulse strokeWidth={1.5} size={32} color="var(--sage)" />,
  cycle: <RefreshCcw strokeWidth={1.5} size={32} color="var(--sage)" />,
  preventive: <ShieldCheck strokeWidth={1.5} size={32} color="var(--sage)" />,
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
    const observer = createRevealObserver({
      threshold: 0.1,
      onReveal: (element) => {
        element.querySelectorAll('.text-highlight').forEach((highlight) => {
          highlight.classList.add('active');
        });
      },
    });

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
        <div className="reveal section-header--center" style={{ marginBottom: 'var(--space-lg)' }}>
          <p className="section-label">Why Rove</p>
          <h2 className="section-title">
            Your body isn&apos;t a <span className="text-highlight">black box</span>.
          </h2>
          <p className="section-subtitle">
            Hormonal fluctuations drive almost every aspect of female biology. We
            bring visibility to the invisible.
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
