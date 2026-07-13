import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Results() {
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

    const tiltX = -((y / (rect.height / 2)) * 1.2);
    const tiltY = (x / (rect.width / 2)) * 1.2;
    const transX = (x / (rect.width / 2)) * 3;
    const transY = (y / (rect.height / 2)) * 3;

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
    <section id="results" className="results-outcome-section" ref={containerRef}>
      {/* Structural ambient track grids */}
      <div className="results-background-rails" aria-hidden="true" />
      
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Section Header */}
        <div className="results-header-block">
          <span className="section-eyebrow">— RESULTS</span>
          <h2>
            Built for <em className="font-editorial" style={{ fontWeight: 400 }}>real outcomes.</em>
          </h2>
          <p className="results-intro-text">
            Structural improvements and workflow clarity that you can feel in every review cycle.
          </p>
        </div>

        {/* 3D Outcome Chambers Stack */}
        <div className={`results-chambers-stack ${!isIntersecting ? 'chambers-paused' : ''}`}>
          
          {/* Card 01: REVIEW PIPELINE */}
          <div 
            className="outcome-chamber-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="chamber-ambient-glow" />
            <div className="chamber-border-glow" />
            
            <div className="chamber-3d-wrapper">
              {/* Left Content Area */}
              <div className="chamber-text-area">
                <span className="chamber-eyebrow font-mono">REVIEW PIPELINE</span>
                <h3 className="chamber-title">Faster review cycles</h3>
                <p className="chamber-desc">
                  Frame-accurate comments, organised revisions and clear approval states reduce unnecessary back-and-forth.
                </p>
                <div className="chamber-supporting font-mono">
                  One review thread from first cut to final approval.
                </div>
                <a href="#process" className="chamber-cta-link font-mono">
                  Explore the process <ArrowUpRight className="cta-arrow-icon" size={13} />
                </a>
              </div>

              {/* Right Visual Chamber (Approval Relay) */}
              <div className="chamber-visual-stage" aria-hidden="true">
                <div className="chamber-floor-grid" />
                
                {/* 3D Approval Track */}
                <div className="approval-track-line" style={{ transform: 'translate3d(0, 0, 5px)' }} />
                
                <div className="approval-stages" style={{ transform: 'translate3d(0, 0, 12px)' }}>
                  {/* Rough Cut */}
                  <div className="app-stage stage-rough">
                    <div className="stage-icon">🎬</div>
                    <span className="stage-label font-mono">ROUGH CUT</span>
                  </div>

                  {/* Client Note */}
                  <div className="app-stage stage-note">
                    {/* Floating feedback note */}
                    <div className="floating-feedback-badge font-mono">Trim intro</div>
                    <div className="stage-icon">💬</div>
                    <span className="stage-label font-mono">CLIENT NOTE</span>
                  </div>

                  {/* Revision */}
                  <div className="app-stage stage-revision">
                    <div className="stage-icon">🔄</div>
                    <span className="stage-label font-mono">REVISION</span>
                  </div>

                  {/* Approved */}
                  <div className="app-stage stage-approved">
                    <div className="approved-check-stamp">✓</div>
                    <div className="stage-icon">✓</div>
                    <span className="stage-label font-mono">APPROVED</span>
                  </div>
                </div>

                {/* Progress flow token */}
                <div className="approval-flow-token" style={{ transform: 'translate3d(0, 0, 18px)' }} />
              </div>
            </div>
          </div>

          {/* Card 02: BRAND CONSISTENCY */}
          <div 
            className="outcome-chamber-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="chamber-ambient-glow" />
            <div className="chamber-border-glow" />
            
            <div className="chamber-3d-wrapper">
              {/* Left Content Area */}
              <div className="chamber-text-area">
                <span className="chamber-eyebrow font-mono">BRAND CONSISTENCY</span>
                <h3 className="chamber-title">Aligned visual systems</h3>
                <p className="chamber-desc">
                  Typography, captions, colour, framing and sound treatments remain consistent across every format.
                </p>
                <div className="chamber-supporting font-mono">
                  One creative language across long-form, short-form and supporting assets.
                </div>
                <a href="#services" className="chamber-cta-link font-mono">
                  See the workflow <ArrowUpRight className="cta-arrow-icon" size={13} />
                </a>
              </div>

              {/* Right Visual Chamber (Identity Calibration Studio) */}
              <div className="chamber-visual-stage" aria-hidden="true">
                <div className="chamber-floor-grid" />
                
                {/* Calibration studio layout */}
                <div className="calibration-studio-inner" style={{ transform: 'translate3d(0, -10px, 12px)' }}>
                  
                  {/* Incoming skewed frames */}
                  <div className="skewed-card-frame frame-left">
                    <div className="frame-type font-mono">MANROPE</div>
                  </div>
                  
                  <div className="skewed-card-frame frame-center">
                    <div className="frame-colors">
                      <span className="color-dot dot-amber" />
                      <span className="color-dot dot-orange" />
                      <span className="color-dot dot-violet" />
                    </div>
                  </div>
                  
                  <div className="skewed-card-frame frame-right">
                    <div className="frame-aspect font-mono">9:16 REEL</div>
                  </div>

                  {/* Calibration alignment lines */}
                  <div className="calibration-guides" />
                  
                  {/* Studio lock plate */}
                  <div className="calibration-lock-plate font-mono">
                    GRID LOCKED
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 03: OPERATIONS */}
          <div 
            className="outcome-chamber-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="chamber-ambient-glow" />
            <div className="chamber-border-glow" />
            
            <div className="chamber-3d-wrapper">
              {/* Left Content Area */}
              <div className="chamber-text-area">
                <span className="chamber-eyebrow font-mono">OPERATIONS</span>
                <h3 className="chamber-title">One organised workspace</h3>
                <p className="chamber-desc">
                  Scripts, footage, edits, feedback and delivery files remain connected throughout the project.
                </p>
                <div className="chamber-supporting font-mono">
                  Less searching, fewer missed notes and one clear delivery path.
                </div>
                <a href="#process" className="chamber-cta-link font-mono">
                  Explore the process <ArrowUpRight className="cta-arrow-icon" size={13} />
                </a>
              </div>

              {/* Right Visual Chamber (Workspace Operations Relay) */}
              <div className="chamber-visual-stage" aria-hidden="true">
                <div className="chamber-floor-grid" />
                
                {/* Operations Track */}
                <div className="ops-relay-track" style={{ transform: 'translate3d(0, -6px, 8px)' }}>
                  <div className="ops-node node-script"><span className="ops-icon">📄</span></div>
                  <div className="ops-node node-footage"><span className="ops-icon">📹</span></div>
                  <div className="ops-node node-edit"><span className="ops-icon">✂</span></div>
                  <div className="ops-node node-review"><span className="ops-icon">👀</span></div>
                  <div className="ops-node node-delivery">
                    <div className="delivery-glow-pulse" />
                    <span className="ops-icon">🚀</span>
                  </div>
                </div>

                <svg className="ops-connections-svg" viewBox="0 0 280 120">
                  <path className="ops-active-path" d="M 30,55 C 70,25 90,85 110,55 C 130,25 150,85 170,55 C 190,25 210,85 240,55" fill="none" stroke="var(--cine-gold)" strokeWidth="1.5" strokeDasharray="5 4" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Qualitative Outcomes Inset Strip */}
        <div className="qualitative-outcomes-strip">
          <div className="outcome-strip-item">
            <span className="strip-icon">💬</span>
            <span className="strip-text font-mono">Clearer feedback</span>
          </div>
          <div className="outcome-strip-item">
            <span className="strip-icon">🎨</span>
            <span className="strip-text font-mono">Consistent creative direction</span>
          </div>
          <div className="outcome-strip-item">
            <span className="strip-icon">📂</span>
            <span className="strip-text font-mono">Organised project delivery</span>
          </div>
          <div className="outcome-strip-item">
            <span className="strip-icon">📱</span>
            <span className="strip-text font-mono">Platform-ready exports</span>
          </div>
        </div>

      </div>
    </section>
  );
}
