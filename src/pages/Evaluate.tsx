import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Search, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
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

const MOCK_CHART = Array.from({ length: 25 }, (_, i) => ({
  step: i * 20,
  PPO: +(0.4 + i * 0.11 + (Math.sin(i) * 0.08)).toFixed(3),
  GRPO: +(0.35 + i * 0.13 + (Math.cos(i) * 0.1)).toFixed(3),
}));

// ── HF Hub Modal ──────────────────────────────────────────────
function HFHubModal({ onClose, modelName, onToast }: { onClose: () => void; modelName: string; onToast: (msg: string, type: 'info' | 'success') => void }) {
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState(`rewardforge-demo/${modelName.toLowerCase().replace(/\s/g, '-')}`);

  const handlePush = () => {
    onClose();
    onToast('Pushing to huggingface.co...', 'info');
    setTimeout(() => onToast(`✓ Model pushed to huggingface.co/${repo}`, 'success'), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[49] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 50, width: '100%', maxWidth: 440,
          background: '#0a0a0a', border: '1px solid #1a1a1a',
          borderRadius: 12, padding: 24,
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-syne font-bold text-base text-[#fafafa]">Push to HuggingFace Hub</h2>
          <button onClick={onClose} style={{ color: '#525252' }}>✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>HuggingFace Token</label>
            <input type="password" value={token} onChange={e => setToken(e.target.value)}
              placeholder="hf_xxxxxxxxxxxx"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}
              onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
              onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'}
            />
            <p className="font-mono text-[9px] mt-1" style={{ color: '#525252' }}>
              Get yours at huggingface.co/settings/tokens
            </p>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Destination repository</label>
            <input type="text" value={repo} onChange={e => setRepo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}
              onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
              onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'}
            />
          </div>
          <button onClick={handlePush}
            className="w-full py-3 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#fafafa', color: '#000' }}>
            Push model →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Evaluate() {
  const { rlRuns, rewardModels, addToast } = useApp();
  const navigate = useNavigate();
  const [splitView, setSplitView] = useState(true);
  const [filterAlgo, setFilterAlgo] = useState('All');
  const [filterBest, setFilterBest] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportRunId, setExportRunId] = useState('');
  const [exportFormat, setExportFormat] = useState('safetensors');
  const [hfDest, setHfDest] = useState(`rewardforge/model-v${rewardModels.length}`);
  const [hfHubModel, setHfHubModel] = useState<string | null>(null);

  // ── LOCKED STATE ─────────────────────────────────────────────
  if (rlRuns.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">Evaluate</h1>
          <p className="text-sm mt-1" style={{ color: '#525252' }}>Compare RL runs, inspect models, and export to HuggingFace.</p>
        </div>
        <div className="flex flex-col items-center justify-center" style={{ minHeight: '50vh' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 text-center max-w-sm"
          >
            <Lock size={48} style={{ color: '#525252' }} />
            <h2 className="font-syne font-bold text-xl text-[#fafafa]">Run the RL loop first</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#525252' }}>
              Complete a PPO, GRPO, or DPO run to generate results to evaluate.
            </p>
            <button onClick={() => navigate('/rl-loop')}
              className="px-5 py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-88 mt-2"
              style={{ background: '#fafafa', color: '#000' }}>
              Go to RL Loop →
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const bestRun = rlRuns.reduce<(typeof rlRuns)[0] | null>((b, r) => (!b || r.finalReward > b.finalReward ? r : b), null);
  const run1 = rlRuns[0];
  const run2 = rlRuns[1];

  const filteredModels = rewardModels.filter(m => {
    const matchSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.baseModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const bestRewardTarget = bestRun ? Math.round(bestRun.finalReward * 1000) : 0;
  const bestRewardCount = useCountUp(bestRewardTarget);
  const rmAccTarget = rewardModels[0] ? Math.round(rewardModels[0].accuracy * 1000) : 0;
  const rmAccCount = useCountUp(rmAccTarget);
  const stepsTarget = bestRun?.maxSteps ?? 0;
  const stepsCount = useCountUp(stepsTarget);

  const metrics = [
    { label: 'Best Reward', displayValue: bestRun ? (bestRewardCount / 1000).toFixed(3) : '—', color: '#38bdf8' },
    { label: 'KL Divergence', displayValue: bestRun?.klDivergence.toFixed(4) ?? '—', color: '#34d399' },
    { label: 'RM Accuracy', displayValue: rewardModels[0] ? `${(rmAccCount / 10).toFixed(1)}%` : '—', color: '#f472b6' },
    { label: 'Total Steps', displayValue: bestRun ? stepsCount.toString() : '—', color: '#a78bfa' },
  ];

  const handleExport = () => {
    addToast({ type: 'info', message: `Pushing to huggingface.co/${hfDest}...` });
    setTimeout(() => addToast({ type: 'success', message: `✓ Model pushed to huggingface.co/${hfDest}` }), 1800);
  };

  const DIFF_ROWS = [
    { label: 'Final Reward', key: 'finalReward' as const, better: 'higher' as const },
    { label: 'KL Divergence', key: 'klDivergence' as const, better: 'lower' as const },
    { label: 'Max Steps', key: 'maxSteps' as const, better: null },
    { label: 'Algorithm', key: 'algorithm' as const, better: null },
  ];

  return (
    <div className="space-y-7">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">Evaluate</h1>
          <p className="text-sm mt-1" style={{ color: '#525252' }}>Compare RL runs, inspect models, and export to HuggingFace.</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="relative p-4 rounded-xl overflow-hidden transition-all duration-150 cursor-default"
            style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
            <div className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: '#525252' }}>{m.label}</div>
            <div className="font-syne font-extrabold text-2xl" style={{ color: m.color }}>{m.displayValue}</div>
          </motion.div>
        ))}
      </div>

      {/* Run comparison */}
      {rlRuns.length >= 2 ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a1a1a' }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
            <h3 className="font-syne font-bold text-sm text-[#fafafa]">Run Comparison</h3>
            <div className="flex gap-2">
              {['Split view', 'Unified'].map(v => {
                const active = (splitView && v === 'Split view') || (!splitView && v === 'Unified');
                return (
                  <button key={v} onClick={() => setSplitView(v === 'Split view')}
                    className="px-3 py-1 rounded-full font-mono text-[10px] transition-all"
                    style={{ background: active ? 'rgba(56,189,248,0.1)' : 'transparent', border: `1px solid ${active ? 'rgba(56,189,248,0.4)' : '#1a1a1a'}`, color: active ? '#38bdf8' : '#525252' }}>
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          {splitView ? (
            <div className="grid grid-cols-2">
              {([run1, run2] as const).map((run, col) => {
                const other = col === 0 ? run2 : run1;
                const headerColor = col === 0 ? '#f472b6' : '#38bdf8';
                return (
                  <div key={run.id} style={{ borderRight: col === 0 ? '1px solid #1a1a1a' : 'none' }}>
                    <div className="px-4 py-2.5 font-mono text-[10px] font-bold" style={{ background: `${headerColor}10`, borderBottom: '1px solid #1a1a1a', color: headerColor }}>
                      {run.id} · {run.algorithm} {bestRun?.id === run.id ? '★ Best' : ''}
                    </div>
                    {DIFF_ROWS.map(row => {
                      const val = run[row.key];
                      const otherVal = other[row.key];
                      let highlight: 'better' | 'worse' | null = null;
                      if (row.better === 'higher' && typeof val === 'number' && typeof otherVal === 'number') {
                        highlight = val > otherVal ? 'better' : val < otherVal ? 'worse' : null;
                      } else if (row.better === 'lower' && typeof val === 'number' && typeof otherVal === 'number') {
                        highlight = val < otherVal ? 'better' : val > otherVal ? 'worse' : null;
                      }
                      const bgColor = highlight === 'better' ? 'rgba(52,211,153,0.08)' : highlight === 'worse' ? 'rgba(244,63,94,0.08)' : 'transparent';
                      const borderLeftColor = highlight === 'better' ? '#34d399' : highlight === 'worse' ? '#f43f5e' : 'transparent';
                      const textColor = highlight === 'better' ? '#34d399' : highlight === 'worse' ? '#f87171' : '#a3a3a3';
                      return (
                        <div key={row.label} className="flex items-center gap-3 px-4 py-3.5 transition-colors"
                          style={{ background: bgColor, borderBottom: '1px solid #0f0f0f', borderLeft: `3px solid ${borderLeftColor}` }}>
                          <span className="font-mono text-[10px] w-28 shrink-0" style={{ color: '#525252' }}>{row.label}</span>
                          <span className="font-mono text-[11px] font-bold" style={{ color: textColor }}>
                            {typeof val === 'number' ? (row.key === 'klDivergence' ? val.toFixed(4) : row.key === 'maxSteps' ? val.toString() : val.toFixed(3)) : val}
                          </span>
                          {highlight === 'better' && <span className="ml-auto font-mono text-[9px]" style={{ color: '#34d399' }}>▲ Better</span>}
                          {highlight === 'worse' && <span className="ml-auto font-mono text-[9px]" style={{ color: '#f87171' }}>▼ Worse</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-5 px-4 py-2 font-mono text-[9px] uppercase tracking-widest" style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a', color: '#525252' }}>
                <span>Metric</span>
                <span style={{ color: '#f472b6' }}>{run1.id}</span>
                <span style={{ color: '#38bdf8' }}>{run2.id}</span>
                <span>Delta</span>
                <span>Winner</span>
              </div>
              {DIFF_ROWS.map(row => {
                const v1 = run1[row.key];
                const v2 = run2[row.key];
                let winner: string | null = null;
                let delta = '';
                if (row.better && typeof v1 === 'number' && typeof v2 === 'number') {
                  const diff = v2 - v1;
                  delta = (diff > 0 ? '+' : '') + diff.toFixed(4);
                  winner = row.better === 'higher' ? (v1 > v2 ? run1.id : run2.id) : (v1 < v2 ? run1.id : run2.id);
                }
                return (
                  <div key={row.label} className="grid grid-cols-5 px-4 py-3" style={{ borderBottom: '1px solid #0f0f0f' }}>
                    <span className="font-mono text-[10px]" style={{ color: '#525252' }}>{row.label}</span>
                    <span className="font-mono text-[11px]" style={{ color: '#f472b6' }}>{typeof v1 === 'number' ? v1.toFixed(3) : v1}</span>
                    <span className="font-mono text-[11px]" style={{ color: '#38bdf8' }}>{typeof v2 === 'number' ? v2.toFixed(3) : v2}</span>
                    <span className="font-mono text-[10px]" style={{ color: delta.startsWith('+') ? '#34d399' : delta.startsWith('-') ? '#f87171' : '#525252' }}>{delta || '—'}</span>
                    <span className="font-mono text-[10px]" style={{ color: '#a3a3a3' }}>{winner || '—'}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Overlay chart */}
          <div className="p-5" style={{ borderTop: '1px solid #1a1a1a' }}>
            <h4 className="font-syne font-bold text-xs text-[#fafafa] mb-4">Reward Curves</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="step" stroke="#333" fontSize={9} tick={{ fill: '#333' }} fontFamily="Space Mono" />
                  <YAxis stroke="#333" fontSize={9} tick={{ fill: '#333' }} fontFamily="Space Mono" />
                  <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', fontSize: 10, fontFamily: 'Space Mono' }} />
                  <Line type="monotone" dataKey="PPO" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="GRPO" stroke="#f472b6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3">
              {[{ label: run1.id, color: '#f472b6' }, { label: run2.id, color: '#38bdf8' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded" style={{ background: l.color }} />
                  <span className="font-mono text-[9px]" style={{ color: '#525252' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-16 gap-4 rounded-xl" style={{ border: '1px dashed #1a1a1a' }}>
          <div className="font-syne font-bold text-sm" style={{ color: '#525252' }}>
            Run at least 2 RL runs to compare them
          </div>
          <button onClick={() => navigate('/rl-loop')} className="px-4 py-2 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#fafafa', color: '#000' }}>
            Launch Another Run →
          </button>
        </motion.div>
      )}

      {/* Model registry */}
      {rewardModels.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-syne font-bold text-sm text-[#fafafa]">Model Registry</h3>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#525252' }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search models..."
                className="pl-8 pr-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fafafa', width: 220 }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredModels.map(m => (
              <div key={m.id} className="relative p-5 rounded-xl overflow-hidden transition-all"
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'}>
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-syne font-extrabold text-lg" style={{ color: '#38bdf8' }}>{m.name}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}>v1</span>
                    </div>
                    <span className="font-mono text-[10px] mt-1 inline-block px-2 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}>{m.baseModel}</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[9px] uppercase" style={{ color: '#525252' }}>Accuracy</span>
                      <span className="font-mono text-[10px] font-bold" style={{ color: '#34d399' }}>{(m.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#111' }}>
                      <motion.div className="h-full rounded-full" style={{ background: '#34d399' }}
                        initial={{ width: 0 }} animate={{ width: `${m.accuracy * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px]" style={{ color: '#525252' }}>Loss</span>
                    <span className="font-mono text-[10px]" style={{ color: '#f472b6' }}>{m.loss.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px]" style={{ color: '#525252' }}>Trained</span>
                    <span className="font-mono text-[9px]" style={{ color: '#333' }}>{m.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 rounded-lg font-mono text-[10px] transition-all" style={{ border: '1px solid #1a1a1a', color: '#a3a3a3' }}>
                    Download
                  </button>
                  <button onClick={() => setHfHubModel(m.name)}
                    className="flex-1 py-2 rounded-lg font-mono text-[10px] transition-all" style={{ border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8' }}>
                    Push to HF Hub
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Export panel */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="relative p-5 rounded-xl space-y-4 overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
        <h3 className="font-syne font-bold text-sm text-[#fafafa]">Export Model</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Select Run</label>
            <select value={exportRunId} onChange={e => setExportRunId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none" style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}>
              <option value="">Best run</option>
              {rlRuns.map(r => <option key={r.id} value={r.id}>{r.id} · {r.algorithm}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest mb-2 block" style={{ color: '#525252' }}>Format</label>
            <div className="flex gap-2">
              {['safetensors', 'pytorch', 'onnx'].map(f => (
                <label key={f} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="format" checked={exportFormat === f} onChange={() => setExportFormat(f)} style={{ accentColor: '#38bdf8' }} />
                  <span className="font-mono text-[10px]" style={{ color: '#a3a3a3' }}>{f}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>HF Hub Destination</label>
            <input value={hfDest} onChange={e => setHfDest(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }} />
          </div>
        </div>
        <button onClick={handleExport}
          className="w-full py-3 rounded-full font-syne font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 cursor-pointer"
          style={{ background: '#fafafa', color: '#000', borderRadius: '9999px' }}>
          <Download size={15} /> Export Model →
        </button>
      </motion.div>

      {/* HF Hub Modal */}
      <AnimatePresence>
        {hfHubModel && (
          <HFHubModal
            modelName={hfHubModel}
            onClose={() => setHfHubModel(null)}
            onToast={(msg, type) => addToast({ type, message: msg })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
