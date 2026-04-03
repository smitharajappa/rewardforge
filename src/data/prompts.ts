export interface Prompt {
  text: string;
  responseA: string;
  responseB: string;
}

export const PROMPTS: Prompt[] = [
  {
    text: "My landlord hasn't fixed the heating for 3 weeks. What are my options?",
    responseA: `Under the implied warranty of habitability, which has been established in virtually all US jurisdictions through case law and statutory provisions, a landlord bears the legal obligation to maintain rental premises in a habitable condition. The failure to provide adequate heating systems, particularly during winter months, constitutes a material breach of this warranty. Tenants may pursue several remedies including rent withholding, repair and deduct (in jurisdictions permitting same), constructive eviction claims, or housing code violation complaints with municipal authorities. Documentation of all communications and conditions is essential.`,
    responseB: `Your landlord is breaking the law. Here's what to do this week: 1) Send written notice by certified mail today documenting the issue. 2) Photograph everything with timestamps. 3) In most states you can withhold rent or hire someone to fix it after 30 days of no action. 4) File a complaint with your local housing authority — it's free and fast. Want me to look up the specific rules for your state?`,
  },
  {
    text: "I was fired without warning after 4 years. Do I have a case for wrongful termination?",
    responseA: `The determination of wrongful termination liability requires analysis under multiple legal frameworks. In at-will employment states, which constitute the majority of US jurisdictions, employers generally retain broad discretion to terminate employment relationships absent contractual provisions to the contrary. However, exceptions exist for terminations predicated upon protected characteristics enumerated under Title VII of the Civil Rights Act, the Americans with Disabilities Act, Age Discrimination in Employment Act, and analogous state statutes. Additionally, claims may arise under promissory estoppel, implied covenant of good faith, or public policy exceptions.`,
    responseB: `It depends on WHY you were fired. Quick check: Were you fired because of your race, gender, age, disability, or religion? That's illegal discrimination. Did you recently report something illegal (whistleblower)? Also protected. Did you have a written employment contract? That changes everything. If none of those apply and you're in an at-will state, unfortunately most firings are legal even if unfair. Tell me more about your situation and I can be more specific.`,
  },
  {
    text: "My business partner wants to dissolve our LLC but I don't agree. What are my rights?",
    responseA: `LLC dissolution disputes are governed primarily by the operating agreement executed between the members, supplemented by applicable state LLC statutes where the operating agreement is silent or ambiguous. Under most state frameworks including Delaware, Texas, and New York LLC acts, dissolution may require unanimous member consent absent contrary provisions in the operating agreement. Members opposing dissolution may petition for judicial intervention, seek injunctive relief, or invoke buy-out provisions if stipulated. The fiduciary duties owed between members may also give rise to claims for breach in circumstances involving improper dissolution attempts.`,
    responseB: `Check your LLC operating agreement first — it should spell out exactly how dissolution works. If it requires unanimous agreement, your partner can't force it without you. If they're trying to push through dissolution anyway, you can: 1) Demand a buyout at fair market value, 2) Go to court for an injunction to stop it, 3) Negotiate — sometimes one partner buys out the other. What does your operating agreement say about dissolution?`,
  },
  {
    text: "A customer is threatening to sue me for a product that broke. What should I do?",
    responseA: `Upon receipt of litigation threats, businesses should immediately implement litigation hold protocols to preserve all potentially relevant documentation. The merits analysis requires examination of applicable product liability theories including manufacturing defects, design defects, and failure to warn under both negligence and strict liability frameworks. Warranty claims under the Uniform Commercial Code, specifically implied warranties of merchantability, may also be implicated. Risk assessment should consider the customer's damages, the strength of their claim, litigation costs, reputational costs, and insurance coverage availability.`,
    responseB: `Don't panic, but do act fast. Steps to take today: 1) Don't admit fault or apologize in writing — this can hurt you later. 2) Document everything: the product, photos, customer communications. 3) Check if you have product liability insurance — call your insurer now. 4) Depending on the dollar amount, it may be cheaper to offer a refund or replacement than to fight it. What's the product and roughly how much money is involved?`,
  },
  {
    text: "I signed a non-compete clause. Can my old employer stop me from starting a new business?",
    responseA: `Non-compete enforceability varies dramatically across jurisdictions, with Texas applying a reasonableness standard examining temporal scope, geographic limitations, and legitimate business interest protection, while some states like North Dakota and Minnesota generally prohibit such agreements. Courts engage in blue-penciling analysis to modify overly broad provisions in many jurisdictions. The FTC Non-Compete Rule, subject to ongoing litigation, would significantly restrict enforcement in the private sector. Material consideration adequacy at contract formation may also affect enforceability.`,
    responseB: `Good news: non-competes are very hard to enforce and often unenforceable. Key questions: What state are you in? (Some states ban them entirely.) How long does it last? (Courts reject anything over 1-2 years.) How broad is the geographic area? Are you actually competing with them, or just in the same general industry? In most cases, if you're starting something in a different niche, you're fine. Send me the specific language and I'll tell you what the real risk is.`,
  },
  {
    text: "My contractor didn't finish the work but wants full payment. What should I do?",
    responseA: `Construction contract disputes implicating incomplete performance are evaluated under substantial performance doctrine principles, whereby courts assess whether the deviation from contractual specifications is material or merely nominal. Remedies available to property owners include withholding of payment proportionate to incomplete work, seeking specific performance requiring completion, pursuing breach of contract damages including cost of completion, or asserting claims for defective workmanship. Mechanic's lien implications must also be assessed given contractor rights to encumber property for unpaid work claims.`,
    responseB: `Do not pay the full amount. Here's the simple approach: 1) Write down exactly what's unfinished with photos. 2) Calculate the reasonable cost to finish the work yourself. 3) Offer to pay the full contract minus that amount. 4) Get everything in writing. 5) If they threaten a lien, most states require contractors to finish work before they can file one. Small claims court handles this well if it's under $10-15k. What specifically wasn't finished?`,
  },
  {
    text: "I received a cease and desist letter for my small business logo. Is this legitimate?",
    responseA: `Trademark infringement cease and desist correspondence requires careful analysis under the Lanham Act likelihood of confusion standard, which considers factors including mark similarity, goods and services proximity, evidence of actual confusion, marketing channels, purchaser sophistication, and the strength of the senior user's mark. Reverse confusion doctrine may apply where a larger entity uses a mark similar to that of a smaller prior user. Response options include challenging infringement allegations, negotiating coexistence agreements, or modifying the allegedly infringing mark.`,
    responseB: `C&D letters are often scare tactics — receiving one doesn't mean you're actually infringing. First, check: Is their trademark actually registered? (Search USPTO.gov, it's free.) How similar are the logos really? Are you in the same industry serving the same customers? Many small businesses successfully push back on these letters. Don't just change your logo out of fear. But also don't ignore it — you have 30 days to respond. Want help figuring out if this has merit?`,
  },
  {
    text: "My employee filed a workers comp claim I think is fraudulent. What can I do?",
    responseA: `Workers' compensation fraud investigation and dispute procedures are administered through state workers' compensation boards and insurers. Employers suspecting fraudulent claims may report concerns to their insurer's Special Investigation Unit, request independent medical examinations, engage surveillance within legally permissible parameters, and challenge claims through formal hearing procedures. Documentation of the employee's job duties, the alleged incident circumstances, witness statements, and medical records is essential. Retaliatory discharge claims under applicable state law must be carefully avoided throughout the dispute process.`,
    responseB: `You have the right to dispute the claim but you must follow the process carefully. Steps: 1) Report your suspicion to your workers comp insurance carrier immediately — they have investigators for this. 2) Gather evidence: witness accounts, surveillance footage, social media (public posts are fair game), prior medical history if relevant. 3) Request an Independent Medical Exam (IME) — your insurer can arrange this. Critical warning: Do NOT fire or retaliate against the employee while the claim is pending — that's a separate lawsuit waiting to happen.`,
  },
  {
    text: "A vendor is not delivering what was in our contract. Can I cancel and get a refund?",
    responseA: `Contract rescission and cancellation rights arising from vendor non-performance require analysis of material breach doctrine, anticipatory repudiation principles, and applicable cure provisions within the agreement. The non-breaching party's obligations to mitigate damages are relevant to recovery calculations. Remedies may include rescission with restitution, expectation damages, consequential damages where foreseeable at contract formation, and specific performance in appropriate circumstances. Force majeure clause applicability should also be assessed given recent supply chain disruptions.`,
    responseB: `Yes, in most cases you can cancel and get a refund if they're not delivering what was promised. Here's the quick path: 1) Send a formal written notice giving them a specific deadline to perform (usually 10-30 days). 2) Document every missed delivery or failure in writing as it happens. 3) If they miss the deadline, send a written cancellation notice citing breach of contract. 4) Demand a refund of any prepayment. If they refuse, small claims court for amounts under $10-15k is fast and cheap. What does the contract say about breach and termination?`,
  },
  {
    text: "I want to trademark my business name. What's the process and what can go wrong?",
    responseA: `Federal trademark registration through the United States Patent and Trademark Office requires submission of a use-based application under 15 U.S.C. § 1051(a) or an intent-to-use application under § 1051(b), accompanied by identification of goods and services in the appropriate International Classification. The examination process involves USPTO review for descriptiveness, genericness, likelihood of confusion with existing registrations, and other statutory bars. Opposition proceedings before the Trademark Trial and Appeal Board may be initiated by third parties within 30 days of publication.`,
    responseB: `Great move — here's the practical guide: 1) First search the USPTO database (USPTO.gov/trademarks) to make sure no one has it already. 2) Choose the right 'class' — there are 45 categories. File in every class where you do business. 3) Cost: $250-350 per class to file. Takes 8-12 months. 4) What goes wrong: picking a too-generic name (can't trademark 'Fast Food'), not searching thoroughly, or filing the wrong class. Most common mistake: waiting too long — register early before someone beats you to it.`,
  },
];
// ── Medical Pairs ─────────────────────────────────────────────
export const MEDICAL_PROMPTS: Prompt[] = [
  {
    text: "What are the common side effects of this medication and how long do they last?",
    responseA: `Adverse drug reactions vary significantly based on pharmacokinetic and pharmacodynamic profiles of individual medications, patient-specific factors including hepatic and renal function, concomitant medications, and genetic polymorphisms affecting drug metabolism. Side effect duration correlates with drug half-life and elimination pathways. Patients should consult prescribing documentation and their healthcare provider for medication-specific adverse event profiles and expected duration of any symptomatic manifestations. `,
    responseB: `The most common side effects are listed on your prescription info sheet. For most medications, mild side effects like nausea or headache typically improve within a few days as your body adjusts. Tell me the medication name and I can give you more precise information. Always call your doctor if side effects feel severe or aren't improving after a week.`,
  },
  {
    text: "How long does recovery typically take after this procedure?",
    responseA: `Post-procedural recovery timelines are contingent upon multiple variables including the nature and complexity of the intervention, patient comorbidities, age-related healing factors, nutritional status, and adherence to post-operative protocols. Evidence-based recovery guidelines suggest stratified timelines based on procedure classification, with individual variation resulting in outcomes deviating substantially from population-based averages cited in clinical literature.`,
    responseB: `Recovery time really depends on the specific procedure. Most patients are back to light activity within 1-2 weeks and full activity in 4-6 weeks. Your surgeon's instructions are the most important guide. What procedure are you recovering from? I can give you more specific expectations.`,
  },
  {
    text: "When should I be concerned and call the doctor immediately?",
    responseA: `Indications for emergent medical consultation include but are not limited to acute onset chest pain with radiation patterns suggestive of cardiac etiology, respiratory compromise with oxygen saturation decline, neurological deficits including sudden onset weakness or speech impairment, signs of systemic sepsis including fever with hemodynamic instability, and acute abdominal presentations with peritoneal signs requiring surgical evaluation.`,
    responseB: `Call your doctor right away or go to emergency if you have: chest pain or pressure, difficulty breathing, sudden severe headache, one-sided weakness or face drooping, fever over 101°F with chills, or anything that feels suddenly much worse. When in doubt, call — doctors always prefer you check rather than wait too long.`,
  },
  {
    text: "Is it safe to take this medication with my other prescriptions?",
    responseA: `Drug-drug interaction assessment requires comprehensive medication reconciliation and analysis of pharmacokinetic interactions including CYP450 enzyme induction and inhibition, pharmacodynamic synergism or antagonism, and protein binding displacement effects. Clinical significance of identified interactions must be evaluated against therapeutic benefit in the context of individual patient risk factors. Consultation with a clinical pharmacist is recommended for complex medication regimens.`,
    responseB: `This is really important to check. The safest approach is to ask your pharmacist — they have specialized software that checks for interactions and can see your full medication list. You can also bring all your medications in their bottles to your next appointment. Don't stop taking anything without talking to your doctor first.`,
  },
  {
    text: "What lifestyle changes should I make after my diagnosis?",
    responseA: `Evidence-based lifestyle modification recommendations following diagnosis should be tailored to the specific pathological condition, comorbid conditions, and individual patient circumstances. General lifestyle interventions with demonstrated efficacy in chronic disease management include dietary optimization according to condition-specific nutritional guidelines, structured physical activity programs, sleep hygiene improvements, stress reduction protocols, and elimination of modifiable risk factors.`,
    responseB: `The three most impactful areas for most conditions: 1) Diet — reducing processed foods and sugar has broad benefits. 2) Movement — even 20-30 minutes of walking daily helps most conditions. 3) Sleep — aim for 7-8 hours consistently. Your doctor should give you specific guidance. What condition are you managing? I can point you to the most relevant changes.`,
  },
  {
    text: "How often do I need to come in for follow-up appointments?",
    responseA: `Follow-up appointment frequency is determined by clinical guidelines specific to the diagnosed condition, current disease activity or stability, treatment protocol requirements for monitoring therapeutic response and adverse effects, and individual patient risk stratification. Evidence-based follow-up intervals are delineated in condition-specific clinical practice guidelines and should be individualized based on clinical assessment.`,
    responseB: `Follow-up frequency depends on your condition and how stable things are. For most chronic conditions, visits are typically every 3-6 months once things are under control. If you're newly diagnosed or adjusting medication, it's often monthly or even weekly at first. If you're unsure about your specific schedule, call the office and ask.`,
  },
  {
    text: "What does this test result mean for my health?",
    responseA: `Laboratory and diagnostic test result interpretation requires consideration of reference range parameters, pre-analytical variables, assay methodology, clinical context, and the patient's complete medical history. Results outside reference ranges do not necessarily indicate pathology, as biological variation, medications, and physiological states can influence values. Correlation with clinical presentation and additional diagnostic workup may be warranted prior to clinical decision-making.`,
    responseB: `Test results can be confusing without context. Values within the normal range are reassuring, but your doctor looks at your specific numbers in the context of your symptoms and history. If something is flagged as abnormal, it doesn't always mean something serious — it might just need monitoring. What result are you trying to understand? I can help explain what the numbers typically mean.`,
  },
  {
    text: "Can I exercise or return to normal activities during treatment?",
    responseA: `Physical activity recommendations during therapeutic intervention must account for treatment-specific contraindications, physiological impact of the condition on exercise capacity, medication effects on cardiovascular and musculoskeletal response to exertion, and individualized risk-benefit assessment. Graduated return-to-activity protocols are preferable to abrupt resumption of pre-illness activity levels to minimize adverse events.`,
    responseB: `In most cases, staying as active as you comfortably can is actually beneficial for recovery. Light walking is usually fine unless your doctor specifically said to rest. Avoid anything that causes pain or feels too strenuous. Listen to your body — if you feel significantly worse after activity, scale back. What type of treatment are you going through?`,
  },
  {
    text: "What symptoms should prompt me to go to the emergency room?",
    responseA: `Emergency department utilization is indicated for acute presentations requiring immediate diagnostic evaluation and intervention not available in outpatient settings. Clinical scenarios warranting emergent evaluation include cardiovascular emergencies, acute neurological events, respiratory failure, hemodynamic instability, acute surgical conditions, and severe psychiatric emergencies with imminent safety concerns requiring immediate intervention.`,
    responseB: `Go to the ER immediately for: chest pain, difficulty breathing, sudden severe headache unlike any before, stroke symptoms (face drooping, arm weakness, speech difficulty), severe allergic reaction, heavy uncontrolled bleeding, or if you feel something is seriously wrong. Trust your instincts — if something feels like an emergency, it probably is.`,
  },
  {
    text: "How do I manage pain at home between appointments?",
    responseA: `Non-pharmacological pain management strategies with evidence-based support include thermal therapy application, transcutaneous electrical nerve stimulation, mindfulness-based stress reduction, cognitive behavioral approaches to pain management, graded activity, and physical therapy modalities. Pharmacological management should adhere to prescribed regimens with careful attention to dosing intervals and contraindications. `,
    responseB: `For managing pain at home: heat or ice packs often help — try both to see which works better for your situation. Over-the-counter options like acetaminophen or ibuprofen can help if your doctor approves them with your current medications. Gentle movement usually helps more than bed rest. Keep a pain diary noting what makes it better or worse — this helps your doctor adjust your treatment.`,
  },
];

// ── Financial Pairs ────────────────────────────────────────────
export const FINANCIAL_PROMPTS: Prompt[] = [
  {
    text: "How should I allocate my retirement savings given my age and risk tolerance?",
    responseA: `Asset allocation optimization in retirement portfolio construction involves analysis of time horizon relative to projected retirement date, risk tolerance assessment through both quantitative and qualitative measures, liability matching considerations, sequence of returns risk, and Monte Carlo simulation of probable outcomes across market scenarios. Modern portfolio theory suggests diversification across uncorrelated asset classes to optimize the efficient frontier. `,
    responseB: `A simple starting point: subtract your age from 110 — that's roughly the percentage to keep in stocks. So at 40, about 70% stocks and 30% bonds. As you get closer to retirement, gradually shift more conservative. The key is being honest about how you'd react to a 30% market drop. What's your current age and target retirement age?`,
  },
  {
    text: "What is the best strategy for paying off my debt while also saving?",
    responseA: `Optimal debt repayment strategy selection requires comparative analysis of interest rates across debt instruments, assessment of available liquidity and emergency reserve adequacy, evaluation of tax deductibility of interest payments, employer retirement contribution matching provisions, and psychological factors influencing adherence to financial plans. The mathematically optimal approach involves prioritizing highest interest rate debt elimination.`,
    responseB: `Here's the order that works: 1) Get your employer 401k match first — that's free money. 2) Pay minimums on all debts. 3) Attack your highest-interest debt aggressively (usually credit cards). 4) Once paid off, roll that payment to the next highest. Keep a $1,000 emergency fund while doing this. What does your debt look like?`,
  },
  {
    text: "How much risk should I be taking with my investment portfolio right now?",
    responseA: `Risk capacity assessment in portfolio management integrates both risk tolerance and risk capacity. Current market conditions including elevated valuations, interest rate environment, and macroeconomic uncertainty suggest careful consideration of downside protection strategies. Portfolio construction should reflect individual circumstances rather than market timing considerations, with regular rebalancing to maintain target allocation. `,
    responseB: `The right amount of risk depends on two things: when you need the money, and how you'd feel watching it drop 30%. If you need the money in less than 5 years, be conservative. If it's 20+ years away, you can generally handle more volatility. The market always recovers eventually, but only if you don't panic-sell. What are you investing for?`,
  },
  {
    text: "When should I start withdrawing from my retirement accounts?",
    responseA: `Optimal retirement distribution strategy requires analysis of Required Minimum Distribution schedules under IRC provisions, Roth conversion opportunities during low-income years, Social Security benefit optimization through delay strategies, Medicare premium surcharge thresholds, tax bracket management across multiple income sources, and longevity risk considerations in withdrawal rate determination.`,
    responseB: `Delay as long as you can if you have other income sources. Social Security grows 8% per year you delay after 62, up to age 70 — that's hard to beat. For 401k/IRA, you're required to start at 73, but starting earlier in low-income years can actually save taxes. What's your current situation — do you have other income sources?`,
  },
  {
    text: "Should I pay off my mortgage early or invest that money instead?",
    responseA: `The mortgage prepayment versus investment decision involves comparative analysis of mortgage interest rate adjusted for tax deductibility against expected investment returns net of taxes, consideration of liquidity preferences and opportunity cost, risk-adjusted return calculations across market scenarios, psychological utility of debt elimination, and individual tax situation.`,
    responseB: `It usually comes down to your mortgage rate vs. expected investment returns. If your rate is under 4%, historically investing wins. If it's above 6-7%, paying off the mortgage is more competitive. But there's real psychological value to being debt-free that the math doesn't capture. What's your mortgage rate?`,
  },
  {
    text: "How do I protect my portfolio during a market downturn?",
    responseA: `Portfolio resilience strategies during market contractions include diversification across asset classes with low correlation coefficients, allocation to traditionally defensive sectors, consideration of alternative investments including real assets, systematic rebalancing protocols, options-based hedging mechanisms, and maintenance of adequate liquidity reserves to avoid forced liquidation at depressed prices. `,
    responseB: `The best protection is preparation before the downturn. Three things that actually help: 1) Don't put money in stocks that you'll need within 5 years. 2) Keep enough cash or bonds that you won't need to sell stocks when they're down. 3) Have a plan you commit to now — don't make decisions in the panic. What percentage is in stocks right now?`,
  },
  {
    text: "What tax strategies should I be using to maximize my savings?",
    responseA: `Tax optimization strategies encompass contribution maximization to tax-advantaged accounts including 401(k), IRA, HSA, and 529 vehicles, tax-loss harvesting within taxable accounts, asset location optimization across account types, qualified business income deduction utilization for self-employed individuals, charitable giving strategies including donor-advised funds, and timing of income recognition and deductions.`,
    responseB: `The highest-impact moves for most people: 1) Max your 401k at minimum to get employer match. 2) Contribute to an HSA if you have a high-deductible health plan — it's triple tax-free. 3) Consider a Roth IRA if you're in a lower bracket now than you expect later. 4) Track charitable giving for deductions. What's your rough income level?`,
  },
  {
    text: "How much life insurance do I actually need for my family?",
    responseA: `Life insurance needs analysis employs multiple methodologies including the DIME approach encompassing debt obligations, income replacement calculations, mortgage balance, and education funding requirements. Human life value methodology estimates the present value of future earnings. Needs-based analysis quantifies specific financial obligations against existing assets and survivor income streams to determine appropriate coverage levels.`,
    responseB: `Simple starting point: 10-12 times your annual income, especially if you have young kids or a mortgage. If you earn $80k, aim for $800k-1M in coverage. Term life (20-30 year term) is usually the best value — much cheaper than whole life. Do you have dependents and a mortgage? I can help you think through the right amount.`,
  },
  {
    text: "Should I invest in a Roth IRA or traditional IRA given my situation?",
    responseA: `The Roth versus traditional IRA decision involves comparative analysis of current marginal tax rate against projected retirement tax rate, consideration of RMD elimination advantages of Roth accounts, estate planning implications, state tax treatment variations, income eligibility thresholds for direct Roth contributions, and backdoor Roth conversion availability for high-income individuals. `,
    responseB: `Simple rule: if you expect to be in a higher tax bracket in retirement than now, choose Roth. If you're in a higher bracket now, choose traditional. Young people early in their careers: almost always Roth. Higher earners in peak earning years: often traditional. If unsure, splitting contributions between both is perfectly reasonable. What's your current income range?`,
  },
  {
    text: "How do I start building an emergency fund while paying down debt?",
    responseA: `Emergency reserve establishment concurrent with debt service requires prioritization framework balancing liquidity risk against interest cost optimization. Behavioral economics research supports establishment of a minimum liquidity buffer prior to aggressive debt repayment to prevent debt recycling — the pattern of paying down revolving credit only to re-utilize it during financial disruptions. `,
    responseB: `Start small: get $1,000 in a separate savings account first. That handles most minor emergencies without touching credit cards. Then focus on high-interest debt. Once that's done, build to 3-6 months of expenses. Keep it in a separate account so you're not tempted to spend it. A high-yield savings account earns 4-5% right now — much better than a regular savings account.`,
  },
];

// ── Customer Service Pairs ─────────────────────────────────────
export const CS_PROMPTS: Prompt[] = [
  {
    text: "Where is my order and when will it arrive?",
    responseA: `Order fulfillment status inquiries can be resolved through consultation of your order confirmation documentation which contains a tracking number enabling real-time shipment monitoring through the designated carrier's tracking portal. Standard processing timeframes and estimated delivery windows are delineated in the terms and conditions associated with your purchase transaction. `,
    responseB: `Let me look that up right now. Can you share your order number? Once I have that I can give you the exact location of your package and a more accurate delivery estimate. If it's been longer than expected, we'll figure out what happened and make it right.`,
  },
  {
    text: "How do I return a product and get a refund?",
    responseA: `Product return and refund processing is governed by our return policy which specifies eligible return windows, condition requirements for returned merchandise, and refund disbursement methodologies. Initiating a return requires accessing the returns portal through your account dashboard and following the prescribed procedural steps to generate a return merchandise authorization.`,
    responseB: `Returns are easy — here's exactly how: Go to your account → Orders → select the item → click Return. Print the prepaid label, drop it off at any carrier location. Refunds go back to your original payment method within 3-5 business days. What item are you returning? I can confirm it's eligible.`,
  },
  {
    text: "Can I change or cancel my subscription?",
    responseA: `Subscription modification and cancellation requests can be processed through the account management interface under the Subscription Settings section. Changes to subscription parameters including plan selection, billing cycle modification, and cancellation are subject to the terms outlined in the subscription agreement, including applicable notice periods and proration calculations for mid-cycle modifications.`,
    responseB: `Yes, you can change or cancel anytime — no penalties. Go to Account Settings → Subscription → and you'll see options to change or cancel. If you cancel, you keep access until the end of your current billing period. If you're thinking about canceling because of a specific issue, tell me — there might be a better option.`,
  },
  {
    text: "Why was I charged an unexpected amount?",
    responseA: `Billing discrepancy investigations require examination of applicable charges against the rate schedule associated with your account tier, identification of any applicable taxes, fees, or surcharges, review of subscription modifications or usage-based billing components, and comparison against promotional pricing terms if applicable to your account. `,
    responseB: `I can look into that charge right now. The most common causes are: a subscription renewal, a usage charge if your plan has limits, or a tax not shown at checkout. Tell me the amount and approximate date — I'll pull up your account and explain exactly what it's for. If it's an error, we'll fix it immediately.`,
  },
  {
    text: "My product arrived damaged. What should I do?",
    responseA: `Receipt of damaged merchandise should be documented through photographic evidence capture prior to further handling. Damage claims must be initiated within the specified timeframe delineated in our damage policy through submission of the claims form accessible through your account portal, accompanied by supporting documentation including order confirmation and damage photographs.`,
    responseB: `I'm really sorry about that. Please take a few photos of the damage before doing anything else. Then reply here or email us with the photos and your order number, and we'll send a replacement right away. You don't need to return the damaged item. This should be resolved for you today.`,
  },
  {
    text: "How do I update my account information and password?",
    responseA: `Account information modification including personal data updates and credential management can be accomplished through the Account Settings section of your user profile. Password reset functionality is available through the authentication portal's password recovery workflow, which initiates a verification process through your registered email address. `,
    responseB: `Easy to update: Go to Account Settings → Edit Profile for personal info, or Security → Change Password for your password. If you're locked out, click Forgot password on the login page and we'll send a reset link to your email. If you don't have access to that email anymore, let me know and I can help verify your identity.`,
  },
  {
    text: "Can I get a discount or apply a promo code to my order?",
    responseA: `Promotional code application requires entry of the alphanumeric code in the designated promotional code field during the checkout process prior to order submission. Promotional offers are subject to eligibility requirements, expiration dates, and exclusion criteria as specified in the promotional terms and conditions. Retroactive application to completed transactions is generally not supported.`,
    responseB: `To apply a promo code, enter it in the Discount code box at checkout before you pay. If you already placed the order without it, let me know the code and order number — I can often apply it and refund the difference within 24 hours. If you're a first-time customer or haven't ordered in a while, I might be able to find something for you.`,
  },
  {
    text: "My order shows delivered but I haven't received it. What now?",
    responseA: `Non-receipt claims for orders with carrier-confirmed delivery status require initiation of a trace investigation with the originating carrier utilizing the tracking number associated with your shipment. Simultaneously, examination of delivery location including mailroom, building reception, neighbors, and alternative delivery access points is recommended prior to escalating to a formal claim process.`,
    responseB: `This is frustrating and I want to resolve it quickly. First, check around your delivery area — carriers sometimes mark delivered early, or leave packages with a neighbor or building manager. If it's been 24 hours with no package, send me your order number and delivery address. We'll file a carrier claim and either reship or issue a full refund — your choice.`,
  },
  {
    text: "How long does shipping take to my location?",
    responseA: `Shipping timeframe estimation requires consideration of origin fulfillment facility, destination zip code, selected shipping method, current carrier capacity constraints, and whether the destination falls within standard delivery zones. Standard shipping typically requires 5-7 business days while expedited options provide 2-3 business day delivery windows for eligible locations.`,
    responseB: `For most US addresses: standard shipping is 5-7 business days, expedited is 2-3 days. International orders typically take 10-15 days. If you need it by a specific date, tell me and I'll let you know which option gets it there in time, or flag anything specific about your location.`,
  },
  {
    text: "How do I speak to a human customer service agent?",
    responseA: `Live agent support connectivity options include telephonic communication through our customer service hotline during designated operational hours, real-time chat interface with queued agent assignment, and scheduled callback request functionality available through the support portal for customers preferring asynchronous communication initiation.`,
    responseB: `You're already talking to one! But if you'd prefer to call, our number is on the Contact page — available Monday-Friday 9am-6pm EST. For the fastest help, I can usually solve most issues right here. What do you need? I'll do my best to get it handled for you now.`,
  },
];

// ── Education Pairs ────────────────────────────────────────────
export const EDUCATION_PROMPTS: Prompt[] = [
  {
    text: "Can you explain this concept in simpler terms I can actually understand?",
    responseA: `The conceptual framework under consideration encompasses multiple theoretical dimensions that require systematic decomposition to facilitate comprehensive comprehension. The fundamental principles underlying this subject matter can be elucidated through examination of its constituent components, their interrelationships, and the broader theoretical context within which they operate as a unified system.`,
    responseB: `Of course — let me break it down simply. Think of it like this: the concept is basically just [simple analogy]. The key thing to remember is one core idea. Once you have that, everything else builds on it. What specifically is confusing you? Sometimes the textbook language makes things harder than they need to be.`,
  },
  {
    text: "What are some practice problems to help me master this topic?",
    responseA: `Proficiency development through deliberate practice requires engagement with problems of graduated difficulty that systematically address foundational competencies and advanced applications. Practice problems should span multiple cognitive levels according to Bloom's taxonomy, from recall and comprehension through analysis, synthesis, and evaluative application across varied problem contexts.`,
    responseB: `Here are 3 practice problems at different difficulty levels: Start easy to build confidence, try a medium one to apply the concept, then challenge yourself with a harder one. Work through them and share your answers — I'll tell you where you went right and where to adjust. Which topic are we practicing?`,
  },
  {
    text: "How do I solve this type of problem step by step?",
    responseA: `Systematic problem-solving methodology requires identification of the problem type and applicable solution framework, extraction of relevant given information, selection of appropriate formulae or procedures, sequential execution of solution steps with verification at each stage, and validation of the final answer against reasonableness criteria and original problem parameters.`,
    responseB: `Let's walk through it together. Step 1: identify what the problem is asking. Step 2: find what information you've been given. Step 3: pick the right method. Step 4: work through it carefully. Step 5: check if your answer makes sense. Share the specific problem and I'll show you exactly how I'd approach it.`,
  },
  {
    text: "What should I focus on studying for the upcoming exam?",
    responseA: `Examination preparation strategy should prioritize high-yield content areas based on assessment of topic weighting in course materials, historical examination patterns, instructor emphasis during lectures, and identification of personal knowledge gaps through practice assessment. Spaced repetition methodology demonstrates superior retention outcomes compared to passive review strategies.`,
    responseB: `Focus on what your teacher emphasized most in class — those topics almost always show up on the exam. Review your notes for anything repeated multiple times or marked important. Then do practice problems on anything you got wrong on homework or quizzes. Don't try to re-read everything — prioritize weak spots. What subject and topics were covered?`,
  },
  {
    text: "I'm stuck on this homework problem. Can you walk me through it?",
    responseA: `Homework problem resolution requires systematic application of course-specific methodologies appropriate to the problem type. Initial steps should involve careful problem statement analysis, identification of relevant concepts covered in recent instructional content, and selection of applicable solution procedures before proceeding to execution phases of the solution process.`,
    responseB: `Share the problem and I'll help you work through it. I won't just give you the answer — I'll show you how to think through it so you can do similar ones on your own. Tell me: what class is this for, and what have you already tried? That helps me understand where you got stuck.`,
  },
  {
    text: "What is the difference between these two similar concepts?",
    responseA: `Differentiation between related conceptual constructs requires examination of their definitional boundaries, identifying both shared characteristics and distinguishing attributes. A comparative analysis should consider the contexts in which each concept applies, the theoretical frameworks that inform each, and practical applications that exemplify each concept distinctly to avoid conflation of related ideas.`,
    responseB: `Great question — these two trip a lot of people up. Here's the key difference: one concept is about one core idea while the other is about a different core idea. The easiest way to remember: if you see X in the problem, think A. If you see Y, think B. Which two concepts are you comparing? I'll give you a clear side-by-side breakdown.`,
  },
  {
    text: "How does this topic connect to what we learned before?",
    responseA: `Curricular coherence in academic disciplines involves the progressive scaffolding of conceptual frameworks, where foundational knowledge structures established in prior instructional units provide the cognitive architecture necessary for comprehension of more complex subsequent material. Identifying these connections supports schema development and facilitates integration of new information into existing knowledge networks.`,
    responseB: `Everything in this course builds on itself — the previous topic taught you the foundational idea, and now this new topic extends it because of how they connect. Think of the earlier topic as the foundation and this one as the next floor of the building. What topic are you trying to connect? Tell me both and I'll draw the line between them.`,
  },
  {
    text: "Can you give me a real-world example of how this is used?",
    responseA: `Real-world applications of theoretical concepts facilitate contextual understanding and demonstrate practical relevance of academic subject matter. Applied examples illustrating the translation of abstract principles to concrete scenarios enhance conceptual comprehension and support motivation through demonstration of the practical utility of theoretical knowledge.`,
    responseB: `Here's a real example you can relate to: this concept shows up in everyday situations you encounter without realizing it. Once you see it in the real world, it's much easier to understand the theory. What concept are you trying to visualize? I'll find the most relatable example I can think of.`,
  },
  {
    text: "I keep making the same mistake. How do I stop doing this?",
    responseA: `Persistent error patterns in academic performance typically reflect systematic gaps in conceptual understanding, procedural knowledge, or application of learned material rather than random mistakes. Remediation requires identification of the root cause through error analysis, targeted review of the underlying concept or procedure, and structured practice with immediate corrective feedback. `,
    responseB: `That's actually a useful observation — repeated mistakes usually mean there's one specific thing not clicking yet. Show me an example of the mistake you keep making. Nine times out of ten there's one specific step where the error happens. Once we find that step and fix your understanding there, the mistake stops.`,
  },
  {
    text: "What are the most important things to remember from this chapter?",
    responseA: `Chapter synthesis requires identification of primary learning objectives as specified in course documentation, key conceptual frameworks and their defining characteristics, significant methodologies or procedures introduced, critical vocabulary and terminology, and landmark examples or case studies that exemplify core principles constituting the essential knowledge base for subsequent assessment.`,
    responseB: `Here are the most important takeaways from any chapter: the core concept everything else builds on, the most commonly tested application, and the thing most students get confused about. If you can explain each in your own words, you understand the chapter. Which chapter are you summarizing? I'll tell you exactly what to prioritize.`,
  },
];

// ── Developer Pairs ────────────────────────────────────────────
export const DEVELOPER_PROMPTS: Prompt[] = [
  {
    text: "How do I integrate the RewardForge API into my existing ML pipeline?",
    responseA: `RewardForge API integration requires authentication via Bearer token utilizing your API key obtainable from the Settings panel. The RESTful API endpoints follow standard HTTP conventions with JSON request and response payloads. Integration architecture should consider asynchronous job submission patterns for training operations, webhook configuration for completion notifications, and rate limiting considerations for high-volume annotation submission workflows.`,
    responseB: `Here's the quick integration path: 1) Get your API key from Settings. 2) POST comparisons to /v1/comparisons as you collect them. 3) When you have 50+, POST to /v1/training/start and get a job_id back. 4) Poll /v1/training/{job_id}/status or set up a webhook. 5) When complete, pull your model from /v1/models. What does your current pipeline look like?`,
  },
  {
    text: "What is the recommended dataset size for training a good reward model?",
    responseA: `Optimal dataset size for reward model training is contingent upon multiple factors including the complexity of the preference signal being modeled, the dimensionality of the response space, annotation consistency across annotators, and the base model architecture. Empirical research suggests diminishing marginal returns beyond certain dataset sizes, with annotation quality demonstrating greater impact than quantity alone.`,
    responseB: `For a solid reward model: 200-500 high-quality comparisons is a good starting point. With 50-100 you can start seeing signal, but it'll be noisy. Beyond 1,000, improvements get marginal for most use cases. More important than quantity: consistency. 200 comparisons with clear preferences beats 500 random ones every time. What's your use case?`,
  },
  {
    text: "When should I use DPO versus PPO for my specific use case?",
    responseA: `Algorithm selection between Direct Preference Optimization and Proximal Policy Optimization requires consideration of dataset size thresholds, computational resource constraints, task complexity characteristics, and the importance of online versus offline training dynamics. DPO operates directly on preference data without requiring an explicit reward model in the training loop, offering computational efficiency advantages.`,
    responseB: `Simple rule: start with DPO. It's faster, cheaper, and works great for style and behavior alignment. Use PPO when: you have a complex task requiring reasoning (math, code), you have 500+ examples, and you want the model to generalize to new prompts it hasn't seen. DPO is great for 'make it sound like X' — PPO is better for 'make it better at task Y'. What are you aligning?`,
  },
  {
    text: "How do I prevent reward hacking during RL fine-tuning?",
    responseA: `Reward hacking mitigation strategies include implementation of KL divergence penalty terms in the PPO objective function to constrain policy drift, ensemble reward model approaches to reduce individual model bias exploitation, periodic reward model updates using newly collected preference data, output length normalization to prevent verbosity exploitation, and diverse prompt sampling during training.`,
    responseB: `The main protection is the KL penalty β — keep it around 0.1 as a starting point. Watch for signs of hacking: responses getting unusually long, becoming overly sycophantic, or very repetitive. If reward climbs fast but real quality isn't improving, your model is gaming the signal. Practical fix: add length normalization and check your reward model accuracy — below 80% means retrain with more data.`,
  },
  {
    text: "What does a healthy KL divergence value look like during training?",
    responseA: `KL divergence monitoring during RLHF training serves as a critical safety mechanism quantifying distributional shift between the current policy and reference policy. Acceptable KL divergence ranges are empirically determined based on the specific β penalty coefficient employed, with typical values in the range of 0.02-0.10 for standard configurations. Values exceeding 0.15-0.20 may indicate excessive policy optimization. `,
    responseB: `Healthy KL range: 0.02 to 0.10 for most setups. Below 0.02 means your model isn't learning much — try lowering β. Above 0.15 is a warning sign — the model is drifting too far. Above 0.3 is usually reward hacking territory — stop training and investigate. With β=0.1 (our default), you typically see KL around 0.04-0.08 when things are working well.`,
  },
  {
    text: "How do I export my trained model and deploy it to production?",
    responseA: `Model export and production deployment procedures involve downloading model weights in the appropriate serialization format from the model registry, validating checkpoint integrity, configuring the inference serving infrastructure with appropriate hardware specifications, implementing monitoring and observability tooling, and establishing rollback procedures for production incidents.`,
    responseB: `Three paths to deploy: 1) Push directly to HuggingFace Hub from the Evaluate page — click Push to HF Hub, enter your token and repo name, done. 2) Download the .safetensors file and host it yourself. 3) Use our API to pull it programmatically. For production, we recommend HuggingFace + an inference endpoint like vLLM or TGI. What's your serving infrastructure?`,
  },
  {
    text: "What base model should I choose for my reward model training?",
    responseA: `Base model selection for reward model training involves consideration of parameter count relative to available computational resources, pre-training data characteristics and alignment with target domain, architectural properties affecting fine-tuning stability, and licensing constraints for production deployment. Reward model performance generally scales with parameter count, though efficient fine-tuning techniques can partially compensate for smaller model capacity. `,
    responseB: `Quick guide: GPT-2 (117M) for fast iteration and prototyping — trains in minutes, good for testing. LLaMA 3 8B for production — best quality/speed tradeoff. Mistral 7B is close to LLaMA and sometimes better for specific domains. Use the smallest model that meets your quality bar — bigger isn't always better for reward models. How many comparisons do you have?`,
  },
  {
    text: "How many training epochs should I run without overfitting?",
    responseA: `Epoch selection for reward model fine-tuning requires consideration of dataset size, learning rate schedule, batch size, and regularization mechanisms in place. Empirical evidence suggests that smaller datasets with fewer unique prompt-response pairs are more susceptible to overfitting with extended training. Early stopping based on validation set performance metrics provides an adaptive alternative to fixed epoch specifications.`,
    responseB: `For most reward model training: 3 epochs is a safe default. With under 100 examples, even 2 epochs might be enough. Signs you're overfitting: training loss drops but validation loss rises, or your model gives extreme scores on everything. Practical approach: train for 3 epochs, evaluate, and if validation accuracy is plateauing or dropping, stop early. Batch size 8 and learning rate 2e-5 work well as defaults.`,
  },
  {
    text: "How do I interpret the loss curves during reward model training?",
    responseA: `Loss curve interpretation during reward model training requires analysis of both training and validation loss trajectories across training steps. Monotonically decreasing training loss concurrent with stable or improving validation loss indicates appropriate learning dynamics. Divergence between training and validation curves suggests overfitting, while absence of loss reduction may indicate suboptimal learning rate selection or data quality issues.`,
    responseB: `Here's what to look for: Training loss should steadily decrease — if it's flat, your learning rate might be too low or data has issues. Validation loss should follow training loss — if it starts going up while training loss drops, you're overfitting, stop training. Aim for final training loss under 0.4. Accuracy should reach 75-90%+ depending on task complexity. What are your curves showing?`,
  },
  {
    text: "What is inter-annotator agreement and how do I improve it?",
    responseA: `Inter-annotator agreement quantifies the consistency of judgments across multiple independent annotators evaluating identical stimuli, serving as a proxy measure for annotation quality and preference signal clarity. Common metrics include Cohen's Kappa for pairwise agreement and Fleiss' Kappa for multi-annotator scenarios. Low agreement values indicate annotation task ambiguity, guideline inadequacy, or annotator qualification misalignment.`,
    responseB: `Inter-annotator agreement measures how often different people pick the same response as better. You want above 70% agreement — below that means your task is ambiguous or annotators have different standards. To improve it: 1) Write clearer guidelines with examples. 2) Do a calibration session where everyone annotates the same 10 prompts together. 3) Remove consistently inconsistent annotators. 4) Make prompts have a clearer right answer.`,
  },
];

// ── Master lookup by use case ──────────────────────────────────
export const PAIRS_BY_USE_CASE: Record<string, Prompt[]> = {
  legal: PROMPTS,
  medical: MEDICAL_PROMPTS,
  financial: FINANCIAL_PROMPTS,
  customer_service: CS_PROMPTS,
  education: EDUCATION_PROMPTS,
  developer: DEVELOPER_PROMPTS,
};
