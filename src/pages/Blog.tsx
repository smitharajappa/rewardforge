import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MarketingNav, BackLink } from '@/components/MarketingNav';

const ARTICLES = [
  {
    tag: 'Tutorial', tagColor: '#38bdf8',
    title: 'Building RLHF pipelines with open-source models',
    date: 'March 15, 2026', read: '6 min read',
    preview: "LLaMA 3, Mistral, and Gemma have made powerful base models free. But raw models hallucinate, harm, and fail. Here's how to build a complete RLHF pipeline — and why RewardForge makes it 10x faster.",
    path: '/blog/rlhf-pipelines',
  },
  {
    tag: 'Deep Dive', tagColor: '#a78bfa',
    title: 'PPO vs DPO: when to use each algorithm',
    date: 'March 10, 2026', read: '5 min read',
    preview: "Proximal Policy Optimization and Direct Preference Optimization both align language models with human feedback — but they work very differently. Here's the decision framework we use with customers.",
    path: '/blog/ppo-vs-dpo',
  },
  {
    tag: 'Best Practices', tagColor: '#34d399',
    title: 'Reward hacking: how to detect and prevent it',
    date: 'March 5, 2026', read: '6 min read',
    preview: "When your reward model learns the wrong thing, your policy exploits it. Responses get longer or more sycophantic — and your model gets worse, not better. Here's how to catch it early.",
    path: '/blog/reward-hacking',
  },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email.trim()) return;
    addToast({ type: 'success', message: "You're subscribed! ✓" });
    setEmail('');
  };

  return (
    <div className="min-h-screen" style={{ background: '#000', color: '#fafafa', fontFamily: 'Syne, sans-serif' }}>
      <MarketingNav />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back link */}
        <div className="mb-8">
          <BackLink />
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-syne font-extrabold text-[32px] tracking-tight text-[#fafafa] mb-2">Blog</h1>
          <p className="font-mono text-[12px]" style={{ color: '#525252' }}>RLHF insights, tutorials, and best practices.</p>
        </motion.div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 gap-5 mb-16">
          {ARTICLES.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-[10px] transition-all duration-[120ms] cursor-default"
              style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[9px] px-2.5 py-1 rounded-full"
                      style={{ background: `${a.tagColor}18`, border: `1px solid ${a.tagColor}30`, color: a.tagColor }}>
                      {a.tag}
                    </span>
                    <span className="font-mono text-[9px]" style={{ color: '#333' }}>{a.date} · {a.read}</span>
                  </div>
                  <h2 className="font-syne font-bold text-[17px] text-[#fafafa] mb-2 leading-snug">{a.title}</h2>
                  <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#525252' }}>{a.preview}</p>
                  <button
                    onClick={handleArticle}
                    className="font-syne font-bold text-sm transition-opacity hover:opacity-80"
                    style={{ color: a.tagColor }}
                  >
                    Read article →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-8 rounded-xl text-center"
          style={{ background: '#050d1a', border: '1px solid rgba(56,189,248,0.12)' }}
        >
          <h3 className="font-syne font-bold text-lg text-[#fafafa] mb-1">Get RLHF insights in your inbox</h3>
          <p className="font-mono text-[11px] mb-5" style={{ color: '#525252' }}>No spam. Unsubscribe anytime.</p>
          <div className="flex items-center gap-2 max-w-sm mx-auto">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}
              onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
              onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'}
              onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
            />
            <button onClick={handleSubscribe}
              className="px-4 py-2.5 rounded-lg font-syne font-bold text-sm transition-opacity hover:opacity-88 whitespace-nowrap"
              style={{ background: '#fafafa', color: '#000' }}>
              Subscribe →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
