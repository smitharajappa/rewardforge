import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROMPTS } from '@/data/prompts';
import { useApp } from '@/context/AppContext';

const TOTAL = PROMPTS.length;

// ── Confetti ─────────────────────────────────────────────────
const CONFETTI_COLORS = ['#38bdf8', '#f472b6', '#34d399', '#a78bfa', '#f59e0b', '#fafafa'];

function Confetti() {
  const particles = useRef(
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 5 + Math.random() * 6,
      delay: Math.random() * 0.7,
      duration: 1.6 + Math.random() * 1.4,
      xDrift: (Math.random() - 0.5) * 260,
      rotation: Math.random() * 720 - 360,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size * (p.shape === 'rect' ? 1.6 : 1),
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '1px',
            opacity: 1,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.xDrift],
            rotate: [0, p.rotation],
            opacity: [1, 1, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

// ── Pairwise Tab ─────────────────────────────────────────────
function PairwiseTab() {
  const { addComparison, comparisons, addToast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<null | 'A' | 'B' | 'Tie'>(null);
  const [reasoning, setReasoning] = useState('');
  const [done, setDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSelect = useCallback((c: 'A' | 'B' | 'Tie') => setSelection(c), []);

  const handleNext = useCallback(() => {
    if (!selection) return;
    addComparison({
      id: crypto.randomUUID(),
      promptIndex: step,
      prompt: PROMPTS[step].text,
      preferred: selection,
      reasoning,
      timestamp: new Date(),
    });
    addToast({ type: 'success', message: '✓ Comparison saved' });
    if (comparisons.length + 1 === 5) {
      addToast({ type: 'info', message: '🎯 Ready to train your first model!' });
    }
    if (step + 1 >= TOTAL) {
      setDone(true);
      setShowConfetti(true);
      // Auto-hide confetti after 3.5s
      setTimeout(() => setShowConfetti(false), 3500);
      return;
    }
    setStep(s => s + 1);
    setSelection(null);
    setReasoning('');
  }, [selection, step, reasoning, addComparison, addToast, comparisons.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === 'a') handleSelect('A');
      if (e.key === 'b') handleSelect('B');
      if (e.key === 't') handleSelect('Tie');
      if (e.key === 's') { setStep(s => Math.min(s + 1, TOTAL - 1)); setSelection(null); setReasoning(''); }
      if (e.key === 'Enter' && selection) handleNext();
      if (e.key === 'Escape') setSelection(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [done, handleSelect, handleNext, selection]);

  if (done) {
    const countA = comparisons.filter(c => c.preferred === 'A').length;
    const countB = comparisons.filter(c => c.preferred === 'B').length;
    const countTie = comparisons.filter(c => c.preferred === 'Tie').length;
    return (
      <>
        {showConfetti && <Confetti />}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center py-20 gap-6"
        >
          {/* Animated logo mark */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
            className="w-[72px] h-[72px]"
          >
            <svg viewBox="0 0 72 72" fill="none">
              <polygon points="36,4 66,20 66,52 36,68 6,52 6,20" fill="#071020" stroke="#38bdf8" strokeWidth="2.5"/>
              <polyline points="14,52 26,40 36,44 46,28 58,16" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="58" cy="16" r="4" fill="#38bdf8"/>
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-center"
          >
            <h2 className="font-syne font-extrabold text-[28px] text-[#fafafa]">All done!</h2>
            <p className="text-sm mt-1" style={{ color: '#525252' }}>{comparisons.length} comparisons collected</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-2 flex-wrap justify-center"
          >
            {[`${comparisons.length} Total`, `${countA} Prefer A`, `${countB} Prefer B`, `${countTie} Ties`].map(s => (
              <span key={s} className="font-mono text-[10px] px-3 py-1 rounded-full"
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#a3a3a3' }}>{s}</span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="flex gap-3"
          >
            <button onClick={() => navigate('/evaluate')}
              className="px-5 py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-88"
              style={{ background: '#fafafa', color: '#000' }}>
              View in Evaluate
            </button>
            <button onClick={() => { setStep(0); setSelection(null); setReasoning(''); setDone(false); setShowConfetti(false); }}
              className="px-5 py-2.5 rounded-full font-syne font-bold text-sm transition-all"
              style={{ border: '1px solid #1a1a1a', color: '#fafafa' }}>
              Restart
            </button>
          </motion.div>
        </motion.div>
      </>
    );
  }

  const prompt = PROMPTS[step];
  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-[10px] px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}>
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse inline-block" />
          AI-GENERATED PAIRS
        </span>
        <div className="text-right">
          <div className="font-mono text-[10px] mb-1.5 uppercase tracking-widest" style={{ color: '#525252' }}>
            {step + 1} of {TOTAL} comparisons
          </div>
          <div className="w-44 h-1.5 rounded-full overflow-hidden" style={{ background: '#111' }}>
            <motion.div className="h-full rounded-full" style={{ background: '#38bdf8' }}
              animate={{ width: `${((step) / TOTAL) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="p-5 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderLeft: '2px solid #38bdf8' }}>
        <div className="font-mono text-[9px] tracking-[0.2em] mb-2.5" style={{ color: '#38bdf8' }}>PROMPT</div>
        <h2 className="font-syne font-bold text-[15px] text-[#fafafa] leading-snug">{prompt.text}</h2>
      </div>

      {/* Response cards */}
      <div className="grid grid-cols-2 gap-4">
        {(['A', 'B'] as const).map(id => {
          const content = id === 'A' ? prompt.responseA : prompt.responseB;
          const color = id === 'A' ? '#38bdf8' : '#f472b6';
          const isSelected = selection === id;
          return (
            <div key={id} onClick={() => handleSelect(id)}
              style={{
                background: '#0a0a0a', border: `2px solid ${isSelected ? color : '#1a1a1a'}`,
                boxShadow: isSelected ? `0 0 0 3px ${color}14` : 'none',
                borderRadius: 10, padding: '14px', cursor: 'pointer', height: 280,
                display: 'flex', flexDirection: 'column', transition: 'all 0.12s',
              }}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[10px] px-2 py-1 rounded"
                  style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
                  RESPONSE {id}
                </span>
                {isSelected && <CheckCircle2 size={16} style={{ color }} />}
              </div>
              <div className="flex-1 overflow-y-auto text-[13px] leading-relaxed pr-1 transition-colors"
                style={{ color: isSelected ? '#fafafa' : '#a3a3a3' }}>
                <pre className="whitespace-pre-wrap font-syne">{content}</pre>
              </div>
              <div className="mt-3 pt-3 text-center font-mono text-[10px] uppercase tracking-widest"
                style={{ borderTop: '1px solid #1a1a1a', color: '#333' }}>
                Click or press <kbd className="px-1.5 py-0.5 rounded text-[9px]"
                  style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}>{id}</kbd>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control row */}
      <div className="flex justify-center gap-3">
        {['Tie', 'Skip'].map(action => (
          <button key={action}
            onClick={() => action === 'Tie'
              ? handleSelect('Tie')
              : (setStep(s => Math.min(s + 1, TOTAL - 1)), setSelection(null), setReasoning(''))}
            className="px-5 py-2 rounded-lg font-syne font-bold text-sm flex items-center gap-2 transition-all"
            style={{
              background: selection === 'Tie' && action === 'Tie' ? '#fafafa' : 'transparent',
              color: selection === 'Tie' && action === 'Tie' ? '#000' : '#525252',
              border: `1px solid ${selection === 'Tie' && action === 'Tie' ? '#fafafa' : '#1a1a1a'}`,
            }}>
            {action}{' '}
            <kbd className="rounded text-[10px] px-1.5 py-0.5"
              style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}>
              {action === 'Tie' ? 'T' : 'S'}
            </kbd>
          </button>
        ))}
      </div>

      {/* Reasoning */}
      <AnimatePresence>
        {selection && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="p-5 rounded-xl space-y-4" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
            <label className="text-sm font-syne font-bold" style={{ color: '#a3a3a3' }}>
              Why did you prefer this? (optional)
            </label>
            <textarea value={reasoning} onChange={e => setReasoning(e.target.value)} rows={3}
              placeholder="Explain your reasoning..."
              className="w-full px-4 py-3 rounded-lg text-sm resize-none outline-none transition-all"
              style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}
              onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
              onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'}
            />
            <button onClick={handleNext}
              className="w-full py-4 rounded-full font-syne font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: '#fafafa', color: '#000' }}>
              Submit & Next <ChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Rate & Score Tab ─────────────────────────────────────────
const DIMENSIONS = [
  { key: 'helpfulness', label: 'Helpfulness', weight: 0.30 },
  { key: 'accuracy', label: 'Accuracy', weight: 0.25 },
  { key: 'safety', label: 'Safety', weight: 0.20 },
  { key: 'coherence', label: 'Coherence', weight: 0.15 },
  { key: 'creativity', label: 'Creativity', weight: 0.10 },
] as const;

function RateTab() {
  const { addRating, ratings, addToast } = useApp();
  const [promptIdx, setPromptIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    helpfulness: 5, accuracy: 5, safety: 5, coherence: 5, creativity: 5,
  });

  const overall = DIMENSIONS.reduce((sum, d) => sum + scores[d.key] * d.weight, 0);

  const handleSubmit = () => {
    addRating({
      id: crypto.randomUUID(),
      prompt: PROMPTS[promptIdx].text,
      helpfulness: scores.helpfulness,
      accuracy: scores.accuracy,
      safety: scores.safety,
      coherence: scores.coherence,
      creativity: scores.creativity,
      overall,
      timestamp: new Date(),
    });
    addToast({ type: 'success', message: '✓ Rating saved' });
    setPromptIdx(i => (i + 1) % TOTAL);
    setScores({ helpfulness: 5, accuracy: 5, safety: 5, coherence: 5, creativity: 5 });
  };

  const qualifier = overall >= 8
    ? { label: 'Excellent', color: '#34d399' }
    : overall >= 5
    ? { label: 'Good', color: '#38bdf8' }
    : { label: 'Needs work', color: '#f472b6' };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Prompt */}
      <div className="p-5 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderLeft: '2px solid #38bdf8' }}>
        <div className="font-mono text-[9px] tracking-[0.2em] mb-2" style={{ color: '#38bdf8' }}>PROMPT</div>
        <p className="font-syne font-bold text-[14px] text-[#fafafa]">{PROMPTS[promptIdx].text}</p>
      </div>

      {/* Response */}
      <div className="p-5 rounded-xl max-h-[180px] overflow-y-auto"
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        <div className="font-mono text-[9px] mb-2" style={{ color: '#525252' }}>RESPONSE A</div>
        <pre className="text-[13px] leading-relaxed whitespace-pre-wrap font-syne" style={{ color: '#a3a3a3' }}>
          {PROMPTS[promptIdx].responseA}
        </pre>
      </div>

      {/* Sliders */}
      <div className="p-5 rounded-xl space-y-4" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        {DIMENSIONS.map(d => (
          <div key={d.key} className="flex items-center gap-4">
            <div className="w-[110px] shrink-0">
              <span className="font-syne text-[12px] text-[#a3a3a3]">{d.label}</span>
            </div>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded shrink-0"
              style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}>
              {Math.round(d.weight * 100)}%
            </span>
            <input type="range" min={1} max={10} step={0.5} value={scores[d.key]}
              onChange={e => setScores(s => ({ ...s, [d.key]: Number(e.target.value) }))}
              className="flex-1" />
            <span className="font-syne font-extrabold text-[16px] w-8 text-right" style={{ color: '#38bdf8' }}>
              {scores[d.key].toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Overall score */}
      <div className="p-5 rounded-xl text-center" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="font-mono text-[9px] tracking-widest mb-1" style={{ color: '#525252' }}>OVERALL SCORE</div>
        <div className="font-syne font-extrabold text-[52px] leading-none" style={{ color: '#38bdf8' }}>
          {overall.toFixed(1)}
        </div>
        <div className="font-syne font-bold text-sm mt-2" style={{ color: qualifier.color }}>{qualifier.label}</div>
      </div>

      <button onClick={handleSubmit}
        className="w-full py-3.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
        style={{ background: '#fafafa', color: '#000' }}>
        Submit Rating
      </button>

      {/* Rating history */}
      {ratings.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a1a1a' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
                {['Prompt', 'Help', 'Acc', 'Safe', 'Coh', 'Cre', 'Overall', 'Date'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: '#525252' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ratings.slice(0, 10).map((r, i) => {
                const color = r.overall >= 8 ? '#34d399' : r.overall >= 5 ? '#38bdf8' : '#f472b6';
                return (
                  <tr key={r.id} style={{ borderBottom: i < ratings.length - 1 ? '1px solid #0f0f0f' : 'none' }}>
                    <td className="px-3 py-2 text-[11px]" style={{ color: '#a3a3a3', maxWidth: 200 }}>
                      {r.prompt.slice(0, 35)}{r.prompt.length > 35 ? '...' : ''}
                    </td>
                    {['helpfulness', 'accuracy', 'safety', 'coherence', 'creativity'].map(k => (
                      <td key={k} className="px-3 py-2 font-mono text-[10px]" style={{ color: '#525252' }}>
                        {(r as Record<string, number>)[k].toFixed(1)}
                      </td>
                    ))}
                    <td className="px-3 py-2 font-mono font-bold text-[10px]" style={{ color }}>{r.overall.toFixed(1)}</td>
                    <td className="px-3 py-2 font-mono text-[9px]" style={{ color: '#333' }}>
                      {r.timestamp.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main Annotate Page ───────────────────────────────────────
export function Annotate() {
  const [tab, setTab] = useState<'pairwise' | 'rate'>('pairwise');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">Annotate</h1>
        <p className="text-sm mt-1" style={{ color: '#525252' }}>
          Collect human preference data to train your reward model.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0" style={{ borderBottom: '1px solid #1a1a1a' }}>
        {[
          { id: 'pairwise', label: 'Pairwise Comparison' },
          { id: 'rate', label: 'Rate & Score' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as 'pairwise' | 'rate')}
            className="px-5 py-3 font-syne font-bold text-sm transition-all"
            style={{
              color: tab === t.id ? '#fafafa' : '#525252',
              borderBottom: `2px solid ${tab === t.id ? '#38bdf8' : 'transparent'}`,
              marginBottom: -1,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'pairwise'
          ? <motion.div key="pairwise" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PairwiseTab />
            </motion.div>
          : <motion.div key="rate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RateTab />
            </motion.div>
        }
      </AnimatePresence>
    </div>
  );
}
