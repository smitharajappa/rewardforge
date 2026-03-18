import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/annotate': 'Annotate',
  '/train-rm': 'Train RM',
  '/rl-loop': 'RL Loop',
  '/evaluate': 'Evaluate',
};

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
  time: string;
}

const MOCK_NOTIFS: Notification[] = [
  { id: '1', type: 'success', message: 'RM-v1 training complete · 84.2% acc', time: '2m ago' },
  { id: '2', type: 'info', message: 'PPO run finished · Reward 2.341', time: '8m ago' },
  { id: '3', type: 'info', message: '5 comparisons reached — ready to train!', time: '15m ago' },
];

const dotColors = { success: '#34d399', info: '#38bdf8', warning: '#f59e0b' };

export function TopBar() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'RewardForge';
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between px-6"
      style={{ height: 48, background: 'rgba(0,0,0,0.92)', borderBottom: '1px solid #1a1a1a', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center gap-2">
        <span className="font-syne font-extrabold text-base text-[#fafafa]">{title}</span>
        <span className="text-[#333] text-sm">/</span>
        <span className="font-mono text-[10px] text-[#525252]">rewardforge.ai</span>
      </div>

      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => setNotifOpen(v => !v)}
          className="relative p-1.5 rounded-lg transition-colors hover:bg-surface3"
          style={{ color: '#525252' }}
        >
          <Bell size={16} />
          {notifs.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full font-mono text-[8px] flex items-center justify-center"
              style={{ background: '#38bdf8', color: '#000' }}>
              {notifs.length}
            </span>
          )}
        </button>

        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#a3a3a3' }}>
          U
        </div>

        {/* Notif dropdown */}
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              className="absolute top-10 right-0 w-[280px] rounded-xl overflow-hidden shadow-2xl z-50"
              style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <span className="font-syne font-bold text-xs text-[#fafafa]">Notifications</span>
                <button onClick={() => setNotifs([])} className="font-mono text-[9px]" style={{ color: '#525252' }}>
                  Clear all
                </button>
              </div>
              {notifs.length === 0 ? (
                <div className="px-4 py-6 text-center font-mono text-[10px]" style={{ color: '#525252' }}>No notifications</div>
              ) : (
                notifs.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface"
                    style={{ borderBottom: '1px solid #0f0f0f' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: dotColors[n.type] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#a3a3a3] leading-relaxed">{n.message}</p>
                      <span className="font-mono text-[9px]" style={{ color: '#333' }}>{n.time}</span>
                    </div>
                    <button onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))}
                      className="shrink-0 transition-colors" style={{ color: '#333' }}>
                      <X size={11} />
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
