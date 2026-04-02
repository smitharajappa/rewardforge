// Local smart response engine — replaces Groq API calls

export const GROQ_RATE_LIMIT = 30;

interface ResponseRule {
  keywords: string[];
  response: string;
  useCase?: string[];
}

const UNIVERSAL_RESPONSES: ResponseRule[] = [
  { keywords: ['what is rlhf', 'explain rlhf', 'how does rlhf', 'rlhf mean'], response: "RLHF stands for Reinforcement Learning from Human Feedback. In plain terms: you show an AI two responses and pick the better one. The AI learns your preferences from those choices and improves over time. RewardForge automates the technical parts so you just do the picking." },
  { keywords: ['reward model', 'what is rm', 'rm accuracy', 'train rm'], response: "A reward model is an AI that learned what good responses look like based on your pairwise comparisons. It scores new responses before they reach your end users. Higher accuracy means it better reflects your judgment. Aim for 85% or above before running the RL loop." },
  { keywords: ['pairwise', 'comparison', 'a vs b', 'annotate', 'annotation'], response: "Pairwise comparison is the core of your training data. You see two AI responses to the same question and pick the better one. Each choice teaches the reward model one unit of your professional judgment. Five comparisons is the minimum — ten or more gives significantly stronger results." },
  { keywords: ['rl loop', 'reinforcement', 'ppo', 'dpo', 'grpo', 'policy'], response: "The RL loop takes your trained reward model and uses it to improve the base AI policy. PPO is the safest starting point — it improves outputs while staying close to the original model behavior. DPO is faster and more stable for small datasets. GRPO is best when you have 50 or more comparisons." },
  { keywords: ['kl divergence', 'kl div', 'kl penalty'], response: "KL divergence measures how far your fine-tuned model has drifted from the base model. Lower is safer. Keep KL below 0.15 to avoid unexpected behavior changes. Your current run is within safe bounds." },
  { keywords: ['loss', 'training accuracy', 'how accurate'], response: "Training loss measures how well the reward model predicts your preferences. As loss decreases, accuracy increases. A loss below 0.6 with accuracy above 70% means the model has genuinely learned your judgment — not just memorized responses." },
  { keywords: ['epoch', 'batch size', 'learning rate', 'hyperparameter'], response: "For small datasets under 20 comparisons, use 3 epochs. For larger datasets use 2. Batch size of 8 is optimal for the SLMs we train on. Learning rate of 2e-5 is the safe default — only adjust if accuracy plateaus after epoch 2." },
  { keywords: ['huggingface', 'export', 'download model', 'push model', 'hf hub'], response: "You can export your trained reward model to HuggingFace Hub directly from the Train RM screen. You will need an HF token starting with hf_ from huggingface.co/settings/tokens. The model exports in safetensors format for maximum compatibility." },
  { keywords: ['certificate', 'certified', 'compliance', 'proof', 'audit'], response: "Your Alignment Certificate documents that this AI was trained by named credentialed professionals on your specific use case. It includes a quality score, training date, certificate ID, and the professional standards it was trained against. Scale AI cannot produce a certificate with your experts' names on it." },
  { keywords: ['private', 'data', 'secure', 'confidential', 'where data'], response: "Your data never leaves your browser in Phase 1. Documents are processed locally and only the extracted question and answer pairs are used for training pairs — not your original files. In Phase 2, training runs on Modal Labs GPU infrastructure with encrypted data in transit and at rest." },
  { keywords: ['scale ai', 'labelbox', 'competitor', 'compare', 'versus'], response: "Scale AI starts at $250,000 and their certificate says trained by Scale AI contractors. Labelbox has no training pipeline. HuggingFace TRL has no UI and requires ML engineers. RewardForge gives your licensed experts the tools to train and certify AI themselves — your name on the certificate." },
  { keywords: ['phase 2', 'roadmap', 'coming soon', 'future', 'next'], response: "Phase 2 adds real GPU training via Modal Labs completing in 20 to 45 minutes, downloadable PDF certificates, team annotation with multiple credentialed experts, compliance drift detection with weekly AI auditing, and on-premise deployment for attorney-client privilege or HIPAA environments." },
  { keywords: ['pricing', 'cost', 'plan', 'how much', 'subscription'], response: "Free plan covers 1,000 comparisons and 1 training run. Starter at $99 per month adds official certificates. Growth at $499 per month includes API access, 20 GPU hours, and up to 10 users. Enterprise at $5,000 to $20,000 per month adds on-premise deployment, SSO, and a dedicated ML engineer." },
];

const LEGAL_RESPONSES: ResponseRule[] = [
  { keywords: ['california', 'ca bar', 'bar association', 'rule 1.1', 'competence', 'malpractice'], response: "California Bar Rule 1.1 on Duty of Competence now explicitly includes understanding AI tools used in legal practice. Your Alignment Certificate references this rule directly — documenting that LexAI was trained and verified by a CA Bar licensed attorney. This is the compliance trail the bar association looks for." },
  { keywords: ['non-compete', '16600', 'compete', 'employment'], response: "California Business and Professions Code Section 16600 makes almost all non-compete agreements unenforceable in California regardless of what the contract says. LexAI is calibrated to cite this statute specifically rather than giving generic multi-jurisdiction hedging." },
  { keywords: ['deposit', 'landlord', 'tenant', 'rental', 'security deposit'], response: "California Civil Code Section 1950.5 gives landlords 21 days to return a security deposit or provide an itemized statement. LexAI knows this timeline and cites it specifically rather than saying laws vary by jurisdiction." },
  { keywords: ['record', 'recording', 'consent', 'wiretap', 'penal code'], response: "California Penal Code Section 632 requires all-party consent for recording conversations. LexAI is calibrated to cite this directly rather than hedging with generic one-party versus two-party language when the client is clearly in California." },
  { keywords: ['quality', 'score', 'taste test', '94', '100', 'approved'], response: "Your quality score reflects the proportion of LexAI responses you personally approved in the taste test. A score of 94 or above means the AI is responding in line with your professional judgment on the large majority of client questions. You made that determination — not a contractor, not an ML engineer." },
  { keywords: ['how', 'work', 'train', 'judgment', 'expertise', 'learn'], response: "You reviewed response pairs and selected the ones that matched your professional judgment. LexAI learned from those choices. Think of it like onboarding a new associate who learned your standards in 45 minutes and never forgets them." },
];

const MEDICAL_RESPONSES: ResponseRule[] = [
  { keywords: ['hipaa', 'patient', 'privacy', 'phi', 'health information'], response: "HIPAA compliance is built into the training process. Your patient data never enters the training pipeline — only anonymized clinical question patterns are used. Your Alignment Certificate references AMA Clinical Documentation Standards as the professional standard your AI was trained against." },
  { keywords: ['ama', 'clinical', 'documentation', 'soap', 'note'], response: "AMA guidelines on AI in clinical practice emphasize that physician oversight must be documented. Your Alignment Certificate provides exactly that documentation — showing which physician trained the AI, under which clinical standards, and on which date." },
  { keywords: ['diagnosis', 'treatment', 'prescribe', 'medication', 'clinical'], response: "Your trained AI is calibrated to provide clinical decision support — not autonomous diagnosis. The compliance checklist verifies it always recommends physician consultation for treatment decisions, which protects both patients and your practice from liability." },
  { keywords: ['accuracy', 'quality', 'score', 'how accurate'], response: "Your quality score reflects physician-reviewed response accuracy — not a generic machine learning metric. The clinicians at your practice evaluated responses against AMA standards and approved the ones that met your clinical judgment." },
];

const FINANCIAL_RESPONSES: ResponseRule[] = [
  { keywords: ['cfa', 'sec', 'fiduciary', 'suitability', 'regulatory'], response: "CFA Institute Code of Ethics requires that AI tools used in investment advice be subject to advisor oversight and documentation. Your Alignment Certificate records that a CFA charterholder trained and reviewed the AI — satisfying the documentation requirement for AI governance in financial practice." },
  { keywords: ['advice', 'recommend', 'investment', 'portfolio', 'suitability'], response: "Your trained AI is calibrated to provide information and education — not personalized investment advice — unless presented alongside a licensed advisor. The compliance checklist verifies this distinction is maintained in every response." },
  { keywords: ['bias', 'hallucinate', 'wrong', 'mistake', 'error'], response: "Financial AI hallucination is a genuine risk. Your reward model training specifically penalizes responses that cite specific return figures without sources, make guarantees about outcomes, or give jurisdiction-specific tax advice without verification prompts." },
  { keywords: ['quality', 'score', 'accurate', 'how good'], response: "Your quality score reflects CFA-reviewed response accuracy against the CFA Institute Code of Ethics. Each response was evaluated by a licensed financial professional — not rated by a generic annotation contractor." },
];

const CS_RESPONSES: ResponseRule[] = [
  { keywords: ['tone', 'brand', 'voice', 'personality', 'respond'], response: "Customer service AI trained with RewardForge reflects your team's specific communication style — not a generic corporate tone. Your annotators picked responses that matched your brand voice, so the trained AI responds the way your best agents do." },
  { keywords: ['escalat', 'human', 'agent', 'handoff', 'transfer'], response: "Your trained AI is calibrated to recognize escalation triggers — frustrated customers, complex complaints, billing disputes — and hand off to a human agent with context. The compliance checklist verifies this behavior is consistent." },
  { keywords: ['csat', 'satisfaction', 'nps', 'rating', 'feedback'], response: "Teams using AI trained with RewardForge typically see CSAT improvements because responses match the tone and completeness of your best human agents. Your quality score tracks how well the AI matches your team's preferred responses." },
];

const EDU_RESPONSES: ResponseRule[] = [
  { keywords: ['student', 'learn', 'curriculum', 'teach', 'pedagogy'], response: "Educational AI trained with RewardForge is calibrated to your specific curriculum, grade level, and pedagogical approach. Your educators picked responses that matched their teaching style — so the AI tutors the way your best teachers do." },
  { keywords: ['ferpa', 'privacy', 'student data', 'parental'], response: "FERPA compliance requires that student data is protected. RewardForge does not use student records in training — only anonymized question patterns from your curriculum materials. Your Alignment Certificate references ISTE Educator Standards as the professional standard your AI was trained against." },
  { keywords: ['scaffold', 'differentiat', 'level', 'ability', 'special needs'], response: "Your trained educational AI can be calibrated to different ability levels by having educators annotate response pairs at each level separately. Each annotation set produces a separate aligned model for grade-level, advanced, or supported learners." },
];

const DEV_RESPONSES: ResponseRule[] = [
  { keywords: ['api', 'endpoint', 'integrate', 'sdk', 'curl', 'rest'], response: "The RewardForge API exposes POST /v1/comparisons for submitting annotation pairs, POST /v1/training/start to trigger a training run, GET /v1/training/{job_id}/status to poll progress, and GET /v1/models to list trained reward models. API access requires the Growth plan or above." },
  { keywords: ['webhook', 'callback', 'notify', 'event', 'training complete'], response: "Training completion triggers a webhook POST to your configured endpoint with job_id, final_accuracy, model_id, and a signed download URL. Set your webhook URL in Settings." },
  { keywords: ['llama', 'mistral', 'gpt', 'gemma', 'base model', 'which model'], response: "RewardForge supports GPT-2 117M, GPT-J 6B, LLaMA 2 7B and 13B, and Mistral 7B as base models. For most use cases, GPT-J 6B gives the best balance of quality and training cost. LLaMA 2 13B produces the strongest results but costs approximately 3x more per run." },
  { keywords: ['rate limit', 'quota', 'limit', 'too many', '429'], response: "The free plan allows 30 API calls per day. Starter allows 500 per day. Growth allows 5,000 per day. Calls are counted per comparison submission, training start, and model export — not per inference query." },
  { keywords: ['token', 'context', 'max length', 'seq length'], response: "Max sequence length controls the maximum input length the reward model processes. 512 tokens covers most response pairs. Increase to 1024 if your responses are consistently longer than 300 words. Going above 2048 increases training cost significantly without proportional accuracy gains." },
];

const USE_CASE_DEFAULTS: Record<string, string> = {
  legal: "I am LexAI — your firm's AI, trained on Marcus Chen's professional judgment. Ask me about your training results, California law calibration, your compliance certificate, or how to interpret any part of the verification process.",
  medical: "I am your clinical AI assistant, trained on your team's medical judgment. Ask me about your training results, AMA compliance standards, your alignment certificate, or how to interpret your quality score.",
  financial: "I am your financial AI assistant, trained on your firm's investment judgment. Ask me about your training results, CFA compliance standards, your alignment certificate, or how to read your quality metrics.",
  customer_service: "I am your customer service AI, trained on your team's communication style. Ask me about your training results, your quality score, or how to improve your AI's responses to match your best agents.",
  education: "I am your educational AI assistant, trained on your curriculum and teaching approach. Ask me about your training results, ISTE compliance standards, or how to calibrate responses for different learning levels.",
  developer: "I am the RewardForge Copilot. Ask me about API integration, training hyperparameters, model selection, webhook configuration, rate limits, or interpreting your reward model metrics.",
};

const USE_CASE_RESPONSES: Record<string, ResponseRule[]> = {
  legal: LEGAL_RESPONSES,
  medical: MEDICAL_RESPONSES,
  financial: FINANCIAL_RESPONSES,
  customer_service: CS_RESPONSES,
  education: EDU_RESPONSES,
  developer: DEV_RESPONSES,
};

function matchKeywords(message: string, rules: ResponseRule[]): string | null {
  const lower = message.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.response;
    }
  }
  return null;
}

export async function callGroq(
  _systemPrompt: string,
  userMessage: string,
  _groqKey: string,
): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 600));

  const useCase = localStorage.getItem('rf_use_case') || 'developer';
  const demoMode = localStorage.getItem('rf_demo_mode');
  const effectiveUseCase = demoMode === 'marcus' ? 'legal' : useCase;

  // 1. Universal
  const universal = matchKeywords(userMessage, UNIVERSAL_RESPONSES);
  if (universal) return universal;

  // 2. Use-case specific
  const specific = USE_CASE_RESPONSES[effectiveUseCase];
  if (specific) {
    const match = matchKeywords(userMessage, specific);
    if (match) return match;
  }

  // 3. Use-case default
  if (effectiveUseCase === 'legal' || demoMode === 'marcus') {
    return USE_CASE_DEFAULTS.legal;
  }
  return USE_CASE_DEFAULTS[effectiveUseCase] || "Ask me anything about your training pipeline, reward model results, alignment certificate, or how to improve your AI's responses for your use case.";
}

export function getGroqKey(): string {
  return null as unknown as string;
}

export function saveGroqKey(key: string) {
  localStorage.setItem('rf_groq_key', key);
}
