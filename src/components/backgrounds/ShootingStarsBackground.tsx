import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CONTACT_EDITING_CHANGE_EVENT,
  isContactEditing,
} from '../../lib/contactFocus';

type StarType = 'small' | 'medium' | 'feature';

type ShootingStar = {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  length: number;
  width: number;
  headRadius: number;
  opacity: number;
  age: number;
  lifetime: number;
  type: StarType;
};

type DustParticle = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  driftX: number;
  driftY: number;
  twinkleSpeed: number;
  phase: number;
  depth: number;
  color: string;
};

type DeviceProfile = {
  width: number;
  height: number;
  dpr: number;
  targetFps: number;
  dustCount: number;
  maxStars: number;
  mobile: boolean;
  tablet: boolean;
};

const STAR_COLORS = {
  core: '#fff3cc',
  head: '#ffc45c',
  trail: '#ff8a24',
  trailDeep: '#b63f08',
};

const DUST_COLORS = [
  '216, 104, 20',
  '226, 156, 59',
  '244, 185, 66',
  '241, 210, 141',
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getDeviceProfile(): DeviceProfile {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const mobile = width < 768;
  const tablet = width >= 768 && width < 1100;
  return {
    width,
    height,
    mobile,
    tablet,
    dpr: mobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25),
    targetFps: mobile ? 22 : tablet ? 26 : 30,
    dustCount: mobile ? 65 : tablet ? 110 : 180,
    maxStars: mobile ? 3 : tablet ? 6 : 9,
  };
}

function createDust(profile: DeviceProfile): DustParticle[] {
  return Array.from({ length: profile.dustCount }, (_, index) => {
    const depthBand = index % 10;
    const depth = depthBand < 6 ? randomBetween(0.18, 0.42) : depthBand < 9 ? randomBetween(0.45, 0.72) : randomBetween(0.75, 1);
    const near = depth > 0.75;
    const mid = depth > 0.42 && !near;
    return {
      x: Math.random() * profile.width,
      y: Math.random() * profile.height,
      radius: near ? randomBetween(0.8, 1.3) : mid ? randomBetween(0.5, 1) : randomBetween(0.3, 0.7),
      opacity: near ? randomBetween(0.16, 0.4) : mid ? randomBetween(0.1, 0.26) : randomBetween(0.05, 0.15),
      driftX: randomBetween(0.8, 3.4) * depth,
      driftY: randomBetween(-4.2, -1.1) * depth,
      twinkleSpeed: randomBetween(0.00045, 0.0012),
      phase: Math.random() * Math.PI * 2,
      depth,
      color: DUST_COLORS[index % DUST_COLORS.length],
    };
  });
}

function getStarRanges(type: StarType, mobile: boolean) {
  if (mobile) {
    if (type === 'medium') {
      return {
        length: [105, 190] as const,
        width: [1.1, 1.8] as const,
        lifetime: [2.4, 3.6] as const,
        speed: [92, 154] as const,
        opacity: [0.46, 0.66] as const,
      };
    }
    return {
      length: [48, 125] as const,
      width: [0.7, 1.35] as const,
      lifetime: [2, 3.2] as const,
      speed: [72, 132] as const,
      opacity: [0.38, 0.6] as const,
    };
  }
  if (type === 'feature') {
    return { length: [260, 420] as const, width: [1.8, 2.8] as const, lifetime: [3.2, 5] as const, speed: [150, 250] as const, opacity: [0.58, 0.75] as const };
  }
  if (type === 'medium') {
    return { length: [140, 250] as const, width: [1.2, 2] as const, lifetime: [2.5, 3.8] as const, speed: [120, 205] as const, opacity: [0.48, 0.68] as const };
  }
  return { length: [70, 140] as const, width: [0.8, 1.4] as const, lifetime: [1.9, 3] as const, speed: [80, 148] as const, opacity: [0.34, 0.58] as const };
}

function createStar(id: number, type: StarType, profile: DeviceProfile): ShootingStar {
  const ranges = getStarRanges(type, profile.mobile);
  const angle = randomBetween(28, 52) * Math.PI / 180;
  const speed = randomBetween(ranges.speed[0], ranges.speed[1]);
  const length = randomBetween(ranges.length[0], ranges.length[1]);
  return {
    id,
    type,
    x: randomBetween(-length * 0.55, profile.width * 0.9),
    y: randomBetween(-length * 0.75, profile.height * 0.48),
    velocityX: Math.cos(angle) * speed,
    velocityY: Math.sin(angle) * speed,
    length,
    width: randomBetween(ranges.width[0], ranges.width[1]),
    headRadius: type === 'feature' ? randomBetween(1.5, 2.2) : randomBetween(0.8, 1.45),
    opacity: randomBetween(ranges.opacity[0], ranges.opacity[1]),
    age: 0,
    lifetime: randomBetween(ranges.lifetime[0], ranges.lifetime[1]),
  };
}

function lifeOpacity(star: ShootingStar) {
  const progress = star.age / star.lifetime;
  if (progress < 0.15) return progress / 0.15;
  if (progress > 0.7) return Math.max(0, 1 - (progress - 0.7) / 0.3);
  return 1;
}

function drawDust(context: CanvasRenderingContext2D, dust: DustParticle[], time: number, animate: boolean, delta: number, profile: DeviceProfile) {
  for (const particle of dust) {
    if (animate) {
      particle.x += particle.driftX * delta;
      particle.y += particle.driftY * delta;
      if (particle.y < -4) particle.y = profile.height + 4;
      if (particle.x > profile.width + 4) particle.x = -4;
    }
    const twinkle = animate ? 0.68 + Math.sin(time * particle.twinkleSpeed + particle.phase) * 0.32 : 0.8;
    const alpha = particle.opacity * twinkle;
    context.beginPath();
    context.fillStyle = `rgba(${particle.color}, ${alpha})`;
    if (particle.depth > 0.75) {
      context.shadowColor = `rgba(${particle.color}, ${alpha * 0.65})`;
      context.shadowBlur = 5;
    }
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
  }
}

function drawStar(context: CanvasRenderingContext2D, star: ShootingStar, mobile: boolean) {
  const alpha = lifeOpacity(star) * star.opacity;
  if (alpha <= 0) return;
  const magnitude = Math.hypot(star.velocityX, star.velocityY) || 1;
  const unitX = star.velocityX / magnitude;
  const unitY = star.velocityY / magnitude;
  const tailX = star.x - unitX * star.length;
  const tailY = star.y - unitY * star.length;
  const glowScale = mobile ? 0.6 : 1;

  context.save();
  context.globalCompositeOperation = 'lighter';
  context.lineCap = 'round';

  const afterglow = context.createLinearGradient(tailX, tailY, star.x, star.y);
  afterglow.addColorStop(0, 'rgba(182, 63, 8, 0)');
  afterglow.addColorStop(0.52, `rgba(182, 63, 8, ${0.035 * alpha})`);
  afterglow.addColorStop(1, `rgba(255, 138, 36, ${0.18 * alpha})`);
  context.strokeStyle = afterglow;
  context.lineWidth = star.width * 4.5 * glowScale;
  context.shadowColor = 'rgba(255, 106, 22, 0.42)';
  context.shadowBlur = 18 * glowScale;
  context.beginPath();
  context.moveTo(tailX, tailY);
  context.lineTo(star.x, star.y);
  context.stroke();

  const trail = context.createLinearGradient(tailX, tailY, star.x, star.y);
  trail.addColorStop(0, 'rgba(182, 63, 8, 0)');
  trail.addColorStop(0.58, `rgba(255, 106, 22, ${0.14 * alpha})`);
  trail.addColorStop(0.86, `rgba(255, 164, 52, ${0.58 * alpha})`);
  trail.addColorStop(1, `rgba(255, 244, 204, ${0.96 * alpha})`);
  context.strokeStyle = trail;
  context.lineWidth = star.width;
  context.shadowColor = 'rgba(255, 139, 36, 0.7)';
  context.shadowBlur = 12 * glowScale;
  context.beginPath();
  context.moveTo(tailX, tailY);
  context.lineTo(star.x, star.y);
  context.stroke();

  const centerStartX = star.x - unitX * star.length * 0.34;
  const centerStartY = star.y - unitY * star.length * 0.34;
  const core = context.createLinearGradient(centerStartX, centerStartY, star.x, star.y);
  core.addColorStop(0, 'rgba(255, 164, 52, 0)');
  core.addColorStop(1, `rgba(255, 243, 204, ${0.9 * alpha})`);
  context.strokeStyle = core;
  context.lineWidth = Math.max(0.55, star.width * 0.48);
  context.shadowBlur = 5 * glowScale;
  context.beginPath();
  context.moveTo(centerStartX, centerStartY);
  context.lineTo(star.x, star.y);
  context.stroke();

  const headGlow = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.headRadius * 5 * glowScale);
  headGlow.addColorStop(0, `rgba(255, 250, 224, ${alpha})`);
  headGlow.addColorStop(0.18, `rgba(255, 195, 75, ${0.9 * alpha})`);
  headGlow.addColorStop(0.52, `rgba(255, 109, 27, ${0.3 * alpha})`);
  headGlow.addColorStop(1, 'rgba(255, 90, 10, 0)');
  context.fillStyle = headGlow;
  context.beginPath();
  context.arc(star.x, star.y, star.headRadius * 5 * glowScale, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = STAR_COLORS.core;
  context.globalAlpha = Math.min(1, alpha * 1.2);
  context.beginPath();
  context.arc(star.x, star.y, star.headRadius * 0.72, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

export default function ShootingStarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const documentVisibleRef = useRef(document.visibilityState === 'visible');
  const profileRef = useRef<DeviceProfile | null>(null);
  const dustRef = useRef<DustParticle[]>([]);
  const starsRef = useRef<ShootingStar[]>([]);
  const nextIdRef = useRef(1);
  const nextSpawnRef = useRef(0);
  const nextFeatureRef = useRef(0);
  const lastFrameRef = useRef(0);
  const startLoopRef = useRef<() => void>(() => undefined);
  const stopLoopRef = useRef<() => void>(() => undefined);
  const [visible, setVisible] = useState(false);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || (import.meta.env.DEV && new URLSearchParams(window.location.search).has('reduced-motion'));

  const updateVisibility = useCallback((nextVisible: boolean) => {
    if (visibleRef.current === nextVisible) return;
    visibleRef.current = nextVisible;
    setVisible(nextVisible);
    if (nextVisible && documentVisibleRef.current && !reducedMotion) startLoopRef.current();
    else stopLoopRef.current();
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    const site = layer?.closest('.post-hero-site');
    if (!canvas || !layer || !site) return;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;
    let disposed = false;
    let renderCount = 0;
    let resizeObserver: ResizeObserver | null = null;

    const render = (time: number, delta: number, animate: boolean) => {
      const profile = profileRef.current;
      if (!profile) return;
      context.clearRect(0, 0, profile.width, profile.height);
      drawDust(context, dustRef.current, time, animate, delta, profile);
      if (animate) {
        for (const star of starsRef.current) {
          star.age += delta;
          star.x += star.velocityX * delta;
          star.y += star.velocityY * delta;
          drawStar(context, star, profile.mobile);
        }
        starsRef.current = starsRef.current.filter((star) => star.age < star.lifetime);

        if (time >= nextSpawnRef.current && starsRef.current.length < profile.maxStars) {
          const featureDue = !profile.mobile
            && time >= nextFeatureRef.current
            && !starsRef.current.some((star) => star.type === 'feature');
          const type: StarType = featureDue ? 'feature' : Math.random() < 0.44 ? 'medium' : 'small';
          starsRef.current.push(createStar(nextIdRef.current++, type, profile));
          nextSpawnRef.current = time + randomBetween(
            profile.mobile ? 1600 : profile.tablet ? 800 : 550,
            profile.mobile ? 3200 : profile.tablet ? 1900 : 1400,
          );
          if (featureDue) nextFeatureRef.current = time + randomBetween(3800, 6500);
        }
      } else {
        for (const star of starsRef.current) drawStar(context, star, profile.mobile);
      }

      if (import.meta.env.DEV) {
        renderCount += 1;
        canvas.dataset.renderCount = String(renderCount);
        canvas.dataset.starCount = String(starsRef.current.length);
        canvas.dataset.dustCount = String(dustRef.current.length);
        canvas.dataset.targetFps = String(profile.targetFps);
        canvas.dataset.rendererDpr = String(profile.dpr);
      }
    };

    const stopLoop = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastFrameRef.current = 0;
    };

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const profile = profileRef.current;
      if (!profile || !visibleRef.current || !documentVisibleRef.current || reducedMotion) return;
      const interval = 1000 / profile.targetFps;
      const elapsed = time - lastFrameRef.current;
      if (lastFrameRef.current && elapsed < interval) return;
      const delta = lastFrameRef.current ? Math.min(elapsed, 50) / 1000 : 0;
      lastFrameRef.current = lastFrameRef.current ? time - (elapsed % interval) : time;
      render(time, delta, true);
    };

    const startLoop = () => {
      if (disposed || reducedMotion || rafRef.current !== null || !visibleRef.current || !documentVisibleRef.current) return;
      const now = performance.now();
      if (!nextSpawnRef.current) nextSpawnRef.current = now + randomBetween(180, 500);
      if (!nextFeatureRef.current) nextFeatureRef.current = now + randomBetween(3800, 6500);
      rafRef.current = requestAnimationFrame(animate);
    };

    startLoopRef.current = startLoop;
    stopLoopRef.current = stopLoop;

    const resize = () => {
      const currentProfile = profileRef.current;
      const widthChanged = currentProfile
        ? Math.abs(document.documentElement.clientWidth - currentProfile.width) > 2
        : true;
      if (isContactEditing() && !widthChanged) return;
      const profile = getDeviceProfile();
      profileRef.current = profile;
      canvas.width = Math.floor(profile.width * profile.dpr);
      canvas.height = Math.floor(profile.height * profile.dpr);
      canvas.style.width = `${profile.width}px`;
      canvas.style.height = `${profile.height}px`;
      context.setTransform(profile.dpr, 0, 0, profile.dpr, 0, 0);
      dustRef.current = createDust(profile);
      render(performance.now(), 0, false);
    };

    const onVisibilityChange = () => {
      documentVisibleRef.current = document.visibilityState === 'visible';
      if (!documentVisibleRef.current) stopLoop();
      else if (visibleRef.current && !reducedMotion) startLoop();
      lastFrameRef.current = 0;
    };

    const onContactEditingChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ active: boolean }>;
      if (customEvent.detail.active) {
        stopLoop();
      } else if (visibleRef.current && documentVisibleRef.current && !reducedMotion) {
        startLoop();
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => updateVisibility(entry.isIntersecting),
      { threshold: 0 },
    );
    intersectionObserver.observe(site);
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);
    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener(CONTACT_EDITING_CHANGE_EVENT, onContactEditingChange);
    resize();
    if (reducedMotion) render(performance.now(), 0, false);

    return () => {
      disposed = true;
      stopLoop();
      intersectionObserver.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener(CONTACT_EDITING_CHANGE_EVENT, onContactEditingChange);
      dustRef.current = [];
      starsRef.current = [];
      profileRef.current = null;
      startLoopRef.current = () => undefined;
      stopLoopRef.current = () => undefined;
    };
  }, [reducedMotion, updateVisibility]);

  return (
    <div ref={layerRef} className="shooting-stars-layer" data-visible={visible} data-reduced-motion={reducedMotion} aria-hidden="true">
      <canvas ref={canvasRef} className="shooting-stars-canvas" />
    </div>
  );
}
