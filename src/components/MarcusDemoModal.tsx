import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  onClose: () => void;
}

const STEPS = ['Annotate', 'Train RM', 'RL Loop', 'Evaluate'];

export function MarcusDemoModal({ open, onClose }: Props) {
  const navigate = useNavigate();

  const startDemo = () => {
    localStorage.setItem('rf_demo_mode', 'marcus');
    onClose();
    navigate('/annotate');
  };

  const exploreFree = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg rounded-xl p-8 shadow-2xl"
            style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 transition-colors"
              style={{ color: '#525252' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
            >
              <X size={16} />
            </button>

            {/* Badge */}
            <div className="flex justify-center mb-5">
              <span
                className="font-mono text-[11px] px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(56,189,248,0.1)',
                  border: '1px solid rgba(56,189,248,0.2)',
                  color: '#38bdf8',
                }}
              >
                🎯 Interactive Demo
              </span>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: '#38bdf8', color: '#000', fontSize: 20, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}
              >
                MC
              </div>
            </div>

            {/* Name / role */}
            <div className="text-center mb-1">
              <h2 className="font-syne font-bold text-[20px] text-[#fafafa]">Marcus Chen</h2>
            </div>
            <p className="text-center font-mono text-[13px] mb-4" style={{ color: '#525252' }}>
              CTO · LexAI · Series A
            </p>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #1a1a1a', marginBottom: 16 }} />

            {/* Description */}
            <p className="text-center text-[14px] leading-[1.7] mb-5" style={{ color: '#a3a3a3' }}>
              Marcus is building an AI legal assistant for small business owners on LLaMA 3. His raw model gives 347-word citation-heavy answers full of legal jargon. His users need plain English.
              <br /><br />
              Follow his complete RLHF journey — from annotation to production-ready aligned model.
            </p>

            {/* Pipeline steps */}
            <div className="flex items-center justify-center gap-1 mb-6 flex-wrap">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-1">
                  <span
                    className="font-mono text-[11px] px-2.5 py-1 rounded-full"
                    style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}
                  >
                    {step}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="font-mono text-[10px]" style={{ color: '#2a2a2a' }}>→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={startDemo}
                className="w-full py-3 rounded-lg font-syne font-semibold text-sm transition-opacity hover:opacity-88"
                style={{ background: '#fafafa', color: '#000' }}
              >
                Start Marcus's demo →
              </button>
              <button
                onClick={exploreFree}
                className="w-full py-3 rounded-lg font-syne font-semibold text-sm transition-colors"
                style={{ background: 'transparent', border: '1px solid #333', color: '#525252' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
              >
                Explore freely
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
