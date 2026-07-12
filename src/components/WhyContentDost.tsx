import { whyDostData } from '../content/siteContent';

export default function WhyContentDost() {
  return (
    <section id="why-us" className="scroll-mt-20" style={{ padding: 'clamp(5rem, 10vw, 8rem) 0', background: 'var(--olive-black)', borderBottom: '1px solid var(--border-neutral)' }}>
      <div className="container">
        <div className="max-w-3xl mb-16" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="section-eyebrow">Why Content Dost</span>
          <h2>Meticulous systems, <em className="font-editorial">human judgment.</em></h2>
          <p style={{ maxWidth: '38rem', fontSize: '1.05rem' }}>A small, attentive creative partner built around the quality of the idea—not the volume of the output.</p>
        </div>
        <div className="why-editorial-grid">
          {whyDostData.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
