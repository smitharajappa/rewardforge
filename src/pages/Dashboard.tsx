import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, MessageSquare, Cpu, RefreshCw, CheckCircle2, Clock, BarChart2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '@/context/AppContext';
import { clearPipelineData } from '@/lib/clearPipelineData';
import { MarcusVerificationFlow } from '@/components/MarcusVerificationFlow';
import { AnimatePresence } from 'framer-motion';

const USE_CASE_META: Record<string, { emoji: string; label: string }> = {
  legal: { emoji: '⚖️', label: 'Legal Services' },
  medical: { emoji: '🏥', label: 'Medical & Health' },
  financial: { emoji: '💰', label: 'Financial Services' },
  customer_service: { emoji: '🎧', label: 'Customer Service' },
  education: { emoji: '📚', label: 'Education' },
  developer: { emoji: '⚙️', label: 'Developer / Other' },
};

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function StatCard({ label, value, displayValue, icon: Icon, color, trend, trendColor = '#525252', delay = 0 }: {
  label: string; value: number; displayValue?: string; icon: React.ElementType;
  color: string; trend: string; trendColor?: string; delay?: number;
}) {
  const count = useCountUp(value, 800);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="relative p-4 rounded-xl overflow-hidden group transition-all duration-150 cursor-default"
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div className="text-[26px] font-syne font-extrabold tracking-tight" style={{ color }}>
        {displayValue ?? count}
      </div>
      <div className="font-mono text-[9px] tracking-[0.06em] mt-1" style={{ color: '#525252' }}>{label}</div>
      <div className="text-[11px] mt-4 font-medium" style={{ color: trendColor }}>{trend}</div>
    </motion.div>
  );
}

const MOCK_CHART_DATA = Array.from({ length: 20 }, (_, i) => ({
  step: i + 1,
  PPO: +(0.4 + i * 0.12 + (Math.random() - 0.5) * 0.18).toFixed(3),
  GRPO: +(0.3 + i * 0.14 + (Math.random() - 0.5) * 0.22).toFixed(3),
}));

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  comparison: MessageSquare, rating: Sparkles, training: Cpu, rl_run: RefreshCw,
};
const ACTIVITY_COLORS: Record<string, string> = {
  comparison: '#38bdf8', rating: '#f472b6', training: '#34d399', rl_run: '#a78bfa',
};

function relativeTime(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

// ── Behavioral Standards Card ─────────────────────────────────
function BehavioralStandardsCard() {
  const { addToast } = useApp();
  const useCase = localStorage.getItem('rf_use_case') || 'legal';

  const STANDARDS_BY_USE_CASE: Record<string, string[]> = {
    legal: [
      'Always recommend consulting a local attorney for jurisdiction-specific questions',
      'Keep responses under 100 words unless client requests detail',
      'Never cite specific cases without flagging independent verification is needed',
    ],
    medical: [
      'Always recommend consulting a doctor for diagnosis and treatment decisions',
      'Never provide specific dosage advice without physician guidance',
      'Always mention when symptoms require emergency care',
    ],
    financial: [
      'Always disclose this is general information not personalized financial advice',
      'Never recommend specific securities without suitability assessment',
      'Always recommend consulting a licensed financial advisor for major decisions',
    ],
    customer_service: [
      "Always acknowledge the customer's frustration before providing a solution",
      'Never promise a specific resolution timeframe without checking availability',
      'Always offer a follow-up contact method at the end of each response',
    ],
    education: [
      'Always encourage students to attempt the problem before providing the answer',
      'Never make a student feel bad for not understanding a concept',
      'Always connect new concepts to something the student already knows',
    ],
    developer: [
      'Always include working code examples for technical explanations',
      'Never suggest deprecated libraries or outdated approaches',
      'Always mention potential edge cases and error handling',
    ],
  };

  const items = STANDARDS_BY_USE_CASE[useCase] ?? STANDARDS_BY_USE_CASE['legal'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
      className="p-5 rounded-xl"
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-syne font-semibold text-sm text-[#fafafa]">AI Behavioral Standards</span>
        <span className="font-mono text-[10px] px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}>
          Coming Q2 2026
        </span>
      </div>
      <p className="text-[13px] mb-4 leading-relaxed" style={{ color: '#525252' }}>
        Define plain-language rules that govern how your AI responds. Version, approve, and monitor compliance automatically.
      </p>
      <div className="space-y-0">
        {items.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5 py-2" style={{ borderBottom: i < items.length - 1 ? '1px solid #111' : 'none' }}>
            <span className="text-[12px] mt-0.5" style={{ color: '#34d399' }}>✓</span>
            <span className="text-[12px] leading-relaxed text-[#fafafa]">{s}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="font-mono text-[11px]" style={{ color: '#333' }}>3 example standards shown</span>
        <button
          onClick={() => addToast({ type: 'info', message: 'Behavioral standards launching Q2 2026. You\'re on the early access list! ✓' })}
          className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all"
          style={{ border: '1px solid #2a2a2a', color: '#a3a3a3' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#525252'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'}
        >
          Define your standards →
        </button>
      </div>
    </motion.div>
  );
}

// ── Governance Timeline ───────────────────────────────────────
function GovernanceTimeline() {
  const { comparisons, rewardModels, rlRuns, addToast } = useApp();
  const navigate = useNavigate();

  const items: { color: string; title: string; detail: string; time: string }[] = [];

  comparisons.forEach((c, i) => {
    if (i === 0 || i === 4 || i === 9 || i === comparisons.length - 1) {
      items.push({
        color: '#38bdf8',
        title: `${i + 1} comparison${i > 0 ? 's' : ''} collected`,
        detail: `AI preference prompts · ${new Date(c.timestamp).toLocaleDateString()}`,
        time: 'Today',
      });
    }
  });

  rewardModels.forEach(m => {
    items.push({
      color: '#34d399',
      title: `Reward model trained · ${m.name}`,
      detail: `${m.baseModel} · ${(m.accuracy * 100).toFixed(1)}% accuracy`,
      time: 'Today',
    });
  });

  rlRuns.forEach(r => {
    items.push({
      color: '#a78bfa',
      title: `RL run complete · ${r.id}`,
      detail: `${r.algorithm} · Reward: ${r.finalReward.toFixed(3)} · ${r.maxSteps} steps`,
      time: 'Today',
    });
  });

  items.reverse();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-syne font-semibold text-base text-[#fafafa]">Governance Timeline</h3>
          <p className="font-mono text-[11px] mt-0.5" style={{ color: '#525252' }}>Complete record of your AI's evolution</p>
        </div>
        <button
          onClick={() => addToast({ type: 'info', message: 'Full audit trail on Growth plan. Upgrade to access complete history.' })}
          className="font-mono text-[11px] transition-colors"
          style={{ color: '#333' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}
        >
          View full audit →
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-mono text-[12px]" style={{ color: '#333' }}>
            Your governance timeline will appear here<br />as you complete pipeline steps.
          </p>
        </div>
      ) : (
        <div>
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 py-2.5" style={{ borderBottom: i < items.length - 1 ? '1px solid #111' : 'none' }}>
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ background: item.color }} />
                {i < items.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: '#111', minHeight: 16 }} />}
              </div>
              <div className="flex-1 pb-1">
                <p className="font-syne font-medium text-[13px] text-[#fafafa]">{item.title}</p>
                <p className="font-mono text-[11px] mt-0.5" style={{ color: '#525252' }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coming soon */}
      <div className="mt-3 p-4 rounded-lg" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        <p className="font-mono text-[11px] mb-3" style={{ color: '#38bdf8' }}>Coming in Q2 2026</p>
        <div className="flex items-center gap-6 mb-3">
          {['📋 Standards changes', '🔔 Drift alerts', '📅 Review reminders'].map(item => (
            <span key={item} className="font-mono text-[11px]" style={{ color: '#525252' }}>{item}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px]" style={{ color: '#333' }}>Full audit trail on Growth plan</span>
          <button
            onClick={() => navigate('/pricing')}
            className="font-mono text-[11px] px-3 py-1 rounded transition-all"
            style={{ border: '1px solid #2a2a2a', color: '#a3a3a3' }}
          >
            Upgrade →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const { comparisons, ratings, rewardModels, rlRuns, activityLog, setComparisons, setRatings, setRewardModels, setRlRuns, addToast } = useApp();
  const navigate = useNavigate();

  const avgRating = ratings.length ? ratings.reduce((a, r) => a + r.overall, 0) / ratings.length : 0;
  const bestRM = rewardModels[0];
  const lastRun = rlRuns[0];
  // 5-step pipeline: Upload(1), Annotate(2), Train RM(3), RL Loop(4), Evaluate(5)
  const pipelineStep = rlRuns.length > 0 ? 5 : rewardModels.length > 0 ? 4 : comparisons.length >= 5 ? 3 : comparisons.length > 0 ? 2 : 1;

  const pipelineSteps = [
    { label: 'Upload', done: comparisons.length > 0 },
    { label: 'Annotate', done: comparisons.length >= 5 },
    { label: 'Train RM', done: rewardModels.length > 0 },
    { label: 'RL Loop', done: rlRuns.length > 0 },
    { label: 'Evaluate', done: rlRuns.length > 1 },
  ];

  const quickActions = [
    { title: 'New Comparison', desc: 'Compare AI response pairs with keyboard shortcuts', path: '/annotate', color: '#38bdf8' },
    { title: 'Train Reward Model', desc: 'Train on your collected comparisons and ratings', path: '/train-rm', color: '#34d399' },
    { title: 'Launch RL Run', desc: 'Fine-tune your policy with PPO, GRPO or DPO', path: '/rl-loop', color: '#a78bfa' },
    { title: 'View Evaluate', desc: 'Compare all runs and export your best model', path: '/evaluate', color: '#f59e0b' },
  ];

  const currentUseCase = localStorage.getItem('rf_use_case');
  const ucMeta = currentUseCase ? USE_CASE_META[currentUseCase] : null;

  const handleSwitchUseCase = () => {
    clearPipelineData();
    localStorage.removeItem('rf_use_case');
    setComparisons([]);
    setRatings([]);
    setRewardModels([]);
    setRlRuns([]);
    navigate('/onboarding');
  };

  const isDemoMode = localStorage.getItem('rf_demo_mode') === 'marcus';
  const [trainingComplete, setTrainingComplete] = useState(() => localStorage.getItem('rf_training_complete') === 'true');
  const [showVerification, setShowVerification] = useState(false);
  const estimatedTime = new Date(Date.now() + 35 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Marcus demo mode dashboard
  if (isDemoMode) {
    return (
      <div className="space-y-7">
        <AnimatePresence>
          {showVerification && (
            <MarcusVerificationFlow onClose={() => setShowVerification(false)} />
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
          <div>
            <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: '#525252' }}>LexAI · Chen & Associates Legal Group</p>
          </div>
        </motion.div>

        {/* Status card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-8 rounded-xl"
          style={{ background: '#0a0a0a', border: `1px solid ${trainingComplete ? 'rgba(52,211,153,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
          {trainingComplete ? (
            <div className="text-center space-y-4">
              <div className="text-[48px]">✅</div>
              <div className="font-syne font-extrabold text-[24px] text-[#fafafa]">LexAI Training Complete</div>
              <p className="font-mono text-[13px]" style={{ color: '#34d399' }}>
                Quality score: 94/100 — Ready for verification
              </p>
              <button onClick={() => setShowVerification(true)}
                className="mt-4 px-8 py-3 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-88"
                style={{ background: '#38bdf8', color: '#000' }}>
                Verify My AI →
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-[48px]">🔄</div>
              <div className="font-syne font-extrabold text-[24px] text-[#fafafa]">LexAI Training Run #1</div>
              <p className="font-mono text-[13px]" style={{ color: '#f59e0b' }}>
                In progress — Estimated completion: {estimatedTime}
              </p>
            </div>
          )}
        </motion.div>

        {/* Skip link for demo */}
        <div className="text-center">
          <button
            onClick={() => { localStorage.setItem('rf_training_complete', 'true'); setTrainingComplete(true); }}
            className="font-mono text-[9px] transition-colors"
            style={{ color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#333'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#1a1a1a'}
          >
            Skip to completed state →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#525252' }}>Overview of your alignment pipeline.</p>
        </div>
        <div className="flex gap-2.5">
          <div className="relative group">
            <button
              className="px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{ border: '1px solid #1a1a1a', color: '#fafafa', background: 'transparent' }}
              onClick={() => addToast({ type: 'info', message: 'Export coming soon — available on Starter plan and above' })}
            >
              Export Data
            </button>
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded font-mono text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
              style={{ background: '#111', border: '1px solid #1a1a1a', color: '#a3a3a3' }}>
              Export your comparisons and ratings as JSON
            </div>
          </div>
          <button onClick={() => navigate('/annotate')}
            className="px-4 py-2 rounded-full text-sm font-bold transition-opacity hover:opacity-88"
            style={{ background: '#fafafa', color: '#000' }}>
            New Project
          </button>
        </div>
      </motion.div>

      {/* Use case switcher bar — hidden in demo mode */}
      {currentUseCase && ucMeta && localStorage.getItem('rf_demo_mode') !== 'marcus' && (
        <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #111', paddingBottom: 8, marginBottom: -12 }}>
          <span className="font-mono text-[11px]" style={{ color: '#525252' }}>
            {ucMeta.emoji} {ucMeta.label} workspace
          </span>
          <button
            onClick={handleSwitchUseCase}
            className="font-mono text-[11px] transition-opacity hover:opacity-80"
            style={{ color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Switch use case →
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="COMPARISONS" value={comparisons.length} icon={MessageSquare} color="#38bdf8"
          trend={comparisons.length >= 5 ? "✓ Ready to train" : `Need ${5 - comparisons.length} more`}
          trendColor={comparisons.length >= 5 ? '#34d399' : '#f59e0b'} delay={0} />
        <StatCard label="AVG RATING" value={Math.round(avgRating * 10)} displayValue={avgRating > 0 ? avgRating.toFixed(1) : '—'} icon={Sparkles} color="#f472b6"
          trend={`Across ${ratings.length} responses`} delay={0.05} />
        <StatCard label="RM ACCURACY" value={bestRM ? Math.round(bestRM.accuracy * 100) : 0}
          displayValue={bestRM ? `${(bestRM.accuracy * 100).toFixed(1)}%` : '—'} icon={Cpu} color="#34d399"
          trend={`${rewardModels.length} model${rewardModels.length !== 1 ? 's' : ''} trained`} delay={0.1} />
        <StatCard label="RL RUNS" value={rlRuns.length} icon={RefreshCw} color="#a78bfa"
          trend={lastRun ? `Latest: ${lastRun.algorithm}` : 'No runs yet'} delay={0.15} />
      </div>

      {/* Behavioral Standards Card */}
      <BehavioralStandardsCard />

      {/* Pipeline progress */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative p-5 rounded-xl overflow-hidden"
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.15), transparent)' }} />
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-syne font-bold text-sm text-[#fafafa]">RLHF Pipeline</h3>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full"
            style={{ background: pipelineStep === 5 ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${pipelineStep === 5 ? '#34d39930' : '#f59e0b30'}`, color: pipelineStep === 5 ? '#34d399' : '#f59e0b' }}>
            {pipelineStep === 5 ? '✓ Pipeline complete' : `Step ${pipelineStep} of 5`}
          </span>
        </div>
        <div className="flex items-center gap-0">
          {pipelineSteps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: s.done ? 'rgba(52,211,153,0.15)' : i === pipelineStep - 1 ? 'rgba(56,189,248,0.15)' : '#111', border: `2px solid ${s.done ? '#34d399' : i === pipelineStep - 1 ? '#38bdf8' : '#1a1a1a'}` }}>
                  {s.done ? <CheckCircle2 size={14} style={{ color: '#34d399' }} /> : i === pipelineStep - 1 ? <Clock size={14} className="animate-pulse" style={{ color: '#38bdf8' }} /> : <div className="w-2 h-2 rounded-full" style={{ background: '#333' }} />}
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: s.done ? '#34d399' : i === pipelineStep - 1 ? '#38bdf8' : '#333' }}>{s.label}</span>
              </div>
              {i < 4 && <div className="flex-1 h-[2px] mx-2 mb-5" style={{ background: s.done ? '#34d399' : '#1a1a1a' }} />}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main chart */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="col-span-2 relative p-5 rounded-xl overflow-hidden"
          style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
          <div className="flex items-center gap-2 mb-5">
            <h3 className="font-syne font-bold text-sm text-[#fafafa]">Reward Improvement</h3>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded" style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}>SIMULATED</span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorPPO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGRPO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f472b6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="step" stroke="#333" fontSize={9} fontFamily="Space Mono" tick={{ fill: '#333' }} />
                <YAxis stroke="#333" fontSize={9} fontFamily="Space Mono" tick={{ fill: '#333' }} />
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 8, fontFamily: 'Space Mono', fontSize: 11 }} labelStyle={{ color: '#525252' }} />
                <Area type="monotone" dataKey="PPO" stroke="#38bdf8" fill="url(#colorPPO)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="GRPO" stroke="#f472b6" fill="url(#colorGRPO)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3">
            {[{ label: 'PPO', color: '#38bdf8' }, { label: 'GRPO', color: '#f472b6' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ background: l.color }} />
                <span className="font-mono text-[9px]" style={{ color: '#525252' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative p-5 rounded-xl overflow-hidden"
          style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-syne font-bold text-sm text-[#fafafa]">Recent Activity</h3>
            <button className="font-mono text-[9px] hover:underline" style={{ color: '#38bdf8' }}>VIEW ALL</button>
          </div>
          {activityLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <BarChart2 size={32} style={{ color: '#1a1a1a' }} />
              <p className="font-syne text-sm text-center" style={{ color: '#525252' }}>No activity yet</p>
              <button onClick={() => navigate('/annotate')}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-80"
                style={{ background: '#fafafa', color: '#000' }}>
                Start annotating →
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {activityLog.slice(0, 8).map((item, i) => {
                const Icon = ACTIVITY_ICONS[item.type];
                const color = ACTIVITY_COLORS[item.type];
                return (
                  <div key={item.id} className="flex gap-3 items-start py-3" style={{ borderBottom: i < Math.min(activityLog.length, 8) - 1 ? '1px solid #0f0f0f' : 'none' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                      <Icon size={12} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] leading-relaxed" style={{ color: '#a3a3a3' }}>
                        {item.message}
                        {item.value && <span className="font-bold" style={{ color: item.valueColor ?? '#fafafa' }}>{item.value}</span>}
                      </p>
                      <span className="font-mono text-[9px]" style={{ color: '#333' }}>{relativeTime(item.timestamp)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Governance Timeline */}
      <div className="relative p-5 rounded-xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
        <GovernanceTimeline />
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="font-syne font-bold text-sm text-[#fafafa] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((a, i) => (
            <button key={i} onClick={() => navigate(a.path)}
              className="text-left p-4 rounded-xl transition-all duration-150"
              style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'}>
              <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center" style={{ background: `${a.color}18` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
              </div>
              <div className="font-syne font-bold text-sm text-[#fafafa] mb-1">{a.title}</div>
              <div className="text-[11px] leading-relaxed" style={{ color: '#525252' }}>{a.desc}</div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
