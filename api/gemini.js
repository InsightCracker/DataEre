const GEMINI_API_URL =
  import.meta.env.DEV
    ? "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent"
    : "/api/gemini";

const QUESTIONS_PER_QUIZ = 10;

const cache = new Map();
let inflightRequest = null;

// Prompt (Fully Generic DataEre Daily Challenge)
function buildPrompt({
  previousQuestions = [],
}) {
  const prevQList =
    previousQuestions?.length > 0
      ? previousQuestions.slice(-5).join("; ")
      : "none";

  return `
Act as a Senior Data Analyst and Data Analytics Instructor.

Generate a REAL-WORLD DATA ANALYTICS DAILY CHALLENGE for DataEre.

This is NOT subject-specific. Mix across:
- E-commerce
- Banking
- Healthcare
- Logistics
- SaaS
- Retail
- FinTech

REQUIREMENTS:

1. Generate exactly ${QUESTIONS_PER_QUIZ} multiple-choice questions.
2. Each question MUST include a MINI DATASET TABLE (5–8 rows).
3. Questions must test real analyst thinking:
   - KPI analysis
   - Excel calculations
   - SQL logic reasoning
   - Power BI interpretation
   - Business decision making
   - Data cleaning insights
   - Statistics interpretation

4. NO THEORY QUESTIONS.
5. NO definitions.
6. All questions must feel like real company tasks.

AVOID REPEATING:
${prevQList}

OUTPUT FORMAT (STRICT JSON ONLY):

Return ONLY this structure:

[
  {
    "id": 1,
    "question": "Include a mini dataset table + analytical question",
    "options": ["A", "B", "C", "D"],
    "answer": "Correct option",
    "question_type": "scenario | sql | excel | visualization | business | statistics",
    "explanation": "Explain using data reasoning",
    "dataset_context": "What dataset represents",
    "tags": ["data_analytics"]
  }
]

DATASET RULE:
Each question must contain a table like:

Customer_ID | Region | Revenue | Orders
C001 | West | 500 | 5
C002 | East | 200 | 2

Then ask a question based on it.

RULES:
- One correct answer only
- Options must be realistic and misleading (plausible)
- Questions must vary in structure
- No markdown, no commentary, no explanation outside JSON
`;
}

// Fetch Function (Gemini)
export async function fetchQuestionsFromGemini({
  previousQuestions = [],
} = {}) {

  const cacheKey = "DATAERE_DAILY_CHALLENGE";

  if (cache.has(cacheKey)) return cache.get(cacheKey);

  if (inflightRequest?.key === cacheKey) {
    return inflightRequest.promise;
  }

  const prompt = buildPrompt({ previousQuestions });

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const promise = (async () => {
    try {
      const response = await fetch(
        `${GEMINI_API_URL}?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 4096,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API error ${response.status}: ${
            err?.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();

      let raw =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

      raw = raw.replace(/```json|```/g, "").trim();

      let questions;

      try {
        questions = JSON.parse(raw);
      } catch (e) {
        const lastBracket = raw.lastIndexOf("]");
        if (lastBracket !== -1) {
          questions = JSON.parse(raw.slice(0, lastBracket + 1));
        } else {
          throw new Error("Invalid JSON from Gemini response");
        }
      }

      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
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

// Clear cache
export function clearQuestionCache() {
  cache.clear();
}