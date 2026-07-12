import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenisInstance } from '../lib/smoothScroll';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      anchors: false,
      autoResize: true,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Initial resize and refresh sync
    requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();

      // Initial hash navigation scroll bypass
      const hash = window.location.hash;
      if (hash && hash !== '#') {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          lenis.scrollTo(targetEl as HTMLElement, {
            immediate: true,
            offset: -96,
          });
          // Make sure navbar is shown because we are past the Hero section
          gsap.to('.site-navbar', {
            autoAlpha: 1,
            y: 0,
            duration: 0.1,
            pointerEvents: 'auto',
            overwrite: true,
          });
          ScrollTrigger.refresh();
        }
      }
    });

    // Global anchor click interception
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      // Intercept only hash anchors that don't go to other pages
      if (href && href.startsWith('#')) {
        e.preventDefault();

        if (href === '#') {
          lenis.scrollTo(0, {
            duration: 1.05,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          window.history.pushState(null, '', ' ');
          return;
        }

        const targetEl = document.querySelector(href);
        if (targetEl) {
          lenis.scrollTo(targetEl as HTMLElement, {
            offset: -96,
            duration: 1.05,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          window.history.pushState(null, '', href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.off('scroll', updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  return <>{children}</>;
}
