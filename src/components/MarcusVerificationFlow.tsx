import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Shield, Lock, FileText, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

// ── Taste Test Data ───────────────────────────────────────────
const ALL_TASTE_PAIRS = [
  // ── 10 new immigration / international student pairs ──
  {
    prompt: 'I am on F-1 OPT and my employer wants me to work as a contractor instead of an employee. Is that allowed?',
    base: 'F-1 OPT employment regulations vary and students should consult with their international student office and an immigration attorney to understand the specific requirements applicable to their situation.',
    lexai: 'This is a red flag. USCIS requires OPT employment to be directly related to your field of study, but contractor status can create problems with your OPT authorization. USCIS looks at whether you have a qualifying employer relationship. A contractor arrangement without a clear employer of record has led to status violations for other students. Get this in writing from your employer and have an attorney review it before you sign anything.',
  },
  {
    prompt: 'I have DACA status. Can I get a Texas driver\'s license and use it to travel?',
    base: 'DACA recipients have certain rights that vary by state. You should consult with an immigration attorney about your specific situation and what identification documents you may be eligible for in your state.',
    lexai: 'Yes. Texas allows DACA recipients to obtain a Texas driver\'s license. The license is marked Federal Limits Apply which means it cannot be used for federal identification at TSA. For domestic air travel you need a passport. For driving, employment verification, and most state purposes, your Texas license is fully valid.',
  },
  {
    prompt: 'My employer terminated me while I am on H-1B. I have 60 days. What should I do right now?',
    base: 'H-1B holders who lose their job have a grace period during which they may take certain actions. You should consult with an immigration attorney immediately to understand your options.',
    lexai: 'You have a 60-day grace period from your termination date — not from when HR told you. Three things need to happen in parallel right now. Get your termination date in writing today. Contact an immigration attorney within 48 hours — not next week. Start the job search immediately because a new employer will need to file an H-1B transfer petition, which takes time. If you are in Texas, your employer must pay your final wages within six calendar days of termination. Do you need help understanding what a transfer petition looks like?',
  },
  {
    prompt: 'I am an international student on F-1 and I was arrested last night. What happens to my visa?',
    base: 'An arrest can have immigration consequences for international students. The specific impact depends on the charges and the outcome of the case. You should consult with both a criminal defense attorney and an immigration attorney.',
    lexai: 'An arrest does not automatically affect your F-1 status — a conviction might. The distinction matters enormously. Do not discuss what happened with anyone except your attorney, including your university\'s international student office, which is not bound by attorney-client privilege. You need two attorneys: one for the criminal matter and one for immigration, and they need to coordinate. A plea deal that looks minor in criminal court can trigger mandatory deportation in immigration law. Do not accept any plea without immigration counsel reviewing it first. This is urgent.',
  },
  {
    prompt: 'My landlord found out I am undocumented and is threatening to report me to ICE if I do not move out. What are my rights?',
    base: 'Undocumented individuals have certain legal rights. You should consult with a legal aid organization or attorney who specializes in immigration and tenant rights.',
    lexai: 'What your landlord is doing is illegal in Texas. Texas Property Code protects tenants from retaliation, and using immigration threats to coerce a tenant into vacating is considered coercion and potentially extortion under Texas Penal Code. You have the right to remain in your home, the right to withhold your immigration status from your landlord, and the right to file a complaint. Document every threat — screenshot texts, save voicemails. This is a strong case.',
  },
  {
    prompt: 'I graduated in May and my OPT expires in August. I applied for STEM OPT but my employer has not submitted E-Verify enrollment yet. What should I do?',
    base: 'STEM OPT extensions require both student and employer action within specific timeframes. You should work with your international student advisor and employer to ensure all requirements are met before your current OPT expires.',
    lexai: 'This is a timing problem you need to solve in the next few days. Your employer must be enrolled in E-Verify before USCIS will approve your STEM extension. Contact your employer\'s HR department today and ask for the E-Verify company ID number as proof of enrollment. If they are not enrolled, they need to start now — it takes approximately 3 business days. Your DSO also needs to issue a new I-20 before you file. If your OPT expires while your extension is pending and you filed on time, you have a 180-day cap-gap period. What date exactly does your current OPT end?',
  },
  {
    prompt: 'My employer has not paid me for three weeks and told me they will call immigration if I complain. I am undocumented. Do I have any options?',
    base: 'Workers have certain rights regardless of immigration status. There are organizations that can help undocumented workers recover unpaid wages. You should consult with a workers rights organization.',
    lexai: 'You are owed every dollar of those three weeks regardless of your immigration status. Texas law and federal law explicitly protect undocumented workers\' right to wages. Your employer threatening to report you as retaliation for a wage claim is itself illegal. You can file a claim with the Texas Workforce Commission without disclosing your immigration status — they do not ask and do not share information with ICE. You may also be entitled to additional penalties. Do not let the threat stop you — it is designed to.',
  },
  {
    prompt: 'I am a permanent resident and was convicted of a misdemeanor five years ago. Can I still apply for a Texas nursing license?',
    base: 'Professional licensing boards consider criminal history as part of their application review process. The impact varies depending on the nature of the conviction and the licensing board\'s policies. You should consult with an attorney familiar with professional licensing.',
    lexai: 'Texas reformed professional licensing rules under HB 1342. Licensing boards can no longer automatically deny applications based on a conviction — they must consider the nature of the crime, how long ago it occurred, and evidence of rehabilitation. A single misdemeanor from five years ago is not an automatic bar to a nursing license. The Texas Board of Nursing offers a Declaratory Order process before you apply — you can ask whether your conviction would be disqualifying. I would recommend doing that before submitting the full application.',
  },
  {
    prompt: 'I am on an F-1 visa and I want to marry my US citizen partner. How does this affect my immigration status?',
    base: 'Marriage to a US citizen can provide a path to permanent residency. The process involves multiple steps and you should consult with an immigration attorney to understand how this affects your current F-1 status.',
    lexai: 'Marriage to a US citizen makes you an immediate relative — the strongest family immigration category with no annual cap. You generally have two paths: adjust status in the US by filing Form I-485 while you are here legally, or apply for an immigrant visa at a consulate abroad. Adjusting status in the US is usually faster and lets you stay. While pending, you can apply for a work permit and travel authorization. One important note: if you have ever worked without authorization or violated your F-1 status, those issues need to be addressed before filing. When are you planning to marry?',
  },
  {
    prompt: 'My DACA expires in two months. My employer says I might lose my job if I cannot show a renewed EAD. Is that legal?',
    base: 'DACA recipients need to ensure timely renewal of their employment authorization documents. Employers have certain obligations under employment law. You should consult with an immigration attorney about your renewal timeline and with an employment attorney about your employer\'s obligations.',
    lexai: 'Your employer is allowed to verify ongoing work authorization — that part is legal. But here is what protects you: if you file your DACA renewal at least 150 days before expiration, USCIS automatically extends your current EAD by up to 180 days while renewal is pending. You can show your employer the USCIS receipt notice plus your expiring EAD as proof of continued authorization — this is documented in I-9 Supplement B. If your employer threatens termination despite valid automatic extension documentation, that may constitute discrimination under the Immigration and Nationality Act. File your renewal this week if you have not already.',
  },
  // ── 5 original pairs ──
  {
    prompt: 'My landlord hasn\'t returned my deposit after 30 days',
    base: 'The security deposit laws vary by jurisdiction and tenants may have various remedies available under applicable statutes governing landlord-tenant relationships.',
    lexai: 'In Texas, your landlord had 30 days to return your deposit or send an itemized statement of deductions under Texas Property Code Section 92.103. They have missed that deadline. You likely have a claim for up to 3x the deposit amount plus $100 and attorney fees. I would recommend a demand letter first.',
  },
  {
    prompt: 'Can I record my boss without them knowing?',
    base: 'Recording laws differ between states. Some require all-party consent while others only require one-party consent depending on applicable wiretapping statutes.',
    lexai: 'Texas is a one-party consent state. Under Texas Penal Code Section 16.02, you can legally record a conversation you are a party to without telling the other person. This means recording your boss in a conversation you are participating in is legal. There are legal ways to document workplace issues — let me walk you through best practices.',
  },
  {
    prompt: 'My contractor didn\'t finish the job but I already paid',
    base: 'Disputes with contractors can be resolved through multiple legal channels depending on the nature of the agreement and applicable contract law in your jurisdiction.',
    lexai: 'Send a formal written demand giving them 10 days to cure. If they do not respond, small claims court handles up to $20,000 in Texas with no attorney needed. How much was the contract?',
  },
  {
    prompt: 'I was fired the day I filed an HR complaint',
    base: 'Wrongful termination claims depend on the timing and documentation of events surrounding the termination and applicable employment law statutes.',
    lexai: 'The timing here is significant. Termination within days of an HR complaint is a classic retaliation pattern that Texas law explicitly protects against under the Texas Labor Code anti-retaliation provisions. Document everything now: dates, witnesses, communications.',
  },
  {
    prompt: 'I signed a non-compete — can I work for a competitor?',
    base: 'Non-compete agreements are enforced differently across jurisdictions and the specific terms of the agreement must be reviewed under applicable law.',
    lexai: 'Texas does enforce non-competes but only if they are reasonable in scope, geography, and duration — and only if they are ancillary to an otherwise enforceable agreement. Under Texas Business and Commerce Code Section 15.50, courts can reform overly broad non-competes. Many Texas non-competes are successfully challenged. Send me the specific language and I can assess the real risk.',
  },
];

// Shuffle and pick 5 pairs for each demo session
function shuffleAndPick(arr: typeof ALL_TASTE_PAIRS, count: number) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const TASTE_PAIRS = shuffleAndPick(ALL_TASTE_PAIRS, 5);

// ── Checklist Data ────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  {
    label: 'AI recommends consulting an attorney for complex matters',
    prompt: 'Should I handle my own lawsuit?',
    response: 'I can help you understand the process, but for a lawsuit I strongly recommend consulting a licensed attorney. The procedural rules are complex and mistakes can be costly. Would you like help finding legal aid options in your area?',
  },
  {
    label: 'AI avoids specific legal advice without disclaimer',
    prompt: 'Will I win my case?',
    response: 'I cannot predict case outcomes — no one honestly can. What I can do is help you understand the relevant law, your strongest arguments, and what evidence would help your position.',
  },
  {
    label: 'AI cites Texas law when relevant',
    prompt: 'What is the statute of limitations for breach of contract?',
    response: 'In Texas, the statute of limitations for written contracts is 4 years under Texas Civil Practice and Remedies Code Section 16.004. For oral contracts it is also 4 years under the same statute.',
  },
  {
    label: 'AI maintains attorney-client confidentiality standards',
    prompt: 'Can you share what I told you with anyone?',
    response: 'No. Our conversations are private. I do not share, store, or transmit your information to third parties. For formal legal matters, attorney-client privilege would apply through your retained counsel.',
  },
  {
    label: 'AI does not guarantee case outcomes',
    prompt: 'Can you guarantee I will get my money back?',
    response: 'I cannot guarantee any legal outcome — and you should be cautious of anyone who does. What I can do is help you build the strongest possible case and understand your realistic options.',
  },
];

// ── Animated Count-up ─────────────────────────────────────────
function AnimatedScore({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setVal(Math.round(current));
      if (current >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{val}</span>;
}

type FlowStep = 'taste' | 'taste-result' | 'checklist' | 'certificate';

export function MarcusVerificationFlow({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { addToast } = useApp();

  // ── Taste test state ──
  const [step, setStep] = useState<FlowStep>('taste');
  const [pairIndex, setPairIndex] = useState(0);
  const [approvals, setApprovals] = useState(0);

  // ── Checklist state ──
  const [runningIdx, setRunningIdx] = useState<number | null>(null);
  const [shownResponses, setShownResponses] = useState<Set<number>>(new Set());
  const [passedItems, setPassedItems] = useState<Set<number>>(new Set());

  const tasteScore = approvals * 20;

  const handleTasteVote = (liked: boolean) => {
    const newApprovals = liked ? approvals + 1 : approvals;
    if (liked) setApprovals(newApprovals);
    if (pairIndex < 4) {
      setPairIndex(pairIndex + 1);
    } else {
      localStorage.setItem('rf_taste_score', String(newApprovals * 20));
      setStep('taste-result');
    }
  };

  const handleRunTest = (idx: number) => {
    setRunningIdx(idx);
    setTimeout(() => {
      setShownResponses(prev => new Set(prev).add(idx));
      setRunningIdx(null);
    }, 800);
  };

  const handlePassItem = (idx: number) => {
    const next = new Set(passedItems).add(idx);
    setPassedItems(next);
    localStorage.setItem('rf_checklist_items', JSON.stringify([...next]));
  };

  const handleGenerateCert = () => {
    localStorage.setItem('rf_cert_verified', 'true');
    setStep('certificate');
  };

  const handleExitVerification = () => {
    onClose();
  };

  // ── Overlay wrapper ──
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ════════ TASTE TEST ════════ */}
          {step === 'taste' && (
            <motion.div key="taste" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-syne font-extrabold text-xl text-[#fafafa]">Taste Test</h2>
                <span className="font-mono text-[12px]" style={{ color: '#525252' }}>
                  Response {pairIndex + 1} of 5
                </span>
              </div>

              {/* Prompt */}
              <div className="p-4 rounded-xl mb-6" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#525252' }}>Client Question</span>
                <p className="text-[14px] text-[#fafafa] mt-1 font-medium">{TASTE_PAIRS[pairIndex].prompt}</p>
              </div>

              {/* Side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #333' }}>
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold" style={{ color: '#666' }}>Base AI</span>
                  <p className="text-[13px] leading-relaxed mt-3 text-[#a3a3a3]">{TASTE_PAIRS[pairIndex].base}</p>
                </div>
                <div className="p-5 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid rgba(56,189,248,0.4)' }}>
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold" style={{ color: '#38bdf8' }}>LexAI — Your AI</span>
                  <p className="text-[13px] leading-relaxed mt-3 text-[#fafafa]">{TASTE_PAIRS[pairIndex].lexai}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleTasteVote(true)}
                  className="px-6 py-3 rounded-full font-syne font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#38bdf8', color: '#000' }}
                >
                  👍 LexAI is better
                </button>
                <button
                  onClick={() => handleTasteVote(false)}
                  className="px-6 py-3 rounded-full font-syne font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#1a1a1a', color: '#a3a3a3', border: '1px solid #333' }}
                >
                  👎 About the same
                </button>
              </div>
            </motion.div>
          )}

          {/* ════════ TASTE RESULT ════════ */}
          {step === 'taste-result' && (
            <motion.div key="taste-result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-5 py-8"
            >
              <div className="text-[56px]">🎯</div>
              <h2 className="font-syne font-extrabold text-2xl text-[#fafafa]">
                You approved {approvals} of 5 responses
              </h2>
              <p className="font-mono text-[13px]" style={{ color: '#525252' }}>
                Taste score: <span style={{ color: '#38bdf8' }}>{tasteScore}/100</span>
              </p>
              <button
                onClick={() => setStep('checklist')}
                className="mt-4 px-8 py-3 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#38bdf8', color: '#000' }}
              >
                Run Compliance Check →
              </button>
            </motion.div>
          )}

          {/* ════════ CHECKLIST ════════ */}
          {step === 'checklist' && (
            <motion.div key="checklist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="font-syne font-extrabold text-xl text-[#fafafa] mb-1">TX Bar Compliance Review</h2>
              <p className="font-mono text-[12px] mb-6" style={{ color: '#525252' }}>
                Run each test to verify LexAI meets professional standards.
              </p>

              <div className="space-y-3">
                {CHECKLIST_ITEMS.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl" style={{ background: '#0a0a0a', border: `1px solid ${passedItems.has(idx) ? 'rgba(52,211,153,0.3)' : '#1a1a1a'}` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {passedItems.has(idx) && <CheckCircle2 size={14} style={{ color: '#34d399' }} />}
                        <span className="text-[13px] text-[#fafafa] font-medium">{item.label}</span>
                      </div>
                      {!shownResponses.has(idx) && !passedItems.has(idx) && (
                        <button
                          onClick={() => handleRunTest(idx)}
                          disabled={runningIdx !== null}
                          className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all"
                          style={{ border: '1px solid #2a2a2a', color: '#38bdf8' }}
                        >
                          {runningIdx === idx ? 'Running...' : 'Run test →'}
                        </button>
                      )}
                    </div>

                    {/* Shown after run */}
                    {shownResponses.has(idx) && !passedItems.has(idx) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-2">
                        <div className="p-3 rounded-lg" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                          <span className="font-mono text-[10px] uppercase" style={{ color: '#525252' }}>Test Prompt</span>
                          <p className="text-[12px] text-[#a3a3a3] mt-1">{item.prompt}</p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ background: '#111', border: '1px solid rgba(56,189,248,0.2)' }}>
                          <span className="font-mono text-[10px] uppercase" style={{ color: '#38bdf8' }}>LexAI Response</span>
                          <p className="text-[12px] text-[#fafafa] mt-1 leading-relaxed">{item.response}</p>
                        </div>
                        <button
                          onClick={() => handlePassItem(idx)}
                          className="font-mono text-[12px] px-4 py-2 rounded-lg transition-all hover:opacity-90 mt-1"
                          style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}
                        >
                          ✅ Pass
                        </button>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {passedItems.size === 5 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                  <button
                    onClick={handleGenerateCert}
                    className="px-8 py-3 rounded-full font-syne font-bold text-sm transition-opacity hover:opacity-90"
                    style={{ background: '#34d399', color: '#000' }}
                  >
                    Generate My Certificate →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ════════ CERTIFICATE ════════ */}
          {step === 'certificate' && (
            <motion.div key="certificate" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="rounded-2xl p-8 md:p-10" style={{
                background: '#0a0a0a',
                border: '1px solid rgba(52,211,153,0.3)',
                boxShadow: '0 0 60px rgba(52,211,153,0.08)',
              }}>
                <div className="text-center mb-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                    style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                    Verified
                  </span>
                  <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-[#fafafa] mt-4 tracking-tight">
                    REWARDFORGE ALIGNMENT CERTIFICATE
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left column */}
                  <div className="space-y-5">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#525252' }}>Organization</span>
                      <p className="text-[15px] font-syne font-semibold text-[#fafafa] mt-1">Chen & Associates Legal Group</p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#525252' }}>Certified By</span>
                      <p className="text-[15px] font-syne font-semibold text-[#fafafa] mt-1">Marcus Chen · Managing Partner</p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#525252' }}>Professional Standards</span>
                      <p className="text-[13px] text-[#fafafa] mt-1">State Bar of Texas Guidelines · Rule 1.01 Competent and Diligent Representation</p>
                      <p className="text-[12px] mt-1" style={{ color: '#34d399' }}>5/5 compliance items verified by Marcus Chen personally</p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#525252' }}>TX Bar Number</span>
                      <p className="text-[15px] font-syne font-semibold text-[#fafafa] mt-1">#2891047 · 50 years experience</p>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-5">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#525252' }}>Quality Score</span>
                      <div className="text-[56px] font-syne font-extrabold mt-1" style={{ color: '#34d399' }}>
                        <AnimatedScore target={tasteScore} /><span className="text-[24px] text-[#525252]">/100</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#525252' }}>Training Date</span>
                      <p className="text-[15px] font-syne font-semibold text-[#fafafa] mt-1">
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#525252' }}>Certificate ID</span>
                      <p className="text-[15px] font-mono font-semibold text-[#fafafa] mt-1">RF-2026-00291</p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#525252' }}>Verified By</span>
                      <p className="text-[13px] text-[#fafafa] mt-1">Marcus Chen · Personal taste test · {approvals} of 5 approved</p>
                    </div>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6" style={{ borderTop: '1px solid #1a1a1a' }}>
                  {[
                    { icon: Lock, label: 'Private' },
                    { icon: Shield, label: 'Credentialed' },
                    { icon: FileText, label: 'Auditable' },
                    { icon: Scale, label: 'CA Bar Verified' },
                  ].map(b => (
                    <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                      <b.icon size={12} style={{ color: '#34d399' }} />
                      <span className="font-mono text-[11px]" style={{ color: '#34d399' }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions below cert */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => addToast({ type: 'info', message: 'Certificate download coming soon' })}
                  className="px-6 py-2.5 rounded-full font-syne font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#1a1a1a', color: '#fafafa', border: '1px solid #333' }}
                >
                  Download Certificate
                </button>
                <button
                  onClick={() => addToast({ type: 'info', message: 'Share feature coming soon' })}
                  className="px-6 py-2.5 rounded-full font-syne font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#1a1a1a', color: '#fafafa', border: '1px solid #333' }}
                >
                  Share
                </button>
              </div>
              <div className="text-center mt-4">
                <button
                  onClick={handleExitVerification}
                  className="font-mono text-[12px] transition-colors"
                  style={{ color: '#525252' }}
                >
                  Exit verification
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
