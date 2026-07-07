import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { Shell } from '@/components/layout/Shell';

// Pages
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import ChatPage from '@/pages/chat';
import SchemesPage from '@/pages/schemes';
import DocumentsPage from '@/pages/documents';
import ReportComplaintPage from '@/pages/report-complaint';
import TrackComplaintPage from '@/pages/track-complaint';
import NearbyPage from '@/pages/nearby';
import EmergencyPage from '@/pages/emergency';
import ProfilePage from '@/pages/profile';
import AdminPage from '@/pages/admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthenticatedRoutes() {
  return (
    <Shell>
      <Switch>
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/schemes" component={SchemesPage} />
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/report-complaint" component={ReportComplaintPage} />
        <Route path="/track-complaint" component={TrackComplaintPage} />
        <Route path="/nearby" component={NearbyPage} />
        <Route path="/emergency" component={EmergencyPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      {/* Map all authenticated paths so wouter catches them, and render the Shell */}
      <Route path="/dashboard" component={AuthenticatedRoutes} />
      <Route path="/chat" component={AuthenticatedRoutes} />
      <Route path="/schemes" component={AuthenticatedRoutes} />
      <Route path="/documents" component={AuthenticatedRoutes} />
      <Route path="/report-complaint" component={AuthenticatedRoutes} />
      <Route path="/track-complaint" component={AuthenticatedRoutes} />
      <Route path="/nearby" component={AuthenticatedRoutes} />
      <Route path="/emergency" component={AuthenticatedRoutes} />
      <Route path="/profile" component={AuthenticatedRoutes} />
      <Route path="/admin" component={AuthenticatedRoutes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="smart-bharat-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
