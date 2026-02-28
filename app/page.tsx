import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { TypewriterText } from "@/components/TypewriterText";

/* ── Data ─────────────────── */
const categories = [
  { label: "Coding", bg: "bg-[#EFC6F6]" },
  { label: "Developing", bg: "bg-[#ABCCF2]" },
  { label: "UI/UX", bg: "bg-[#F2AF70]" },
  { label: "Creatives", bg: "bg-[#FFF2CD]" },
  { label: "Writing", bg: "bg-[#CDEDF6]" },
  { label: "More", bg: "bg-[#EAEFF0]" },
];

/* ── Dynamic prompts for typewriter ── */
const heroPrompts = [
  "Write an optimized sorting algorithm in Rust",
  "Design a high-converting landing page wireframe",
  "Architect a scalable microservices backend in Go",
  "Draft a compelling brand story for a SaaS startup",
  "Refactor this monolithic React app into modular components",
  "Create a minimalist, accessible color palette for a dashboard",
  "Generate Docker setup for a Node.js and Postgres stack",
  "Develop a psychological user persona for a productivity app",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F6] text-zinc-900 overflow-hidden font-sans relative selection:bg-pink-200 selection:text-pink-900 flex flex-col">



      {/* ── Background Vibrant Gradient (Desktop Only) ── */}
      <div className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none z-0 overflow-hidden max-md:hidden">
        <div className="absolute -top-[180px] left-1/2 -translate-x-1/2 w-[120%] h-[350px] blur-[70px] opacity-90 flex justify-center">
          <div className="w-[30%] h-full bg-[#FF4C3B] rounded-full mix-blend-multiply"></div>
          <div className="w-[30%] h-full bg-[#FFA33A] rounded-full mix-blend-multiply -ml-[8%]"></div>
        </div>
      </div>

      {/* ── Left Pink Accent (Desktop Only) ── */}
      <div className="absolute xl:top-[500px] top-[400px] -left-[15%] w-[35%] h-[350px] bg-[#E83CBA] blur-[100px] opacity-40 rounded-full pointer-events-none z-0 max-md:hidden"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-8 flex-1 w-full flex flex-col">

        {/* ── Navbar ── */}
        <header className="flex items-center justify-between mb-24 md:mb-32">
          <Link href="/" className="flex items-center gap-2 group z-10">
            <Image src="/logo.svg" alt="Lextriq" width={30} height={30} className="transition-transform duration-300 group-hover:scale-110" />
            <span
              className="text-2xl font-normal tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.03em" }}
            >
              Lextriq
            </span>
          </Link>

          <div className="flex items-center gap-3 z-10">
            <Link href="/login">
              <button className="px-4 py-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer rounded-full hover:bg-black/5">
                Log in
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-full hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transform duration-200">
                Sign up
              </button>
            </Link>
          </div>
        </header>

        {/* ── Hero text ── */}
        <section className="text-center max-w-4xl mx-auto mb-20 md:mb-28 px-4 flex-1">
          <h1
            className="text-[2.5rem] md:text-5xl lg:text-[4.5rem] font-normal leading-[1.05] tracking-tight mb-6 text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.04em" }}
          >
            Stop guessing prompts.<br />
            Use proven ones.
          </h1>

          {/* Sub-headline */}
          <p className="text-base md:text-[17px] text-zinc-600 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            The community vault of tested AI prompts — upvoted, organized, and ready to copy. For ChatGPT, Claude, Midjourney, and more.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/dashboard/discover">
              <button className="px-8 py-3.5 bg-black text-white rounded-full text-[15px] font-medium hover:bg-zinc-800 transition-all shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 duration-200 flex items-center gap-2 group">
                Let's Explore <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </button>
            </Link>
          </div>

          <div className="mb-14">
            <TypewriterText prompts={heroPrompts} />
          </div>

          {/* Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {categories.map((cat) => (
              <Link key={cat.label} href={`/dashboard/discover?category=${cat.label}`}>
                <div className={`px-5 py-2 rounded-[10px] ${cat.bg} text-black text-base md:text-[17px] font-medium tracking-tight shadow-sm hover:scale-105 transition-transform cursor-pointer`}>
                  {cat.label}
                </div>
              </Link>
            ))}
          </div>



        </section>

        {/* ── What is Lextriq? (Grid) ── */}
        <section className="mt-16 pb-24">
          <div className="flex items-end justify-between mb-8 max-w-[1400px] mx-auto border-t border-black/5 pt-16">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl md:text-[22px] font-medium text-zinc-800 tracking-tight">Inside Lextriq</h2>
              <p className="text-zinc-500 text-[14px] md:text-[15px] font-medium hidden sm:block">Copy and paste top-performing prompts used by industry leaders.</p>
            </div>
            <Link href="/dashboard/discover" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-zinc-200 text-zinc-800 rounded-full text-[14px] md:text-[15px] font-medium hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer group flex-shrink-0">
              Browse All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile only description */}
          <p className="text-zinc-500 text-[14px] font-medium sm:hidden mb-6 max-w-[1400px] mx-auto">Copy and paste top-performing prompts used by industry leaders.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
            {/* Card 1 */}
            <div className="col-span-1 h-[420px] bg-[#F4F0EA] rounded-3xl overflow-hidden relative group shadow-sm transition-transform hover:-translate-y-1 duration-300 p-8 flex flex-col border border-black/[0.03]">
              <Link href="/dashboard/discover?category=Coding" className="absolute inset-0 z-30 cursor-pointer">
                <span className="sr-only">View Coding Prompt</span>
              </Link>

              <div className="flex gap-2 mb-8 relative z-20">
                <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-md text-[13px] font-medium text-zinc-900 shadow-sm">Coding</span>
              </div>

              <h3 className="text-[22px] leading-tight text-zinc-900 mb-4 relative z-20" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Senior React Developer System Prompt
              </h3>

              <div className="text-[#6D6B66] font-mono text-[13px] leading-relaxed flex-1 overflow-hidden relative z-20 whitespace-pre-line">
                "Act as a Senior React Engineer. Review the provided codebase for performance bottlenecks. Refactor to use proper memoization, custom hooks, and suspense boundaries where appropriate. Ensure all TypeScript interfaces are strictly typed..."
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F4F0EA] to-transparent pointer-events-none"></div>
              </div>

              <div className="pt-5 mt-auto border-t border-black/10 flex items-center justify-end text-[14px] font-medium text-zinc-500 relative z-20 group-hover:text-zinc-900 transition-colors">
                <span className="flex items-center gap-1 font-semibold text-zinc-900">Use Prompt <ArrowUpRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-span-1 h-[420px] bg-[#EAEFF0] rounded-3xl overflow-hidden relative group shadow-sm transition-transform hover:-translate-y-1 duration-300 p-8 flex flex-col border border-black/[0.03]">
              <Link href="/dashboard/discover?category=Developing" className="absolute inset-0 z-30 cursor-pointer">
                <span className="sr-only">View SaaS Prompt</span>
              </Link>

              <div className="flex gap-2 mb-8 relative z-20">
                <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-md text-[13px] font-medium text-zinc-900 shadow-sm">Developing</span>
              </div>

              <h3 className="text-[22px] leading-tight text-zinc-900 mb-4 relative z-20" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                SaaS Architecture Blueprint
              </h3>

              <div className="text-[#646A6D] font-mono text-[13px] leading-relaxed flex-1 overflow-hidden relative z-20 whitespace-pre-line">
                "Design a scalable microservices backend architecture for a B2B SaaS platform. Outline the database schema using Postgres, cache layer with Redis, and queue management with RabbitMQ. Include authentication flow using JWTs..."
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#EAEFF0] to-transparent pointer-events-none"></div>
              </div>

              <div className="pt-5 mt-auto border-t border-black/10 flex items-center justify-end text-[14px] font-medium text-zinc-500 relative z-20 group-hover:text-zinc-900 transition-colors">
                <span className="flex items-center gap-1 font-semibold text-zinc-900">Use Prompt <ArrowUpRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 h-[420px] bg-[#F0EAEB] rounded-3xl overflow-hidden relative group shadow-sm transition-transform hover:-translate-y-1 duration-300 p-8 flex flex-col border border-black/[0.03]">
              <Link href="/dashboard/discover?category=Creatives" className="absolute inset-0 z-30 cursor-pointer">
                <span className="sr-only">View Creative Prompt</span>
              </Link>

              <div className="flex gap-2 mb-8 relative z-20">
                <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-md text-[13px] font-medium text-zinc-900 shadow-sm">Creatives</span>
              </div>

              <h3 className="text-[22px] leading-tight text-zinc-900 mb-4 relative z-20" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Cinematic Product Photography
              </h3>

              <div className="text-[#6D6567] font-mono text-[13px] leading-relaxed flex-1 overflow-hidden relative z-20 whitespace-pre-line">
                "/imagine prompt: A sleek, minimalist smart home device resting on a marble countertop. Cinematic lighting, soft shadows, 35mm lens, photorealistic, architectural digest style, volumetric lighting, 8k resolution --ar 16:9 --v 6.0..."
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F0EAEB] to-transparent pointer-events-none"></div>
              </div>

              <div className="pt-5 mt-auto border-t border-black/10 flex items-center justify-end text-[14px] font-medium text-zinc-500 relative z-20 group-hover:text-zinc-900 transition-colors">
                <span className="flex items-center gap-1 font-semibold text-zinc-900">Use Prompt <ArrowUpRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── FOOTER ── */}
      <footer className="relative mt-auto pt-16 pb-8 z-10 w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Lextriq" width={18} height={18} className="opacity-40 grayscale" />
            <span className="text-sm font-medium text-zinc-400 tracking-wide" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Lextriq.
            </span>
          </div>

          <div className="flex items-center gap-8 text-[13px] font-medium text-zinc-400">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 transition-colors">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 transition-colors">GitHub</a>
            <span className="text-zinc-300 px-2">•</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>

      {/* Global style overrides for spin animation if needed - inline for simplicity */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}} />
    </div>
  );
}
