import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutGrid, MessageSquare, Cpu, RefreshCw, BarChart2, Sparkles, Settings, Home, BookOpen, CreditCard, LogOut, FileText } from 'lucide-react';
import { LogoMark, Wordmark } from './Logo';
import { useApp } from '@/context/AppContext';
import { useState, useRef, useEffect } from 'react';
import { SettingsModal } from './SettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
  { id: 'annotate', label: 'Annotate', icon: MessageSquare, path: '/annotate' },
  { id: 'train-rm', label: 'Train RM', icon: Cpu, path: '/train-rm' },
  { id: 'rl-loop', label: 'RL Loop', icon: RefreshCw, path: '/rl-loop' },
  { id: 'evaluate', label: 'Evaluate', icon: BarChart2, path: '/evaluate' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { comparisons, rewardModels, rlRuns, setCopilotOpen, addToast } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const badges: Record<string, number> = {
    '/annotate': comparisons.length,
    '/train-rm': rewardModels.length,
    '/rl-loop': rlRuns.length,
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <aside
        className="w-[220px] border-r flex flex-col shrink-0 bg-grid-sidebar relative z-20"
        style={{ background: '#000', borderColor: '#1a1a1a' }}
      >
        {/* Logo */}
        <Link to="/" className="px-4 pt-5 pb-4 cursor-pointer block" style={{ borderBottom: '1px solid #1a1a1a', textDecoration: 'none' }}>
          <div className="flex items-center gap-2.5">
            <LogoMark size={32} />
            <div>
              <Wordmark size="sm" />
              <div className="font-mono text-[8px] tracking-[0.18em] uppercase mt-0.5" style={{ color: '#38bdf8' }}>
                RLHF Platform
              </div>
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4">
          <div className="px-2 mb-2.5 font-mono text-[8px] tracking-[0.2em] uppercase" style={{ color: '#333' }}>
            Workspace
          </div>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const badge = badges[item.path];
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-r-md transition-all duration-150 group cursor-pointer"
                  style={{
                    background: isActive ? '#111' : 'transparent',
                    color: isActive ? '#fafafa' : '#404040',
                    borderLeft: isActive ? '2px solid #38bdf8' : '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#a3a3a3'; } }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#404040'; } }}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={15} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {badge !== undefined && badge > 0 && (
                    <span className="font-mono text-[10px]" style={{ color: '#525252' }}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Copilot */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="w-full mt-5 flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}
          >
            <Sparkles size={15} />
            <span className="text-sm font-bold">Ask Copilot</span>
          </button>
        </nav>

        {/* Bottom */}
        <div className="p-3" style={{ borderTop: '1px solid #1a1a1a' }}>
          {/* Home link */}
          <Link to="/"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md mb-1 transition-colors text-[11px] font-mono cursor-pointer"
            style={{ color: '#333', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}
          >
            <Home size={11} />
            ← Home
          </Link>

          {/* Blog link */}
          <Link to="/blog"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md mb-2 transition-colors text-[11px] font-mono cursor-pointer"
            style={{ color: '#333', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}
          >
            <FileText size={11} />
            📝 Blog
          </Link>

          {/* User profile with dropdown */}
          <div ref={profileRef} className="relative">
            <div
              className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors hover:bg-surface3"
              onClick={() => setProfileOpen(v => !v)}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#a3a3a3' }}>
                U
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#fafafa] truncate">User</div>
                <div className="text-[10px]" style={{ color: '#525252' }}>Free Plan</div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setSettingsOpen(true); }}
                className="transition-colors cursor-pointer"
                style={{ color: '#525252' }}
              >
                <Settings size={13} />
              </button>
            </div>

            {/* Profile dropdown — appears ABOVE the avatar */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-full left-0 mb-2 rounded-lg overflow-hidden shadow-2xl"
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', minWidth: 200, zIndex: 100 }}
                >
                  {/* User info */}
                  <div className="px-3 py-2.5" style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <div className="font-syne font-bold text-xs text-[#fafafa]">User</div>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full inline-block mt-0.5"
                      style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8' }}>
                      Free Plan
                    </span>
                  </div>

                  {[
                    { icon: Settings, label: 'Account settings', action: () => { setProfileOpen(false); setSettingsOpen(true); } },
                    { icon: BookOpen, label: 'Documentation', action: () => { setProfileOpen(false); navigate('/docs'); } },
                    { icon: CreditCard, label: 'Upgrade plan', action: () => { setProfileOpen(false); navigate('/pricing'); } },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-syne transition-colors"
                      style={{ color: '#a3a3a3', borderBottom: '1px solid #0f0f0f' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fafafa'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
                    >
                      <item.icon size={12} />
                      {item.label}
                    </button>
                  ))}

                  <button
                    onClick={() => { setProfileOpen(false); addToast({ type: 'info', message: 'Sign out coming soon' }); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-syne transition-colors"
                    style={{ color: '#525252' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f87171'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
                  >
                    <LogOut size={12} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="w-full mt-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
            style={{ border: '1px solid #1a1a1a', color: '#38bdf8', background: 'transparent' }}
            onClick={() => navigate('/pricing')}
          >
            Upgrade to Pro
          </button>
        </div>
      </aside>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
