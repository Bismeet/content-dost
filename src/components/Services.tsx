import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '../content/siteContent';
import { ServiceVisualStage } from './ServiceVisuals';

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const activeService = servicesData[activeTab];

  return (
    <section id="services" className="services-section-atelier" style={{ padding: 'clamp(5rem, 10vw, 8rem) 0', background: 'var(--ink)', borderBottom: '1px solid var(--border-neutral)' }}>
      <div className="container">
        <div className="max-w-3xl mb-16" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="section-eyebrow">Services</span>
          <h2>Everything a good idea needs <em className="font-editorial">to travel.</em></h2>
          <p style={{ maxWidth: '38rem', fontSize: '1.05rem' }}>From the first angle to the final export, we bring strategy and craft into one close creative partnership.</p>
        </div>

        <div className="services-editorial">
          <div className="services-index" role="tablist" aria-label="Services">
            {servicesData.map((service, index) => (
              <button
                key={service.id}
                type="button"
                role="tab"
                id={`tab-${service.id}`}
                aria-selected={activeTab === index}
                aria-controls="service-detail"
                className={`service-index-item ${activeTab === index ? 'service-index-item--active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <span>0{index + 1}</span>
                <strong>{service.title}</strong>
              </button>
            ))}
          </div>

          <article id="service-detail" role="tabpanel" className="service-detail animate-panel-fade" aria-labelledby={`tab-${activeService.id}`}>
            {/* Top-left aligned title and short description */}
            <div className="service-detail-header">
              <h3 className="service-detail-title-left" key={`title-${activeService.id}`}>{activeService.title}</h3>
              <p className="service-detail-description" key={`desc-${activeService.id}`}>
                {activeService.shortDescription}
              </p>
            </div>

            {/* Middle area: large visual stage shifted slightly right */}
            <div className="service-detail-visual-row">
              <ServiceVisualStage activeTab={activeTab} activeService={activeService} />
            </div>

            {/* Bottom footer: CTA aligned right */}
            <div className="service-detail-footer">
              <a href="#contact" className="service-detail-cta-right">
                Discuss this service <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
