import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { MessageSquare, Cpu, RefreshCw, Sparkles, Download, LayoutGrid, BarChart2, X } from 'lucide-react';

const ACTIONS = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Go to Dashboard', path: '/dashboard', color: '#38bdf8' },
  { id: 'annotate', icon: MessageSquare, label: 'New Comparison', path: '/annotate', color: '#38bdf8' },
  { id: 'train-rm', icon: Cpu, label: 'Train Reward Model', path: '/train-rm', color: '#34d399' },
  { id: 'rl-loop', icon: RefreshCw, label: 'Launch RL Run', path: '/rl-loop', color: '#a78bfa' },
  { id: 'evaluate', icon: BarChart2, label: 'View Evaluate', path: '/evaluate', color: '#f59e0b' },
  { id: 'copilot', icon: Sparkles, label: 'Ask Copilot', path: null, color: '#38bdf8' },
  { id: 'export', icon: Download, label: 'Export Model', path: '/evaluate', color: '#f472b6' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const { setCopilotOpen } = useApp();

  const filtered = ACTIONS.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const execute = useCallback((action: typeof ACTIONS[0]) => {
    setOpen(false);
    setQuery('');
    if (action.id === 'copilot') {
      setCopilotOpen(true);
    } else if (action.path) {
      navigate(action.path);
    }
  }, [navigate, setCopilotOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
        setQuery('');
        setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter') { e.preventDefault(); if (filtered[selected]) execute(filtered[selected]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selected, execute]);

  useEffect(() => { setSelected(0); }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80]"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-[560px] z-[90] rounded-xl overflow-hidden shadow-2xl"
            style={{ background: '#0a0a0a', border: '1px solid #2a2a2a' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent)' }} />
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #1a1a1a' }}>
              <span className="font-mono text-[11px]" style={{ color: '#525252' }}>⌘K</span>
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search actions..."
                className="flex-1 bg-transparent text-sm outline-none font-syne"
                style={{ color: '#fafafa' }}
              />
              <button onClick={() => setOpen(false)} style={{ color: '#525252' }}>
                <X size={14} />
              </button>
            </div>
            <div className="py-2 max-h-[360px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center font-mono text-[11px]" style={{ color: '#333' }}>No actions found</div>
              ) : (
                filtered.map((a, i) => (
                  <button
                    key={a.id}
                    onClick={() => execute(a)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                    style={{
                      background: selected === i ? '#111' : 'transparent',
                      borderLeft: selected === i ? `2px solid ${a.color}` : '2px solid transparent',
                    }}
                    onMouseEnter={() => setSelected(i)}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${a.color}15` }}>
                      <a.icon size={14} style={{ color: a.color }} />
                    </div>
                    <span className="font-syne text-sm" style={{ color: selected === i ? '#fafafa' : '#a3a3a3' }}>{a.label}</span>
                    {selected === i && (
                      <span className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: '#1a1a1a', color: '#525252' }}>↵</span>
                    )}
                  </button>
                ))
              )}
            </div>
            <div className="px-4 py-2 flex items-center gap-4" style={{ borderTop: '1px solid #1a1a1a' }}>
              {[['↑↓', 'navigate'], ['↵', 'select'], ['Esc', 'close']].map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}>{key}</kbd>
                  <span className="font-mono text-[9px]" style={{ color: '#333' }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
