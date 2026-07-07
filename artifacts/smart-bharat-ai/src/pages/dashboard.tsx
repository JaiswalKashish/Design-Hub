import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Bot, 
  FileText, 
  AlertTriangle, 
  Search, 
  MapPin, 
  PhoneCall, 
  ArrowRight,
  Clock,
  CheckCircle2,
  Bell
} from "lucide-react";
import { useListComplaints } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const actionCards = [
  { title: "AI Chat", desc: "Talk to your civic companion", icon: Bot, href: "/chat", color: "text-[#FF9933]", bg: "bg-[#FF9933]/10 border-[#FF9933]/20", glow: "hover:shadow-[#FF9933]/10" },
  { title: "Find Schemes", desc: "Discover eligible benefits", icon: Search, href: "/schemes", color: "text-[#FACC15]", bg: "bg-[#FACC15]/10 border-[#FACC15]/20", glow: "hover:shadow-[#FACC15]/10" },
  { title: "Document Assistant", desc: "Check requirements & fees", icon: FileText, href: "/documents", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", glow: "hover:shadow-blue-500/10" },
  { title: "Report Complaint", desc: "Raise a civic issue", icon: AlertTriangle, href: "/report-complaint", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", glow: "hover:shadow-red-500/10" },
  { title: "Nearby Offices", desc: "Locate government centers", icon: MapPin, href: "/nearby", color: "text-[#138808]", bg: "bg-[#138808]/10 border-[#138808]/20", glow: "hover:shadow-[#138808]/10" },
  { title: "Emergency Help", desc: "Important national numbers", icon: PhoneCall, href: "/emergency", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20", glow: "hover:shadow-rose-500/10" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data: complaints, isLoading } = useListComplaints(
    { userId: user?.id },
    { query: { enabled: !!user?.id, queryKey: ['/api/complaints', { userId: user?.id }] } }
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Premium Header Greeting Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-slate-900 via-[#0a1128] to-slate-900 p-6 md:p-8 text-white shadow-xl"
      >
        {/* Tricolor accent bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        {/* Glow decoration */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#FF9933] backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Digital India Portal Live
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-poppins">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-slate-300 max-w-xl text-sm md:text-base">
              Manage your services, track complaints, and discover schemes from India's official AI-powered citizen companion.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/chat">
              <Button size="lg" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white font-semibold flex items-center gap-2 group shadow-lg shadow-orange-500/20 transition-all">
                <Bot className="h-4 w-4 group-hover:rotate-12 transition-transform" /> Talk to AI
              </Button>
            </Link>
            <Link href="/schemes">
              <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 transition-all">
                <Search className="h-4 w-4" /> Find Schemes
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground/95 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-primary" />
          Quick Actions
        </h2>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {actionCards.map((card, i) => (
            <motion.div key={i} variants={item}>
              <Link href={card.href}>
                <Card className={`group cursor-pointer overflow-hidden border-border/50 bg-card/60 backdrop-blur-md hover:border-primary/40 hover:shadow-lg ${card.glow} transition-all h-full`}>
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl border ${card.bg} ${card.color} mb-4 group-hover:scale-110 transition-all duration-300`}>
                        <card.icon className="h-6 w-6" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground/90 group-hover:text-primary transition-colors">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground/95 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#138808]" />
            Recent Complaints
          </h2>
          <Link href="/track-complaint" className="text-sm font-medium text-[#FF9933] hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        <Card className="border-border/50 bg-card/60 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="divide-y divide-border">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                ))}
              </div>
            ) : complaints && complaints.length > 0 ? (
              <div className="divide-y divide-border">
                {complaints.slice(0, 3).map(complaint => (
                  <div key={complaint.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {complaint.status === 'resolved' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-foreground/90">{complaint.category} Issue</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">{complaint.complaintId}</span>
                          <span>•</span>
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border
                        ${complaint.status === 'pending' ? 'bg-yellow-100/80 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' : ''}
                        ${complaint.status === 'assigned' ? 'bg-blue-100/80 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : ''}
                        ${complaint.status === 'in_progress' ? 'bg-orange-100/80 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' : ''}
                        ${complaint.status === 'resolved' ? 'bg-green-100/80 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : ''}
                      `}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50 animate-pulse" />
                <p className="font-medium text-sm">No complaints reported yet.</p>
                <Button variant="link" className="mt-2 text-primary" asChild>
                  <Link href="/report-complaint">Report an issue now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}