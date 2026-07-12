import { useState } from 'react';
import { faqData } from '../content/siteContent';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="scroll-mt-20" style={{ padding: '6rem 0', background: 'var(--ink)', borderBottom: '1px solid var(--border-neutral)' }}>
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="section-eyebrow">FAQ</span>
          <h2>
            Common{' '}
            <em className="font-editorial" style={{ fontWeight: 400 }}>questions.</em>
          </h2>
          <p style={{ maxWidth: '36rem', fontSize: '1rem' }}>
            Frequently asked questions about our process, editing style, and retainers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                style={{
                  border: `1px solid ${isOpen ? 'var(--border-strong)' : 'var(--border-neutral)'}`,
                  borderRadius: '14px',
                  background: isOpen ? 'var(--ink-soft)' : 'transparent',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="cursor-pointer"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    letterSpacing: '-0.02em',
                    color: 'var(--bone)',
                    background: 'transparent',
                    border: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-btn-${index}`}
                >
                  <span style={{ paddingRight: '1rem' }}>{faq.question}</span>
                  <ChevronDown 
                    className="w-5 h-5"
                    style={{
                      color: isOpen ? 'var(--bone)' : 'var(--muted-dark)',
                      transition: 'transform 0.3s ease, color 0.3s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                      flexShrink: 0,
                    }}
                  />
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  style={{
                    maxHeight: isOpen ? '300px' : '0',
                    overflow: 'hidden',
                    borderTop: isOpen ? '1px solid var(--border-neutral)' : 'none',
                    transition: 'max-height 0.3s ease',
                  }}
                >
                  <div style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                    {faq.answer}
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
