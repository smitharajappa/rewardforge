import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Zap, BookOpen, Plug } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MarketingNav, BackLink } from '@/components/MarketingNav';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LS_KEY = 'rf_waitlist_email';

export default function DocsPage() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');

  // Check localStorage for prior submission
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      setSubmitted(true);
      setSavedEmail(stored);
    }
  }, []);

  const handleJoin = () => {
    setEmailError('');
    if (!EMAIL_RE.test(waitlistEmail.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }
    localStorage.setItem(LS_KEY, waitlistEmail.trim());
    setSavedEmail(waitlistEmail.trim());
    setSubmitted(true);
    addToast({ type: 'success', message: "You're on the list! ✓" });
    setWaitlistEmail('');
  };

  const steps = [
    { label: 'Go to Annotate — collect 5 pairwise comparisons', path: '/annotate' },
    { label: 'Go to Train RM — click Start Training', path: '/train-rm' },
    { label: 'Go to RL Loop — launch PPO or DPO run', path: '/rl-loop' },
    { label: 'Go to Evaluate — compare results and export model', path: '/evaluate' },
  ];

  const concepts = [
    {
      term: 'What is RLHF?',
      def: 'Reinforcement Learning from Human Feedback — the 3-stage process that turns a raw model into a trustworthy, production-ready AI.',
    },
    {
      term: 'What is a reward model?',
      def: 'A neural network trained on your preference data that learns to score AI responses. Higher score = better response for your use case.',
    },
    {
      term: 'What is KL divergence?',
      def: 'A safety guardrail measuring how far your model has drifted from its original behavior. Keep β = 0.1 for best results.',
    },
    {
      term: 'PPO vs DPO',
      def: 'PPO: stable, works for most cases. DPO: faster and simpler, trains directly on preference pairs without a separate RL loop.',
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: '#000', color: '#fafafa', fontFamily: 'Syne, sans-serif' }}
    >
      <MarketingNav />

      <div className="max-w-[800px] mx-auto px-6 py-10">
        {/* Back link */}
        <div className="mb-8">
          <BackLink />
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-syne font-extrabold text-4xl tracking-tight text-[#fafafa] mb-3">
            Documentation
          </h1>
          <p className="font-mono text-sm" style={{ color: '#525252' }}>
            Everything you need to align your AI model.
          </p>
        </div>

        {/* Card 1 — Quick Start */}
        <div
          className="rounded-xl p-6 mb-4"
          style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <Zap size={16} style={{ color: '#38bdf8' }} />
            <h2 className="font-syne font-bold text-base text-[#fafafa]">Quick Start (5 minutes)</h2>
          </div>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-3 rounded-lg"
                style={{ background: '#000', border: '1px solid #111' }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm" style={{ color: '#a3a3a3' }}>{step.label}</span>
                </div>
                <button
                  onClick={() => navigate(step.path)}
                  className="font-mono text-[10px] px-3 py-1.5 rounded-full transition-all shrink-0 ml-4"
                  style={{ border: '1px solid #1a1a1a', color: '#525252' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#38bdf8'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(56,189,248,0.4)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#525252'; (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'; }}
                >
                  → Go
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2 — Core Concepts */}
        <div
          className="rounded-xl p-6 mb-4"
          style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <BookOpen size={16} style={{ color: '#f472b6' }} />
            <h2 className="font-syne font-bold text-base text-[#fafafa]">Core Concepts</h2>
          </div>
          <div className="space-y-0">
            {concepts.map((c, i) => (
              <div
                key={i}
                className="py-4"
                style={{ borderBottom: i < concepts.length - 1 ? '1px solid #111' : 'none' }}
              >
                <div className="font-syne font-bold text-sm mb-1" style={{ color: '#38bdf8' }}>
                  {c.term}
                </div>
                <div className="text-sm leading-relaxed" style={{ color: '#525252' }}>
                  {c.def}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3 — API Reference */}
        <div
          className="rounded-xl p-6 mb-4"
          style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <Plug size={16} style={{ color: '#34d399' }} />
            <h2 className="font-syne font-bold text-base text-[#fafafa]">API Reference</h2>
          </div>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: '#525252' }}>
            Full REST API docs launching with our backend in Q2 2026. Join the waitlist for early access.
          </p>

          {submitted ? (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-lg"
              style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}
            >
              <span style={{ color: '#34d399' }}>✓</span>
              <span className="text-sm" style={{ color: '#a3a3a3' }}>
                We'll email you at <span style={{ color: '#fafafa' }}>{savedEmail}</span> when API docs launch in Q2 2026.
              </span>
            </div>
          ) : (
            <>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={e => { setWaitlistEmail(e.target.value); setEmailError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleJoin()}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{
                      background: '#000',
                      border: emailError ? '1px solid #ef4444' : '1px solid #1a1a1a',
                      color: '#fafafa',
                    }}
                    onFocus={e => { if (!emailError) e.currentTarget.style.borderColor = '#38bdf8'; }}
                    onBlur={e => { if (!emailError) e.currentTarget.style.borderColor = '#1a1a1a'; }}
                  />
                  {emailError && (
                    <p className="mt-1.5 font-mono" style={{ color: '#ef4444', fontSize: '12px' }}>
                      {emailError}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleJoin}
                  className="px-5 py-2.5 rounded-lg font-syne font-bold text-sm transition-opacity hover:opacity-90 shrink-0 self-start"
                  style={{ background: '#fafafa', color: '#000' }}
                >
                  Join waitlist →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
