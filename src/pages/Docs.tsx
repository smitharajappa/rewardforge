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
    {
      label: 'Select your use case',
      desc: "Tell RewardForge what you're building — legal, medical, financial, or other. We personalize your prompts and Copilot for your specific domain automatically.",
      path: '/onboarding',
    },
    {
      label: 'Upload your practice documents',
      desc: "Upload your firm's FAQ, intake forms, or client emails. We extract your real client questions and generate AI response pairs from YOUR actual practice. Your data never leaves your browser.",
      path: '/annotate',
    },
    {
      label: 'Annotate AI responses',
      desc: 'Compare two AI responses and pick which one better serves your clients. No ML knowledge needed — just your professional judgment. 10 comparisons takes 15 minutes.',
      path: '/annotate',
    },
    {
      label: 'Train your reward model',
      desc: 'One button trains your AI on your preferences. RewardForge automatically selects the right model and settings. Takes about 2 minutes.',
      path: '/train-rm',
    },
    {
      label: 'Launch RL fine-tuning',
      desc: 'Run PPO, GRPO, or DPO to align your AI to your professional standards. Watch the reward score climb in real time.',
      path: '/rl-loop',
    },
    {
      label: 'Export your alignment certificate',
      desc: "Get your official compliance certificate with your experts' credentials, quality score, and complete audit trail. Share with regulators, insurers, and clients.",
      path: '/evaluate',
    },
  ];

  const concepts = [
    {
      term: 'What is RLHF?',
      def: 'Reinforcement Learning from Human Feedback — the 3-stage process that turns a raw model into a trustworthy, production-ready AI.',
    },
    {
      term: 'What is a reward model?',
      def: "A small neural network trained on your team's preferences. It learns what 'good' means for your specific use case and scores AI responses accordingly. After training on 200+ comparisons, it can rank responses nearly as well as a human expert in your field.",
    },
    {
      term: 'What is the alignment certificate?',
      def: "An automatically generated compliance document showing who trained your AI, what professional standards were applied, and how quality improved from before to after training. Your licensed professionals' names and credentials appear on it — not ours. Designed for bar associations, malpractice insurers, and regulatory audits.",
    },
    {
      term: 'What is KL divergence?',
      def: 'A safety guardrail measuring how far your model has drifted from its original behavior. Keep β = 0.1 for best results.',
    },
    {
      term: 'PPO vs DPO',
      def: 'PPO: stable, works for most cases. DPO: faster and simpler, trains directly on preference pairs without a separate RL loop.',
    },
    {
      term: 'Why does private training matter?',
      def: "Your client data stays in your browser during document upload and prompt generation. No third party sees your practice documents or client questions. Attorney-client privilege, HIPAA, and FINRA requirements are preserved by architecture — not just policy.",
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
            <h2 className="font-syne font-bold text-base text-[#fafafa]">Quick Start (6 minutes)</h2>
          </div>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start justify-between py-3 px-3 rounded-lg gap-4"
                style={{ background: '#000', border: '1px solid #111' }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-syne font-semibold mb-1" style={{ color: '#fafafa' }}>{step.label}</div>
                    <div className="text-[12px] leading-relaxed" style={{ color: '#525252' }}>{step.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(step.path)}
                  className="font-mono text-[10px] px-3 py-1.5 rounded-full transition-all shrink-0"
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
                You're on the list! We'll reach out when API docs launch in Q2 2026. ✓
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
