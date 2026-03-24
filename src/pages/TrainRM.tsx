import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Search, CheckCircle2, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp, type RewardModel } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

const BASE_MODELS = ['GPT-2 (117M)', 'GPT-J 6B', 'LLaMA 7B', 'Mistral 7B', 'Custom'];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatTimestamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

// ── Details Modal ─────────────────────────────────────────────
function ModelDetailsModal({ model, onClose, onHFHub }: { model: RewardModel; onClose: () => void; onHFHub: () => void }) {
  const navigate = useNavigate();
  const lossData = model.lossHistory.length > 0
    ? model.lossHistory.map((v, i) => ({ step: i + 1, loss: v }))
    : Array.from({ length: 8 }, (_, i) => ({ step: i + 1, loss: +(0.85 - i * 0.07 + (Math.random() - 0.5) * 0.04).toFixed(4) }));

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
          zIndex: 50, width: '100%', maxWidth: 500,
          background: '#0a0a0a', border: '1px solid #1a1a1a',
          borderRadius: 12, padding: 24,
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-syne font-bold text-base text-[#fafafa]">{model.name}</h2>
          <button onClick={onClose} style={{ color: '#525252' }}>✕</button>
        </div>

        <div className="space-y-2 mb-5">
          {[
            { label: 'Base Model', value: <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}>{model.baseModel}</span> },
            { label: 'Accuracy', value: <span style={{ color: '#34d399' }} className="font-mono text-sm font-bold">{(model.accuracy * 100).toFixed(1)}%</span> },
            { label: 'Loss', value: <span style={{ color: '#f472b6' }} className="font-mono text-sm">{model.loss.toFixed(4)}</span> },
            { label: 'Trained', value: <span style={{ color: '#a3a3a3' }} className="font-mono text-xs">{model.timestamp.toLocaleDateString()}</span> },
            { label: 'Duration', value: <span style={{ color: '#525252' }} className="font-mono text-xs">~14 seconds (GPU simulated)</span> },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #0f0f0f' }}>
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#525252' }}>{row.label}</span>
              {row.value}
            </div>
          ))}
        </div>

        <div className="mb-5">
          <h4 className="font-syne font-bold text-xs text-[#fafafa] mb-3">Loss Curve</h4>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lossData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="step" stroke="#333" fontSize={9} tick={{ fill: '#333' }} fontFamily="Space Mono" />
                <YAxis stroke="#333" fontSize={9} tick={{ fill: '#333' }} domain={[0, 1]} fontFamily="Space Mono" />
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', fontSize: 10, fontFamily: 'Space Mono' }} />
                <Line type="monotone" dataKey="loss" stroke="#f472b6" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { onClose(); navigate('/rl-loop'); }}
            className="flex-1 py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#fafafa', color: '#000' }}>
            Use in RL Loop →
          </button>
          <button onClick={() => { onClose(); onHFHub(); }}
            className="flex-1 py-2.5 rounded-full font-syne font-bold text-sm transition-all"
            style={{ border: '1px solid rgba(56,189,248,0.4)', color: '#38bdf8' }}>
            Push to HF Hub
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── HF Hub Modal ──────────────────────────────────────────────
function HFHubModal({ onClose, modelName, onToast }: { onClose: () => void; modelName: string; onToast: (msg: string, type: 'info' | 'success') => void }) {
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState(`rewardforge-demo/${modelName.toLowerCase()}`);
  const [tokenError, setTokenError] = useState('');

  const isTokenValid = token.startsWith('hf_') && token.length > 4;

  const handleTokenChange = (val: string) => {
    setToken(val);
    if (val.length > 0 && !val.startsWith('hf_')) {
      setTokenError('Token must start with hf_');
    } else {
      setTokenError('');
    }
  };

  const handlePush = () => {
    if (!isTokenValid) return;
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
            <input type="password" value={token} onChange={e => handleTokenChange(e.target.value)}
              placeholder="hf_xxxxxxxxxxxx"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#000', border: `1px solid ${tokenError ? '#f43f5e' : '#1a1a1a'}`, color: '#fafafa' }}
              onFocus={e => e.currentTarget.style.borderColor = tokenError ? '#f43f5e' : '#38bdf8'}
              onBlur={e => e.currentTarget.style.borderColor = tokenError ? '#f43f5e' : '#1a1a1a'}
            />
            {tokenError ? (
              <p className="font-mono text-[10px] mt-1" style={{ color: '#f43f5e' }}>{tokenError}</p>
            ) : (
              <p className="font-mono text-[9px] mt-1" style={{ color: '#525252' }}>
                Get yours at huggingface.co/settings/tokens
              </p>
            )}
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
            disabled={!isTokenValid}
            className="w-full py-3 rounded-full font-syne font-bold text-sm transition-opacity"
            style={{
              background: isTokenValid ? '#fafafa' : '#1a1a1a',
              color: isTokenValid ? '#000' : '#525252',
              cursor: isTokenValid ? 'pointer' : 'not-allowed',
              opacity: isTokenValid ? 1 : 0.5,
            }}>
            Push model →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TrainRM() {
  const { comparisons, ratings, rewardModels, addRewardModel, addToast } = useApp();
  const navigate = useNavigate();
  const [baseModel, setBaseModel] = useState('GPT-2 (117M)');
  const [lr, setLr] = useState('0.00002');
  const [batchSize, setBatchSize] = useState('8');
  const [epochs, setEpochs] = useState('3');
  const [splitPct, setSplitPct] = useState(80);
  const [warmup, setWarmup] = useState('100');
  const [weightDecay, setWeightDecay] = useState('0.01');
  const [maxSeqLen, setMaxSeqLen] = useState('512');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [filterModel, setFilterModel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<RewardModel | null>(null);
  const [hfHubModel, setHfHubModel] = useState<RewardModel | null>(null);
  const [showRLBanner, setShowRLBanner] = useState(false);

  const [isTraining, setIsTraining] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lossHistory, setLossHistory] = useState<{ step: number; value: number }[]>([]);
  const [accHistory, setAccHistory] = useState<{ step: number; value: number }[]>([]);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finalModel, setFinalModel] = useState<RewardModel | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = Number(epochs) * 8;
  const canTrain = comparisons.length >= 5;

  const filteredModels = rewardModels.filter(m => {
    const matchesModel = filterModel === 'All' || m.baseModel.includes(filterModel);
    const matchesSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.baseModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModel && matchesSearch;
  });

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [logLines]);

  const startTraining = () => {
    if (!canTrain) return;
    setIsTraining(true);
    setIsComplete(false);
    setLossHistory([]);
    setAccHistory([]);
    setLogLines([[`[${formatTimestamp()}] Starting training: ${baseModel}`], [`[${formatTimestamp()}] Dataset: ${comparisons.length} comparisons, ${ratings.length} ratings`], [`[${formatTimestamp()}] Learning rate: ${lr} | Batch: ${batchSize} | Epochs: ${epochs}`]].flat());
    setCurrentStep(0);
    setElapsed(0);
    addToast({ type: 'info', message: `Training started · RM-v${rewardModels.length + 1}` });

    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    let step = 0;
    let loss = 0.852;
    let acc = 0.512;

    intervalRef.current = setInterval(() => {
      step++;
      loss = Math.max(0.28, loss - (0.572 / totalSteps) + (Math.random() - 0.5) * 0.04);
      acc = Math.min(0.91, acc + (0.39 / totalSteps) + (Math.random() - 0.5) * 0.02);

      setLossHistory(prev => [...prev, { step, value: +loss.toFixed(4) }]);
      setAccHistory(prev => [...prev, { step, value: +acc.toFixed(4) }]);
      setCurrentStep(step);

      if (step % 2 === 0) {
        const epoch = Math.ceil(step / 8);
        setLogLines(prev => [...prev, `[${formatTimestamp()}] Epoch ${epoch}/3 · step ${step}/${totalSteps} · loss: ${loss.toFixed(4)} · acc: ${(acc * 100).toFixed(1)}%`]);
      }

      if (step >= totalSteps) {
        clearInterval(intervalRef.current!);
        clearInterval(timerRef.current!);
        setIsTraining(false);
        setIsComplete(true);

        const newModel: RewardModel = {
          id: crypto.randomUUID(),
          name: `RM-v${rewardModels.length + 1}`,
          baseModel,
          accuracy: acc,
          loss,
          epochs: Number(epochs),
          lossHistory: [],
          accuracyHistory: [],
          timestamp: new Date(),
        };
        setFinalModel(newModel);
        addRewardModel(newModel);
        setLogLines(prev => [...prev, `[${formatTimestamp()}] ✓ Training complete · Final acc: ${(acc * 100).toFixed(1)}% · loss: ${loss.toFixed(4)}`]);
        addToast({ type: 'success', message: `✓ RM-v${rewardModels.length + 1} ready · ${(acc * 100).toFixed(1)}% accuracy` });
        setShowRLBanner(true);
      }
    }, 600);
  };

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const currentLoss = lossHistory[lossHistory.length - 1]?.value ?? 0;
  const currentAcc = accHistory[accHistory.length - 1]?.value ?? 0;

  // ── LOCKED STATE ─────────────────────────────────────────────
  if (!canTrain) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">Train RM</h1>
          <p className="text-sm mt-1" style={{ color: '#525252' }}>Train a reward model on your collected annotation data.</p>
        </div>
        <div className="flex flex-col items-center justify-center" style={{ minHeight: '50vh' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 text-center max-w-sm"
          >
            <Lock size={48} style={{ color: '#525252' }} />
            <h2 className="font-syne font-bold text-xl text-[#fafafa]">Complete annotations first</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#525252' }}>
              You have <span style={{ color: '#f59e0b' }}>{comparisons.length}</span> comparisons. Need{' '}
              <span style={{ color: '#38bdf8' }}>{5 - comparisons.length} more</span> to start training.
            </p>
            <button onClick={() => navigate('/annotate')}
              className="px-5 py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-88 mt-2"
              style={{ background: '#fafafa', color: '#000' }}>
              Go to Annotate →
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">Train RM</h1>
        <p className="text-sm mt-1" style={{ color: '#525252' }}>Train a reward model on your collected annotation data.</p>
      </div>

      {/* RL Loop ready banner */}
      <AnimatePresence>
        {showRLBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
            <span className="text-sm font-syne font-bold" style={{ color: '#34d399' }}>
              ✓ Reward model trained — ready to launch RL!
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/rl-loop')}
                className="px-3 py-1.5 rounded-full font-syne font-bold text-xs transition-opacity hover:opacity-80"
                style={{ background: '#34d399', color: '#000' }}>
                Launch RL Loop →
              </button>
              <button onClick={() => setShowRLBanner(false)} style={{ color: '#525252' }}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dataset cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'COMPARISONS READY', value: comparisons.length, color: comparisons.length >= 5 ? '#34d399' : '#f59e0b', icon: comparisons.length >= 5 ? '✓' : '⚠', sub: comparisons.length >= 5 ? 'Ready to train' : `Need ${5 - comparisons.length} more` },
          { label: 'RATINGS COLLECTED', value: ratings.length, color: '#38bdf8', icon: '★', sub: 'Adds quality signal' },
          { label: 'STATUS', value: null, color: comparisons.length >= 5 ? '#34d399' : '#f59e0b', icon: comparisons.length >= 5 ? '✓' : '⚠', sub: comparisons.length >= 5 ? 'Ready to Train' : 'Need more data' },
        ].map((c, i) => (
          <div key={i} className="relative p-4 rounded-xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: c.color }}>{c.icon}</span>
              <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: '#525252' }}>{c.label}</span>
            </div>
            <div className="font-syne font-extrabold text-2xl" style={{ color: c.color }}>
              {c.value !== null ? c.value : <span className="font-mono text-[11px]" style={{ color: c.color }}>{c.sub}</span>}
            </div>
            {c.value !== null && <div className="text-[11px] mt-1" style={{ color: '#525252' }}>{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Config form */}
      {!isTraining && !isComplete && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl space-y-4" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <h3 className="font-syne font-bold text-sm text-[#fafafa]">Configure Training</h3>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Base Model</label>
            <div className="relative">
              <select value={baseModel} onChange={e => setBaseModel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm appearance-none outline-none cursor-pointer"
                style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}>
                {BASE_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#525252' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Learning Rate */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Learning Rate</label>
              <input
                type="number" value={lr} min={0.00001} max={0.0001} step={0.00001}
                maxLength={10}
                onChange={e => setLr(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#000', border: `1px solid ${Number(lr) < 0.00001 || Number(lr) > 0.0001 ? '#f43f5e' : '#1a1a1a'}`, color: '#fafafa' }}
                onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onBlur={e => e.currentTarget.style.borderColor = Number(lr) < 0.00001 || Number(lr) > 0.0001 ? '#f43f5e' : '#1a1a1a'}
              />
              {(Number(lr) < 0.00001 || Number(lr) > 0.0001) && (
                <p className="font-mono text-[10px] mt-1" style={{ color: '#f43f5e' }}>Must be between 1e-5 and 1e-4</p>
              )}
              {!(Number(lr) < 0.00001 || Number(lr) > 0.0001) && (
                <p className="font-mono text-[10px] mt-1" style={{ color: '#525252' }}>Range: 1e-5 to 1e-4</p>
              )}
            </div>
            {/* Batch Size */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Batch Size</label>
              <input
                type="number" value={batchSize} min={1} max={64} step={1}
                onChange={e => setBatchSize(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#000', border: `1px solid ${(Number(batchSize) < 1 || Number(batchSize) > 64 || !Number.isInteger(Number(batchSize))) ? '#f43f5e' : '#1a1a1a'}`, color: '#fafafa' }}
                onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onBlur={e => e.currentTarget.style.borderColor = (Number(batchSize) < 1 || Number(batchSize) > 64 || !Number.isInteger(Number(batchSize))) ? '#f43f5e' : '#1a1a1a'}
              />
              {(Number(batchSize) < 1 || Number(batchSize) > 64 || !Number.isInteger(Number(batchSize))) && (
                <p className="font-mono text-[10px] mt-1" style={{ color: '#f43f5e' }}>Must be between 1 and 64</p>
              )}
              {!(Number(batchSize) < 1 || Number(batchSize) > 64 || !Number.isInteger(Number(batchSize))) && (
                <p className="font-mono text-[10px] mt-1" style={{ color: '#525252' }}>Larger = faster but more GPU memory</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Epochs */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Epochs</label>
              <input
                type="number" value={epochs} min={1} max={10} step={1}
                onChange={e => setEpochs(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: '#000', border: `1px solid ${(Number(epochs) < 1 || Number(epochs) > 10 || !Number.isInteger(Number(epochs))) ? '#f43f5e' : '#1a1a1a'}`, color: '#fafafa' }}
                onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onBlur={e => e.currentTarget.style.borderColor = (Number(epochs) < 1 || Number(epochs) > 10 || !Number.isInteger(Number(epochs))) ? '#f43f5e' : '#1a1a1a'}
              />
              {(Number(epochs) < 1 || Number(epochs) > 10 || !Number.isInteger(Number(epochs))) && (
                <p className="font-mono text-[10px] mt-1" style={{ color: '#f43f5e' }}>Must be between 1 and 10</p>
              )}
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>
                Train/Val Split — <span style={{ color: '#38bdf8' }}>{splitPct}% / {100 - splitPct}%</span>
              </label>
              <input type="range" min={70} max={95} value={splitPct} onChange={e => setSplitPct(Number(e.target.value))} className="w-full mt-2" />
            </div>
          </div>

          <button onClick={() => setAdvancedOpen(v => !v)} className="flex items-center gap-2 text-xs font-syne" style={{ color: '#525252' }}>
            <ChevronDown size={13} className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
            Advanced settings
          </button>

          <AnimatePresence>
            {advancedOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {/* Warmup Steps */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Warmup Steps</label>
                    <input
                      type="number" value={warmup} min={0} max={1000} step={1}
                      onChange={e => setWarmup(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: '#000', border: `1px solid ${(Number(warmup) < 0 || Number(warmup) > 1000) ? '#f43f5e' : '#1a1a1a'}`, color: '#fafafa' }}
                    />
                    {(Number(warmup) < 0 || Number(warmup) > 1000) && (
                      <p className="font-mono text-[9px] mt-1" style={{ color: '#f43f5e' }}>0–1000</p>
                    )}
                  </div>
                  {/* Weight Decay */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Weight Decay</label>
                    <input
                      type="number" value={weightDecay} min={0} max={0.1} step={0.001}
                      onChange={e => setWeightDecay(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: '#000', border: `1px solid ${(Number(weightDecay) < 0 || Number(weightDecay) > 0.1) ? '#f43f5e' : '#1a1a1a'}`, color: '#fafafa' }}
                    />
                    {(Number(weightDecay) < 0 || Number(weightDecay) > 0.1) && (
                      <p className="font-mono text-[9px] mt-1" style={{ color: '#f43f5e' }}>0–0.1</p>
                    )}
                  </div>
                  {/* Max Seq Length */}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest mb-1.5 block" style={{ color: '#525252' }}>Max Seq Length</label>
                    <select
                      value={maxSeqLen}
                      onChange={e => setMaxSeqLen(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
                      style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}
                    >
                      {['128', '256', '512', '1024', '2048'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={startTraining}
            className="w-full py-3.5 rounded-full font-syne font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: '#fafafa', color: '#000' }}>
            <Play size={15} /> Start Training →
          </button>
        </motion.div>
      )}

      {/* Training in progress */}
      {isTraining && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-4 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #f59e0b50' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                <span className="font-syne font-bold text-sm text-[#fafafa]">Training in Progress</span>
              </div>
              <div className="font-mono text-[10px]" style={{ color: '#525252' }}>
                Epoch {Math.ceil(currentStep / 8) || 1}/3 · Step {currentStep}/{totalSteps} · {formatTime(elapsed)}
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#111' }}>
              <motion.div className="h-full rounded-full" style={{ background: '#f59e0b' }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-syne font-bold text-xs text-[#fafafa]">Loss</span>
                <span className="font-mono text-[11px] font-bold" style={{ color: '#f472b6' }}>{currentLoss.toFixed(4)}</span>
              </div>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lossHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                    <XAxis dataKey="step" stroke="#333" fontSize={9} tick={{ fill: '#333' }} fontFamily="Space Mono" />
                    <YAxis stroke="#333" fontSize={9} tick={{ fill: '#333' }} domain={[0, 1]} fontFamily="Space Mono" />
                    <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', fontSize: 10, fontFamily: 'Space Mono' }} />
                    <Line type="monotone" dataKey="value" stroke="#f472b6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-syne font-bold text-xs text-[#fafafa]">Accuracy</span>
                <span className="font-mono text-[11px] font-bold" style={{ color: '#34d399' }}>{(currentAcc * 100).toFixed(1)}%</span>
              </div>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                    <XAxis dataKey="step" stroke="#333" fontSize={9} tick={{ fill: '#333' }} fontFamily="Space Mono" />
                    <YAxis stroke="#333" fontSize={9} tick={{ fill: '#333' }} domain={[0, 1]} fontFamily="Space Mono" />
                    <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #1a1a1a', fontSize: 10, fontFamily: 'Space Mono' }} />
                    <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 rounded-xl flex flex-col" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
              <div className="flex items-center gap-1.5 mb-3">
                {['#f43f5e', '#f59e0b', '#34d399'].map(c => <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
                <span className="font-mono text-[9px] ml-1" style={{ color: '#333' }}>training.log</span>
              </div>
              <div ref={logRef} className="flex-1 overflow-y-auto h-[140px] space-y-0.5">
                <AnimatePresence initial={false}>
                  {logLines.map((line, i) => {
                    const isLast = i === logLines.length - 1;
                    return (
                      <motion.div
                        key={`log-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="font-mono text-[10px] leading-relaxed flex items-center gap-0"
                        style={{ color: '#34d399' }}
                      >
                        <span>{line}</span>
                        {isLast && isTraining && (
                          <motion.span
                            className="inline-block ml-0.5 w-[7px] h-[12px] rounded-[1px]"
                            style={{ background: '#34d399', display: 'inline-block' }}
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Complete */}
      {isComplete && finalModel && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
            <CheckCircle2 size={18} style={{ color: '#34d399' }} />
            <span className="font-syne font-bold text-sm" style={{ color: '#34d399' }}>✓ Training Complete — {finalModel.name} saved to registry</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'FINAL ACCURACY', value: `${(finalModel.accuracy * 100).toFixed(1)}%`, color: '#34d399' },
              { label: 'FINAL LOSS', value: finalModel.loss.toFixed(4), color: '#f472b6' },
              { label: 'DURATION', value: formatTime(elapsed), color: '#38bdf8' },
            ].map(c => (
              <div key={c.label} className="relative p-4 rounded-xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
                <div className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: '#525252' }}>{c.label}</div>
                <div className="font-syne font-extrabold text-2xl" style={{ color: c.color }}>{c.value}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setIsComplete(false)} className="flex-1 py-3 rounded-full font-syne font-bold text-sm transition-all"
              style={{ background: '#fafafa', color: '#000' }}>Train Another</button>
          </div>
        </motion.div>
      )}

      {/* Model registry */}
      {rewardModels.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-syne font-bold text-sm text-[#fafafa]">Model Registry</h3>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#525252' }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search models..."
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fafafa' }} />
            </div>
            <div className="flex gap-2">
              {['All', 'GPT-2', 'LLaMA', 'Mistral'].map(f => (
                <button key={f} onClick={() => setFilterModel(f)}
                  className="px-3 py-1.5 rounded-full font-mono text-[10px] transition-all"
                  style={{ background: filterModel === f ? 'rgba(56,189,248,0.1)' : '#0a0a0a', border: `1px solid ${filterModel === f ? 'rgba(56,189,248,0.4)' : '#1a1a1a'}`, color: filterModel === f ? '#38bdf8' : '#525252' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a1a1a' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
                  {['Name', 'Base Model', 'Accuracy', 'Loss', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-mono text-[9px] uppercase tracking-widest" style={{ color: '#525252' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((m, i) => (
                  <tr key={m.id} style={{ borderBottom: i < filteredModels.length - 1 ? '1px solid #0f0f0f' : 'none' }}>
                    <td className="px-4 py-3">
                      <span className="font-syne font-bold text-sm" style={{ color: '#38bdf8' }}>{m.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}>{m.baseModel}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
                          <div className="h-full rounded-full" style={{ width: `${m.accuracy * 100}%`, background: '#34d399' }} />
                        </div>
                        <span className="font-mono text-[10px]" style={{ color: '#34d399' }}>{(m.accuracy * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px]" style={{ color: '#f472b6' }}>{m.loss.toFixed(4)}</td>
                    <td className="px-4 py-3 font-mono text-[9px]" style={{ color: '#333' }}>{new Date(m.timestamp).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedModel(m)} className="px-2.5 py-1 rounded font-mono text-[10px] transition-all" style={{ border: '1px solid #1a1a1a', color: '#a3a3a3' }}>Details</button>
                        <button onClick={() => setHfHubModel(m)} className="px-2.5 py-1 rounded font-mono text-[10px] transition-all" style={{ border: '1px solid #1a1a1a', color: '#38bdf8' }}>Export</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedModel && (
          <ModelDetailsModal
            model={selectedModel}
            onClose={() => setSelectedModel(null)}
            onHFHub={() => { setHfHubModel(selectedModel); setSelectedModel(null); }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hfHubModel && (
          <HFHubModal
            modelName={hfHubModel.name}
            onClose={() => setHfHubModel(null)}
            onToast={(msg, type) => addToast({ type, message: msg })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
