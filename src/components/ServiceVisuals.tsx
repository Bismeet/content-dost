import { useEffect, useRef, useState } from 'react';

interface VisualProps {
  active: boolean;
}

// 01 — CONTENT STRATEGY: "Idea Cartography Table"
function ContentStrategyVisual({ active }: VisualProps) {
  return (
    <div className={`artifact-scene scene-content-strategy ${active ? 'scene-active' : 'scene-inactive'}`}>
      <div className="cartography-table" style={{ transform: 'translate3d(0, 0, 10px)' }}>
        {/* Strategy Roadmap paths */}
        <svg className="strategy-lines" viewBox="0 0 200 120">
          <path className="strategy-path path-1" d="M 25,85 C 65,45 80,75 110,50 C 140,25 155,50 175,25" fill="none" stroke="rgba(244,185,66,0.06)" strokeWidth="2.5" />
          <path className="strategy-path path-active" d="M 25,85 C 65,45 80,75 110,50 C 140,25 155,50 175,25" fill="none" stroke="var(--cine-gold)" strokeWidth="2.5" />
        </svg>

        {/* Scattered Map Cards (drawn in Z-depth) */}
        <div className="map-card card-audience" style={{ transform: 'translate3d(-52px, -24px, 20px) rotate(-6deg)' }}>
          <span className="card-lbl font-mono">AUDIENCE</span>
          <div className="card-lines"><span /><span /></div>
        </div>
        
        <div className="map-card card-hook" style={{ transform: 'translate3d(58px, -28px, 25px) rotate(4deg)' }}>
          <span className="card-lbl font-mono">HOOK</span>
          <div className="card-lines"><span /><span /></div>
        </div>

        <div className="map-card card-platform" style={{ transform: 'translate3d(32px, 20px, 15px) rotate(-3deg)' }}>
          <span className="card-lbl font-mono">PLATFORM</span>
          <div className="card-lines"><span /></div>
        </div>

        {/* Center Compass Instrument */}
        <div className="compass-dial" style={{ transform: 'translate3d(-20px, 12px, 32px)' }}>
          <div className="compass-face">
            <span className="compass-tick tick-n" />
            <span className="compass-tick tick-s" />
            <span className="compass-tick tick-e" />
            <span className="compass-tick tick-w" />
          </div>
          <div className="compass-needle-3d" />
          <div className="compass-glass" />
        </div>

        {/* Central Core Idea token */}
        <div className="core-idea-token" style={{ transform: 'translate3d(-8px, -18px, 35px)' }}>
          <div className="token-glow" />
          <span className="token-txt font-mono">IDEA</span>
        </div>

        {/* Queue timeline blocks */}
        <div className="publishing-queue" style={{ transform: 'translate3d(60px, 10px, 18px)' }}>
          <span className="q-block q-1" />
          <span className="q-block q-2" />
          <span className="q-block q-3" />
        </div>
      </div>
    </div>
  );
}

// 02 — SCRIPTWRITING: "Narrative Loom"
function ScriptwritingVisual({ active }: VisualProps) {
  return (
    <div className={`artifact-scene scene-scriptwriting ${active ? 'scene-active' : 'scene-inactive'}`}>
      <div className="narrative-loom" style={{ transform: 'translate3d(0, 0, 10px)' }}>
        {/* Loom Tracks/Spine */}
        <div className="loom-rails">
          <span className="rail rail-top" />
          <span className="rail rail-bottom" />
        </div>

        {/* Three Physical Gates */}
        <div className="loom-gate gate-hook" style={{ transform: 'translate3d(-54px, -14px, 20px)' }}>
          <span className="gate-lbl font-mono">HOOK</span>
          <div className="gate-pillar left" />
          <div className="gate-pillar right" />
          <div className="gate-aperture" />
        </div>
        
        <div className="loom-gate gate-build" style={{ transform: 'translate3d(0px, -20px, 20px)' }}>
          <span className="gate-lbl font-mono">BUILD</span>
          <div className="gate-pillar left" />
          <div className="gate-pillar right" />
          <div className="gate-aperture" />
        </div>
        
        <div className="loom-gate gate-payoff" style={{ transform: 'translate3d(54px, -14px, 20px)' }}>
          <span className="gate-lbl font-mono">PAYOFF</span>
          <div className="gate-pillar left" />
          <div className="gate-pillar right" />
          <div className="gate-aperture" />
        </div>

        {/* Woven Script Ribbon */}
        <div className="loom-script-ribbon" style={{ transform: 'translate3d(0, 2px, 25px)' }}>
          <div className="ribbon-text font-serif">"The retention hook resolves formatting..."</div>
          <span className="ribbon-glow" />
        </div>

        {/* Mechanical writing carriage */}
        <div className="loom-carriage" style={{ transform: 'translate3d(24px, 2px, 32px)' }}>
          <div className="carriage-head" />
          <div className="carriage-light" />
        </div>

        {/* Discarded snippets bin */}
        <div className="discard-tray" style={{ transform: 'translate3d(-65px, 22px, 14px) rotate(-8deg)' }}>
          <span className="discard-item font-mono">intro v1</span>
          <span className="discard-item font-mono">cliché hook</span>
        </div>
      </div>
    </div>
  );
}

// 03 — VIDEO EDITING: "Time Sculpture Studio"
function VideoEditingVisual({ active }: VisualProps) {
  return (
    <div className={`artifact-scene scene-long-form-editing ${active ? 'scene-active' : 'scene-inactive'}`}>
      <div className="time-sculpture" style={{ transform: 'translate3d(0, 0, 10px)' }}>
        {/* Timeline Tracks */}
        <div className="sculpture-track track-video" style={{ transform: 'translate3d(0, -22px, 15px)' }}>
          {/* Film frames snapping */}
          <div className="film-clip clip-A" style={{ transform: 'translate3d(-45px, 0, 8px)' }}>
            <span className="film-icon font-mono">A01_HERO</span>
            <div className="film-perf" />
          </div>
          <div className="film-clip clip-B" style={{ transform: 'translate3d(20px, 0, 8px)' }}>
            <span className="film-icon font-mono">B02_ZOOM</span>
            <div className="film-perf" />
          </div>
        </div>

        <div className="sculpture-track track-audio" style={{ transform: 'translate3d(0, 2px, 18px)' }}>
          <div className="audio-clip clip-wave" style={{ transform: 'translate3d(-15px, 0, 5px)' }}>
            <div className="sculpture-wave-strip" />
          </div>
        </div>

        {/* Sculpting Chamber block */}
        <div className="sculpting-chamber" style={{ transform: 'translate3d(-12px, -6px, 25px)' }}>
          <div className="chamber-top" />
          <div className="chamber-glow-interior" />
        </div>

        {/* Amber Playhead Blade */}
        <div className="playhead-blade" style={{ transform: 'translate3d(15px, -18px, 34px)' }}>
          <div className="blade-holder" />
          <div className="blade-light" />
        </div>

        {/* Projected final screen */}
        <div className="projection-screen" style={{ transform: 'translate3d(70px, -12px, 28px) rotateY(-10deg)' }}>
          <div className="screen-bezel" />
          <div className="projection-glow" />
        </div>
      </div>
    </div>
  );
}

// 04 — BRAND MANAGEMENT: "Identity Calibration System"
function BrandManagementVisual({ active }: VisualProps) {
  return (
    <div className={`artifact-scene scene-brand-management ${active ? 'scene-active' : 'scene-inactive'}`}>
      <div className="brand-calibration-system" style={{ transform: 'translate3d(0, 0, 10px)' }}>
        {/* Brand Identity Core */}
        <div className="brand-identity-core" style={{ transform: 'translate3d(0, -16px, 24px)' }}>
          <div className="identity-ring ring-outer" />
          <div className="identity-ring ring-middle" />
          <div className="identity-ring ring-inner" />
          <div className="identity-center-dot" />
        </div>

        {/* Scattered brand elements converging */}
        <div className="brand-element element-tone" style={{ transform: 'translate3d(-56px, -24px, 16px) rotate(-6deg)' }}>
          <span className="element-tag font-mono">TONE</span>
          <div className="element-line" />
        </div>
        
        <div className="brand-element element-colors" style={{ transform: 'translate3d(52px, -28px, 18px) rotate(4deg)' }}>
          <span className="element-tag font-mono">COLOURS</span>
          <div className="element-swatches">
            <span className="swatch swatch-1" />
            <span className="swatch swatch-2" />
            <span className="swatch swatch-3" />
          </div>
        </div>
        
        <div className="brand-element element-direction" style={{ transform: 'translate3d(-42px, 18px, 14px) rotate(-3deg)' }}>
          <span className="element-tag font-mono">DIRECTION</span>
          <div className="element-line" />
        </div>

        <div className="brand-element element-content" style={{ transform: 'translate3d(48px, 14px, 16px) rotate(2deg)' }}>
          <span className="element-tag font-mono">CONTENT</span>
          <div className="element-line" />
        </div>

        {/* Convergence lines */}
        <svg className="brand-convergence-paths" viewBox="0 0 200 120">
          <path className="convergence-line line-1" d="M 30,30 C 60,50 80,60 100,60" fill="none" stroke="var(--cine-gold)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path className="convergence-line line-2" d="M 170,28 C 140,48 120,58 100,60" fill="none" stroke="var(--cine-gold)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path className="convergence-line line-3" d="M 38,95 C 58,80 78,68 100,60" fill="none" stroke="var(--cine-orange)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path className="convergence-line line-4" d="M 162,90 C 142,78 122,68 100,60" fill="none" stroke="var(--cine-orange)" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>

        {/* Publishing consistency badge */}
        <div className="brand-status-badge font-mono" style={{ transform: 'translate3d(0, 26px, 28px)' }}>
          SYSTEM ACTIVE
        </div>
      </div>
    </div>
  );
}

// 05 — WEBSITE MAKING: "Website Assembly Studio"
function WebsiteMakingVisual({ active }: VisualProps) {
  return (
    <div className={`artifact-scene scene-website-making ${active ? 'scene-active' : 'scene-inactive'}`}>
      <div className="website-assembly-studio" style={{ transform: 'translate3d(0, 0, 10px)' }}>
        {/* Browser Frame */}
        <div className="browser-frame" style={{ transform: 'translate3d(0, -18px, 22px)' }}>
          <div className="browser-bar">
            <div className="browser-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="browser-url font-mono">contentdost.agency</div>
          </div>
          <div className="browser-viewport">
            {/* Layout grid inside */}
            <div className="layout-grid">
              <div className="grid-header" />
              <div className="grid-hero">
                <div className="hero-text-block">
                  <span className="text-line line-1" />
                  <span className="text-line line-2" />
                </div>
              </div>
              <div className="grid-content">
                <div className="content-col col-1" />
                <div className="content-col col-2" />
                <div className="content-col col-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating component blocks assembling into the browser */}
        <div className="component-float comp-typography" style={{ transform: 'translate3d(-62px, -32px, 14px) rotate(-8deg)' }}>
          <span className="comp-label font-mono">TYPE</span>
        </div>
        
        <div className="component-float comp-interactions" style={{ transform: 'translate3d(62px, -26px, 16px) rotate(5deg)' }}>
          <span className="comp-label font-mono">INTERACT</span>
        </div>

        <div className="component-float comp-responsive" style={{ transform: 'translate3d(-54px, 22px, 12px) rotate(-4deg)' }}>
          <span className="comp-label font-mono">RESPONSIVE</span>
        </div>

        {/* Assembly connection lines */}
        <svg className="assembly-paths" viewBox="0 0 200 120">
          <path className="assembly-line line-1" d="M 28,32 C 48,42 68,48 88,52" fill="none" stroke="var(--cine-gold)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path className="assembly-line line-2" d="M 172,36 C 152,44 132,50 112,52" fill="none" stroke="var(--cine-gold)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path className="assembly-line line-3" d="M 34,88 C 54,78 74,68 88,60" fill="none" stroke="var(--cine-orange)" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      </div>
    </div>
  );
}

interface StageProps {
  activeTab: number;
  activeService: {
    id: string;
    title: string;
  };
}

export function ServiceVisualStage({ activeTab }: StageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Monitor visibility to toggle pausing of CSS animations when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.05 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Direct, state-free custom property mouse tilt logic for high performance
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if ('ontouchstart' in window) return; // Disable tilt on touch devices
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = -((y / (rect.height / 2)) * 5); // max 5 deg
    const tiltY = (x / (rect.width / 2)) * 5; // max 5 deg
    const translateX = (x / (rect.width / 2)) * 6; // max 6px translation
    const translateY = (y / (rect.height / 2)) * 6; // max 6px translation

    e.currentTarget.style.setProperty('--tilt-x', `${tiltX}deg`);
    e.currentTarget.style.setProperty('--tilt-y', `${tiltY}deg`);
    e.currentTarget.style.setProperty('--trans-x', `${translateX}px`);
    e.currentTarget.style.setProperty('--trans-y', `${translateY}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
    e.currentTarget.style.setProperty('--trans-x', '0px');
    e.currentTarget.style.setProperty('--trans-y', '0px');
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`service-production-artifact ${!isIntersecting ? 'stage-paused' : ''}`}
      aria-hidden="true"
    >
      <div className="stage-interior">
        {/* Recessed Theater Layers */}
        <div className="artifact-stage-grid" />
        <div className="artifact-stage-spotlight" />
        <div className="artifact-stage-rimlight" />
        
        {/* Volumetric atmosphere particles */}
        <div className="volumetric-particles">
          <span className="dust-particle particle-1" />
          <span className="dust-particle particle-2" />
          <span className="dust-particle particle-3" />
        </div>

        {/* Shared Pedestal Base */}
        <div className="stage-pedestal" style={{ transform: 'translate3d(0, 0, 5px)' }}>
          <div className="pedestal-top" />
          <div className="pedestal-front" />
        </div>

        {/* Five Interactive Scene Mounts */}
        <ContentStrategyVisual active={activeTab === 0} />
        <ScriptwritingVisual active={activeTab === 1} />
        <VideoEditingVisual active={activeTab === 2} />
        <BrandManagementVisual active={activeTab === 3} />
        <WebsiteMakingVisual active={activeTab === 4} />
      </div>
    </div>
  );
}
