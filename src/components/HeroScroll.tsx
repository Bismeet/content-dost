import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import frameManifest from '../content/frameManifest.json';
import { HeroSequenceRenderer } from './hero/HeroSequenceRenderer';
import { getLenisInstance } from '../lib/smoothScroll';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = frameManifest.length;
const BASE_PATH = '/hero-sequence/';
const FRAME_URLS = frameManifest.map((filename) => `${BASE_PATH}${filename}`);

const MESSAGES = [
  {
    eyebrow: 'STRATEGY',
    title: 'Find the angle.',
    description: 'Turn the rough thought into one clear idea worth opening.',
    mobileDescription: 'Find the angle.',
  },
  {
    eyebrow: 'SCRIPTWRITING',
    title: 'Shape the story.',
    description: 'Build the hook, pacing and payoff before the edit begins.',
    mobileDescription: 'Shape the story.',
  },
  {
    eyebrow: 'EDITING',
    title: 'Cut for attention.',
    description: 'Remove the noise and give every moment a reason to stay.',
    mobileDescription: 'Shape every second.',
  },
];

const paperBoundsByProgress = [
  {
    progress: 0.20,
    bounds: { x: 0.39, y: 0.31, width: 0.23, height: 0.38 },
  },
  {
    progress: 0.50,
    bounds: { x: 0.385, y: 0.305, width: 0.235, height: 0.39 },
  },
  {
    progress: 0.72,
    bounds: { x: 0.38, y: 0.30, width: 0.24, height: 0.40 },
  },
];

function getInterpolatedBounds(progress: number, isMobile: boolean) {
  if (isMobile) {
    return { x: 0.32, y: 0.28, width: 0.36, height: 0.44 };
  }

  const list = paperBoundsByProgress;
  if (progress <= list[0].progress) return list[0].bounds;
  if (progress >= list[list.length - 1].progress) return list[list.length - 1].bounds;

  for (let i = 0; i < list.length - 1; i++) {
    const start = list[i];
    const end = list[i + 1];
    if (progress >= start.progress && progress <= end.progress) {
      const t = (progress - start.progress) / (end.progress - start.progress);
      return {
        x: start.bounds.x + (end.bounds.x - start.bounds.x) * t,
        y: start.bounds.y + (end.bounds.y - start.bounds.y) * t,
        width: start.bounds.width + (end.bounds.width - start.bounds.width) * t,
        height: start.bounds.height + (end.bounds.height - start.bounds.height) * t,
      };
    }
  }
  return list[0].bounds;
}

export default function HeroScroll() {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroViewportRef = useRef<HTMLDivElement>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);
  const sequenceRendererRef = useRef<HeroSequenceRenderer | null>(null);


  // States
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Real scroll progress for overlay rendering
  const scrollValRef = useRef(0);
  const viewportDimensionsRef = useRef<{ width: number; height: number } | null>(null);

  // Detect reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forceReducedMotion = import.meta.env.DEV
      && new URLSearchParams(window.location.search).has('reduced-motion');
    setPrefersReducedMotion(forceReducedMotion || mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(forceReducedMotion || e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // GSAP remains the only source of truth; the renderer owns scheduling and caches.
  const requestFrameRender = (frameIndex: number) => {
    sequenceRendererRef.current?.requestFrame(frameIndex);
  };

  const updateCachedDimensions = () => {
    const viewport = heroViewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    viewportDimensionsRef.current = {
      width: rect.width,
      height: rect.height,
    };
  };

  // Preserve the existing paper-aligned HTML layout calculations.
  const updatePaperLayout = (progress = scrollValRef.current) => {
    const viewport = heroViewportRef.current;
    if (!viewport) return;

    if (!viewportDimensionsRef.current) {
      updateCachedDimensions();
    }
    const dims = viewportDimensionsRef.current;
    if (!dims) return;
    const viewportWidth = dims.width;
    const viewportHeight = dims.height;

    // Source frame dimensions
    const sourceWidth = 1920;
    const sourceHeight = 1080;

    const scale = Math.max(
      viewportWidth / sourceWidth,
      viewportHeight / sourceHeight
    );

    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;

    const offsetX = (viewportWidth - renderedWidth) / 2;
    const offsetY = (viewportHeight - renderedHeight) / 2;

    const isMobile = window.innerWidth < 768;
    const bounds = getInterpolatedBounds(progress, isMobile);

    const paperLeft = offsetX + bounds.x * renderedWidth;
    const paperTop = offsetY + bounds.y * renderedHeight;
    const paperWidth = bounds.width * renderedWidth;
    const paperHeight = bounds.height * renderedHeight;

    viewport.style.setProperty('--paper-left', `${paperLeft}px`);
    viewport.style.setProperty('--paper-top', `${paperTop}px`);
    viewport.style.setProperty('--paper-width', `${paperWidth}px`);
    viewport.style.setProperty('--paper-height', `${paperHeight}px`);
  };

  useEffect(() => {
    updateCachedDimensions();
    const handleResize = () => {
      updateCachedDimensions();
      updatePaperLayout();
    };
    window.addEventListener('resize', handleResize);
    updatePaperLayout();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intercept and clamp touch/swipe momentum in the Hero pinning zone on mobile/tablet devices
  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    let touchStartY = 0;
    let touchStartX = 0;
    let startScrollY = 0;
    let isIntercepting = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      startScrollY = window.scrollY;

      const pinDuration = window.innerHeight * 2.2;
      if (startScrollY < pinDuration) {
        isIntercepting = true;
      } else {
        isIntercepting = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isIntercepting || e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartY - currentY;
      const deltaX = touchStartX - currentX;

      if (Math.abs(deltaY) < Math.abs(deltaX)) {
        return;
      }

      const maxDelta = window.innerHeight * 0.65;

      const clampedDelta = Math.max(-maxDelta, Math.min(maxDelta, deltaY));
      const targetScrollY = startScrollY + clampedDelta;

      if (e.cancelable) {
        e.preventDefault();
      }

      window.scrollTo(0, targetScrollY);
    };

    const handleTouchEnd = () => {
      isIntercepting = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // PixiJS renderer with retained Canvas 2D fallback.
  useEffect(() => {
    const container = heroViewportRef.current;
    const fallbackCanvas = fallbackCanvasRef.current;
    if (!container || !fallbackCanvas) return;
    let disposed = false;
    setIsFirstFrameLoaded(false);
    setLoadingProgress(0);
    const debugEnabled = import.meta.env.DEV && new URLSearchParams(window.location.search).has('debug');
    const forceCanvas = debugEnabled && new URLSearchParams(window.location.search).get('renderer') === 'canvas';
    const preferHtmlImages = debugEnabled && new URLSearchParams(window.location.search).get('source') === 'html';
    const simulateContextLoss = debugEnabled && new URLSearchParams(window.location.search).has('context-loss');
    const renderer = new HeroSequenceRenderer({
      container,
      fallbackCanvas,
      frameUrls: FRAME_URLS,
      onFirstFrame: () => {
        if (disposed) return;
        setIsFirstFrameLoaded(true);
        updatePaperLayout();
        ScrollTrigger.refresh();
      },
      onLoadingProgress: (progress) => {
        if (!disposed) setLoadingProgress(progress);
      },
      debugTarget: debugEnabled ? container : undefined,
      forceCanvas,
      preferHtmlImages,
      simulateContextLoss,
    });
    sequenceRendererRef.current = renderer;
    void renderer.init(prefersReducedMotion ? TOTAL_FRAMES - 1 : 0)
      .then(() => {
        if (debugEnabled && !disposed) {
          (window as Window & { __HERO_RENDERER_DEBUG__?: HeroSequenceRenderer }).__HERO_RENDERER_DEBUG__ = renderer;
        }
      })
      .catch(() => undefined);
    return () => {
      disposed = true;
      if (
        debugEnabled
        && (window as Window & { __HERO_RENDERER_DEBUG__?: HeroSequenceRenderer }).__HERO_RENDERER_DEBUG__ === renderer
      ) {
        delete (window as Window & { __HERO_RENDERER_DEBUG__?: HeroSequenceRenderer }).__HERO_RENDERER_DEBUG__;
      }
      if (sequenceRendererRef.current === renderer) sequenceRendererRef.current = null;
      renderer.destroy();
    };
  }, [prefersReducedMotion]);

  // GSAP ScrollTrigger layout pinning logic
  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      // If prefers-reduced-motion is active, make sure elements are at their final state and navbar is visible
      gsap.set('.js-hero-opening', { opacity: 0, y: -24 });
      gsap.set('.js-paper-overlay', { opacity: 0 });
      gsap.set('.hero-final-veil', { opacity: 1 });
      gsap.set('.hero-final-reveal', { opacity: 1, y: 0, xPercent: -50, yPercent: -50 });
      gsap.set('.hero-final-actions', { opacity: 1, y: 0 });
      return;
    }
    
    const section = heroSectionRef.current;
    const rendererViewport = heroViewportRef.current;

    if (!section || !rendererViewport) return;

    // Set initial states of DOM components before timeline plays
    gsap.set('.js-hero-opening', { opacity: 1, y: 0 });
    gsap.set('.js-paper-overlay', { opacity: 0 });
    gsap.set('.js-message-0', { opacity: 0, y: 15, visibility: 'hidden' });
    gsap.set('.js-message-1', { opacity: 0, y: 15, visibility: 'hidden' });
    gsap.set('.js-message-2', { opacity: 0, y: 15, visibility: 'hidden' });
    gsap.set('.hero-final-veil', { opacity: 0 });
    gsap.set('.hero-final-reveal', { opacity: 0, y: 24, xPercent: -50, yPercent: -50 });
    gsap.set('.hero-final-actions', { opacity: 0, y: 12 });

    const frameState = {
      progress: 0,
    };

    const context = gsap.context(() => {
      // Create master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => {
            const h = window.innerHeight;
            return `+=${h * 2.2}`; // 220vh scroll distance for stable speed
          },
          pin: true,
          pinSpacing: true,
          scrub: 0.75, // smooth scrub response
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Track scroll progress internally & update positioning
            scrollValRef.current = self.progress;
            updatePaperLayout(self.progress);
          },
          onLeave: () => {
            scrollValRef.current = 1;
            updatePaperLayout(1);
          }
        },
      });

      // 1. Frame sequence animation (entire timeline duration: 10)
      tl.to(frameState, {
        progress: 1,
        ease: 'none',
        duration: 9.2,
        onUpdate: () => {
          if (!isFirstFrameLoaded) return;
          const frameIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.floor(frameState.progress * (TOTAL_FRAMES - 1))
          );
          requestFrameRender(frameIndex);
        }
      }, 0);

      // 2. Opening copy fade out (Beat 01)
      tl.to('.js-hero-opening', {
        opacity: 0,
        y: -24,
        duration: 1.2
      }, 0.8);

      // 3. Paper overlay container fade in
      tl.to('.js-paper-overlay', {
        opacity: 1,
        duration: 0.5
      }, 1.8);

      // 4. Message 0 (STRATEGY) (Beat 02 & 03)
      tl.set('.js-message-0', { visibility: 'visible' }, 1.8);
      tl.to('.js-message-0', { opacity: 1, y: 0, duration: 0.1 }, 1.8);
      tl.fromTo('.js-message-0 .hero-paper-eyebrow', 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        1.8
      );
      tl.fromTo('.js-message-0 .hero-paper-title',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        2.1
      );
      tl.fromTo('.js-message-0 .hero-paper-description',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        2.4
      );
      // Fade out Message 0
      tl.to('.js-message-0', {
        opacity: 0,
        y: -15,
        duration: 0.5
      }, 3.6);
      tl.set('.js-message-0', { visibility: 'hidden' }, 4.1);

      // 5. Message 1 (SCRIPTWRITING) (Beat 04 & 05)
      tl.set('.js-message-1', { visibility: 'visible' }, 4.1);
      tl.to('.js-message-1', { opacity: 1, y: 0, duration: 0.1 }, 4.1);
      tl.fromTo('.js-message-1 .hero-paper-eyebrow',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        4.1
      );
      tl.fromTo('.js-message-1 .hero-paper-title',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        4.4
      );
      tl.fromTo('.js-message-1 .hero-paper-description',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        4.7
      );
      // Fade out Message 1
      tl.to('.js-message-1', {
        opacity: 0,
        y: -15,
        duration: 0.5
      }, 5.9);
      tl.set('.js-message-1', { visibility: 'hidden' }, 6.4);

      // 6. Message 2 (EDITING) (Beat 07 & 08)
      tl.set('.js-message-2', { visibility: 'visible' }, 6.4);
      tl.to('.js-message-2', { opacity: 1, y: 0, duration: 0.1 }, 6.4);
      tl.fromTo('.js-message-2 .hero-paper-eyebrow',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        6.4
      );
      tl.fromTo('.js-message-2 .hero-paper-title',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        6.7
      );
      tl.fromTo('.js-message-2 .hero-paper-description',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        7.0
      );
      // Fade out Message 2 and container
      tl.to('.js-message-2', {
        opacity: 0,
        y: -15,
        duration: 0.5
      }, 8.0);
      tl.set('.js-message-2', { visibility: 'hidden' }, 8.5);
      tl.to('.js-paper-overlay', {
        opacity: 0,
        duration: 0.5
      }, 8.0);

      // 7. Final Reveal (Beat 09 & 10)
      tl.fromTo('.hero-final-veil',
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        8.2
      );
      tl.fromTo('.hero-final-reveal',
        { opacity: 0, y: 24, xPercent: -50, yPercent: -50 },
        { opacity: 1, y: 0, xPercent: -50, yPercent: -50, duration: 0.8 },
        8.2
      );
      tl.fromTo('.hero-final-actions',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        8.7
      );

      // 8. Completed timeline end without hiding navbar

    }, section);

    // Initial layout sync once trigger binds
    updatePaperLayout(0);
    ScrollTrigger.refresh();

    // Initial hash navigation scroll bypass
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      const target = document.querySelector(hash);
      if (target) {
        const lenis = getLenisInstance();
        if (lenis) {
          lenis.scrollTo(target as HTMLElement, {
            immediate: true,
            offset: -96,
          });
          ScrollTrigger.refresh();
        }
      }
    }

    return () => {
      context.revert();
    };
  }, [isFirstFrameLoaded, prefersReducedMotion]);


  return (
    <section ref={heroSectionRef} className="hero-sequence">
      <div ref={heroViewportRef} className="hero-sequence-viewport">

        {/* Canvas 2D remains mounted beneath PixiJS for automatic fallback. */}
        <canvas ref={fallbackCanvasRef} className="hero-sequence-canvas" aria-hidden="true" />

        {/* Loading Mask */}
        {!isFirstFrameLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50" style={{ background: 'var(--ink)' }}>
            <div className="flex flex-col items-center" style={{ gap: '16px' }}>
              <span className="animate-pulse" style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--bone-soft)' }}>
                Preparing the story…
              </span>
              <div style={{ width: '180px', height: '1px', background: 'rgba(241,237,227,0.1)', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '100%', background: 'var(--lime)', borderRadius: '999px', transition: 'width 300ms', width: `${loadingProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Overlays */}
        {isFirstFrameLoaded && (
          <div className="hero-sequence-overlay">

            {/* Cinematic veil — introduced only for the final reveal */}
            <div
              className="hero-final-veil"
              style={{
                opacity: prefersReducedMotion ? 1 : 0
              }}
            />

            {/* ── Phase 1: Paper Opening ── */}
            <div
              className="hero-paper-safe-area js-hero-opening"
              style={{
                opacity: prefersReducedMotion ? 0 : 1,
                pointerEvents: 'none'
              }}
            >
              <div className="hero-opening-copy">
                <h1>
                  Every strong piece of content
                  <em>starts as a rough idea.</em>
                </h1>
                <div className="hero-scroll-cue">Scroll to shape the idea</div>
              </div>
            </div>

            {/* ── Phase 2: Paper-Bound Captions ── */}
            <div
              className="hero-paper-overlay js-paper-overlay"
              style={{
                opacity: 0,
                pointerEvents: 'none'
              }}
            >
              {MESSAGES.map((msg, idx) => (
                <div
                  key={idx}
                  className={`hero-paper-message js-message-${idx}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    margin: 'auto',
                    opacity: 0,
                    visibility: 'hidden'
                  }}
                >
                  <span className="hero-paper-eyebrow">
                    {msg.eyebrow}
                  </span>
                  <p className="hero-paper-title">
                    {msg.title}
                  </p>
                  <p className="hero-paper-description">
                    {window.innerWidth < 768
                      ? msg.mobileDescription
                      : msg.description}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Phase 3: Final Reveal ── */}
            <div
              className="hero-final-reveal"
              style={{
                opacity: prefersReducedMotion ? 1 : 0
              }}
            >
              <p className="hero-final-eyebrow">Strategy · Script · Edit · Publish</p>
              <h1 className="hero-final-title">
                We shape raw ideas into work
                <em>people choose to watch<span aria-hidden="true">.</span></em>
              </h1>
              <p className="hero-final-description">
                Strategy, scripts and post-production for creators and growing brands.
              </p>

              <div
                className="hero-final-actions"
                style={{
                  opacity: prefersReducedMotion ? 1 : 0
                }}
              >
                <a href="#contact" className="btn-primary">
                  Start a project
                </a>
                <a href="#work" className="btn-secondary">
                  View selected work
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
