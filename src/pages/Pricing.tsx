import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For researchers and students',
    highlight: false,
    cta: 'Get started free',
    ctaAction: 'navigate',
    features: [
      { text: '1 user', included: true },
      { text: '1,000 comparisons/month', included: true },
      { text: '0 training runs', included: true },
      { text: 'Community support', included: true },
      { text: 'AI Copilot (5 messages/day)', included: true },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For solo founders',
    highlight: false,
    cta: 'Start Starter',
    ctaAction: 'billing',
    features: [
      { text: '3 users', included: true },
      { text: '10,000 comparisons/month', included: true },
      { text: '3 RM training runs/month', included: true },
      { text: '5 RL runs/month', included: true },
      { text: 'Email support', included: true },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Growth',
    price: '$499',
    period: '/month',
    description: 'For funded startups',
    highlight: true,
    cta: 'Start Growth',
    ctaAction: 'billing',
    features: [
      { text: '10 users', included: true },
      { text: '100,000 comparisons/month', included: true },
      { text: 'Unlimited training runs', included: true },
      { text: 'PPO + GRPO + DPO', included: true },
      { text: 'API access', included: true },
      { text: 'Priority email support', included: true },
    ],
  },
  {
    name: 'Pro',
    price: '$1,499',
    period: '/month',
    description: 'For Series A+ companies',
    highlight: false,
    cta: 'Start Pro',
    ctaAction: 'billing',
    features: [
      { text: 'Unlimited users', included: true },
      { text: 'Unlimited comparisons', included: true },
      { text: 'Priority GPU compute', included: true },
      { text: 'Custom model support', included: true },
      { text: 'Slack support channel', included: true },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For banks, healthcare, defense',
    highlight: false,
    cta: 'Contact sales',
    ctaAction: 'enterprise',
    features: [
      { text: 'On-premise deployment', included: true },
      { text: 'SSO + RBAC', included: true },
      { text: 'Audit logs + compliance', included: true },
      { text: 'SLA guarantees', included: true },
      { text: 'Dedicated ML engineer', included: true },
    ],
  },
];

const FAQS = [
  {
    q: 'Can I change plans anytime?',
    a: 'Yes — upgrade or downgrade at any time. Changes apply immediately.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The Free plan is free forever. No trial needed.',
  },
  {
    q: 'Do you offer annual discounts?',
    a: 'Yes — annual billing saves 20%. Contact us.',
  },
];

function PlanCard({ plan, onAction }: { plan: typeof PLANS[0]; onAction: (action: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl p-6 flex flex-col"
      style={{
        background: '#0a0a0a',
        border: plan.highlight ? '2px solid #38bdf8' : '1px solid #1a1a1a',
      }}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="font-mono text-[9px] px-3 py-1 rounded-full whitespace-nowrap"
            style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.4)', color: '#38bdf8' }}
          >
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="mb-5">
        <div className="font-syne font-bold text-base text-[#fafafa] mb-0.5">{plan.name}</div>
        <div className="font-mono text-[10px] mb-4" style={{ color: '#525252' }}>{plan.description}</div>
        <div className="flex items-end gap-1">
          <span className="font-syne font-extrabold text-3xl text-[#fafafa]">{plan.price}</span>
          {plan.period && <span className="font-mono text-xs mb-1" style={{ color: '#525252' }}>{plan.period}</span>}
        </div>
      </div>

      <div className="h-px mb-5" style={{ background: '#1a1a1a' }} />

      <div className="space-y-2.5 flex-1 mb-6">
        {plan.features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span style={{ color: f.included ? '#34d399' : '#333333' }}>{f.included ? '✓' : '✗'}</span>
            <span style={{ color: f.included ? '#a3a3a3' : '#333333' }}>{f.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onAction(plan.ctaAction)}
        className="w-full py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
        style={
          plan.highlight
            ? { background: '#38bdf8', color: '#000' }
            : { background: '#fafafa', color: '#000' }
        }
      >
        {plan.cta}
      </button>
    </motion.div>
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
          style={{ color: '#525252', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
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

  const handleAction = (action: string) => {
    if (action === 'navigate') navigate('/dashboard');
    else if (action === 'billing') addToast({ type: 'info', message: 'Billing coming soon' });
    else if (action === 'enterprise') addToast({ type: 'info', message: 'Email us: hello@rewardforge.ai' });
  };

  return (
    <div className="min-h-screen" style={{ background: '#000', color: '#fafafa', fontFamily: 'Syne, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-syne font-extrabold text-[36px] tracking-tight text-[#fafafa] mb-3">
            Plans that grow with you
          </h1>
          <p className="text-base" style={{ color: '#525252' }}>
            Start free. Upgrade when you're ready. No credit card required.
          </p>
        </div>

        {/* Plan cards — row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {PLANS.slice(0, 3).map(plan => (
            <PlanCard key={plan.name} plan={plan} onAction={handleAction} />
          ))}
        </div>

        {/* Plan cards — row 2 (2 centered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[720px] mx-auto mb-20">
          {PLANS.slice(3).map(plan => (
            <PlanCard key={plan.name} plan={plan} onAction={handleAction} />
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-syne font-bold text-xl text-[#fafafa] mb-6">Frequently asked questions</h2>
          <div>
            {FAQS.map(faq => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
