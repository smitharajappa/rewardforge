import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SHORTCUTS = [
  {
    section: 'Annotation',
    items: [
      { key: 'A', label: 'Prefer Response A' },
      { key: 'B', label: 'Prefer Response B' },
      { key: 'T', label: 'Mark as Tie' },
      { key: 'S', label: 'Skip comparison' },
      { key: 'Enter', label: 'Submit & Next' },
      { key: 'Esc', label: 'Clear selection' },
    ],
  },
  {
    section: 'Navigation',
    items: [
      { key: '⌘K', label: 'Open command palette' },
      { key: '?', label: 'Open shortcuts modal' },
    ],
  },
  {
    section: 'Copilot',
    items: [
      { key: 'Enter', label: 'Send message' },
      { key: '⇧ Enter', label: 'New line in message' },
      { key: 'Esc', label: 'Close copilot panel' },
    ],
  },
];

export function ShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Only trigger '?' if not typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?') setOpen(v => !v);
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] z-[90] rounded-xl overflow-hidden shadow-2xl"
            style={{ background: '#0a0a0a', border: '1px solid #2a2a2a' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
              <div>
                <h2 className="font-syne font-bold text-sm text-[#fafafa]">Keyboard Shortcuts</h2>
                <p className="font-mono text-[9px] mt-0.5" style={{ color: '#525252' }}>Press ? to toggle this modal</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ color: '#525252' }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-6">
              {SHORTCUTS.map(section => (
                <div key={section.section}>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: '#38bdf8' }}>
                    {section.section}
                  </div>
                  <div className="space-y-2">
                    {section.items.map(item => (
                      <div key={item.key} className="flex items-center justify-between">
                        <span className="font-syne text-xs" style={{ color: '#a3a3a3' }}>{item.label}</span>
                        <kbd className="font-mono text-[10px] px-2 py-1 rounded"
                          style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}>
                          {item.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
