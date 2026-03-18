import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { LogoMark } from './Logo';
import { useApp } from '@/context/AppContext';

const SUGGESTIONS = [
  "Why is my KL divergence high?",
  "How many comparisons do I need?",
  "Which algorithm should I use?",
];

function buildSystemPrompt(comparisons: number, ratings: number, rewardModels: number, rlRuns: number, lastReward?: number, lastAccuracy?: number) {
  return `You are the RewardForge AI Copilot, an expert in RLHF (Reinforcement Learning from Human Feedback). You help users understand and navigate their RLHF training pipeline. Answer in plain English. Keep responses concise (2–4 sentences max). Use specific numbers from the user's context when available.
Current user state:
- Comparisons collected: ${comparisons}
- Ratings collected: ${ratings}
- Reward models trained: ${rewardModels}
- RL runs completed: ${rlRuns}${lastReward !== undefined ? `\n- Latest RL run reward: ${lastReward.toFixed(3)}` : ''}${lastAccuracy !== undefined ? `\n- Latest RM accuracy: ${(lastAccuracy * 100).toFixed(1)}%` : ''}
Be helpful, precise, and encouraging.`;
}

export function CopilotPanel() {
  const { copilotOpen, setCopilotOpen, copilotHistory, setCopilotHistory, comparisons, ratings, rewardModels, rlRuns } = useApp();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotHistory, streamedText, isThinking]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isThinking || isStreaming) return;
    setInput('');

    const userMsg = { role: 'user' as const, content: msg, timestamp: new Date() };
    const updatedHistory = [...copilotHistory, userMsg];
    setCopilotHistory(updatedHistory);
    setIsThinking(true);

    // Simulate response (Claude API would go here)
    await new Promise(r => setTimeout(r, 900));
    setIsThinking(false);

    const responses: Record<string, string> = {
      "Why is my KL divergence high?": "High KL divergence means your policy is drifting far from the base model. Try increasing your β penalty to 0.15–0.2 in the RL Loop settings. This keeps the model closer to the reference weights while still improving the reward signal.",
      "How many comparisons do I need?": "For a first working reward model, 5–10 comparisons is enough to start, but 50–200 yields much better signal. You currently have " + comparisons.length + " — " + (comparisons.length >= 5 ? "you're ready to train!" : "collect a few more before training."),
      "Which algorithm should I use?": "For most use cases, start with PPO — it's stable and well-understood. GRPO (used by DeepSeek R1) is great if you want group-relative optimization. DPO skips the reward model entirely and trains directly on preferences — fastest to iterate but less flexible.",
    };

    const fallback = comparisons.length === 0
      ? "Start by collecting at least 5 pairwise comparisons in the Annotate tab. This preference data is the foundation of your reward model."
      : rewardModels.length === 0
      ? `You have ${comparisons.length} comparisons — great! Head to Train RM to train your first reward model. GPT-2 trains fastest if you want quick results.`
      : `Your pipeline is looking good! You have ${rewardModels.length} reward model(s) and ${rlRuns.length} RL run(s). ${rlRuns.length === 0 ? "Try launching a PPO run in the RL Loop tab." : "Check the Evaluate tab to compare your runs side by side."}`;

    const assistantContent = responses[msg] ?? fallback;

    // Typewriter effect
    setIsStreaming(true);
    const words = assistantContent.split(' ');
    let built = '';
    for (let i = 0; i < words.length; i++) {
      built += (i === 0 ? '' : ' ') + words[i];
      setStreamedText(built);
      await new Promise(r => setTimeout(r, 40));
    }
    setIsStreaming(false);
    setStreamedText('');

    setCopilotHistory([...updatedHistory, {
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date(),
    }]);
  };

  const lastRun = rlRuns[0];
  const lastRM = rewardModels[0];

  return (
    <AnimatePresence>
      {copilotOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setCopilotOpen(false)}
          />
          <motion.div
            initial={{ x: 360 }} animate={{ x: 0 }} exit={{ x: 360 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-[360px] flex flex-col z-50 shadow-2xl"
            style={{ background: '#000', borderLeft: '1px solid #1a1a1a' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid #1a1a1a' }}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg" style={{ background: 'rgba(56,189,248,0.1)' }}>
                  <Sparkles size={16} style={{ color: '#38bdf8' }} />
                </div>
                <span className="font-syne font-bold text-sm text-[#fafafa]">RewardForge Copilot</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse inline-block" />
                  LIVE
                </span>
              </div>
              <button onClick={() => setCopilotOpen(false)} style={{ color: '#525252' }}>
                <X size={16} />
              </button>
            </div>

            {/* Context */}
            <div className="mx-4 mt-3 mb-1 px-3 py-2 rounded-lg font-mono text-[9px]"
              style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#525252' }}>
              {comparisons.length} comparisons · {rewardModels.length} models · {rlRuns.length} RL runs
              {lastRM && ` · ${(lastRM.accuracy * 100).toFixed(1)}% acc`}
              {lastRun && ` · ${lastRun.finalReward.toFixed(3)} reward`}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {copilotHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-5 h-5 rounded shrink-0 mr-2 mt-0.5 flex items-center justify-center"
                      style={{ background: 'rgba(56,189,248,0.1)' }}>
                      <LogoMark size={14} />
                    </div>
                  )}
                  <div
                    className="max-w-[85%] p-3 text-[12px] leading-relaxed"
                    style={{
                      background: m.role === 'user' ? '#111' : '#071020',
                      border: `1px solid ${m.role === 'user' ? '#1a1a1a' : 'rgba(56,189,248,0.15)'}`,
                      borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                      color: m.role === 'user' ? '#a3a3a3' : '#e2e8f0',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="w-5 h-5 rounded shrink-0 mr-2 mt-0.5 flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.1)' }}>
                    <LogoMark size={14} />
                  </div>
                  <div className="p-3 rounded-xl flex items-center gap-1"
                    style={{ background: '#071020', border: '1px solid rgba(56,189,248,0.15)' }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: '#38bdf8', animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {isStreaming && streamedText && (
                <div className="flex justify-start">
                  <div className="w-5 h-5 rounded shrink-0 mr-2 mt-0.5 flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.1)' }}>
                    <LogoMark size={14} />
                  </div>
                  <div className="max-w-[85%] p-3 text-[12px] leading-relaxed"
                    style={{ background: '#071020', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '10px 10px 10px 2px', color: '#e2e8f0' }}>
                    {streamedText}
                    {/* Blinking blue cursor */}
                    <motion.span
                      className="inline-block ml-0.5 w-[7px] h-[13px] rounded-[1px] align-text-bottom"
                      style={{ background: '#38bdf8' }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'steps(1)' }}
                    />
                  </div>
                </div>
              )}

              {/* Suggestions (only when just the welcome message) */}
              {copilotHistory.length === 1 && !isThinking && !isStreaming && (
                <div className="space-y-2 mt-2">
                  <p className="font-mono text-[9px] text-[#333] uppercase tracking-widest">Suggested</p>
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => handleSend(s)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#a3a3a3' }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4" style={{ borderTop: '1px solid #1a1a1a', background: '#0a0a0a' }}>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask anything about RLHF..."
                  rows={2}
                  className="w-full pr-10 px-3 py-2.5 rounded-xl text-xs resize-none outline-none transition-all font-mono"
                  style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                  onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isThinking || isStreaming}
                  className="absolute right-2.5 bottom-2.5 p-1.5 rounded-lg transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{ background: '#38bdf8' }}
                >
                  <ChevronRight size={14} color="#000" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
