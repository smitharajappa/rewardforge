import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { CopilotPanel } from "@/components/CopilotPanel";
import { ToastSystem } from "@/components/ToastSystem";
import { CommandPalette } from "@/components/CommandPalette";
import { ShortcutsModal } from "@/components/ShortcutsModal";
import HomePage from "./pages/Index";
import BlogPage from "./pages/Blog";
import DocsPage from "./pages/Docs";
import PricingPage from "./pages/Pricing";
import OnboardingPage from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<HomePage />} />

          {/* Standalone pages */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Single AppShell instance handles all app routes via nested Routes */}
          <Route path="/*" element={<AppShell />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global overlays */}
        <CopilotPanel />
        <ToastSystem />
        <CommandPalette />
        <ShortcutsModal />
      </HashRouter>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
