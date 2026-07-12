import { Sparkles, Send } from 'lucide-react';

export default function Founder() {
  return (
    <section className="py-24 bg-[#020202] relative border-b border-zinc-950 overflow-hidden">
      {/* Drifting Neon Glows */}
      <div 
        className="absolute top-[20%] left-[-5%] w-[350px] h-[350px] rounded-full pointer-events-none opacity-40 select-none animate-glow-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      ></div>
      <div 
        className="absolute bottom-[20%] right-[-5%] w-[380px] h-[380px] rounded-full pointer-events-none opacity-30 select-none animate-glow-drift-2"
        style={{
          background: 'radial-gradient(circle, rgba(247, 198, 35, 0.08) 0%, transparent 70%)',
          filter: 'blur(115px)'
        }}
      ></div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Agency Story & Vision */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/25 text-[#FF6A00] text-[10px] font-extrabold uppercase tracking-widest select-none">
              <span>OUR CHARTER</span>
            </div>
            
            <h2 className="text-[#FFF7F0] leading-tight">
              The trusted creative ally for <br />
              <span className="font-editorial text-orange-gradient italic text-[1.15em] tracking-normal">the internet's elite.</span>
            </h2>

            <p className="text-[#B9AAA0] text-sm md:text-base leading-relaxed">
              We founded Content Dost with a single conviction: <strong>your content shouldn't feel like a chore, and your agency shouldn't feel like a supplier.</strong> Most founders and creators lose hundreds of hours editing raw clips, scripting hooks that fail to retain, and managing flakey freelancers.
            </p>
            
            <p className="text-[#B9AAA0] text-sm md:text-base leading-relaxed">
              We built an elite alternative. Content Dost operates as your trusted creative partner. We integrate scripting, recording briefs, high-end pacing post-production, dynamic thumb design, and cross-channel distribution support into a unified, predictable monthly workflow.
            </p>

            <blockquote 
              className="border-l-2 border-[#FF4D00] pl-4 py-1 my-6 text-[#FFF7F0] font-editorial text-2xl italic leading-relaxed text-orange-gradient"
              style={{ fontFamily: 'var(--font-editorial), serif' }}
            >
              "We stay in the shadows of the post-production timeline, organizing your systems so you can capture authority."
            </blockquote>
            
            <div className="flex items-center gap-4 pt-4 select-none">
              <span className="text-xs text-zinc-500">Core Values:</span>
              <div className="flex flex-wrap gap-2">
                {['Zero Friction', '144Hz Pacing Quality', 'Retention Engineered', 'Aligned Partnership'].map((val, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-[#080503] border border-zinc-900 text-[9px] text-zinc-350 font-mono">
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Founder Profile Card */}
          <div className="lg:col-span-5 relative">
            <div className="panel-glass rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              
              {/* Founder Image Mock / Guide */}
              <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-gradient-to-tr from-[#020202] via-[#FF4D00]/5 to-[#080503] border border-zinc-900 flex flex-col justify-between p-6 mb-6">
                
                {/* Developer Instructions Overlay */}
                <div className="absolute inset-0 bg-[#020202]/65 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-6 border border-[#FF4D00]/10 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/20 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-[#FF4D00]" />
                  </div>
                  <span className="font-mono text-[9px] text-[#FF8A00] font-bold uppercase tracking-wider select-none">
                    FOUNDER PROFILE PHOTO
                  </span>
                  <p className="text-[10px] text-zinc-400 max-w-[200px] mt-2">
                    Replace this gradient background with your profile picture.
                  </p>
                  <code className="text-[9px] text-zinc-600 bg-[#020202] border border-zinc-900 px-2 py-1 rounded font-mono mt-4 select-none">
                    src/sections/Founder.tsx
                  </code>
                </div>
                
                <div className="z-10 select-none">
                  <span className="px-2 py-0.5 rounded bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[9px] font-mono text-[#FF8A00] font-bold uppercase">
                    CREATIVE LEAD
                  </span>
                </div>

                <div className="z-10 text-left space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-[#FFF7F0]">Your Name Here</h3>
                  <p className="text-xs text-zinc-500 font-medium">Founder & Strategy Partner</p>
                </div>
              </div>

              {/* Founder copy */}
              <div className="space-y-4 text-left">
                <p className="text-xs text-[#B9AAA0] leading-relaxed">
                  "Hi, I'm the founder of Content Dost. I built this agency to act as the ultimate creative partner. We help you scale from raw footage to millions of organic views."
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-900 select-none">
                  <div className="flex items-center gap-2">
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded bg-[#020202] hover:bg-[#FF4D00]/10 border border-zinc-900 hover:border-[#FF4D00]/30 flex items-center justify-center text-zinc-400 hover:text-[#FF4D00] transition-colors cursor-pointer"
                      title="LinkedIn profile"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                    <a
                      href="mailto:hello@contentdost.agency"
                      className="w-8 h-8 rounded bg-[#020202] hover:bg-[#FF4D00]/10 border border-zinc-900 hover:border-[#FF4D00]/30 flex items-center justify-center text-zinc-400 hover:text-[#FF4D00] transition-colors cursor-pointer"
                      title="Send email"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-650">SYS_TEAM_ACTIVE</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
