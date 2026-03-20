import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoMark, Wordmark } from '@/components/Logo';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';

const PRODUCT_ITEMS = [
  { label: 'Annotation Interface', path: '/annotate' },
  { label: 'Reward Model Training', path: '/train-rm' },
  { label: 'RL Fine-Tuning', path: '/rl-loop' },
  { label: 'Evaluation & Export', path: '/evaluate' },
];

export function MarketingNav() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [productOpen, setProductOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);

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
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-12"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a' }}
    >
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
  );
}

export function BackLink() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center gap-1.5 font-mono transition-all group"
      style={{ color: '#525252', fontSize: '13px' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
    >
      ← RewardForge
    </button>
  );
}
