import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/annotate': 'Annotate',
  '/train-rm': 'Train RM',
  '/rl-loop': 'RL Loop',
  '/evaluate': 'Evaluate',
};

// ── Notification types ──────────────────────────────────────
export interface AppNotification {
  id: string;
  tab: 'system' | 'pipeline';
  iconEmoji: string;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const WELCOME_NOTIFS: AppNotification[] = [
  {
    id: 'sys-1',
    tab: 'system',
    iconEmoji: '👋',
    iconColor: '#38bdf8',
    title: 'Welcome to RewardForge!',
    body: 'Start by collecting 5 pairwise comparisons in the Annotate tab.',
    time: 'just now',
    read: false,
  },
  {
    id: 'sys-2',
    tab: 'system',
    iconEmoji: '💡',
    iconColor: '#f59e0b',
    title: 'Keyboard shortcuts available',
    body: 'Use A/B/T/S keys to annotate faster. Hit 10 comparisons in under 2 minutes.',
    time: 'just now',
    read: false,
  },
  {
    id: 'sys-3',
    tab: 'system',
    iconEmoji: 'ℹ️',
    iconColor: '#525252',
    title: 'Free plan active',
    body: '1,000 comparisons and 1 training run included this month.',
    time: 'just now',
    read: false,
  },
];

const LS_NOTIFS_KEY = 'rf_notifications';

function loadNotifs(): AppNotification[] {
  try {
    const raw = localStorage.getItem(LS_NOTIFS_KEY);
    if (raw) return JSON.parse(raw);
    return WELCOME_NOTIFS;
  } catch {
    return WELCOME_NOTIFS;
  }
}

function saveNotifs(notifs: AppNotification[]) {
  try { localStorage.setItem(LS_NOTIFS_KEY, JSON.stringify(notifs)); } catch { /* ignore */ }
}

export function TopBar() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'RewardForge';
  const { comparisons, rewardModels, rlRuns } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<AppNotification[]>(loadNotifs);
  const [activeTab, setActiveTab] = useState<'all' | 'pipeline' | 'system'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  // Persist notifications
  useEffect(() => { saveNotifs(notifs); }, [notifs]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Watch comparisons for milestone ──────────────────────
  const prevComparisonsLen = useRef(comparisons.length);
  useEffect(() => {
    const prev = prevComparisonsLen.current;
    prevComparisonsLen.current = comparisons.length;
    if (prev < 5 && comparisons.length >= 5) {
      addNotif({
        id: `milestone-5-${Date.now()}`,
        tab: 'pipeline',
        iconEmoji: '🎯',
        iconColor: '#34d399',
        title: '5 comparisons reached!',
        body: 'Ready to train your first reward model. Go to Train RM to start.',
        time: 'just now',
        read: false,
      });
    }
  }, [comparisons.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Watch rewardModels for training complete ──────────────
  const prevModelsLen = useRef(rewardModels.length);
  useEffect(() => {
    if (rewardModels.length > prevModelsLen.current) {
      const rm = rewardModels[0];
      addNotif({
        id: `rm-done-${rm.id}`,
        tab: 'pipeline',
        iconEmoji: '✅',
        iconColor: '#34d399',
        title: `Training complete · ${rm.name} saved`,
        body: `Final accuracy: ${(rm.accuracy * 100).toFixed(1)}% · Loss: ${rm.loss.toFixed(4)} · Ready for RL fine-tuning.`,
        time: 'just now',
        read: false,
      });
    }
    prevModelsLen.current = rewardModels.length;
  }, [rewardModels]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Watch rlRuns for run complete ─────────────────────────
  const prevRunsLen = useRef(rlRuns.length);
  useEffect(() => {
    if (rlRuns.length > prevRunsLen.current) {
      const run = rlRuns[0];
      addNotif({
        id: `rl-done-${run.id}`,
        tab: 'pipeline',
        iconEmoji: '✅',
        iconColor: '#34d399',
        title: `RL run complete · run-${run.id.slice(0, 6)} saved`,
        body: `Final reward: ${run.finalReward.toFixed(3)} · KL: ${run.klDivergence.toFixed(4)} · Best run marked ★`,
        time: 'just now',
        read: false,
      });
    }
    prevRunsLen.current = rlRuns.length;
  }, [rlRuns]); // eslint-disable-line react-hooks/exhaustive-deps

  const addNotif = (n: AppNotification) => {
    setNotifs(prev => {
      // deduplicate by id
      if (prev.some(x => x.id === n.id)) return prev;
      return [n, ...prev];
    });
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifOpen(v => {
      if (!v) setNotifs(prev => prev.map(n => ({ ...n, read: true })));
      return !v;
    });
  };

  const clearAll = () => {
    setNotifs([]);
    setNotifOpen(false);
  };

  const filteredNotifs = activeTab === 'all' ? notifs
    : notifs.filter(n => n.tab === activeTab);

  const tabCount = (tab: 'pipeline' | 'system') => notifs.filter(n => n.tab === tab).length;

  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between px-6"
      style={{ height: 48, background: 'rgba(0,0,0,0.92)', borderBottom: '1px solid #1a1a1a', backdropFilter: 'blur(8px)', flexShrink: 0 }}
    >
      <div className="flex items-center gap-2">
        <span className="font-syne font-extrabold text-base text-[#fafafa]">{title}</span>
        <span className="text-[#333] text-sm">/</span>
        <a
          href="https://rewardforge.lovable.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] transition-colors"
          style={{ color: '#525252', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#38bdf8'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
        >
          rewardforge.ai
        </a>
      </div>

      <div ref={panelRef} className="flex items-center gap-3 relative">
        {/* Bell */}
        <button
          onClick={markAllRead}
          className="relative p-1.5 rounded-lg transition-colors hover:bg-surface3"
          style={{ color: '#525252' }}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 rounded-full font-mono text-[8px] flex items-center justify-center px-0.5"
              style={{ background: '#38bdf8', color: '#000' }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#a3a3a3' }}>
          U
        </div>

        {/* Notification panel */}
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute top-10 right-0 rounded-xl overflow-hidden shadow-2xl z-50"
              style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', width: 360 }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <span className="font-syne font-bold text-[14px] text-[#fafafa]">Notifications</span>
                <button onClick={clearAll} className="font-mono text-[11px] transition-colors" style={{ color: '#525252' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}>
                  Clear all
                </button>
              </div>

              {/* Tabs */}
              <div className="flex" style={{ borderBottom: '1px solid #1a1a1a' }}>
                {([
                  { key: 'all', label: `All (${notifs.length})` },
                  { key: 'pipeline', label: `Pipeline (${tabCount('pipeline')})` },
                  { key: 'system', label: `System (${tabCount('system')})` },
                ] as const).map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className="flex-1 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-colors"
                    style={{
                      color: activeTab === t.key ? '#38bdf8' : '#525252',
                      borderBottom: activeTab === t.key ? '2px solid #38bdf8' : '2px solid transparent',
                      background: 'transparent',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Items */}
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {filteredNotifs.length === 0 ? (
                  <div className="px-4 py-8 text-center font-mono text-[10px]" style={{ color: '#525252' }}>
                    No notifications
                  </div>
                ) : (
                  filteredNotifs.map(n => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 transition-colors"
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #111',
                        background: n.read ? 'transparent' : 'rgba(56,189,248,0.02)',
                        cursor: 'default',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#111'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = n.read ? 'transparent' : 'rgba(56,189,248,0.02)'}
                    >
                      {/* Icon */}
                      <div
                        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[14px]"
                        style={{ background: `${n.iconColor}18`, border: `1px solid ${n.iconColor}30` }}
                      >
                        {n.iconEmoji}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium leading-snug" style={{ color: '#fafafa' }}>{n.title}</p>
                        <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: '#a3a3a3' }}>{n.body}</p>
                        <span className="font-mono text-[11px] mt-1 block" style={{ color: '#525252' }}>{n.time}</span>
                      </div>
                      {/* Dismiss */}
                      <button
                        onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))}
                        className="shrink-0 mt-0.5 transition-colors"
                        style={{ color: '#333' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
