import { processSteps } from '../content/siteContent';

export default function Process() {
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

        {/* Steps Grid - 6 columns on desktop, 3 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {processSteps.map((step) => (
            <div 
              key={step.step}
              className="relative p-6 border border-white/5 bg-[var(--ink-soft)] rounded-xl flex flex-col justify-between space-y-6 transition-colors group"
            >
              {/* Step number and connection line */}
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lime-muted)' }}>
                  {step.step}
                </span>
                
                {/* Visual miniature dot/check artifact representing output */}
                <div className="w-2 h-2 rounded-full bg-[var(--muted)]/30 group-hover:bg-[var(--lime)] transition-colors" />
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold tracking-tight text-[var(--bone)]">
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>

              {/* Tiny meaningful workflow artifact details */}
              <div style={{ borderTop: '1px solid var(--border-neutral)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--muted-dark)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem' }}>
                  What you receive
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'block' }} className="truncate">
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
