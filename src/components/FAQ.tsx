import { useState } from 'react';
import { faqData } from '../content/siteContent';
import { Plus } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-rail-section">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="faq-header-block">
          <span className="section-eyebrow">— FAQ</span>
          <h2>
            Common <em className="font-editorial" style={{ fontWeight: 400 }}>questions.</em>
          </h2>
          <p className="faq-intro-text">
            Frequently asked questions about our process, services, and how we work.
          </p>
        </div>

        {/* FAQ Accordion Rail */}
        <div className="faq-rail-list">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            const indexStr = String(index + 1).padStart(2, '0');
            return (
              <div 
                key={index} 
                className={`faq-rail-item ${isOpen ? 'faq-rail-item--open' : ''}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="faq-rail-toggle"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-btn-${index}`}
                >
                  <div className="faq-rail-left">
                    <span className="faq-rail-index font-mono">{indexStr}</span>
                    <span className="faq-rail-question">{faq.question}</span>
                  </div>
                  <div className="faq-rail-control-wrapper">
                    <div className="faq-rail-button-circle">
                      <Plus className="faq-rail-plus-icon" size={16} aria-hidden="true" />
                    </div>
                  </div>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  className="faq-answer-container"
                  style={{
                    maxHeight: isOpen ? '240px' : '0px',
                  }}
                >
                  <div className="faq-answer-tray">
                    <div className="faq-answer-interior">
                      <p className="faq-answer-paragraph">{faq.answer}</p>
                      <div className="faq-answer-accent-line" />
                      <div className="faq-answer-footer-row font-mono">
                        <span className="faq-answer-tag">typical workflow: collaborative</span>
                        <a href="#contact" className="faq-inline-link">Still unsure? Start a project ↗</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
