import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detect active section on scroll
      const sections = ['services', 'workflow', 'portfolio', 'results', 'faq'];
      let currentSection = 'home';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger scroll check on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu overlay is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#030303]/80 backdrop-blur-lg border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container flex items-center justify-between">
        
        {/* Brand Logo and CD Monogram */}
        <a href="#" className="flex items-center gap-3 group text-decoration-none" aria-label="Content Dost Home">
          <div 
            className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF7A00] to-[#FF3D00] transition-all duration-300 group-hover:scale-105"
            style={{
              perspective: '600px',
              transformStyle: 'preserve-3d',
              transform: 'rotateX(12deg) rotateY(-12deg) translateZ(0)',
              boxShadow: '0 6px 12px -2px rgba(255, 90, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.25)'
            }}
          >
            {/* Front white visual track */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white relative z-10"
              style={{ transform: 'translateZ(6px)' }}
            >
              <path d="M7 6h6a6 6 0 0 1 0 12H7" />
              <path d="M7 6v12" />
              <polygon points="10 9 14 12 10 15" fill="currentColor" stroke="none" />
            </svg>

            {/* Middle shadow visual profile */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(0, 0, 0, 0.5)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute pointer-events-none"
              style={{ transform: 'translateZ(2px)' }}
            >
              <path d="M7 6h6a6 6 0 0 1 0 12H7" />
              <path d="M7 6v12" />
              <polygon points="10 9 14 12 10 15" fill="rgba(0, 0, 0, 0.5)" stroke="none" />
            </svg>

            {/* Back glow extrusion profile */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255, 90, 0, 0.6)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute pointer-events-none"
              style={{ transform: 'translateZ(-4px)' }}
            >
              <path d="M7 6h6a6 6 0 0 1 0 12H7" />
              <path d="M7 6v12" />
              <polygon points="10 9 14 12 10 15" fill="rgba(255, 90, 0, 0.6)" stroke="none" />
            </svg>

            {/* Holographic light highlight reflection flash line */}
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 100%)',
                transform: 'translateZ(1px)'
              }}
            ></div>

            <div className="absolute inset-0 rounded-lg bg-orange-500/20 blur-sm group-hover:blur-md transition-all"></div>
          </div>
          <span className="font-heading text-lg font-black tracking-tight text-white">
            CONTENT <span className="text-orange-500">DOST</span>
          </span>
        </a>

        {/* Central Floating Navigation Capsule */}
        <nav className="hidden md:block">
          <div className="nav-capsule">
            {[
              { label: 'Services', href: '#services' },
              { label: 'Process', href: '#workflow' },
              { label: 'Showcase', href: '#portfolio' },
              { label: 'Results', href: '#results' },
              { label: 'FAQ', href: '#faq' },
            ].map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-semibold relative py-1.5 px-3.5 text-decoration-none transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <svg 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1.5 text-[#F7C623]" 
                      viewBox="0 0 24 6" 
                      fill="none"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(247, 198, 35, 0.5))' }}
                    >
                      <path d="M2 5 Q12 1 22 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Action Button & Hamburger Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 btn-primary py-2 px-4.5 text-xs rounded-lg shadow-sm"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Hamburger Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white md:hidden flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Full-Screen Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 top-[65px] bg-[#030303]/98 backdrop-blur-xl z-40 transition-all duration-300 ease-in-out md:hidden flex flex-col justify-between p-8 border-t border-zinc-900/60 ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-6 text-left">
          {[
            { label: 'Services & Capabilities', href: '#services' },
            { label: 'Production Process', href: '#workflow' },
            { label: 'Case Showcase', href: '#portfolio' },
            { label: 'Verified Results', href: '#results' },
            { label: 'FAQ', href: '#faq' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold tracking-tight text-zinc-300 hover:text-orange-500 transition-colors text-decoration-none"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="space-y-4">
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-decoration-none"
          >
            <span>Book a Call</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <p className="text-[10px] text-zinc-600 font-mono text-center">
            CONTENT DOST // CREATOR PARTNER SYSTEM
          </p>
        </div>
      </div>
    </header>
  );
}
