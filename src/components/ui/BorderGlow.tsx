import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './BorderGlow.css';

export interface BorderGlowProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  intensity?: 'standard' | 'strong' | 'subtle';
  children?: React.ReactNode;
}

export const BorderGlowOverlay = () => {
  return <div className="border-glow-overlay" aria-hidden="true" />;
};

export function useBorderGlow(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    let bounds: DOMRect | null = null;
    let rafId: number | null = null;

    const handlePointerEnter = () => {
      bounds = el.getBoundingClientRect();
      el.classList.add('border-glow-active');
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const rect = bounds || el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    const handlePointerLeave = () => {
      el.classList.remove('border-glow-active');
      bounds = null;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const handleResize = () => {
      if (el.classList.contains('border-glow-active')) {
        bounds = el.getBoundingClientRect();
      }
    };

    el.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    el.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [ref]);
}

const BorderGlow = forwardRef<HTMLElement, BorderGlowProps>(({
  as: Component = 'div',
  intensity = 'standard',
  className = '',
  children,
  ...props
}, ref) => {
  const containerRef = useRef<HTMLElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => containerRef.current!);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    const handlePointerEnter = () => {
      boundsRef.current = el.getBoundingClientRect();
      el.classList.add('border-glow-active');
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const rect = boundsRef.current || el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    const handlePointerLeave = () => {
      el.classList.remove('border-glow-active');
      boundsRef.current = null;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const handleResize = () => {
      if (el.classList.contains('border-glow-active')) {
        boundsRef.current = el.getBoundingClientRect();
      }
    };

    el.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    el.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <Component
      ref={containerRef}
      className={`border-glow-container border-glow-intensity-${intensity} ${className}`}
      {...props}
    >
      <BorderGlowOverlay />
      {children}
    </Component>
  );
});

BorderGlow.displayName = 'BorderGlow';

export default BorderGlow;
