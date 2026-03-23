export const LEGAL_FAQ = `Chen & Associates Legal Group - Client FAQ

Q: What should I do if my landlord won't make repairs or fix the heating?

Q: Can I be fired without warning after several years of service?

Q: My business partner wants to dissolve our LLC but I disagree. What are my rights?

Q: A customer is threatening to sue me for a product that broke. What should I do?

Q: I signed a non-compete agreement. Can my old employer stop me from starting a new business?

Q: My contractor didn't finish the work but is demanding full payment. What are my options?

Q: I received a cease and desist letter for my small business logo. Is it legitimate?

Q: My employee filed a workers comp claim I believe is fraudulent. What can I do?

Q: Our vendor is not delivering what was in the contract. Can we cancel and get a refund?

Q: I want to trademark my business name. What is the process and what can go wrong?`;

export const MEDICAL_FAQ = `Medical Practice - Patient FAQ

Q: What are the common side effects of this medication and how long do they last?

Q: How long does recovery typically take after this procedure?

Q: When should I be concerned and call the doctor immediately?

Q: Is it safe to take this medication with my other prescriptions?

Q: What lifestyle changes should I make after my diagnosis?

Q: How often do I need to come in for follow-up appointments?

Q: What does this test result mean for my health?

Q: Can I exercise or return to normal activities during treatment?

Q: What symptoms should prompt me to go to the emergency room?

Q: How do I manage pain at home between appointments?`;

export const FINANCIAL_FAQ = `Financial Advisory - Client FAQ

Q: How should I allocate my retirement savings given my age and risk tolerance?

Q: What is the best strategy for paying off my debt while also saving?

Q: How much risk should I be taking with my investment portfolio right now?

Q: When should I start withdrawing from my retirement accounts?

Q: Should I pay off my mortgage early or invest that money instead?

Q: How do I protect my portfolio during a market downturn?

Q: What tax strategies should I be using to maximize my savings?

Q: How much life insurance do I actually need for my family?

Q: Should I invest in a Roth IRA or traditional IRA given my situation?

Q: How do I start building an emergency fund while paying down debt?`;

export const CS_FAQ = `Customer Support - Common Questions

Q: Where is my order and when will it arrive?

Q: How do I return a product and get a refund?

Q: Can I change or cancel my subscription?

Q: Why was I charged an unexpected amount?

Q: My product arrived damaged. What should I do?

Q: How do I update my account information and password?

Q: Can I get a discount or apply a promo code to my order?

Q: How long does shipping take to my location?

Q: My order shows delivered but I haven't received it. What now?

Q: How do I speak to a human customer service agent?`;

export const EDUCATION_FAQ = `Education Platform - Student FAQ

Q: Can you explain this concept in simpler terms I can actually understand?

Q: What are some practice problems to help me master this topic?

Q: How do I solve this type of problem step by step?

Q: What should I focus on studying for the upcoming exam?

Q: I'm stuck on this homework problem. Can you walk me through it?

Q: What is the difference between these two similar concepts?

Q: How does this topic connect to what we learned before?

Q: Can you give me a real-world example of how this is used?

Q: I keep making the same mistake. How do I stop doing this?

Q: What are the most important things to remember from this chapter?`;

export const DEVELOPER_FAQ = `Developer Platform - Technical FAQ

Q: How do I integrate the RewardForge API into my existing ML pipeline?

Q: What is the recommended dataset size for training a good reward model?

Q: When should I use DPO versus PPO for my specific use case?

Q: How do I prevent reward hacking during RL fine-tuning?

Q: What does a healthy KL divergence value look like during training?

Q: How do I export my trained model and deploy it to production?

Q: What base model should I choose for my reward model training?

Q: How many training epochs should I run without overfitting?

Q: How do I interpret the loss curves during reward model training?

Q: What is inter-annotator agreement and how do I improve it?`;

export const FAQ_BY_USE_CASE: Record<string, string> = {
  legal: LEGAL_FAQ,
  medical: MEDICAL_FAQ,
  financial: FINANCIAL_FAQ,
  customer_service: CS_FAQ,
  education: EDUCATION_FAQ,
  developer: DEVELOPER_FAQ,
};

export const FAQ_LABEL: Record<string, string> = {
  legal: "Use Marcus's Law Firm FAQ →",
  medical: "Use example Medical FAQ →",
  financial: "Use example Financial FAQ →",
  customer_service: "Use example Support FAQ →",
  education: "Use example Education FAQ →",
  developer: "Use example Tech FAQ →",
};

export const FAQ_SUBTITLE: Record<string, string> = {
  legal: "47 questions from a California law firm",
  medical: "38 questions from a medical practice",
  financial: "42 questions from a financial advisor",
  customer_service: "51 questions from a support team",
  education: "35 questions from an education platform",
  developer: "30 technical questions for developers",
};

export const USE_CASE_LABEL: Record<string, string> = {
  legal: 'legal',
  medical: 'medical',
  financial: 'financial',
  customer_service: 'customer service',
  education: 'education',
  developer: 'general',
};
