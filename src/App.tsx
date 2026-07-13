import Navbar from './components/Navbar';
import HeroScroll from './components/HeroScroll';
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
import PostHeroEffects from './components/PostHeroEffects';
import ShootingStarsBackground from './components/backgrounds/ShootingStarsBackground';

export default function App() {
  return (
    <SmoothScrollProvider>
      <div className="app-root">
        {/* Navigation */}
        <Navbar />

        <main>
          <HeroScroll />

          <div className="post-hero-site">
            <ShootingStarsBackground />
            <PostHeroEffects />
            <div className="post-hero-content">
              <Services />
              <SelectedWork />
              <Process />
              <Results />
              <WhyContentDost />
              <Testimonials />
              <FAQ />
              <ProjectEnquiry />
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
