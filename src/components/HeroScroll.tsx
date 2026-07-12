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

  // Navbar visibility reference
  const isNavbarVisibleRef = useRef<boolean>(false);

  // States
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Real scroll progress for overlay rendering
  const [scrollVal, setScrollVal] = useState(0);
  const scrollValRef = useRef(0);

  // Paper overlay references & state
  const paperOverlayRef = useRef<HTMLDivElement>(null);
  const messageContentRef = useRef<HTMLDivElement>(null);
  const lastMessageIndexRef = useRef<number>(-1);
  const [activeMessageIndex, setActiveMessageIndex] = useState<number>(-1);

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

  // Preserve the existing paper-aligned HTML layout calculations.
  const updatePaperLayout = (progress = scrollValRef.current) => {
    const viewport = heroViewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const viewportWidth = rect.width;
    const viewportHeight = rect.height;

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
    const handleResize = () => {
      updatePaperLayout();
    };
    window.addEventListener('resize', handleResize);
    updatePaperLayout();
    return () => window.removeEventListener('resize', handleResize);
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
      // If prefers-reduced-motion is active, make sure navbar is shown immediately
      gsap.to('.site-navbar', {
        autoAlpha: 1,
        y: 0,
        duration: 0.1,
        pointerEvents: 'auto',
        overwrite: true,
      });
      return;
    }
    
    const section = heroSectionRef.current;
    const rendererViewport = heroViewportRef.current;

    if (!section || !rendererViewport) return;

    const frameState = {
      progress: 0,
    };

    // Navbar animation helper scopes
    const showNavbar = () => {
      gsap.to('.site-navbar', {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        pointerEvents: 'auto',
        overwrite: true,
      });
    };

    const hideNavbar = () => {
      gsap.to('.site-navbar', {
        autoAlpha: 0,
        y: -18,
        duration: 0.35,
        ease: 'power2.out',
        pointerEvents: 'none',
        overwrite: true,
      });
    };

    const context = gsap.context(() => {
      const animation = gsap.to(frameState, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerWidth < 768 ? window.innerHeight * 3.5 : window.innerHeight * 5.5}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.15,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!isFirstFrameLoaded) return;
            const scrollProgress = self.progress;

            // Map progress: First 92% scrub sequence. Final 8% holds last frame.
            const animationProgress = Math.min(scrollProgress / 0.92, 1);
            const frameIndex = Math.min(
              TOTAL_FRAMES - 1,
              Math.floor(animationProgress * (TOTAL_FRAMES - 1))
            );

            requestFrameRender(frameIndex);
            
            // Track scroll progress without state overhead
            scrollValRef.current = scrollProgress;
            setScrollVal(scrollProgress);
            updatePaperLayout(scrollProgress);

            // Active message stable change detector
            const nextIndex =
              scrollProgress >= 0.20 && scrollProgress < 0.36
                ? 0
                : scrollProgress >= 0.36 && scrollProgress < 0.55
                  ? 1
                  : scrollProgress >= 0.55 && scrollProgress < 0.75
                    ? 2
                    : -1;

            if (nextIndex !== lastMessageIndexRef.current) {
              lastMessageIndexRef.current = nextIndex;
              setActiveMessageIndex(nextIndex);
            }

            // Navbar show/hide threshold triggers (Show at >= 0.92, hide below 0.88 hysteresis window)
            const shouldBeVisible = scrollProgress >= 0.92 || (isNavbarVisibleRef.current && scrollProgress >= 0.88);
            
            if (shouldBeVisible !== isNavbarVisibleRef.current) {
              isNavbarVisibleRef.current = shouldBeVisible;
              if (shouldBeVisible) {
                showNavbar();
              } else {
                hideNavbar();
              }
            }
          },
          onLeave: () => {
            requestFrameRender(TOTAL_FRAMES - 1);
            
            scrollValRef.current = 1;
            setScrollVal(1);
            updatePaperLayout(1);
            if (lastMessageIndexRef.current !== -1) {
              lastMessageIndexRef.current = -1;
              setActiveMessageIndex(-1);
            }

            if (!isNavbarVisibleRef.current) {
              isNavbarVisibleRef.current = true;
              showNavbar();
            }
          },
          onEnterBack: () => {
            requestFrameRender(TOTAL_FRAMES - 1);
          },
        },
      });

      return () => {
        animation.scrollTrigger?.kill();
        animation.kill();
      };
    }, section);

    // Initial layout sync once trigger binds
    updatePaperLayout();
    ScrollTrigger.refresh();

    // Set initial navbar hiding state
    gsap.set('.site-navbar', {
      autoAlpha: 0,
      y: -18,
      pointerEvents: 'none',
    });

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
          isNavbarVisibleRef.current = true;
          gsap.to('.site-navbar', {
            autoAlpha: 1,
            y: 0,
            duration: 0,
            pointerEvents: 'auto',
            overwrite: true,
          });
          ScrollTrigger.refresh();
        }
      }
    }

    return () => {
      context.revert();
      // Ensure navbar is restored to visible state on unmount
      if (document.querySelector('.site-navbar')) {
        gsap.set('.site-navbar', {
          autoAlpha: 1,
          y: 0,
          pointerEvents: 'auto',
        });
      }
    };
  }, [isFirstFrameLoaded, prefersReducedMotion]);

  // ── Opacity helpers ──────────────────────────────────────────────
  // Phase 1: Paper opening (0 – 0.22) → fades out 0.22–0.32
  const getOpeningOpacity = () => {
    if (prefersReducedMotion) return 0;
    if (scrollVal <= 0.22) return 1;
    if (scrollVal > 0.32) return 0;
    return 1 - (scrollVal - 0.22) / 0.10;
  };

  // Paper overlay opacity calculation
  const getPaperOverlayOpacity = () => {
    if (prefersReducedMotion) return 0;
    if (scrollVal < 0.20 || scrollVal >= 0.75) return 0;
    if (scrollVal < 0.24) return (scrollVal - 0.20) / 0.04;
    if (scrollVal > 0.70) return 1 - (scrollVal - 0.70) / 0.05;
    return 1;
  };

  // Phase 3: Final Reveal
  const getFinalTextOpacity = () => {
    if (prefersReducedMotion) return 1;
    if (scrollVal < 0.84) return 0;
    return Math.min(1, (scrollVal - 0.84) / 0.05);
  };

  const getFinalCtaOpacity = () => {
    if (prefersReducedMotion) return 1;
    if (scrollVal < 0.92) return 0;
    return Math.min(1, (scrollVal - 0.92) / 0.04);
  };

  // The interface veil belongs only to the final title-card phase.
  const finalVeilOpacity = prefersReducedMotion ? 1 : scrollVal < 0.84 ? 0 : Math.min(1, (scrollVal - 0.84) / 0.08);

  const lastActiveIndex = activeMessageIndex !== -1 ? activeMessageIndex : 0;

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
                opacity: finalVeilOpacity,
                transition: 'opacity 600ms ease'
              }}
            />

            {/* ── Phase 1: Paper Opening ── */}
            <div
              className="hero-paper-safe-area"
              style={{
                opacity: getOpeningOpacity(),
                transform: `translateY(${scrollVal < 0.22 ? 0 : -16}px)`,
                transition: 'opacity 700ms ease, transform 700ms ease',
                pointerEvents: scrollVal < 0.22 && !prefersReducedMotion ? 'auto' : 'none'
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
              ref={paperOverlayRef}
              className="hero-paper-overlay"
              style={{
                opacity: getPaperOverlayOpacity(),
                transition: 'opacity 300ms ease',
                pointerEvents: activeMessageIndex !== -1 ? 'auto' : 'none'
              }}
              aria-live="polite"
            >
              <div ref={messageContentRef} className="hero-paper-message">
                <span className="hero-paper-eyebrow">
                  {MESSAGES[lastActiveIndex].eyebrow}
                </span>
                <p className="hero-paper-title">
                  {MESSAGES[lastActiveIndex].title}
                </p>
                <p className="hero-paper-description">
                  {window.innerWidth < 768
                    ? MESSAGES[lastActiveIndex].mobileDescription
                    : MESSAGES[lastActiveIndex].description}
                </p>
              </div>
            </div>

            {/* ── Phase 3: Final Reveal ── */}
            <div
              className="hero-final-reveal"
              style={{
                opacity: getFinalTextOpacity(),
                transform: `translate(-50%, -50%) translateY(${getFinalTextOpacity() > 0 ? '0' : '24px'})`,
                transition: 'opacity 600ms ease, transform 600ms ease'
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
                  opacity: getFinalCtaOpacity(),
                  transform: `translateY(${getFinalCtaOpacity() > 0 ? '0' : '12px'})`,
                  transition: 'opacity 500ms ease, transform 500ms ease'
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
