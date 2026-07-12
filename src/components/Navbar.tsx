import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { getLenisInstance } from '../lib/smoothScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Work', href: '#work' },
  { label: 'Results', href: '#results' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = NAV_LINKS
      .map(({ href }) => document.getElementById(href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-100px 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lenis = getLenisInstance();
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
      requestAnimationFrame(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
      });
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab' && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="site-navbar">
        <a href="#" className="navbar-brand" aria-label="Content Dost home">
          <span className="navbar-brand-icon" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4.4v15.2L19 12 6 4.4Z" />
            </svg>
          </span>
          <span className="navbar-brand-text">Content <span>Dost</span></span>
        </a>

        <nav className="navbar-links" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.label}
                href={link.href}
                className={`navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                aria-current={isActive ? 'location' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="navbar-cta-wrap">
          <a href="#contact" className="navbar-cta">
            <span className="navbar-cta-desktop">Start a project</span>
            <span className="navbar-cta-mobile">Start project</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="navbar-menu-btn"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu size={19} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        ref={drawerRef}
        className={`mobile-drawer ${mobileMenuOpen ? 'mobile-drawer--open' : 'mobile-drawer--closed'}`}
        aria-hidden={!mobileMenuOpen}
        data-lenis-prevent
      >
        <div className="mobile-drawer-heading">
          <span>Explore</span>
          <button type="button" onClick={closeMenu} aria-label="Close menu">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-drawer-nav" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className={`mobile-drawer-link ${isActive ? 'mobile-drawer-link--active' : ''}`}
                aria-current={isActive ? 'location' : undefined}
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="mobile-drawer-footer">
          <a href="#contact" onClick={closeMenu} className="btn-primary" tabIndex={mobileMenuOpen ? 0 : -1}>
            Start a project <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  );
}
