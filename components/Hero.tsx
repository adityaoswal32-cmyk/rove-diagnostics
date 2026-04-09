'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface WordRevealProps {
  text: string;
  className?: string;
}

function WordReveal({ text, className }: WordRevealProps) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span ref={ref} className={`word-reveal ${className || ''}`}>
      {words.map((word, i) => {
        // Check if word should be italic (marked with *word*)
        const isItalic = word.startsWith('*') && word.endsWith('*');
        const cleanWord = isItalic ? word.slice(1, -1) : word;

        return (
          <span
            key={i}
            className={`word-reveal__word ${visible ? 'visible' : ''}`}
            style={{ transitionDelay: `${0.5 + i * 0.08}s` }}
          >
            {isItalic ? <em>{cleanWord}</em> : cleanWord}
          </span>
        );
      })}
    </span>
  );
}

// Removed DNAHelix noise
export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__content">
        <p className="hero__label">Precision Women&apos;s Health</p>
        <h1 className="hero__title">
          <WordReveal text="Your hormones tell a *story.* We help you *read* it." />
        </h1>
        <p className="hero__subtitle">
          Four hormones. Every cycle. Quantitative tracking with clinical-grade accuracy
          — no lab visit required.
        </p>
        <div className="hero__actions">
          <Link href="#waitlist" className="btn btn--primary btn--shimmer">Join Waitlist</Link>
          <Link href="/science" className="btn btn--secondary">Explore Science</Link>
        </div>
      </div>
      <div className="hero__scroll-indicator">
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
