import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RotateCcw } from 'lucide-react';
import { LogoMark } from './Logo';
import { useApp } from '@/context/AppContext';
import { callGroq, getGroqKey } from '@/lib/groq';
import { USE_CASE_LABEL } from '@/data/faqStrings';

const SUGGESTION_GROUPS = [
  [
    "Why is my KL divergence at 0.038?",
    "Is {n} comparison{plural} enough to start?",
    "PPO or DPO — which should I use?",
    "What does my reward score mean?",
  ],
  [
    "Why did plain English win most comparisons?",
    "How accurate should my reward model be?",
    "What is reward hacking?",
    "When is my model ready to deploy?",
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
  const useCase = localStorage.getItem('rf_use_case') || 'general';
  const useCaseLabel = USE_CASE_LABEL[useCase] || 'general';

  if (isDemoMode) {
    return `You are the RewardForge AI Copilot helping Marcus Chen, Managing Partner at Chen & Associates, a California law firm building a plain-English legal AI assistant called LexAI for small business owners.
Current pipeline state:
- Comparisons collected: ${comparisons}
- Reward models trained: ${rewardModels}
- Best RM accuracy: ${lastAccuracy !== undefined ? (lastAccuracy * 100).toFixed(1) : 'none'}%
- RL runs completed: ${rlRuns}
- Best reward score: ${lastReward !== undefined ? lastReward.toFixed(3) : 'none'}
Rules:
1. Answer in 2-3 sentences maximum
2. Use their actual numbers in your answer
3. Never use ML jargon without explaining it
4. End with ONE specific actionable next step
5. Be encouraging but honest
User is building a legal AI assistant. Context: legal industry.`;
  }

  return `You are the RewardForge AI Copilot helping a professional building a ${useCaseLabel} AI assistant.
Current pipeline state:
- Comparisons collected: ${comparisons}
- Ratings submitted: ${ratings}
- Reward models trained: ${rewardModels}
- Best RM accuracy: ${lastAccuracy !== undefined ? `${(lastAccuracy * 100).toFixed(1)}%` : 'none'}
- RL runs completed: ${rlRuns}
- Best reward score: ${lastReward !== undefined ? lastReward.toFixed(3) : 'none'}
User is building a ${useCaseLabel} AI assistant.
Rules:
1. Answer in 2-3 sentences maximum
2. Use their actual numbers in your answer
3. Never use ML jargon without explaining it
4. End with ONE specific actionable next step
5. Be encouraging but honest`;
}

function buildOpeningMessage(comparisons: number, isDemoMode: boolean, useCase: string) {
  const useCaseLabel = USE_CASE_LABEL[useCase] || 'general';
  if (isDemoMode) {
    return `Hi Marcus! LexAI has ${comparisons} comparison${comparisons !== 1 ? 's' : ''} collected on legal AI prompts. Your team consistently preferred plain English answers over formal citations — great signal for your reward model. Ready to start training?`;
  }
  return `Hi! I can see you have ${comparisons} comparison${comparisons !== 1 ? 's' : ''} collected for your ${useCaseLabel} AI assistant. What would you like to know about your pipeline?`;
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
  const useCase = localStorage.getItem('rf_use_case') || 'developer';
  const lastRun = rlRuns[0];
  const lastRM = rewardModels[0];

  // Inject opening message when panel first opens with empty history
  useEffect(() => {
    if (copilotOpen && copilotHistory.length === 0) {
      const openingMsg = buildOpeningMessage(comparisons.length, isDemoMode, useCase);
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

    const groqKey = getGroqKey();

    if (!groqKey) {
      // Fallback responses when no API key
      await new Promise(r => setTimeout(r, 900));
      setIsThinking(false);
      const fallbackResponses: Record<string, string> = {
        "Why is my KL divergence at 0.038?": `A KL of 0.038 is healthy — it means your policy is improving without drifting too far from the base model. The sweet spot is 0.02–0.08. If it climbs above 0.1, increase your β penalty in RL Loop settings.`,
        "PPO or DPO — which should I use?": `Start with PPO — it's stable and well-understood${lastRM ? `, and your ${lastRM.name} reward model is a solid foundation` : ""}. Use DPO to skip reward model training entirely. Next step: launch a PPO run in the RL Loop tab.`,
        "What does my reward score mean?": `Your reward score measures how well the policy produces responses preferred by your reward model. Higher is better, but watch for reward hacking — unusually long responses may inflate scores artificially. Check the Evaluate tab for side-by-side diffs.`,
      };

      const fallback = isDemoMode
        ? `For LexAI's legal AI alignment, the key signal is plain English vs citation-heavy answers. ${comparisons.length === 0 ? 'Start by annotating 5 legal prompt pairs.' : rewardModels.length === 0 ? `You have ${comparisons.length} annotations — head to Train RM.` : 'Your reward model is ready. Launch a PPO run in RL Loop.'}`
        : `You have ${comparisons.length} comparisons. ${comparisons.length < 5 ? `Collect ${5 - comparisons.length} more then train in Train RM.` : rewardModels.length === 0 ? 'Head to Train RM to train your first reward model.' : 'Check the Evaluate tab to compare your runs.'}`;

      const content = fallbackResponses[msg] ?? fallback;

      setIsStreaming(true);
      const words = content.split(' ');
      let built = '';
      for (let i = 0; i < words.length; i++) {
        built += (i === 0 ? '' : ' ') + words[i];
        setStreamedText(built);
        await new Promise(r => setTimeout(r, 35));
      }
      setIsStreaming(false);
      setStreamedText('');
      setCopilotHistory([...updatedHistory, { role: 'assistant', content, timestamp: new Date() }]);
      return;
    }

    // Real Groq call
    try {
      const systemPrompt = buildSystemPrompt(
        comparisons.length, ratings.length, rewardModels.length, rlRuns.length,
        lastRM?.accuracy, lastRun?.finalReward, isDemoMode,
      );
      await new Promise(r => setTimeout(r, 600));
      setIsThinking(false);

      const content = await callGroq(systemPrompt, msg, groqKey);

      setIsStreaming(true);
      const words = content.split(' ');
      let built = '';
      for (let i = 0; i < words.length; i++) {
        built += (i === 0 ? '' : ' ') + words[i];
        setStreamedText(built);
        await new Promise(r => setTimeout(r, 35));
      }
      setIsStreaming(false);
      setStreamedText('');
      setCopilotHistory([...updatedHistory, { role: 'assistant', content, timestamp: new Date() }]);
    } catch (err: unknown) {
      setIsThinking(false);
      setIsStreaming(false);
      setStreamedText('');
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setCopilotHistory([...updatedHistory, {
        role: 'assistant',
        content: errMsg.includes('Daily AI limit') ? '⚠️ Daily AI limit reached (30 calls). Resets tomorrow.' : `⚠️ AI error: ${errMsg}. Check your Groq key in Settings.`,
        timestamp: new Date(),
      }]);
    }
  }, [input, isThinking, isStreaming, copilotHistory, comparisons.length, ratings.length, rewardModels, rlRuns, isDemoMode, lastRM, lastRun, useCase, setCopilotHistory]);

  const resolvedSuggestions = SUGGESTION_GROUPS[suggestionGroup].map(s =>
    s
      .replace('{n}', String(comparisons.length))
      .replace('{plural}', comparisons.length !== 1 ? 's' : '')
  );
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
              <button onClick={() => setCopilotOpen(false)} style={{ color: '#525252' }}><X size={16} /></button>
            </div>

            {/* Context bar */}
            <div className="mx-4 mt-3 mb-1 px-3 py-2 rounded-lg font-mono text-[9px]"
              style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#525252' }}>
              {comparisons.length} comparisons · {rewardModels.length} models · {rlRuns.length} RL runs
              {lastRM && ` · ${(lastRM.accuracy * 100).toFixed(1)}% acc`}
              {lastRun && ` · ${lastRun.finalReward.toFixed(3)} reward`}
              {isDemoMode && <span style={{ color: '#38bdf8' }}> · Marcus / LexAI</span>}
              {!getGroqKey() && <span style={{ color: '#f59e0b' }}> · No API key</span>}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {copilotHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-5 h-5 rounded shrink-0 mr-2 mt-0.5 flex items-center justify-center"
                      style={{ background: 'rgba(56,189,248,0.1)' }}><LogoMark size={14} /></div>
                  )}
                  <div className="max-w-[85%] p-3 text-[12px] leading-relaxed"
                    style={{
                      background: m.role === 'user' ? '#111' : '#071020',
                      border: `1px solid ${m.role === 'user' ? '#1a1a1a' : 'rgba(56,189,248,0.15)'}`,
                      borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                      color: m.role === 'user' ? '#a3a3a3' : '#e2e8f0',
                    }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="w-5 h-5 rounded shrink-0 mr-2 mt-0.5 flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.1)' }}><LogoMark size={14} /></div>
                  <div className="p-3 rounded-xl flex items-center gap-1" style={{ background: '#071020', border: '1px solid rgba(56,189,248,0.15)' }}>
                    {[0, 0.2, 0.4].map((d, i) => (<div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#38bdf8', animationDelay: `${d}s` }} />))}
                  </div>
                </div>
              )}

              {isStreaming && streamedText && (
                <div className="flex justify-start">
                  <div className="w-5 h-5 rounded shrink-0 mr-2 mt-0.5 flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.1)' }}><LogoMark size={14} /></div>
                  <div className="max-w-[85%] p-3 text-[12px] leading-relaxed"
                    style={{ background: '#071020', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '10px 10px 10px 2px', color: '#e2e8f0' }}>
                    {streamedText}
                    <motion.span className="inline-block ml-0.5 w-[7px] h-[13px] rounded-[1px] align-text-bottom" style={{ background: '#38bdf8' }}
                      animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
                  </div>
                </div>
              )}

              {/* Suggestions — show when no user messages sent */}
              {copilotHistory.filter(m => m.role === 'user').length === 0 && !isThinking && !isStreaming && (
                <div className="space-y-2 mt-2">
                  <p className="font-mono text-[9px] text-[#333] uppercase tracking-widest">Suggested prompts</p>
                  {resolvedSuggestions.map((s, idx) => (
                    <button key={idx}
                      onClick={() => !usedSuggestions.has(s) && handleSend(s)}
                      disabled={usedSuggestions.has(s)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer"
                      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: usedSuggestions.has(s) ? '#333' : '#a3a3a3', cursor: usedSuggestions.has(s) ? 'default' : 'pointer', opacity: usedSuggestions.has(s) ? 0.5 : 1 }}
                      onMouseEnter={e => { if (!usedSuggestions.has(s)) (e.currentTarget as HTMLElement).style.borderColor = '#38bdf8'; }}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'}>
                      {s}
                    </button>
                  ))}
                  <button onClick={() => setSuggestionGroup(nextGroup)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                    style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#525252' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a3a3a3'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#525252'}>
                    <RotateCcw size={11} /> More →
                  </button>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 space-y-2" style={{ borderTop: '1px solid #1a1a1a' }}>
              {!getGroqKey() && (
                <p className="font-mono text-[10px] text-center" style={{ color: '#f59e0b' }}>
                  Add a Groq API key in Settings for live AI responses
                </p>
              )}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about your pipeline..."
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fafafa' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
                  onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'}
                />
                <button onClick={() => handleSend()} disabled={!input.trim() || isThinking || isStreaming}
                  className="px-3 py-2.5 rounded-lg font-syne font-bold text-xs transition-all"
                  style={{ background: input.trim() ? '#38bdf8' : '#111', color: input.trim() ? '#000' : '#333', cursor: input.trim() ? 'pointer' : 'default' }}>
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
