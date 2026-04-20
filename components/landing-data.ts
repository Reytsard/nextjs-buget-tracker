import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BellRing,
  HandCoins,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";

export type LandingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type LandingStat = {
  value: string;
  label: string;
};

export type LandingStep = {
  title: string;
  description: string;
};

export type LandingTestimonial = {
  quote: string;
  name: string;
  role: string;
};

export const landingStats: LandingStat[] = [
  { value: "12 min", label: "weekly money check-in" },
  { value: "4 views", label: "to understand your cash flow" },
  { value: "100%", label: "built for intentional spending" },
];

export const landingFeatures: LandingFeature[] = [
  {
    title: "Track every expense without friction",
    description:
      "Log daily spending, organize categories, and keep your records tidy from one dashboard.",
    icon: ReceiptText,
  },
  {
    title: "See where your money actually goes",
    description:
      "Surface patterns with clean visual summaries so your habits are easier to understand.",
    icon: WalletCards,
  },
  {
    title: "Build savings with purpose",
    description:
      "Set goals, watch progress grow, and give your budget a destination instead of a limit.",
    icon: Target,
  },
  {
    title: "Protect your financial routine",
    description:
      "Keep your account secure while making it simple to return to your budget anytime.",
    icon: ShieldCheck,
  },
];

export const landingHighlights: LandingFeature[] = [
  {
    title: "Daily clarity",
    description: "A calmer way to keep tabs on bills, spending, and budget health.",
    icon: Sparkles,
  },
  {
    title: "Smarter decisions",
    description: "Spot overspending early before it quietly eats into your goals.",
    icon: ArrowUpRight,
  },
  {
    title: "Healthy habits",
    description: "Turn budgeting into a repeatable ritual you can actually sustain.",
    icon: PiggyBank,
  },
  {
    title: "Gentle nudges",
    description: "Use your numbers as guidance, not guilt, when plans need adjusting.",
    icon: BellRing,
  },
];

export const landingSteps: LandingStep[] = [
  {
    title: "Create your budget space",
    description:
      "Sign up and organize the categories that reflect how you really spend.",
  },
  {
    title: "Record income and expenses",
    description:
      "Capture transactions as they happen so your dashboard stays useful and current.",
  },
  {
    title: "Review trends and adjust",
    description:
      "Use the charts and summaries to refine your plan before the month gets away from you.",
  },
];

export const landingTestimonials: LandingTestimonial[] = [
  {
    quote:
      "This feels less like bookkeeping and more like having a clear conversation with my money.",
    name: "Alyssa P.",
    role: "Freelance designer",
  },
  {
    quote:
      "The dashboard helped me catch my food spending drift before it became a real problem.",
    name: "Marco D.",
    role: "Remote product specialist",
  },
  {
    quote:
      "I finally have a budget app that gives me structure without making the process feel heavy.",
    name: "Jamie R.",
    role: "First-time budget planner",
  },
];

export const landingQuickMetrics = [
  { label: "Essentials", amount: "$1,840", tone: "text-emerald-300" },
  { label: "Flexible", amount: "$620", tone: "text-amber-300" },
  { label: "Savings", amount: "$440", tone: "text-sky-300" },
];

export const landingSignalCards = [
  {
    title: "Spending pulse",
    value: "On track",
    icon: HandCoins,
  },
  {
    title: "Monthly goal",
    value: "78% funded",
    icon: Target,
  },
];
