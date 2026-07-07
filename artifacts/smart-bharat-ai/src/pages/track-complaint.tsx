import { useState } from "react";
import { useGetComplaint } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Calendar, User, Clock, AlertCircle, Building2, Tag, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState("");
  const [searchId, setSearchId] = useState("");
  
  const { data: complaint, isLoading, error } = useGetComplaint(
    searchId,
    { query: { enabled: !!searchId, queryKey: ['/api/complaints', searchId] } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintId.trim()) {
      setSearchId(complaintId.trim());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'assigned': return <User className="h-5 w-5" />;
      case 'in_progress': return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'resolved': return <CheckCircle2 className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Track Your Complaint</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Enter your Tracking ID to get real-time updates on the resolution status.
        </p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto relative mt-8">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="e.g. SB-12345678" 
              className="h-14 pl-12 pr-32 text-lg rounded-full font-mono uppercase shadow-sm border-primary/20 focus-visible:ring-primary/50"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-2 h-10 rounded-full px-6"
              disabled={!complaintId.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
            </Button>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="h-[200px] rounded-xl bg-muted animate-pulse"></div>
            <div className="h-[400px] rounded-xl bg-muted animate-pulse"></div>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
            <AlertCircle className="h-10 w-10 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Complaint Not Found</h3>
            <p className="mt-1 opacity-90">Please check your Tracking ID and try again.</p>
          </motion.div>
        )}

        {complaint && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* Details Card */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden border-border/60 shadow-md">
                <div className="bg-muted/30 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Tracking ID</p>
                    <h2 className="text-2xl font-mono font-bold">{complaint.complaintId}</h2>
                  </div>
                  <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-medium capitalize shadow-sm ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status.replace('_', ' ')}
                  </div>
                </div>
                
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x border-b">
                    <div className="p-6 flex items-start gap-4">
                      <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Category</p>
                        <p className="font-semibold">{complaint.category}</p>
                      </div>
                    </div>
                    <div className="p-6 flex items-start gap-4">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Department</p>
                        <p className="font-semibold">{complaint.department || "Assigning..."}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-sm text-muted-foreground font-medium mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Location
                      </h3>
                      <p className="text-base font-medium">{complaint.location}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm text-muted-foreground font-medium mb-2">Description</h3>
                      <p className="text-base text-foreground/90 whitespace-pre-wrap">{complaint.description}</p>
                    </div>
                    
                    {complaint.imageUrl && (
                      <div>
                        <h3 className="text-sm text-muted-foreground font-medium mb-2">Attached Image</h3>
                        <div className="rounded-lg overflow-hidden border bg-muted aspect-video flex items-center justify-center">
                          {/* We don't have actual images in mock, just a placeholder */}
                          <p className="text-muted-foreground text-sm font-medium italic">[Image Attachment Rendered Here]</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-border/60 shadow-md">
                <CardHeader className="border-b bg-muted/20 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" /> Resolution Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    
                    {/* The timeline events */}
                    {complaint.timeline && complaint.timeline.length > 0 ? (
                      complaint.timeline.map((event, index) => {
                        const isLast = index === 0; // Assuming timeline is sorted newest first
                        return (
                          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                                isLast ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                              }`}>
                              {getStatusIcon(event.status)}
                            </div>
                            
                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
                              <div className="flex flex-col gap-1 mb-2">
                                <span className={`font-semibold capitalize text-sm ${isLast ? 'text-primary' : ''}`}>
                                  {event.status.replace('_', ' ')}
                                </span>
                                <time className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> 
                                  {new Date(event.timestamp).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </time>
                              </div>
                              {event.note && (
                                <p className="text-sm text-muted-foreground mt-2 border-l-2 pl-2 italic">
                                  "{event.note}"
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      // Fallback if no timeline data
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                          {getStatusIcon(complaint.status)}
                        </div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
                          <span className="font-semibold capitalize text-sm text-primary">
                            {complaint.status.replace('_', ' ')}
                          </span>
                          <time className="text-xs text-muted-foreground block mt-1">Just now</time>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}