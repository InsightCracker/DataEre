const GROQ_API_URL = import.meta.env.DEV
  ? "/groq/openai/v1/chat/completions"
  : "/api/groq";

const QUESTIONS_PER_QUIZ = 10;

const DIFFICULTY_LABELS = {
  Beginner:     "Beginner",
  Intermediate: "Intermediate",
  Advanced:     "Advanced",
};

const cache = new Map();
let inflightRequest = null;

// ── Difficulty specs (computational topics)
const DIFFICULTY_SPEC = {
  Beginner: `
- One-step calculations with a small inline dataset
- No nested formulas, no multi-table joins`,
// - Single-table formulas: SUM, COUNT, AVERAGE, MIN, MAX, IF

  Intermediate: `
- Two-step metric derivations using an inline dataset
- Edge cases: blanks, duplicates, text vs number mismatch`,

// - Multi-step formulas: SUMIF, COUNTIF, VLOOKUP, INDEX/MATCH, pivot logic

  Advanced: `
- Nested formulas, array functions, window-style calculations
- Multi-step derivations: running totals, rank, YoY growth
- Outlier detection, error handling (IFERROR, IFNA), performance trade-offs`,
};

// ── Tool constraint (one-liner per topic) 
function toolConstraint(topicLower) {
  if (topicLower.includes("excel"))
    return `Use ONLY these real Excel functions: SUM, SUMIF, SUMIFS, COUNT, COUNTIF, COUNTIFS, AVERAGE, AVERAGEIF, AVERAGEIFS, MIN, MAX, IF, IFERROR, IFNA, VLOOKUP, HLOOKUP, XLOOKUP, INDEX, MATCH, RANK, ROUND, CONCATENATE, TEXT, AND, OR. 
    NEVER invent function names (e.g. MAXIF, MINIF, AVGIF do not exist). 
    To return a label/category based on a max/min value, you MUST use INDEX+MATCH (e.g. INDEX(Product, MATCH(MAX(Revenue), Revenue, 0))) — never a single-function shortcut.
    No SQL.`;
  // ... similar explicit whitelists for sql, dax, pandas, tableau
}

const EXCEL_FUNCTIONS = [
  "SUM","SUMIF","SUMIFS","COUNT","COUNTA","COUNTIF","COUNTIFS",
  "AVERAGE","AVERAGEIF","AVERAGEIFS","MIN","MAX","IF","IFERROR","IFNA",
  "VLOOKUP","HLOOKUP","XLOOKUP","INDEX","MATCH","RANK","ROUND","ROUNDUP","ROUNDDOWN",
  "CONCATENATE","TEXT","AND","OR","NOT","TRIM","LEN","LEFT","RIGHT","MID",
];

const FUNCTION_WHITELISTS = {
  excel: EXCEL_FUNCTIONS,
  // sql: SQL_KEYWORDS, dax: DAX_FUNCTIONS, pandas: PANDAS_METHODS, etc.
};

function getCorrectAnswerText(q) {
  const correctKey = Object.entries(q.correct_answers || {})
    .find(([, v]) => v === "true" || v === true)?.[0];
  if (!correctKey) return null;
  const answerKey = correctKey.replace("_correct", ""); // "answer_a_correct" -> "answer_a"
  return q.answers?.[answerKey] ?? null;
}

function usesOnlyWhitelistedFunctions(text, whitelist) {
  // Find anything that looks like FUNCTIONNAME(
  const calls = [...text.matchAll(/([A-Z][A-Z0-9]+)\s*\(/g)].map((m) => m[1]);
  return calls.every((fn) => whitelist.includes(fn));
}

function validateFunctionUsage(questions, topicLower) {
  const whitelistEntry = Object.entries(FUNCTION_WHITELISTS).find(([key]) =>
    topicLower.includes(key)
  );
  if (!whitelistEntry) return questions; // no whitelist for this topic, skip

  const [, whitelist] = whitelistEntry;
  return questions.filter((q) => {
    const correctText = getCorrectAnswerText(q);
    if (!correctText) return true; // can't determine, don't block
    const ok = usesOnlyWhitelistedFunctions(correctText, whitelist);
    if (!ok) {
      console.warn(`[groq] Rejected question — correct answer uses unrecognized function: "${correctText}"`);
    }
    return ok;
  });
}

const PROSE_TOPICS = [
  // Version control & dev tools
  "github", "git", "version control",
  // Communication & narrative
  "data storytelling", "storytelling",
  "report writing", "report design", "reporting",
  "presentation", "slide", "powerpoint",
  "communication", "data communication",
  "business writing", "technical writing",
  // Process & soft skills
  "project management", "agile", "scrum",
  "stakeholder", "leadership", "soft skills",
  "career", "interview",
  "documentation", "confluence", "notion",
  // Ethics & strategy
  "data ethics", "ethics", "privacy",
  "data governance", "governance",
  "data strategy", "strategy",
  // Architecture & design concepts (decision-making, not computation)
  "data warehouse", "data modelling", "data modeling",
  "nosql", "no-sql", "etl pipeline", "etl",
  "apache spark", "spark",
  "machine learning",
  // KPI & product sense
  "kpi design", "kpi",
  "product analytics", "product sense",
  // Foundational concepts
  "data concept",
];

const TABLE_TOPICS = [
  // Spreadsheet & formula tools
  "excel", "pivot table", "pivot", "spreadsheet", "google sheets",
  // Query languages
  "sql", "bigquery", "snowflake",
  // Programming & data manipulation
  "python", "pandas", "r programming",
  // BI & visualisation tools (hands-on, formula-based)
  "power bi", "dax", "tableau", "looker studio", "looker", "metabase",
  // Data work that requires hands-on computation
  "data cleaning", "data wrangling",
  "exploratory data analysis", "eda",
  "statistical analysis", "statistics", "a/b testing",
  "data analysis", "data analytics",
  // Pipeline / orchestration tools (config & query heavy)
  "dbt", "airflow",
];

function topicMode(topicLower) {
  if (PROSE_TOPICS.some((t) => topicLower.includes(t))) return "prose";
  if (TABLE_TOPICS.some((t) => topicLower.includes(t))) return "table";
  // Unknown topics default to prose — safer than forcing irrelevant tables
  return "prose";
}

// ── Prompt builder
function buildPrompt({
  category,
  topicLower,
  difficulty,
  userWeakness,
  previousQuestions,
  performance,
  learningObjective,
}) {
  const difficultyLabel = DIFFICULTY_LABELS[difficulty] ?? "Beginner";
  const prevQList =
    previousQuestions?.length > 0
      ? previousQuestions.slice(-10).join("; ")
      : "none";
  const topic = category?.trim() || "Data Analytics";
  const mode  = topicMode(topicLower);

  const perfNote =
    performance === "low"  ? "Keep scenarios simple, single-step reasoning only." :
    performance === "high" ? "Use complex multi-step scenarios and edge cases." :
    "Mix of straightforward and multi-step questions.";

  // ────────────────────────────────────────────────────────────────────────────
  // TABLE mode — computational topics (Excel, SQL, Python, DAX, Tableau …)
  // ────────────────────────────────────────────────────────────────────────────
  if (mode === "table") {
    return `TOPIC: "${topic}" | DIFFICULTY: ${difficultyLabel} | QUESTIONS: ${QUESTIONS_PER_QUIZ} | MODE: computational (tables allowed)

TOOL: ${toolConstraint(topicLower)}

DIFFICULTY RULES:
${DIFFICULTY_SPEC[difficultyLabel]}

ANSWER INTEGRITY — strictly enforce:
- The question stem describes the BUSINESS PROBLEM only
- NEVER write the correct formula, query, or answer inside the question stem
- NEVER write "use =FORMULA()" or "the correct answer is..." in the stem
- The stem asks WHAT TO DO — the answer options provide the formulas to evaluate
- BAD: "Calculate average sales using =AVERAGE(B2:B10). The correct formula is =AVERAGE(B2:B10)."
- GOOD: "A manager needs the average monthly sales from the table below. Which formula is correct?"

QUESTION STRUCTURE:
Every question "question" field must follow this exact format:
<one or two sentence business problem — no formula>
| Col1 | Col2 | Col3 |
|------|------|------|
| val  | val  | val  |
| val  | val  | val  |
<end with "Which formula is correct?" or "What does this return?">

CRITICAL FIELD RULES:
- The pipe-delimited table goes INSIDE the "question" field only
- "description" field = one plain English sentence, NO pipes, NO tables, NO markdown
- Never put a table in "description", "explanation", "tip", or any field except "question"

EXAMPLE "question" field value:
"A sales manager needs the average revenue per product from the data below. Which formula returns the correct result?\\n| Product | Revenue |\\n|---------|---------|\\n| A       | 500     |\\n| B       | 300     |\\n| C       | 700     |"

EXAMPLE "description" field value:
"Tests whether the participant can apply AVERAGEIF to filter by category."

QUESTION TYPES — generate exactly:
- 4 x practical: formula/syntax task, table in question field
- 3 x scenario: business metric derivation, table in question field
- 2 x calculation: numeric step-by-step derivation, table in question field
- 1 x conceptual: trade-off judgment, no table needed

RULES:
- All ${QUESTIONS_PER_QUIZ} questions must be about "${topic}" only
- One correct answer per question; correct_answers values are strings "true"/"false"
- Distribute correct answers evenly across a/b/c/d — never cluster in A or B
- Never repeat the same correct position more than twice consecutively
- No two questions test the same formula or concept
- No "What is..." definitions
- No questions solvable without working through the data
- Avoid repeating: ${prevQList}
- Performance note: ${perfNote}
- Weakness to target: ${userWeakness || "balanced coverage"}
- Objective: ${learningObjective || `Practical proficiency in ${topic}`}
- Generate only assessment-quality questions where exactly one answer is correct and all distractors are plausible but definitively incorrect.

OUTPUT — return a JSON array of exactly ${QUESTIONS_PER_QUIZ} objects using this schema:
{"id":1,"question":"stem\\n| Col | Col |\\n|-----|-----|\\n| val | val |","description":"plain text only","question_type":"practical|scenario|calculation|conceptual","answers":{"answer_a":"","answer_b":"","answer_c":"","answer_d":""},"multiple_correct_answers":"false","correct_answers":{"answer_a_correct":"false","answer_b_correct":"true","answer_c_correct":"false","answer_d_correct":"false"},"explanation":"Why correct. Why others fail.","tip":"short mnemonic","learning_objective":"skill tested","tags":["${topic.toLowerCase()}"],"category":"${topic}","difficulty":"${difficultyLabel}"}

Return ONLY the JSON array. No markdown. No fences. No commentary.`.trim();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // PROSE mode — conceptual/narrative topics (Git, Storytelling, Report Writing …)
  // ────────────────────────────────────────────────────────────────────────────
  return `TOPIC: "${topic}" | DIFFICULTY: ${difficultyLabel} | QUESTIONS: ${QUESTIONS_PER_QUIZ} | MODE: conceptual (no tables)

DIFFICULTY RULES:
- Beginner: foundational concepts, single-step decisions, one clearly best answer
- Intermediate: multi-factor trade-offs, recognising common mistakes in realistic situations
- Advanced: nuanced judgement calls, context-dependent best practices, subtle edge cases

ANSWER INTEGRITY — strictly enforce:
- Each question presents a realistic workplace situation or decision point
- NEVER make the correct answer obvious from the question wording
- NEVER use leading phrases like "the best practice is..." or "correctly..." in the stem
- The stem sets the scene — the answer options provide the judgements to evaluate
- BAD: "According to best practices, you should always write a clear commit message. What is the correct approach?"
- GOOD: "A developer on a shared repo has just fixed an urgent production bug with two unrelated file changes. How should they commit this work?"

QUESTION STRUCTURE:
Every "question" field must be a realistic workplace scenario (2–3 sentences).
No pipe-delimited tables. No formulas or code blocks in the question stem.
End with a clear decision prompt such as:
"What should they do?", "Which approach is most effective?", "What is the best next step?",
"What went wrong?", or "Which option best addresses this situation?"

CRITICAL FIELD RULES:
- "question" field = scenario prose only — no tables, no code blocks, no pipe characters
- "description" field = one plain English sentence summarising what the question tests
- Never put tables, pipes, or markdown in any field

EXAMPLE "question" field value:
"A data analyst has just completed a quarterly performance report for the executive team. The report contains 12 charts, detailed footnotes, and raw data appendices. The executives have 10 minutes to review it before a major decision meeting. What should the analyst do?"

EXAMPLE "description" field value:
"Tests whether the participant understands how to tailor report depth and format to the audience and time constraints."

QUESTION TYPES — generate exactly:
- 4 x scenario: realistic workplace situation requiring a judgement call
- 3 x best_practice: choose the correct approach from plausible alternatives
- 2 x mistake_spotting: identify the flaw or anti-pattern in a described approach
- 1 x conceptual: trade-off between two valid but differently-suited methods

RULES:
- All ${QUESTIONS_PER_QUIZ} questions must be about "${topic}" only
- One correct answer per question; correct_answers values are strings "true"/"false"
- Distribute correct answers evenly across a/b/c/d — never cluster in A or B
- Never repeat the same correct position more than twice consecutively
- No two questions test the same concept or principle
- No "What is..." definitions
- All four answer options must be plausible — no obviously silly distractors
- Avoid repeating: ${prevQList}
- Performance note: ${perfNote}
- Weakness to target: ${userWeakness || "balanced coverage"}
- Objective: ${learningObjective || `Practical proficiency in ${topic}`}

OUTPUT — return a JSON array of exactly ${QUESTIONS_PER_QUIZ} objects using this schema:
{"id":1,"question":"2-3 sentence workplace scenario ending with a decision prompt","description":"plain text only","question_type":"scenario|best_practice|mistake_spotting|conceptual","answers":{"answer_a":"","answer_b":"","answer_c":"","answer_d":""},"multiple_correct_answers":"false","correct_answers":{"answer_a_correct":"false","answer_b_correct":"true","answer_c_correct":"false","answer_d_correct":"false"},"explanation":"Why the correct answer is right. Why each wrong option fails in this specific situation.","tip":"short principle or rule of thumb","learning_objective":"skill tested","tags":["${topic.toLowerCase()}"],"category":"${topic}","difficulty":"${difficultyLabel}"}

Return ONLY the JSON array. No markdown. No fences. No commentary.`.trim();
}

function dedupeQuestions(questions) {
  const seen = new Set();
  return questions.filter((q) => {
    const normQuestion = q.question
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\d+/g, "#");
    const key = `${normQuestion}__${(q.learning_objective || "").toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sanitizeJSON(text) {
  let inString = false;
  let escaped  = false;
  let result   = "";

  const ESCAPE_MAP = {
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\b": "\\b",
    "\f": "\\f",
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (escaped) {
      result  += ch;
      escaped  = false;
      continue;
    }

    if (ch === "\\" && inString) {
      result  += ch;
      escaped  = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result  += ch;
      continue;
    }

    if (inString && ESCAPE_MAP[ch]) {
      result += ESCAPE_MAP[ch];
      continue;
    }

    // Strip any other bare control character inside a string
    if (inString && ch.charCodeAt(0) < 0x20) {
      result += `\\u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`;
      continue;
    }

    result += ch;
  }

  return result;
}

// ── JSON recovery: slices from the first '[' to the last complete '}' then closes the array ──
// Handles truncated responses where the model ran out of tokens mid-array.
// Also sanitizes control characters in the sliced fragment before parsing.
function recoverPartialJSON(raw) {
  const startIdx = raw.indexOf("[");
  if (startIdx === -1) throw new Error("No JSON array start found in Groq response.");

  const sliced = sanitizeJSON(raw.slice(startIdx));

  // Walk the string tracking bracket/brace depth (outside of strings)
  let depth = 0;
  let inStr = false;
  let esc = false;
  let lastGoodEnd = -1;

  for (let i = 0; i < sliced.length; i++) {
    const ch = sliced[i];
    if (esc) { esc = false; continue; }
    if (ch === "\\" && inStr) { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;

    if (ch === "[" || ch === "{") depth++;
    if (ch === "]" || ch === "}") {
      depth--;
      if (depth === 0 && ch === "]") {
        // Found a clean, fully-closed array — try this first
        try {
          return JSON.parse(sliced.slice(0, i + 1));
        } catch { /* fall through to truncation recovery below */ }
      }
      if (ch === "}") lastGoodEnd = i;
    }
  }

  // No clean closing ']' found — truncate to last complete object + close array
  if (lastGoodEnd === -1) throw new Error("No complete JSON object found in Groq response.");
  const truncated = sliced.slice(0, lastGoodEnd + 1) + "]";
  return JSON.parse(truncated);
}

// ── Fetch
export async function fetchQuestionsFromGroq({
  category = "",
  difficulty = "Beginner",
  userWeakness = "",
  previousQuestions = [],
  performance = "average",
  learningObjective = "",
  rules = "",
} = {}) {
  const topic      = category?.trim() || "Data Analytics";
  const topicLower = topic.toLowerCase();
  const cacheKey   = `${topic}__${difficulty}__${performance}__${userWeakness}`;

  // if (cache.has(cacheKey)) return cache.get(cacheKey);
  if (inflightRequest?.key === cacheKey) return inflightRequest.promise;

  const prompt = buildPrompt({
    category: topic,
    topicLower,
    difficulty,
    userWeakness,
    previousQuestions,
    performance,
    learningObjective,
    rules,
  });

  const headers = { "Content-Type": "application/json" };
  if (import.meta.env.DEV && import.meta.env.VITE_GROQ_API_KEY) {
    headers["Authorization"] = `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`;
  }

  const promise = (async () => {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          // llama-3.3-70b-versatile supports up to 32 768 output tokens,
          // giving the model room to complete all 7 questions cleanly.
          model: "llama-3.1-8b-instant",
          temperature: 0.5,
          max_tokens: 4000,
          messages: [
            {
              role: "system",
              content: `You are a practical quiz generator for DataEre.
              Rules:
              1. Return ONLY a valid JSON array of exactly ${QUESTIONS_PER_QUIZ} objects — no markdown, no fences
              2. For computational topics: every question stem must include a pipe-delimited inline table
              3. For conceptual topics: every question stem must be a realistic prose scenario — NO tables, NO pipe characters
              4. NEVER include the correct formula or answer inside the question stem
              5. Every explanation must show a step-by-step worked solution
              6. Distractors must be specific named errors or plausible but wrong choices — not random noise
              7. Only generate questions about the topic specified by the user
              8. The "description" field is plain text only — no pipes, no markdown, no tables`,
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error("Groq error body:", JSON.stringify(err, null, 2));
        throw new Error(
          `Groq API error ${response.status}: ${err?.error?.message ?? response.statusText}`
        );
      }

      const data = await response.json();
      const raw  = data.choices?.[0]?.message?.content ?? "[]";

      const cleaned = sanitizeJSON(
        raw.replace(/^```(?:json)?|```$/gm, "").trim()
      );

      let questions;
      try {
        questions = JSON.parse(cleaned);
      } catch {
        try {
          questions = recoverPartialJSON(cleaned);
          const recovered = questions.length;
          console.warn(
            `[groq] Partial response recovered — kept ${recovered} of ${QUESTIONS_PER_QUIZ} questions.`
          );
          if (recovered === 0) throw new Error("Recovery produced an empty array.");
        } catch (recoveryErr) {
          throw new Error(`Groq response could not be parsed: ${recoveryErr.message}`);
        }
      }

      if (!Array.isArray(questions))
        throw new Error("Groq did not return a JSON array.");

      // ── Tool validation: strip questions with wrong-tool syntax
      const TOOL_RULES = {
        excel: (q) =>
          !/(SELECT\s+[\w\*]|FROM\s+\w+\s+(WHERE|JOIN|GROUP|ORDER|LIMIT)|JOIN\s+\w+\s+ON|GROUP\s+BY\s+\w|INNER\s+JOIN|LEFT\s+JOIN)/i.test(q.question),

        sql: (q) =>
          !/(VLOOKUP|XLOOKUP|SUMIF|SUMIFS|COUNTIF|INDEX\s*\(.*MATCH)/i.test(q.question),

        dax: (q) =>
          !/(SELECT\s+[\w\*]|VLOOKUP|XLOOKUP)/i.test(q.question),

        pandas: (q) =>
          !/(SELECT\s+[\w\*]|VLOOKUP|XLOOKUP)/i.test(q.question),

        tableau: (q) =>
          !/(SELECT\s+[\w\*]|VLOOKUP|XLOOKUP)/i.test(q.question),
      };

      const matchedRule = Object.entries(TOOL_RULES).find(([key]) =>
        topicLower.includes(key)
      );

      if (matchedRule) {
        const [, validate] = matchedRule;
        const before  = questions.length;
        questions     = questions.filter(validate);
        const removed = before - questions.length;
        if (removed > 0)
          console.warn(`[groq] Removed ${removed} question(s) with wrong tool syntax for "${topic}"`);
        if (questions.length === 0)
          throw new Error(`All questions failed tool validation for "${topic}". Try regenerating.`);
      }

      if (matchedRule) {
        const [, validate] = matchedRule;
        const before  = questions.length;
        questions     = questions.filter(validate);
        const removed = before - questions.length;
        if (removed > 0)
          console.warn(`[groq] Removed ${removed} question(s) with wrong tool syntax for "${topic}"`);
        if (questions.length === 0)
          throw new Error(`All questions failed tool validation for "${topic}". Try regenerating.`);
      }

      // ── NEW: reject questions with non-existent functions in correct answer
      questions = validateFunctionUsage(questions, topicLower);

      // ── NEW: dedup duplicate/near-duplicate questions
      questions = dedupeQuestions(questions);

      if (questions.length < QUESTIONS_PER_QUIZ) {
        console.warn(
          `[groq] ${QUESTIONS_PER_QUIZ - questions.length} duplicate(s) removed — proceeding with ${questions.length} questions.`
        );
        // Optional: trigger the follow-up "fill" request here (see previous message)
      }

      // cache.set(cacheKey, questions);
      return questions;
    } finally {
      inflightRequest = null;
    }
  })();

  inflightRequest = { key: cacheKey, promise };
  return promise;
}

// ── Cache utils
export function clearQuestionCache({
  category     = "",
  difficulty   = "Beginner",
  performance  = "average",
  userWeakness = "",
} = {}) {
  const topic    = category?.trim() || "Data Analytics";
  const cacheKey = `${topic}__${difficulty}__${performance}__${userWeakness}`;
  cache.delete(cacheKey);
}