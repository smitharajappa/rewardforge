import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { CopilotPanel } from "@/components/CopilotPanel";
import { ToastSystem } from "@/components/ToastSystem";
import { CommandPalette } from "@/components/CommandPalette";
import { ShortcutsModal } from "@/components/ShortcutsModal";
import HomePage from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// basename matches vite base: '/' in dev/preview, '/rewardforge/' on GitHub Pages
const basename = import.meta.env.BASE_URL === '/rewardforge/'
  ? '/rewardforge'
  : '/';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<HomePage />} />

          {/* App shell handles all dashboard routes internally */}
          <Route path="/dashboard"  element={<AppShell />} />
          <Route path="/annotate"   element={<AppShell />} />
          <Route path="/train-rm"   element={<AppShell />} />
          <Route path="/rl-loop"    element={<AppShell />} />
          <Route path="/evaluate"   element={<AppShell />} />

          {/* Legacy / convenience redirects */}
          <Route path="/trainrm"  element={<Navigate to="/train-rm"  replace />} />
          <Route path="/rlloop"   element={<Navigate to="/rl-loop"   replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global overlays */}
        <CopilotPanel />
        <ToastSystem />
        <CommandPalette />
        <ShortcutsModal />
      </BrowserRouter>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
