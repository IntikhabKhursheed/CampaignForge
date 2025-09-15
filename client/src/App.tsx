import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";
import Dashboard from "./pages/dashboard";
import Campaigns from "./pages/campaigns";
import Contacts from "./pages/contacts";
import Analytics from "./pages/analytics";
import Tasks from "./pages/tasks";
import Sidebar from "./components/layout/sidebar";
import Login from "./pages/login";
import Register from "./pages/register";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute, PublicRoute } from "@/components/auth/route-guards";

function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Switch>
            {/* Public routes without sidebar */}
            <Route path="/login" component={() => (
              <div className="min-h-screen flex items-center justify-center p-4">
                <PublicRoute component={Login} />
              </div>
            )} />
            <Route path="/register" component={() => (
              <div className="min-h-screen flex items-center justify-center p-4">
                <PublicRoute component={Register} />
              </div>
            )} />

            {/* Protected routes with sidebar */}
            <Route path="/campaigns" component={() => (
              <div className="min-h-screen flex">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <ProtectedRoute component={Campaigns} />
                </main>
              </div>
            )} />
            <Route path="/contacts" component={() => (
              <div className="min-h-screen flex">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <ProtectedRoute component={Contacts} />
                </main>
              </div>
            )} />
            <Route path="/analytics" component={() => (
              <div className="min-h-screen flex">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <ProtectedRoute component={Analytics} />
                </main>
              </div>
            )} />
            <Route path="/tasks" component={() => (
              <div className="min-h-screen flex">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <ProtectedRoute component={Tasks} />
                </main>
              </div>
            )} />

            {/* Dashboard route - must come after specific routes */}
            <Route path="/" component={() => (
              <div className="min-h-screen flex">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <ProtectedRoute component={Dashboard} />
                </main>
              </div>
            )} />

            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <Router />
  );
}

export default App;
