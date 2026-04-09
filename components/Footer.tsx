import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__inner">
          <span className="footer__logo">Rove Diagnostics</span>
          <div className="footer__links">
            <Link href="/#problem" className="footer__link">About</Link>
            <Link href="/science" className="footer__link">Science</Link>
            <Link href="/#waitlist" className="footer__link">Contact</Link>
            <Link href="/#" className="footer__link">Privacy</Link>
          </div>
          <span className="footer__copy">&copy; {new Date().getFullYear()} Rove Diagnostics. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
