// ─── Config ───────────────────────────────────────────────────────────────────

const GEMINI_API_URL = import.meta.env.DEV
  ? "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"
  : "/api/gemini";

const QUESTIONS_PER_QUIZ = 10;

// ─── Cache + inflight deduplication ──────────────────────────────────────────

const cache = new Map();
let inflightRequest = null;

// ─── Difficulty spec ──────────────────────────────────────────────────────────

const SENIOR_ANALYST_SPEC = `
- LEAD, LAG, NTILE, PERCENT_RANK, FIRST_VALUE/LAST_VALUE with frame specs
- Nested CTEs, correlated subqueries
- Statistics: z-scores, confidence intervals, p-value interpretation
- DAX time intelligence: SAMEPERIODLASTYEAR, DATEADD, TOTALYTD
- Query optimisation: index strategy, partition pruning, join order
- Outlier detection: IQR, z-score thresholding
- Multi-metric trade-offs: precision/recall, cost vs freshness
- Tools: SQL, pandas, DAX, Excel — mixed proportionally, never crossed within a question
`.trim();

// ─── Industries ───────────────────────────────────────────────────────────────

const INDUSTRIES = [
  "E-commerce",
  "Banking",
  "Healthcare",
  "Logistics",
  "SaaS",
  "Retail",
  "FinTech",
];

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt({ previousQuestions = [] } = {}) {
  const prevQList =
    previousQuestions?.length > 0
      ? previousQuestions.slice(-5).join("; ")
      : "none";

  const counts = {
    computation: Math.round(QUESTIONS_PER_QUIZ * 0.35), // 4
    scenario:    Math.round(QUESTIONS_PER_QUIZ * 0.30), // 3
    practical:   Math.round(QUESTIONS_PER_QUIZ * 0.20), // 2
    conceptual:  Math.round(QUESTIONS_PER_QUIZ * 0.15), // 1
  };

  const multiStepMin = Math.ceil(QUESTIONS_PER_QUIZ * 0.3); // 3

  return `
Act as a Senior Data Analyst and Data Analytics Instructor for DataEre.

Generate a REAL-WORLD DATA ANALYTICS DAILY CHALLENGE mixing scenarios across:
${INDUSTRIES.map((i) => `- ${i}`).join("\n")}

DIFFICULTY RULES — Senior Analyst level:
${SENIOR_ANALYST_SPEC}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORE RULE: Every question must require active computation, query tracing, or
formula application. A participant who cannot do the math or run the logic
CANNOT guess correctly. At least 7 of ${QUESTIONS_PER_QUIZ} stems must embed a
formula, SQL block, or inline dataset directly.

DATASET RULE:
Every question must contain a mini dataset table of 5–8 rows embedded in the stem.
Format it as plain text, like:

  Customer_ID | Region  | Revenue | Orders
  C001        | West    | 5 000   | 5
  C002        | East    | 2 000   | 2
  C003        | North   | 8 500   | 9
  ...

Then ask a computation or tracing question based on it.

ANSWER INTEGRITY:
- The stem must NEVER contain or hint at the correct answer
- Do NOT write the correct formula in the stem — ask the participant to derive it
- Do NOT write "use =FORMULA()" or "apply =FORMULA()" — show the business problem only
- The stem describes the PROBLEM. The answers provide the FORMULAS to evaluate.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTION TYPES — generate exactly:

${counts.computation} × computation
  Embed full SQL/formula/code + mini dataset in stem.
  Ask for exact output, the bug, or the correct expression.
  Distractors = specific execution errors (wrong aggregation scope, missing DISTINCT,
  NULL mishandling, wrong window frame, date offset error).

${counts.scenario} × applied_scenario
  Stem must include: table name, column list with types, row count + date range,
  a concrete metric to derive, and ≥1 constraint (exclude refunds / active users
  only / last 90 days). Ask "which formula/query is correct?" — never "what would
  you do?". Distractors = wrong denominator scope, missing filter, wrong time window.

${counts.practical} × practical_tool
  Show real code with a deliberate bug or gap. Participant must trace execution.
  Distractors = code that looks correct but fails on edge input or NULL rows.

${counts.conceptual} × conceptual_tradeoff
  Test trade-offs with measurable consequences only. Never "what is X".
  Every option must describe a quantifiable outcome or failure mode.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISTRACTOR RULES — each wrong answer must be a named mistake from this list:
COUNT(*) vs COUNT(DISTINCT) | WHERE vs HAVING | wrong period anchor |
wrong denominator cohort | missing NULL exclusion | ROWS vs RANGE frame |
gross vs net metric | DATEADD off-by-one | wrong aggregation granularity

MULTI-STEP: At least ${multiStepMin} questions must require 2+ derivation steps
(compute A → use A to derive B).

ANSWER POSITIONS: Distribute correct answers evenly across options A/B/C/D.
Never repeat same position more than twice consecutively. Never cluster in A or B.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BANNED:
- "What is..." definitions
- Questions solvable without domain knowledge or computation
- Two questions on the same formula/concept
- Distractors that differ only in wording
- Factually wrong formulas or query outputs
- Question stems that reference a tool not tagged to that question
- Mixing tool vocabularies within a single question (SQL + Excel in same stem)
- Revealing or hinting at the correct answer in the stem or dataset_context
- Phrases like "the correct formula is...", "use the formula...", "apply =FORMULA()"
- Pure theory or definition questions

TOOL CONSTRAINT — tag each question with exactly one tool and use only its syntax:
  sql     → SQL syntax only (SELECT, CTEs, window functions)
  excel   → Excel formulas only (SUMIF, XLOOKUP, INDEX/MATCH, pivot logic)
  dax     → DAX measures + time intelligence only
  pandas  → Python/pandas syntax only

Distribute across: 4 × sql | 2 × excel | 2 × dax | 2 × pandas

AVOID REPEATING: ${prevQList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT: Return ONLY a valid JSON array of exactly ${QUESTIONS_PER_QUIZ} objects.
No markdown. No fences. No commentary outside the array.

Schema:
[
  {
    "id": 1,
    "question": "<full stem with embedded mini dataset table + formula/SQL/code>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "answer": "<exact text of correct option>",
    "question_type": "computation|applied_scenario|practical_tool|conceptual_tradeoff",
    "explanation": "<step-by-step worked solution — show each computation step, then why each distractor fails>",
    "dataset_context": "<what the dataset represents: industry, table name, date range, metric>",
    "tip": "<one-line formula rule or edge-case mnemonic>",
    "learning_objective": "<specific skill tested>",
    "tags": ["data_analytics", "<sql|excel|dax|pandas>"],
    "difficulty": "Advanced"
  }
]
`.trim();
}

// ─── Fetch (Gemini) ───────────────────────────────────────────────────────────

export async function fetchQuestionsFromGemini({
  previousQuestions = [],
} = {}) {
  const cacheKey = "DATAERE_DAILY_CHALLENGE";

  if (cache.has(cacheKey)) return cache.get(cacheKey);
  if (inflightRequest?.key === cacheKey) return inflightRequest.promise;

  const prompt = buildPrompt({ previousQuestions });
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const promise = (async () => {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,    // tighter than original 0.8 for computation accuracy
            maxOutputTokens: 4096,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API error ${response.status}: ${err?.error?.message ?? response.statusText}`
        );
      }

      const data = await response.json();
      let raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
      raw = raw.replace(/^```(?:json)?|```$/gm, "").trim();

      let questions;
      try {
        questions = JSON.parse(raw);
      } catch {
        // Recovery path 1: trim to last valid closing bracket
        const lastBracket = raw.lastIndexOf("]");
        if (lastBracket !== -1) {
          try {
            questions = JSON.parse(raw.slice(0, lastBracket + 1));
          } catch {
            // Recovery path 2: extract individual objects
            const matches = [...raw.matchAll(/\{(?:[^{}]|\{[^{}]*\})*\}/g)];
            if (matches.length > 0) {
              questions = JSON.parse("[" + matches.map((m) => m[0]).join(",") + "]");
            } else {
              throw new Error("Gemini response too truncated to recover.");
            }
          }
        } else {
          throw new Error("Invalid JSON from Gemini response.");
        }
      }

      if (!Array.isArray(questions)) {
        throw new Error("Gemini did not return a JSON array.");
      }

      cache.set(cacheKey, questions);
      return questions;
    } finally {
      inflightRequest = null;
    }
  })();

  inflightRequest = { key: cacheKey, promise };
  return promise;
}

// ─── Cache utils ──────────────────────────────────────────────────────────────

export function clearQuestionCache() {
  cache.clear();
}