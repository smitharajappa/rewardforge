import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Dashboard } from '@/pages/Dashboard';
import { Annotate } from '@/pages/Annotate';
import { TrainRM } from '@/pages/TrainRM';
import { RLLoop } from '@/pages/RLLoop';
import { Evaluate } from '@/pages/Evaluate';
import { PageSkeleton } from './PageSkeleton';

export function AppShell() {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      setShowSkeleton(true);
      setPrevPath(location.pathname);
      const t = setTimeout(() => setShowSkeleton(false), 1200);
      return () => clearTimeout(t);
    }
  }, [location.pathname, prevPath]);

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
            {showSkeleton ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Shimmer skeleton */}
                {[{ w: '40%', h: 28 }, { w: '25%', h: 14 }].map((s, i) => (
                  <div key={i} className="skeleton-shimmer rounded-lg" style={{ width: s.w, height: s.h }} />
                ))}
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton-shimmer rounded-xl" style={{ height: 100 }} />
                  ))}
                </div>
                <div className="skeleton-shimmer rounded-xl" style={{ width: '100%', height: 80 }} />
                <div className="grid grid-cols-3 gap-6">
                  <div className="skeleton-shimmer rounded-xl col-span-2" style={{ height: 260 }} />
                  <div className="skeleton-shimmer rounded-xl" style={{ height: 260 }} />
                </div>
              </motion.div>
            ) : (
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
