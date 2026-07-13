import { useRef, useEffect, useState } from 'react';

export default function WhyContentDost() {
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
    <section id="why-us" className="why-us-operating-section" ref={containerRef}>
      {/* Shared back panel rail lines connecting the cards visually */}
      <div className="why-operating-background-grid" aria-hidden="true" />
      
      <div className="container mx-auto px-6">
        
        {/* Section Header with static/animated reveal states */}
        <div className={`why-header-block ${isIntersecting ? 'header-revealed' : ''}`}>
          <span className="section-eyebrow">— WHY CONTENT DOST</span>
          <h2 className="why-main-title">
            <span className="why-title-line">Meticulous systems,</span>
            <span className="why-title-line font-editorial italic-serif" style={{ fontWeight: 400 }}>human judgment.</span>
          </h2>
          <p className="why-intro-text">
            A small, attentive creative partner built around the quality of the idea—not the volume of the output.
          </p>
        </div>

        {/* Asymmetric 3-Card Operating Grid */}
        <div className={`why-operating-grid ${!isIntersecting ? 'grid-paused' : ''}`}>
          
          {/* Card 01: Strategy & Execution (Spans Left side) */}
          <div 
            className="why-op-card strategy-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="card-ambient-glow" />
            <div className="card-border-glow" />
            
            <div className="card-3d-wrapper">
              {/* Scene 1: Idea-to-Execution Engine */}
              <div className="op-scene engine-scene" aria-hidden="true">
                <div className="engine-grid-floor" />
                
                {/* Floating raw idea block */}
                <div className="raw-idea-block" style={{ transform: 'translate3d(-52px, -38px, 20px)' }} />
                
                {/* Strategy compass dial */}
                <div className="strategy-wheel" style={{ transform: 'translate3d(0, -18px, 12px) rotateX(15deg)' }}>
                  <div className="wheel-notches" />
                  <div className="wheel-pointer" />
                </div>
                
                {/* Connected planning plates */}
                <div className="planning-plates" style={{ transform: 'translate3d(0, 18px, 10px)' }}>
                  <div className="plate plate-audience"><span className="plate-label font-mono">AUDIENCE</span></div>
                  <div className="plate plate-message"><span className="plate-label font-mono">MESSAGE</span></div>
                  <div className="plate plate-format"><span className="plate-label font-mono">FORMAT</span></div>
                </div>
                
                {/* Output visual object */}
                <div className="output-frame" style={{ transform: 'translate3d(52px, -32px, 22px)' }}>
                  <div className="frame-glow" />
                  <div className="frame-corners" />
                </div>

                {/* Connecting laser path */}
                <svg className="connecting-paths-svg" viewBox="0 0 300 160">
                  <path className="laser-path-line" d="M 60,50 C 110,30 110,130 150,110 C 190,90 200,40 240,55" fill="none" stroke="var(--cine-orange)" strokeWidth="1.5" strokeDasharray="5 4" />
                </svg>
              </div>

              {/* Text content in lower left */}
              <div className="card-copy-block text-left-lower">
                <span className="card-number font-mono">01</span>
                <h3 className="card-title">Strategy and Execution</h3>
                <p className="card-desc">We help shape the idea before the edit begins.</p>
              </div>
            </div>
          </div>

          {/* Card 02: Creator-Native Thinking (Top Right) */}
          <div 
            className="why-op-card creator-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="card-ambient-glow" />
            <div className="card-border-glow" />
            
            <div className="card-3d-wrapper">
              {/* Scene 2: Attention Lens */}
              <div className="op-scene lens-scene" aria-hidden="true">
                <div className="lens-assembly" style={{ transform: 'translate3d(48px, -14px, 18px)' }}>
                  <div className="lens-ring ring-outer" />
                  <div className="lens-ring ring-middle" />
                  <div className="lens-ring ring-inner" />
                  <div className="lens-focus-dot" />
                  <div className="lens-pulse" />
                </div>
                
                <svg className="lens-pacing-svg" viewBox="0 0 200 120">
                  <path className="pacing-wave" d="M 20,80 Q 55,20 90,80 T 160,70" fill="none" stroke="var(--cine-gold)" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="card-copy-block">
                <span className="card-number font-mono">02</span>
                <h3 className="card-title">Creator-Native Thinking</h3>
                <p className="card-desc">Every decision is made with attention, pacing and audience behaviour in mind.</p>
              </div>
            </div>
          </div>

          {/* Card 03: One Clear Workflow (Bottom Right) */}
          <div 
            className="why-op-card workflow-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="card-ambient-glow" />
            <div className="card-border-glow" />
            
            <div className="card-3d-wrapper">
              {/* Scene 3: Workflow Relay */}
              <div className="op-scene workflow-scene" aria-hidden="true">
                <div className="workflow-rail" style={{ transform: 'translate3d(0, -12px, 5px)' }} />
                
                <div className="workflow-nodes" style={{ transform: 'translate3d(0, -12px, 12px)' }}>
                  <div className="wf-node node-script"><span className="node-text font-mono">SCRIPT</span></div>
                  <div className="wf-node node-footage"><span className="node-text font-mono">FOOTAGE</span></div>
                  <div className="wf-node node-feedback"><span className="node-text font-mono">FEEDBACK</span></div>
                  <div className="wf-node node-approval"><span className="node-text font-mono">APPROVAL</span></div>
                </div>
                
                <div className="workflow-token" style={{ transform: 'translate3d(0, -12px, 18px)' }} />
              </div>

              <div className="card-copy-block">
                <span className="card-number font-mono">03</span>
                <h3 className="card-title">One Clear Workflow</h3>
                <p className="card-desc">Scripts, footage, feedback and approvals stay organised from beginning to end.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
