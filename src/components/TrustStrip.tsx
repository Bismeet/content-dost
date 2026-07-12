
const capabilities = [
  "Strategy",
  "Scripts",
  "Long-form editing",
  "Short-form editing",
  "Podcasts",
  "Thumbnails",
  "Content systems",
];

export default function TrustStrip() {
  const listItems = [...capabilities, ...capabilities, ...capabilities];

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ padding: '28px 0', background: 'var(--ink-soft)', borderTop: '1px solid var(--border-neutral)', borderBottom: '1px solid var(--border-neutral)' }}
    >
      <div className="flex w-full overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-2">
          {listItems.map((item, index) => (
            <div key={index} className="flex items-center mx-8">
              <span
                style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em' }}
              >
                {item}
              </span>
              <span
                className="ml-16"
                style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--lime-muted)', flexShrink: 0 }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
