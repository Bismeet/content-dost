import { Check, Calendar } from 'lucide-react';

interface CardProps {
  step: string;
  badge: string;
  title: string;
  badgeColor: string;
  showArrow?: boolean;
  children: React.ReactNode;
}

function ProcessCard({ step, badge, title, badgeColor, showArrow = false, children }: CardProps) {
  return (
    <div className="relative w-full">
      {/* Main card box styled exactly like Cops Media */}
      <div 
        className="w-full rounded-2xl bg-[#090604]/85 border border-[#fff7f0]/5 p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#FF5A00]/25 hover:translate-y-[-2px] relative shadow-lg"
        style={{
          aspectRatio: '1.38 / 1',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.75)'
        }}
      >
        {/* Top bar: Step Index & Category Badge */}
        <div className="flex items-center justify-between select-none">
          <span className="font-mono text-[10px] text-zinc-550 font-bold" style={{ margin: 0 }}>{step}</span>
          <span 
            className="font-mono text-[9px] tracking-wider bg-[#100b08]/80 border border-[#fff7f0]/5 px-2 py-0.5 rounded font-extrabold"
            style={{ color: badgeColor, margin: 0 }}
          >
            {badge}
          </span>
        </div>

        {/* Center slot for unique step visual preview */}
        <div className="flex items-center justify-start py-2 select-none h-12">
          {children}
        </div>

        {/* Bottom Title bar */}
        <div className="select-none text-left flex items-center gap-1.5" style={{ margin: 0 }}>
          <span className="font-heading text-[9px] tracking-widest text-[#B8ACA3] font-extrabold uppercase" style={{ margin: 0 }}>
            {title}
          </span>
        </div>
      </div>

      {/* Desktop connecting arrow centered between cards */}
      {showArrow && (
        <div 
          className="hidden md:flex pointer-events-none select-none text-zinc-800"
          style={{
            position: 'absolute',
            right: '-32px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function Workflow() {
  return (
    <section id="workflow" className="py-24 bg-[#020202] relative border-b border-zinc-950 scroll-mt-20 overflow-hidden">
      {/* Drifting Neon Glows for atmosphere */}
      <div 
        className="absolute top-[5%] left-[-5%] w-[380px] h-[380px] rounded-full pointer-events-none opacity-40 select-none animate-glow-drift-2"
        style={{
          background: 'radial-gradient(circle, rgba(255, 90, 0, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      ></div>
      <div 
        className="absolute bottom-[10%] right-[-5%] w-[420px] h-[420px] rounded-full pointer-events-none opacity-30 select-none animate-glow-drift-3"
        style={{
          background: 'radial-gradient(circle, rgba(247, 198, 35, 0.08) 0%, transparent 70%)',
          filter: 'blur(125px)'
        }}
      ></div>
      
      <div className="container relative z-10 max-w-5xl mx-auto px-4">
        {/* Section Header matching Cops Media screenshot */}
        <div className="w-full text-left mb-6">
          <span className="font-mono text-[9px] tracking-widest text-[#F7C623] font-bold block mb-2 uppercase select-none" style={{ margin: 0 }}>
            PROCESS
          </span>
          <h2 className="text-[#FFF7F0] text-xl md:text-2xl font-bold tracking-tight select-none" style={{ margin: 0 }}>
            This is the system that <span className="font-editorial text-[#F7C623] italic text-[1.12em] tracking-normal font-normal" style={{ fontFamily: 'var(--font-editorial), serif' }}>shapes</span> your content.
          </h2>
        </div>

        {/* Horizontal Pipeline playhead track */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%', 
            paddingBottom: '1rem', 
            borderBottom: '1px solid #141416', 
            marginBottom: '2rem' 
          }}
        >
          {/* Main timeline divider line */}
          <div style={{ flex: 1, marginRight: '2rem', position: 'relative', height: '1.5px', backgroundColor: '#141416' }}>
            {/* Left yellow track segment */}
            <div 
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '65%',
                backgroundColor: 'rgba(247, 198, 35, 0.6)'
              }}
            ></div>
            {/* Playhead marker positioned at 65% width */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '65%',
                transform: 'translate(-50%, -50%)',
                width: '0.4rem',
                height: '0.4rem',
                backgroundColor: '#F7C623',
                borderRadius: '9999px',
                boxShadow: '0 0 8px #F7C623'
              }}
            ></div>
          </div>
          {/* Playhead text */}
          <div className="font-mono text-[9px] select-none" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
            <span style={{ color: '#F7C623' }}>04</span>
            <span style={{ color: '#3f3f46' }}>/</span>
            <span style={{ color: '#71717a' }}>04</span>
            <span style={{ color: '#3f3f46', fontSize: '8px' }}>•</span>
            <span style={{ color: '#71717a', fontWeight: 'normal', marginLeft: '4px' }}>SYSTEM</span>
          </div>
        </div>

        {/* Huge centered editorial statement quote */}
        <div className="text-center mb-14">
          <h3 
            className="text-4xl md:text-[52px] text-[#FFF8F1] leading-tight tracking-tight select-none"
            style={{ 
              fontFamily: "'Caveat', cursive",
              fontWeight: 500,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
            }}
          >
            This is what the full system looks like.
          </h3>
        </div>

        {/* 6-Card Grid Layout */}
        <div className="workflow-grid max-w-4xl mx-auto">
          {/* Card 01: IDEA */}
          <ProcessCard step="01" badge="IDEA" badgeColor="#F7C623" title="● BRAINSTORM" showArrow={true}>
            {/* Clean empty center to match reference */}
            <div className="h-6"></div>
          </ProcessCard>

          {/* Card 02: SCRIPT */}
          <ProcessCard step="02" badge="SCRIPT" badgeColor="#F7C623" title="STORYBOARDING" showArrow={true}>
            <div className="space-y-1.5 w-20 flex flex-col justify-center">
              <div className="h-[2px] bg-[#F7C623] w-14 rounded-sm" style={{ opacity: 0.9 }}></div>
              <div className="h-[2px] bg-[#F7C623] w-18 rounded-sm" style={{ opacity: 0.6 }}></div>
              <div className="h-[2px] bg-[#F7C623] w-10 rounded-sm" style={{ opacity: 0.3 }}></div>
            </div>
          </ProcessCard>

          {/* Card 03: EDIT */}
          <ProcessCard step="03" badge="EDIT" badgeColor="#3B82F6" title="TIMELINE CUTS">
            <div className="flex gap-1 w-24">
              <div className="h-1 bg-blue-500 rounded-sm w-[45%]" style={{ boxShadow: '0 0 8px rgba(59,130,246,0.5)' }}></div>
              <div className="h-1 bg-blue-500 rounded-sm w-[35%]" style={{ opacity: 0.7 }}></div>
              <div className="h-1 bg-blue-500 rounded-sm w-[15%]" style={{ opacity: 0.4 }}></div>
            </div>
          </ProcessCard>

          {/* Card 04: REVIEW */}
          <ProcessCard step="04" badge="REVIEW" badgeColor="#3B82F6" title="CLIENT APPROVAL" showArrow={true}>
            <div className="w-5.5 h-5.5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </ProcessCard>

          {/* Card 05: SCHED */}
          <ProcessCard step="05" badge="SCHED" badgeColor="#EF4444" title="CALENDAR SYNC" showArrow={true}>
            <div className="text-red-500/80">
              <Calendar className="w-5 h-5" />
            </div>
          </ProcessCard>

          {/* Card 06: LIVE */}
          <ProcessCard step="06" badge="LIVE" badgeColor="#10B981" title="DISTRIBUTION">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#00FF66] tracking-wider font-extrabold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" style={{ boxShadow: '0 0 8px #00FF66' }}></span>
              <span>LIVE</span>
            </div>
          </ProcessCard>
        </div>

      </div>
    </section>
  );
}
