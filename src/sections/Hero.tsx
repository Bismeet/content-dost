import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section 
      className="relative min-h-svh pt-32 pb-20 flex items-center overflow-hidden bg-[#030303]"
    >
      {/* Background Volumetric glows */}
      <div 
        className="absolute rounded-full pointer-events-none z-0 animate-glow-drift-1" 
        style={{
          top: '10%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      ></div>
      <div 
        className="absolute rounded-full pointer-events-none z-0 animate-glow-drift-2" 
        style={{
          bottom: '10%',
          right: '10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(247, 198, 35, 0.08) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }}
      ></div>

      {/* Cinematic Falling Streaks Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          {/* Curved pathways animated via CSS stroke-dashoffset */}
          <path d="M80,-50 Q120,300 60,950" stroke="url(#streak-gradient-1)" strokeWidth="1" strokeDasharray="300 600" strokeDashoffset="0" className="animate-streak-1" />
          <path d="M220,-50 Q260,400 180,950" stroke="url(#streak-gradient-2)" strokeWidth="1.2" strokeDasharray="400 500" strokeDashoffset="0" className="animate-streak-2" />
          <path d="M380,-50 Q360,250 400,950" stroke="url(#streak-gradient-1)" strokeWidth="1" strokeDasharray="200 600" strokeDashoffset="0" className="animate-streak-3" />
          <path d="M580,-50 Q620,450 540,950" stroke="url(#streak-gradient-2)" strokeWidth="1.5" strokeDasharray="300 700" strokeDashoffset="0" className="animate-streak-4" />
          <path d="M780,-50 Q750,300 800,950" stroke="url(#streak-gradient-3)" strokeWidth="1" />
          <path d="M960,-50 Q1010,400 920,950" stroke="url(#streak-gradient-1)" strokeWidth="1.2" strokeDasharray="400 600" strokeDashoffset="0" className="animate-streak-5" />
          <path d="M1120,-50 Q1080,350 1140,950" stroke="url(#streak-gradient-2)" strokeWidth="1" />
          <path d="M1320,-50 Q1380,250 1280,950" stroke="url(#streak-gradient-3)" strokeWidth="1.5" strokeDasharray="300 500" strokeDashoffset="0" className="animate-streak-3" />

          <defs>
            <linearGradient id="streak-gradient-1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5A00" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF5A00" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FFB000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="streak-gradient-2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFB000" stopOpacity="0" />
              <stop offset="40%" stopColor="#F7C623" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF5A00" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="streak-gradient-3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6A00" stopOpacity="0" />
              <stop offset="60%" stopColor="#FF5A00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFB000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Centered Cinematic Light Beam */}
      <div 
        className="absolute pointer-events-none z-0 select-none"
        style={{
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '100%',
          background: 'radial-gradient(ellipse at top, rgba(255, 90, 0, 0.15) 0%, transparent 60%)',
          mixBlendMode: 'screen',
          filter: 'blur(20px)',
          opacity: 0.95
        }}
      ></div>

      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none opacity-15"></div>

      {/* Ambient Tech Timecodes */}
      <div 
        className="absolute text-zinc-600 font-mono text-[9px] uppercase tracking-widest hidden lg:block opacity-35 select-none"
        style={{ top: '8rem', left: '3rem' }}
      >
        TC_00:08:42:12 // SYSTEM: PORTAL_ENG_ACTIVE
      </div>
      <div 
        className="absolute text-zinc-600 font-mono text-[9px] uppercase tracking-widest hidden lg:block opacity-35 select-none"
        style={{ bottom: '3rem', right: '3rem' }}
      >
        GRID_UNIT_02 // RENDER_BUFFER_144FPS
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center text-center space-y-8 py-10 max-w-5xl mx-auto">
        
        {/* SVG Curved Content-Signal Trails */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 hidden lg:block">
          <svg className="w-full h-full opacity-20" viewBox="0 0 1200 800" fill="none">
            <path d="M 0,150 C 350,100 450,220 500,420" stroke="url(#gradient-portal-1)" strokeWidth="1" strokeDasharray="3, 3" />
            <path d="M 150,0 C 250,280 380,320 520,470" stroke="url(#gradient-portal-2)" strokeWidth="1.5" />
            <path d="M 850,0 C 720,220 580,280 540,510" stroke="url(#gradient-portal-1)" strokeWidth="1" />
            <defs>
              <linearGradient id="gradient-portal-1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF5A00" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFB000" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gradient-portal-2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FF5A00" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Small Label */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF5A00]/10 border border-[#FF5A00]/25 text-[#FFB000] text-[10px] font-extrabold uppercase tracking-widest select-none">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>CONTENT DOST • CONTENT THAT GETS WATCHED</span>
        </div>

        {/* Editorial Mixed Typography Headline */}
        <h1 className="text-[#FFF8F1] leading-[1.05] tracking-tight text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl mx-auto">
          We turn <span className="font-editorial text-[#F7C623] italic text-[1.12em] tracking-tight">raw</span> ideas{" "}
          <br className="hidden sm:inline" />
          into content people<br />
          <span className="font-editorial text-orange-gradient italic text-[1.12em] tracking-tight">actually watch.</span>
        </h1>

        {/* Supporting paragraph */}
        <p className="text-[#B8ACA3] text-base md:text-lg font-medium max-w-2xl leading-relaxed text-center mx-auto">
          Strategy, scriptwriting, video editing, brand management and websites for creators and brands that want to grow without building a full in-house team.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4">
          <a href="#contact" className="btn-primary">
            <span>Start a Project</span>
            <span className="font-sans ml-1 text-sm font-bold">↗</span>
          </a>
          <a href="#portfolio" className="btn-secondary">
            <span>See Our Work</span>
            <span className="font-sans ml-1 text-sm font-bold">↓</span>
          </a>
        </div>

        {/* Bottom Service Line */}
        <div className="w-full pt-6 border-t border-zinc-900 mt-6 select-none text-center">
          <p className="font-mono text-[10px] text-zinc-550 uppercase tracking-widest font-bold">
            STRATEGY &bull; SCRIPTWRITING &bull; VIDEO EDITING &bull; BRAND MANAGEMENT &bull; WEBSITES
          </p>
        </div>

      </div>
    </section>
  );
}
