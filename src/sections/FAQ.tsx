import { useState } from 'react';
import { faqData } from '../data/content';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 bg-[#020202] relative border-b border-zinc-950 scroll-mt-20">
      {/* Drifting Neon Glows */}
      <div 
        className="absolute top-[10%] right-[-5%] w-[340px] h-[340px] rounded-full pointer-events-none opacity-35 select-none animate-glow-drift-2"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(95px)'
        }}
      ></div>
      <div 
        className="absolute bottom-[5%] left-[-5%] w-[380px] h-[380px] rounded-full pointer-events-none opacity-30 select-none animate-glow-drift-3"
        style={{
          background: 'radial-gradient(circle, rgba(247, 198, 35, 0.08) 0%, transparent 70%)',
          filter: 'blur(110px)'
        }}
      ></div>
      
      <div className="container relative z-10 max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/25 text-[#FF6A00] text-[10px] font-extrabold uppercase tracking-widest select-none">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMON ENQUIRIES</span>
          </div>
          <h2 className="text-[#FFF7F0] tracking-tight">
            Frequently Asked <span className="font-editorial text-orange-gradient italic text-[1.15em] tracking-normal">Questions</span>
          </h2>
          <p className="text-[#B9AAA0] text-sm leading-relaxed">
            Everything you need to know about our retentive packaging workflows, editing queues, and onboarding.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="panel-glass rounded-xl overflow-hidden transition-all duration-300 hover:border-[#FF4D00]/20"
              >
                {/* Trigger Header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors text-zinc-150 hover:text-white cursor-pointer"
                >
                  <span className="text-sm md:text-base font-bold tracking-tight pr-4 text-[#FFF7F0]">
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-lg bg-[#020202] border border-zinc-900 flex items-center justify-center text-zinc-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-white bg-[#FF4D00] border-[#FF4D00]/20 shadow-[0_0_12px_rgba(255,77,0,0.35)]' : ''}`}>
                    <ChevronDown className="w-4.5 h-4.5" />
                  </div>
                </button>

                {/* Answer Content wrapper using CSS transition */}
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: isOpen ? '250px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-[#B9AAA0] border-t border-zinc-900/60 leading-relaxed text-left">
                    {item.answer}
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
