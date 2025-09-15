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

            {/* Protected app shell with sidebar */}
            <Route path="/" component={() => (
              <div className="min-h-screen flex">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <Switch>
                    <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
                    <Route path="/campaigns" component={() => <ProtectedRoute component={Campaigns} />} />
                    <Route path="/contacts" component={() => <ProtectedRoute component={Contacts} />} />
                    <Route path="/analytics" component={() => <ProtectedRoute component={Analytics} />} />
                    <Route path="/tasks" component={() => <ProtectedRoute component={Tasks} />} />
                    <Route component={NotFound} />
                  </Switch>
                </main>
              </div>
            )} />
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
