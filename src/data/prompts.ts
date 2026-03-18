export interface Prompt {
  text: string;
  responseA: string;
  responseB: string;
}

export const PROMPTS: Prompt[] = [
  {
    text: "Explain quantum entanglement to a 10-year-old",
    responseA: `Quantum entanglement is when two particles become connected in a special way — like magic coins. When you flip one and it lands heads, the other instantly lands tails, no matter how far apart they are. Even if one coin is on Earth and the other is on the Moon! Scientists call this "spooky action at a distance." Neither coin decides what it will be until you look at it. Once you look at one, both instantly know what to be. Einstein thought this was the strangest thing in physics — and he was right.`,
    responseB: `Think of best friend bracelets with a superpower. When two particles get entangled, they become partners forever — check one and you instantly know something about the other, even across the universe. The particles don't send messages. They don't travel. They just... know. Scientists use this today to build ultra-secure communication systems. One day it'll power quantum computers that can solve problems today's computers never could.`,
  },
  {
    text: "Write a Python function to reverse a linked list",
    responseA: `def reverse_linked_list(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev

Iterative approach using three pointers. Time: O(n), Space: O(1). The key: save next_node before overwriting current.next, then advance all three pointers forward.`,
    responseB: `def reverse_linked_list(head):
    if not head or not head.next:
        return head
    new_head = reverse_linked_list(head.next)
    head.next.next = head
    head.next = None
    return new_head

Recursive — elegant but uses O(n) stack space. Recurses to the end, then on the way back sets each node's next pointer to point backward. More readable, less production-safe.`,
  },
  {
    text: "What are the pros and cons of remote work?",
    responseA: `Pros: Eliminates commuting (1–2hrs/day reclaimed), global talent access, reduced real-estate overhead, productivity gains for deep work. Cons: Async adds latency to decisions, onboarding suffers without in-person mentorship, team cohesion erodes over time, home distractions, career visibility reduced for some roles. The research is mixed — it depends heavily on role type, personality, and company culture.`,
    responseB: `Remote work is a trade-off that cuts both ways. The biggest win is autonomy — you design your own day. The biggest loss is spontaneous collaboration — the hallway conversation that solves a problem in 30 seconds now needs a Slack thread and a calendar invite. Companies save on office space; employees save on commutes. But junior employees develop slower without osmotic learning, and some people genuinely work better with structure.`,
  },
  {
    text: "How do I negotiate a higher salary?",
    responseA: `1. Research: Glassdoor, Levels.fyi, LinkedIn Salary. Know your number before any conversation. 2. Timing: after a win, during review, or when you have a competing offer. 3. Lead with value: "Based on X contribution and market data, I'm targeting $Y." 4. Give a specific number, not a range. 5. Stay silent after making your ask. 6. If no, ask what it would take to get there and get it in writing.`,
    responseB: `The single most important thing: have a competing offer or be willing to walk away. Everything else is tactics. With real leverage, the conversation is straightforward. Without it, you're asking for a favor. Research your number, ask for 15–20% above your floor, say it confidently, and don't apologize for negotiating. Companies expect it. The biggest mistake is vagueness — be specific or lose.`,
  },
  {
    text: "Explain the difference between TCP and UDP",
    responseA: `TCP (Transmission Control Protocol) is reliable and ordered — every packet arrives, in sequence, confirmed by a three-way handshake. Great for web, email, file transfers. UDP is fire-and-forget — sends packets without confirming receipt. Much faster, but packets can drop. Ideal for live video, gaming, VoIP. Think of TCP as certified mail and UDP as dropping flyers from a plane.`,
    responseB: `TCP = phone call. You establish a connection, both sides confirm they're listening, every word gets through, and if something drops it gets resent. UDP = shouting across a crowded room. Fast, simple, no guarantee. Use TCP when data integrity matters (banking, files). Use UDP when speed beats perfection (live games, streaming). QUIC — used by YouTube — combines both ideas.`,
  },
  {
    text: "Write a haiku about machine learning",
    responseA: `Data flows like rain
Weights adjust through endless nights
Patterns slowly wake`,
    responseB: `Gradient descends
Loss shrinks with each epoch passed
Model learns to see`,
  },
  {
    text: "What causes inflation and how can it be controlled?",
    responseA: `Inflation has three root causes: demand-pull (too much money chasing too few goods), cost-push (input costs rising), and built-in (wage-price spiral). Central banks fight it with interest rates — raising rates makes borrowing expensive, reduces spending, cools demand. Works with a 12–18 month lag. The 2022 surge was pandemic supply shocks plus unprecedented fiscal stimulus colliding.`,
    responseB: `Inflation means your money buys less. The main causes: too much money printed, supply chains breaking, or companies raising prices because they can. The Fed fights it by raising rates — making loans more expensive slows borrowing and spending. The risk: too fast causes recession, too slow embeds inflation in expectations. It's a balancing act with delayed feedback — which is why central banks often get it wrong.`,
  },
  {
    text: "How does the immune system fight viruses?",
    responseA: `Two-layer defense. Innate immune system responds first (hours): natural killer cells and macrophages attack anything foreign. Then adaptive kicks in (days): B cells produce antibodies specific to the virus's antigens, T cells kill infected cells directly, memory cells form for future encounters. This is why symptoms peak at day 2–3 (immune response ramping) and improve by day 7 (adaptive winning).`,
    responseB: `Your body has a two-stage defense. Stage 1: general alarm — fever, inflammation, fatigue. Your body heats up to make it hostile for the virus. Stage 2: precision strike — your immune system identifies the specific virus, builds custom antibodies, destroys infected cells. After recovery it keeps memory. Next exposure, the response is 10× faster. That's also how vaccines work — training Stage 2 safely.`,
  },
  {
    text: "Explain recursion with a simple example",
    responseA: `Recursion is a function calling itself on a smaller version of the same problem. Example — factorial:
def factorial(n):
    if n <= 1: return 1
    return n * factorial(n - 1)
factorial(5) = 5 × 4 × 3 × 2 × 1 = 120.
Two requirements: base case (n<=1) to stop, recursive case that moves toward it. Without a base case: infinite recursion, stack overflow.`,
    responseB: `Imagine a line of people. You want to know your position. You ask the person in front. They ask the person in front. This continues until the first person says "I'm #1." Everyone adds 1 and passes the answer back. That's recursion. Each instance solves a tiny piece and relies on the next. In code, a function calls itself with simpler input until it hits a case it can answer directly.`,
  },
  {
    text: "What are the ethical implications of AI?",
    responseA: `Key concerns: (1) Bias amplification at scale. (2) Labor displacement of white-collar roles. (3) Mass surveillance becoming cheap. (4) Autonomous weapons with no accountability. (5) Power concentration in a handful of companies. (6) Alignment — ensuring advanced AI pursues human values remains unsolved with potentially existential stakes if we get it wrong.`,
    responseB: `AI ethics comes down to three questions: Who decides? Who benefits? Who's harmed? The people building the most powerful AI are a small, homogeneous group. Benefits flow disproportionately to capital. Harms — job loss, surveillance, bias — fall on those with less power. The hard questions aren't technical. They're about governance and whether we want a world optimized for engagement and profit.`,
  },
];
