import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { MarketingNav, BackLink } from '@/components/MarketingNav';

// ── Individual plans ──────────────────────────────────────────
const FREE_FEATURES = [
  { text: '1 user', ok: true },
  { text: '1,000 comparisons/month', ok: true },
  { text: '1 training run/month', ok: true },
  { text: '1 RL run/month', ok: true },
  { text: 'Export dataset as CSV', ok: true },
  { text: 'AI Copilot (10 messages/day)', ok: true },
  { text: 'API access', ok: false },
  { text: 'Priority GPU compute', ok: false },
];

const STARTER_FEATURES = [
  { text: '3 users', ok: true },
  { text: '10,000 comparisons/month', ok: true },
  { text: '3 training runs/month included', ok: true },
  { text: '5 RL runs/month', ok: true },
  { text: '5 GPU hours included', ok: true },
  { text: 'Extra compute: $3.50/GPU hour', ok: true },
  { text: 'Email support', ok: true },
  { text: 'API access', ok: false },
];

const GROWTH_FEATURES = [
  { text: '10 users', ok: true },
  { text: '100,000 comparisons/month', ok: true },
  { text: '10 training runs/month included', ok: true },
  { text: '20 GPU hours included', ok: true },
  { text: 'Extra compute: $3.50/GPU hour', ok: true },
  { text: 'PPO + GRPO + DPO algorithms', ok: true },
  { text: 'API access', ok: true },
  { text: 'Priority email support', ok: true },
];

// ── Team plans ────────────────────────────────────────────────
const PRO_FEATURES = [
  { text: 'Seat-based billing — pay for what you use', ok: true },
  { text: 'Priority GPU compute (no queue)', ok: true },
  { text: 'Custom model support', ok: true },
  { text: 'Slack support channel', ok: true },
  { text: 'Central billing dashboard', ok: true },
  { text: 'Admin controls per seat', ok: true },
  { text: 'SSO support', ok: true },
];

const ENT_FEATURES = [
  { text: 'On-premise deployment', ok: true },
  { text: 'SSO + RBAC + SCIM', ok: true },
  { text: 'Audit logs + compliance', ok: true },
  { text: 'Network-level access control', ok: true },
  { text: 'Negotiated compute budget', ok: true },
  { text: 'SLA guarantees', ok: true },
  { text: 'Dedicated ML engineer', ok: true },
  { text: 'Custom data retention', ok: true },
];

const FAQS = [
  {
    q: 'Can I change plans anytime?',
    a: 'Yes — upgrade or downgrade at any time. Changes take effect immediately on your next billing cycle.',
  },
  {
    q: 'What counts as a training run?',
    a: 'One reward model training job OR one RL fine-tuning run (PPO, GRPO, or DPO). Each run uses GPU compute from your monthly allowance. Extra compute is billed at $3.50/GPU hour.',
  },
  {
    q: 'Do you offer annual discounts?',
    a: 'Yes — annual billing saves 17% across all plans. For teams above 100 seats, contact us for custom Enterprise pricing.',
  },
];

function FeatureRow({ text, ok }: { text: string; ok: boolean }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      {ok
        ? <Check size={12} style={{ color: '#34d399', marginTop: 1, flexShrink: 0 }} />
        : <X size={12} style={{ color: '#333', marginTop: 1, flexShrink: 0 }} />}
      <span style={{ color: ok ? '#a3a3a3' : '#333' }}>{text}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #1a1a1a' }}>
      <button
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen(v => !v)}
      >
        <span className="font-syne font-semibold text-sm text-[#fafafa]">{q}</span>
        <ChevronDown
          size={14}
          style={{ color: '#525252', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <p className="pb-4 text-sm leading-relaxed" style={{ color: '#525252' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [yearly, setYearly] = useState(false);
  const [tab, setTab] = useState<'individual' | 'team'>('individual');

  const billingToast = () => addToast({ type: 'info', message: 'Billing coming soon — join waitlist at rewardforge.ai' });

  return (
    <div className="min-h-screen" style={{ background: '#000', color: '#fafafa', fontFamily: 'Syne, sans-serif' }}>
      <MarketingNav />

      <div className="max-w-[1100px] mx-auto px-6 pt-6 pb-24">
        {/* Back link */}
        <div className="mb-8">
          <BackLink />
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-syne font-extrabold text-[36px] tracking-tight text-[#fafafa] mb-3">
            Plans that grow with you
          </h1>
          <p className="text-base" style={{ color: '#525252' }}>
            Start free. Scale as you grow. No credit card required.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
          <div
            className="flex items-center rounded-full p-1 gap-1"
            style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
          >
            <button
              onClick={() => setYearly(false)}
              className="px-5 py-1.5 rounded-full text-xs font-syne font-semibold transition-all"
              style={!yearly ? { background: '#fafafa', color: '#000' } : { color: '#525252' }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className="px-5 py-1.5 rounded-full text-xs font-syne font-semibold transition-all"
              style={yearly ? { background: '#fafafa', color: '#000' } : { color: '#525252' }}
            >
              Yearly · Save 17%
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-6" style={{ borderBottom: '1px solid #1a1a1a' }}>
            {(['individual', 'team'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="pb-3 text-sm font-syne font-semibold capitalize transition-all"
                style={{
                  color: tab === t ? '#fafafa' : '#525252',
                  borderBottom: tab === t ? '2px solid #38bdf8' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {t === 'individual' ? 'Individual' : 'Team & Enterprise'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'individual' ? (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* 3 individual cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* FREE */}
                <div
                  className="rounded-xl p-6 flex flex-col"
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
                >
                  <div className="mb-1 font-syne font-bold text-[22px] text-[#fafafa]">Free</div>
                  <div className="font-mono text-[10px] mb-5" style={{ color: '#525252' }}>For researchers and students</div>
                  <div className="flex items-end gap-1 mb-5">
                    <span className="font-syne font-extrabold text-[48px] leading-none text-[#fafafa]">$0</span>
                    <span className="font-mono text-xs mb-2" style={{ color: '#525252' }}>/month</span>
                  </div>
                  <div className="h-px mb-5" style={{ background: '#1a1a1a' }} />
                  <div className="space-y-2.5 flex-1 mb-6">
                    {FREE_FEATURES.map((f, i) => <FeatureRow key={i} {...f} />)}
                  </div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-2.5 rounded-lg font-syne font-semibold text-sm transition-opacity hover:opacity-80"
                    style={{ border: '1px solid #fafafa', color: '#fafafa', background: 'transparent' }}
                  >
                    Use RewardForge free
                  </button>
                </div>

                {/* STARTER */}
                <div
                  className="rounded-xl p-6 flex flex-col"
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
                >
                  <div className="mb-1 font-syne font-bold text-[22px] text-[#fafafa]">Starter</div>
                  <div className="font-mono text-[10px] mb-5" style={{ color: '#525252' }}>For solo founders</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-syne font-extrabold text-[48px] leading-none text-[#fafafa]">
                      {yearly ? '$83' : '$99'}
                    </span>
                    <span className="font-mono text-xs mb-2" style={{ color: '#525252' }}>/month</span>
                  </div>
                  {yearly && (
                    <p className="font-mono text-[10px] mb-4" style={{ color: '#525252' }}>billed $996/year</p>
                  )}
                  {!yearly && <div className="mb-4" />}
                  <div className="h-px mb-5" style={{ background: '#1a1a1a' }} />
                  <div className="space-y-2.5 flex-1 mb-6">
                    {STARTER_FEATURES.map((f, i) => <FeatureRow key={i} {...f} />)}
                  </div>
                  <button
                    onClick={billingToast}
                    className="w-full py-2.5 rounded-lg font-syne font-semibold text-sm transition-opacity hover:opacity-80"
                    style={{ border: '1px solid #fafafa', color: '#fafafa', background: 'transparent' }}
                  >
                    Get Starter Plan
                  </button>
                </div>

                {/* GROWTH */}
                <div
                  className="relative rounded-xl p-6 flex flex-col"
                  style={{ background: '#0a0a0a', border: '2px solid #38bdf8' }}
                >
                  {/* Most Popular badge — sits on the top border */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className="font-mono whitespace-nowrap px-3 py-1 rounded-full"
                      style={{ background: '#38bdf8', color: '#000', fontSize: '11px', fontWeight: 600 }}
                    >
                      Most Popular
                    </span>
                  </div>

                  <div className="mb-1 font-syne font-bold text-[22px] text-[#fafafa]">Growth</div>
                  <div className="font-mono text-[10px] mb-5" style={{ color: '#525252' }}>For funded startups</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-syne font-extrabold text-[48px] leading-none text-[#fafafa]">
                      {yearly ? '$415' : '$499'}
                    </span>
                    <span className="font-mono text-xs mb-2" style={{ color: '#525252' }}>/month</span>
                  </div>
                  {yearly && (
                    <p className="font-mono text-[10px] mb-4" style={{ color: '#525252' }}>billed $4,980/year</p>
                  )}
                  {!yearly && <div className="mb-4" />}
                  <div className="h-px mb-5" style={{ background: '#1a1a1a' }} />
                  <div className="space-y-2.5 flex-1 mb-6">
                    {GROWTH_FEATURES.map((f, i) => <FeatureRow key={i} {...f} />)}
                  </div>
                  <button
                    onClick={billingToast}
                    className="w-full py-2.5 rounded-lg font-syne font-semibold text-sm transition-opacity hover:opacity-90"
                    style={{ background: '#38bdf8', color: '#000' }}
                  >
                    Get Growth Plan
                  </button>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* 2 team/enterprise cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[760px] mx-auto">

                {/* PRO */}
                <div
                  className="rounded-xl p-6 flex flex-col"
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-syne font-bold text-[22px] text-[#fafafa]">Pro</div>
                    <span
                      className="font-mono text-[9px] px-2.5 py-1 rounded-full"
                      style={{ border: '1px solid #2a2a2a', color: '#525252' }}
                    >
                      10–100 users
                    </span>
                  </div>
                  <div className="font-mono text-[10px] mb-5" style={{ color: '#525252' }}>For Series A+ companies</div>

                  {/* Seat pricing boxes */}
                  <div className="space-y-2 mb-5">
                    <div className="rounded-lg p-4" style={{ background: '#000', border: '1px solid #1a1a1a' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-syne font-semibold text-sm text-[#fafafa]">Standard seat</span>
                        <span className="font-syne font-bold text-sm text-[#fafafa]">
                          {yearly ? '$149' : '$185'}<span className="font-mono text-[10px]" style={{ color: '#525252' }}>/seat/mo</span>
                        </span>
                      </div>
                      <p className="font-mono text-[10px]" style={{ color: '#525252' }}>
                        Full platform + 2 GPU hours/seat included
                      </p>
                      {yearly && (
                        <p className="font-mono text-[9px] mt-0.5" style={{ color: '#333' }}>$185/seat when billed monthly</p>
                      )}
                    </div>
                    <div className="rounded-lg p-4" style={{ background: '#000', border: '1px solid #1a1a1a' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-syne font-semibold text-sm text-[#fafafa]">Power seat</span>
                        <span className="font-syne font-bold text-sm text-[#fafafa]">
                          {yearly ? '$299' : '$375'}<span className="font-mono text-[10px]" style={{ color: '#525252' }}>/seat/mo</span>
                        </span>
                      </div>
                      <p className="font-mono text-[10px]" style={{ color: '#525252' }}>
                        5× GPU compute + priority queue
                      </p>
                      {yearly && (
                        <p className="font-mono text-[9px] mt-0.5" style={{ color: '#333' }}>$375/seat when billed monthly</p>
                      )}
                    </div>
                  </div>

                  <div className="h-px mb-4" style={{ background: '#1a1a1a' }} />
                  <p className="font-mono text-[10px] mb-3" style={{ color: '#525252' }}>All Growth features, plus:</p>
                  <div className="space-y-2.5 flex-1 mb-6">
                    {PRO_FEATURES.map((f, i) => <FeatureRow key={i} {...f} />)}
                  </div>
                  <button
                    onClick={() => addToast({ type: 'info', message: 'Contact us: hello@rewardforge.ai' })}
                    className="w-full py-2.5 rounded-lg font-syne font-semibold text-sm transition-opacity hover:opacity-80"
                    style={{ border: '1px solid #fafafa', color: '#fafafa', background: 'transparent' }}
                  >
                    Get Max Plan
                  </button>
                </div>

                {/* ENTERPRISE */}
                <div
                  className="rounded-xl p-6 flex flex-col"
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-syne font-bold text-[22px] text-[#fafafa]">Enterprise</div>
                    <span
                      className="font-mono text-[9px] px-2.5 py-1 rounded-full"
                      style={{ border: '1px solid #2a2a2a', color: '#525252' }}
                    >
                      20+ users
                    </span>
                  </div>
                  <div className="font-mono text-[10px] mb-5" style={{ color: '#525252' }}>For banks, healthcare, defense</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-syne font-extrabold text-[48px] leading-none italic text-[#fafafa]">Custom</span>
                  </div>
                  <p className="font-mono text-[10px] mb-5" style={{ color: '#525252' }}>Negotiated compute budget</p>
                  <div className="h-px mb-5" style={{ background: '#1a1a1a' }} />
                  <div className="space-y-2.5 flex-1 mb-6">
                    {ENT_FEATURES.map((f, i) => <FeatureRow key={i} {...f} />)}
                  </div>
                  <button
                    onClick={() => addToast({ type: 'info', message: 'Email us: hello@rewardforge.ai' })}
                    className="w-full py-2.5 rounded-lg font-syne font-semibold text-sm transition-opacity hover:opacity-80"
                    style={{ border: '1px solid #fafafa', color: '#fafafa', background: 'transparent' }}
                  >
                    Contact sales
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ */}
        <div className="max-w-[640px] mx-auto mt-20">
          <h2 className="font-syne font-bold text-xl text-[#fafafa] mb-6">Frequently asked questions</h2>
          {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>

        {/* Bottom CTA */}
        <p className="text-center font-mono text-xs mt-12" style={{ color: '#525252' }}>
          Questions? We reply within 24 hours.{' '}
          <a
            href="mailto:hello@rewardforge.ai"
            className="transition-colors"
            style={{ color: '#38bdf8', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
          >
            hello@rewardforge.ai
          </a>
        </p>
      </div>
    </div>
  );
}
