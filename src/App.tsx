import Navbar from './components/Navbar';
import HeroScroll from './components/HeroScroll';
import TrustStrip from './components/TrustStrip';
import Services from './components/Services';
import SelectedWork from './components/SelectedWork';
import Process from './components/Process';
import Results from './components/Results';
import WhyContentDost from './components/WhyContentDost';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ProjectEnquiry from './components/ProjectEnquiry';
import Footer from './components/Footer';
import { SmoothScrollProvider } from './providers/SmoothScrollProvider';

export default function App() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen" style={{ backgroundColor: 'var(--ink)', color: 'var(--bone)' }}>

        {/* Navigation */}
        <Navbar />

        {/* Page Sections */}
        <main>
          <HeroScroll />
          <TrustStrip />
          <Services />
          <SelectedWork />
          <Process />
          <Results />
          <WhyContentDost />
          <Testimonials />
          <FAQ />
          <ProjectEnquiry />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
