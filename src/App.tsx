import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { CopilotPanel } from "@/components/CopilotPanel";
import { ToastSystem } from "@/components/ToastSystem";
import { CommandPalette } from "@/components/CommandPalette";
import { ShortcutsModal } from "@/components/ShortcutsModal";
import HomePage from "./pages/Index";
import BlogPage from "./pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<HomePage />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogPage />} />

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
