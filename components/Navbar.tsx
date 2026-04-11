'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScrolled = () => {
      frameRef.current = null;
      ticking.current = false;
      const nextScrolled = window.scrollY > 40;
      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
    };

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      frameRef.current = window.requestAnimationFrame(updateScrolled);
    };

    updateScrolled();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="navbar__inner">
          <Link href="/" className="navbar__logo">
            <span className="navbar__logo-mark" />
            Rove Diagnostics
          </Link>
          <div className="navbar__links">
            <Link href="/#problem" className="navbar__link">Why Rove</Link>
            <Link href="/#how-it-works" className="navbar__link">How It Works</Link>
            <Link href="/science" className="navbar__link">Science</Link>
            <Link href="/#waitlist" className="navbar__cta">Join Waitlist</Link>
          </div>
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-menu__close" onClick={closeMenu} aria-label="Close menu">
          ✕
        </button>
        <Link href="/#problem" className="mobile-menu__link" onClick={closeMenu}>Why Rove</Link>
        <Link href="/#how-it-works" className="mobile-menu__link" onClick={closeMenu}>How It Works</Link>
        <Link href="/science" className="mobile-menu__link" onClick={closeMenu}>Science</Link>
        <Link href="/#waitlist" className="mobile-menu__link" onClick={closeMenu}>Join Waitlist</Link>
      </div>
    </>
  );
}
