import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import RidesIndex from "@/pages/rides/index";
import CreateRide from "@/pages/rides/create";
import Profile from "@/pages/profile";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={RidesIndex} />
        <Route path="/rides" component={RidesIndex} />
        <Route path="/rides/create" component={CreateRide} />
        <Route path="/profile" component={Profile} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
