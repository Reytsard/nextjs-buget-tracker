import Link from "next/link";
import {
  Landmark,
  MoveRight,
  Play,
} from "lucide-react";

import {
  landingFeatures,
  landingHighlights,
  landingQuickMetrics,
  landingSignalCards,
  landingStats,
  landingSteps,
  landingTestimonials,
} from "@/components/landing-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function LandingNavbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 text-slate-950 shadow-lg shadow-orange-500/20">
            <Landmark className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] uppercase text-white/70">
              Budget Track
            </p>
            <p className="text-base font-semibold">Money clarity, minus the chaos</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="ghost"
            className="rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-amber-300 text-slate-950 hover:bg-amber-200"
          >
            <Link href="/auth/sign-up">Start free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroPanel() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div className="relative">
          <Badge className="rounded-full border-amber-200/20 bg-amber-300/10 px-4 py-1 text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-amber-200">
            Built for better budgeting habits
          </Badge>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            A landing page that makes your budget app feel calm, capable, and worth returning to.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Budget Track helps people organize spending, understand patterns,
            and keep savings goals moving with less friction and more focus.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-amber-300 px-7 text-slate-950 hover:bg-amber-200"
            >
              <Link href="/auth/sign-up">
                Create an account
                <MoveRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/auth/login">
                <Play className="size-4 fill-current" />
                Open dashboard
              </Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {landingStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.9)] backdrop-blur-sm"
              >
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_30px_100px_-30px_rgba(15,23,42,1)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm tracking-[0.22em] uppercase text-slate-400">
                  Monthly overview
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">$2,900</h2>
                <p className="text-sm text-slate-400">Available after scheduled bills</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
                +14% healthier than last month
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {landingQuickMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/8 bg-white/5 p-4"
                >
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className={`mt-3 text-2xl font-semibold ${metric.tone}`}>
                    {metric.amount}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-white/8 bg-slate-950/70 p-5">
              <div className="flex items-end justify-between gap-3">
                {[46, 68, 54, 80, 62, 89, 74].map((value, index) => (
                  <div key={value} className="flex flex-1 flex-col items-center gap-3">
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-amber-300 via-orange-400 to-rose-400"
                      style={{ height: `${value * 1.4}px` }}
                    />
                    <span className="text-xs text-slate-500">
                      {["M", "T", "W", "T", "F", "S", "S"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {landingSignalCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-3xl border border-white/8 bg-white/5 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-amber-200">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">{card.title}</p>
                        <p className="text-base font-semibold text-white">{card.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="grid gap-6 lg:grid-cols-2">
        {landingFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card
              key={feature.title}
              className="overflow-hidden rounded-[1.75rem] border-white/10 bg-white/5 py-0 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.9)]"
            >
              <CardHeader className="px-6 py-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-300/15 text-amber-200">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="pt-4 text-2xl text-white">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base leading-7 text-slate-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Badge
            variant="outline"
            className="rounded-full border-sky-300/20 bg-sky-300/10 px-4 py-1 text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-sky-100"
          >
            How it works
          </Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white">
            A simple money system your future self will thank you for.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
            The experience is designed to feel direct and lightweight so people
            can move from uncertainty to action without getting buried in setup.
          </p>

          <div className="mt-8 grid gap-4">
            {landingHighlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <div
                  key={highlight.title}
                  className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="mt-1 flex size-11 items-center justify-center rounded-2xl bg-slate-800 text-sky-200">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {highlight.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5">
          {landingSteps.map((step, index) => (
            <Card
              key={step.title}
              className="rounded-[1.75rem] border-white/10 bg-slate-900/70 py-0"
            >
              <CardContent className="flex gap-5 px-6 py-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-base font-semibold text-slate-950">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-300">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {landingTestimonials.map((testimonial) => (
          <Card
            key={testimonial.name}
            className="rounded-[1.75rem] border-white/10 bg-white/[0.04] py-0"
          >
            <CardContent className="px-6 py-7">
              <p className="text-lg leading-8 text-slate-100">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-slate-400">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 p-8 text-slate-950 shadow-[0_35px_120px_-45px_rgba(251,146,60,0.85)] sm:p-10 lg:p-14">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.35),_transparent_60%)] lg:block" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] uppercase text-slate-900/65">
            Ready to launch
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Give this budget tracker a homepage that feels as focused as the product.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-900/80 sm:text-lg">
            Invite new users in with a clear story, a stronger first impression,
            and direct paths into sign up or login.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-slate-950 px-7 text-white hover:bg-slate-900"
            >
              <Link href="/auth/sign-up">Start budgeting</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-slate-950/15 bg-white/30 px-7 text-slate-950 hover:bg-white/45"
            >
              <Link href="/auth/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#07111f] text-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[linear-gradient(180deg,_rgba(15,23,42,0.2)_0%,_rgba(7,17,31,0.96)_100%)]" />
      <LandingNavbar />
      <HeroPanel />
      <FeatureGrid />
      <ProcessSection />
      <TestimonialsSection />
      <FinalCta />
    </main>
  );
}
