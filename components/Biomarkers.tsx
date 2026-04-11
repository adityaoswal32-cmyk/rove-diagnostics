'use client';

import { useEffect, useRef, useState } from 'react';
import { createRevealObserver } from '@/lib/scrollReveal';

const sparklinePaths = {
  FSH: "M0,20 Q5,5 12,18 Q18,28 25,15 Q35,5 45,20 Q55,28 65,12 Q75,8 80,18",
  LH: "M0,28 Q15,28 25,26 Q35,24 40,5 Q45,24 55,28 Q65,28 80,28",
  E3G: "M0,28 Q10,28 20,24 Q30,18 40,8 Q48,18 55,22 Q65,14 75,20 Q80,24 80,28",
  PDG: "M0,28 Q15,28 25,28 Q35,28 45,24 Q55,12 65,8 Q75,18 80,26",
};

export default function Biomarkers() {
  const sectionRef = useRef(null);
  const [animatedCards, setAnimatedCards] = useState(new Set());

  useEffect(() => {
    const observer = createRevealObserver({
      threshold: 0.15,
      onReveal: (element) => {
        const index = element.dataset.index;
        if (index === undefined) return;

        setAnimatedCards((prev) => {
          if (prev.has(index)) return prev;
          const next = new Set(prev);
          next.add(index);
          return next;
        });
      },
    });

    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const biomarkers = [
    {
      abbr: 'FSH',
      name: 'Follicle-Stimulating Hormone',
      desc: 'Produced by the pituitary gland, FSH drives follicular development in the ovaries. Elevated FSH in the early follicular phase can indicate diminished ovarian reserve. Tracking FSH across your cycle reveals how effectively your body is recruiting and maturing eggs.',
      peak: 'Early follicular',
      range: '3.5–12.5 mIU/mL',
      relevance: 'Ovarian reserve, menopause transition',
    },
    {
      abbr: 'LH',
      name: 'Luteinizing Hormone',
      desc: 'The LH surge is the definitive trigger for ovulation. But LH patterns tell a richer story — elevated baseline LH relative to FSH is a hallmark of PCOS. Quantitative tracking captures surge magnitude and duration, not just presence.',
      peak: 'Mid-cycle surge',
      range: '2.4–12.6 mIU/mL',
      relevance: 'Ovulation confirmation, PCOS diagnosis',
    },
    {
      abbr: 'E3G',
      name: 'Estrone-3-Glucuronide',
      desc: 'E3G is the primary urinary metabolite of estradiol. Rising E3G levels reflect growing follicular activity and signal the approaching fertile window — often days before ovulation occurs. This early signal is invisible to LH-only tests.',
      peak: 'Pre-ovulatory rise',
      range: '4–60 ng/mL',
      relevance: 'Fertile window prediction, follicular health',
    },
    {
      abbr: 'PDG',
      name: 'Pregnanediol Glucuronide',
      desc: 'PDG is the urinary metabolite of progesterone. Rising PDG levels after ovulation confirm that the corpus luteum is functioning and producing progesterone — essential for implantation and early pregnancy support.',
      peak: 'Luteal phase',
      range: '0.5–5.0 μg/mL',
      relevance: 'Ovulation confirmation, luteal sufficiency',
    },
  ];

  return (
    <section className="section section--cream" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">Biomarkers</p>
          <h2 className="section-title">
            The four pillars of <span className="text-highlight">hormonal insight</span>.
          </h2>
          <p className="section-subtitle">
            Each biomarker reveals a different dimension of reproductive health.
            Together, they create a comprehensive hormonal profile.
          </p>
        </div>

        <div className="biomarkers__grid">
          {biomarkers.map((b, i) => (
            <div
              className={`biomarker tilt-card reveal reveal-delay-${i + 1}`}
              key={i}
              data-index={i}
            >
              <svg
                className={`sparkline ${animatedCards.has(String(i)) ? 'animated' : ''}`}
                viewBox="0 0 80 30"
                preserveAspectRatio="none"
              >
                <path d={sparklinePaths[b.abbr]} />
              </svg>
              <div className="biomarker__header">
                <span className="biomarker__abbr">{b.abbr}</span>
                <h3 className="biomarker__name">{b.name}</h3>
              </div>
              <p className="biomarker__desc">{b.desc}</p>
              <div className="biomarker__meta">
                <div className="biomarker__meta-item">
                  <strong>Peak</strong>
                  {b.peak}
                </div>
                <div className="biomarker__meta-item">
                  <strong>Range</strong>
                  {b.range}
                </div>
                <div className="biomarker__meta-item">
                  <strong>Clinical Relevance</strong>
                  {b.relevance}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
