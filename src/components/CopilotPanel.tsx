import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight, RotateCcw } from 'lucide-react';
import { LogoMark } from './Logo';
import { useApp } from '@/context/AppContext';

const SUGGESTION_GROUPS = [
  [
    "Why is my KL divergence at 0.038?",
    "Is 5 comparisons enough to start?",
    "PPO or DPO — which should I use?",
    "What does my reward score mean?",
  ],
  [
    "Why did Response B win most comparisons?",
    "How accurate should my reward model be?",
    "What is reward hacking and how do I prevent it?",
    "How do I know when my model is ready to ship?",
  ],
];

function buildSystemPrompt(
  comparisons: number,
  ratings: number,
  rewardModels: number,
  rlRuns: number,
  lastAccuracy?: number,
  lastReward?: number,
  isDemoMode?: boolean,
) {
  if (isDemoMode) {
    return `You are the RewardForge AI Copilot helping Marcus Chen, CTO of LexAI, align his legal AI assistant for small business owners. His users need plain English legal advice, not formal legal citations. He currently has ${comparisons} comparisons collected, ${rewardModels} reward models trained, and ${rlRuns} RL runs completed. Best RM accuracy: ${lastAccuracy !== undefined ? (lastAccuracy * 100).toFixed(1) : 'none'}%. Best reward: ${lastReward !== undefined ? lastReward.toFixed(3) : 'none'}. Always answer in 2-3 sentences. Use Marcus's legal AI context in your answer. End with one specific actionable next step he can take right now.`;
  }
  return `You are the RewardForge AI Copilot, an expert in RLHF (Reinforcement Learning from Human Feedback). The user currently has:
- ${comparisons} comparisons collected
- ${ratings} ratings submitted
- ${rewardModels} reward models trained
- ${rlRuns} RL runs completed
- Latest RM accuracy: ${lastAccuracy !== undefined ? `${(lastAccuracy * 100).toFixed(1)}%` : 'none'}
- Latest RL reward: ${lastReward !== undefined ? lastReward.toFixed(3) : 'none'}

Answer each question in 2-3 sentences. Be specific — use their actual numbers when answering. Never repeat the same response twice. Always end with one actionable next step they can take right now in the app.`;
}

function buildOpeningMessage(comparisons: number, isDemoMode: boolean) {
  if (isDemoMode) {
    return `Hi Marcus! I can see LexAI has ${comparisons} comparison${comparisons !== 1 ? 's' : ''} collected on legal AI prompts. Your team consistently preferred plain English answers over formal citations. Ready to train your first reward model?`;
  }
  return `Hi! I'm your RLHF Copilot. I can see your current pipeline state and help you make the right decisions. You have ${comparisons} comparison${comparisons !== 1 ? 's' : ''} collected. What would you like to know?`;
}

export function CopilotPanel() {
  const { copilotOpen, setCopilotOpen, copilotHistory, setCopilotHistory, comparisons, ratings, rewardModels, rlRuns } = useApp();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [suggestionGroup, setSuggestionGroup] = useState(0);
  const [usedSuggestions, setUsedSuggestions] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  const isDemoMode = localStorage.getItem('rf_demo_mode') === 'marcus';
  const lastRun = rlRuns[0];
  const lastRM = rewardModels[0];

  // Inject opening message when panel first opens with empty history
  useEffect(() => {
    if (copilotOpen && copilotHistory.length === 0) {
      const openingMsg = buildOpeningMessage(comparisons.length, isDemoMode);
      setCopilotHistory([{ role: 'assistant', content: openingMsg, timestamp: new Date() }]);
    }
  }, [copilotOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotHistory, streamedText, isThinking]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isThinking || isStreaming) return;
    setInput('');
    if (text) setUsedSuggestions(prev => new Set([...prev, text]));

    const userMsg = { role: 'user' as const, content: msg, timestamp: new Date() };
    const updatedHistory = [...copilotHistory, userMsg];
    setCopilotHistory(updatedHistory);
    setIsThinking(true);

    await new Promise(r => setTimeout(r, 900));
    setIsThinking(false);

    const responses: Record<string, string> = {
      "Why is my KL divergence at 0.038?": `A KL of 0.038 is actually healthy — it means your policy is improving without drifting too far from the base model. The sweet spot is typically 0.02–0.08. ${rlRuns.length > 0 ? `Your current run is well-calibrated.` : ''} If it climbs above 0.1, increase your β penalty to 0.15 in the RL Loop settings.`,
      "Is 5 comparisons enough to start?": `5 comparisons is the minimum viable dataset — enough to see if your reward model can learn the signal at all. You currently have ${comparisons.length} — ${comparisons.length >= 5 ? "you're past the threshold, head to Train RM now." : `collect ${5 - comparisons.length} more, then you're ready.`} For production quality, aim for 50–200 comparisons.`,
      "Why is my KL divergence high?": `High KL divergence means your policy is drifting far from the base model. You have ${rlRuns.length} run${rlRuns.length !== 1 ? 's' : ''} — try increasing your β penalty to 0.15–0.2 in the RL Loop settings. This keeps the model closer to the reference weights while still improving the reward signal.`,
      "How many comparisons do I need?": `For a first working reward model, 5–10 comparisons is enough to start, but 50–200 yields much better signal. You currently have ${comparisons.length} — ${comparisons.length >= 5 ? "you're ready to train! Head to Train RM." : "collect " + (5 - comparisons.length) + " more in Annotate, then you can train."}`,
      "PPO or DPO — which should I use?": `Start with PPO — it's stable and well-understood${lastRM ? `, and your ${lastRM.name} reward model with ${(lastRM.accuracy * 100).toFixed(1)}% accuracy is a solid foundation` : ""}. Use DPO if you want to skip reward model training entirely and train directly on preferences. GRPO (used by DeepSeek R1) is great for group-relative optimization if you have multiple responses per prompt.`,
      "What does my reward score mean?": `Your reward score measures how well the policy has learned to produce responses preferred by your reward model${lastRun ? `. Your latest run achieved ${lastRun.finalReward.toFixed(3)} — ${lastRun.finalReward > 2 ? "that's strong performance" : lastRun.finalReward > 1 ? "good progress" : "early stage, keep training"}` : ""}. Higher is better, but watch for reward hacking — unusually long or sycophantic responses may inflate scores artificially.`,
      "Why did Response B win most comparisons?": `When Response B consistently wins, it usually means annotators prefer that style — in your case, likely the plain English approach over formal citations. ${comparisons.length > 0 ? `With ${comparisons.length} comparisons showing this pattern, your reward model will learn to strongly prefer concise, direct answers.` : ''} This is exactly the signal you want for aligning a legal AI to non-lawyer users.`,
      "How accurate should my reward model be?": `For a domain-specific use case like legal AI, aim for 75–85% accuracy on held-out pairs. ${lastRM ? `Your ${lastRM.name} is at ${(lastRM.accuracy * 100).toFixed(1)}% — ${lastRM.accuracy > 0.8 ? "that's production-ready." : lastRM.accuracy > 0.7 ? "solid, ready to run RL." : "train with more comparisons to improve."}` : "Collect 20+ comparisons first for a meaningful accuracy estimate."} Below 70% means the model hasn't learned a clear preference signal yet.`,
      "What is reward hacking and how do I prevent it?": `Reward hacking is when your policy learns to game the reward model instead of actually improving. Common signs: responses get very long, very sycophantic, or start with flattery. Prevent it with a KL penalty (β = 0.1 is a safe default) and by regularly evaluating on held-out prompts your reward model hasn't seen. The Evaluate tab will show you side-by-side diffs to spot anomalies.`,
      "How do I know when my model is ready to ship?": `A model is ready when: reward is stable (not climbing anymore), KL is under 0.1, and spot-checking 10–20 outputs shows consistently good quality. ${rlRuns.length > 0 ? `Check your latest run in the Evaluate tab — look for the reward plateau.` : "Run a PPO loop first, then evaluate in the Evaluate tab."} Final check: run it against your original prompts and compare A/B side by side.`,
    };

    const fallback = isDemoMode
      ? `For LexAI's legal AI alignment, the key signal is plain English vs citation-heavy answers. ${comparisons.length === 0 ? 'Start by annotating 5 legal prompt pairs in the Annotate tab — your users have already been implicitly telling you what they prefer.' : rewardModels.length === 0 ? `You have ${comparisons.length} annotation${comparisons.length !== 1 ? 's' : ''} — head to Train RM to turn that preference data into a reward model.` : `Your reward model is ready. Launch a PPO run in RL Loop to start fine-tuning LLaMA 3 toward plain English responses.`}`
      : comparisons.length === 0
      ? "Start by collecting at least 5 pairwise comparisons in the Annotate tab — use keyboard shortcuts A, B, T to annotate faster."
      : rewardModels.length === 0
      ? `You have ${comparisons.length} comparison${comparisons.length !== 1 ? 's' : ''} — ${comparisons.length >= 5 ? 'head to Train RM to train your first reward model. GPT-2 trains fastest.' : `collect ${5 - comparisons.length} more before training.`}`
      : `Your pipeline has ${rewardModels.length} reward model${rewardModels.length !== 1 ? 's' : ''} and ${rlRuns.length} RL run${rlRuns.length !== 1 ? 's' : ''}. ${rlRuns.length === 0 ? "Launch a PPO run in the RL Loop tab to start fine-tuning." : "Check the Evaluate tab to compare your runs side by side and export the best one."}`;

    const assistantContent = responses[msg] ?? fallback;

    setIsStreaming(true);
    const words = assistantContent.split(' ');
    let built = '';
    for (let i = 0; i < words.length; i++) {
      built += (i === 0 ? '' : ' ') + words[i];
      setStreamedText(built);
      await new Promise(r => setTimeout(r, 38));
    }
    setIsStreaming(false);
    setStreamedText('');

    setCopilotHistory([...updatedHistory, {
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date(),
    }]);
  }, [input, isThinking, isStreaming, copilotHistory, comparisons.length, rewardModels, rlRuns, isDemoMode, lastRM, lastRun, setCopilotHistory]);

  const currentSuggestions = SUGGESTION_GROUPS[suggestionGroup];
  const nextGroup = (suggestionGroup + 1) % SUGGESTION_GROUPS.length;

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

            {/* Context bar */}
            <div className="mx-4 mt-3 mb-1 px-3 py-2 rounded-lg font-mono text-[9px]"
              style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#525252' }}>
              {comparisons.length} comparisons · {rewardModels.length} models · {rlRuns.length} RL runs
              {lastRM && ` · ${(lastRM.accuracy * 100).toFixed(1)}% acc`}
              {lastRun && ` · ${lastRun.finalReward.toFixed(3)} reward`}
              {isDemoMode && <span style={{ color: '#38bdf8' }}> · Marcus / LexAI</span>}
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
                    <motion.span
                      className="inline-block ml-0.5 w-[7px] h-[13px] rounded-[1px] align-text-bottom"
                      style={{ background: '#38bdf8' }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </div>
              )}

              {/* Suggestions — show when <= 1 assistant message */}
              {copilotHistory.filter(m => m.role === 'user').length === 0 && !isThinking && !isStreaming && (
                <div className="space-y-2 mt-2">
                  <p className="font-mono text-[9px] text-[#333] uppercase tracking-widest">Suggested prompts</p>
                  {currentSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => !usedSuggestions.has(s) && handleSend(s)}
                      disabled={usedSuggestions.has(s)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer"
                      style={{
                        background: '#0a0a0a',
                        border: '1px solid #1a1a1a',
                        color: usedSuggestions.has(s) ? '#333' : '#a3a3a3',
                        cursor: usedSuggestions.has(s) ? 'default' : 'pointer',
                        opacity: usedSuggestions.has(s) ? 0.5 : 1,
                      }}
                      onMouseEnter={e => { if (!usedSuggestions.has(s)) (e.currentTarget as HTMLElement).style.borderColor = '#38bdf8'; }}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'}
                    >
                      {s}
                    </button>
                  ))}
                  {/* More → pill */}
                  <button
                    onClick={() => setSuggestionGroup(nextGroup)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                    style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#525252' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
                  >
                    <RotateCcw size={11} /> More →
                  </button>
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
