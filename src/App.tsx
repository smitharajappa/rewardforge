import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// HashRouter = most reliable for GitHub Pages direct-URL navigation
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { CopilotPanel } from "@/components/CopilotPanel";
import { ToastSystem } from "@/components/ToastSystem";
import { CommandPalette } from "@/components/CommandPalette";
import { ShortcutsModal } from "@/components/ShortcutsModal";
import HomePage from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      {/* HashRouter: URLs become /#/dashboard, /#/annotate, etc.
          Works on GitHub Pages without any server config. */}
      <HashRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<HomePage />} />

          {/* App shell wraps sidebar + topbar for all app routes */}
          <Route path="/dashboard/*"  element={<AppShell />} />
          <Route path="/annotate/*"   element={<AppShell />} />
          <Route path="/train-rm/*"   element={<AppShell />} />
          <Route path="/rl-loop/*"    element={<AppShell />} />
          <Route path="/evaluate/*"   element={<AppShell />} />

          {/* Convenience redirects */}
          <Route path="/trainrm"  element={<Navigate to="/train-rm"  replace />} />
          <Route path="/rlloop"   element={<Navigate to="/rl-loop"   replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global overlays — rendered outside Routes so they persist */}
        <CopilotPanel />
        <ToastSystem />
        <CommandPalette />
        <ShortcutsModal />
      </HashRouter>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
