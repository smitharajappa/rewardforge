import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function SkeletonBox({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 8,
        background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
    />
  );
}

export function PageSkeleton({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      setShowSkeleton(true);
      setPrevPath(location.pathname);
      const timer = setTimeout(() => setShowSkeleton(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, prevPath]);

  if (showSkeleton) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6 p-1"
      >
        {/* Title skeleton */}
        <SkeletonBox style={{ width: '40%', height: 28 }} />
        <SkeletonBox style={{ width: '25%', height: 14, marginTop: 6 }} />

        {/* 4 stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonBox key={i} style={{ height: 100 }} />
          ))}
        </div>

        {/* Pipeline / full-width card */}
        <SkeletonBox style={{ height: 80, width: '100%' }} />

        {/* Two side-by-side large panels */}
        <div className="grid grid-cols-3 gap-6">
          <SkeletonBox style={{ height: 260, gridColumn: 'span 2' }} />
          <SkeletonBox style={{ height: 260 }} />
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}
