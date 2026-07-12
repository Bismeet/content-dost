import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '../content/siteContent';

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const activeService = servicesData[activeTab];

  return (
    <section id="services" className="scroll-mt-20" style={{ padding: 'clamp(5rem, 10vw, 8rem) 0', background: 'var(--ink)', borderBottom: '1px solid var(--border-neutral)' }}>
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

          <article id="service-detail" role="tabpanel" className="service-detail" key={activeService.id}>
            <span className="service-detail-number">0{activeTab + 1}</span>
            <h3>{activeService.title}</h3>
            <p>{activeService.description}</p>
            <ul>
              {activeService.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <div className="service-production-artifact" aria-hidden="true">
              <div className="artifact-sheet">
                <span />
                <span />
                <span />
              </div>
              <div className="artifact-timeline">
                <i /><i /><i /><i /><i />
              </div>
              <div className="artifact-playhead" />
            </div>
            <a href="#contact">Discuss this service <ArrowUpRight size={16} aria-hidden="true" /></a>
          </article>
        </div>
      </div>
    </section>
  );
}
