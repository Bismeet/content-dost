import { useState } from 'react';
import { processSteps } from '../content/siteContent';

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const selectedStep = processSteps[activeStep];

  return (
    <section id="process" className="py-24 bg-[var(--ink)] border-b border-white/5 scroll-mt-20">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="section-eyebrow">Our Process</span>
          <h2>From thought to <em className="font-editorial">final upload.</em></h2>
          <p style={{ maxWidth: '36rem', fontSize: '1.05rem' }}>
            One clear workflow from the first idea to the final delivery.
          </p>
        </div>

        <div className="process-cinematic-layout">
          <div className="process-timeline" role="tablist" aria-label="Production process">
          {processSteps.map((step, index) => (
            <button
              type="button"
              key={step.step}
              className={`process-stage ${activeStep === index ? 'process-stage--active' : ''}`}
              role="tab"
              aria-selected={activeStep === index}
              aria-controls="process-detail"
              onClick={() => setActiveStep(index)}
            >
              <span>{step.step}</span>
              <strong>{step.title}</strong>
              <i aria-hidden="true" />
            </button>
          ))}
          </div>

          <article id="process-detail" className="process-detail" role="tabpanel">
            <span className="process-detail-number">{selectedStep.step}</span>
            <h3>{selectedStep.title}</h3>
            <p>{selectedStep.description}</p>
            <div className="process-artifact" aria-hidden="true">
              <div className="process-waveform">
                {Array.from({ length: 22 }, (_, index) => <span key={index} />)}
              </div>
              <div className="process-playhead" />
            </div>
            <div className="process-deliverable">
              <span>What you receive</span>
              <p>{selectedStep.detail}</p>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
