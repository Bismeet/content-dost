import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCappedFrameTarget } from '../src/components/hero/frameStep';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const heroSource = fs.readFileSync(
  path.resolve(__dirname, '../src/components/HeroScroll.tsx'),
  'utf8',
);
const rendererSource = fs.readFileSync(
  path.resolve(__dirname, '../src/components/hero/HeroSequenceRenderer.ts'),
  'utf8',
);

describe('mobile hero performance safeguards', () => {
  it('does not force the Canvas 2D fallback for mobile frames', () => {
    expect(heroSource).not.toMatch(/forceCanvas\s*=.*\|\|\s*useMobileFrames/);
    expect(heroSource).toContain("get('renderer') === 'canvas'");
  });

  it('uses smaller decoded bitmaps only for the mobile sequence', () => {
    expect(heroSource).toContain('decodeSize: useMobileFrames ? getMobileDecodeSize() : undefined');
    expect(rendererSource).toContain('resizeWidth: decodeSize.width');
    expect(rendererSource).toContain('resizeHeight: decodeSize.height');
  });

  it('prevents overlapping asynchronous frame renders', () => {
    expect(rendererSource).toContain('private renderInFlight = false');
    expect(rendererSource).toContain('this.scheduledRender !== null || this.renderInFlight');
  });

  it('uses a direct mobile timeline and delegates smoothing to the renderer', () => {
    expect(heroSource).toContain('scrub: useMobileFrames ? true : 0.75');
    expect(heroSource).toContain('maxFrameStep: useMobileFrames ? MOBILE_MAX_FRAME_STEP : undefined');
    expect(heroSource).toContain('MOBILE_MAX_FRAME_STEP = 1');
  });

  it('advances mobile text from rendered-frame progress', () => {
    expect(heroSource).toContain('onFrameRendered: (frameIndex) =>');
    expect(heroSource).toContain('mobileFrameProgressHandlerRef.current?.(');
    expect(heroSource).toContain('stageTimeline.progress(progress, false)');
    expect(rendererSource).toContain('this.options.onFrameRendered?.(target)');
  });

  it('absorbs forward input while the final mobile frames catch up', () => {
    expect(heroSource).not.toContain('self.scroll(self.end - 1)');
    expect(heroSource).toContain('MOBILE_FORWARD_EXIT_GATE_PROGRESS');
    expect(heroSource).toContain("window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })");
    expect(heroSource).toContain("window.addEventListener('wheel', handleWheel, { passive: false, capture: true })");
    expect(heroSource).toContain('releaseMobileForwardGate');
    expect(heroSource).toContain('engageMobileForwardGate(gateY)');
    expect(heroSource).toContain('lenis?.targetScroll ?? window.scrollY');
    expect(heroSource).toContain('lenis?.scrollTo(scrollY');
    expect(heroSource).toContain('lenis?.stop()');
    expect(heroSource).toContain('getLenisInstance()?.scrollTo(heroEndY');
    expect(heroSource).toContain("requestFrameRender(MOBILE_FRAME_URLS.length - 1, { holdAsGateTarget: true })");
    expect(heroSource).toContain("requestFrameRender(0, { immediate: true })");
    expect(rendererSource).toContain('options: { immediate?: boolean } = {}');
  });

  it('caps large forward and reverse frame jumps without slowing small ones', () => {
    expect(getCappedFrameTarget(10, 80, 2)).toBe(12);
    expect(getCappedFrameTarget(80, 10, 2)).toBe(78);
    expect(getCappedFrameTarget(10, 12, 2)).toBe(12);
    expect(getCappedFrameTarget(10, 11, 2)).toBe(11);
  });

  it('leaves uncapped desktop requests untouched', () => {
    expect(getCappedFrameTarget(10, 80)).toBe(80);
  });
});
