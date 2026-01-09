"use client";

import { useEffect, useRef, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Link from "next/link";
import {
  Code2,
  Brain,
  Users,
  Rss,
  Rocket,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const glowRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  /* soft cursor glow (lagged, UI only) */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.transition = "transform 0.15s ease-out";
      glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* eased hero depth (non-linear, UI only) */
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const y = window.scrollY;
      const eased = Math.min(y * 0.00018, 0.12);
      heroRef.current.style.transform = `scale(${1 - eased})`;
      heroRef.current.style.opacity = `${1 - y * 0.0012}`;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen />}

      <main
        className={`relative min-h-screen overflow-hidden text-white
        transition-opacity duration-700
        ${showSplash ? "opacity-0" : "opacity-100"}`}
      >
        {/* cursor glow */}
        <div
          ref={glowRef}
          className="pointer-events-none fixed top-0 left-0
          h-[400px] w-[400px] rounded-full
          bg-emerald-500/10 blur-[140px]"
        />

        {/* background */}
        <div className="absolute inset-0 -z-10 bg-neutral-950" />

        {/* ambient blobs */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[140px] animate-floatSlow" />
        <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-cyan-400/20 blur-[140px] animate-floatSlow delay-1000" />

        {/* HERO */}
        <section
          ref={heroRef}
          className="relative max-w-7xl mx-auto px-6 pt-32 pb-28"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* LEFT */}
            <div className="space-y-10">
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight tracking-tight">
                Learn. Practice. <br />
                <span
                  className="
                  bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400
                  bg-[length:200%_200%] animate-gradientMove
                  bg-clip-text text-transparent
                "
                >
                  Build Like a Pro.
                </span>
              </h1>

              <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                EduCypher is where developers don’t just learn —
                they <span className="text-white">build identity</span>,
                prove skills, and grow in public.
              </p>

              <div className="flex flex-wrap gap-5">
                <MagneticButton href="/signup" primary bounce>
                  Get Started Free
                </MagneticButton>

                <Link
                  href="/login"
                  className="
                  px-8 py-4 rounded-xl border border-white/10
                  bg-white/5 backdrop-blur
                  hover:bg-white/10 transition
                "
                >
                  Login
                </Link>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 blur-xl opacity-60 group-hover:opacity-100 transition" />
              <div className="relative rounded-[32px] bg-neutral-900/70 backdrop-blur-2xl border border-white/10 p-10 space-y-7 transition-transform group-hover:-translate-y-2">
                <FeatureRow icon={<Brain />} title="Structured Learning" desc="Clear paths, deep explanations, real clarity." />
                <FeatureRow icon={<Code2 />} title="Hands-on Practice" desc="Solve real problems. Ship real code." />
                <FeatureRow icon={<Users />} title="Communities" desc="Learn with developers who actually care." />
                <FeatureRow icon={<Rss />} title="Developer Feed" desc="Signal > noise. Quality content only." />
              </div>
            </div>

          </div>

          {/* visual divider hint (UI only) */}
          <div className="mt-24 flex justify-center">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </section>

        {/* WHY */}
        <section className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-28 space-y-20">
            <div className="text-center space-y-5">
              <h2 className="text-4xl md:text-5xl font-extrabold">
                Why EduCypher?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Because tutorials don’t build developers.
                <span className="text-white"> Systems do.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <InfoCard icon={<Rocket />} title="Career Focused" desc="Everything maps to real-world growth." />
              <InfoCard icon={<ShieldCheck />} title="Proof of Skill" desc="Your profile reflects real effort." />
              <InfoCard icon={<Users />} title="Built Together" desc="Learning works better together." />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-28 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black">
              This is where devs level up.
            </h2>
            <p className="text-gray-400 text-lg">
              No pressure. No fake hype. Just growth.
            </p>
            <MagneticButton href="/signup" primary big bounce>
              Create Free Account
            </MagneticButton>
          </div>
        </section>
      </main>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function MagneticButton({
  href,
  children,
  primary,
  big,
  bounce,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  big?: boolean;
  bounce?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    };
    const reset = () => (el.style.transform = "translate(0,0)");

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      className={`
        inline-block rounded-xl font-semibold transition
        ${big ? "px-10 py-5 text-lg" : "px-8 py-4"}
        ${primary
          ? "bg-emerald-500 text-black shadow-[0_20px_60px_-15px_rgba(52,211,153,0.6)]"
          : ""}
        ${bounce ? "animate-ctaBounce" : ""}
      `}
    >
      {children}
    </Link>
  );
}

function FeatureRow({ icon, title, desc }: any) {
  return (
    <div className="flex gap-5 items-start group">
      <div
        className="
        h-12 w-12 rounded-xl bg-emerald-400/20 text-emerald-300
        flex items-center justify-center
        group-hover:-translate-y-1 group-hover:scale-125
        transition-transform duration-300
        "
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, desc }: any) {
  return (
    <div className="animate-cardPop rounded-3xl p-10 bg-white/5 backdrop-blur-xl border border-white/10 hover:-translate-y-3 transition">
      <div className="h-14 w-14 mb-4 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
