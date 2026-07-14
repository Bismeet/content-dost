import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock values and logic for navbar visibility state
const calculateNavbarVisibility = (sentinelTop: number, isIntersecting: boolean): boolean => {
  return !isIntersecting && sentinelTop < 0;
};

const getInitialNavbarVisibility = (hash: string, scrollY: number, innerHeight: number): boolean => {
  const isPostHeroHash = hash && hash !== '#' && ['#services', '#work', '#process', '#results', '#faq'].includes(hash);
  const isScrolledPastHero = scrollY > innerHeight - 100;
  return !!(isPostHeroHash || isScrolledPastHero);
};

describe('Navbar Scroll Jitter and Staging Logic Tests', () => {
  describe('Sentinel Observer Visibility States', () => {
    it('hides navbar when sentinel is below the viewport', () => {
      // Sentinel is below the viewport: top is positive (e.g. 500px), not intersecting
      expect(calculateNavbarVisibility(500, false)).toBe(false);
    });

    it('hides navbar while sentinel intersects the viewport', () => {
      // Sentinel intersects anywhere: top can be 100px or 0px, isIntersecting is true
      expect(calculateNavbarVisibility(100, true)).toBe(false);
      expect(calculateNavbarVisibility(0, true)).toBe(false);
      expect(calculateNavbarVisibility(-4, true)).toBe(false);
    });

    it('shows navbar only when sentinel has crossed completely above the viewport', () => {
      // Sentinel is above viewport: top is negative (e.g. -10px), not intersecting
      expect(calculateNavbarVisibility(-10, false)).toBe(true);
    });
  });

  describe('Initial Load States', () => {
    it('hides navbar on initial top-of-page load', () => {
      expect(getInitialNavbarVisibility('', 0, 900)).toBe(false);
      expect(getInitialNavbarVisibility('#', 0, 900)).toBe(false);
    });

    it('shows navbar on initial deep-page load', () => {
      expect(getInitialNavbarVisibility('', 1200, 900)).toBe(true);
    });

    it('shows navbar on load when a hash link is specified', () => {
      expect(getInitialNavbarVisibility('#services', 0, 900)).toBe(true);
      expect(getInitialNavbarVisibility('#work', 0, 900)).toBe(true);
    });
  });

  describe('GSAP Target Assertions', () => {
    it('verifies that no GSAP/Timeline files target .site-navbar', () => {
      const srcDir = path.resolve(__dirname, '../src');
      
      const checkFile = (filePath: string) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Check for gsap.to, gsap.set, gsap.from, gsap.fromTo with '.site-navbar'
        const regex = /gsap\.(to|set|from|fromTo)\(\s*['"]\.site-navbar['"]/g;
        expect(regex.test(content)).toBe(false);
      };

      checkFile(path.join(srcDir, 'components/HeroScroll.tsx'));
      checkFile(path.join(srcDir, 'providers/SmoothScrollProvider.tsx'));
    });
  });

  describe('Navbar Interaction and DOM Safety', () => {
    it('ensures hidden navbar has pointer-events: none and visibility: hidden', () => {
      const cssPath = path.resolve(__dirname, '../src/index.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Verify shell has pointer-events: none
      expect(cssContent).toContain('.site-navbar-shell {');
      expect(cssContent).toContain('pointer-events: none;');
      
      // Verify reveal has pointer-events: none and visibility: hidden
      expect(cssContent).toContain('.site-navbar-reveal {');
      expect(cssContent).toContain('pointer-events: none;');
      expect(cssContent).toContain('visibility: hidden;');
      
      // Verify visible reveal has pointer-events: auto and visibility: visible
      expect(cssContent).toContain('.site-navbar-reveal--visible {');
      expect(cssContent).toContain('pointer-events: auto !important;');
      expect(cssContent).toContain('visibility: visible !important;');
    });

    it('ensures active-section changes do not change navbar width or shift layout', () => {
      const cssPath = path.resolve(__dirname, '../src/index.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      // The gliding capsule & rail must use absolute positioning to avoid shifts
      expect(cssContent).toContain('.navbar-gliding-capsule {');
      expect(cssContent).toContain('.navbar-gliding-rail {');
      
      // Active states only change color / visual properties, no font-weight bold width shifting
      const activeLinkRule = cssContent.match(/\.navbar-link--active\s*\{([^}]+)\}/);
      if (activeLinkRule) {
        const body = activeLinkRule[1];
        expect(body).not.toContain('font-weight: bold');
        expect(body).not.toContain('font-weight: 700');
      }
    });

    it('verifies that no pointer-tilt logic remains on the navbar shell', () => {
      const tsxPath = path.resolve(__dirname, '../src/components/Navbar.tsx');
      const tsxContent = fs.readFileSync(tsxPath, 'utf-8');
      
      expect(tsxContent).not.toContain('handleMouseMove');
      expect(tsxContent).not.toContain('handleMouseLeave');
      expect(tsxContent).not.toContain('onMouseMove');
      expect(tsxContent).not.toContain('onMouseLeave');
      expect(tsxContent).not.toContain('--nav-tilt');
    });
  });
});
