import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { CopilotPanel } from "@/components/CopilotPanel";
import { ToastSystem } from "@/components/ToastSystem";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/*" element={<AppShell />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CopilotPanel />
        <ToastSystem />
      </BrowserRouter>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
