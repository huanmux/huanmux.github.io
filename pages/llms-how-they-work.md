---
title: "How Large Language Models (LLMs) Work: From Transformers and Pre-training to Next-Token Prediction"
description: "Explore the inner mechanics of Large Language Models. Learn about tokenization, self-attention, the Transformer architecture, pre-training, fine-tuning (SFT & RLHF), and temperature sampling."
keywords: "Large Language Models, LLMs, Transformer architecture, self-attention, tokenization, next-token prediction, pre-training, RLHF, temperature sampling, AI architecture, generative AI"
author: "Mux Staff"
authorImage: "https://dewanmukto.github.io/asset/images/MuxGames-icon.webp"
date: "September 25, 2026"
category: "Artificial Intelligence & Machine Learning"
readTime: "15 min read"
canonical: "/llms-how-they-work"
image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80"
---

# How Large Language Models (LLMs) Work: Under the Hood

<div class="not-prose my-6 p-5 rounded-2xl bg-white/5 border border-inherit/15 backdrop-blur-md">
  <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold mb-2">
    <span>⚡ Quick Answer (AEO Summary)</span>
  </div>
  <p class="text-sm sm:text-base leading-relaxed opacity-90 m-0">
    A <strong>Large Language Model (LLM)</strong> is an artificial neural network built upon the <strong>Transformer architecture</strong> that is trained to compute probability distributions over sequences of tokens. Under the hood, LLMs do not "think" in human concepts; instead, they operate as <strong>autoregressive next-token predictors</strong>. By processing input text through billions or trillions of numerical weights adjusted during massive self-supervised pre-training, LLMs calculate which token is statistically most likely to follow a given prompt.
  </p>
</div>

From ChatGPT and Gemini to Claude and open-source models like Llama, modern AI systems share a common computational lineage. Let's peel back the layers and examine the mathematics and engineering that make them function.

---

## 1. The 3-Stage Lifecycle of an LLM

Creating a production-grade model requires an intensive, three-phase machine learning pipeline:

```
+-------------------------------------------------------------------------+
|  Stage 1: Self-Supervised Pre-Training (Cost: Millions of $ in Compute) |
|  - Trillions of tokens from the web, books, code, scientific papers      |
|  - Objective: Predict token (t+1) given tokens (1...t)                  |
|  - Outcome: "Base Model" with vast world knowledge but raw behavior     |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|  Stage 2: Supervised Fine-Tuning (SFT / Instruction Tuning)             |
|  - Hundreds of thousands of high-quality (Prompt -> Response) pairs     |
|  - Teaches the model to format answers, follow rules, write code, etc.  |
|  - Outcome: "Instruct Model" capable of structured conversation         |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|  Stage 3: Alignment (RLHF / DPO - Human Preference Optimization)        |
|  - Reinforcement Learning from Human Feedback or Direct Preference Opt. |
|  - Steers outputs toward helpfulness, honesty, and safety bounds        |
|  - Outcome: Production Assistant (e.g. Claude, GPT-4, Gemini)           |
+-------------------------------------------------------------------------+
```

---

## 2. The Mechanics of Inference: Step-by-Step

When you submit a prompt to an LLM, the model executes a deterministic sequence of matrix operations:

### 1. Tokenization (Byte-Pair Encoding)
Computers cannot directly process raw English characters or Unicode glyphs. First, text is split into sub-word chunks called **tokens** using algorithms like Byte-Pair Encoding (BPE).
- In general, 1 token ≈ 4 characters or 0.75 words.
- The word `"unbelievable"` is tokenized into `["un", "believ", "able"]`.
- Each token is assigned a unique integer ID from a fixed vocabulary (typically 32,000 to 256,000 entries).

### 2. High-Dimensional Vector Embeddings
Each token ID is mapped to a continuous vector of numbers (e.g., 4,096 floating-point values). Words with similar semantic meanings cluster near each other in this multidimensional latent space. Additionally, **Rotary Positional Encodings (RoPE)** are added so the network recognizes word order and sentence structure.

### 3. The Self-Attention Mechanism (Query, Key, Value)
The breakthrough in Vaswani et al.'s 2017 paper *"Attention Is All You Need"* was **Self-Attention**. For every token in the sequence, the model computes three vectors:
- **Query ($Q$)**: What is this token looking for?
- **Key ($K$)**: What information does this token contain?
- **Value ($V$)**: If this token is relevant, what information does it contribute?

The mathematical equation that powers modern AI is:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

This allows every token in a 100,000-word context window to dynamically attend to every other token, resolving pronoun antecedents, syntactic dependencies, and complex logical constraints simultaneously.

---

## 3. Interactive Tokenizer & Temperature Explorer

Experiment with how LLMs tokenize input text and how the **Temperature** parameter reshapes probability distributions across candidate next tokens:

<div class="not-prose my-8 p-5 sm:p-7 rounded-2xl bg-black/40 border border-inherit/20 backdrop-blur-xl shadow-2xl">
  <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
    <div>
      <h3 class="text-base font-bold text-white m-0">Live Tokenizer & Next-Token Probability Engine</h3>
      <p class="text-xs text-white/60 m-0 mt-0.5">Type text to inspect real-time token segmentation and softmax probabilities</p>
    </div>
    <div class="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
      Autoregressive Transformer
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1">Input Prompt</label>
    <input id="llm-input" type="text" value="The future of artificial intelligence is" class="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400" />
  </div>

  <!-- Token Display Area -->
  <div class="mb-5">
    <div class="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
      <span>Tokenized Sub-words</span>
      <span id="llm-token-count">6 Tokens</span>
    </div>
    <div id="llm-tokens-container" class="flex flex-wrap gap-1.5 p-3 rounded-xl bg-black/50 border border-white/10 min-h-[46px]">
      <!-- Token badges injected here -->
    </div>
  </div>

  <!-- Temperature Control -->
  <div class="p-4 rounded-xl bg-white/5 border border-white/10 mb-5">
    <div class="flex items-center justify-between text-xs font-mono mb-2">
      <span class="text-white/70">Sampling Temperature:</span>
      <span id="llm-temp-display" class="font-bold text-amber-400">0.70 (Balanced)</span>
    </div>
    <input id="llm-temp-slider" type="range" min="0" max="1.5" step="0.05" value="0.70" class="w-full accent-amber-400 cursor-pointer" />
    <div class="flex justify-between text-[10px] font-mono text-white/40 mt-1">
      <span>0.0 (Deterministic / Greedy)</span>
      <span>0.7 (Standard)</span>
      <span>1.5 (High Entropy / Creative)</span>
    </div>
  </div>

  <!-- Next-Token Probabilities -->
  <div class="bg-black/60 rounded-xl p-4 border border-white/10">
    <div class="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-3">
      Candidate Next Tokens (Softmax Probabilities)
    </div>
    <div id="llm-prob-bars" class="space-y-2 font-mono text-xs">
      <!-- Injected bars -->
    </div>
  </div>
</div>

<script>
(function() {
  const input = document.getElementById('llm-input');
  const tokensContainer = document.getElementById('llm-tokens-container');
  const tokenCountSpan = document.getElementById('llm-token-count');
  const tempSlider = document.getElementById('llm-temp-slider');
  const tempDisplay = document.getElementById('llm-temp-display');
  const probBarsContainer = document.getElementById('llm-prob-bars');

  if (!input || !tokensContainer || !tempSlider) return;

  const colorPalette = [
    'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'bg-blue-500/20 text-blue-300 border-blue-500/40',
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'bg-rose-500/20 text-rose-300 border-rose-500/40',
    'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  ];

  // Base raw logits for candidate completions
  const candidateLogits = [
    { token: ' transformative', logit: 6.8 },
    { token: ' boundless', logit: 5.5 },
    { token: ' uncertain', logit: 4.9 },
    { token: ' promising', logit: 4.2 },
    { token: ' dangerous', logit: 3.4 }
  ];

  function update() {
    const text = input.value.trim();
    const words = text ? text.split(/\s+/) : ['[empty]'];
    tokensContainer.innerHTML = '';

    words.forEach(function(word, idx) {
      const badge = document.createElement('span');
      const color = colorPalette[idx % colorPalette.length];
      badge.className = 'px-2 py-1 rounded-lg border text-xs font-mono font-semibold tracking-wide ' + color;
      badge.textContent = word;
      badge.title = 'Token ID: ' + (1420 + idx * 83);
      tokensContainer.appendChild(badge);
    });

    tokenCountSpan.textContent = words.length + ' Token' + (words.length === 1 ? '' : 's');

    // Recalculate probabilities using temperature
    const T = Math.max(0.01, parseFloat(tempSlider.value));
    tempDisplay.textContent = T.toFixed(2) + (T < 0.2 ? ' (Greedy)' : T > 1.0 ? ' (Creative / Wild)' : ' (Balanced)');

    // Scaled logits: z_i / T
    const expValues = candidateLogits.map(function(item) {
      return Math.exp(item.logit / T);
    });
    const sumExp = expValues.reduce(function(a, b) { return a + b; }, 0);
    const probs = expValues.map(function(v) { return v / sumExp; });

    probBarsContainer.innerHTML = '';
    candidateLogits.forEach(function(item, idx) {
      const percentage = (probs[idx] * 100).toFixed(1);
      const row = document.createElement('div');
      row.className = 'flex items-center gap-3';
      row.innerHTML = `
        <span class="w-32 truncate text-white/90 font-semibold">"${item.token}"</span>
        <div class="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
          <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-200" style="width: ${percentage}%"></div>
        </div>
        <span class="w-14 text-right text-purple-300 font-bold">${percentage}%</span>
      `;
      probBarsContainer.appendChild(row);
    });
  }

  input.addEventListener('input', update);
  tempSlider.addEventListener('input', update);
  update();
})();
</script>

---

## 4. Temperature, Top-K & Top-P Explained

When the neural network outputs probability scores for every word in its dictionary, a **decoding algorithm** decides which token actually gets emitted:

1. **Greedy Search ($T = 0$)**: The model always picks the single token with the highest probability. This makes outputs repetitive, brittle, and robotic.
2. **Temperature ($T$)**: Dividing the unnormalized logit scores by temperature scales entropy:
   - Lower $T$ ($< 0.5$): Sharpens probability peaks, favoring factual, deterministic code and math answers.
   - Higher $T$ ($> 0.8$): Flattens the distribution curve, granting low-probability tokens an opportunity to be selected for creative writing and brainstorming.
3. **Top-P (Nucleus Sampling)**: Dynamically truncates the candidate list to the smallest set of tokens whose cumulative probability reaches $P$ (e.g., $P = 0.90$). This filters out nonsensical long-tail words without cutting off rich synonyms.

---

## 5. Implementation: Sampling from Model Logits in TypeScript

```typescript
// Softmax with temperature scaling
export function sampleNextToken(
  logits: Map<string, number>,
  temperature: number = 0.7,
  topP: number = 0.9
): string {
  const temp = Math.max(0.01, temperature);

  // 1. Scale logits by Temperature
  const scaledEntries: Array<[string, number]> = [];
  for (const [token, logit] of logits.entries()) {
    scaledEntries.push([token, logit / temp]);
  }

  // Numerical stability trick: subtract max logit
  const maxLogit = Math.max(...scaledEntries.map(([, l]) => l));
  const exps = scaledEntries.map(([t, l]) => [t, Math.exp(l - maxLogit)] as [string, number]);
  const sumExp = exps.reduce((acc, [, val]) => acc + val, 0);

  // 2. Compute probabilities and sort descending
  const probabilities = exps
    .map(([t, val]) => ({ token: t, prob: val / sumExp }))
    .sort((a, b) => b.prob - a.prob);

  // 3. Top-P (Nucleus) filter
  let cumulative = 0;
  const nucleus: typeof probabilities = [];
  for (const item of probabilities) {
    nucleus.push(item);
    cumulative += item.prob;
    if (cumulative >= topP) break;
  }

  // 4. Sample randomly according to nucleus distribution
  const rand = Math.random() * cumulative;
  let running = 0;
  for (const item of nucleus) {
    running += item.prob;
    if (rand <= running) {
      return item.token;
    }
  }

  return nucleus[0].token;
}
```

---

## 6. Frequently Asked Questions (FAQ)

### Do LLMs actually understand what they are saying?
LLMs possess deep mathematical representations of syntactical and conceptual relationships derived from massive text datasets. However, they lack subjective consciousness, personal intent, and sensorimotor grounding in the physical world. They are best understood as world-class probabilistic reasoning engines rather than human minds.

### Why do LLMs hallucinate?
Hallucinations occur because the objective function of an LLM is to produce fluent, plausible-sounding token sequences that mirror training patterns, not to verify physical truth against a formal ontology. When training data contains contradictions or when an uncommon query triggers high uncertainty, the model synthesizes plausible fiction unless grounded with tools like RAG (Retrieval-Augmented Generation).

### What is the difference between model parameters and context window?
- **Parameters (e.g. 70 Billion weights)**: The long-term memories encoded into the neural network during training. Changing parameters requires gradient descent and compute clusters.
- **Context Window (e.g. 128,000 tokens)**: The short-term working memory of the model during a single conversational session. Information inside the context window is attended to dynamically but does not permanently modify the model's underlying weights.
