export default function SocialProof() {
  const brands = [
    "VANCE TECH LABS",
    "ALEX RIVERA AI",
    "SOVEREIGN CAPITAL",
    "THE DEVIN COLE SHOW",
    "INFINITE HOOK MEDIA",
    "NEXUS MEDIA GROUP",
    "CREATOR MATRIX",
    "FORBES TECH OUTPOST",
  ];

  return (
    <div className="relative z-20 bg-transparent pointer-events-none -mt-16 animate-bob">
      <div className="container relative select-none">
        
        {/* Floating Apple Glass Capsule */}
        <div 
          className="mx-auto w-full max-w-7xl rounded-2xl border py-5.5 px-8 shadow-2xl relative overflow-hidden pointer-events-auto"
          style={{
            background: 'rgba(15, 12, 10, 0.35)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 50px rgba(255, 77, 0, 0.04)',
            borderColor: 'rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Subtle inside glow reflection highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>

          {/* Label at the top */}
          <div className="text-center mb-4 select-none">
            <p className="text-[10px] md:text-xs uppercase font-extrabold tracking-widest text-zinc-450 font-mono">
              Trusted by Leading Creators & Brands
            </p>
          </div>

          {/* Scrolling Marquee Container */}
          <div className="relative flex w-full overflow-hidden">
            {/* Ambient edge-fades nested inside capsule */}
            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#030303]/60 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#030303]/60 to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Row */}
            <div className="flex gap-16 animate-marquee items-center whitespace-nowrap min-w-full">
              {/* Double list for smooth wrapping */}
              {[...brands, ...brands].map((brand, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors cursor-default"
                >
                  <span className="font-heading text-lg md:text-xl font-extrabold tracking-wide">
                    {brand}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]/50 mx-4"></span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-marquee {
          animation: marquee 34s linear infinite;
        }
        .animate-bob {
          animation: bob 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
