export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "calm-tech-routines",
    title: "Designing calm tech routines for modern work",
    excerpt:
      "A look at how intentional devices, lighting, and workflows reduce cognitive load and keep you focused.",
    category: "Workflows",
    author: "Maya Chen",
    date: "Jan 6, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
    content: [
      "Great work flows start with fewer interruptions. We recommend staging your desk with a single purpose: focus.",
      "Place primary devices at eye level, keep a dedicated charging zone, and use warm lighting to ease transitions.",
      "We built Aura Commerce around this idea. Every item is chosen to support focus and reduce unnecessary noise.",
    ],
  },
  {
    slug: "building-a-slow-setup",
    title: "Building a slow setup: intentional tech curation",
    excerpt:
      "Why the best setups feel slow, simple, and grounded even when the hardware is powerful.",
    category: "Wellbeing",
    author: "Jonas Meyer",
    date: "Jan 12, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80",
    content: [
      "Slow setups focus on clarity: fewer cables, fewer apps, and fewer alerts fighting for attention.",
      "Invest in hardware that ages well, then create gentle rituals around charging, updates, and resets.",
      "The result is a calm workspace that feels ready whenever you sit down.",
    ],
  },
  {
    slug: "soundscapes-for-focus",
    title: "Soundscapes for focus: how to build your listening kit",
    excerpt:
      "Headphones, speakers, and ambient playlists that help you stay locked in without fatigue.",
    category: "Audio",
    author: "Priya Shah",
    date: "Jan 18, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
    content: [
      "Balanced audio keeps you productive without draining energy. We suggest neutral headphones and gentle EQ.",
      "Create a playlist with low BPM tracks for deep work, then switch to brighter playlists for transitions.",
      "If you need help building your kit, our concierge team can curate a full listening stack.",
    ],
  },
];
