import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { IndiaFlagIcon } from "@/components/ui/IndiaFlagIcon";
import { Bot, FileText, AlertTriangle, Search, Mic, Languages, ShieldCheck, ArrowRight, MapPin, Landmark, Star, Users, Building2 } from "lucide-react";

// Inline SVG India map silhouette - approximate shape
function IndiaSvgMap() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[420px] opacity-25">
      <path
        d="M196 12 L215 10 L240 18 L260 14 L280 22 L295 30 L305 45 L310 60 L318 70 L322 85 L330 95 L338 105 L345 118 L350 132 L352 148 L348 162 L342 175 L338 190 L340 205 L345 218 L348 232 L344 245 L340 258 L332 270 L320 280 L310 292 L305 308 L298 322 L290 335 L280 348 L268 360 L258 372 L248 385 L240 398 L235 412 L232 426 L230 440 L228 454 L225 465 L222 476 L220 488 L218 500 L215 488 L212 476 L210 462 L208 448 L205 432 L200 416 L194 400 L185 386 L174 374 L162 362 L150 350 L140 338 L130 325 L122 312 L116 298 L110 284 L108 270 L106 256 L102 242 L95 228 L88 215 L82 200 L78 185 L75 170 L74 155 L76 140 L82 126 L90 112 L96 98 L98 83 L100 68 L106 54 L115 42 L128 32 L142 22 L158 15 L176 12 L196 12 Z"
        stroke="url(#indiaGrad)"
        strokeWidth="3"
        fill="url(#indiaFill)"
        strokeLinejoin="round"
      />
      {/* Kashmir region */}
      <path
        d="M196 12 L180 8 L165 12 L152 20 L140 28 L128 32 L120 40 L115 52 L112 64 L108 72 L100 62 L90 55 L82 48 L78 40 L88 32 L100 26 L115 18 L130 12 L148 8 L166 4 L185 2 L205 4 L220 8 L240 14"
        stroke="url(#indiaGrad)"
        strokeWidth="2.5"
        fill="url(#indiaFill)"
        strokeLinejoin="round"
      />
      {/* Northeast region */}
      <path
        d="M340 105 L350 100 L358 108 L362 120 L368 132 L372 145 L370 158 L362 165 L352 162 L345 155 L342 145 L345 132 L340 120 L338 105"
        stroke="url(#indiaGrad)"
        strokeWidth="2.5"
        fill="url(#indiaFill)"
        strokeLinejoin="round"
      />
      {/* Andaman hint */}
      <circle cx="375" cy="310" r="6" fill="url(#indiaGrad)" opacity="0.8" />
      <circle cx="378" cy="328" r="4" fill="url(#indiaGrad)" opacity="0.6" />
      <circle cx="372" cy="345" r="4" fill="url(#indiaGrad)" opacity="0.5" />
      <defs>
        <linearGradient id="indiaGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9933" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#138808" />
        </linearGradient>
        <linearGradient id="indiaFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9933" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#138808" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const MAP_ICONS = [
  { icon: MapPin, className: "text-orange-500", style: { top: "22%", left: "38%" }, label: "Delhi", delay: 0 },
  { icon: Landmark, className: "text-primary", style: { top: "42%", left: "52%" }, label: "Mumbai", delay: 0.15 },
  { icon: ShieldCheck, className: "text-blue-500", style: { top: "60%", left: "30%" }, label: "Chennai", delay: 0.3 },
  { icon: Star, className: "text-yellow-500", style: { top: "30%", left: "65%" }, label: "Kolkata", delay: 0.45 },
  { icon: Building2, className: "text-green-600", style: { top: "55%", left: "48%" }, label: "Hyderabad", delay: 0.6 },
  { icon: Users, className: "text-purple-500", style: { top: "18%", left: "28%" }, label: "Chandigarh", delay: 0.75 },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-animated-mesh pt-24 pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="container relative z-10 mx-auto px-4 text-center">
            {/* India map with popping location icons */}
            <div className="relative mx-auto max-w-sm mb-4" style={{ height: "280px" }}>
              {/* Map silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <IndiaSvgMap />
              </div>

              {/* Popping city icons over the map */}
              {MAP_ICONS.map((item, i) => (
                <motion.div
                  key={i}
                  className="absolute flex flex-col items-center gap-1"
                  style={item.style}
                  initial={{ opacity: 0, scale: 0, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + item.delay, type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: item.delay }}
                    className={`p-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg ${item.className}`}
                  >
                    <item.icon className="h-4 w-4" />
                  </motion.div>
                  <span className="text-[9px] font-semibold text-white/70 bg-black/30 rounded px-1 py-0.5 backdrop-blur-sm whitespace-nowrap">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Revolutionizing Indian Governance
            </motion.div>

            <div className="mx-auto max-w-2xl glass p-8 rounded-xl backdrop-blur-sm">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gradient-saffron bg-clip-text text-transparent"
              >
                Smart Bharat AI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto max-w-2xl text-xl text-muted-foreground mb-8"
              >
                Your personal AI civic companion. Discover schemes, track complaints, and navigate government services effortlessly in 10+ languages.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background/50 backdrop-blur-sm px-8 text-base font-medium shadow-sm hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                  <Bot className="mr-2 h-5 w-5" /> Talk to AI
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Empowering Citizens with AI</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We've built an intelligent layer over existing infrastructure to make government services accessible to everyone, everywhere.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Bot, title: "AI Civic Companion", desc: "Chat in your native language to get guidance on any civic matter." },
                { icon: Search, title: "Scheme Finder", desc: "Instantly discover government schemes you're eligible for." },
                { icon: FileText, title: "Document Assistant", desc: "Know exactly what documents you need and where to apply." },
                { icon: AlertTriangle, title: "Smart Complaints", desc: "AI automatically categorizes and routes your complaints." },
                { icon: ShieldCheck, title: "Live Tracking", desc: "Track complaint resolution with a transparent timeline." },
                { icon: Languages, title: "Multilingual", desc: "Support for 10+ Indian languages with voice input." }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative overflow-hidden bg-secondary">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">500+</div>
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Government Services</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-black text-accent mb-2">10</div>
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Languages Supported</div>
              </div>
              <div className="p-4">
                <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">50k+</div>
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Complaints Managed</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IndiaFlagIcon className="w-8 h-6" />
            <span className="font-bold text-xl">Smart Bharat AI</span>
          </div>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            Making digital governance accessible to every Indian citizen. Built for DEVENGERS PromptWars 2026.
          </p>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Smart Bharat AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}