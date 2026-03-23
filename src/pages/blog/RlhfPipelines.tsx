import { motion } from 'framer-motion';
import { MarketingNav } from '@/components/MarketingNav';
import { BlogBackLink } from '@/components/BlogBackLink';

export default function RlhfPipelinesArticle() {
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
              style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8' }}>
              Tutorial
            </span>
            <span className="font-mono text-[9px]" style={{ color: '#333' }}>March 15, 2026 · 6 min read</span>
          </div>

          {/* Title */}
          <h1 className="font-syne font-extrabold text-[36px] leading-tight tracking-tight text-[#fafafa] mb-4">
            Building RLHF pipelines with open-source models
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] leading-relaxed mb-8" style={{ color: '#525252' }}>
            LLaMA 3, Mistral, and Gemma have made powerful base models free. But raw models hallucinate, harm, and fail. Here's how to build a complete RLHF pipeline — and why RewardForge makes it 10x faster.
          </p>

          <div style={{ borderBottom: '1px solid #1a1a1a', marginBottom: 40 }} />

          {/* Body */}
          <div className="space-y-10" style={{ fontSize: 16, lineHeight: 1.8, color: '#a3a3a3' }}>
            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">Why raw models aren't production-ready</h2>
              <p>
                Raw language models know how to generate text but have no concept of what your users actually need. A base LLaMA 3 model will answer legal questions with a wall of citations, explain medical symptoms without recommending a doctor, and give financial advice without any disclaimers. Before you can ship AI to real users, you need to align it to your specific use case.
              </p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">The 3 stages of RLHF</h2>
              <p className="mb-4">
                <strong style={{ color: '#fafafa' }}>Stage 1 — Preference collection:</strong> Show the same prompt to domain experts with two different AI responses. Ask which response better serves your users. 50–200 of these comparisons creates a preference dataset that encodes human judgment.
              </p>
              <p className="mb-4">
                <strong style={{ color: '#fafafa' }}>Stage 2 — Reward model training:</strong> Train a small neural network on your preference data. This model learns what good looks like for your specific use case. It can score any AI response — giving you a mathematical representation of your team's professional judgment.
              </p>
              <p>
                <strong style={{ color: '#fafafa' }}>Stage 3 — RL fine-tuning:</strong> Use the reward model to improve your base model. The policy generates responses, the reward model scores them, and PPO/DPO updates the weights to produce higher-scoring outputs. After 500 steps your model responds the way your team would.
              </p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">The traditional approach takes 3 months</h2>
              <p>
                Before platforms like RewardForge, building this pipeline meant: setting up Label Studio for annotation, writing custom data pipelines to format preference pairs, configuring HuggingFace TRL for reward model training, debugging CUDA errors on expensive GPU hardware, and writing PPO training loops from scratch. Most teams spent 3–6 months and $75,000–150,000 in engineering time before seeing any results.
              </p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">RewardForge reduces this to 6 hours</h2>
              <p>
                Upload your practice documents. Your team annotates 10 prompts in an afternoon. One button trains the reward model automatically. Watch the reward chart climb. Export your aligned model to HuggingFace. The entire pipeline runs in a single afternoon, not six months.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
