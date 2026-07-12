import { useState } from 'react';
import { portfolioItems } from '../data/content';
import { Play, Film, ExternalLink } from 'lucide-react';

export default function Portfolio() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="portfolio" className="py-24 bg-[#020202] relative border-b border-zinc-950 scroll-mt-20">
      {/* Drifting Neon Glows */}
      <div 
        className="absolute top-[25%] left-[-5%] w-[380px] h-[380px] rounded-full pointer-events-none opacity-40 select-none animate-glow-drift-3"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(105px)'
        }}
      ></div>
      <div 
        className="absolute bottom-[15%] right-[10%] w-[390px] h-[390px] rounded-full pointer-events-none opacity-30 select-none animate-glow-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(247, 198, 35, 0.08) 0%, transparent 70%)',
          filter: 'blur(115px)'
        }}
      ></div>

      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/25 text-[#FF6A00] text-[10px] font-extrabold uppercase tracking-widest mb-4 select-none">
              <span>CASE SHOWCASE</span>
            </div>
            <h2 className="text-[#FFF7F0] mb-4">
              Our edits are assets.<br />
              <span className="font-editorial text-orange-gradient italic text-[1.15em] tracking-normal">Here is the proof.</span>
            </h2>
            <p className="text-[#B9AAA0] text-sm leading-relaxed">
              We focus on retention metrics and inbound conversion. Every project below was built from script to final cinematic delivery.
            </p>
          </div>
          <div className="flex items-center gap-2 select-none">
            <span className="text-xs text-zinc-500">Filter:</span>
            <span className="px-3 py-1.5 rounded-full bg-[#080503] border border-zinc-900 text-xs font-bold text-[#FF6A00] font-mono">
              ALL RETENTION CASES
            </span>
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="panel-glass p-6 rounded-2xl flex flex-col justify-between h-full min-h-[500px] transition-all duration-300 hover:border-[#FF4D00]/30 hover:shadow-[0_20px_45px_rgba(0,0,0,0.9),0_0_30px_rgba(255,77,0,0.06)] relative group"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Top Header details */}
              <div className="text-left mb-6">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[9px] font-mono text-[#FF8A00] font-bold uppercase tracking-wider bg-[#FF4D00]/5 px-2.5 py-0.5 rounded border border-[#FF4D00]/15">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-[#020202] border border-zinc-900 px-2 py-0.5 rounded">
                    {item.platform} • {item.duration}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#FFF7F0] mt-3">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Partner: {item.creator}</p>
              </div>

              {/* Center: Video Player Aspect Mockup */}
              <div className={`relative w-full rounded-xl overflow-hidden bg-gradient-to-br ${item.mockVideoColor} border border-zinc-900 flex items-center justify-center transition-all duration-500 group-hover:border-[#FF4D00]/30 mb-6 ${
                item.platform === 'Reels' ? 'h-56 aspect-[9/16] mx-auto max-w-[180px]' : 'h-48'
              }`}>
                {/* Background Grid Lines inside mockup */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {/* Play Button Overlay */}
                <div className={`w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 ${hoveredId === item.id ? 'scale-110 bg-[#FF4D00] text-white shadow-[0_0_20px_rgba(255,77,0,0.5)]' : 'text-zinc-300'}`}>
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>

                {/* HUD preview overlay */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[8px] font-mono text-white/50 bg-[#020202]/70 backdrop-blur-sm px-2 py-1.5 rounded border border-white/5 select-none">
                  <span className="flex items-center gap-1">
                    <Film className="w-3 h-3 text-[#FF6A00]" />
                    <span>PREVIEW_CUT.mov</span>
                  </span>
                  <span>144Hz COMPATIBLE</span>
                </div>
              </div>

              {/* Challenge & Solution Texts */}
              <div className="text-left space-y-3 mb-6 p-4 rounded-xl bg-[#020202]/50 border border-zinc-900">
                <div className="text-xs">
                  <span className="font-mono text-[#FF8A00]/90 font-bold block mb-1">CHALLENGE</span>
                  <p className="text-[#B9AAA0] leading-relaxed text-[11px]">{item.challenge}</p>
                </div>
                <div className="text-xs border-t border-zinc-900/60 pt-2.5">
                  <span className="font-mono text-zinc-300 font-bold block mb-1">SOLUTION</span>
                  <p className="text-[#B9AAA0] leading-relaxed text-[11px]">{item.solution}</p>
                </div>
              </div>

              {/* Bottom Metrics HUD */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-900 font-mono text-center">
                <div className="p-2 rounded bg-[#020202] border border-zinc-900">
                  <span className="text-[8px] text-zinc-500 block uppercase">Views</span>
                  <span className="text-xs text-[#FFF7F0] font-bold block mt-0.5">{item.stats.views}</span>
                </div>
                <div className="p-2 rounded bg-[#020202] border border-zinc-900">
                  <span className="text-[8px] text-zinc-500 block uppercase truncate">{item.stats.metricLabel}</span>
                  <span className="text-xs text-[#FF6A00] font-bold block mt-0.5">{item.stats.metricVal}</span>
                </div>
                <div className="p-2 rounded bg-[#020202] border border-zinc-900">
                  <span className="text-[8px] text-zinc-500 block uppercase">Growth</span>
                  <span className="text-[10px] text-[#FFF7F0] font-bold block mt-0.5 truncate">{item.stats.growth}</span>
                </div>
              </div>

              {/* External link decoration */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <ExternalLink className="w-4 h-4 text-[#FF6A00]" />
              </div>
            </div>
          ))}
        </div>

        {/* Supporting note */}
        <div className="mt-12 text-center p-4 rounded-xl border border-zinc-900/60 bg-[#080503]/40 max-w-lg mx-auto select-none">
          <p className="text-xs text-zinc-500">
            Real portfolio files can be mapped instantly by updating the JSON schema inside <code className="text-[#FF6A00] font-mono text-[10px]">src/data/content.ts</code>.
          </p>
        </div>

      </div>
    </section>
  );
}
