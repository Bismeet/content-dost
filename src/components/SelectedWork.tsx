import { useState, useRef } from 'react';
import { portfolioItems } from '../content/siteContent';

export default function SelectedWork() {
  const [activeProject, setActiveProject] = useState(0);
  const activeItem = portfolioItems[activeProject];
  const cardRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
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

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
    e.currentTarget.style.setProperty('--trans-x', '0px');
    e.currentTarget.style.setProperty('--trans-y', '0px');
  };

  return (
    <section id="work" className="selected-work-section">
      <div className="work-grid-background-lines" aria-hidden="true" />
      
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="work-section-header">
          <span className="section-eyebrow">— SELECTED WORK</span>
          <h2>Content worth <em className="font-editorial" style={{ fontWeight: 400 }}>watching.</em></h2>
          <p className="work-section-intro">
            Selected concept work showing how we turn complex briefs into clear, watchable stories.
          </p>
        </div>

        {/* Cinematic Unified Project Exhibition Card */}
        <article 
          className="work-diorama-card" 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="card-ambient-overlay" />
          <div className="card-edge-highlight" />

          <div className="work-card-3d-grid-wrapper">
            
            {/* Left Side: Tactile Diorama Chamber */}
            <div className="work-diorama-chamber" aria-hidden="true">
              <div className="diorama-floor-grid" />
              <div className="diorama-rim-glow" />

              {/* Step-specific Diorama Engines */}
              <div className={`diorama-engine authority-engine ${activeProject === 0 ? 'active' : ''}`}>
                <div className="diorama-core-mount" />
                <div className="diorama-editing-rail-ring" />
                <div className="diorama-central-lens" />
                <div className="diorama-film-strip-in" />
                
                <div className="diorama-timeline-plates">
                  <span className="plate p-strategy font-mono">STRATEGY</span>
                  <span className="plate p-capture font-mono">CAPTURE</span>
                  <span className="plate p-edit font-mono">EDIT</span>
                </div>

                <div className="diorama-short-columns">
                  <span className="col col-1" />
                  <span className="col col-2" />
                  <span className="col col-3" />
                </div>

                <div className="diorama-audio-pulses">
                  <span /><span /><span />
                </div>

                <div className="diorama-2d-overlay-tag font-mono">LONG FORM → SHORT FORM</div>
                <div className="diorama-crop-mark crop-tl" />
                <div className="diorama-crop-mark crop-br" />
              </div>

              <div className={`diorama-engine launch-engine ${activeProject === 1 ? 'active' : ''}`}>
                <div className="diorama-identity-sphere" />
                <div className="diorama-lens-frame-bracket" />
                <div className="diorama-script-rail-wire" />
                
                <div className="diorama-sequence-track">
                  <span className="seq-node" />
                  <span className="seq-node" />
                  <span className="seq-node" />
                </div>

                <div className="diorama-2d-overlay-tag font-mono">CREATOR LAUNCH CONFIG</div>
                <div className="diorama-crop-mark crop-tl" />
                <div className="diorama-crop-mark crop-br" />
              </div>

              <div className={`diorama-engine podcast-loop-engine ${activeProject === 2 ? 'active' : ''}`}>
                <div className="diorama-mic-columns">
                  <div className="mic-column mic-left" />
                  <div className="mic-column mic-right" />
                </div>
                
                <div className="diorama-waveform-ring" />
                
                <div className="diorama-chapter-pins">
                  <span className="pin pin-1 font-mono">01:14</span>
                  <span className="pin pin-2 font-mono">03:45</span>
                </div>

                <div className="diorama-2d-overlay-tag font-mono">WAVEFORM ANALYSIS TERMINAL</div>
                <div className="diorama-crop-mark crop-tl" />
                <div className="diorama-crop-mark crop-br" />
              </div>

              <span className="diorama-active-dot" />
            </div>

            {/* Right Side: Editorial Info & Switcher */}
            <div className="work-editorial-info">
              
              {/* Copy Area */}
              <div className="work-info-copy-block">
                <span className="work-item-index font-mono">
                  0{activeProject + 1} — {activeItem.category}
                </span>
                <h3 className="work-item-title">{activeItem.title}</h3>
                <p className="work-item-description">{activeItem.solution}</p>
                
                {activeItem.capabilities && (
                  <div className="work-capability-tags">
                    {activeItem.capabilities.map(cap => (
                      <span key={cap} className="cap-tag font-mono">{cap}</span>
                    ))}
                  </div>
                )}

                <div className="work-action-button-strip">
                  <a href="#contact" className="work-explore-btn font-mono">
                    Explore the system ↗
                  </a>
                </div>
              </div>

              {/* Compact Switcher Rail */}
              <nav className="work-project-switcher-rail" role="tablist" aria-label="Concept projects navigation">
                {portfolioItems.map((item, index) => {
                  const isActive = activeProject === index;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`switcher-btn font-mono ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveProject(index)}
                    >
                      0{index + 1}
                    </button>
                  );
                })}
              </nav>

            </div>

          </div>

        </article>

      </div>
    </section>
  );
}
