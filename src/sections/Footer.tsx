import { contactInfo } from '../data/content';
import { Sparkles, ArrowUp } from 'lucide-react';

export default function Footer() {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': 
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'youtube': 
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
            <path d="m10 15 5-3-5-3z"/>
          </svg>
        );
      case 'linkedin': 
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect width="4" height="12" x="2" y="9"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        );
      case 'instagram': 
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        );
      default: return null;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-zinc-950 py-16">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Logo & Pitch */}
          <div className="md:col-span-5 text-left space-y-4">
            <a href="#" className="flex items-center gap-3 group text-decoration-none">
              <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_10px_rgba(255,87,34,0.3)] transition-transform duration-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2" />
                  <line x1="8" x2="16" y1="12" y2="12" />
                </svg>
              </div>
              <span className="font-heading text-lg font-extrabold tracking-tight text-white">
                CONTENT <span className="text-orange-500">DOST</span>
              </span>
            </a>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
              The premier content strategy, scripting, and post-production engine for high-retention creator networks and personal brands.
            </p>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 text-left space-y-4">
            <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">DIRECTORY</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><a href="#services" className="hover:text-orange-500 transition-colors text-decoration-none">Services</a></li>
              <li><a href="#workflow" className="hover:text-orange-500 transition-colors text-decoration-none">Workflow & Process</a></li>
              <li><a href="#portfolio" className="hover:text-orange-500 transition-colors text-decoration-none">Case Showcase</a></li>
              <li><a href="#results" className="hover:text-orange-500 transition-colors text-decoration-none">Results Dashboard</a></li>
            </ul>
          </div>

          {/* Connect Links */}
          <div className="md:col-span-4 text-left space-y-4">
            <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">SOCIAL CHANNELS</h4>
            <div className="flex items-center gap-3">
              {Object.entries(contactInfo.socials).map(([platform, link]) => (
                <a
                  key={platform}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-950 hover:bg-orange-500/10 border border-zinc-900 hover:border-orange-500/30 flex items-center justify-center text-zinc-500 hover:text-orange-500 transition-colors"
                  title={`Follow us on ${platform}`}
                >
                  {getSocialIcon(platform)}
                </a>
              ))}
            </div>
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-orange-500 border border-zinc-800 hover:border-orange-500/30 text-[10px] font-mono font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>BACK TO TOP</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-650">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Content Dost Agency. All rights reserved.</span>
            <span>|</span>
            <span className="text-orange-500 flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> 144Hz Pacing Enabled</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-500 transition-colors text-decoration-none">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition-colors text-decoration-none">Terms of Retention</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
