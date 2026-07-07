import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { IndiaFlagIcon } from "@/components/ui/IndiaFlagIcon";
import {
  Bot, FileText, AlertTriangle, Search, ShieldCheck,
  ArrowRight, Languages, Scale, Landmark, FlaskConical,
  Banknote, Satellite, GraduationCap, Stethoscope, Wheat,
  BadgeCheck, Globe2
} from "lucide-react";

// Government authority icons with custom SVG buildings
const GOV_ICONS = [
  {
    label: "Parliament",
    emoji: "🏛️",
    color: "#FF9933",
    glow: "rgba(255,153,51,0.4)",
    style: { top: "8%", left: "50%", transform: "translateX(-50%)" },
    delay: 0,
    size: "lg",
  },
  {
    label: "Supreme Court",
    emoji: "⚖️",
    color: "#138808",
    glow: "rgba(19,136,8,0.35)",
    style: { top: "28%", left: "12%" },
    delay: 0.15,
    size: "md",
  },
  {
    label: "ISRO",
    emoji: "🚀",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.4)",
    style: { top: "28%", right: "10%" },
    delay: 0.3,
    size: "md",
  },
  {
    label: "Reserve Bank",
    emoji: "🏦",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
    style: { top: "55%", left: "5%" },
    delay: 0.45,
    size: "sm",
  },
  {
    label: "IIT / Education",
    emoji: "🎓",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.35)",
    style: { top: "55%", right: "5%" },
    delay: 0.6,
    size: "sm",
  },
  {
    label: "Health Ministry",
    emoji: "🏥",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.35)",
    style: { top: "78%", left: "18%" },
    delay: 0.75,
    size: "sm",
  },
  {
    label: "Agriculture",
    emoji: "🌾",
    color: "#10b981",
    glow: "rgba(16,185,129,0.35)",
    style: { top: "78%", right: "18%" },
    delay: 0.9,
    size: "sm",
  },
];

function GovIcon({ item }: { item: typeof GOV_ICONS[0] }) {
  const sizeMap = { lg: 72, md: 56, sm: 44 };
  const fontSize = { lg: "2rem", md: "1.6rem", sm: "1.3rem" };
  const sz = sizeMap[item.size as keyof typeof sizeMap];
  const fs = fontSize[item.size as keyof typeof fontSize];

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1.5 select-none"
      style={item.style as React.CSSProperties}
      initial={{ opacity: 0, scale: 0, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 + item.delay, type: "spring", stiffness: 180, damping: 14 }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3 + item.delay, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: sz,
          height: sz,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${item.color}22, ${item.color}08)`,
          border: `2px solid ${item.color}55`,
          boxShadow: `0 0 20px ${item.glow}, 0 4px 16px rgba(0,0,0,0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: fs,
          backdropFilter: "blur(8px)",
          cursor: "default",
        }}
      >
        {item.emoji}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 + item.delay }}
        style={{
          fontSize: "9px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          background: "rgba(0,0,0,0.45)",
          borderRadius: "6px",
          padding: "2px 6px",
          whiteSpace: "nowrap",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.1)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {item.label}
      </motion.span>
    </motion.div>
  );
}

// Subtle Ashoka Chakra spinning in the center
function AshokaChakra() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: "2px solid rgba(19,136,8,0.18)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 24 spokes */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "2px",
              height: "80px",
              background: "linear-gradient(to bottom, rgba(19,136,8,0.5), transparent)",
              transformOrigin: "bottom center",
              bottom: "50%",
              left: "calc(50% - 1px)",
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "rgba(19,136,8,0.4)",
            border: "2px solid rgba(19,136,8,0.6)",
          }}
        />
      </motion.div>

      {/* Outer glow ring */}
      <div
        className="absolute"
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          border: "1px solid rgba(255,153,51,0.12)",
          boxShadow: "0 0 60px rgba(255,153,51,0.08) inset",
        }}
      />
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-animated-mesh pt-24 pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="container relative z-10 mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[540px]">

              {/* LEFT — Text & CTA */}
              <div className="flex-1 flex flex-col items-start text-left max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
                >
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                  Revolutionizing Indian Governance
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-gradient-saffron bg-clip-text text-transparent leading-tight"
                >
                  Smart<br />Bharat AI
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
                >
                  Your personal AI civic companion. Discover schemes, track complaints, and navigate government services effortlessly in <span className="text-primary font-semibold">10+ languages</span>.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-start gap-4"
                >
                  <Link href="/login" className="inline-flex h-13 items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/login" className="inline-flex h-13 items-center justify-center rounded-xl border border-input bg-background/50 backdrop-blur-sm px-8 py-3.5 text-base font-medium shadow-sm hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 transition-all gap-2">
                    <Bot className="h-5 w-5" /> Talk to AI
                  </Link>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span> 500+ Services
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span> 10+ Languages
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span> AI Powered
                  </div>
                </motion.div>
              </div>

              {/* RIGHT — Government Icons Ring */}
              <div
                className="flex-shrink-0 relative"
                style={{ width: "380px", height: "380px" }}
              >
                <AshokaChakra />

                {/* Indian flag in center */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
                    <IndiaFlagIcon className="w-16 h-12 drop-shadow-lg" />
                  </div>
                </motion.div>

                {/* Government authority icons */}
                {GOV_ICONS.map((item, i) => (
                  <GovIcon key={i} item={item} />
                ))}
              </div>

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