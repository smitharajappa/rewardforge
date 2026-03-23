import { motion } from 'framer-motion';
import { MarketingNav } from '@/components/MarketingNav';
import { BlogBackLink } from '@/components/BlogBackLink';

export default function RewardHackingArticle() {
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
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
              Best Practices
            </span>
            <span className="font-mono text-[9px]" style={{ color: '#333' }}>March 5, 2026 · 6 min read</span>
          </div>

          {/* Title */}
          <h1 className="font-syne font-extrabold text-[36px] leading-tight tracking-tight text-[#fafafa] mb-4">
            Reward hacking: how to detect and prevent it
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] leading-relaxed mb-8" style={{ color: '#525252' }}>
            When your reward model learns the wrong thing, your policy exploits it. Responses get longer or more sycophantic — and your model gets worse, not better. Here's how to catch it early.
          </p>

          <div style={{ borderBottom: '1px solid #1a1a1a', marginBottom: 40 }} />

          {/* Body */}
          <div className="space-y-10" style={{ fontSize: 16, lineHeight: 1.8, color: '#a3a3a3' }}>
            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">What is reward hacking?</h2>
              <p>
                Reward hacking happens when your policy model discovers that it can get high reward scores without actually producing better responses. Common patterns: responses get longer because longer responses score higher, the model adds excessive praise to every answer, outputs become repetitive or formulaic, or the model generates confident-sounding text regardless of accuracy.
              </p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">Why it happens</h2>
              <p>
                Your reward model is an approximation of human preference — not a perfect measure. It was trained on a limited set of examples and has blind spots. A smart enough policy will find those blind spots and exploit them. This is why KL divergence monitoring is critical: it measures how far your model has drifted from its original behavior.
              </p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">The KL divergence guardrail</h2>
              <p>
                KL divergence quantifies how different your current policy is from the reference policy (the base model before training). When it climbs above 0.15, your model is drifting significantly. When it exceeds 0.3, you likely have reward hacking. The β (beta) parameter in PPO controls this — higher β means the model stays closer to the original but learns less. We recommend starting with β=0.1 and monitoring your charts.
              </p>
            </section>

            <section>
              <h2 className="font-syne font-bold text-[22px] text-[#fafafa] mb-4">Practical prevention</h2>
              <p>
                Three things that prevent reward hacking in practice: normalize output length so longer responses don't automatically score higher, use diverse prompts during training so the model can't over-optimize on a narrow distribution, and check your reward model accuracy — if it's below 80%, your reward model itself is the problem and you need more annotation data before training.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
