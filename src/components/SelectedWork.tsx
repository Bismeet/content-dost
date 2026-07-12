import { ArrowUpRight } from 'lucide-react';
import { portfolioItems } from '../content/siteContent';

export default function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-20" style={{ padding: 'clamp(5rem, 10vw, 8rem) 0', background: 'var(--olive-black)', borderBottom: '1px solid var(--border-neutral)' }}>
      <div className="container">
        <div className="max-w-3xl mb-16" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="section-eyebrow">Selected work</span>
          <h2>Content worth <em className="font-editorial">watching.</em></h2>
          <p style={{ maxWidth: '36rem', fontSize: '1.05rem' }}>Selected concept work showing how we turn complex briefs into clear, watchable stories.</p>
        </div>

        <div className="work-list">
          {portfolioItems.map((item, index) => (
            <article className="work-editorial-card" key={item.id}>
              <div className="work-card-index">0{index + 1}</div>
              <div className="work-card-copy">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.solution}</p>
              </div>
              <div className="work-card-result">
                <small>{item.stats.metricLabel}</small>
                <strong>{item.stats.metricVal}</strong>
                <span>{item.stats.growth}</span>
              </div>
              <a href="#contact" aria-label={`Discuss ${item.title}`}><ArrowUpRight size={18} aria-hidden="true" /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
