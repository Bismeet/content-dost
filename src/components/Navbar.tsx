import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { getLenisInstance } from '../lib/smoothScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Results', href: '#results' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      return !!(hash && hash !== '#');
    }
    return false;
  });

  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Observer for Hero Sentinel boundary
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let frameId: number;

    const setupObserver = () => {
      const sentinel = document.getElementById('hero-sentinel');
      if (!sentinel) {
        frameId = requestAnimationFrame(setupObserver);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          const isPastHero = entry.isIntersecting || entry.boundingClientRect.top < 0;
          if (isPastHero !== isVisibleRef.current) {
            setIsVisible(isPastHero);
          }
        },
        { rootMargin: '0px 0px 0px 0px' }
      );
      observer.observe(sentinel);
    };

    setupObserver();

    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
    };
  }, []);

  // 1. Scrollspy Observer with centered vertical band
  useEffect(() => {
    const sections = NAV_LINKS
      .map(({ href }) => document.getElementById(href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        // Track the intersecting element closest to the middle of the screen
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const aRect = a.target.getBoundingClientRect();
            const bRect = b.target.getBoundingClientRect();
            const center = window.innerHeight / 2;
            const aDist = Math.abs(aRect.top + aRect.height / 2 - center);
            const bDist = Math.abs(bRect.top + bRect.height / 2 - center);
            return aDist - bDist;
          })[0];

        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: '-25% 0px -35% 0px',
        threshold: [0, 0.1, 0.2]
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // 2. Track window scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Glide Indicator calculations
  const updateIndicator = useCallback(() => {
    const activeLink = linkRefs.current[activeSection];
    if (activeLink) {
      setIndicatorStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        opacity: 1
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  // Update measurements on resize
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const navEl = document.querySelector('.navbar-links');
    if (!navEl) return;
    
    const resizeObserver = new ResizeObserver(() => {
      updateIndicator();
    });
    resizeObserver.observe(navEl);
    return () => resizeObserver.disconnect();
  }, [updateIndicator]);

  // 4. Click Smooth Scroll with URL Hash sync
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.slice(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(targetElement, { offset: -90 });
      } else {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setActiveSection(targetId);
      window.history.pushState(null, '', href);
    }
  };

  // 5. Scroll lock when mobile menu is open
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

  // 6. Trap focus in mobile drawer
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

  // 7. Desktop Pointer Tilt effect (Restrained)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if ('ontouchstart' in window || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = -((y / (rect.height / 2)) * 0.4);
    const tiltY = (x / (rect.width / 2)) * 0.4;
    const shiftX = (x / (rect.width / 2)) * 2;

    e.currentTarget.style.setProperty('--nav-tilt-x', `${tiltX}deg`);
    e.currentTarget.style.setProperty('--nav-tilt-y', `${tiltY}deg`);
    e.currentTarget.style.setProperty('--nav-shift-x', `${shiftX}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--nav-tilt-x', '0deg');
    e.currentTarget.style.setProperty('--nav-tilt-y', '0deg');
    e.currentTarget.style.setProperty('--nav-shift-x', '0px');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header 
        className={`site-navbar ${isScrolled ? 'site-navbar--scrolled' : ''} ${isVisible ? '' : 'site-navbar--hidden'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="navbar-glass-surface" />
        <div className="navbar-edge-sheen" />

        {/* Logo Section */}
        <a 
          href="#" 
          className="navbar-brand" 
          aria-label="Content Dost home"
          tabIndex={isVisible ? undefined : -1}
          onClick={(e) => {
            e.preventDefault();
            const lenis = getLenisInstance();
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.pushState(null, '', '#');
            setActiveSection('');
          }}
        >
          <span className="navbar-brand-icon" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="80 95 345 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navIvoryGrad" x1="246" y1="106" x2="246" y2="406" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#F5F2EB" />
                  <stop offset="100%" stop-color="#DCD8CD" />
                </linearGradient>
                <linearGradient id="navGoldGrad" x1="266" y1="106" x2="266" y2="406" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#FFD066" />
                  <stop offset="100%" stop-color="#D47A1F" />
                </linearGradient>
              </defs>
              {/* Left Ivory Segment */}
              <path d="M 246 106 A 150 150 0 0 0 246 406 L 246 356 A 100 100 0 0 1 246 156 Z" fill="url(#navIvoryGrad)" />
              {/* Right Gold Segment */}
              <path d="M 266 106 L 266 156 A 100 100 0 0 1 266 356 L 266 406 A 150 150 0 0 0 266 106 Z" fill="url(#navGoldGrad)" />
              {/* Center Play Triangle */}
              <path d="M 235 222 C 235 215 241 215 245 218 L 289 252 C 293 255 293 257 289 260 L 245 294 C 241 297 235 297 235 290 Z" fill="url(#navGoldGrad)" />
              {/* Sparkles */}
              <path d="M 135 130 Q 160 130 160 105 Q 160 130 185 130 Q 160 130 160 155 Q 160 130 135 130 Z" fill="#FFD066" />
              <path d="M 92 185 Q 110 185 110 167 Q 110 185 128 185 Q 110 185 110 203 Q 110 185 92 185 Z" fill="#ADC6FF" />
              <circle cx="120" cy="230" r="5.5" fill="#FFD066" />
            </svg>
          </span>
          <span className="navbar-brand-text">Content <span>Dost</span></span>
        </a>

        {/* Desktop Centered Links */}
        <div className="navbar-links-chassis">
          <nav className="navbar-links" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  ref={(el) => { linkRefs.current[link.href.slice(1)] = el; }}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                  aria-current={isActive ? 'location' : undefined}
                  tabIndex={isVisible ? undefined : -1}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          
          {/* Gliding capsule & rail */}
          <span 
            className="navbar-gliding-capsule" 
            style={{
              transform: `translate3d(${indicatorStyle.left}px, -50%, 0)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity
            }} 
            aria-hidden="true"
          />
          <span 
            className="navbar-gliding-rail" 
            style={{
              transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity
            }} 
            aria-hidden="true"
          />
        </div>

        {/* Right CTA / Menu Button */}
        <div className="navbar-cta-wrap">
          <a href="#contact" className="navbar-cta" tabIndex={isVisible ? undefined : -1}>
            <span className="navbar-cta-desktop">Start a project</span>
            <span className="navbar-cta-mobile">Start project</span>
            <ArrowUpRight size={15} className="cta-arrow-icon" aria-hidden="true" />
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="navbar-menu-btn"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            tabIndex={isVisible ? undefined : -1}
          >
            <Menu size={19} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
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
                onClick={(e) => {
                  handleLinkClick(e, link.href);
                  closeMenu();
                }}
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
          <a 
            href="#contact" 
            onClick={(e) => {
              handleLinkClick(e, '#contact');
              closeMenu();
            }} 
            className="btn-primary" 
            tabIndex={mobileMenuOpen ? 0 : -1}
          >
            Start a project <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  );
}
