import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '../content/siteContent';
import { ServiceVisualStage } from './ServiceVisuals';

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const activeService = servicesData[activeTab];

  return (
    <section id="services" className="servicesSection services-section-atelier">
      <div className="container">
        <header className="servicesHeader">
          <span className="section-eyebrow">Services</span>
          <h2>Everything a good idea needs <em className="font-editorial">to travel.</em></h2>
          <p>
            From the first angle to the final export, we bring strategy and craft into one close creative partnership.
          </p>
        </header>

        <div className="servicesContentGrid">
          <div className="serviceNavigation">
            <div className="serviceNavigationList" role="tablist" aria-label="Services">
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
                  <span>{service.number}</span>
                  <strong>{service.title}</strong>
                </button>
              ))}
            </div>
          </div>

          <article 
            id="service-detail" 
            role="tabpanel" 
            className="serviceDetailCard service-detail animate-panel-fade" 
            aria-labelledby={`tab-${activeService.id}`}
          >
            {/* Top-left aligned title and short description */}
            <div className="service-detail-header">
              <h3 className="service-detail-title-left" key={`title-${activeService.id}`}>
                {activeService.title}
              </h3>
              <p className="service-detail-description" key={`desc-${activeService.id}`}>
                {activeService.shortDescription}
              </p>
            </div>

            {/* Middle area: large visual stage centered */}
            <div className="serviceVisualRow">
              <div className="serviceVisualStage">
                <ServiceVisualStage activeTab={activeTab} activeService={activeService} />
              </div>
            </div>

            {/* Bottom footer: CTA aligned right */}
            <div className="serviceFooter">
              <a href="#contact" className="serviceDetailCtaRight">
                Discuss this service <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
