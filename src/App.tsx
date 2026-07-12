import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import SocialProof from './sections/SocialProof';
import Services from './sections/Services';
import Workflow from './sections/Workflow';
import Portfolio from './sections/Portfolio';
import Metrics from './sections/Metrics';
import Founder from './sections/Founder';
import Differentiators from './sections/Differentiators';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  useEffect(() => {
    // Progressive enhancement feature detection for CSS Scroll-Driven Animations
    const supportsScrollTimeline = 
      typeof CSS !== 'undefined' && 
      CSS.supports && 
      CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

    if (!supportsScrollTimeline) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      // Find all elements marked for reveal-on-scroll
      document.querySelectorAll('.scroll-reveal-fallback').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 overflow-x-hidden selection:bg-orange-500/30 selection:text-white">
      {/* Global Film Grain Texture Overlay */}
      <div className="film-grain"></div>

      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main>
        <Hero />
        
        <div className="scroll-reveal scroll-reveal-fallback">
          <SocialProof />
        </div>
        
        <div className="scroll-reveal scroll-reveal-fallback">
          <Services />
        </div>
        
        <div className="scroll-reveal scroll-reveal-fallback">
          <Workflow />
        </div>
        
        <div className="scroll-reveal scroll-reveal-fallback">
          <Portfolio />
        </div>
        
        <div className="scroll-reveal scroll-reveal-fallback">
          <Metrics />
        </div>
        
        <div className="scroll-reveal scroll-reveal-fallback">
          <Founder />
        </div>
        
        <div className="scroll-reveal scroll-reveal-fallback">
          <Differentiators />
        </div>
        
        <div className="scroll-reveal scroll-reveal-fallback">
          <FAQ />
        </div>
        
        <div className="scroll-reveal scroll-reveal-fallback">
          <Contact />
        </div>
      </main>

      {/* Footer Navigation & Credits */}
      <Footer />
    </div>
  );
}
