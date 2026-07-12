import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Results() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialise ScrollTrigger animations for result cards
    const panels = gsap.utils.toArray('.result-panel');
    const ctx = gsap.context(() => {
      panels.forEach((panel: any) => {
        // Card entrance transition
        gsap.fromTo(
          panel,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // --- Animation Timeline 1: Review Pipeline ---
      const p1 = document.getElementById('result-p1');
      if (p1) {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: p1,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
        tl1
          .to(p1.querySelector('.v1-progress-bar'), { width: '33%', duration: 0.6, ease: 'power2.out' })
          .fromTo(
            p1.querySelectorAll('.v1-comment'),
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.4, ease: 'power2.out' }
          )
          .to(p1.querySelector('.v1-progress-bar'), { width: '66%', duration: 0.6, ease: 'power2.out' }, '+=0.2')
          .fromTo(
            p1.querySelector('.v1-revision'),
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
          )
          .to(p1.querySelectorAll('.v1-comment'), { opacity: 0.4, duration: 0.3 })
          .to(p1.querySelector('.v1-progress-bar'), { width: '100%', duration: 0.6, ease: 'power2.out' })
          .fromTo(
            p1.querySelector('.v1-approved-stamp'),
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }
          );
      }

      // --- Animation Timeline 2: Brand Consistency ---
      const p2 = document.getElementById('result-p2');
      if (p2) {
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: p2,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
        // Initial offset rotation for tactile snap feel
        tl2
          .set(p2.querySelector('.v2-item-type'), { x: -8, y: 4, rotation: -3 })
          .set(p2.querySelector('.v2-item-color'), { x: 5, y: -6, rotation: 4 })
          .set(p2.querySelector('.v2-item-caption'), { x: -3, y: -5, rotation: -2 })
          .set(p2.querySelector('.v2-item-frame'), { x: 6, y: 7, rotation: 5 })
          .set(p2.querySelector('.v2-item-vertical'), { x: -5, y: -4, rotation: -4 })
          .set(p2.querySelector('.v2-item-wave'), { x: 4, y: 3, rotation: 2 })
          // Run
          .to(p2.querySelector('.v2-guides'), { opacity: 0.6, duration: 0.3 })
          .to(
            p2.querySelectorAll(
              '.v2-item-type, .v2-item-color, .v2-item-caption, .v2-item-frame, .v2-item-vertical, .v2-item-wave'
            ),
            {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.04,
            },
            '+=0.1'
          )
          .to(p2.querySelector('.v2-lock-status'), { opacity: 1, y: -4, duration: 0.4, ease: 'back.out(1.5)' });
      }

      // --- Animation Timeline 3: Operations ---
      const p3 = document.getElementById('result-p3');
      if (p3) {
        const tl3 = gsap.timeline({
          scrollTrigger: {
            trigger: p3,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
        tl3
          .set(p3.querySelector('.v3-node-1'), { x: -20, y: -30 })
          .set(p3.querySelector('.v3-node-2'), { x: 30, y: 40 })
          .set(p3.querySelector('.v3-node-3'), { x: -40, y: -20 })
          .set(p3.querySelector('.v3-node-4'), { x: 25, y: -35 })
          .set(p3.querySelector('.v3-node-5'), { x: -10, y: 45 })
          // align
          .to(p3.querySelectorAll('.v3-node'), {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.04,
          })
          .to(p3.querySelector('.v3-path-active-1'), { strokeDashoffset: 0, duration: 0.3 }, '-=0.4')
          .to(p3.querySelector('.v3-path-active-2'), { strokeDashoffset: 0, duration: 0.3 })
          .to(p3.querySelector('.v3-path-active-3'), { strokeDashoffset: 0, duration: 0.3 })
          .to(p3.querySelector('.v3-path-active-4'), { strokeDashoffset: 0, duration: 0.3 })
          .to(p3.querySelector('.v3-node-5 .node-box'), { borderColor: '#53d6ba', color: '#53d6ba', duration: 0.3 })
          .to(p3.querySelector('.v3-delivery-active'), { opacity: 1, scale: 1.4, duration: 0.5, ease: 'power2.out' }, '-=0.1');
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="results" className="results-section scroll-mt-20" style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border-neutral)' }}>
      <div ref={containerRef} className="container mx-auto px-6 max-w-6xl flex flex-col gap-12 md:gap-16">
        
        {/* Section Header */}
        <div className="max-w-3xl flex flex-col gap-4">
          <span className="section-eyebrow" style={{ color: 'var(--accent-violet)' }}>Results</span>
          <h2>
            Built for{' '}
            <em className="font-editorial">real outcomes.</em>
          </h2>
          <p style={{ maxWidth: '36rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Structural improvements and workflow clarity that you can feel in every review cycle.
          </p>
        </div>

        {/* Results Panels Stack */}
        <div className="flex flex-col gap-10 md:gap-12">
          
          {/* Panel 1: Faster Review Cycles */}
          <div id="result-p1" className="result-panel">
            <div className="flex flex-col items-start text-left">
              <span className="result-eyebrow" style={{ color: 'var(--accent-violet)' }}>REVIEW PIPELINE</span>
              <h3 className="result-title">Faster review cycles</h3>
              <p className="result-description">
                Frame-accurate comments, organised revisions and clear approval states reduce unnecessary back-and-forth.
              </p>
              <div className="result-supporting border-t border-slate-200 w-full pt-4 font-medium">
                One review thread from first cut to final approval.
              </div>
              <a href="#process" className="mt-6 inline-flex items-center gap-1.5 font-bold text-xs" style={{ color: 'var(--accent-violet)' }}>
                Explore the process <ArrowUpRight size={13} />
              </a>
            </div>

            <div className="result-visual">
              <div className="relative w-full h-full flex flex-col justify-center items-center px-4 py-8">
                {/* Connecting Track */}
                <div className="absolute top-1/2 left-[15%] right-[15%] h-[3px] bg-slate-300 -translate-y-1/2 overflow-hidden z-0 rounded-full">
                  <div className="v1-progress-bar w-0 h-full bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500" />
                </div>

                <div className="relative w-full flex justify-between items-center z-10">
                  {/* Rough Cut Stage */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-xl bg-[#edf1f7] border-2 border-white shadow-inner flex items-center justify-center">
                      <span className="text-sm">🎬</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500">Rough Cut</span>
                  </div>

                  {/* Client Note Stage */}
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className="v1-comment opacity-0 absolute -top-12 bg-violet-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                      "Fix zoom"
                    </div>
                    <div className="v1-comment opacity-0 absolute -top-7 bg-violet-400 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                      "Trim intro"
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#edf1f7] border-2 border-white shadow flex items-center justify-center text-violet-500 text-sm">
                      💬
                    </div>
                    <span className="text-[9px] font-bold text-slate-500">Client Note</span>
                  </div>

                  {/* Revision Stage */}
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className="v1-revision opacity-0 absolute -top-8 px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold text-[8px] shadow-sm whitespace-nowrap">
                      Rev 1 Active
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#edf1f7] border-2 border-white shadow flex items-center justify-center text-blue-500 text-sm">
                      🔄
                    </div>
                    <span className="text-[9px] font-bold text-slate-500">Revision</span>
                  </div>

                  {/* Approved Stage */}
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className="v1-approved-stamp opacity-0 absolute -top-8 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-md font-bold">
                      ✓
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#edf1f7] border-2 border-white shadow flex items-center justify-center text-slate-400 text-sm">
                      ✓
                    </div>
                    <span className="text-[9px] font-bold text-slate-500">Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Aligned Visual Systems */}
          <div id="result-p2" className="result-panel result-panel-reverse">
            <div className="result-visual">
              <div className="relative w-full h-full flex flex-col justify-center items-center p-6 gap-5">
                {/* Dynamic Alignment Grid */}
                <div className="v2-guides absolute inset-4 border border-dashed border-slate-300 opacity-0 rounded-2xl pointer-events-none">
                  <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-300" />
                  <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-slate-300" />
                </div>

                <div className="grid grid-cols-3 gap-3 w-full max-w-[340px] z-10">
                  {/* Typography */}
                  <div className="v2-item-type bg-[#edf1f7] border border-white shadow rounded-xl p-2.5 flex flex-col justify-center items-center gap-0.5">
                    <span className="text-[7px] font-black text-slate-400">TYPE</span>
                    <span className="text-[10px] font-extrabold tracking-tight text-violet-500">MANROPE</span>
                  </div>

                  {/* Palette */}
                  <div className="v2-item-color bg-[#edf1f7] border border-white shadow rounded-xl p-2.5 flex flex-col justify-center items-center gap-1">
                    <span className="text-[7px] font-black text-slate-400">COLOUR</span>
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-coral-500" style={{ backgroundColor: 'var(--accent-coral)' }} />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ backgroundColor: 'var(--accent-blue)' }} />
                    </div>
                  </div>

                  {/* Subtitles */}
                  <div className="v2-item-caption bg-[#edf1f7] border border-white shadow rounded-xl p-2.5 flex flex-col justify-center items-center gap-1">
                    <span className="text-[7px] font-black text-slate-400">CAPTIONS</span>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-coral-400 text-white" style={{ backgroundColor: 'var(--accent-coral)' }}>100% Locked</span>
                  </div>

                  {/* Horizontal 16:9 */}
                  <div className="v2-item-frame bg-[#edf1f7] border border-white shadow rounded-xl p-2 flex flex-col items-center gap-1">
                    <span className="text-[7px] font-black text-slate-400">16:9 VIEW</span>
                    <div className="w-12 h-7 bg-slate-200 rounded border border-slate-300 relative overflow-hidden flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border border-blue-500" />
                    </div>
                  </div>

                  {/* Vertical 9:16 */}
                  <div className="v2-item-vertical bg-[#edf1f7] border border-white shadow rounded-xl p-2 flex flex-col items-center gap-1">
                    <span className="text-[7px] font-black text-slate-400">9:16 REEL</span>
                    <div className="w-6 h-9 bg-slate-200 rounded border border-slate-300 relative overflow-hidden flex items-center justify-center">
                      <div className="w-3.5 h-5 rounded border border-blue-500" />
                    </div>
                  </div>

                  {/* Waveform */}
                  <div className="v2-item-wave bg-[#edf1f7] border border-white shadow rounded-xl p-2 flex flex-col justify-center items-center gap-1">
                    <span className="text-[7px] font-black text-slate-400">AUDIO</span>
                    <div className="flex gap-[2px] items-center h-4">
                      <div className="w-[2px] h-2 bg-slate-400 rounded-full" />
                      <div className="w-[2px] h-4 bg-slate-500 rounded-full" />
                      <div className="w-[2px] h-3 bg-slate-400 rounded-full" />
                      <div className="w-[2px] h-1 bg-slate-300 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Lock Status */}
                <div className="v2-lock-status opacity-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[9px] shadow" style={{ backgroundColor: 'var(--accent-gold)' }}>
                  ✨ Grid Aligned
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start text-left">
              <span className="result-eyebrow" style={{ color: 'var(--accent-coral)' }}>BRAND CONSISTENCY</span>
              <h3 className="result-title">Aligned visual systems</h3>
              <p className="result-description">
                Typography, captions, colour, framing and sound treatments remain consistent across every format.
              </p>
              <div className="result-supporting border-t border-slate-200 w-full pt-4 font-medium">
                One creative language across long-form, short-form and supporting assets.
              </div>
              <a href="#services" className="mt-6 inline-flex items-center gap-1.5 font-bold text-xs" style={{ color: 'var(--accent-coral)' }}>
                See the workflow <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Panel 3: One Organised Workspace */}
          <div id="result-p3" className="result-panel">
            <div className="flex flex-col items-start text-left">
              <span className="result-eyebrow" style={{ color: 'var(--accent-gold)' }}>OPERATIONS</span>
              <h3 className="result-title">One organised workspace</h3>
              <p className="result-description">
                Scripts, footage, edits, feedback and delivery files remain connected throughout the project.
              </p>
              <div className="result-supporting border-t border-slate-200 w-full pt-4 font-medium">
                Less searching, fewer missed notes and one clear delivery path.
              </div>
              <a href="#process" className="mt-6 inline-flex items-center gap-1.5 font-bold text-xs" style={{ color: 'var(--accent-gold)' }}>
                Explore the process <ArrowUpRight size={13} />
              </a>
            </div>

            <div className="result-visual">
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {/* SVG Connecting Curves */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 220" fill="none">
                  {/* Connector lines background */}
                  <path className="v3-path" d="M 45 110 C 85 50, 95 50, 120 110" stroke="rgba(105, 120, 148, 0.12)" strokeWidth="2" strokeDasharray="3 3" />
                  <path className="v3-path" d="M 120 110 C 140 170, 160 170, 195 110" stroke="rgba(105, 120, 148, 0.12)" strokeWidth="2" strokeDasharray="3 3" />
                  <path className="v3-path" d="M 195 110 C 215 50, 235 50, 270 110" stroke="rgba(105, 120, 148, 0.12)" strokeWidth="2" strokeDasharray="3 3" />
                  <path className="v3-path" d="M 270 110 C 290 170, 310 170, 335 110" stroke="rgba(105, 120, 148, 0.12)" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Active connection paths */}
                  <path className="v3-path-active v3-path-active-1" d="M 45 110 C 85 50, 95 50, 120 110" stroke="#f2c94c" strokeWidth="2" strokeDasharray="120" strokeDashoffset="120" />
                  <path className="v3-path-active v3-path-active-2" d="M 120 110 C 140 170, 160 170, 195 110" stroke="#ff7a59" strokeWidth="2" strokeDasharray="120" strokeDashoffset="120" />
                  <path className="v3-path-active v3-path-active-3" d="M 195 110 C 215 50, 235 50, 270 110" stroke="#62a8ff" strokeWidth="2" strokeDasharray="120" strokeDashoffset="120" />
                  <path className="v3-path-active v3-path-active-4" d="M 270 110 C 290 170, 310 170, 335 110" stroke="#53d6ba" strokeWidth="2" strokeDasharray="120" strokeDashoffset="120" />
                </svg>

                {/* Content Workspace Node Blocks */}
                <div className="absolute w-full h-full top-0 left-0">
                  {/* Script */}
                  <div className="v3-node v3-node-1 absolute left-[25px] top-[90px] flex flex-col items-center">
                    <div className="node-box w-9 h-9 rounded-full bg-[#edf1f7] border-2 border-amber-400 flex items-center justify-center shadow text-amber-500 font-bold text-xs">
                      📄
                    </div>
                    <span className="text-[7px] font-black text-slate-500 mt-1">Script</span>
                  </div>

                  {/* Footage */}
                  <div className="v3-node v3-node-2 absolute left-[100px] top-[90px] flex flex-col items-center">
                    <div className="node-box w-9 h-9 rounded-full bg-[#edf1f7] border-2 border-coral-500 flex items-center justify-center shadow text-coral-500 font-bold text-xs" style={{ borderColor: 'var(--accent-coral)', color: 'var(--accent-coral)' }}>
                      📹
                    </div>
                    <span className="text-[7px] font-black text-slate-500 mt-1">Footage</span>
                  </div>

                  {/* Edit */}
                  <div className="v3-node v3-node-3 absolute left-[175px] top-[90px] flex flex-col items-center">
                    <div className="node-box w-9 h-9 rounded-full bg-[#edf1f7] border-2 border-blue-500 flex items-center justify-center shadow text-blue-500 font-bold text-xs" style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>
                      ✂
                    </div>
                    <span className="text-[7px] font-black text-slate-500 mt-1">Edit</span>
                  </div>

                  {/* Review */}
                  <div className="v3-node v3-node-4 absolute left-[250px] top-[90px] flex flex-col items-center">
                    <div className="node-box w-9 h-9 rounded-full bg-[#edf1f7] border-2 border-violet-500 flex items-center justify-center shadow text-violet-500 font-bold text-xs" style={{ borderColor: 'var(--accent-violet)', color: 'var(--accent-violet)' }}>
                      👀
                    </div>
                    <span className="text-[7px] font-black text-slate-500 mt-1">Review</span>
                  </div>

                  {/* Delivery */}
                  <div className="v3-node v3-node-5 absolute left-[315px] top-[90px] flex flex-col items-center">
                    <div className="v3-delivery-active opacity-0 absolute inset-0 w-9 h-9 rounded-full bg-emerald-500/20 scale-125 z-0" />
                    <div className="node-box w-9 h-9 rounded-full bg-[#edf1f7] border-2 border-slate-300 flex items-center justify-center shadow text-slate-400 font-bold text-xs z-10">
                      🚀
                    </div>
                    <span className="text-[7px] font-black text-slate-500 mt-1">Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Qualitative Outcomes Inset Strip */}
        <div className="trust-strip-inset grid grid-cols-2 md:grid-cols-4 gap-4 p-5 md:p-6 text-center mt-4">
          <div className="flex flex-col items-center gap-1 p-2">
            <span className="text-base">💬</span>
            <span className="text-xs font-extrabold text-[#1f2430]">Clearer feedback</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2">
            <span className="text-base">🎨</span>
            <span className="text-xs font-extrabold text-[#1f2430]">Consistent creative direction</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2">
            <span className="text-base">📂</span>
            <span className="text-xs font-extrabold text-[#1f2430]">Organised project delivery</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2">
            <span className="text-base">📱</span>
            <span className="text-xs font-extrabold text-[#1f2430]">Platform-ready exports</span>
          </div>
        </div>

      </div>
    </section>
  );
}
