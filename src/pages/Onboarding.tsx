import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogoMark, Wordmark } from '@/components/Logo';

const USE_CASES = [
  { id: 'legal', emoji: '⚖️', label: 'Legal Services', desc: 'Law firms, attorneys, legal assistants' },
  { id: 'medical', emoji: '🏥', label: 'Medical & Health', desc: 'Clinics, doctors, health platforms' },
  { id: 'financial', emoji: '💰', label: 'Financial Services', desc: 'Advisors, banks, fintech' },
  { id: 'customer_service', emoji: '🎧', label: 'Customer Service', desc: 'Support bots, CX teams, e-commerce' },
  { id: 'education', emoji: '📚', label: 'Education', desc: 'Tutors, schools, learning platforms' },
  { id: 'developer', emoji: '⚙️', label: 'Developer / Other', desc: 'Technical teams, open-source, research' },
] as const;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const existingUseCase = localStorage.getItem('rf_use_case');
  const isReturning = !!existingUseCase;

  const [selected, setSelected] = useState<string | null>(existingUseCase);

  const handleContinue = () => {
    if (!selected) return;
    localStorage.setItem('rf_use_case', selected);
    const returnPath = localStorage.getItem('rf_return_path') || '/dashboard';
    localStorage.removeItem('rf_return_path');
    navigate(returnPath);
  };

  const handleSkip = () => {
    localStorage.setItem('rf_use_case', 'developer');
    const returnPath = localStorage.getItem('rf_return_path') || '/dashboard';
    localStorage.removeItem('rf_return_path');
    navigate(returnPath);
  };

  return (
    <div className="min-h-screen bg-grid-main flex flex-col" style={{ background: '#000', color: '#fafafa' }}>
      {/* Radial glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 65%)' }} />

      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-12"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a' }}>
        <div className="flex items-center gap-2">
          <LogoMark size={26} />
          <Wordmark size="sm" />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[600px]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-center mb-8">
            <h1 className="font-syne font-extrabold text-[32px] tracking-tight text-[#fafafa] mb-3">
              {isReturning ? 'Switch your use case' : 'What are you aligning AI for?'}
            </h1>
            <p className="font-mono text-[15px] leading-relaxed" style={{ color: '#525252' }}>
              We'll personalize your prompts and Copilot for your specific use case.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-2 gap-3 mb-8"
          >
            {USE_CASES.map((uc, i) => (
              <motion.button
                key={uc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                onClick={() => setSelected(uc.id)}
                className="text-left p-5 rounded-xl transition-all duration-120"
                style={{
                  background: selected === uc.id ? 'rgba(56,189,248,0.05)' : '#0a0a0a',
                  border: selected === uc.id ? '2px solid #38bdf8' : '1px solid #1a1a1a',
                  cursor: 'pointer',
                }}
              >
                <div className="text-2xl mb-2">{uc.emoji}</div>
                <div className="font-syne font-bold text-sm text-[#fafafa] mb-1">{uc.label}</div>
                <div className="font-mono text-[11px]" style={{ color: '#525252' }}>{uc.desc}</div>
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={handleContinue}
              disabled={!selected}
              className="px-8 py-3 rounded-lg font-syne font-bold text-sm transition-all"
              style={{
                background: selected ? '#fafafa' : '#1a1a1a',
                color: selected ? '#000' : '#525252',
                opacity: selected ? 1 : 0.4,
                cursor: selected ? 'pointer' : 'not-allowed',
              }}
            >
              {isReturning ? 'Update use case →' : 'Continue →'}
            </button>
            {!isReturning && (
              <button
                onClick={handleSkip}
                className="font-mono text-[12px] transition-colors"
                style={{ color: '#333' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}
              >
                Skip for now →
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
