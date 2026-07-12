import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PostHeroEffects() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const forceReducedMotion = import.meta.env.DEV
    && new URLSearchParams(window.location.search).has('reduced-motion');

  useEffect(() => {
    const root = rootRef.current?.closest('.post-hero-site');
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const siteRect = entry.target.getBoundingClientRect();
        setActive(entry.isIntersecting || siteRect.top <= window.innerHeight * 0.85);
      },
      { rootMargin: '-10% 0px -10% 0px', threshold: 0 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const glow = glowRef.current;
    const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!glow || !active || !precisePointer.matches || reducedMotion.matches || forceReducedMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      glow.style.setProperty('--cursor-x', `${event.clientX}px`);
      glow.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [active, forceReducedMotion]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || forceReducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const site = root.closest('.post-hero-site');
    if (!site) return;
    const context = gsap.context(() => {
      gsap.to('[data-parallax]', {
        y: (index) => [8, -14, 18][index % 3],
        ease: 'none',
        scrollTrigger: {
          trigger: site,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, root);
    return () => context.revert();
  }, [forceReducedMotion]);

  return (
    <div ref={rootRef} className={`post-hero-effects ${active ? 'post-hero-effects--active' : ''} ${forceReducedMotion ? 'post-hero-effects--reduced' : ''}`} aria-hidden="true">
      <div className="post-hero-grain" />
      <div className="cinematic-spotlight cinematic-spotlight--top" />
      <div className="cinematic-spotlight cinematic-spotlight--mid" />
      <div className="cinematic-grid" />
      <div className="editorial-decor editorial-decor--frame" data-parallax />
      <div className="editorial-decor editorial-decor--paper" data-parallax />
      <div className="editorial-decor editorial-decor--crop" data-parallax />
      <div ref={glowRef} className="cursor-glow" />
    </div>
  );
}
