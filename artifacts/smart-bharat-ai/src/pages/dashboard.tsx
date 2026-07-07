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
  { title: "AI Chat", desc: "Talk to your civic assistant", icon: Bot, href: "/chat", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { title: "Find Schemes", desc: "Discover eligible benefits", icon: Search, href: "/schemes", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { title: "Document Assistant", desc: "Check requirements & fees", icon: FileText, href: "/documents", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
  { title: "Report Complaint", desc: "Raise a civic issue", icon: AlertTriangle, href: "/report-complaint", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { title: "Nearby Offices", desc: "Locate government centers", icon: MapPin, href: "/nearby", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/30" },
  { title: "Emergency Help", desc: "Important national numbers", icon: PhoneCall, href: "/emergency", color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Need to provide enabled option with queryKey
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good morning, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your civic requests today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search services..." 
              className="h-10 w-full sm:w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {actionCards.map((card, i) => (
            <motion.div key={i} variants={item}>
              <Link href={card.href}>
                <Card className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-md transition-all h-full">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${card.bg} ${card.color} mb-4 group-hover:scale-110 transition-transform`}>
                        <card.icon className="h-6 w-6" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.desc}</p>
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
          <h2 className="text-lg font-semibold">Recent Complaints</h2>
          <Link href="/track-complaint" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        
        <Card className="border-border/50">
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
                        <h4 className="font-medium text-sm sm:text-base">{complaint.category} Issue</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{complaint.complaintId}</span>
                          <span>•</span>
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                        ${complaint.status === 'assigned' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${complaint.status === 'in_progress' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                        ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      `}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                <p>No complaints reported yet.</p>
                <Button variant="link" className="mt-2" asChild>
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