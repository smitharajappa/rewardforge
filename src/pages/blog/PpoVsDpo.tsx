import { motion } from 'framer-motion';
import { MarketingNav } from '@/components/MarketingNav';
import { BlogBackLink } from '@/components/BlogBackLink';

export default function PpoVsDpoArticle() {
  return (
    <div className="min-h-screen" style={{ background: '#000', color: '#fafafa', fontFamily: 'Syne, sans-serif' }}>
      <MarketingNav />
      <div className="max-w-[720px] mx-auto px-6 py-10">
        <div className="mb-8">
          <BlogBackLink />
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[9px] px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}>
              Deep Dive
            </span>
            <span className="font-mono text-[9px]" style={{ color: '#333' }}>March 10, 2026 · 5 min read</span>
          </div>

          {/* Title */}
          <h1 className="font-syne font-extrabold text-[36px] leading-tight tracking-tight text-[#fafafa] mb-4">
            PPO vs DPO: when to use each algorithm
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] leading-relaxed mb-8" style={{ color: '#525252' }}>
            Proximal Policy Optimization and Direct Preference Optimization both align language models with human feedback — but they work very differently. Here's the decision framework we use with customers.
          </p>

          <div style={{ borderBottom: '1px solid #1a1a1a', marginBottom: 40 }} />

          {/* Body */}
          <div className="space-y-10" style={{ fontSize: 16, lineHeight: 1.8, color: '#a3a3a3' }}>
            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">The core difference</h2>
              <p>
                PPO is an online reinforcement learning algorithm. It generates responses, scores them with a reward model, and updates the policy weights to produce higher-scoring outputs. This loop runs continuously during training. DPO is an offline algorithm — it trains directly on your preference pairs without needing a reward model in the training loop at all.
              </p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">When to use DPO</h2>
              <p>
                Choose DPO when: you have fewer than 500 preference pairs, you want faster training (DPO is 3–5x faster), you're aligning for style rather than capability, or you're running on limited compute. DPO is excellent for making AI sound like your brand — more concise, more direct, in your firm's voice.
              </p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">When to use PPO</h2>
              <p>
                Choose PPO when: you have 500+ high-quality preference pairs, you're working on reasoning tasks like math or code, you want the model to generalize to prompts it hasn't seen, or you need the highest possible quality. PPO's online training dynamics allow it to explore and discover better responses during training.
              </p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">Our recommendation</h2>
              <p>
                Start with DPO. It's faster, cheaper, and works well for most professional alignment use cases. If you're not satisfied with the quality after DPO training, switch to PPO with more data. RewardForge supports both algorithms with one-click switching — so you can try both and compare results in the Evaluate tab.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
