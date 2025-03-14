import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { type User } from "@shared/schema";
import { Navbar } from "@/components/layout/navbar";
import { logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

// Pages
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import CreateRide from "@/pages/rides/create";
import SearchRides from "@/pages/rides/search";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser} onLogout={handleLogout} />
      
      <main>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />
          <Route path="/rides/create" component={CreateRide} />
          <Route path="/rides/search" component={SearchRides} />
          <Route path="/profile" component={Profile} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
