'use client';

import { useEffect, useRef, useState } from 'react';
import { createRevealObserver, shouldRevealEntry } from '@/lib/scrollReveal';

function FloatingParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random values only on client side to prevent hydration mismatches
    const frame = window.requestAnimationFrame(() => {
      setParticles(
        Array.from({ length: 15 }, () => ({
          left: `${Math.random() * 100}%`,
          animationDuration: `${8 + Math.random() * 12}s`,
          animationDelay: `${Math.random() * 8}s`,
          width: `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`,
        }))
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Return empty container during SSR / pre-hydration
  if (particles.length === 0) return <div className="particles-container" aria-hidden="true" />;

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            width: p.width,
            height: p.height,
          }}
        />
      ))}
    </div>
  );
}

export default function Waitlist() {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const observer = createRevealObserver({ threshold: 0.15 });

    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Animated counter
  useEffect(() => {
    const target = 2847;
    const duration = 2000;
    const start = performance.now();
    let frame;

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounter(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (shouldRevealEntry(entry)) {
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const emailInput = document.getElementById('waitlist-email') as HTMLInputElement;
      const email = emailInput?.value;
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section section--dark" id="waitlist" ref={sectionRef} style={{ position: 'relative' }}>
      <FloatingParticles />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="waitlist">
          <div className="reveal">
            <p className="section-label">Early Access</p>
            <h2 className="section-title">
              Be among the first to experience<br />precision diagnostics.
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              We&apos;re building something meaningful. Join our waitlist
              to get early access and shape the future of women&apos;s health.
            </p>
          </div>

          {!submitted ? (
            <form className="waitlist__form reveal reveal-delay-2" onSubmit={handleSubmit}>
              <div className="waitlist__input-group">
                <input
                  type="text"
                  className="waitlist__input"
                  placeholder="Your name"
                  required
                  id="waitlist-name"
                />
                <input
                  type="email"
                  className="waitlist__input"
                  placeholder="Email address"
                  required
                  id="waitlist-email"
                />
              </div>
              <select className="waitlist__select" id="waitlist-interest">
                <option value="">What are you looking to track? (Optional)</option>
                <option value="pcos">PCOS Management</option>
                <option value="fertility">Fertility & Conception</option>
                <option value="cycle">Cycle Optimization</option>
                <option value="preventive">Preventive Health</option>
                <option value="other">Other</option>
              </select>
              <button type="submit" className="waitlist__submit" id="waitlist-submit" disabled={loading}>
                {loading ? 'Joining...' : 'Join the Waitlist'}
              </button>
              {error && <p style={{ color: '#D27F6A', marginTop: '12px', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
              <div className="waitlist__counter reveal reveal-delay-3">
                <span className="waitlist__counter-dot" />
                <span>{counter.toLocaleString()} people on the waitlist</span>
              </div>
              <p className="waitlist__trust">No spam. Only science.</p>
            </form>
          ) : (
            <div className="reveal revealed" style={{ marginTop: 'var(--space-xl)' }}>
              <p style={{
                fontFamily: 'var(--heading-font)',
                fontSize: 'var(--fs-h3)',
                color: 'var(--sage)',
                marginBottom: 'var(--space-sm)',
              }}>
                ✓ You&apos;re on the list.
              </p>
              <p style={{
                fontSize: 'var(--fs-small)',
                color: 'rgba(247, 245, 242, 0.5)',
              }}>
                We&apos;ll be in touch with updates. Thank you for believing in better diagnostics.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
