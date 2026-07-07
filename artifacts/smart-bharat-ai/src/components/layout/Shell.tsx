import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "../theme-toggle";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  FileCheck2,
  AlertTriangle,
  MapPin,
  Map,
  PhoneCall,
  User,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "../ui/button";
import { IndiaFlagIcon } from "../ui/IndiaFlagIcon";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    setLocation("/login");
    return null;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Chat", href: "/chat", icon: MessageSquare },
    { name: "Scheme Finder", href: "/schemes", icon: FileCheck2 },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Report Complaint", href: "/report-complaint", icon: AlertTriangle },
    { name: "Track Complaint", href: "/track-complaint", icon: Map },
    { name: "Nearby Offices", href: "/nearby", icon: MapPin },
    { name: "Emergency", href: "/emergency", icon: PhoneCall },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-sidebar-border/30">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            <IndiaFlagIcon className="w-7 h-5" /> Smart Bharat AI
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  location === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 mt-auto border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {user.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/60">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => logout()} className="text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Shell */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:hidden bg-background">
          <div className="flex items-center gap-2">
            <IndiaFlagIcon className="w-7 h-5" />
            <span className="font-bold">Smart Bharat</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute inset-0 top-16 z-50 bg-background md:hidden">
            <nav className="grid gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium ${
                    location === item.href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950/40 relative">
          {/* Ambient grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800b_1px,transparent_1px),linear-gradient(to_bottom,#8080800b_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[350px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="container relative z-10 mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}