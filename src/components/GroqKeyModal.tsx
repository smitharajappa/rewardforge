import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { saveGroqKey } from '@/lib/groq';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function GroqKeyModal({ open, onClose, onSaved }: Props) {
  const [key, setKey] = useState('');
  const [visible, setVisible] = useState(false);

  const handleSave = () => {
    if (!key.trim()) return;
    saveGroqKey(key.trim());
    onSaved();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-md rounded-xl p-6 shadow-2xl"
            style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', zIndex: 50 }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 transition-colors" style={{ color: '#525252' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}>
              <X size={16} />
            </button>

            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
                <span style={{ fontSize: 22 }}>⚡</span>
              </div>
            </div>

            <h2 className="font-syne font-bold text-lg text-[#fafafa] text-center mb-2">Groq API Key Required</h2>
            <p className="font-mono text-[12px] text-center leading-relaxed mb-6" style={{ color: '#525252' }}>
              RewardForge uses Groq's free AI API.<br />
              Get your free key at console.groq.com —<br />
              no credit card required. Takes 2 minutes.
            </p>

            <div className="space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: '#525252' }}>
                  Groq API Key
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{ background: '#000', border: '1px solid #1a1a1a' }}>
                  <input
                    type={visible ? 'text' : 'password'}
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    placeholder="gsk_xxxxxxxxxxxx"
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: '#fafafa' }}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                  />
                  <button onClick={() => setVisible(v => !v)} style={{ color: '#525252' }}
                    className="hover:text-[#a3a3a3] transition-colors">
                    {visible ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={!key.trim()}
                className="w-full py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: key.trim() ? '#fafafa' : '#333', color: key.trim() ? '#000' : '#525252', cursor: key.trim() ? 'pointer' : 'not-allowed' }}
              >
                Save key →
              </button>

              <button
                onClick={() => window.open('https://console.groq.com', '_blank')}
                className="w-full py-2.5 rounded-full font-syne font-semibold text-sm transition-all"
                style={{ border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', background: 'transparent' }}
              >
                Get free key →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
