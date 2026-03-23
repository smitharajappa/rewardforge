import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoMark, Wordmark } from '@/components/Logo';
import { ArrowRight, MessageSquare, Cpu, RefreshCw, Sparkles, Package, Bot, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { MarcusDemoModal } from '@/components/MarcusDemoModal';

const FEATURES = [
  { icon: MessageSquare, color: '#38bdf8', title: 'Pairwise Annotation', desc: 'Compare AI response pairs with keyboard shortcuts. Collect human preference data in under 60 seconds.' },
  { icon: Cpu, color: '#f472b6', title: 'No-Code RM Training', desc: 'Train reward models on GPT-2, LLaMA, or Mistral. Watch live W&B-style loss curves animate in real time.' },
  { icon: RefreshCw, color: '#34d399', title: 'PPO · GRPO · DPO', desc: 'Launch RL fine-tuning with any algorithm. Compare runs side by side in a GitHub-style diff view.' },
  { icon: Sparkles, color: '#a78bfa', title: 'AI Copilot', desc: 'Ask anything about your training run in plain English. Streamed responses, Perplexity-style, with context.' },
  { icon: Package, color: '#38bdf8', title: 'Model Registry', desc: 'Every reward model versioned and stored. Export to HuggingFace Hub in one click.' },
  { icon: Bot, color: '#f472b6', title: 'AI-Generated Pairs', desc: 'Auto-generate response pairs via Claude API. First comparison in under 60 seconds from signup.' },
];

const MODELS = ['LLaMA 3', 'Mistral 7B', 'Gemma', 'Falcon', 'Qwen'];

const PRODUCT_ITEMS = [
  { label: 'Annotation Interface', path: '/annotate' },
  { label: 'Reward Model Training', path: '/train-rm' },
  { label: 'RL Fine-Tuning', path: '/rl-loop' },
  { label: 'Evaluation & Export', path: '/evaluate' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [productOpen, setProductOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleGetStarted = () => {
    const useCase = localStorage.getItem('rf_use_case');
    const isDemoMode = localStorage.getItem('rf_demo_mode') === 'marcus';
    if (isDemoMode) { navigate('/dashboard'); return; }
    navigate(useCase ? '/dashboard' : '/onboarding');
  };
  const productRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (productRef.current && !productRef.current.contains(e.target as Node)) setProductOpen(false);
      if (signInRef.current && !signInRef.current.contains(e.target as Node)) setSignInOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAuthToast = () => {
    addToast({ type: 'info', message: 'Google auth launching soon — join waitlist at rewardforge.ai' });
    setSignInOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: '#000', color: '#fafafa', fontFamily: 'Syne, sans-serif' }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-12"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer" style={{ textDecoration: 'none' }}>
          <LogoMark size={26} />
          <Wordmark size="sm" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {/* Product dropdown */}
          <div ref={productRef} className="relative">
            <button
              onClick={() => setProductOpen(v => !v)}
              className="flex items-center gap-1 text-xs font-syne font-semibold transition-colors"
              style={{ color: productOpen ? '#a3a3a3' : '#525252' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = productOpen ? '#a3a3a3' : '#525252'}
            >
              Product <ChevronDown size={11} className={`transition-transform ${productOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {productOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-8 left-0 rounded-xl overflow-hidden shadow-2xl min-w-[200px]"
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', zIndex: 100 }}
                >
                  {PRODUCT_ITEMS.map(item => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setProductOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-syne transition-colors"
                      style={{ color: '#a3a3a3', borderBottom: '1px solid #0f0f0f' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fafafa'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/docs" className="text-xs font-syne font-semibold transition-colors" style={{ color: '#525252', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}>
            Docs
          </Link>
          <Link to="/pricing" className="text-xs font-syne font-semibold transition-colors" style={{ color: '#525252', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}>
            Pricing
          </Link>
          <Link to="/blog" className="text-xs font-syne font-semibold transition-colors" style={{ color: '#525252', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}>
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {/* Sign in dropdown */}
          <div ref={signInRef} className="relative">
            <button
              onClick={() => setSignInOpen(v => !v)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
              style={{ border: '1px solid #1a1a1a', color: '#a3a3a3' }}
            >
              Sign in
            </button>
            <AnimatePresence>
              {signInOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-9 right-0 rounded-xl overflow-hidden shadow-2xl min-w-[200px]"
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', zIndex: 100 }}
                >
                  <button onClick={handleAuthToast}
                    className="w-full text-left px-4 py-3 text-xs font-syne transition-colors"
                    style={{ color: '#a3a3a3', borderBottom: '1px solid #0f0f0f' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fafafa'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}>
                    Continue with Google
                  </button>
                  <button onClick={handleAuthToast}
                    className="w-full text-left px-4 py-3 text-xs font-syne transition-colors"
                    style={{ color: '#a3a3a3' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fafafa'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}>
                    Continue with email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => navigate('/dashboard')}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-88 flex items-center gap-1.5 cursor-pointer"
            style={{ background: '#fafafa', color: '#000' }}>
            Get started <ArrowRight size={12} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-28 px-6 text-center overflow-hidden bg-grid-main">
        {/* Radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 65%)' }} />
        <div className="absolute top-20 left-0 w-[400px] h-[350px] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse, rgba(244,114,182,0.07) 0%, transparent 70%)' }} />
        <div className="absolute top-20 right-0 w-[350px] h-[300px] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Beta badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse inline-block" />
            <span className="font-mono text-[10px]" style={{ color: '#a3a3a3' }}>Now in beta · rewardforge.ai</span>
          </div>

          {/* Logo mark */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="flex justify-center mb-5">
            <LogoMark size={64} />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="font-syne font-extrabold text-[42px] leading-[1.08] tracking-[-0.03em] mb-4">
            Align your AI.<br />
            Forge better <span style={{ color: '#f472b6' }}>models.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[14px] leading-relaxed mb-7 mx-auto max-w-[480px]" style={{ color: '#525252' }}>
            The end-to-end RLHF platform that takes your raw model to production-ready in hours — not months. Annotation, reward model training, and RL fine-tuning. One workspace.
          </motion.p>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.18 }}
            className="flex items-center justify-center gap-2.5">
          <button onClick={() => {
              const hasUseCase = localStorage.getItem('rf_use_case');
              navigate(hasUseCase ? '/dashboard' : '/onboarding');
            }}
            className="px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-opacity hover:opacity-88 cursor-pointer"
            style={{ background: '#fafafa', color: '#000', borderRadius: '9999px' }}>
            <LogoMark size={16} /> Start for free →
          </button>
            <button onClick={() => setDemoModalOpen(true)}
              className="px-5 py-2.5 text-sm font-bold transition-all cursor-pointer"
              style={{ border: '1px solid #1a1a1a', color: '#fafafa', background: 'transparent', borderRadius: '9999px' }}>
              View live demo →
            </button>
          </motion.div>

          {/* Browser mockup */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 mx-auto max-w-[680px] rounded-xl overflow-hidden relative"
            style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent)' }} />
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
              <div className="flex gap-1.5">
                {['#f43f5e', '#f59e0b', '#34d399'].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
              </div>
              <div className="flex-1 mx-3 px-3 py-1 rounded text-center font-mono text-[10px]" style={{ background: '#000', border: '1px solid #1a1a1a', color: '#333' }}>
                rewardforge.ai/dashboard
              </div>
            </div>
            <div className="flex" style={{ height: 200 }}>
              <div className="w-[110px] flex flex-col py-3 px-2 gap-1.5 shrink-0" style={{ borderRight: '1px solid #1a1a1a' }}>
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <LogoMark size={16} />
                  <span className="font-syne font-bold text-[10px]" style={{ color: '#38bdf8' }}>Reward</span>
                </div>
                {[['Dashboard', true], ['Annotate', false], ['Train RM', false], ['RL Loop', false], ['Evaluate', false]].map(([l, active]) => (
                  <div key={l as string} className="px-2 py-1 rounded text-[9px] font-syne" style={{ background: active ? '#111' : 'transparent', color: active ? '#fafafa' : '#333', borderLeft: active ? '2px solid #38bdf8' : '2px solid transparent' }}>{l as string}</div>
                ))}
              </div>
              <div className="flex-1 p-3 bg-grid-main relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(56,189,248,0.06) 0%, transparent 60%)' }} />
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {['#38bdf8', '#f472b6', '#34d399', '#a78bfa'].map((c, i) => (
                    <div key={i} className="rounded p-1.5" style={{ background: '#111', border: `1px solid ${c}25` }}>
                      <div className="text-[9px] font-syne font-bold" style={{ color: c }}>—</div>
                      <div className="h-0.5 rounded mt-1" style={{ background: '#1a1a1a', width: '60%' }} />
                    </div>
                  ))}
                </div>
                <div className="rounded p-2 flex items-end gap-0.5" style={{ background: '#111', border: '1px solid #1a1a1a', height: 90 }}>
                  {Array.from({ length: 14 }, (_, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{ background: i % 2 === 0 ? '#38bdf8' : '#f472b6', opacity: 0.6, height: `${30 + Math.sin(i) * 25 + 25}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid #0f0f0f' }}>
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-center mb-3" style={{ color: '#38bdf8' }}>PLATFORM FEATURES</p>
          <h2 className="font-syne font-extrabold text-2xl text-center text-[#fafafa] mb-1">Everything RLHF. One platform.</h2>
          <p className="text-sm text-center mb-10" style={{ color: '#525252' }}>No glue code. No PhD required.</p>
          <div className="grid grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-xl relative overflow-hidden transition-all cursor-default"
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'}>
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: `${f.color}18` }}>
                  <f.icon size={16} style={{ color: f.color }} />
                </div>
                <h3 className="font-syne font-bold text-sm text-[#fafafa] mb-2">{f.title}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: '#525252' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <div className="py-6 flex flex-col items-center gap-3" style={{ borderTop: '1px solid #0f0f0f' }}>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: '#333' }}>USED WITH MODELS LIKE</p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {MODELS.map(m => (
            <span key={m} className="font-mono text-[10px] px-3 py-1 rounded-md" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#333' }}>{m}</span>
          ))}
        </div>
      </div>

      {/* Bottom CTA — ONE button only */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto relative p-8 rounded-xl text-center overflow-hidden"
          style={{ background: '#050d1a', border: '1px solid rgba(56,189,248,0.12)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(56,189,248,0.07) 0%, transparent 65%)' }} />
          <div className="relative z-10">
            <h2 className="font-syne font-extrabold text-[22px] text-[#fafafa] mb-2">Start forging aligned models today.</h2>
            <p className="text-sm mb-6" style={{ color: '#525252' }}>Free plan. 1,000 comparisons. 3 training runs. No CC.</p>
            <button onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-88 cursor-pointer"
              style={{ background: '#fafafa', color: '#000', borderRadius: '9999px' }}>
              Get started →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #1a1a1a' }}>
        <Link to="/" className="flex items-center gap-2 cursor-pointer" style={{ textDecoration: 'none' }}>
          <LogoMark size={18} />
          <span className="font-mono text-[10px]" style={{ color: '#333' }}>© 2026 RewardForge</span>
        </Link>
        <div className="flex items-center gap-4">
          <a href="#" className="font-mono text-[10px] transition-colors" style={{ color: '#333' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}>Privacy</a>
          <a href="#" className="font-mono text-[10px] transition-colors" style={{ color: '#333' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}>Terms</a>
          <Link to="/docs" className="font-mono text-[10px] transition-colors" style={{ color: '#333', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}>Docs</Link>
          <a href="https://github.com/smitharajappa/rewardforge" target="_blank" rel="noopener noreferrer"
            className="font-mono text-[10px] transition-colors" style={{ color: '#333' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}>GitHub</a>
        </div>
      </footer>

      {/* Marcus Demo Modal */}
      <MarcusDemoModal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}
