import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import frameManifest from '../content/frameManifest.json';
import { HeroSequenceRenderer } from './hero/HeroSequenceRenderer';
import { getLenisInstance } from '../lib/smoothScroll';
import { getViewportOrientation, isContactEditing } from '../lib/contactFocus';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const DESKTOP_BASE_PATH = '/hero-sequence/';
const DESKTOP_FRAME_URLS = frameManifest.map((filename) => `${DESKTOP_BASE_PATH}${filename}`);

const MOBILE_FRAME_COUNT = 140;
const MOBILE_BASE_PATH = '/hero-sequence-mobile/';
const MOBILE_FRAME_URLS = Array.from(
  { length: MOBILE_FRAME_COUNT },
  (_, i) => `${MOBILE_BASE_PATH}ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
);

const DESKTOP_HERO_SCROLL_MULTIPLIER = 2.2;
const MOBILE_HERO_SCROLL_MULTIPLIER = 3.4;
const MOBILE_LANDSCAPE_HERO_SCROLL_MULTIPLIER = 2.8;
const MOBILE_MAX_FRAME_STEP = 1;
// The frame tween occupies the first 9.2 of the 10 timeline units. Gate only
// at that boundary so ordinary scrolling keeps its natural speed.
const MOBILE_FORWARD_EXIT_GATE_PROGRESS = 0.92;
const getMobileDecodeSize = () => window.innerWidth < 600
  ? { width: 540, height: 960 } as const
  : { width: 720, height: 1280 } as const;
const MOBILE_HERO_MEDIA_QUERY =
  '(max-width: 767px), (max-width: 1024px) and (max-height: 500px) and (orientation: landscape)';
const DESKTOP_HERO_MEDIA_QUERY =
  '(min-width: 768px) and (min-height: 501px), (min-width: 1025px)';

let stableMobileViewport = {
  width: 0,
  height: 0,
  orientation: '',
};

const getStableMobileViewportHeight = () => {
  const width = window.innerWidth;
  const orientation = getViewportOrientation();
  if (
    stableMobileViewport.height === 0 ||
    Math.abs(stableMobileViewport.width - width) > 2 ||
    stableMobileViewport.orientation !== orientation
  ) {
    stableMobileViewport = {
      width,
      // `100svh` is the Hero's CSS contract. Capture its stable layout height
      // instead of the keyboard-sensitive visual viewport height.
      height: document.documentElement.clientHeight,
      orientation,
    };
  }
  return stableMobileViewport.height;
};

const getMobileHeroScrollMultiplier = () =>
  getViewportOrientation() === 'landscape'
    ? MOBILE_LANDSCAPE_HERO_SCROLL_MULTIPLIER
    : MOBILE_HERO_SCROLL_MULTIPLIER;

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
  const mobileFrameProgressHandlerRef = useRef<((progress: number) => void) | null>(null);
  const mobileForwardGateRef = useRef(false);
  const mobileFinalFrameReadyRef = useRef(false);
  const mobileForwardGateStartYRef = useRef(0);
  const mobileForwardGateYRef = useRef(0);
  const mobileHeroEndYRef = useRef(0);


  // States
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [useMobileFrames, setUseMobileFrames] = useState(() =>
    typeof window !== 'undefined'
      ? window.innerWidth < 1025 && window.innerWidth < window.innerHeight
      : false
  );
  
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
  const requestFrameRender = (
    frameIndex: number,
    options: { holdAsGateTarget?: boolean; immediate?: boolean } = {},
  ) => {
    if (mobileForwardGateRef.current && !options.holdAsGateTarget) return;
    sequenceRendererRef.current?.requestFrame(frameIndex, { immediate: options.immediate });
  };

  const releaseMobileForwardGate = () => {
    if (!mobileForwardGateRef.current) return;
    mobileForwardGateRef.current = false;
    getLenisInstance()?.start();
  };

  const engageMobileForwardGate = (scrollY = window.scrollY) => {
    if (mobileForwardGateRef.current || mobileFinalFrameReadyRef.current) return;
    mobileForwardGateRef.current = true;
    mobileForwardGateStartYRef.current = scrollY;
    const lenis = getLenisInstance();
    // Clamp pending momentum to the gate, never to a position behind the user.
    lenis?.scrollTo(scrollY, { immediate: true, force: true });
    lenis?.stop();
    requestFrameRender(MOBILE_FRAME_URLS.length - 1, { holdAsGateTarget: true });
  };

  // A second strong mobile swipe can otherwise outrun the one-frame-per-tick
  // renderer and carry the page beyond the pinned Hero. Absorb only forward
  // input while the final frames catch up; reverse scrolling always stays native.
  useEffect(() => {
    if (!useMobileFrames) return;

    let lastTouchY: number | null = null;
    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY;
      if (touchY === undefined) return;
      const deltaY = lastTouchY === null ? 0 : lastTouchY - touchY;
      const isForward = deltaY > 0;
      lastTouchY = touchY;
      if (!mobileForwardGateRef.current) {
        const gateY = mobileForwardGateYRef.current;
        if (
          isForward
          && gateY > 0
          && window.scrollY + deltaY >= gateY
          && !mobileFinalFrameReadyRef.current
        ) {
          event.preventDefault();
          engageMobileForwardGate(gateY);
        }
        return;
      }
      if (window.scrollY < mobileForwardGateStartYRef.current - 4 || !isForward) {
        releaseMobileForwardGate();
        return;
      }
      event.preventDefault();
    };
    const handleTouchEnd = () => {
      lastTouchY = null;
    };
    const handleWheel = (event: WheelEvent) => {
      if (!mobileForwardGateRef.current) {
        const gateY = mobileForwardGateYRef.current;
        const lenis = getLenisInstance();
        const projectedY = (lenis?.targetScroll ?? window.scrollY) + event.deltaY;
        if (
          event.deltaY > 0
          && gateY > 0
          && projectedY >= gateY
          && !mobileFinalFrameReadyRef.current
        ) {
          event.preventDefault();
          engageMobileForwardGate(gateY);
        }
        return;
      }
      if (window.scrollY < mobileForwardGateStartYRef.current - 4 || event.deltaY < 0) {
        releaseMobileForwardGate();
        return;
      }
      if (event.deltaY > 0) event.preventDefault();
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      mobileForwardGateRef.current = false;
      getLenisInstance()?.start();
      window.removeEventListener('touchstart', handleTouchStart, true);
      window.removeEventListener('touchmove', handleTouchMove, true);
      window.removeEventListener('touchend', handleTouchEnd, true);
      window.removeEventListener('touchcancel', handleTouchEnd, true);
      window.removeEventListener('wheel', handleWheel, true);
    };
  }, [useMobileFrames]);

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
    const isMobile = window.innerWidth < 1025 && window.innerWidth < window.innerHeight;
    const sourceWidth = isMobile ? 1080 : 1920;
    const sourceHeight = isMobile ? 1920 : 1080;

    const scale = Math.max(
      viewportWidth / sourceWidth,
      viewportHeight / sourceHeight
    );

    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;

    const offsetX = (viewportWidth - renderedWidth) / 2;
    const offsetY = (viewportHeight - renderedHeight) / 2;

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
    let previousWidth = window.innerWidth;
    let previousOrientation = getViewportOrientation();
    const handleResize = () => {
      const nextWidth = window.innerWidth;
      const nextOrientation = getViewportOrientation();
      if (
        isContactEditing() &&
        Math.abs(nextWidth - previousWidth) <= 2 &&
        nextOrientation === previousOrientation
      ) {
        return;
      }
      previousWidth = nextWidth;
      previousOrientation = nextOrientation;
      updateCachedDimensions();
      updatePaperLayout();

      const nextUseMobile = window.innerWidth < 1025 && window.innerWidth < window.innerHeight;
      setUseMobileFrames((prev) => {
        if (prev !== nextUseMobile) {
          return nextUseMobile;
        }
        return prev;
      });
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
    // Let capable phones use WebGL. Canvas 2D remains the automatic fallback,
    // but forcing it on every phone makes each frame draw block the main thread.
    const forceCanvas = debugEnabled && new URLSearchParams(window.location.search).get('renderer') === 'canvas';
    const preferHtmlImages = debugEnabled && new URLSearchParams(window.location.search).get('source') === 'html';
    const simulateContextLoss = debugEnabled && new URLSearchParams(window.location.search).has('context-loss');
    
    const frameUrls = useMobileFrames ? MOBILE_FRAME_URLS : DESKTOP_FRAME_URLS;
    const totalFrames = frameUrls.length;

    const renderer = new HeroSequenceRenderer({
      container,
      fallbackCanvas,
      frameUrls: frameUrls,
      onFirstFrame: () => {
        if (disposed) return;
        setIsFirstFrameLoaded(true);
        updatePaperLayout();
        if (!isContactEditing()) ScrollTrigger.refresh();
      },
      onFrameRendered: (frameIndex) => {
        if (!useMobileFrames || disposed) return;
        const progress = frameIndex / Math.max(1, totalFrames - 1);
        if (frameIndex === totalFrames - 1) {
          mobileFinalFrameReadyRef.current = true;
          const heroEndY = mobileHeroEndYRef.current;
          if (mobileForwardGateRef.current && heroEndY > window.scrollY) {
            // The viewport is still pinned, so advancing the hidden scroll
            // coordinate to the completed timeline causes no visual jump.
            getLenisInstance()?.scrollTo(heroEndY, { immediate: true, force: true });
          }
          releaseMobileForwardGate();
        }
        mobileFrameProgressHandlerRef.current?.(progress);
      },
      onLoadingProgress: (progress) => {
        if (!disposed) setLoadingProgress(progress);
      },
      debugTarget: debugEnabled ? container : undefined,
      forceCanvas,
      decodeSize: useMobileFrames ? getMobileDecodeSize() : undefined,
      maxFrameStep: useMobileFrames ? MOBILE_MAX_FRAME_STEP : undefined,
      preferHtmlImages,
      simulateContextLoss,
    });
    sequenceRendererRef.current = renderer;
    void renderer.init(prefersReducedMotion ? totalFrames - 1 : 0)
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
  }, [prefersReducedMotion, useMobileFrames]);

  // GSAP ScrollTrigger layout pinning logic
  useLayoutEffect(() => {
    if (!isFirstFrameLoaded) return;

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

    const media = gsap.matchMedia();

    media.add(
      {
        isMobile: MOBILE_HERO_MEDIA_QUERY,
        isDesktop: DESKTOP_HERO_MEDIA_QUERY,
        isLandscape: '(orientation: landscape)',
      },
      (mediaContext) => {
        const isMobile = Boolean(mediaContext.conditions?.isMobile);
        let mobileProgressHandler: ((progress: number) => void) | null = null;

        const animationContext = gsap.context(() => {
          // Reset the existing Hero stages whenever the responsive mode changes.
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

          // One responsive timeline owns the Hero pin for the active media mode.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => {
                if (!isMobile) {
                  return `+=${window.innerHeight * DESKTOP_HERO_SCROLL_MULTIPLIER}`;
                }

                return `+=${getStableMobileViewportHeight() * getMobileHeroScrollMultiplier()}`;
              },
              pin: true,
              pinSpacing: true,
              // The renderer governs mobile frame speed itself. Keeping GSAP's
              // mobile scrub direct avoids stacking a second catch-up delay.
              scrub: useMobileFrames ? true : 0.75,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                if (useMobileFrames) {
                  mobileHeroEndYRef.current = self.end;
                  mobileForwardGateYRef.current = self.start
                    + (self.end - self.start) * MOBILE_FORWARD_EXIT_GATE_PROGRESS;
                }
              },
              onUpdate: (self) => {
                if (useMobileFrames) {
                  mobileHeroEndYRef.current = self.end;
                  mobileForwardGateYRef.current = self.start
                    + (self.end - self.start) * MOBILE_FORWARD_EXIT_GATE_PROGRESS;
                  if (self.progress < MOBILE_FORWARD_EXIT_GATE_PROGRESS) {
                    if (!mobileForwardGateRef.current) {
                      mobileFinalFrameReadyRef.current = false;
                    }
                  } else if (!mobileFinalFrameReadyRef.current && !mobileForwardGateRef.current) {
                    engageMobileForwardGate();
                  }
                  return;
                }
                // Desktop remains directly synchronized to scroll progress.
                scrollValRef.current = self.progress;
                updatePaperLayout(self.progress);
              },
              onLeave: () => {
                if (useMobileFrames) {
                  releaseMobileForwardGate();
                  return;
                }
                scrollValRef.current = 1;
                updatePaperLayout(1);
              },
              onEnterBack: () => {
                if (useMobileFrames) {
                  releaseMobileForwardGate();
                  mobileFinalFrameReadyRef.current = false;
                }
              },
              onLeaveBack: () => {
                if (!useMobileFrames) return;
                releaseMobileForwardGate();
                mobileFinalFrameReadyRef.current = false;
                // Frame zero is permanently cached. At the absolute top,
                // reset to it immediately so another forward pass never starts
                // with a long reverse-render backlog.
                requestFrameRender(0, { immediate: true });
              },
            },
          });

          // Desktop keeps the original combined timeline. On mobile, text is
          // paused and advanced only after the corresponding image frame has
          // actually rendered, preventing copy from racing ahead on fast swipes.
          const stageTimeline = useMobileFrames ? gsap.timeline({ paused: true }) : tl;

          // 1. Frame sequence animation (entire timeline duration: 10)
          tl.to(frameState, {
            progress: 1,
            ease: 'none',
            duration: 9.2,
            onUpdate: () => {
              if (!isFirstFrameLoaded) return;
              const frameUrls = useMobileFrames ? MOBILE_FRAME_URLS : DESKTOP_FRAME_URLS;
              const totalFrames = frameUrls.length;
              const frameIndex = Math.min(
                totalFrames - 1,
                Math.floor(frameState.progress * (totalFrames - 1))
              );
              requestFrameRender(frameIndex);
            }
          }, 0);

          // 2. Opening copy fade out (Beat 01)
          stageTimeline.to('.js-hero-opening', {
            opacity: 0,
            y: -24,
            duration: 1.2
          }, 0.8);

          // 3. Paper overlay container fade in
          stageTimeline.to('.js-paper-overlay', {
            opacity: 1,
            duration: 0.5
          }, 1.8);

          // 4. Message 0 (STRATEGY) (Beat 02 & 03)
          stageTimeline.set('.js-message-0', { visibility: 'visible' }, 1.8);
          stageTimeline.to('.js-message-0', { opacity: 1, y: 0, duration: 0.1 }, 1.8);
          stageTimeline.fromTo('.js-message-0 .hero-paper-eyebrow',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            1.8
          );
          stageTimeline.fromTo('.js-message-0 .hero-paper-title',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            2.1
          );
          stageTimeline.fromTo('.js-message-0 .hero-paper-description',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            2.4
          );
          // Fade out Message 0
          stageTimeline.to('.js-message-0', {
            opacity: 0,
            y: -15,
            duration: 0.5
          }, 3.6);
          stageTimeline.set('.js-message-0', { visibility: 'hidden' }, 4.1);

          // 5. Message 1 (SCRIPTWRITING) (Beat 04 & 05)
          stageTimeline.set('.js-message-1', { visibility: 'visible' }, 4.1);
          stageTimeline.to('.js-message-1', { opacity: 1, y: 0, duration: 0.1 }, 4.1);
          stageTimeline.fromTo('.js-message-1 .hero-paper-eyebrow',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            4.1
          );
          stageTimeline.fromTo('.js-message-1 .hero-paper-title',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            4.4
          );
          stageTimeline.fromTo('.js-message-1 .hero-paper-description',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            4.7
          );
          // Fade out Message 1
          stageTimeline.to('.js-message-1', {
            opacity: 0,
            y: -15,
            duration: 0.5
          }, 5.9);
          stageTimeline.set('.js-message-1', { visibility: 'hidden' }, 6.4);

          // 6. Message 2 (EDITING) (Beat 07 & 08)
          stageTimeline.set('.js-message-2', { visibility: 'visible' }, 6.4);
          stageTimeline.to('.js-message-2', { opacity: 1, y: 0, duration: 0.1 }, 6.4);
          stageTimeline.fromTo('.js-message-2 .hero-paper-eyebrow',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            6.4
          );
          stageTimeline.fromTo('.js-message-2 .hero-paper-title',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            6.7
          );
          stageTimeline.fromTo('.js-message-2 .hero-paper-description',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            7.0
          );
          // Fade out Message 2 and container
          stageTimeline.to('.js-message-2', {
            opacity: 0,
            y: -15,
            duration: 0.5
          }, 8.0);
          stageTimeline.set('.js-message-2', { visibility: 'hidden' }, 8.5);
          stageTimeline.to('.js-paper-overlay', {
            opacity: 0,
            duration: 0.5
          }, 8.0);

          // 7. Final Reveal (Beat 09 & 10)
          stageTimeline.fromTo('.hero-final-veil',
            { opacity: 0 },
            { opacity: 1, duration: 0.8 },
            8.2
          );
          stageTimeline.fromTo('.hero-final-reveal',
            { opacity: 0, y: 24, xPercent: -50, yPercent: -50 },
            { opacity: 1, y: 0, xPercent: -50, yPercent: -50, duration: 0.8 },
            8.2
          );
          stageTimeline.fromTo('.hero-final-actions',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6 },
            8.7
          );

          // 8. Completed timeline end without hiding navbar
          if (useMobileFrames) {
            mobileProgressHandler = (progress: number) => {
              stageTimeline.progress(progress, false);
              scrollValRef.current = progress;
              updatePaperLayout(progress);
            };
            mobileFrameProgressHandlerRef.current = mobileProgressHandler;
          }
        }, section);

        updatePaperLayout(0);

        return () => {
          releaseMobileForwardGate();
          mobileFinalFrameReadyRef.current = false;
          if (mobileFrameProgressHandlerRef.current === mobileProgressHandler) {
            mobileFrameProgressHandlerRef.current = null;
          }
          animationContext.revert();
        };
      },
    );

    // Initial layout sync once trigger binds
    if (!isContactEditing()) ScrollTrigger.refresh();

    // Initial hash navigation scroll bypass
    const hash = window.location.hash;
    if (hash && hash !== '#' && !isContactEditing()) {
      const target = document.querySelector(hash);
      if (target) {
        ScrollTrigger.refresh();

        const lenis = getLenisInstance();
        if (lenis) {
          lenis.resize();
          lenis.scrollTo(target as HTMLElement, {
            immediate: true,
            offset: -96,
          });
          ScrollTrigger.update();
        }
      }
    }

    return () => {
      media.revert();
    };
  }, [isFirstFrameLoaded, prefersReducedMotion, useMobileFrames]);


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
