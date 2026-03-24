import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { callGroq, getGroqKey } from '@/lib/groq';
import { FAQ_BY_USE_CASE, FAQ_LABEL, FAQ_SUBTITLE } from '@/data/faqStrings';
import { PAIRS_BY_USE_CASE } from '@/data/prompts';

// ── Types ─────────────────────────────────────────────────────
interface GeneratedPrompt {
  prompt: string;
  responseA: string;
  responseB: string;
}

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
            position: 'absolute', left: `${p.left}%`, top: -20,
            width: p.size, height: p.size * (p.shape === 'rect' ? 1.6 : 1),
            background: p.color, borderRadius: p.shape === 'circle' ? '50%' : '1px', opacity: 1,
          }}
          animate={{ y: ['0vh', '110vh'], x: [0, p.xDrift], rotate: [0, p.rotation], opacity: [1, 1, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

// ── Pipeline Progress Indicator ───────────────────────────────
const PIPELINE_STEPS = ['Upload', 'Annotate', 'Train RM', 'RL Loop', 'Evaluate'];

function PipelineProgress({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {PIPELINE_STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === activeStep;
        const isDone = stepNum < activeStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: isDone ? '#34d399' : isActive ? '#38bdf8' : '#2a2a2a',
                  boxShadow: isActive ? '0 0 0 3px rgba(56,189,248,0.2)' : 'none',
                }}
              />
              <span
                className="font-mono text-[9px] whitespace-nowrap"
                style={{ color: isDone ? '#34d399' : isActive ? '#38bdf8' : '#333' }}
              >
                {step}
              </span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div className="w-8 h-[1px] mb-4 mx-1" style={{ background: isDone ? '#34d399' : '#1a1a1a' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Upload Screen ─────────────────────────────────────────────
function UploadScreen({ onGenerate }: { onGenerate: (text: string) => void }) {
  const { addToast } = useApp();
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDemoMode = localStorage.getItem('rf_demo_mode') === 'marcus';
  const useCase = localStorage.getItem('rf_use_case') || 'developer';

  const faqLabel = isDemoMode
    ? "Use Marcus's Law Firm FAQ →"
    : (FAQ_LABEL[useCase] || 'Use example FAQ →');

  const faqSubtitle = isDemoMode
    ? "47 questions from a California law firm"
    : (FAQ_SUBTITLE[useCase] || '');

  const tryGenerate = (text: string) => {
    onGenerate(text);
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 500 * 1024) {
      addToast({ type: 'error', message: 'File too large. Max 500KB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setDocumentText(text);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleExampleFAQ = () => {
    localStorage.setItem('rf_using_example_faq', 'true');
    const faq = FAQ_BY_USE_CASE[useCase] || FAQ_BY_USE_CASE['developer'];
    tryGenerate(faq);
  };

  const handleGenerateClick = () => {
    if (!documentText) return;
    tryGenerate(documentText);
  };

  return (
    <>
      <div className="max-w-[640px] mx-auto">
        <div className="rounded-xl p-8" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <div className="text-center mb-6">
            <span className="font-mono text-[11px]" style={{ color: '#38bdf8' }}>Step 1 of 5 · Upload Documents</span>
            <h2 className="font-syne font-bold text-[24px] text-[#fafafa] mt-3 mb-2">Upload your practice documents</h2>
            <p className="font-mono text-[13px] leading-relaxed" style={{ color: '#525252' }}>
              We'll extract your real client questions and generate AI response pairs. Your data never leaves your browser.
            </p>
          </div>

          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="rounded-xl p-10 text-center mb-4 cursor-pointer transition-all"
            style={{ background: '#111', border: '1.5px dashed #2a2a2a' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#38bdf8'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'}
          >
            {fileName ? (
              <div>
                <div className="text-2xl mb-2">✓</div>
                <p className="font-mono text-sm" style={{ color: '#34d399' }}>{fileName} ready</p>
              </div>
            ) : (
              <>
                <div className="text-3xl mb-3">📄</div>
                <p className="text-sm mb-1" style={{ color: '#525252' }}>Drop your FAQ or document here</p>
                <p className="font-mono text-[11px] mb-4" style={{ color: '#333' }}>Supports PDF and TXT · Max 500KB</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg font-syne font-semibold text-xs transition-all"
                  style={{ border: '1px solid #333', color: '#a3a3a3', background: 'transparent' }}
                >
                  Browse files
                </button>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
          />

          {/* Generate button if file ready */}
          {fileName && (
            <button
              onClick={handleGenerateClick}
              className="w-full py-3 rounded-lg font-syne font-bold text-sm mb-4 transition-opacity hover:opacity-90"
              style={{ background: '#fafafa', color: '#000' }}
            >
              Generate prompts →
            </button>
          )}

          {/* OR divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: '#1a1a1a' }} />
            <span className="font-mono text-[11px]" style={{ color: '#333' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: '#1a1a1a' }} />
          </div>

          {/* Example FAQ button */}
          <button
            onClick={handleExampleFAQ}
            className="w-full py-3.5 px-6 rounded-lg font-syne font-medium text-sm transition-all"
            style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(56,189,248,0.12)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(56,189,248,0.08)'}
          >
            {faqLabel}
          </button>
          {faqSubtitle && (
            <p className="font-mono text-[11px] text-center mt-2" style={{ color: '#333' }}>{faqSubtitle}</p>
          )}
        </div>
      </div>
    </>
  );
}

// ── Generating Screen ─────────────────────────────────────────
function GeneratingScreen({
  documentText,
  onDone,
}: {
  documentText: string;
  onDone: (prompts: GeneratedPrompt[]) => void;
}) {
  const useCase = localStorage.getItem('rf_use_case') || 'developer';
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [pairsProgress, setPairsProgress] = useState(0);
  const [progress, setProgress] = useState(10);
  const [questions, setQuestions] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
  const [wasInstant, setWasInstant] = useState(false);
  const ran = useRef(false);

  const getFallbackQuestions = (): string[] => {
    const faq = FAQ_BY_USE_CASE[useCase] || FAQ_BY_USE_CASE['developer'];
    const lines = faq.split('\n').filter(l => l.startsWith('Q:'));
    return lines.slice(0, 10).map(l => l.replace(/^Q:\s*/, '').trim());
  };

  const getFallbackPair = (question: string, idx: number): GeneratedPrompt => {
    const pairs: GeneratedPrompt[] = [
      {
        prompt: question,
        responseA: `Under the applicable legal framework, this matter requires careful analysis of relevant statutes, case law, and regulatory requirements. The determination of appropriate remedies necessitates evaluation of multiple factors including jurisdictional considerations, burden of proof standards, and available legal theories. Counsel should be consulted to assess the specific circumstances and develop an appropriate legal strategy tailored to the individual case facts.`,
        responseB: `Here's what you need to know: 1) Document everything with dates and photos. 2) Send written notice giving a specific deadline. 3) If no response, you have several options depending on your state. 4) For most situations, you can resolve this without hiring a lawyer. What's the most urgent aspect you need help with?`,
      },
    ];
    return { prompt: question, responseA: pairs[0].responseA, responseB: pairs[0].responseB };
  };

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      // FIX 1: Skip Groq for example FAQs — instant load
      const isHardcodedFAQ = localStorage.getItem('rf_using_example_faq') === 'true';
      if (isHardcodedFAQ) {
        localStorage.removeItem('rf_using_example_faq');
        const pairs = (PAIRS_BY_USE_CASE[useCase] || PAIRS_BY_USE_CASE['developer']).map(p => ({
          prompt: p.text,
          responseA: p.responseA,
          responseB: p.responseB,
        }));
        localStorage.setItem('rf_generated_prompts', JSON.stringify(pairs));
        setStep1Done(true);
        setStep2Done(true);
        setStep3Done(true);
        setProgress(100);
        setGeneratedPrompts(pairs);
        setWasInstant(true);
        setShowSuccess(true);
        setTimeout(() => onDone(pairs), 1000);
        return;
      }

      const groqKey = getGroqKey();
      setStep1Done(true);
      setProgress(10);

      // Step 2: Extract questions
      let extractedQs: string[] = [];
      try {
        const resp = await callGroq(
          'Extract exactly 10 client questions from this document. Return ONLY a JSON array of 10 strings. No explanation. No preamble. Just JSON. Example format: ["Question 1?","Question 2?"]',
          `Extract 10 questions from:\n\n${documentText.slice(0, 3000)}`,
          groqKey,
        );
        try {
          // Try to extract JSON array from response
          const jsonMatch = resp.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
              extractedQs = parsed.slice(0, 10);
            }
          }
        } catch {
          extractedQs = getFallbackQuestions();
        }
      } catch {
        extractedQs = getFallbackQuestions();
      }
      if (extractedQs.length < 10) extractedQs = [...extractedQs, ...getFallbackQuestions()].slice(0, 10);
      setQuestions(extractedQs);
      setStep2Done(true);
      setProgress(30);

      // Step 3: Generate pairs (sequential to avoid rate limiting)
      const pairs: GeneratedPrompt[] = [];
      for (let i = 0; i < extractedQs.length; i++) {
        const q = extractedQs[i];
        try {
          const resp = await callGroq(
            'Generate two contrasting AI responses. Return ONLY valid JSON: {"responseA":"...","responseB":"..."}\nNo other text. No explanation.',
            `Question: "${q}"\n\nResponse A: Formal, technical, verbose style. Use professional jargon. Add qualifications. 3-4 sentences minimum.\n\nResponse B: Plain English, direct, actionable. Under 60 words. What an expert would actually say to a client in plain language. Practical.`,
            groqKey,
          );
          try {
            const jsonMatch = resp.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed.responseA && parsed.responseB) {
                pairs.push({ prompt: q, responseA: parsed.responseA, responseB: parsed.responseB });
              } else {
                pairs.push(getFallbackPair(q, i));
              }
            } else {
              pairs.push(getFallbackPair(q, i));
            }
          } catch {
            pairs.push(getFallbackPair(q, i));
          }
        } catch {
          pairs.push(getFallbackPair(q, i));
        }
        setPairsProgress(i + 1);
        setProgress(30 + Math.round(((i + 1) / 10) * 60));
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 300));
      }

      setStep3Done(true);
      setProgress(100);
      localStorage.setItem('rf_generated_prompts', JSON.stringify(pairs));
      setGeneratedPrompts(pairs);

      setShowSuccess(true);
      setTimeout(() => onDone(pairs), 1500);
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (showSuccess) {
    return (
      <div className="max-w-[480px] mx-auto text-center py-16">
        <div className="font-syne font-bold text-[22px] mb-4" style={{ color: '#34d399' }}>
          {wasInstant ? '✅ 10 prompts loaded instantly!' : `✅ ${generatedPrompts.length} prompts generated from your document!`}
        </div>
        <div className="space-y-2 mb-6 text-left">
          {generatedPrompts.slice(0, 3).map((p, i) => (
            <p key={i} className="font-mono text-[12px]" style={{ color: '#525252' }}>
              • "{p.prompt.slice(0, 60)}{p.prompt.length > 60 ? '...' : ''}"
            </p>
          ))}
          {generatedPrompts.length > 3 && (
            <p className="font-mono text-[11px]" style={{ color: '#333' }}>+ {generatedPrompts.length - 3} more questions ready</p>
          )}
        </div>
        <button
          className="w-full py-3 rounded-lg font-syne font-bold text-sm"
          style={{ background: '#fafafa', color: '#000' }}
        >
          Start annotating →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto py-12">
      <h2 className="font-syne font-bold text-[22px] text-[#fafafa] text-center mb-8">Generating your prompts...</h2>

      <div className="space-y-4 mb-6">
        {[
          { icon: '📄', label: 'Document uploaded', done: step1Done, active: !step1Done },
          { icon: '🔍', label: 'Extracting your questions...', done: step2Done, active: step1Done && !step2Done },
          { icon: '✨', label: 'Generating response pairs...', done: step3Done, active: step2Done && !step3Done, sub: step2Done && !step3Done ? `${pairsProgress} of 10 complete` : '' },
          { icon: '🎯', label: 'Preparing annotation session', done: step3Done, active: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-base">{s.icon}</span>
            <span className="text-sm flex-1" style={{ color: s.done ? '#34d399' : s.active ? '#fafafa' : '#333' }}>
              {s.label}
              {s.sub && <span className="font-mono text-[10px] ml-2" style={{ color: '#525252' }}>{s.sub}</span>}
            </span>
            {s.done && <span style={{ color: '#34d399' }}>✓</span>}
            {s.active && !s.done && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#38bdf8' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
            {!s.active && !s.done && i > 0 && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1a1a1a' }} />}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="rounded-full overflow-hidden mb-3" style={{ background: '#1a1a1a', height: 4 }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: '#38bdf8' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <p className="font-mono text-[11px] text-center" style={{ color: '#525252' }}>
        Powered by Groq · llama-3.3-70b-versatile
      </p>
    </div>
  );
}

// ── Pairwise Tab ─────────────────────────────────────────────
const DIMENSIONS = [
  { key: 'helpfulness', label: 'Helpfulness', weight: 0.30 },
  { key: 'accuracy', label: 'Accuracy', weight: 0.25 },
  { key: 'safety', label: 'Safety', weight: 0.20 },
  { key: 'coherence', label: 'Coherence', weight: 0.15 },
  { key: 'creativity', label: 'Creativity', weight: 0.10 },
] as const;

function PairwiseTab({ prompts, isGenerated }: { prompts: GeneratedPrompt[]; isGenerated: boolean }) {
  const { addComparison, comparisons, addToast } = useApp();
  const navigate = useNavigate();
  const TOTAL = prompts.length;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReadyBanner, setShowReadyBanner] = useState(false);
  const selectionRef = useRef<'A' | 'B' | 'Tie' | null>(null);
  const [selectionDisplay, setSelectionDisplay] = useState<'A' | 'B' | 'Tie' | null>(null);
  const [reasoning, setReasoning] = useState('');

  useEffect(() => {
    if (comparisons.length === 5) setShowReadyBanner(true);
  }, [comparisons.length]);

  const handleSelect = useCallback((c: 'A' | 'B' | 'Tie') => {
    selectionRef.current = c;
    setSelectionDisplay(c);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectionRef.current || TOTAL === 0) return;
    addComparison({
      id: crypto.randomUUID(),
      promptIndex: step,
      prompt: prompts[step].prompt,
      preferred: selectionRef.current,
      reasoning,
      timestamp: new Date(),
    });
    addToast({ type: 'success', message: '✓ Comparison saved' });
    if (comparisons.length + 1 === 5) addToast({ type: 'info', message: '🎯 Ready to train your first model!' });
    if (step + 1 >= TOTAL) {
      setDone(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      return;
    }
    setStep(s => s + 1);
    selectionRef.current = null;
    setSelectionDisplay(null);
    setReasoning('');
  }, [step, reasoning, addComparison, addToast, comparisons.length, prompts, TOTAL]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'a') handleSelect('A');
      if (e.key === 'b') handleSelect('B');
      if (e.key === 't') handleSelect('Tie');
      if (e.key === 's') { setStep(s => Math.min(s + 1, TOTAL - 1)); selectionRef.current = null; setSelectionDisplay(null); setReasoning(''); }
      if (e.key === 'Enter' && selectionRef.current) handleNext();
      if (e.key === 'Escape') { selectionRef.current = null; setSelectionDisplay(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [done, handleSelect, handleNext, TOTAL]);

  if (TOTAL === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-mono text-sm" style={{ color: '#525252' }}>No prompts loaded. Please upload a document first.</p>
      </div>
    );
  }

  if (done) {
    const countA = comparisons.filter(c => c.preferred === 'A').length;
    const countB = comparisons.filter(c => c.preferred === 'B').length;
    const countTie = comparisons.filter(c => c.preferred === 'Tie').length;
    return (
      <>
        {showConfetti && <Confetti />}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center py-20 gap-6"
        >
          <div className="font-syne font-extrabold text-[28px] text-[#fafafa] text-center">All done!</div>
          <p className="text-sm" style={{ color: '#525252' }}>{comparisons.length} comparisons collected</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[`${comparisons.length} Total`, `${countA} Prefer A`, `${countB} Prefer B`, `${countTie} Ties`].map(s => (
              <span key={s} className="font-mono text-[10px] px-3 py-1 rounded-full"
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#a3a3a3' }}>{s}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/train-rm')}
              className="px-5 py-2.5 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-88"
              style={{ background: '#fafafa', color: '#000' }}>
              Train Reward Model →
            </button>
            <button onClick={() => { setStep(0); selectionRef.current = null; setSelectionDisplay(null); setReasoning(''); setDone(false); setShowConfetti(false); }}
              className="px-5 py-2.5 rounded-full font-syne font-bold text-sm transition-all"
              style={{ border: '1px solid #1a1a1a', color: '#fafafa' }}>
              Restart
            </button>
          </div>
        </motion.div>
      </>
    );
  }

  const prompt = prompts[step];
  const isSelected = selectionDisplay !== null;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <AnimatePresence>
        {showReadyBanner && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
            <span className="text-sm font-syne font-bold" style={{ color: '#34d399' }}>
              🎯 5 comparisons collected — ready to train!
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/train-rm')}
                className="px-3 py-1.5 rounded-full font-syne font-bold text-xs transition-opacity hover:opacity-80"
                style={{ background: '#34d399', color: '#000' }}>
                Train Reward Model →
              </button>
              <button onClick={() => setShowReadyBanner(false)} style={{ color: '#525252' }}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-[10px] px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}>
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse inline-block" />
          {isGenerated ? 'GENERATED FROM YOUR DOCUMENT' : 'AI-GENERATED PAIRS'}
        </span>
        <div className="text-right">
          <div className="font-mono text-[10px] mb-1.5 uppercase tracking-widest" style={{ color: '#525252' }}>
            {step + 1} of {TOTAL} comparisons
          </div>
          <div className="w-44 h-1.5 rounded-full overflow-hidden" style={{ background: '#111' }}>
            <motion.div className="h-full rounded-full" style={{ background: '#38bdf8' }}
              animate={{ width: `${(step / TOTAL) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="p-5 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderLeft: '2px solid #38bdf8' }}>
        <div className="font-mono text-[9px] tracking-[0.2em] mb-2.5" style={{ color: '#38bdf8' }}>PROMPT</div>
        <h2 className="font-syne font-bold text-[15px] text-[#fafafa] leading-snug">{prompt.prompt}</h2>
      </div>

      {/* Response cards */}
      <div className="grid grid-cols-2 gap-4">
        {(['A', 'B'] as const).map(id => {
          const content = id === 'A' ? prompt.responseA : prompt.responseB;
          const color = id === 'A' ? '#38bdf8' : '#f472b6';
          const cardSelected = selectionDisplay === id;
          return (
            <div key={id} onClick={() => handleSelect(id)}
              style={{
                background: '#0a0a0a', border: `2px solid ${cardSelected ? color : '#1a1a1a'}`,
                boxShadow: cardSelected ? `0 0 0 3px ${color}14` : 'none',
                borderRadius: 10, padding: '14px', cursor: 'pointer', height: 280,
                display: 'flex', flexDirection: 'column', transition: 'all 0.12s',
              }}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[10px] px-2 py-1 rounded"
                  style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
                  RESPONSE {id}
                </span>
                {cardSelected && <CheckCircle2 size={16} style={{ color }} />}
              </div>
              <div className="flex-1 overflow-y-auto text-[13px] leading-relaxed pr-1 transition-colors"
                style={{ color: cardSelected ? '#fafafa' : '#a3a3a3' }}>
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

      {/* Helper text when nothing selected */}
      {!isSelected && (
        <p style={{
          textAlign: 'center',
          color: '#525252',
          fontFamily: 'Space Mono, monospace',
          fontSize: '12px',
          marginTop: '4px',
        }}>
          Click a response card or press A / B to select
        </p>
      )}

      {/* Control row */}
      <div className="flex justify-center gap-3">
        {['Tie', 'Skip'].map(action => (
          <button key={action}
            onClick={() => action === 'Tie'
              ? handleSelect('Tie')
              : (setStep(s => Math.min(s + 1, TOTAL - 1)), selectionRef.current = null, setSelectionDisplay(null), setReasoning(''))}
            className="px-5 py-2 rounded-lg font-syne font-bold text-sm flex items-center gap-2 transition-all"
            style={{
              background: selectionDisplay === 'Tie' && action === 'Tie' ? '#fafafa' : 'transparent',
              color: selectionDisplay === 'Tie' && action === 'Tie' ? '#000' : '#525252',
              border: `1px solid ${selectionDisplay === 'Tie' && action === 'Tie' ? '#fafafa' : '#1a1a1a'}`,
            }}>
            {action} <kbd className="rounded text-[10px] px-1.5 py-0.5"
              style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}>
              {action === 'Tie' ? 'T' : 'S'}
            </kbd>
          </button>
        ))}
      </div>

      {/* Reasoning + Submit */}
      <div className="p-5 rounded-xl space-y-4" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        <label className="text-sm font-syne font-bold" style={{ color: '#a3a3a3' }}>Why did you prefer this? (optional)</label>
        <textarea value={reasoning} onChange={e => setReasoning(e.target.value)} rows={3}
          placeholder="Explain your reasoning..."
          className="w-full px-4 py-3 rounded-lg text-sm resize-none outline-none transition-all"
          style={{ background: '#000', border: '1px solid #1a1a1a', color: '#fafafa' }}
          onFocus={e => e.currentTarget.style.borderColor = '#38bdf8'}
          onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'} />
        <div className="relative group">
          <button onClick={isSelected ? handleNext : undefined} disabled={!isSelected}
            className="w-full py-4 rounded-full font-syne font-bold text-sm flex items-center justify-center gap-2"
            style={{
              background: isSelected ? '#fafafa' : '#1a1a1a', color: isSelected ? '#000' : '#525252',
              cursor: isSelected ? 'pointer' : 'not-allowed', opacity: isSelected ? 1 : 0.4, transition: 'all 0.15s',
            }}>
            Submit & Next <ChevronRight size={16} />
          </button>
          {!isSelected && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded font-mono text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: '#111', border: '1px solid #1a1a1a', color: '#f59e0b', zIndex: 10 }}>
              Select a response first
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Rate Tab ──────────────────────────────────────────────────
function RateTab({ prompts }: { prompts: GeneratedPrompt[] }) {
  const { addRating, ratings, addToast } = useApp();
  const TOTAL = prompts.length;
  const MAX_RATINGS = 10;
  const [promptIdx, setPromptIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ helpfulness: 5, accuracy: 5, safety: 5, coherence: 5, creativity: 5 });

  const overall = DIMENSIONS.reduce((sum, d) => sum + scores[d.key] * d.weight, 0);
  const ratingsMaxReached = ratings.length >= MAX_RATINGS;

  const handleSubmit = () => {
    if (TOTAL === 0 || ratingsMaxReached) return;
    addRating({
      id: crypto.randomUUID(),
      prompt: prompts[promptIdx].prompt,
      helpfulness: scores.helpfulness, accuracy: scores.accuracy, safety: scores.safety,
      coherence: scores.coherence, creativity: scores.creativity, overall, timestamp: new Date(),
    });
    addToast({ type: 'success', message: '✓ Rating saved' });
    setPromptIdx(i => (i + 1) % TOTAL);
    setScores({ helpfulness: 5, accuracy: 5, safety: 5, coherence: 5, creativity: 5 });
  };

  const qualifier = overall >= 8 ? { label: 'Excellent', color: '#34d399' }
    : overall >= 5 ? { label: 'Good', color: '#38bdf8' }
    : { label: 'Needs work', color: '#f472b6' };

  if (TOTAL === 0) {
    return <div className="text-center py-16"><p className="font-mono text-sm" style={{ color: '#525252' }}>Upload a document to generate prompts first.</p></div>;
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="p-5 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderLeft: '2px solid #38bdf8' }}>
        <div className="font-mono text-[9px] tracking-[0.2em] mb-2" style={{ color: '#38bdf8' }}>PROMPT</div>
        <p className="font-syne font-bold text-[14px] text-[#fafafa]">{prompts[promptIdx].prompt}</p>
      </div>
      <div className="p-5 rounded-xl max-h-[180px] overflow-y-auto" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        <div className="font-mono text-[9px] mb-2" style={{ color: '#525252' }}>RESPONSE A</div>
        <pre className="text-[13px] leading-relaxed whitespace-pre-wrap font-syne" style={{ color: '#a3a3a3' }}>{prompts[promptIdx].responseA}</pre>
      </div>
      <div className="p-5 rounded-xl space-y-4" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
        {DIMENSIONS.map(d => (
          <div key={d.key} className="flex items-center gap-4">
            <div className="w-[110px] shrink-0"><span className="font-syne text-[12px] text-[#a3a3a3]">{d.label}</span></div>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded shrink-0" style={{ background: '#111', border: '1px solid #1a1a1a', color: '#525252' }}>{Math.round(d.weight * 100)}%</span>
            <input type="range" min={1} max={10} step={0.5} value={scores[d.key]}
              onChange={e => setScores(s => ({ ...s, [d.key]: Number(e.target.value) }))} className="flex-1" />
            <span className="font-syne font-extrabold text-[16px] w-8 text-right" style={{ color: '#38bdf8' }}>{scores[d.key].toFixed(1)}</span>
          </div>
        ))}
      </div>
      <div className="p-5 rounded-xl text-center" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="font-mono text-[9px] tracking-widest mb-1" style={{ color: '#525252' }}>OVERALL SCORE</div>
        <div className="font-syne font-extrabold text-[52px] leading-none" style={{ color: '#38bdf8' }}>{overall.toFixed(1)}</div>
        <div className="font-syne font-bold text-sm mt-2" style={{ color: qualifier.color }}>{qualifier.label}</div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={ratingsMaxReached}
        className="w-full py-3.5 rounded-full font-syne font-bold text-sm transition-opacity"
        style={{
          background: ratingsMaxReached ? '#1a1a1a' : '#fafafa',
          color: ratingsMaxReached ? '#525252' : '#000',
          cursor: ratingsMaxReached ? 'not-allowed' : 'pointer',
          opacity: ratingsMaxReached ? 0.5 : 1,
        }}
      >
        {ratingsMaxReached ? `Maximum ratings reached (${MAX_RATINGS}/${MAX_RATINGS})` : 'Submit Rating'}
      </button>
      {ratings.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1a1a1a' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
                {['Prompt', 'Help', 'Acc', 'Safe', 'Coh', 'Cre', 'Overall', 'Date'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-mono text-[9px] uppercase tracking-widest" style={{ color: '#525252' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ratings.slice(0, 10).map((r, i) => {
                const color = r.overall >= 8 ? '#34d399' : r.overall >= 5 ? '#38bdf8' : '#f472b6';
                return (
                  <tr key={r.id} style={{ borderBottom: i < ratings.length - 1 ? '1px solid #0f0f0f' : 'none' }}>
                    <td className="px-3 py-2 text-[11px]" style={{ color: '#a3a3a3', maxWidth: 200 }}>{r.prompt.slice(0, 35)}{r.prompt.length > 35 ? '...' : ''}</td>
                    {['helpfulness', 'accuracy', 'safety', 'coherence', 'creativity'].map(k => (
                      <td key={k} className="px-3 py-2 font-mono text-[10px]" style={{ color: '#525252' }}>{(r as unknown as Record<string, number>)[k].toFixed(1)}</td>
                    ))}
                    <td className="px-3 py-2 font-mono font-bold text-[10px]" style={{ color }}>{r.overall.toFixed(1)}</td>
                    <td className="px-3 py-2 font-mono text-[9px]" style={{ color: '#333' }}>{r.timestamp.toLocaleDateString()}</td>
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

// ── Main Annotate Page ────────────────────────────────────────
export function Annotate() {
  const navigate = useNavigate();
  const useCase = localStorage.getItem('rf_use_case') || 'developer';

  // Fix 3: redirect to onboarding if no use case and not in demo mode
  useEffect(() => {
    const uc = localStorage.getItem('rf_use_case');
    const isDemo = localStorage.getItem('rf_demo_mode') === 'marcus';
    if (!isDemo && !uc) {
      localStorage.setItem('rf_return_path', '/annotate');
      navigate('/onboarding');
    }
  }, []);

  // Determine initial step: if prompts already exist skip to annotate
  const [annotateStep, setAnnotateStep] = useState<'upload' | 'generating' | 'annotate'>(() => {
    const saved = localStorage.getItem('rf_generated_prompts');
    return saved ? 'annotate' : 'upload';
  });

  const [documentText, setDocumentText] = useState('');
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>(() => {
    try {
      const saved = localStorage.getItem('rf_generated_prompts');
      if (saved) return JSON.parse(saved) as GeneratedPrompt[];
    } catch { /* ignore */ }
    return [];
  });
  const [tab, setTab] = useState<'pairwise' | 'rate'>('pairwise');

  // Pipeline step for progress indicator
  const activePipelineStep = annotateStep === 'annotate' ? 2 : 1;

  const isGenerated = localStorage.getItem('rf_generated_prompts') !== null;

  const handleGenerate = (text: string) => {
    setDocumentText(text);
    setAnnotateStep('generating');
  };

  const handleGenerationDone = (generated: GeneratedPrompt[]) => {
    setPrompts(generated);
    setAnnotateStep('annotate');
  };

  // Demo mode: show banner insight after first prompt loads
  const isDemoMode = localStorage.getItem('rf_demo_mode') === 'marcus';
  const [bannerTeamDismissed, setBannerTeamDismissed] = useState(
    () => localStorage.getItem('rf_banner_team') === 'dismissed'
  );

  const dismissBannerTeam = () => {
    localStorage.setItem('rf_banner_team', 'dismissed');
    setBannerTeamDismissed(true);
  };

  return (
    <div className="space-y-6">
      {/* Demo insight banner 1 */}
      {isDemoMode && annotateStep === 'annotate' && !bannerTeamDismissed && (
        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ background: '#0a0f1a', borderBottom: '1px solid #1e3a5f' }}>
          <span className="text-[13px]" style={{ color: '#a3a3a3' }}>
            💡 In full version, each licensed professional's credentials appear separately on your certificate — stronger compliance.
          </span>
          <button onClick={dismissBannerTeam} className="ml-4 font-mono text-[12px] transition-colors" style={{ color: '#525252' }}>×</button>
        </div>
      )}

      <div>
        <h1 className="font-syne font-extrabold text-3xl tracking-tight text-[#fafafa]">Annotate</h1>
        <p className="text-sm mt-1" style={{ color: '#525252' }}>
          Collect human preference data to train your reward model.
        </p>
      </div>

      {/* Pipeline progress */}
      <PipelineProgress activeStep={activePipelineStep} />

      {/* Upload / Generating states */}
      {annotateStep === 'upload' && (
        <UploadScreen onGenerate={handleGenerate} />
      )}
      {annotateStep === 'generating' && (
        <GeneratingScreen documentText={documentText} onDone={handleGenerationDone} />
      )}

      {/* Annotate state */}
      {annotateStep === 'annotate' && (
        <>
          {/* Re-generate button */}
          <div className="flex items-center justify-between">
            <div className="flex gap-0" style={{ borderBottom: '1px solid #1a1a1a' }}>
              {[{ id: 'pairwise', label: 'Pairwise Comparison', subtitle: null }, { id: 'rate', label: 'Rate & Score', subtitle: '(Optional)' }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id as 'pairwise' | 'rate')}
                  className="px-5 py-3 font-syne font-bold text-sm transition-all flex flex-col items-start"
                  style={{ color: tab === t.id ? '#fafafa' : '#525252', borderBottom: `2px solid ${tab === t.id ? '#38bdf8' : 'transparent'}`, marginBottom: -1 }}>
                  <span>{t.label}</span>
                  {t.subtitle && <span className="font-mono text-[9px] font-normal mt-0.5" style={{ color: '#525252' }}>(Optional — adds quality signal to your reward model)</span>}
                </button>
              ))}
            </div>
            <button
              onClick={() => { localStorage.removeItem('rf_generated_prompts'); setAnnotateStep('upload'); setPrompts([]); }}
              className="font-mono text-[11px] transition-colors"
              style={{ color: '#333' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#525252'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#333'}
            >
              <Upload size={11} className="inline mr-1" />
              Upload new doc
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'pairwise'
              ? <motion.div key="pairwise" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PairwiseTab prompts={prompts} isGenerated={isGenerated} />
                </motion.div>
              : <motion.div key="rate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <RateTab prompts={prompts} />
                </motion.div>
            }
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
