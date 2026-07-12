export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
}

export interface ServiceCategory {
  title: string;
  description: string;
  services: ServiceItem[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  duration: string;
  metric: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  creator: string;
  category: string;
  platform: 'YouTube' | 'Reels' | 'Podcast' | 'Multi-Channel';
  stats: {
    views: string;
    metricLabel: string;
    metricVal: string;
    growth: string;
  };
  challenge: string;
  solution: string;
  mockVideoColor: string;
  duration: string;
}

export interface StatItem {
  value: string;
  label: string;
  subtext: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  achievement: string;
  avatarSeed: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const servicesData: ServiceCategory[] = [
  {
    title: "Create",
    description: "Architecting the narrative structure and hook engineering before the cameras roll.",
    services: [
      {
        id: "script-writing",
        title: "Script Writing",
        description: "Engaging, retention-engineered scripts tailored for your voice, designed to keep viewers watching past the critical 3-second mark.",
        features: ["Hook variations", "Pacing markers", "Visual director notes"]
      },
      {
        id: "content-strategy",
        title: "Content Strategy",
        description: "Custom mapping of your brand authority to a high-converting topic roadmap that targets high-intent audiences.",
        features: ["Competitor teardowns", "Format mapping", "Audience analysis"]
      },
      {
        id: "content-writing",
        title: "Content Writing",
        description: "Long-form written formats like newsletters, LinkedIn posts, and Twitter threads to build compounding text-based trust.",
        features: ["Tone-of-voice design", "Thread hooks", "Newsletter templates"]
      }
    ]
  },
  {
    title: "Edit",
    description: "Cinematic, pacing-focused post-production designed for high retention and polished aesthetics.",
    services: [
      {
        id: "video-editing",
        title: "High-End Video Editing",
        description: "Full-scale YouTube and long-form video production. We craft visual pacing, sound design, and color grading that command attention.",
        features: ["Sound design orchestration", "B-roll integration", "Dynamic grading"]
      },
      {
        id: "reels-shorts",
        title: "Reels & Shorts Production",
        description: "High-energy, fast-paced vertical video editing utilizing subtle graphics, premium captions, and sound design to optimize completion rate.",
        features: ["Custom typography captions", "Micro-animations", "Audio leveling"]
      },
      {
        id: "podcast-editing",
        title: "Podcast Production",
        description: "Multi-cam podcast audio and video editing, optimizing vocal clarity, removing filler, and selecting key viral highlights.",
        features: ["Multi-cam switching", "Loudness mastering", "Audiogram packaging"]
      }
    ]
  },
  {
    title: "Grow",
    description: "Converting attention into compounding audience metrics and packaging excellence.",
    services: [
      {
        id: "thumbnail-packaging",
        title: "Thumbnail & Packaging",
        description: "High-clickthrough-rate thumbnails combined with title engineering to win the split-second decision in the feed.",
        features: ["A/B variation concepts", "Visual hierarchy design", "Title psychology"]
      },
      {
        id: "repurposing",
        title: "Long-to-Short Repurposing",
        description: "Translating a single long-form video or podcast episode into 5-10 high-performing short-form hooks to multiply distribution.",
        features: ["Moment extraction", "Multi-format crop", "Custom hooks"]
      },
      {
        id: "personal-branding",
        title: "Personal Brand System",
        description: "Full-spectrum optimization of your profile banners, bios, and content hooks to convert page views into loyal subscribers.",
        features: ["Profile redesign concepts", "Lead magnet hooks", "Authority positioning"]
      }
    ]
  },
  {
    title: "Systemize",
    description: "Automating your content pipelines so you can focus on writing and recording.",
    services: [
      {
        id: "content-systems",
        title: "Social Content Systems",
        description: "A centralized dashboard hosting your content pipelines, review links, scripts, and schedules, run by our operations team.",
        features: ["Notion/Airtable spaces", "Asset management", "Calendar automation"]
      },
      {
        id: "monthly-retainers",
        title: "Monthly Content Retainers",
        description: "A fully integrated content department at your service, managing your entire pipeline from planning to final distribution.",
        features: ["Dedicated editor & writer", "Weekly syncs", "Unlimited revisions"]
      },
      {
        id: "publishing-support",
        title: "Publishing Support",
        description: "Optimization of tags, descriptions, cards, playlists, and cross-platform scheduling to ensure flawless delivery.",
        features: ["SEO metadata templates", "Publish timing maps", "Community-engagement hooks"]
      }
    ]
  }
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Idea & Strategy",
    description: "We deep-dive into your niche, extract your unique angles, and construct a high-retention content calendar.",
    duration: "Week 1",
    metric: "Target research"
  },
  {
    step: "02",
    title: "Scripting & Hook Design",
    description: "Our writers draft detailed scripts. We engineer hook variations and pacing markers to optimize initial watch time.",
    duration: "Week 1-2",
    metric: "Hook engineered"
  },
  {
    step: "03",
    title: "Recording Support",
    description: "We provide detailed recording briefs, framing instructions, and audio setup guidelines for clean raw footage.",
    duration: "Week 2",
    metric: "A/V guidelines"
  },
  {
    step: "04",
    title: "Cinematic Editing",
    description: "Raw footage is transformed with custom pacing, graphics, professional sound design, and color grading.",
    duration: "48-72 hours",
    metric: "144Hz preview"
  },
  {
    step: "05",
    title: "Review & Refine",
    description: "Collaborate via our frame-by-frame review workspace. Leave comments directly on the timeline for instant adjustments.",
    duration: "24 hours",
    metric: "Frame-exact review"
  },
  {
    step: "06",
    title: "Packaging & SEO",
    description: "We design high-CTR thumbnails and title configurations optimized to capture feed clicks immediately.",
    duration: "Pre-publish",
    metric: "CTR optimization"
  },
  {
    step: "07",
    title: "Repurpose & Grow",
    description: "Long-form assets are sliced into high-retention vertical clips, distributing your message across all major platform algorithms.",
    duration: "Post-publish",
    metric: "5-10x leverage"
  }
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "case-1",
    title: "Engineering Authority: 10x Pipeline for AI Founder",
    creator: "Alex Rivera",
    category: "Full-Stack System",
    platform: "Multi-Channel",
    stats: {
      views: "2.4M+",
      metricLabel: "Lead Gen",
      metricVal: "+340%",
      growth: "+125K Subscribers"
    },
    challenge: "Low click-through rates and high initial drop-off on technical, complex AI topics.",
    solution: "Designed narrative scripting hooks with custom B-roll, visual codes, and structural loops.",
    mockVideoColor: "from-orange-600 to-amber-900",
    duration: "12 mins"
  },
  {
    id: "case-2",
    title: "Visual Pacing: Rebuilding a High-Retention Tech Show",
    creator: "TechPulse Media",
    category: "Video Editing",
    platform: "YouTube",
    stats: {
      views: "890K",
      metricLabel: "Avg Retention",
      metricVal: "62%",
      growth: "+45K Subscribers"
    },
    challenge: "Audience retention dropped below 30% within the first 60 seconds of long-form episodes.",
    solution: "Re-engineered edit pacing using multi-cam cuts, dynamic typography cues, and cinematic sound grading.",
    mockVideoColor: "from-charcoal-800 to-orange-950",
    duration: "8 mins"
  },
  {
    id: "case-3",
    title: "Short-Form Takeover: Vertical Scaling for Venture Capitalist",
    creator: "Sarah Chen",
    category: "Shorts & Reels",
    platform: "Reels",
    stats: {
      views: "12.8M",
      metricLabel: "Inbound Deals",
      metricVal: "+48",
      growth: "+320K Followers"
    },
    challenge: "High-value insights lost in overly-formal corporate speak, resulting in low organic reach.",
    solution: "Converted long lectures into short hooks with premium subtitles, kinetic animations, and audio mastering.",
    mockVideoColor: "from-orange-500 to-stone-950",
    duration: "58 secs"
  },
  {
    id: "case-4",
    title: "Podcast Engine: Turning Audio into High-Impact Clips",
    creator: "The Infinite Hook",
    category: "Repurposing System",
    platform: "Podcast",
    stats: {
      views: "4.1M",
      metricLabel: "Clips Produced",
      metricVal: "40+",
      growth: "+80K Subscribers"
    },
    challenge: "Valuable 2-hour podcasts were yielding zero viral traction or short-form footprint.",
    solution: "Mapped a systematic extraction engine isolating the top 5 high-leverage clips per episode.",
    mockVideoColor: "from-red-950 to-orange-850",
    duration: "45 mins"
  }
];

export const statsData: StatItem[] = [
  {
    value: "45M+",
    label: "Total Organic Views",
    subtext: "Generated for our partners in the last 12 months"
  },
  {
    value: "1,200+",
    label: "High-Retention Clips",
    subtext: "Delivered with cinematic pacing and custom typography"
  },
  {
    value: "98.4%",
    label: "Client Retention Rate",
    subtext: "Creators stay with us month after month"
  },
  {
    value: "48 Hrs",
    label: "Avg Edit Turnaround",
    subtext: "Rapid, systemized delivery with zero drop in quality"
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Marcus Vance",
    role: "CEO & Tech Educator",
    company: "Vance Tech Labs",
    content: "Content Dost changed how I look at content production. I record raw clips, and they return structured, high-pacing masterpieces. My channel grew by 150k subscribers in four months without me spending an extra minute editing.",
    achievement: "150K subscribers in 4 months",
    avatarSeed: "marcus"
  },
  {
    id: "test-2",
    name: "Elena Rostova",
    role: "Founding Partner",
    company: "Sovereign Capital",
    content: "We needed a team that understood complex finance topics and could write hooks that didn't sound cheesy. The scripting capability at Content Dost is unmatched. They grasp strategy as well as they do editing.",
    achievement: "48 inbound pitch requests",
    avatarSeed: "elena"
  },
  {
    id: "test-3",
    name: "Devin Cole",
    role: "YouTube Creator (1.2M)",
    company: "The Devin Cole Show",
    content: "I've worked with a dozen freelance editors, but none could build a scalable workflow. Content Dost brought a complete content pipeline dashboard. It's organized, it's fast, and the sound design is cinema-grade.",
    achievement: "62% average view duration",
    avatarSeed: "devin"
  }
];

export const faqData: FAQItem[] = [
  {
    question: "How does the onboarding process work?",
    answer: "Onboarding is built to be friction-free. Once you select a retainer or service, we host a 45-minute strategy call to align on your branding, visual styles, and content goals. Within 5 days, we establish your client dashboard, map out your first month's scripts, and invite you to start uploading footage."
  },
  {
    question: "What is your typical turnaround time?",
    answer: "For short-form reels and shorts, our typical turnaround is 24 to 48 hours. For long-form episodes (10-30 minutes), edits are delivered within 3-4 business days. High-priority campaigns can be accelerated through systemized workflows."
  },
  {
    question: "Do you write scripts or do I provide them?",
    answer: "We offer both. Most of our clients prefer our Strategy + Scripting system, where we research topics, write full retention-optimized scripts with visual descriptors, and hand them off for you to record. Alternatively, you can send raw footage and outline concepts, and we will package the edits from there."
  },
  {
    question: "How do revisions work?",
    answer: "We use frame-accurate video review tools. You can pause the video at any timestamp and write comments directly on the workspace. We allow unlimited minor revisions on retainers to ensure your visual identity is exactly as you envision it."
  },
  {
    question: "What platforms do you optimize for?",
    answer: "We package content across YouTube (long-form & Shorts), Instagram Reels, TikTok, LinkedIn, and newsletters. Every script, hook, and crop is custom-engineered for its specific destination platform's algorithm and user mindset."
  },
  {
    question: "Why choose Content Dost over a standard freelancer?",
    answer: "A freelancer edits raw video; they don't solve your growth. Content Dost combines scripting, hook-engineering, cinematic editing, custom packaging, and automated content dashboards. We act as your trusted creative partner, not a random task receiver."
  }
];

export const contactInfo = {
  email: "hello@contentdost.agency",
  address: "Creative Quarter, Suite 402, SF",
  socials: {
    twitter: "https://twitter.com/contentdost",
    youtube: "https://youtube.com/contentdost",
    linkedin: "https://linkedin.com/company/contentdost",
    instagram: "https://instagram.com/contentdost"
  }
};
