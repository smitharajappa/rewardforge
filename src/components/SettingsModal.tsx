import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Copy } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [projectName, setProjectName] = useState('My RLHF Project');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const apiKey = 'rf-sk-••••••••4f9a';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] p-6 rounded-xl"
            style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-bold text-base text-[#fafafa]">Settings</h2>
              <button onClick={onClose} style={{ color: '#525252' }}><X size={16} /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block mb-2">Project Name</label>
                <input
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                  onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'}
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block mb-2">API Key</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{ background: '#000', border: '1px solid #1a1a1a' }}>
                  <span className="flex-1 font-mono text-xs text-[#a3a3a3]">
                    {apiKeyVisible ? 'rf-sk-a9b2c3d4e5f64f9a' : apiKey}
                  </span>
                  <button onClick={() => setApiKeyVisible(v => !v)} className="text-[#525252] hover:text-[#a3a3a3] transition-colors">
                    {apiKeyVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => navigator.clipboard.writeText('rf-sk-a9b2c3d4e5f64f9a')}
                    className="text-[#525252] hover:text-[#a3a3a3] transition-colors">
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block mb-3">Plan</label>
                <div className="p-4 rounded-lg" style={{ background: '#000', border: '1px solid #1a1a1a' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-syne font-bold text-sm text-[#fafafa]">Free Plan</span>
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8' }}>
                      ACTIVE
                    </span>
                  </div>
                  <div className="space-y-2">
                    {['1,000 comparisons / month', '3 training runs', 'PPO + GRPO + DPO', 'AI Copilot (limited)'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs" style={{ color: '#a3a3a3' }}>
                        <span style={{ color: '#34d399' }}>✓</span> {f}
                      </div>
                    ))}
                    {['Unlimited comparisons', 'HuggingFace Hub export', 'Priority GPU access'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs" style={{ color: '#525252' }}>
                        <span style={{ color: '#525252' }}>✗</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#fafafa', color: '#000' }}>
                Upgrade to Pro →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
