import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Copy } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const USE_CASE_MAP: Record<string, { emoji: string; label: string }> = {
  legal: { emoji: '⚖️', label: 'Legal Services' },
  medical: { emoji: '🏥', label: 'Medical & Health' },
  financial: { emoji: '💰', label: 'Financial Services' },
  customer_service: { emoji: '🎧', label: 'Customer Service' },
  education: { emoji: '📚', label: 'Education' },
  developer: { emoji: '⚙️', label: 'Developer / Other' },
};

function planHasApiAccess(): boolean {
  const plan = localStorage.getItem('rf_plan') || 'free';
  return ['growth', 'pro', 'enterprise'].includes(plan);
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { resetDemoData, addToast } = useApp();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('My RLHF Project');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const apiKey = 'rf-sk-••••••••4f9a';
  const realApiKey = 'rf-sk-a9b2c3d4e5f64f9a';

  const useCase = localStorage.getItem('rf_use_case') || '';
  const useCaseInfo = USE_CASE_MAP[useCase];

  const handleCopy = () => {
    navigator.clipboard.writeText(realApiKey);
    addToast({ type: 'success', message: 'Copied!' });
  };

  const handleReset = () => {
    resetDemoData();
    addToast({ type: 'success', message: 'Demo data cleared — fresh start! ✓' });
    onClose();
  };

  const handleSwitchUseCase = () => {
    localStorage.removeItem('rf_use_case');
    localStorage.removeItem('rf_generated_prompts');
    onClose();
    navigate('/onboarding');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[49] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative', zIndex: 50, width: '100%', maxWidth: 480,
              background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-bold text-base text-[#fafafa]">Settings</h2>
              <button onClick={onClose} style={{ color: '#525252' }} className="hover:text-[#a3a3a3] transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Project Name */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block mb-2">Project Name</label>
                <input value={projectName} onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                  onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'} />
              </div>

              {/* Use Case */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block mb-2">Use Case</label>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] px-3 py-1 rounded-full"
                    style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}>
                    {useCaseInfo ? `${useCaseInfo.emoji} ${useCaseInfo.label}` : '○ not selected'}
                  </span>
                  <button
                    onClick={handleSwitchUseCase}
                    className="font-mono text-[11px] transition-colors"
                    style={{ color: '#525252', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
                  >
                    Switch →
                  </button>
                </div>
              </div>

              {/* API Access */}
              {planHasApiAccess() ? (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block mb-1">API Key</label>
                  <p className="font-mono text-[9px] mb-2" style={{ color: '#525252' }}>
                    Use this to access RewardForge programmatically. Never share or commit to code.
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                    style={{ background: '#000', border: '1px solid #1a1a1a' }}>
                    <span className="flex-1 font-mono text-xs text-[#a3a3a3]">
                      {apiKeyVisible ? realApiKey : apiKey}
                    </span>
                    <button onClick={() => setApiKeyVisible(v => !v)} className="text-[#525252] hover:text-[#a3a3a3] transition-colors">
                      {apiKeyVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button onClick={handleCopy} className="text-[#525252] hover:text-[#a3a3a3] transition-colors">
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block mb-2">API Access</label>
                  <div className="px-4 py-3.5 rounded-lg" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 8 }}>
                    <p className="font-syne text-[13px] mb-2" style={{ color: '#525252' }}>🔒 Available on Growth plan and above</p>
                    <ul className="space-y-1">
                      {['Submit annotations via API', 'Trigger training automatically', 'Pull trained models programmatically'].map(b => (
                        <li key={b} className="font-mono text-[11px]" style={{ color: '#333' }}>• {b}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => { onClose(); navigate('/pricing'); }}
                      className="w-full mt-3 py-2 rounded-md font-syne text-[12px] transition-colors"
                      style={{ border: '1px solid #1a1a1a', color: '#525252', background: 'transparent', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
                    >
                      Upgrade to Growth →
                    </button>
                  </div>
                </div>
              )}

              {/* Plan */}
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
                    {['1,000 comparisons / month', '1 training run', 'PPO + GRPO + DPO', 'AI Copilot (10 messages/day)'].map(f => (
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

              <button onClick={() => { onClose(); navigate('/pricing'); }}
                className="w-full py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#fafafa', color: '#000' }}>
                Upgrade Plan →
              </button>

              {/* Reset demo data */}
              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 16 }}>
                <button onClick={handleReset}
                  className="w-full py-2.5 rounded-full font-syne font-bold text-sm transition-all hover:opacity-80"
                  style={{ border: '1px solid rgba(244,63,94,0.4)', color: '#f43f5e', background: 'rgba(244,63,94,0.06)' }}>
                  Reset demo data
                </button>
                <p className="font-mono text-[9px] text-center mt-1.5" style={{ color: '#333' }}>
                  Clears all comparisons, models, and runs
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
