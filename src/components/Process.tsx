import { useState, useRef, useEffect } from 'react';
import { processSteps } from '../content/siteContent';

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const selectedStep = processSteps[activeStep];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.05 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if ('ontouchstart' in window) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = -((y / (rect.height / 2)) * 1.5);
    const tiltY = (x / (rect.width / 2)) * 1.5;
    const transX = (x / (rect.width / 2)) * 4;
    const transY = (y / (rect.height / 2)) * 4;

    e.currentTarget.style.setProperty('--tilt-x', `${tiltX}deg`);
    e.currentTarget.style.setProperty('--tilt-y', `${tiltY}deg`);
    e.currentTarget.style.setProperty('--trans-x', `${transX}px`);
    e.currentTarget.style.setProperty('--trans-y', `${transY}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
    e.currentTarget.style.setProperty('--trans-x', '0px');
    e.currentTarget.style.setProperty('--trans-y', '0px');
  };

  return (
    <section id="process" className="process-core-section" ref={containerRef}>
      {/* Structural ambient track grids */}
      <div className="process-background-grid-overlay" aria-hidden="true" />
      
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className={`process-header-block ${isIntersecting ? 'header-revealed' : ''}`}>
          <span className="section-eyebrow">— OUR PROCESS</span>
          <h2>
            From thought to <em className="font-editorial" style={{ fontWeight: 400 }}>final upload.</em>
          </h2>
          <p className="process-intro-text">
            One clear workflow from the first idea to the final delivery.
          </p>
        </div>

        {/* Cinematic Layout Split */}
        <div className="process-cinematic-split">
          
          {/* Left vertical timeline steps */}
          <div className="process-vertical-timeline" role="tablist" aria-label="Production steps">
            <div className="timeline-metallic-rail" aria-hidden="true" />
            
            {processSteps.map((step, index) => {
              const isActive = activeStep === index;
              const isPast = index < activeStep;
              return (
                <button
                  type="button"
                  key={step.step}
                  className={`process-stage-btn ${isActive ? 'stage-btn--active' : ''} ${isPast ? 'stage-btn--past' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="process-core-card"
                  onClick={() => setActiveStep(index)}
                >
                  <div className="stage-btn-node">
                    <span className="node-num font-mono">{step.step}</span>
                  </div>
                  <strong className="stage-btn-title">{step.title}</strong>
                </button>
              );
            })}
          </div>

          {/* Right Core visual card */}
          <article 
            id="process-core-card" 
            className={`process-core-card ${!isIntersecting ? 'process-paused' : ''}`} 
            role="tabpanel"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="card-ambient-glow" />
            <div className="card-border-glow" />
            
            <div className="card-3d-wrapper">
              
              {/* Header inside the card */}
              <div className="process-card-header">
                <span className="process-card-number font-mono">{selectedStep.step}</span>
                <h3 className="process-card-title">{selectedStep.title}</h3>
                <p className="process-card-description">{selectedStep.description}</p>
              </div>

              {/* Shared Instrument Stage */}
              <div className="process-instrument-stage" aria-hidden="true">
                
                {/* Visual Engine Base Platform */}
                <div className="engine-base-platform">
                  <div className="platform-grid-overlay" />
                  <div className="platform-border" />
                  <div className="platform-support platform-left" />
                  <div className="platform-support platform-right" />
                </div>

                {/* Central Workflow Chamber Backdrop */}
                <div className="workflow-core-chamber">
                  <div className="chamber-glass-shield" />
                  <div className="chamber-glow-core" />
                  <div className="chamber-structural-ribs">
                    <span className="rib" />
                    <span className="rib" />
                    <span className="rib" />
                  </div>
                </div>

                {/* Left/Right Terminal Modules */}
                <div className="engine-module-node node-left-distributor">
                  <div className="node-port" />
                  <div className="node-connection-wire" />
                </div>
                <div className="engine-module-node node-right-collector">
                  <div className="node-port" />
                  <div className="node-connection-wire" />
                </div>

                {/* Step 1: Idea (Distillation Chamber) */}
                <div className={`instrument-scene scene-idea ${activeStep === 0 ? 'active' : ''}`}>
                  <div className="distill-chamber">
                    <div className="distill-scattered-dots">
                      <div className="tag-node t-audience font-mono">AUDIENCE</div>
                      <div className="tag-node t-topic font-mono">TOPIC</div>
                      <div className="tag-node t-timing font-mono">FORMAT</div>
                    </div>
                    <div className="distill-glass-tube">
                      <div className="tube-inner-core" />
                      <div className="tube-scanner-ring" />
                    </div>
                    <div className="distill-needle-probe" />
                  </div>
                </div>

                {/* Step 2: Script (Narrative Loom) */}
                <div className={`instrument-scene scene-script ${activeStep === 1 ? 'active' : ''}`}>
                  <div className="narrative-loom">
                    <div className="loom-story-spine-line" />
                    <div className="loom-gates-container">
                      <div className="gate-rail-node font-mono"><span>H</span><span>HOOK</span></div>
                      <div className="gate-rail-node font-mono"><span>B</span><span>BUILD</span></div>
                      <div className="gate-rail-node font-mono"><span>P</span><span>PAYOFF</span></div>
                    </div>
                    <svg className="loom-ribbon-laser-svg" viewBox="0 0 240 100">
                      <path className="loom-laser-path-line" d="M 10,50 C 40,20 80,80 120,50 C 160,20 200,80 230,50" fill="none" stroke="var(--cine-gold)" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Step 3: Produce (Capture Stage) */}
                <div className={`instrument-scene scene-produce ${activeStep === 2 ? 'active' : ''}`}>
                  <div className="capture-stage-inner">
                    <div className="camera-turret-block">
                      <div className="turret-lens-barrel" />
                      <div className="turret-aperture-ring" />
                      <div className="turret-sensor-glow" />
                    </div>
                    <div className="spotlight-cone-overlay">
                      <div className="cone-light" />
                    </div>
                    <div className="media-recording-monitor">
                      <div className="monitor-frame">
                        <div className="monitor-signal font-mono">REC [60fps]</div>
                        <div className="monitor-level-meter">
                          <span /><span /><span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Edit (Time Sculpture Engine) */}
                <div className={`instrument-scene scene-edit ${activeStep === 3 ? 'active' : ''}`}>
                  <div className="time-sculpture">
                    <div className="timeline-rails-chassis">
                      <div className="rail-line-top" />
                      <div className="rail-line-bottom" />
                    </div>
                    <div className="timeline-block-sequences">
                      <div className="sequence-block seq-1 font-mono">RAW</div>
                      <div className="sequence-block seq-2 font-mono">RHYTHM</div>
                      <div className="sequence-block seq-3 font-mono">AUDIO</div>
                    </div>
                    <div className="timeline-laser-slicing-blade" />
                  </div>
                </div>

                {/* Step 5: Review (Feedback Relay) */}
                <div className={`instrument-scene scene-review ${activeStep === 4 ? 'active' : ''}`}>
                  <div className="feedback-relay-inner">
                    <div className="review-document-console">
                      <div className="console-doc-body">
                        <span className="c-line" />
                        <span className="c-line" />
                        <span className="c-line" />
                      </div>
                    </div>
                    <div className="floating-feedback-bubbles">
                      <div className="bubble-tag tag-trim font-mono">TRIM ROUGH CUT</div>
                      <div className="bubble-tag tag-color font-mono">ADJUST CONTRAST</div>
                    </div>
                    <div className="feedback-approval-stamp-seal font-mono">APPROVED</div>
                  </div>
                </div>

                {/* Step 6: Publish (Launch Gate) */}
                <div className={`instrument-scene scene-publish ${activeStep === 5 ? 'active' : ''}`}>
                  <div className="launch-gate-inner">
                    <div className="mechanical-hatch-doors">
                      <div className="hatch-door h-door-left" />
                      <div className="hatch-door h-door-right" />
                    </div>
                    <div className="launch-platform-rail" />
                    <div className="gliding-export-plates">
                      <div className="plate-format-card plate-desktop font-mono">16:9 YT</div>
                      <div className="plate-format-card plate-mobile font-mono">9:16 REEL</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Inset Deliverable Result Strip */}
              <div className="process-card-deliverable font-mono">
                <span className="deliverable-label">WHAT YOU RECEIVE</span>
                <p className="deliverable-text">{selectedStep.detail}</p>
              </div>

            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
