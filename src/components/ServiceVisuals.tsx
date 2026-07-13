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

// 03 — LONG-FORM EDITING: "Time Sculpture Studio"
function LongFormEditingVisual({ active }: VisualProps) {
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

// 04 — SHORTS AND REELS: "Attention Refraction Engine"
function ShortsReelsVisual({ active }: VisualProps) {
  return (
    <div className={`artifact-scene scene-shorts-reels ${active ? 'scene-active' : 'scene-inactive'}`}>
      <div className="refraction-engine" style={{ transform: 'translate3d(0, 0, 10px)' }}>
        {/* Horizontal Input Film Ribbon */}
        <div className="input-beam-ribbon" style={{ transform: 'translate3d(-64px, -16px, 12px)' }}>
          <span className="beam-pulse" />
        </div>

        {/* Central Refraction Prism */}
        <div className="refraction-prism" style={{ transform: 'translate3d(-8px, -16px, 24px)' }}>
          <div className="prism-glass" />
          <div className="prism-glow" />
        </div>

        {/* Three Standing Vertical Film Artifacts */}
        <div className="vertical-slab slab-1" style={{ transform: 'translate3d(24px, -6px, 28px) rotateY(-12deg)' }}>
          <div className="slab-aspect font-mono">9:16</div>
          <div className="slab-title font-mono">HOOK</div>
          <div className="slab-lines"><span /><span /></div>
          <div className="slab-guides" />
        </div>
        
        <div className="vertical-slab slab-2" style={{ transform: 'translate3d(54px, -12px, 34px) rotateY(-12deg)' }}>
          <div className="slab-aspect font-mono">9:16</div>
          <div className="slab-title font-mono font-bold" style={{ color: 'var(--cine-gold)' }}>RETAIN</div>
          <div className="slab-lines"><span /><span /><span /></div>
          <div className="slab-guides" />
        </div>

        <div className="vertical-slab slab-3" style={{ transform: 'translate3d(84px, -6px, 28px) rotateY(-12deg)' }}>
          <div className="slab-aspect font-mono">9:16</div>
          <div className="slab-title font-mono">CONVERT</div>
          <div className="slab-lines"><span /><span /></div>
          <div className="slab-guides" />
        </div>
      </div>
    </div>
  );
}

// 05 — PODCAST PRODUCTION: "Spatial Conversation Studio"
function PodcastProductionVisual({ active }: VisualProps) {
  return (
    <div className={`artifact-scene scene-podcast-production ${active ? 'scene-active' : 'scene-inactive'}`}>
      <div className="resonance-chamber" style={{ transform: 'translate3d(0, 0, 10px)' }}>
        {/* Circular Acoustic Desk */}
        <div className="acoustic-desk" style={{ transform: 'translate3d(0, 8px, 15px)' }}>
          <div className="desk-rim" />
        </div>

        {/* Microphones facing each other */}
        <div className="micro-sculpture host-mic" style={{ transform: 'translate3d(-42px, -18px, 28px)' }}>
          <div className="micro-grille-3d" />
          <div className="micro-suspension" />
          <div className="micro-arm" />
        </div>
        
        <div className="micro-sculpture guest-mic" style={{ transform: 'translate3d(32px, -22px, 24px)' }}>
          <div className="micro-grille-3d" />
          <div className="micro-suspension" />
          <div className="micro-arm" />
        </div>

        {/* Floating Acoustic Rings */}
        <div className="acoustic-ring ring-top" style={{ transform: 'translate3d(-6px, -38px, 20px)' }} />

        {/* Tactile Mixer Faders */}
        <div className="tactile-mixer" style={{ transform: 'translate3d(-18px, 22px, 34px)' }}>
          <div className="mixer-fader-3d f-1"><span className="f-knob" /></div>
          <div className="mixer-fader-3d f-2"><span className="f-knob" /></div>
        </div>

        {/* Output Waveform Ribbon exiting Port */}
        <div className="output-port" style={{ transform: 'translate3d(62px, 12px, 22px)' }}>
          <div className="port-glow" />
          <div className="wave-exit-ribbon" />
        </div>
      </div>
    </div>
  );
}

// 06 — VISUAL PACKAGING: "Thumbnail and Identity Forge"
function VisualPackagingVisual({ active }: VisualProps) {
  return (
    <div className={`artifact-scene scene-visual-packaging ${active ? 'scene-active' : 'scene-inactive'}`}>
      <div className="attention-forge" style={{ transform: 'translate3d(0, 0, 10px)' }}>
        {/* Background alternate stacks */}
        <div className="alt-design-card card-back-1" style={{ transform: 'translate3d(-52px, -24px, 12px) rotateY(18deg) rotate(-4deg)' }} />
        <div className="alt-design-card card-back-2" style={{ transform: 'translate3d(-38px, -18px, 16px) rotateY(18deg) rotate(-4deg)' }} />

        {/* Winning Composition on Pedestal */}
        <div className="winning-composition" style={{ transform: 'translate3d(24px, -8px, 28px)' }}>
          <div className="comp-grid" />
          <div className="comp-focal" />
          <div className="comp-title-block"><span /><span /></div>
          <div className="comp-badge font-mono">16:9</div>
        </div>

        {/* Attention Forge Rails */}
        <div className="forge-rail rail-h" style={{ transform: 'translate3d(24px, -28px, 32px)' }} />
        <div className="forge-rail rail-v" style={{ transform: 'translate3d(-18px, -8px, 32px)' }} />

        {/* Attention tracker lines */}
        <svg className="attention-paths" viewBox="0 0 200 120">
          <path className="eye-path" d="M 120,40 L 140,65 L 90,80" fill="none" stroke="var(--cine-orange)" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      </div>
    </div>
  );
}

// 07 — CHANNEL MANAGEMENT: "Broadcast Control Station"
function ChannelManagementVisual({ active }: VisualProps) {
  return (
    <div className={`artifact-scene scene-channel-management ${active ? 'scene-active' : 'scene-inactive'}`}>
      <div className="broadcast-station" style={{ transform: 'translate3d(0, 0, 10px)' }}>
        {/* Dispatch Console base */}
        <div className="dispatch-console" style={{ transform: 'translate3d(0, 12px, 15px)' }}>
          <div className="console-status font-mono">STATUS: ACTIVE</div>
        </div>

        {/* Floating Destination Cards */}
        <div className="destination-card dest-youtube" style={{ transform: 'translate3d(-56px, -24px, 28px) rotateY(15deg)' }}>
          <span className="dest-tag font-mono">YOUTUBE</span>
          <div className="dest-progress"><span className="progress-fill fill-yt" /></div>
        </div>

        <div className="destination-card dest-spotify" style={{ transform: 'translate3d(0px, -28px, 32px) rotateY(15deg)' }}>
          <span className="dest-tag font-mono">SPOTIFY</span>
          <div className="dest-progress"><span className="progress-fill fill-spot" /></div>
        </div>

        <div className="destination-card dest-instagram" style={{ transform: 'translate3d(56px, -24px, 28px) rotateY(15deg)' }}>
          <span className="dest-tag font-mono">INSTAGRAM</span>
          <div className="dest-progress"><span className="progress-fill fill-insta" /></div>
        </div>

        {/* Dispatch Laser connections */}
        <svg className="dispatch-lasers" viewBox="0 0 200 120">
          <line className="laser-beam beam-yt" x1="100" y1="90" x2="44" y2="40" stroke="rgba(244,185,66,0.15)" strokeWidth="1.5" />
          <line className="laser-beam beam-spot" x1="100" y1="90" x2="100" y2="35" stroke="rgba(244,185,66,0.15)" strokeWidth="1.5" />
          <line className="laser-beam beam-insta" x1="100" y1="90" x2="156" y2="40" stroke="rgba(244,185,66,0.15)" strokeWidth="1.5" />
        </svg>

        {/* Big tactile status lever */}
        <div className="status-lever" style={{ transform: 'translate3d(-20px, 18px, 35px)' }}>
          <span className="lever-post" />
          <span className="lever-handle-ball" />
        </div>
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

        {/* Six Interactive Scene Mounts */}
        <ContentStrategyVisual active={activeTab === 0} />
        <ScriptwritingVisual active={activeTab === 1} />
        <LongFormEditingVisual active={activeTab === 2} />
        <ShortsReelsVisual active={activeTab === 3} />
        <PodcastProductionVisual active={activeTab === 4} />
        <VisualPackagingVisual active={activeTab === 5} />
        <ChannelManagementVisual active={activeTab === 6} />
      </div>
    </div>
  );
}
