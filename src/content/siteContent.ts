export interface ServiceItem {
  id: string;
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
  platform: 'YouTube' | 'Reels' | 'Podcast' | 'Multi-Channel';
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
    shortDescription: "Clear direction for what to create, who it serves, and why it matters.",
    features: ["Audience intent mapping", "Format blueprints", "Hook validation frameworks"]
  },
  {
    id: "script-writing",
    title: "Scriptwriting",
    description: "Structured hooks, pacing and storytelling that give viewers a reason to stay.",
    shortDescription: "Structured scripts designed to hook attention and hold it.",
    features: ["Hook variation design", "Retention pacing markers", "Visual direction notes"]
  },
  {
    id: "long-form-editing",
    title: "Long-Form Editing",
    description: "YouTube videos, interviews and podcasts shaped with purposeful pacing, sound and visual direction.",
    shortDescription: "Raw footage shaped into polished, well-paced cinematic stories.",
    features: ["Cinematic sound orchestrations", "Context-driven B-roll", "Color grading"]
  },
  {
    id: "shorts-reels",
    title: "Shorts and Reels",
    description: "Vertical edits designed for fast attention without becoming noisy or disposable.",
    shortDescription: "Sharp, platform-native edits built for immediate attention.",
    features: ["Custom visual packaging", "Attention-retaining transitions", "Kinetic subtitle design"]
  },
  {
    id: "podcast-production",
    title: "Podcast Production",
    description: "Clean multi-camera episodes, audio finishing and platform-ready short-form cutdowns.",
    shortDescription: "Polished episodes with clean sound and natural conversational flow.",
    features: ["Multi-cam sound leveling", "Filler word removal", "Highlights package"]
  },
  {
    id: "visual-packaging",
    title: "Visual Packaging",
    description: "Thumbnails, titles, captions and supporting creative designed to make every release feel complete.",
    shortDescription: "Thumbnails and visual systems designed to earn attention.",
    features: ["Click-through-rate layout strategy", "Title psychology variations", "Visual brand kits"]
  },
  {
    id: "channel-management",
    title: "Channel Management",
    description: "Publishing, metadata optimization and distribution across YouTube, Spotify, Apple and social feeds.",
    shortDescription: "Consistent publishing, optimisation, and day-to-day channel care.",
    features: ["SEO & description packaging", "Multi-platform scheduling", "Analytics & performance reports"]
  }
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
    challenge: "Traditional technical complex ideas lost in standard edits, resulting in low viewer retention.",
    solution: "A long-form content system designed to create one definitive story and repurpose it across formats.",
    capabilities: ["Long-Form", "Short-Form", "Visual Packaging"],
    mockVideoColor: "from-[#d7ff00]/20 to-black",
    duration: "10 mins",
    isConcept: true
  },
  {
    id: "project-2",
    title: "Creator Launch System",
    creator: "Internal Concept Project",
    category: "CREATOR LAUNCH SYSTEM",
    platform: "YouTube",
    stats: {
      metricLabel: "Review Time",
      metricVal: "-50%",
      growth: "Streamlined cycles"
    },
    challenge: "Long-form tech content dropping off quickly due to dry explanations.",
    solution: "A publishing roadmap built to establish unique brand identities and launch channel systems.",
    capabilities: ["Brand System", "Channel Setup", "Publishing"],
    mockVideoColor: "from-[#3478f6]/20 to-black",
    duration: "8 mins",
    isConcept: true
  },
  {
    id: "project-3",
    title: "Podcast Content Loop",
    creator: "Internal Concept Project",
    category: "PODCAST CONTENT LOOP",
    platform: "Podcast",
    stats: {
      metricLabel: "Delivery Speed",
      metricVal: "<24h",
      growth: "Platform-optimized"
    },
    challenge: "High-value business lectures generating zero organic platform footprint.",
    solution: "A conversation repurposing engine converting master waveforms into distributed social clips.",
    capabilities: ["Waveform Edit", "Clip Extraction", "Platform Loop"],
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
    question: "What kind of content do you create?",
    answer: "We create long-form videos, short-form clips, podcast edits, visual packaging, and content systems built for platforms like YouTube, Instagram, and more."
  },
  {
    question: "Can you help with strategy and scripts as well as editing?",
    answer: "Yes. We can support the full flow — from content direction and scripting to editing, packaging, and rollout."
  },
  {
    question: "Do you work with creators, brands or both?",
    answer: "Both. We work with creators building a stronger content engine and brands looking for sharper, more watchable media."
  },
  {
    question: "How does the review process work?",
    answer: "We keep reviews structured and simple. Once the first version is delivered, we gather feedback, refine the edit, and move quickly toward final delivery."
  },
  {
    question: "Can one long video be turned into multiple short clips?",
    answer: "Absolutely. One strong long-form piece can often be repurposed into multiple shorts, reels, teasers, or social cutdowns."
  },
  {
    question: "How do we start a project?",
    answer: "Start by filling out the contact form with your goals, content needs, and timelines. From there, we review the brief and reach out with the best next step."
  }
];

export const siteMetadata = {
  title: "Content Dost — Strategy, Scripts and Video Editing",
  description: "Content Dost helps creators and growing brands turn raw ideas into polished long-form videos, reels, podcasts and content systems.",
  contactEmail: "hello@contentdost.agency"
};
