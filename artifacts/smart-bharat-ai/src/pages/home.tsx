import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Bot, 
  FileText, 
  AlertTriangle, 
  Search, 
  Mic, 
  Languages, 
  ShieldCheck, 
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background pt-24 pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
              Revolutionizing Indian Governance
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent"
            >
              Smart Bharat AI
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-2xl text-xl text-muted-foreground mb-10"
            >
              Your personal AI civic companion. Discover schemes, track complaints, and navigate government services effortlessly in 10+ languages.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background/50 backdrop-blur-sm px-8 text-base font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 w-full sm:w-auto">
                <Bot className="mr-2 h-5 w-5" /> Talk to AI
              </Link>
            </motion.div>
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
            <span className="text-2xl">🇮🇳</span>
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