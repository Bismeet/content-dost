import { useState, useEffect, useRef } from 'react';
import { testimonialsData } from '../data/content';
import { ChevronLeft, ChevronRight, Quote, Award } from 'lucide-react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<any>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  // Auto-scroll loop with pause-on-hover support
  useEffect(() => {
    if (isPaused) {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
      return;
    }

    timeoutRef.current = setInterval(() => {
      handleNext();
    }, 8000);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [isPaused, activeIndex]);

  return (
    <section className="py-24 bg-[#020202] relative border-b border-zinc-950 overflow-hidden">
      {/* Drifting Neon Glows */}
      <div 
        className="absolute top-[15%] left-[5%] w-[370px] h-[370px] rounded-full pointer-events-none opacity-35 select-none animate-glow-drift-3"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      ></div>
      <div 
        className="absolute bottom-[10%] right-[5%] w-[420px] h-[420px] rounded-full pointer-events-none opacity-30 select-none animate-glow-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(247, 198, 35, 0.08) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }}
      ></div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/25 text-[#FF6A00] text-[10px] font-extrabold uppercase tracking-widest mb-4 select-none">
              <span>TESTIMONIALS</span>
            </div>
            <h2 className="text-[#FFF7F0] mb-4">
              Reviews from the<br />
              <span className="font-editorial text-orange-gradient italic text-[1.15em] tracking-normal">front lines of growth.</span>
            </h2>
            <p className="text-[#B9AAA0] text-sm leading-relaxed">
              We collaborate with creators and brands who understand that high-converting content builds compound wealth.
            </p>
          </div>

          {/* Slider controls */}
          <div className="flex items-center gap-3 select-none">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-lg bg-[#080503] border border-zinc-900 hover:border-[#FF4D00]/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-lg bg-[#080503] border border-zinc-900 hover:border-[#FF4D00]/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Display card */}
        <div className="relative min-h-[520px] md:min-h-[420px] flex items-center justify-center">
          {testimonialsData.map((item, idx) => {
            const isVisible = idx === activeIndex;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className={`w-full max-w-4xl transition-all duration-500 absolute ${
                  isVisible
                     ? 'opacity-100 translate-y-0 pointer-events-auto z-10 scale-100'
                     : 'opacity-0 translate-y-8 pointer-events-none z-0 scale-95'
                }`}
              >
                <div className="panel-glass grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8 rounded-2xl relative shadow-2xl">
                  {/* Quote icon overlay background */}
                  <Quote 
                    className="absolute pointer-events-none select-none" 
                    style={{
                      top: '1.5rem',
                      right: '2rem',
                      width: '6rem',
                      height: '6rem',
                      color: 'rgba(255, 255, 255, 0.03)'
                    }}
                  />

                  {/* Left Column: Client Info */}
                  <div className="md:col-span-4 flex flex-col justify-between items-start text-left" style={{ gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Avatar Badge */}
                      <div 
                        className="select-none"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '3.5rem',
                          height: '3.5rem',
                          borderRadius: '1rem',
                          background: 'linear-gradient(135deg, #FF6A00 0%, #FF4D00 100%)',
                          boxShadow: '0 0 15px rgba(255, 77, 0, 0.25)',
                          color: '#FFFFFF',
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          fontStyle: 'italic'
                        }}
                      >
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold tracking-tight text-[#FFF7F0]" style={{ margin: 0 }}>{item.name}</h3>
                        <p className="text-xs text-zinc-550 mt-0.5" style={{ margin: 0 }}>{item.role}</p>
                        <p className="text-xs font-semibold text-[#FF8A00] font-mono mt-1 select-none" style={{ margin: 0 }}>{item.company}</p>
                      </div>
                    </div>

                    {/* Achievement highlight box */}
                    <div 
                      className="select-none"
                      style={{
                        marginTop: '2rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(255, 90, 0, 0.05)',
                        border: '1px solid rgba(255, 90, 0, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <Award className="w-4.5 h-4.5 text-[#FF4D00]" style={{ flexShrink: 0 }} />
                      <div>
                        <span className="text-[8px] text-zinc-550 block uppercase font-mono leading-none">Outcome</span>
                        <span className="text-[11px] text-zinc-200 font-extrabold mt-1 block leading-tight">{item.achievement}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Premium Quote content */}
                  <div className="md:col-span-8 flex flex-col justify-center text-left">
                    <p 
                      className="text-zinc-300 text-2xl md:text-3xl italic font-medium leading-relaxed font-editorial text-orange-gradient"
                      style={{ 
                        fontFamily: 'var(--font-editorial), serif',
                        paddingBottom: '0.25em',
                        display: 'block'
                      }}
                    >
                      "{item.content}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicator pagination dots */}
        <div className="flex items-center justify-center gap-2 mt-8 select-none">
          {testimonialsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-350 cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 bg-[#FF4D00]'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
