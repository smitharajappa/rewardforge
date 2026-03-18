import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, MessageSquare, Cpu, RefreshCw, BarChart2, Sparkles, Settings } from 'lucide-react';
import { LogoMark, Wordmark } from './Logo';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { SettingsModal } from './SettingsModal';

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
  const { comparisons, rewardModels, rlRuns, setCopilotOpen } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const badges: Record<string, number> = {
    '/annotate': comparisons.length,
    '/train-rm': rewardModels.length,
    '/rl-loop': rlRuns.length,
  };

  return (
    <>
      <aside
        className="w-[220px] border-r flex flex-col shrink-0 bg-grid-sidebar relative z-20"
        style={{ background: '#000', borderColor: '#1a1a1a' }}
      >
        {/* Logo */}
        <div className="px-4 pt-5 pb-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
          <div className="flex items-center gap-2.5">
            <LogoMark size={32} />
            <div>
              <Wordmark size="sm" />
              <div className="font-mono text-[8px] tracking-[0.18em] uppercase mt-0.5" style={{ color: '#38bdf8' }}>
                RLHF Platform
              </div>
            </div>
          </div>
        </div>

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
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-r-md transition-all duration-150 group"
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
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.25)' }}>
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
            className="w-full mt-5 flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150"
            style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}
          >
            <Sparkles size={15} />
            <span className="text-sm font-bold">Ask Copilot</span>
          </button>
        </nav>

        {/* Bottom */}
        <div className="p-3" style={{ borderTop: '1px solid #1a1a1a' }}>
          <div className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors hover:bg-surface3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#a3a3a3' }}>
              U
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#fafafa] truncate">User</div>
              <div className="text-[10px]" style={{ color: '#525252' }}>Free Plan</div>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="transition-colors"
              style={{ color: '#525252' }}
            >
              <Settings size={13} />
            </button>
          </div>
          <button
            className="w-full mt-2 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ border: '1px solid #1a1a1a', color: '#38bdf8', background: 'transparent' }}
          >
            Upgrade to Pro
          </button>
        </div>
      </aside>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
