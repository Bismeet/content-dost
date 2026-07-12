import { CheckSquare, ShieldCheck, Zap, Layers, RefreshCw, Cpu } from 'lucide-react';

export default function Differentiators() {
  const items = [
    {
      icon: <Layers className="w-5 h-5 text-orange-500" />,
      title: "Strategy + Execution",
      description: "We don't just edit what you send. We build the script format and topics, guide the shoot, execute the edit, and design the thumbnails. It's a cohesive engine."
    },
    {
      icon: <Cpu className="w-5 h-5 text-orange-500" />,
      title: "Creator-Native Fluency",
      description: "We speak the language of algorithms, retention curves, A/B testing, and CTR psychology. We understand what keeps viewers hooked past the 3-second mark."
    },
    {
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      title: "Rapid Workflow System",
      description: "Our proprietary dashboard keeps scripting review, visual notes, video assets, and final approvals in one clean dashboard. No messy email threads or lost files."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-orange-500" />,
      title: "Cinema-Grade Quality Control",
      description: "Every frame of your video is passed through our lead editor for grade verification, loudness levels normalization, audio smoothing, and typography QC."
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-orange-500" />,
      title: "Multi-Platform Repurposing",
      description: "We translate a single long-form podcast or educational video into vertical reels, TikToks, LinkedIn threads, and newsletters. Multiply your distribution by 10x."
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-orange-500" />,
      title: "Fixed Monthly Retainers",
      description: "No hourly billing surprises. You get a dedicated content manager, editing team, and scripting support for a predictable monthly flat fee."
    }
  ];

  return (
    <section className="py-24 bg-[#030303] relative border-b border-zinc-950">
      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest mb-4">
            <span>THE DIFFERENTIATORS</span>
          </div>
          <h2 className="text-white mb-6">
            Why creators scale with<br />
            <span className="font-editorial text-orange-gradient italic text-[1.15em] tracking-normal">Content Dost.</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl">
            We operate as a partner, not an expense. We replace three freelancers with a unified high-retention content system.
          </p>
        </div>

        {/* Differentiators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="card-premium p-6 border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/20 flex flex-col justify-between"
            >
              <div className="space-y-4 text-left">
                <div className="w-10 h-10 rounded-lg bg-orange-500/5 border border-orange-500/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-100 group-hover:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-zinc-900/60 text-[9px] font-mono text-zinc-650 flex justify-between">
                <span>QC_CHECK: PASSED</span>
                <span>0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
