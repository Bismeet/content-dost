import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { servicesData } from '../content/siteContent';

interface ServiceData {
  id: string;
  num: string;
  category: string;
  title: string;
  description: string;
  bullets: string[];
  accent: string;
}

// Map the central servicesData to the section's display format
const servicesList: ServiceData[] = [
  {
    id: servicesData[0].id,
    num: servicesData[0].number,
    category: "STRATEGY",
    title: servicesData[0].title,
    description: servicesData[0].description,
    bullets: servicesData[0].features,
    accent: "#FFD400" // Warm amber
  },
  {
    id: servicesData[1].id,
    num: servicesData[1].number,
    category: "SCRIPTING",
    title: servicesData[1].title,
    description: servicesData[1].description,
    bullets: servicesData[1].features,
    accent: "#FF5A00" // Neon orange
  },
  {
    id: servicesData[2].id,
    num: servicesData[2].number,
    category: "EDITING",
    title: servicesData[2].title,
    description: servicesData[2].description,
    bullets: servicesData[2].features,
    accent: "#1F78FF" // Electric blue
  },
  {
    id: servicesData[3].id,
    num: servicesData[3].number,
    category: "BRANDING",
    title: servicesData[3].title,
    description: servicesData[3].description,
    bullets: servicesData[3].features,
    accent: "#8B5CFF" // Purple/violet
  },
  {
    id: servicesData[4].id,
    num: servicesData[4].number,
    category: "WEBSITES",
    title: servicesData[4].title,
    description: servicesData[4].description,
    bullets: servicesData[4].features,
    accent: "#FF343D" // Red
  },
];

function ServicePreview({ id, accent }: { id: string; accent: string }) {
  // Renders the correct visual mockups according to service ID
  switch (id) {
    case "content-strategy":
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0B0B0B] rounded-xl border border-white/5 font-mono text-[9px] text-left">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-zinc-650">STRATEGY_BOARD.json</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-white/5 font-bold uppercase text-[7px]" style={{ color: accent }}>
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-2.5 flex-1">
            <div className="p-2 rounded bg-zinc-900/40 border border-white/5 flex flex-col justify-between">
              <span className="text-zinc-600 uppercase text-[7px] font-bold">Pillars</span>
              <div className="space-y-0.5 font-sans text-zinc-300 text-[7.5px]">
                <p>• Audience Mapping</p>
                <p>• Format Blueprints</p>
              </div>
            </div>

            <div className="p-2 rounded bg-zinc-900/40 border border-white/5 flex flex-col justify-between">
              <span className="text-zinc-600 uppercase text-[7px] font-bold">Goals</span>
              <div className="space-y-0.5 font-sans text-zinc-300 text-[7.5px]">
                <p>• Clear Direction</p>
                <p>• Hook Validation</p>
              </div>
            </div>

            <div className="col-span-2 p-2 rounded border flex items-center justify-between" style={{ backgroundColor: `${accent}04`, borderColor: `${accent}20` }}>
              <div>
                <span className="text-zinc-550 uppercase text-[7px] block">AUDIENCE PROFILE</span>
                <span className="text-[9.5px] text-zinc-200 font-extrabold font-sans">High-Growth Founders & Creators</span>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }}></span>
              </div>
            </div>
          </div>
        </div>
      );

    case "scriptwriting":
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0B0B0B] rounded-xl border border-white/5 font-mono text-[9px] text-left">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-zinc-650">SCRIPT_ENG_REV2.docx</span>
            <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 font-bold uppercase text-[7px]" style={{ color: accent }}>
              REVIEW
            </span>
          </div>

          <div className="space-y-2 py-2 flex-1 flex flex-col justify-center">
            <div className="flex gap-2">
              <span className="w-14 text-zinc-600 font-bold uppercase text-[7.5px]">01_Hook:</span>
              <p className="flex-1 text-zinc-300 font-sans text-[8px] leading-tight italic">"Most creators struggle with scripts. Here is the software framework to solve it."</p>
            </div>
            <div className="flex gap-2">
              <span className="w-14 text-zinc-600 font-bold uppercase text-[7.5px]">02_Build:</span>
              <p className="flex-1 text-zinc-550 font-sans text-[8px] leading-tight">We map out the exact script flow details step by step...</p>
            </div>
            <div className="flex gap-2">
              <span className="w-14 text-zinc-600 font-bold uppercase text-[7.5px]">03_Payoff:</span>
              <p className="flex-1 text-zinc-550 font-sans text-[8px] leading-tight">Close with the final retention-focused conversion brief.</p>
            </div>
          </div>
        </div>
      );

    case "video-editing":
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0B0B0B] rounded-xl border border-white/5 font-mono text-[9px] text-left">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-zinc-650">V1_TIMELINE.mp4</span>
            <span className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 font-bold uppercase text-[7px]" style={{ color: accent }}>
              EXPORT_READY
            </span>
          </div>

          <div className="relative py-4 flex-1 flex flex-col justify-center gap-3">
            {/* Playhead line */}
            <div 
              className="absolute top-0 bottom-0 w-[1.5px] z-10" 
              style={{ left: '42%', backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
            >
              <div className="absolute top-0 -translate-x-1/2 w-2 h-2 rotate-45" style={{ backgroundColor: accent }}></div>
            </div>

            {/* Track V1 */}
            <div className="flex items-center gap-2">
              <span className="w-6 text-right text-zinc-600 font-bold">V1</span>
              <div className="flex-1 grid grid-cols-4 gap-1 h-5">
                <div className="bg-zinc-950 border border-white/5 rounded flex items-center justify-center text-zinc-600">01</div>
                <div className="border rounded flex items-center justify-center font-bold text-[8px]" style={{ backgroundColor: `${accent}15`, borderColor: `${accent}40`, color: accent }}>02_CUT</div>
                <div className="bg-zinc-950 border border-white/5 rounded flex items-center justify-center text-zinc-600">03</div>
                <div className="bg-zinc-950 border border-white/5 rounded flex items-center justify-center text-zinc-600">04</div>
              </div>
            </div>

            {/* Track A1 */}
            <div className="flex items-center gap-2">
              <span className="w-6 text-right text-zinc-600 font-bold">A1</span>
              <div className="flex-1 h-5 bg-zinc-950 border border-white/5 rounded overflow-hidden flex items-center px-1">
                <div className="flex items-end gap-[1.5px] h-3.5 w-full">
                  <div className="h-[20%] w-[3px] bg-zinc-700 rounded-sm"></div>
                  <div className="h-[40%] w-[3px] bg-zinc-700 rounded-sm"></div>
                  <div className="h-[70%] w-[3px] bg-zinc-700 rounded-sm"></div>
                  <div className="h-[90%] w-[3px] bg-zinc-700 rounded-sm"></div>
                  <div className="h-[50%] w-[3px] bg-zinc-700 rounded-sm"></div>
                  <div className="h-[60%] w-[3px] bg-zinc-700 rounded-sm"></div>
                  <div className="h-[95%] w-[3px] rounded-sm" style={{ backgroundColor: accent }}></div>
                  <div className="h-[80%] w-[3px] rounded-sm" style={{ backgroundColor: accent }}></div>
                  <div className="h-[75%] w-[3px] rounded-sm" style={{ backgroundColor: accent }}></div>
                  <div className="h-[30%] w-[3px] bg-zinc-700 rounded-sm"></div>
                  <div className="h-[50%] w-[3px] bg-zinc-700 rounded-sm"></div>
                  <div className="h-[80%] w-[3px] bg-zinc-700 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "brand-management":
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0B0B0B] rounded-xl border border-white/5 font-mono text-[9px] text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
            <div className="w-7 h-7 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center text-[10px] font-black text-white italic">
              CD
            </div>
            <div>
              <span className="text-zinc-300 font-bold block text-[9.5px]">Brand Identity System</span>
              <span className="text-zinc-650 text-[7.5px] uppercase">STATUS_ACTIVE</span>
            </div>
          </div>

          <div className="space-y-2 py-2 flex-1 flex flex-col justify-center">
            <div className="p-1.5 rounded bg-zinc-900/40 border border-white/5">
              <span className="text-zinc-600 block text-[6.5px] uppercase font-bold">Identity</span>
              <p className="text-zinc-300 font-sans text-[7.5px] leading-tight">Consistent brand presence across content and platforms.</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-1 px-1.5 rounded bg-zinc-950 border border-white/5">
                <span className="text-zinc-600 block text-[5.5px] uppercase font-bold">TONE</span>
                <span className="text-[7.5px] text-zinc-400 font-sans">Authoritative</span>
              </div>
              <div className="p-1 px-1.5 rounded bg-zinc-950 border border-white/5">
                <span className="text-zinc-600 block text-[5.5px] uppercase font-bold">COLOURS</span>
                <div className="flex gap-0.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                  <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                  <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
                </div>
              </div>
              <div className="p-1 px-1.5 rounded bg-zinc-950 border border-white/5">
                <span className="text-zinc-600 block text-[5.5px] uppercase font-bold">DIRECTION</span>
                <span className="text-[7.5px] text-zinc-400 font-sans">Growth</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "website-making":
      return (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-[#0B0B0B] rounded-xl border border-white/5 font-mono text-[9px] text-left">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-zinc-400 font-bold">WEBSITE BUILD</span>
            <span className="font-bold" style={{ color: accent }}>RESPONSIVE</span>
          </div>

          <div className="py-2.5 flex-1 flex flex-col justify-center gap-2">
            {/* Mini browser frame */}
            <div className="rounded border border-white/5 bg-zinc-950 overflow-hidden">
              <div className="flex items-center gap-1 px-2 py-1 border-b border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb830]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]"></span>
                <span className="text-[6px] text-zinc-600 ml-2">contentdost.agency</span>
              </div>
              <div className="p-2 space-y-1.5">
                {/* Layout grid */}
                <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: `${accent}20` }}></div>
                <div className="h-1 rounded-full w-1/2 bg-zinc-800"></div>
                <div className="grid grid-cols-3 gap-1 mt-1.5">
                  <div className="h-6 rounded border" style={{ backgroundColor: `${accent}08`, borderColor: `${accent}15` }}></div>
                  <div className="h-6 rounded bg-zinc-900 border border-white/5"></div>
                  <div className="h-6 rounded bg-zinc-900 border border-white/5"></div>
                </div>
              </div>
            </div>

            {/* Build stages */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'LAYOUT', done: true },
                { label: 'TYPE', done: true },
                { label: 'LAUNCH', done: false },
              ].map((item) => (
                <div 
                  key={item.label}
                  className="p-1 rounded border text-[6px] text-center font-bold"
                  style={{
                    backgroundColor: item.done ? 'rgba(16, 185, 129, 0.04)' : `${accent}05`,
                    borderColor: item.done ? 'rgba(16, 185, 129, 0.15)' : `${accent}15`,
                    color: item.done ? '#10B981' : accent,
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function Services() {
  const [activeIdx, setActiveIdx] = useState(0);

  const activeService = servicesList[activeIdx];

  return (
    <section 
      id="services" 
      className="py-24 relative border-b border-zinc-950 scroll-mt-20 overflow-hidden"
      style={{ backgroundColor: '#080A0F' }}
    >
      {/* Background radial gradients for ambient visual split depth */}
      <div 
        className="absolute left-0 top-[20%] w-[35vw] h-[35vw] rounded-full pointer-events-none select-none"
        style={{
          background: 'radial-gradient(circle at left, rgba(31, 120, 255, 0.04) 0%, transparent 60%)',
          filter: 'blur(90px)'
        }}
      ></div>
      <div 
        className="absolute right-0 bottom-[20%] w-[35vw] h-[35vw] rounded-full pointer-events-none select-none"
        style={{
          background: 'radial-gradient(circle at right, rgba(139, 92, 255, 0.04) 0%, transparent 60%)',
          filter: 'blur(90px)'
        }}
      ></div>

      <div className="container relative z-10 max-w-5xl mx-auto px-4">
        {/* Section Header matching visual composition */}
        <div className="w-full text-left mb-14">
          <span className="font-mono text-[9px] tracking-widest text-zinc-550 font-bold block mb-2 uppercase select-none">
            SERVICES
          </span>
          <h2 className="text-[#F5F5F5] text-3xl md:text-[40px] font-extrabold tracking-tight select-none leading-none">
            Services <span className="font-editorial text-orange-gradient italic text-[1.12em] tracking-normal font-normal" style={{ fontFamily: 'var(--font-editorial), serif' }}>built</span> for consistent content.
          </h2>
        </div>

        {/* ================= DESKTOP LAYOUT (SIDE-BY-SIDE) ================= */}
        <div className="hidden md:grid grid-cols-12 gap-8 items-start">
          {/* Left Column: list */}
          <div className="col-span-4 flex flex-col gap-1 select-none">
            {servicesList.map((service, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx(idx)}
                  className="w-full text-left py-3.5 px-5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                    borderColor: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    borderLeft: isSelected ? `2.5px solid ${service.accent}` : '2.5px solid transparent',
                    paddingLeft: isSelected ? '18px' : '20px'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="font-mono text-[10px] font-bold" 
                      style={{ color: isSelected ? service.accent : '#585858' }}
                    >
                      {service.num}
                    </span>
                    <span 
                      className="font-sans text-sm font-semibold transition-colors duration-200"
                      style={{ color: isSelected ? '#F5F5F5' : '#585858' }}
                    >
                      {service.title}
                    </span>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: service.accent }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: panel */}
          <div className="col-span-8">
            <div 
              className="w-full bg-[#090909] rounded-2xl p-8 relative flex flex-col justify-between transition-all duration-300"
              style={{
                height: '460px',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderLeft: `3px solid ${activeService.accent}`,
                boxShadow: '0 10px 40px -20px rgba(0,0,0,0.95)'
              }}
            >
              {/* Internal structured details (Left content, Right mockup) */}
              <div 
                key={activeService.id} 
                className="grid grid-cols-12 gap-8 items-stretch h-full animate-panel-fade"
              >
                {/* Left pane: Details copy */}
                <div className="col-span-7 flex flex-col justify-between text-left items-start pr-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-zinc-550 font-bold leading-none">{activeService.num}</span>
                      <span 
                        className="font-mono text-[8px] tracking-wider border px-1.5 py-0.5 rounded font-extrabold select-none leading-none"
                        style={{ color: activeService.accent, borderColor: `${activeService.accent}30` }}
                      >
                        {activeService.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#F5F5F5] tracking-tight">{activeService.title}</h3>
                    
                    <p className="text-xs text-[#929292] leading-relaxed font-sans font-medium">
                      {activeService.description}
                    </p>

                    <div className="pt-2 flex flex-col gap-2">
                      {activeService.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] text-[#F5F5F5] font-sans font-semibold">
                          <Check className="w-3 h-3 flex-shrink-0" style={{ color: activeService.accent }} />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a 
                    href="#contact" 
                    className="btn-primary mt-6 select-none font-bold"
                    style={{
                      backgroundColor: activeService.accent,
                      borderColor: activeService.accent,
                      fontSize: '11px',
                      padding: '0.6rem 1.2rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#FFFFFF'
                    }}
                  >
                    <span>Enquire About This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Right pane: Visual mockup preview */}
                <div className="col-span-5 flex items-stretch">
                  <ServicePreview id={activeService.id} accent={activeService.accent} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE LAYOUT (STACKED) ================= */}
        <div className="block md:hidden space-y-6">
          {/* Scrollable selectors list on mobile */}
          <div 
            className="flex gap-3 overflow-x-auto scrollbar-none pb-3 border-b border-zinc-900 select-none flex-nowrap"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {servicesList.map((service, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveIdx(idx)}
                  className="px-4 py-2 border rounded-full font-mono text-[9px] tracking-wider font-extrabold flex-shrink-0 transition-colors"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    borderColor: isSelected ? service.accent : 'rgba(255, 255, 255, 0.06)',
                    color: isSelected ? '#F5F5F5' : '#585858',
                  }}
                >
                  {service.num} {service.title}
                </button>
              );
            })}
          </div>

          {/* Details card stacked for mobile */}
          <div 
            className="w-full bg-[#090909] rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderLeft: `3px solid ${activeService.accent}`,
              boxShadow: '0 10px 30px -15px rgba(0,0,0,0.85)'
            }}
          >
            <div 
              key={activeService.id} 
              className="flex flex-col gap-6 text-left items-start animate-panel-fade"
            >
              {/* Category tag */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-zinc-550 font-bold">{activeService.num}</span>
                <span 
                  className="font-mono text-[8px] tracking-wider border px-1.5 py-0.5 rounded font-extrabold select-none"
                  style={{ color: activeService.accent, borderColor: `${activeService.accent}30` }}
                >
                  {activeService.category}
                </span>
              </div>

              {/* Title & Copy */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[#F5F5F5] tracking-tight">{activeService.title}</h3>
                <p className="text-xs text-[#929292] leading-relaxed font-sans font-medium">
                  {activeService.description}
                </p>

                {/* Bullets */}
                <div className="pt-2 flex flex-col gap-2">
                  {activeService.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-[#F5F5F5] font-sans font-semibold">
                      <Check className="w-3 h-3 flex-shrink-0" style={{ color: activeService.accent }} />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Mockup Preview */}
              <div className="w-full h-40">
                <ServicePreview id={activeService.id} accent={activeService.accent} />
              </div>

              {/* CTA Button full width on mobile */}
              <a 
                href="#contact" 
                className="btn-primary w-full select-none font-bold text-center justify-center"
                style={{
                  backgroundColor: activeService.accent,
                  borderColor: activeService.accent,
                  fontSize: '11px',
                  padding: '0.75rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#FFFFFF'
                }}
              >
                <span>Enquire About This Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
