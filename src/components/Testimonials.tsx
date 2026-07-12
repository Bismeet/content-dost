const partnershipPrinciples = [
  { title: 'Close communication', copy: 'Direct, useful conversations with the people shaping your content.' },
  { title: 'Thoughtful feedback', copy: 'Clear review rounds that protect the idea and keep the work moving.' },
  { title: 'Human quality control', copy: 'Every delivery is watched, heard and checked before it reaches you.' },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-20" style={{ padding: 'clamp(5rem, 10vw, 8rem) 0', background: 'var(--ink)', borderBottom: '1px solid var(--border-neutral)' }}>
      <div className="container">
        <div className="max-w-3xl mb-16" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="section-eyebrow">The partnership</span>
          <h2>Good work comes from <em className="font-editorial">working closely.</em></h2>
          <p style={{ maxWidth: '38rem', fontSize: '1.05rem' }}>A calm, collaborative process with enough structure to move quickly and enough care to make the work distinct.</p>
        </div>
        <div className="partnership-grid">
          {partnershipPrinciples.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
