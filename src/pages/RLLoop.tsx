import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Search, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useApp, type RLRun } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

const ALGORITHMS = [
  { id: 'PPO', label: 'PPO', tooltip: 'Proximal Policy Optimization · stable, widely used' },
  { id: 'GRPO', label: 'GRPO', tooltip: 'Group Relative PO · used by DeepSeek R1' },
  { id: 'DPO', label: 'DPO', tooltip: 'Direct Preference Opt · no reward model needed' },
] as const;

const POLICY_MODELS = ['GPT-2', 'LLaMA 7B', 'Mistral 7B'];

function formatRunId(n: number) {
  return `run-${String(n).padStart(4, '0')}`;
}

export function RLLoop() {
  const { rewardModels, rlRuns, addRlRun, addToast } = useApp();
  const navigate = useNavigate();
  const [algorithm, setAlgorithm] = useState<'PPO' | 'GRPO' | 'DPO'>('PPO');
  const [policyModel, setPolicyModel] = useState('GPT-2');
  const [rmId, setRmId] = useState('');
  const [klPenalty, setKlPenalty] = useState(0.1);
  const [rollouts, setRollouts] = useState('64');
  const [maxSteps, setMaxSteps] = useState('500');
  const [seed, setSeed] = useState('42');
  const [filterAlgo, setFilterAlgo] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEvalBanner, setShowEvalBanner] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [rewardHistory, setRewardHistory] = useState<{ step: number; reward: number }[]>([]);
  const [klHistory, setKlHistory] = useState<{ step: number; kl: number }[]>([]);
  const [lossHistory, setLossHistory] = useState<{ step: number; loss: number }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState({ reward: 0, std: 0, kl: 0 });
  const [finalRun, setFinalRun] = useState<RLRun | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedRM = rewardModels.find(m => m.id === rmId) ?? rewardModels[0];

  const filteredRuns = rlRuns.filter(r => {
    const matchAlgo = filterAlgo === 'All' || r.algorithm === filterAlgo;
    const matchStatus = filterStatus === 'All' || r.status === filterStatus.toLowerCase();
    const matchSearch = !searchQuery || r.id.includes(searchQuery.toLowerCase()) || r.algorithm.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAlgo && matchStatus && matchSearch;
  });

  const bestRun = rlRuns.reduce<RLRun | null>((best, r) => (!best || r.finalReward > best.finalReward ? r : best), null);

  const startRun = () => {
    setIsRunning(true);
    setIsComplete(false);
    setRewardHistory([]);
    setKlHistory([]);
    setLossHistory([]);
    setCurrentStep(0);
    setLiveMetrics({ reward: 0, std: 0, kl: 0 });

    let step = 0;
    let reward = 0.124;
    let loss = 0.8;
    const stepsPerTick = Math.ceil(Number(maxSteps) / 25);

    addToast({ type: 'info', message: `${algorithm} run launched` });

    intervalRef.current = setInterval(() => {
      step += stepsPerTick;
      reward = Math.min(3.2, reward + 0.108 + (Math.random() - 0.48) * 0.22);
      const kl = 0.05 + Math.sin(step / 50) * 0.04 + Math.random() * 0.02;
      loss = Math.max(0.18, loss - 0.042 + (Math.random() - 0.5) * 0.06);
      const std = 0.1 + Math.random() * 0.1;

      setRewardHistory(prev => [...prev, { step, reward: +reward.toFixed(4) }]);
      setKlHistory(prev => [...prev, { step, kl: +kl.toFixed(4) }]);
      setLossHistory(prev => [...prev, { step, loss: +loss.toFixed(4) }]);
      setCurrentStep(step);
      setLiveMetrics({ reward: +reward.toFixed(4), std: +std.toFixed(4), kl: +kl.toFixed(4) });

      if (step >= Number(maxSteps)) {
        clearInterval(intervalRef.current!);
        setIsRunning(false);
        setIsComplete(true);

        const newRun: RLRun = {
          id: formatRunId(rlRuns.length + 1),
          algorithm,
          rewardModelId: selectedRM?.id ?? '',
          klPenalty,
          rollouts: Number(rollouts),
          maxSteps: Number(maxSteps),
          finalReward: reward,
          klDivergence: kl,
          rewardHistory: [],
          klHistory: [],
          lossHistory: [],
          status: 'completed',
          timestamp: new Date(),
        };
        setFinalRun(newRun);
        addRlRun(newRun);
        addToast({ type: 'success', message: `✓ Run complete · Reward: ${reward.toFixed(3)}` });
        setShowEvalBanner(true);
      }
    }, 400);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  // ── LOCKED STATE ─────────────────────────────────────────────
  if (rewardModels.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">RL Loop</h1>
          <p className="text-sm mt-1" style={{ color: '#525252' }}>Reinforcement learning fine-tuning with PPO, GRPO, or DPO.</p>
        </div>
        <div className="flex flex-col items-center justify-center" style={{ minHeight: '50vh' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 text-center max-w-sm"
          >
            <Lock size={48} style={{ color: '#525252' }} />
            <h2 className="font-syne font-bold text-xl text-[#fafafa]">Train a reward model first</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#525252' }}>
              You need at least one trained reward model before launching an RL run.
            </p>
            <button onClick={() => navigate('/train-rm')}
              className="px-5 py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-88 mt-2"
              style={{ background: '#fafafa', color: '#000' }}>
              Go to Train RM →
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">RL Loop</h1>
        <p className="text-sm mt-1" style={{ color: '#525252' }}>Reinforcement learning fine-tuning with PPO, GRPO, or DPO.</p>
      </div>

      {/* Evaluate banner */}
      <AnimatePresence>
        {showEvalBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
            <span className="text-sm font-syne font-bold" style={{ color: '#34d399' }}>
              ✓ RL run complete — view results in Evaluate!
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/evaluate')}
                className="px-3 py-1.5 rounded-full font-syne font-bold text-xs transition-opacity hover:opacity-80"
                style={{ background: '#34d399', color: '#000' }}>
                View in Evaluate →
              </button>
              <button onClick={() => setShowEvalBanner(false)} style={{ color: '#525252' }}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Config */}
      {!isRunning && !isComplete && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl space-y-5" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <h3 className="font-syne font-bold text-sm text-[#fafafa]">Configure Run</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Policy Model</label>
              <select value={policyModel} onChange={e => setPolicyModel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none" style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}>
                {POLICY_MODELS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Reward Model</label>
              <select value={rmId} onChange={e => setRmId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none" style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}>
                {rewardModels.map(m => <option key={m.id} value={m.id}>{m.name} · {m.baseModel} · {(m.accuracy * 100).toFixed(1)}% acc</option>)}
              </select>
            </div>
          </div>

          {/* Algorithm toggle */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest mb-2 block" style={{ color: '#525252' }}>Algorithm</label>
            <div className="flex gap-2">
              {ALGORITHMS.map(a => (
                <div key={a.id} className="relative group">
                  <button onClick={() => setAlgorithm(a.id)}
                    className="px-4 py-2 rounded-lg font-syne font-bold text-sm transition-all"
                    style={{ background: algorithm === a.id ? 'rgba(56,189,248,0.1)' : '#0a0a0a', border: `1px solid ${algorithm === a.id ? '#38bdf8' : '#1a1a1a'}`, color: algorithm === a.id ? '#38bdf8' : '#525252' }}>
                    {a.label}
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded font-mono text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: '#111', border: '1px solid #1a1a1a', color: '#a3a3a3' }}>
                    {a.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>
                KL Penalty — <span style={{ color: '#38bdf8' }}>β = {klPenalty.toFixed(2)}</span>
              </label>
              <input type="range" min={0} max={1} step={0.01} value={klPenalty} onChange={e => setKlPenalty(Number(e.target.value))} className="w-full" />
              <p className="font-mono text-[10px] mt-1" style={{ color: '#525252' }}>Higher = stays closer to base model</p>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Rollouts</label>
              <input
                type="number" value={rollouts} min={4} max={256} step={1}
                onChange={e => setRollouts(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#000', border: `1px solid ${(Number(rollouts) < 4 || Number(rollouts) > 256 || !Number.isInteger(Number(rollouts))) ? '#f43f5e' : '#1a1a1a'}`, color: '#fafafa' }}
                onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onBlur={e => e.currentTarget.style.borderColor = (Number(rollouts) < 4 || Number(rollouts) > 256 || !Number.isInteger(Number(rollouts))) ? '#f43f5e' : '#1a1a1a'}
              />
              {(Number(rollouts) < 4 || Number(rollouts) > 256 || !Number.isInteger(Number(rollouts))) && (
                <p className="font-mono text-[10px] mt-1" style={{ color: '#f43f5e' }}>Must be between 4 and 256</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Max Steps</label>
              <input
                type="number" value={maxSteps} min={100} max={10000} step={1}
                onChange={e => setMaxSteps(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#000', border: `1px solid ${(Number(maxSteps) < 100 || Number(maxSteps) > 10000 || !Number.isInteger(Number(maxSteps))) ? '#f43f5e' : '#1a1a1a'}`, color: '#fafafa' }}
                onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onBlur={e => e.currentTarget.style.borderColor = (Number(maxSteps) < 100 || Number(maxSteps) > 10000 || !Number.isInteger(Number(maxSteps))) ? '#f43f5e' : '#1a1a1a'}
              />
              {(Number(maxSteps) < 100 || Number(maxSteps) > 10000 || !Number.isInteger(Number(maxSteps))) && (
                <p className="font-mono text-[10px] mt-1" style={{ color: '#f43f5e' }}>Must be between 100 and 10,000</p>
              )}
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Random Seed</label>
              <input
                type="number" value={seed} min={0} max={99999} step={1}
                onChange={e => setSeed(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#000', border: `1px solid ${(Number(seed) < 0 || Number(seed) > 99999 || !Number.isInteger(Number(seed))) ? '#f43f5e' : '#1a1a1a'}`, color: '#fafafa' }}
                onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onBlur={e => e.currentTarget.style.borderColor = (Number(seed) < 0 || Number(seed) > 99999 || !Number.isInteger(Number(seed))) ? '#f43f5e' : '#1a1a1a'}
              />
              {(Number(seed) < 0 || Number(seed) > 99999 || !Number.isInteger(Number(seed))) && (
                <p className="font-mono text-[10px] mt-1" style={{ color: '#f43f5e' }}>Must be between 0 and 99,999</p>
              )}
            </div>
          </div>

          <button onClick={startRun}
            className="w-full py-4 rounded-full font-syne font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: '#fafafa', color: '#000', boxShadow: '0 0 0 0 transparent' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(255,255,255,0.08)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent'}>
            <Play size={16} /> Launch Training Run →
          </button>
        </motion.div>
      )}

      {/* Live run */}
      {isRunning && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'MEAN REWARD', value: liveMetrics.reward.toFixed(4), color: '#38bdf8' },
              { label: 'STD DEV', value: liveMetrics.std.toFixed(4), color: '#f472b6' },
              { label: 'KL DIV', value: liveMetrics.kl.toFixed(4), color: '#34d399' },
              { label: 'STEPS', value: currentStep.toString(), color: '#f59e0b' },
            ].map(m => (
              <motion.div key={m.label}
                className="relative p-3 rounded-xl overflow-hidden"
                style={{ background: '#0a0a0a', border: `1px solid rgba(245,158,11,0.4)` }}
                animate={{ borderColor: ['rgba(245,158,11,0.4)', 'rgba(245,158,11,0.8)', 'rgba(245,158,11,0.4)'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)' }} />
                <div className="font-mono text-[9px] mb-1.5 uppercase tracking-widest" style={{ color: '#525252' }}>{m.label}</div>
                <div className="font-syne font-extrabold text-xl" style={{ color: m.color }}>{m.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Reward', data: rewardHistory, key: 'reward', color: '#38bdf8' },
              { title: 'KL Divergence', data: klHistory, key: 'kl', color: '#34d399', refLine: klPenalty, refLabel: `β = ${klPenalty.toFixed(2)}` },
              { title: 'Policy Loss', data: lossHistory, key: 'loss', color: '#f472b6' },
            ].map(chart => (
              <div key={chart.title} className="p-4 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                <h4 className="font-syne font-bold text-xs text-[#fafafa] mb-3">{chart.title}</h4>
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                      <XAxis dataKey="step" stroke="#333" fontSize={9} tick={{ fill: '#333' }} fontFamily="Space Mono" />
                      <YAxis stroke="#333" fontSize={9} tick={{ fill: '#333' }} fontFamily="Space Mono" />
                      <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', fontSize: 10, fontFamily: 'Space Mono' }} />
                      {'refLine' in chart && chart.refLine !== undefined && (
                        <ReferenceLine y={chart.refLine} stroke={chart.color} strokeDasharray="4 4" label={{ value: chart.refLabel, fill: chart.color, fontSize: 9, fontFamily: 'Space Mono' }} />
                      )}
                      <Line type="monotone" dataKey={chart.key} stroke={chart.color} strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Complete */}
      {isComplete && finalRun && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl"
          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
          <div>
            <p className="font-syne font-bold text-sm" style={{ color: '#34d399' }}>✓ Run complete — {finalRun.id} saved</p>
            <p className="font-mono text-[10px] mt-0.5" style={{ color: '#525252' }}>Final reward: {finalRun.finalReward.toFixed(3)} · KL: {finalRun.klDivergence.toFixed(4)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/evaluate')} className="px-3 py-2 rounded-full font-syne font-bold text-xs" style={{ background: '#fafafa', color: '#000' }}>View in Evaluate →</button>
            <button onClick={() => setIsComplete(false)} className="px-3 py-2 rounded-full font-syne font-bold text-xs" style={{ border: '1px solid #1a1a1a', color: '#fafafa' }}>New Run</button>
          </div>
        </motion.div>
      )}

      {/* Run history */}
      {rlRuns.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-syne font-bold text-sm text-[#fafafa]">Run History</h3>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#525252' }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search runs..."
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fafafa' }} />
            </div>
            <div className="flex gap-2">
              {['All', 'PPO', 'GRPO', 'DPO', 'Completed', 'Failed'].map(f => (
                <button key={f} onClick={() => f === 'Completed' || f === 'Failed' ? setFilterStatus(f) : setFilterAlgo(f)}
                  className="px-3 py-1.5 rounded-full font-mono text-[10px] transition-all"
                  style={{ background: (filterAlgo === f || filterStatus === f) ? 'rgba(56,189,248,0.1)' : '#0a0a0a', border: `1px solid ${(filterAlgo === f || filterStatus === f) ? 'rgba(56,189,248,0.4)' : '#1a1a1a'}`, color: (filterAlgo === f || filterStatus === f) ? '#38bdf8' : '#525252' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a1a1a' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
                  {['Run ID', 'Algorithm', 'Final Reward', 'KL Div', 'Steps', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest" style={{ color: '#525252' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRuns.map((r, i) => {
                  const isBest = bestRun?.id === r.id;
                  return (
                    <tr key={r.id} style={{ borderBottom: i < filteredRuns.length - 1 ? '1px solid #0f0f0f' : 'none', background: isBest ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px]" style={{ color: '#a3a3a3' }}>{r.id}</span>
                          {isBest && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>★ Best</span>}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: r.algorithm === 'PPO' ? 'rgba(56,189,248,0.1)' : r.algorithm === 'GRPO' ? 'rgba(244,114,182,0.1)' : 'rgba(167,139,250,0.1)', color: r.algorithm === 'PPO' ? '#38bdf8' : r.algorithm === 'GRPO' ? '#f472b6' : '#a78bfa' }}>{r.algorithm}</span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] font-bold" style={{ color: '#34d399' }}>{r.finalReward.toFixed(3)}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: '#a3a3a3' }}>{r.klDivergence.toFixed(4)}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: '#525252' }}>{r.maxSteps}</td>
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
                          ✓ Completed
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[9px]" style={{ color: '#333' }}>{new Date(r.timestamp).toLocaleDateString('en-GB')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
