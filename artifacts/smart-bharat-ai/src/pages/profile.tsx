import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useGetUserProfile, 
  useUpdateUserProfile,
  useListComplaints,
  useGetSavedSchemes,
  useListChatSessions
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, Bell, Globe, MapPin, Save, MessageSquare, AlertTriangle, BookMarked, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  "English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada", "Bengali"
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Queries
  const { data: profile } = useGetUserProfile(
    user?.id || "",
    { query: { enabled: !!user?.id, queryKey: ['/api/users', user?.id] } }
  );

  const { data: complaints } = useListComplaints(
    { userId: user?.id },
    { query: { enabled: !!user?.id, queryKey: ['/api/complaints', { userId: user?.id }] } }
  );

  const { data: chats } = useListChatSessions(
    { userId: user?.id || "" },
    { query: { enabled: !!user?.id, queryKey: ['/api/chat/sessions', { userId: user?.id }] } }
  );

  const { data: savedSchemes } = useGetSavedSchemes(
    { userId: user?.id || "" },
    { query: { enabled: !!user?.id, queryKey: ['/api/schemes/saved', { userId: user?.id }] } }
  );

  const updateProfile = useUpdateUserProfile();

  const [nameValue, setNameValue] = useState(profile?.name || user?.name || "");
  const [langValue, setLangValue] = useState(profile?.language || "English");
  const [stateValue, setStateValue] = useState(profile?.state || "");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        data: {
          name: nameValue,
          language: langValue,
          state: stateValue,
        },
      });
      toast({
        title: "Profile Updated",
        description: "Your settings have been saved successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column - Profile Form & Settings */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                  {user?.photoUrl ? (
                    <AvatarImage src={user.photoUrl} alt={user.name} />
                  ) : (
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Citizen Account</Badge>
              </div>

              <div className="mt-8 space-y-4">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={nameValue} onChange={e => setNameValue(e.target.value)} className="bg-muted/50" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> Preferred Language</Label>
                    <Select value={langValue} onValueChange={setLangValue}>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map(lang => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> State</Label>
                    <Input value={stateValue} onChange={e => setStateValue(e.target.value)} className="bg-muted/50" />
                  </div>

                  <Button type="submit" className="w-full mt-6" disabled={isSaving}>
                    {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5" /> Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates about complaints.</p>
                </div>
                <Switch defaultChecked={profile?.notifications !== false} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">Weekly scheme digests.</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - User Data Tabs */}
        <div className="md:col-span-2">
          <Card className="border-border/60 h-full min-h-[600px]">
            <Tabs defaultValue="complaints" className="w-full">
              <CardHeader className="border-b px-6 py-4 bg-muted/20">
                <TabsList className="grid w-full grid-cols-3 max-w-md bg-background border shadow-sm">
                  <TabsTrigger value="complaints">Complaints</TabsTrigger>
                  <TabsTrigger value="schemes">Saved Schemes</TabsTrigger>
                  <TabsTrigger value="chats">Chat History</TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent className="p-0">
                <TabsContent value="complaints" className="m-0 border-none outline-none">
                  {complaints && complaints.length > 0 ? (
                    <div className="divide-y divide-border">
                      {complaints.map(complaint => (
                        <div key={complaint.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-lg">{complaint.category} Issue</h4>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400' : ''}
                                ${complaint.status === 'assigned' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400' : ''}
                                ${complaint.status === 'in_progress' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-400' : ''}
                                ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400' : ''}
                              `}>
                                {complaint.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{complaint.description}</p>
                            <div className="text-xs font-mono text-muted-foreground mt-2">
                              ID: {complaint.complaintId} • {new Date(complaint.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center h-[400px]">
                      <AlertTriangle className="h-12 w-12 mb-4 opacity-20" />
                      <p>You haven't reported any complaints yet.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="schemes" className="m-0 border-none outline-none">
                  {savedSchemes && savedSchemes.length > 0 ? (
                    <div className="divide-y divide-border">
                      {savedSchemes.map(scheme => (
                        <div key={scheme.id} className="p-6 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg text-primary">{scheme.name}</h4>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <BookMarked className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{scheme.description}</p>
                          <Button variant="outline" size="sm" asChild>
                            <a href={scheme.officialPortal} target="_blank" rel="noopener noreferrer">View Official Portal</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center h-[400px]">
                      <BookMarked className="h-12 w-12 mb-4 opacity-20" />
                      <p>No saved schemes found.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="chats" className="m-0 border-none outline-none">
                  {chats && chats.length > 0 ? (
                    <div className="divide-y divide-border">
                      {chats.map(chat => (
                        <div key={chat.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                              <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{chat.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {new Date(chat.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Resume</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center h-[400px]">
                      <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                      <p>No chat history available.</p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Inline Badge component since it wasn't exported in the previous file snippet
function Badge({ children, variant = "default", className = "" }: any) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/80" : 
      variant === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" :
      variant === "outline" ? "text-foreground border border-input" : ""
    } ${className}`}>
      {children}
    </span>
  );
}