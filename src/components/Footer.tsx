import { useEffect, useRef, useState } from 'react';
import SoftAurora from './reactbits/SoftAurora/SoftAurora';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // Parallax target/current states for pointer and scroll
  const stateRef = useRef({
    pointerX: 0,
    pointerY: 0,
    currentPointerX: 0,
    currentPointerY: 0,
    scrollY: 0,
    currentScrollY: 0,
    isIntersecting: false,
    rafId: null as number | null,
    bounds: null as DOMRect | null,
  });

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const cacheBounds = () => {
      stateRef.current.bounds = el.getBoundingClientRect();
    };

    // Detect intersection to pause animation off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        stateRef.current.isIntersecting = entry.isIntersecting;
        if (entry.isIntersecting) {
          el.classList.add('cinematic-footer--active');
          cacheBounds();
          attachListeners();
        } else {
          el.classList.remove('cinematic-footer--active');
          detachListeners();
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(el);

    // Parallax update scheduler (only updates when event fires, not continuous when static)
    const updateParallax = () => {
      const state = stateRef.current;
      
      // Interpolate pointer values for smooth lag effect
      state.currentPointerX += (state.pointerX - state.currentPointerX) * 0.08;
      state.currentPointerY += (state.pointerY - state.currentPointerY) * 0.08;
      
      // Interpolate scroll values
      state.currentScrollY += (state.scrollY - state.currentScrollY) * 0.08;

      if (wordmarkRef.current) {
        // Subtle offset bounds: pointer translation max 20px, scroll translation max 25px
        const ptrX = state.currentPointerX * 20;
        const ptrY = state.currentPointerY * 10;
        const scrY = state.currentScrollY * -25;
        
        wordmarkRef.current.style.setProperty('--wordmark-transform', `translate3d(${ptrX}px, ${ptrY + scrY}px, 0)`);
      }

      state.rafId = null;
    };

    const scheduleUpdate = () => {
      if (stateRef.current.rafId === null && stateRef.current.isIntersecting) {
        stateRef.current.rafId = requestAnimationFrame(updateParallax);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Coarse pointers or reduced motion check
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(pointer: coarse)').matches
      ) return;

      const state = stateRef.current;
      if (!state.bounds) return;

      // Normalised coordinates relative to center of footer: -1 to 1
      const centerX = state.bounds.left + state.bounds.width / 2;
      const centerY = state.bounds.top + state.bounds.height / 2;
      state.pointerX = (e.clientX - centerX) / (state.bounds.width / 2);
      state.pointerY = (e.clientY - centerY) / (state.bounds.height / 2);
      
      scheduleUpdate();
    };

    const handleScroll = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const state = stateRef.current;
      if (!state.bounds) return;

      // Normalised scroll progress relative to viewport entry: 0 to 1
      const scrollPos = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      state.scrollY = docHeight > 0 ? scrollPos / docHeight : 0;

      scheduleUpdate();
    };

    const handleResize = () => {
      cacheBounds();
    };

    const attachListeners = () => {
      // Avoid attaching pointer listeners if touch device/coarse pointer
      if (!window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('mousemove', handleMouseMove);
      }
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize, { passive: true });
    };

    const detachListeners = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (stateRef.current.rafId !== null) {
        cancelAnimationFrame(stateRef.current.rafId);
        stateRef.current.rafId = null;
      }
    };

    return () => {
      observer.disconnect();
      detachListeners();
    };
  }, []);

  return (
    <footer ref={footerRef} className="cinematic-footer">
      <div className="cinematic-footer__soft-aurora" aria-hidden="true">
        <SoftAurora
          paused={!isIntersecting}
          speed={2.0}
          scale={1.2}
          brightness={1.15}
          color1="#D8751B" // Warm Amber
          color2="#E39A34" // Muted Gold/Amber
          noiseFrequency={2.3}
          noiseAmplitude={0.95}
          bandHeight={0.52}
          bandSpread={1.4}
          layerOffset={3.2}
          enableMouseInteraction={!window.matchMedia('(pointer: coarse)').matches}
          mouseInfluence={0.05}
        />
      </div>

      <div className="cinematic-footer__content">
        <p className="cinematic-footer__contact">
          Reach out to us at{' '}
          <a 
            href="mailto:hello@contentdost.agency" 
            className="cinematic-footer__email"
            aria-label="Send an email to hello@contentdost.agency"
          >
            hello@contentdost.agency
          </a>
        </p>
      </div>

      <div 
        ref={wordmarkRef}
        className="cinematic-footer__wordmark" 
        aria-hidden="true"
      >
        contentdost
      </div>
    </footer>
  );
}
