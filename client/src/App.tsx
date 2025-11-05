import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CatchingGame from "@/pages/game";
import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';

function Router() {
  return (
    <Switch>
      <Route path="/" component={CatchingGame} />
      <Route component={CatchingGame} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    const initializeFarcasterSDK = async () => {
      try {
        await sdk.actions.ready();
        console.log('Farcaster SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
      }
    };

    initializeFarcasterSDK();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
