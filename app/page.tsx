import type { Metadata } from "next";

import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Budget Track | Simple personal budget tracking",
  description:
    "Track expenses, understand spending, and build healthier money habits with Budget Track.",
};

export default function Home() {
  return <LandingPage />;
}
