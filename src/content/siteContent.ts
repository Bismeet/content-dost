export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  creator: string;
  category: string;
  platform: 'YouTube' | 'Reels' | 'Podcast' | 'Multi-Channel';
  stats: {
    views?: string;
    metricLabel?: string;
    metricVal?: string;
    growth?: string;
  };
  challenge: string;
  solution: string;
  mockVideoColor: string;
  duration: string;
  isConcept: boolean; // Mark portfolio sample / concept project
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  detail: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  achievement: string;
  isFallback: boolean; // Development fallback indicator
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "content-strategy",
    title: "Content Strategy",
    description: "Clear topics, hooks and formats built around what your audience actually wants to watch.",
    features: ["Audience intent mapping", "Format blueprints", "Hook validation frameworks"]
  },
  {
    id: "script-writing",
    title: "Scriptwriting",
    description: "Structured hooks, pacing and storytelling that give viewers a reason to stay.",
    features: ["Hook variation design", "Retention pacing markers", "Visual direction notes"]
  },
  {
    id: "long-form-editing",
    title: "Long-Form Editing",
    description: "YouTube videos, interviews and podcasts shaped with purposeful pacing, sound and visual direction.",
    features: ["Cinematic sound orchestrations", "Context-driven B-roll", "Color grading"]
  },
  {
    id: "shorts-reels",
    title: "Shorts and Reels",
    description: "Vertical edits designed for fast attention without becoming noisy or disposable.",
    features: ["Custom visual packaging", "Attention-retaining transitions", "Kinetic subtitle design"]
  },
  {
    id: "podcast-production",
    title: "Podcast Production",
    description: "Clean multi-camera episodes, audio finishing and platform-ready short-form cutdowns.",
    features: ["Multi-cam sound leveling", "Filler word removal", "Highlights package"]
  },
  {
    id: "visual-packaging",
    title: "Visual Packaging",
    description: "Thumbnails, titles, captions and supporting creative designed to make every release feel complete.",
    features: ["Click-through-rate layout strategy", "Title psychology variations", "Visual brand kits"]
  }
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "project-1",
    title: "Authority Engine: Long-Form & Short-Form Repurposing Strategy",
    creator: "Internal Concept Project",
    category: "Full-Scale Content System",
    platform: "Multi-Channel",
    stats: {
      metricLabel: "Consistency",
      metricVal: "100%",
      growth: "Optimized workflow pipeline"
    },
    challenge: "Traditional technical complex ideas lost in standard edits, resulting in low viewer retention.",
    solution: "Designed narrative scripting hooks with custom edit blocks and pacing blueprints.",
    mockVideoColor: "from-[#d7ff00]/20 to-black",
    duration: "10 mins",
    isConcept: true
  },
  {
    id: "project-2",
    title: "Visual Pacing & Narrative Restructuring Showcase",
    creator: "Internal Concept Project",
    category: "Video Editing",
    platform: "YouTube",
    stats: {
      metricLabel: "Review Time",
      metricVal: "-50%",
      growth: "Streamlined cycles"
    },
    challenge: "Long-form tech content dropping off quickly due to static visuals and dry explanations.",
    solution: "Pacing rebuild using custom animations, script markers, and micro-animations.",
    mockVideoColor: "from-[#3478f6]/20 to-black",
    duration: "8 mins",
    isConcept: true
  },
  {
    id: "project-3",
    title: "Viral Hook Architecture for Personal Brands",
    creator: "Internal Concept Project",
    category: "Shorts & Reels",
    platform: "Reels",
    stats: {
      metricLabel: "Delivery Speed",
      metricVal: "<24h",
      growth: "Platform-optimized"
    },
    challenge: "High-value business lectures looking dry and generating zero organic platform footprint.",
    solution: "Repackaged concepts into short hooks with premium typography and dynamic sound levels.",
    mockVideoColor: "from-[#ff3b30]/20 to-black",
    duration: "60 secs",
    isConcept: true
  }
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Idea",
    description: "Validate the raw thoughts and find the angle.",
    detail: "We match raw notes against search trends and viewer patterns."
  },
  {
    step: "02",
    title: "Script",
    description: "Write custom hooks and paced structures.",
    detail: "Our writers build retention frameworks that keep people watching."
  },
  {
    step: "03",
    title: "Produce",
    description: "Record with clear visual and audio guidelines.",
    detail: "Get simple setup blueprints so your files arrive clean."
  },
  {
    step: "04",
    title: "Edit",
    description: "Assemble with high-end, contemporary rhythm.",
    detail: "Professional timeline cutting, styling, and cinematic audio design."
  },
  {
    step: "05",
    title: "Review",
    description: "Refine frame-by-frame on our delivery app.",
    detail: "Pin comments directly to specific timeline frames in one click."
  },
  {
    step: "06",
    title: "Publish",
    description: "Deploy with optimized titles and packaging.",
    detail: "Optimized click-through-rates with custom thumbnail packages."
  }
];

export const whyDostData = [
  {
    title: "Strategy and Execution",
    description: "We help shape the idea before the edit begins.",
    artifactType: "Marked-up Script",
    codeSample: "HOOK: [Insert pattern] -> REASON: Why they watch"
  },
  {
    title: "Creator-Native Thinking",
    description: "Every decision is made with attention, pacing and audience behaviour in mind.",
    artifactType: "Timeline Cut",
    codeSample: "00:03 [Visual shift] | 00:07 [Audio sting]"
  },
  {
    title: "One Clear Workflow",
    description: "Scripts, footage, feedback and approvals stay organised from beginning to end.",
    artifactType: "Review Note",
    codeSample: "Comment @ L104: 'Shift crop 5% to center face'"
  },
  {
    title: "Human Quality Control",
    description: "Every final delivery is reviewed for story, visuals, sound, captions and format.",
    artifactType: "Format Checklist",
    codeSample: "[✓] Narrative flow  [✓] Audio peak  [✓] Safe-zones"
  }
];

// Fallback testimonial structures that are ready for real client data
export const testimonialsData: TestimonialItem[] = [
  {
    id: "test-placeholder",
    name: "Verified Partner",
    role: "Content Partner",
    company: "Personal Brand",
    content: "Client testimonials will appear here once approved. We are actively collecting feedback from early cohorts.",
    achievement: "Development fallback",
    isFallback: true
  }
];

export const faqData: FAQItem[] = [
  {
    question: "What kind of content do you create?",
    answer: "We focus on long-form YouTube videos, podcasts, vertical short clips (Reels, TikToks, Shorts), scripting, thumbnails, and complete content distribution systems."
  },
  {
    question: "Can you help with strategy and scripts as well as editing?",
    answer: "Yes, we shape the concepts from the initial thought. We write structured hooks, design scripting blueprints, and handle the complete editing process."
  },
  {
    question: "Do you work with creators, brands or both?",
    answer: "We work with high-growth creators, personal brands, and businesses looking to build compounding authority online."
  },
  {
    question: "How does the review process work?",
    answer: "You receive a frame-by-frame review workspace link. You can pause the edit at any point, write comments directly on the screen, and our editors implement the fixes."
  },
  {
    question: "Can one long video be turned into multiple short clips?",
    answer: "Absolutely. We extract the highest impact hooks, crop to 9:16 layout, write vertical-friendly hooks, and format them with premium subtitles and sound."
  },
  {
    question: "How do we start a project?",
    answer: "Scroll down to our Project Enquiry form, pick your budget and needs, send a submission, and we will get back to you with onboarding steps."
  }
];

export const siteMetadata = {
  title: "Content Dost — Strategy, Scripts and Video Editing",
  description: "Content Dost helps creators and growing brands turn raw ideas into polished long-form videos, reels, podcasts and content systems.",
  contactEmail: "hello@contentdost.agency"
};
