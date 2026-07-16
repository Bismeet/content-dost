import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenisInstance } from '../lib/smoothScroll';
import {
  getViewportOrientation,
  isCoarsePointerMobile,
  isContactEditableElement,
  isContactEditing,
  isHeightOnlyContactKeyboardResize,
  setContactEditing,
} from '../lib/contactFocus';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const lenis = prefersReducedMotion
      ? null
      : new Lenis({
          autoRaf: false,
          smoothWheel: true,
          syncTouch: false,
          lerp: 0.085,
          wheelMultiplier: 0.9,
          touchMultiplier: 1,
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          anchors: false,
          // The browser's keyboard changes the root viewport dimensions. Own
          // resize scheduling here so that transition is not treated as a
          // document-layout resize by Lenis.
          autoResize: false,
        });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    const updateScrollTrigger = () => {
      if (!isContactEditing()) ScrollTrigger.update();
    };

    const updateLenis = (time: number) => {
      lenis?.raf(time * 1000);
    };

    let interpolationPaused = false;
    const pauseInterpolation = () => {
      if (!lenis || interpolationPaused) return;
      // Cancel any old target before yielding to native keyboard scrolling.
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      gsap.ticker.remove(updateLenis);
      interpolationPaused = true;
    };

    const resumeInterpolation = () => {
      if (!lenis || !interpolationPaused) return;
      lenis.resize();
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      gsap.ticker.add(updateLenis);
      interpolationPaused = false;
    };

    lenis?.on('scroll', updateScrollTrigger);
    if (lenis) {
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    }

    let layoutSnapshot = {
      width: window.innerWidth,
      visualHeight: window.visualViewport?.height ?? window.innerHeight,
      orientation: getViewportOrientation(),
    };
    let resizeTimer: number | null = null;
    let focusExitTimer: number | null = null;

    const scheduleGenuineLayoutRefresh = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        if (isContactEditing()) return;
        lenis?.resize();
        ScrollTrigger.refresh();
      }, 180);
    };

    const handleViewportResize = () => {
      const currentSnapshot = {
        width: window.innerWidth,
        visualHeight: window.visualViewport?.height ?? window.innerHeight,
        orientation: getViewportOrientation(),
      };

      if (
        isHeightOnlyContactKeyboardResize(
          layoutSnapshot,
          currentSnapshot,
          isContactEditing(),
        )
      ) {
        return;
      }

      const widthChanged = Math.abs(currentSnapshot.width - layoutSnapshot.width) > 2;
      const orientationChanged = currentSnapshot.orientation !== layoutSnapshot.orientation;

      // Height-only changes on touch browsers include address-bar and keyboard
      // transitions. Neither changes the page breakpoint or pinned Hero length.
      if (isCoarsePointerMobile() && !widthChanged && !orientationChanged) return;

      layoutSnapshot = currentSnapshot;
      scheduleGenuineLayoutRefresh();
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!isCoarsePointerMobile() || !isContactEditableElement(target)) return;
      if (focusExitTimer !== null) {
        window.clearTimeout(focusExitTimer);
        focusExitTimer = null;
      }
      layoutSnapshot = {
        width: window.innerWidth,
        visualHeight: window.visualViewport?.height ?? window.innerHeight,
        orientation: getViewportOrientation(),
      };
      setContactEditing(true);
      pauseInterpolation();
    };

    const handleFocusOut = () => {
      if (!isContactEditing()) return;
      if (focusExitTimer !== null) window.clearTimeout(focusExitTimer);
      // Keep the controller active while focus moves between fields and until
      // the closing keyboard animation has settled.
      focusExitTimer = window.setTimeout(() => {
        focusExitTimer = null;
        const activeElement = document.activeElement;
        if (isContactEditableElement(activeElement)) return;
        setContactEditing(false);
        resumeInterpolation();
      }, 450);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    window.addEventListener('resize', handleViewportResize, { passive: true });
    window.visualViewport?.addEventListener('resize', handleViewportResize, { passive: true });

    // Initial resize and refresh sync
    const initialSyncFrame = requestAnimationFrame(() => {
      lenis?.resize();
      if (!isContactEditing()) ScrollTrigger.refresh();

      // Initial hash navigation scroll bypass
      const hash = window.location.hash;
      if (hash && hash !== '#' && !isContactEditing()) {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          lenis?.scrollTo(targetEl as HTMLElement, {
            immediate: true,
            offset: -96,
          });
          if (!isContactEditing()) ScrollTrigger.refresh();
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
        // Reduced-motion mode keeps native anchor navigation semantics.
        if (!lenis) return;
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
        if (targetEl && lenis) {
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
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      if (focusExitTimer !== null) window.clearTimeout(focusExitTimer);
      cancelAnimationFrame(initialSyncFrame);
      setContactEditing(false);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('resize', handleViewportResize);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
      lenis?.off('scroll', updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      document.removeEventListener('click', handleAnchorClick);
      lenis?.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  return <>{children}</>;
}
