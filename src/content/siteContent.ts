export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  shortDescription: string;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  creator: string;
  category: string;
  platform: string;
  stats: {
    views?: string;
    metricLabel?: string;
    metricVal?: string;
    growth?: string;
  };
  challenge: string;
  solution: string;
  capabilities?: string[];
  mockVideoColor: string;
  duration: string;
  isConcept: boolean;
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
  isFallback: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── SINGLE SOURCE OF TRUTH: SERVICES ────────────────────────────
export const servicesData: ServiceItem[] = [
  {
    id: "content-strategy",
    number: "01",
    title: "Content Strategy",
    description: "Clear topics, hooks and formats built around what your audience actually wants to engage with.",
    shortDescription: "Clear direction for what to create, who it serves, and why it matters.",
    features: ["Audience intent mapping", "Format blueprints", "Hook validation frameworks"]
  },
  {
    id: "scriptwriting",
    number: "02",
    title: "Scriptwriting",
    description: "Structured hooks, pacing and storytelling that give viewers a reason to stay.",
    shortDescription: "Structured scripts designed to hook attention and hold it.",
    features: ["Hook variation design", "Retention pacing markers", "Visual direction notes"]
  },
  {
    id: "video-editing",
    number: "03",
    title: "Video Editing",
    description: "Raw footage shaped into clear, polished and engaging visual stories with purposeful pacing and sound.",
    shortDescription: "Raw footage shaped into clear, polished and engaging visual stories.",
    features: ["Cinematic sound design", "Context-driven B-roll", "Color grading and pacing"]
  },
  {
    id: "brand-management",
    number: "04",
    title: "Brand Management",
    description: "A consistent brand presence across content, platforms and communication — identity, tone, colours and direction.",
    shortDescription: "A consistent brand presence across content, platforms and communication.",
    features: ["Brand identity systems", "Visual consistency guidelines", "Cross-platform tone alignment"]
  },
  {
    id: "website-making",
    number: "05",
    title: "Website Making",
    description: "Distinctive, responsive websites built around the brand and its goals — from layout to launch.",
    shortDescription: "Distinctive, responsive websites built around the brand and its goals.",
    features: ["Responsive design systems", "Brand-aligned layouts", "Performance-optimised builds"]
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "project-1",
    title: "The Authority Engine",
    creator: "Internal Concept Project",
    category: "FULL-SCALE CONTENT SYSTEM",
    platform: "Multi-Channel",
    stats: {
      metricLabel: "Consistency",
      metricVal: "100%",
      growth: "Optimized workflow pipeline"
    },
    challenge: "Complex technical ideas lost in standard edits, resulting in low viewer retention.",
    solution: "A content system combining strategy, scripting and video editing into one clear production workflow.",
    capabilities: ["Strategy", "Scriptwriting", "Video Editing"],
    mockVideoColor: "from-[#d7ff00]/20 to-black",
    duration: "10 mins",
    isConcept: true
  },
  {
    id: "project-2",
    title: "Creator Launch System",
    creator: "Internal Concept Project",
    category: "BRAND LAUNCH SYSTEM",
    platform: "Multi-Channel",
    stats: {
      metricLabel: "Review Time",
      metricVal: "-50%",
      growth: "Streamlined cycles"
    },
    challenge: "Inconsistent brand presence across platforms weakening creator authority.",
    solution: "A publishing roadmap built to establish unique brand identities and launch consistent content systems.",
    capabilities: ["Brand Management", "Content Strategy", "Website Making"],
    mockVideoColor: "from-[#3478f6]/20 to-black",
    duration: "8 mins",
    isConcept: true
  },
  {
    id: "project-3",
    title: "Content Production Loop",
    creator: "Internal Concept Project",
    category: "CONTENT PRODUCTION LOOP",
    platform: "Multi-Channel",
    stats: {
      metricLabel: "Delivery Speed",
      metricVal: "<24h",
      growth: "Platform-optimized"
    },
    challenge: "High-value ideas generating zero organic traction due to scattered production.",
    solution: "An end-to-end production loop converting raw ideas into polished, distributed content.",
    capabilities: ["Video Editing", "Scriptwriting", "Brand Management"],
    mockVideoColor: "from-[#ff3b30]/20 to-black",
    duration: "60 secs",
    isConcept: true
  }
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Idea",
    description: "Validate the raw thought and find the strongest angle.",
    detail: "A focused direction shaped around audience and opportunity."
  },
  {
    step: "02",
    title: "Script",
    description: "Shape the idea into a clear, engaging narrative.",
    detail: "A structured narrative ready for production."
  },
  {
    step: "03",
    title: "Produce",
    description: "Capture the right material with direction and intent.",
    detail: "Intentional footage and sound captured with clarity."
  },
  {
    step: "04",
    title: "Edit",
    description: "Build rhythm, clarity and emotion from the raw footage.",
    detail: "A polished sequence with rhythm, structure and emotion."
  },
  {
    step: "05",
    title: "Review",
    description: "Collect precise feedback and move quickly toward approval.",
    detail: "One organised feedback path from first cut to approval."
  },
  {
    step: "06",
    title: "Publish",
    description: "Package and deliver the final content for the right platform.",
    detail: "Finished content packaged and ready for release."
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
    question: "What kind of work do you do?",
    answer: "We offer content strategy, scriptwriting, video editing, brand management and website making — everything a creator or brand needs to build and maintain a strong content presence."
  },
  {
    question: "Can you help with strategy and scripts as well as editing?",
    answer: "Yes. We can support the full flow — from content direction and scriptwriting to video editing, brand management and website development."
  },
  {
    question: "Do you work with creators, brands or both?",
    answer: "Both. We work with creators building a stronger content engine and brands looking for sharper, more consistent media and web presence."
  },
  {
    question: "How does the review process work?",
    answer: "We keep reviews structured and simple. Once the first version is delivered, we gather feedback, refine the work, and move quickly toward final delivery."
  },
  {
    question: "Do you build websites as well?",
    answer: "Yes. We design and build distinctive, responsive websites that are aligned with your brand identity and optimised for performance."
  },
  {
    question: "How do we start a project?",
    answer: "Start by filling out the contact form with your goals, content needs, and timelines. From there, we review the brief and reach out with the best next step."
  }
];

export const siteMetadata = {
  title: "Content Dost — Strategy, Scripts, Video Editing, Brand Management & Websites",
  description: "Content Dost helps creators and growing brands with content strategy, scriptwriting, video editing, brand management and website making.",
  contactEmail: "hello@contentdost.agency"
};
