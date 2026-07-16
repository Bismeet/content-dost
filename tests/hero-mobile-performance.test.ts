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
