import { statsData } from '../data/content';
import { Eye, TrendingUp, Calendar, Zap } from 'lucide-react';

export default function Metrics() {
  // Map icons to stats for visual hierarchy
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Eye className="w-5 h-5 text-[#FF4D00]" />;
      case 1: return <TrendingUp className="w-5 h-5 text-[#FF4D00]" />;
      case 2: return <Calendar className="w-5 h-5 text-[#FF4D00]" />;
      case 3: return <Zap className="w-5 h-5 text-[#FF4D00]" />;
      default: return <Eye className="w-5 h-5 text-[#FF4D00]" />;
    }
  };

  return (
    <section id="results" className="py-24 bg-[#020202] relative border-b border-zinc-950 scroll-mt-20">
      {/* Drifting Neon Glows */}
      <div 
        className="absolute top-[10%] left-[10%] w-[360px] h-[360px] rounded-full pointer-events-none opacity-40 select-none animate-glow-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      ></div>
      <div 
        className="absolute bottom-[20%] right-[10%] w-[410px] h-[410px] rounded-full pointer-events-none opacity-30 select-none animate-glow-drift-2"
        style={{
          background: 'radial-gradient(circle, rgba(247, 198, 35, 0.08) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }}
      ></div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/25 text-[#FF6A00] text-[10px] font-extrabold uppercase tracking-widest mb-4 select-none">
            <span>THE OUTCOMES</span>
          </div>
          <h2 className="text-[#FFF7F0] mb-6">
            Compounding views.<br />
            <span className="font-editorial text-orange-gradient italic text-[1.15em] tracking-normal">Uncompromising speed.</span>
          </h2>
          <p className="text-[#B9AAA0] text-sm md:text-base max-w-xl leading-relaxed">
            We track client retention and views generated. If our content doesn't perform, our business doesn't grow. Here is what we have built:
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className="panel-glass p-6 flex flex-col justify-between items-start transition-all duration-300 hover:border-[#FF4D00]/30 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.95)] relative group"
            >
              {/* Top HUD decoration */}
              <div className="flex items-center justify-between w-full mb-6 select-none">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#FF4D00]/5 border border-[#FF4D00]/15">
                  {getIcon(idx)}
                </div>
                <span className="font-mono text-[9px] text-zinc-600">SYS_METRIC_0{idx + 1}</span>
              </div>

              {/* Large Stats Display */}
              <div className="space-y-2 text-left">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading block text-orange-gradient">
                  {stat.value}
                </span>
                <span className="text-sm font-bold tracking-tight text-[#FFF7F0] block">
                  {stat.label}
                </span>
                <p className="text-xs text-[#B9AAA0] leading-relaxed">
                  {stat.subtext}
                </p>
              </div>

              {/* Graphic details inside card */}
              <div className="mt-6 w-full pt-4 border-t border-zinc-900/60 flex items-center justify-between text-[9px] font-mono text-zinc-600 select-none">
                <span>STATUS: VERIFIED</span>
                <span className="text-[#FF6A00]">ENG: 100%</span>
              </div>

              {/* Glowing highlight strip */}
              <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF4D00]/0 to-transparent group-hover:via-[#FF4D00]/40 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
