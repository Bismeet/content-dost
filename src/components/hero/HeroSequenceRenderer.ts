import { Application, Sprite, Texture } from 'pixi.js';
import { getCappedFrameTarget } from './frameStep';

type DecodedFrame = ImageBitmap | HTMLImageElement;
type Direction = 'forward' | 'backward';

interface QueuedFrame {
  index: number;
  priority: number;
  resolve: (source: DecodedFrame) => void;
  reject: (error: unknown) => void;
}

interface HeroSequenceRendererOptions {
  container: HTMLElement;
  fallbackCanvas: HTMLCanvasElement;
  frameUrls: string[];
  onFirstFrame: () => void;
  onFrameRendered?: (frameIndex: number) => void;
  onLoadingProgress?: (progress: number) => void;
  debugTarget?: HTMLElement;
  forceCanvas?: boolean;
  decodeSize?: Readonly<{ width: number; height: number }>;
  maxFrameStep?: number;
  preferHtmlImages?: boolean;
  simulateContextLoss?: boolean;
}

const FIRST_FRAME = 0;

function sourceSize(source: DecodedFrame) {
  return source instanceof HTMLImageElement
    ? { width: source.naturalWidth, height: source.naturalHeight }
    : { width: source.width, height: source.height };
}

function isImageBitmap(source: DecodedFrame): source is ImageBitmap {
  return typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap;
}

function loadHtmlImage(url: string, signal?: AbortSignal) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const abort = () => {
      image.src = '';
      reject(new DOMException('Frame load aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', abort, { once: true });
    image.onload = () => {
      signal?.removeEventListener('abort', abort);
      resolve(image);
    };
    image.onerror = () => {
      signal?.removeEventListener('abort', abort);
      reject(new Error(`Unable to load frame: ${url}`));
    };
    image.decoding = 'async';
    image.src = url;
  });
}

async function decodeFrame(
  url: string,
  signal?: AbortSignal,
  preferHtmlImages = false,
  decodeSize?: Readonly<{ width: number; height: number }>,
): Promise<DecodedFrame> {
  if (preferHtmlImages) return loadHtmlImage(url, signal);
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Unable to load frame: ${url}`);
  const blob = await response.blob();
  if ('createImageBitmap' in window) {
    try {
      // Mobile canvases render at CSS-pixel resolution, so retaining a decoded
      // 1080x1920 bitmap wastes memory and increases every GPU upload. Resize in
      // the browser's decoder before the frame enters either render path.
      return decodeSize
        ? await createImageBitmap(blob, {
            resizeWidth: decodeSize.width,
            resizeHeight: decodeSize.height,
            resizeQuality: 'high',
          })
        : await createImageBitmap(blob);
    } catch {
      // Some Safari/WebView combinations expose createImageBitmap but reject JPEG blobs.
    }
  }
  return loadHtmlImage(url, signal);
}

class CanvasSequenceFallback {
  private currentSource: DecodedFrame | null = null;
  private readonly canvas: HTMLCanvasElement;
  private readonly container: HTMLElement;
  private cachedRect: DOMRect | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
  ) {
    this.canvas = canvas;
    this.container = container;
  }

  show() {
    this.canvas.hidden = false;
  }

  hide() {
    this.canvas.hidden = true;
  }

  clearCache() {
    this.cachedRect = null;
  }

  render(source: DecodedFrame) {
    this.currentSource = source;
    this.resize();
  }

  resize() {
    if (!this.currentSource) return;
    const context = this.canvas.getContext('2d');
    if (!context) return;

    if (!this.cachedRect) {
      this.cachedRect = this.container.getBoundingClientRect();
    }
    const rect = this.cachedRect;
    const dpr = window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
    const pixelHeight = Math.max(1, Math.round(rect.height * dpr));
    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
    }

    const { width, height } = sourceSize(this.currentSource);
    const scale = Math.max(pixelWidth / width, pixelHeight / height);
    const drawWidth = width * scale;
    const drawHeight = height * scale;
    context.clearRect(0, 0, pixelWidth, pixelHeight);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(
      this.currentSource,
      (pixelWidth - drawWidth) / 2,
      (pixelHeight - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
  }
}

export class HeroSequenceRenderer {
  private readonly options: HeroSequenceRendererOptions;
  private app: Application | null = null;
  private sprite: Sprite | null = null;
  private readonly fallback: CanvasSequenceFallback;
  private readonly decodedCache = new Map<number, DecodedFrame>();
  private readonly textureCache = new Map<number, Texture>();
  private readonly loading = new Map<number, Promise<DecodedFrame>>();
  private readonly queue: QueuedFrame[] = [];
  private readonly abortController = new AbortController();
  private readonly activeAbortControllers = new Map<number, AbortController>();
  private resizeObserver: ResizeObserver | null = null;
  private scheduledRender: number | null = null;
  private renderInFlight = false;
  private immediateFrame: number | null = null;
  private requestedFrame = FIRST_FRAME;
  private renderedFrame = -1;
  private direction: Direction = 'forward';
  private activeLoads = 0;
  private destroyed = false;
  private usingCanvas = false;
  private contextLossCount = 0;
  private initialLoadedCount = 0;
  private textureSwitchTotalMs = 0;
  private textureSwitchCount = 0;
  private readonly isMobile = window.innerWidth < 1025;
  private readonly concurrentLoads = this.isMobile ? 4 : 6;
  private readonly decodedLimit = this.isMobile ? 32 : 48;
  private readonly behindCount = 8;
  private readonly aheadCount = 16;

  constructor(options: HeroSequenceRendererOptions) {
    this.options = options;
    this.fallback = new CanvasSequenceFallback(options.fallbackCanvas, options.container);
  }

  async init(initialFrame = FIRST_FRAME) {
    const firstSource = await this.getDecoded(FIRST_FRAME, -1000);
    if (this.destroyed) return;
    const initialSource = initialFrame === FIRST_FRAME
      ? firstSource
      : await this.getDecoded(initialFrame, -999);
    if (this.destroyed) return;
    this.fallback.show();
    this.fallback.render(initialSource);
    this.options.onFirstFrame();

    const pixiReady = await this.initPixi(initialSource, initialFrame);
    if (!pixiReady) this.usingCanvas = true;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.options.container);

    this.primeInitialFrames();
    this.requestFrame(initialFrame);
    this.publishDiagnostics();
  }

  requestFrame(index: number, options: { immediate?: boolean } = {}) {
    if (this.destroyed) return;
    const clamped = Math.max(FIRST_FRAME, Math.min(this.options.frameUrls.length - 1, index));
    if (options.immediate) {
      this.immediateFrame = clamped;
    } else if (this.immediateFrame !== null && clamped !== this.immediateFrame) {
      this.immediateFrame = null;
    }
    const priorRequest = this.requestedFrame;
    this.direction = clamped > priorRequest
      ? 'forward'
      : clamped < priorRequest
        ? 'backward'
        : this.direction;
    this.requestedFrame = clamped;

    if (this.scheduledRender !== null || this.renderInFlight) return;
    this.scheduledRender = requestAnimationFrame(() => {
      this.scheduledRender = null;
      void this.renderRequestedFrame();
    });
  }

  getDiagnostics() {
    return {
      renderer: this.usingCanvas ? 'canvas2d' : this.app?.renderer.name ?? 'initialising',
      requestedFrame: this.requestedFrame,
      renderedFrame: this.renderedFrame,
      direction: this.direction,
      maxFrameStep: this.options.maxFrameStep ?? null,
      decodedCacheSize: this.decodedCache.size,
      gpuTextureCacheSize: this.textureCache.size,
      loadingQueueSize: this.queue.length,
      activeLoads: this.activeLoads,
      averageTextureSwitchMs: this.textureSwitchCount > 0
        ? this.textureSwitchTotalMs / this.textureSwitchCount
        : 0,
      estimatedGpuMemoryMb: this.textureCache.size * 1280 * 720 * 4 / 1024 / 1024,
      screen: this.app ? [this.app.screen.width, this.app.screen.height] : null,
      sprite: this.sprite
        ? {
            x: this.sprite.x,
            y: this.sprite.y,
            scaleX: this.sprite.scale.x,
            scaleY: this.sprite.scale.y,
            textureWidth: this.sprite.texture.width,
            textureHeight: this.sprite.texture.height,
          }
        : null,
      activeResourceUrl: this.sprite?.texture.source.resource instanceof HTMLImageElement
        ? this.sprite.texture.source.resource.src
        : null,
    };
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.abortController.abort();
    for (const controller of this.activeAbortControllers.values()) {
      controller.abort();
    }
    this.activeAbortControllers.clear();
    if (this.scheduledRender !== null) cancelAnimationFrame(this.scheduledRender);
    this.scheduledRender = null;
    this.queue.splice(0).forEach((task) => task.reject(new DOMException('Renderer destroyed', 'AbortError')));
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.destroyPixi();
    for (const source of this.decodedCache.values()) {
      if (isImageBitmap(source)) source.close();
    }
    this.decodedCache.clear();
    this.loading.clear();
    delete this.options.debugTarget?.dataset.rendererDebug;
  }

  private async initPixi(firstSource: DecodedFrame, initialFrame: number) {
    if (!this.isGpuSuitable()) return false;
    try {
      const app = new Application();
      await app.init({
        resizeTo: this.options.container,
        backgroundAlpha: 0,
        antialias: false,
        autoDensity: true,
        resolution: this.isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5),
        preference: 'webgl',
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
        autoStart: false,
        sharedTicker: false,
      });
      if (this.destroyed) {
        app.destroy({ removeView: true }, true);
        return false;
      }

      app.stop();
      app.ticker.stop();
      app.canvas.className = 'pixi-hero-canvas';
      app.canvas.setAttribute('aria-hidden', 'true');
      app.canvas.addEventListener('webglcontextlost', this.handleContextLoss, false);
      app.canvas.addEventListener('webglcontextrestored', this.handleContextRestore, false);
      this.options.container.prepend(app.canvas);

      const texture = Texture.from(firstSource, true);
      const sprite = new Sprite(texture);
      app.stage.addChild(sprite);
      this.app = app;
      this.sprite = sprite;
      this.textureCache.set(initialFrame, texture);
      this.resizeSprite(firstSource);
      app.render();
      this.renderedFrame = initialFrame;
      this.fallback.hide();
      if (this.options.simulateContextLoss) {
        window.setTimeout(() => {
          if (this.destroyed || this.app !== app) return;
          app.canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
        }, 800);
      }
      return true;
    } catch {
      this.destroyPixi();
      this.fallback.show();
      return false;
    }
  }

  private isGpuSuitable() {
    if (this.options.forceCanvas) return false;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (memory !== undefined && memory < 2) return false;
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
        ?? probe.getContext('webgl', { failIfMajorPerformanceCaveat: true });
      if (!gl) return false;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    } catch {
      return false;
    }
  }

  private async renderRequestedFrame() {
    if (this.renderInFlight) return;
    this.renderInFlight = true;
    const target = this.getNextRenderTarget();

    try {
      if (target === this.renderedFrame) {
        this.updateDirectionalCache(target);
        return;
      }

      const source = await this.getDecoded(target, -1000);
      const latestTarget = this.getNextRenderTarget();
      if (this.destroyed || target !== latestTarget) return;

      const switchStartedAt = performance.now();
      if (this.usingCanvas || !this.app || !this.sprite) {
        this.fallback.show();
        this.fallback.render(source);
      } else {
        const texture = this.textureCache.get(target) ?? Texture.from(source, true);
        this.textureCache.set(target, texture);
        this.sprite.texture = texture;
        this.resizeSprite(source);
        this.app.render();
        this.fallback.hide();
      }
      this.renderedFrame = target;
      if (this.immediateFrame === target) this.immediateFrame = null;
      this.options.onFrameRendered?.(target);
      this.textureSwitchTotalMs += performance.now() - switchStartedAt;
      this.textureSwitchCount += 1;
      this.updateDirectionalCache(target);
      this.publishDiagnostics();
    } catch {
      // Keep the last valid frame visible and let the next scroll request retry.
    } finally {
      this.renderInFlight = false;
      if (!this.destroyed && this.requestedFrame !== this.renderedFrame) {
        this.requestFrame(this.requestedFrame);
      }
    }
  }

  private getNextRenderTarget() {
    if (this.immediateFrame !== null && this.requestedFrame === this.immediateFrame) {
      return this.immediateFrame;
    }
    return getCappedFrameTarget(
      this.renderedFrame,
      this.requestedFrame,
      this.options.maxFrameStep,
    );
  }

  private resize() {
    if (this.destroyed) return;
    this.fallback.clearCache();
    this.fallback.resize();
    if (!this.app || !this.sprite || this.usingCanvas) return;
    this.app.resize();
    const source = this.decodedCache.get(this.renderedFrame);
    if (source) this.resizeSprite(source);
    this.app.render();
  }

  private resizeSprite(source: DecodedFrame) {
    if (!this.app || !this.sprite) return;
    const { width, height } = sourceSize(source);
    const viewportWidth = this.app.screen.width;
    const viewportHeight = this.app.screen.height;
    const scale = Math.max(viewportWidth / width, viewportHeight / height);
    this.sprite.scale.set(scale);
    this.sprite.x = (viewportWidth - width * scale) / 2;
    this.sprite.y = (viewportHeight - height * scale) / 2;
  }

  private getDecoded(index: number, priority: number) {
    const cached = this.decodedCache.get(index);
    if (cached) {
      this.decodedCache.delete(index);
      this.decodedCache.set(index, cached);
      return Promise.resolve(cached);
    }
    const existing = this.loading.get(index);
    if (existing) return existing;

    const promise = new Promise<DecodedFrame>((resolve, reject) => {
      this.queue.push({ index, priority, resolve, reject });
      this.queue.sort((a, b) => a.priority - b.priority);
      this.pumpQueue();
    });
    this.loading.set(index, promise);
    return promise;
  }

  private pumpQueue() {
    while (!this.destroyed && this.activeLoads < this.concurrentLoads && this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) return;

      if (this.destroyed) {
        task.reject(new DOMException('Renderer destroyed', 'AbortError'));
        continue;
      }

      this.activeLoads += 1;
      const controller = new AbortController();
      this.activeAbortControllers.set(task.index, controller);
      const url = this.options.frameUrls[task.index];

      void decodeFrame(
        url,
        controller.signal,
        this.options.preferHtmlImages,
        this.options.decodeSize,
      )
        .then((source) => {
          if (this.destroyed) {
            if (isImageBitmap(source)) source.close();
            return;
          }
          this.decodedCache.set(task.index, source);
          this.initialLoadedCount += 1;
          this.options.onLoadingProgress?.(Math.min(100, Math.round((this.initialLoadedCount / 13) * 100)));
          this.trimDecodedCache();
          this.publishDiagnostics();
          task.resolve(source);
        })
        .catch((err) => {
          task.reject(err);
        })
        .finally(() => {
          this.activeAbortControllers.delete(task.index);
          this.loading.delete(task.index);
          this.activeLoads -= 1;
          this.pumpQueue();
        });
    }
  }

  private primeInitialFrames() {
    const initialAhead = this.options.decodeSize ? 24 : 11;
    for (let index = 1; index <= Math.min(initialAhead, this.options.frameUrls.length - 1); index += 1) {
      void this.getDecoded(index, index).catch(() => undefined);
    }
    void this.getDecoded(this.options.frameUrls.length - 1, initialAhead + 1).catch(() => undefined);
  }

  private updateDirectionalCache(currentFrame: number) {
    const backward = this.direction === 'backward';
    const minimum = Math.max(FIRST_FRAME, currentFrame - (backward ? this.aheadCount : this.behindCount));
    const maximum = Math.min(
      this.options.frameUrls.length - 1,
      currentFrame + (backward ? this.behindCount : this.aheadCount),
    );
    const prioritized: number[] = [];
    this.pruneQueuedFrames(minimum, maximum, currentFrame);
    if (backward) {
      for (let index = currentFrame - 1; index >= minimum; index -= 1) prioritized.push(index);
      for (let index = currentFrame + 1; index <= maximum; index += 1) prioritized.push(index);
    } else {
      for (let index = currentFrame + 1; index <= maximum; index += 1) prioritized.push(index);
      for (let index = currentFrame - 1; index >= minimum; index -= 1) prioritized.push(index);
    }
    prioritized.forEach((index, order) => {
      void this.getDecoded(index, 100 + order).catch(() => undefined);
    });
    this.trimGpuCache(minimum, maximum);
    this.trimDecodedCache();
  }

  private pruneQueuedFrames(minimum: number, maximum: number, currentFrame: number) {
    const finalFrame = this.options.frameUrls.length - 1;
    
    // 1. Prune pending tasks in the queue
    for (let index = this.queue.length - 1; index >= 0; index -= 1) {
      const task = this.queue[index];
      if (
        task.index === currentFrame
        || task.index === FIRST_FRAME
        || task.index === finalFrame
        || (task.index >= minimum && task.index <= maximum)
      ) continue;
      this.queue.splice(index, 1);
      this.loading.delete(task.index);
      task.reject(new DOMException('Frame left the active preload window', 'AbortError'));
    }

    // 2. Abort active downloads that are no longer in the active window
    for (const [index, controller] of this.activeAbortControllers) {
      if (
        index === currentFrame
        || index === FIRST_FRAME
        || index === finalFrame
        || (index >= minimum && index <= maximum)
      ) continue;
      controller.abort();
    }
  }

  private trimGpuCache(minimum: number, maximum: number) {
    const finalFrame = this.options.frameUrls.length - 1;
    for (const [index, texture] of this.textureCache) {
      if (index === this.renderedFrame || index === FIRST_FRAME || index === finalFrame) continue;
      if (index >= minimum && index <= maximum) continue;
      texture.destroy(true);
      this.textureCache.delete(index);
    }
  }

  private trimDecodedCache() {
    if (this.decodedCache.size <= this.decodedLimit) return;
    const finalFrame = this.options.frameUrls.length - 1;
    for (const [index, source] of this.decodedCache) {
      if (this.decodedCache.size <= this.decodedLimit) break;
      if (
        index === this.renderedFrame
        || index === this.requestedFrame
        || index === FIRST_FRAME
        || index === finalFrame
        || this.textureCache.has(index)
        || this.loading.has(index)
      ) continue;
      if (isImageBitmap(source)) source.close();
      this.decodedCache.delete(index);
    }
  }

  private handleContextLoss = (event: Event) => {
    event.preventDefault();
    this.contextLossCount += 1;
    this.usingCanvas = true;
    this.fallback.show();
    const source = this.decodedCache.get(this.renderedFrame) ?? this.decodedCache.get(FIRST_FRAME);
    if (source) this.fallback.render(source);
    this.publishDiagnostics();
  };

  private handleContextRestore = () => {
    if (this.contextLossCount > 1 || this.destroyed) return;
    // A single restoration is allowed; rebuild only the requested frame on demand.
    this.usingCanvas = false;
    this.requestedFrame = Math.max(FIRST_FRAME, this.renderedFrame);
    this.renderedFrame = -1;
    this.requestFrame(this.requestedFrame);
  };

  private destroyPixi() {
    if (!this.app) return;
    this.app.canvas.removeEventListener('webglcontextlost', this.handleContextLoss);
    this.app.canvas.removeEventListener('webglcontextrestored', this.handleContextRestore);
    if (this.sprite) {
      this.app.stage.removeChild(this.sprite);
      this.sprite.destroy({ texture: false, textureSource: false });
    }
    for (const texture of this.textureCache.values()) texture.destroy(true);
    this.textureCache.clear();
    this.sprite = null;
    this.app.destroy({ removeView: true }, { children: true, texture: false, textureSource: false });
    this.app = null;
  }

  private publishDiagnostics() {
    if (!this.options.debugTarget) return;
    this.options.debugTarget.dataset.rendererDebug = JSON.stringify(this.getDiagnostics());
  }
}
