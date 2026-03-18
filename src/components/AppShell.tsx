import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Dashboard } from '@/pages/Dashboard';
import { Annotate } from '@/pages/Annotate';
import { TrainRM } from '@/pages/TrainRM';
import { RLLoop } from '@/pages/RLLoop';
import { Evaluate } from '@/pages/Evaluate';

export function AppShell() {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#000' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-grid-main relative">
          {/* Radial glows */}
          <div className="fixed top-0 left-[220px] w-[500px] h-[400px] pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 65%)' }} />
          <div className="fixed top-0 right-0 w-[400px] h-[350px] pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse, rgba(244,114,182,0.06) 0%, transparent 70%)' }} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[300px] pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)' }} />

          <div className="relative z-10 p-7 max-w-[1300px] mx-auto w-full">
            {/* ✅ Fix: motion.div keyed by pathname is the direct child of AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                <Routes location={location}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/annotate" element={<Annotate />} />
                  <Route path="/train-rm" element={<TrainRM />} />
                  <Route path="/rl-loop" element={<RLLoop />} />
                  <Route path="/evaluate" element={<Evaluate />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
