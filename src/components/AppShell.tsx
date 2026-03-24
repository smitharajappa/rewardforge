import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { DemoBanner } from './DemoBanner';
import { Dashboard } from '@/pages/Dashboard';
import { Annotate } from '@/pages/Annotate';
import { TrainRM } from '@/pages/TrainRM';
import { RLLoop } from '@/pages/RLLoop';
import { Evaluate } from '@/pages/Evaluate';
import { useIsMobile } from '@/hooks/use-mobile';

function SkeletonShimmer() {
  return (
    <div className="space-y-6">
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
    </div>
  );
}

export function AppShell() {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const prevPathRef = useRef(location.pathname);
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Scroll to top on navigation
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  // Show skeleton for 1.2s on initial mount
  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Show skeleton again on every subsequent route change
  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      prevPathRef.current = location.pathname;
      setShowSkeleton(true);
      const t = setTimeout(() => setShowSkeleton(false), 1200);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#000' }}>
      {/* Desktop sidebar — always visible */}
      {!isMobile && <Sidebar />}

      {/* Mobile sidebar — slide-in overlay */}
      {isMobile && (
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(0,0,0,0.7)' }}
                onClick={() => setMobileSidebarOpen(false)}
              />
              {/* Sidebar panel */}
              <motion.div
                key="mobile-sidebar"
                initial={{ x: -240 }}
                animate={{ x: 0 }}
                exit={{ x: -240 }}
                transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
                className="fixed top-0 left-0 h-full z-50"
              >
                <Sidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          mobileSidebarToggle={isMobile ? () => setMobileSidebarOpen(v => !v) : undefined}
          mobileSidebarOpen={mobileSidebarOpen}
        />
        <DemoBanner />
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-grid-main relative">
          {/* Radial glows */}
          <div className="fixed top-0 left-[220px] w-[500px] h-[400px] pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 65%)' }} />
          <div className="fixed top-0 right-0 w-[400px] h-[350px] pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse, rgba(244,114,182,0.06) 0%, transparent 70%)' }} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[300px] pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)' }} />

          <div className="relative z-10 p-4 md:p-7 max-w-[1300px] mx-auto w-full">
            <AnimatePresence mode="wait" initial={false}>
              {showSkeleton ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <SkeletonShimmer />
                </motion.div>
              ) : (
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/annotate" element={<Annotate />} />
                    <Route path="/train-rm" element={<TrainRM />} />
                    <Route path="/trainrm" element={<Navigate to="/train-rm" replace />} />
                    <Route path="/rl-loop" element={<RLLoop />} />
                    <Route path="/rlloop" element={<Navigate to="/rl-loop" replace />} />
                    <Route path="/evaluate" element={<Evaluate />} />
                  </Routes>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
