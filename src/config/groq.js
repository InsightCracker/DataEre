const GROQ_API_URL = import.meta.env.DEV
  ? "/groq/openai/v1/chat/completions"
  : "/api/groq";                      

const QUESTIONS_PER_QUIZ = 10;

const DIFFICULTY_LABELS = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
};


const cache = new Map();
let inflightRequest = null;

// Prompt
function buildPrompt({ 
    category, 
    difficulty, 
    userWeakness, 
    previousQuestions, 
    performance, 
    learningObjective 
  }) {
  const difficultyLabel = DIFFICULTY_LABELS[difficulty] ?? "Beginner";

  // Limit previous questions to last 5 to save tokens
  const prevQList = previousQuestions?.length > 0
    ? previousQuestions.slice(-5).join("; ")
    : "none";

  const topic = category?.trim() || "Data Analytics";

  return `You are a quiz generator for DataEre, a data analytics learning platform.

TOPIC: "${topic}" — Generate ALL ${QUESTIONS_PER_QUIZ} questions exclusively about "${topic}". Every single question must test knowledge of "${topic}" only. Do NOT generate questions about any other subject.

DIFFICULTY: ${difficultyLabel}
PERFORMANCE: ${performance || "average"} — ${
    performance === "low" ? "simplify slightly but keep educational value" :
    performance === "high" ? "increase complexity, use edge cases and multi-step reasoning" :
    "balanced mix of straightforward and moderately challenging questions"
  }
USER WEAKNESS: ${userWeakness || "none — cover a balanced mix of subtopics within ${topic}"}
AVOID REPEATING: ${prevQList}
LEARNING OBJECTIVE: ${learningObjective || `Build well-rounded understanding of ${topic}`}

QUESTION TYPE DISTRIBUTION (strictly enforce across ${QUESTIONS_PER_QUIZ} questions):
- ${Math.round(QUESTIONS_PER_QUIZ * 0.4)} scenario questions (40%): real-world business problems involving ${topic}
- ${Math.round(QUESTIONS_PER_QUIZ * 0.25)} practical questions (25%): hands-on tool/syntax usage in ${topic}
- ${Math.round(QUESTIONS_PER_QUIZ * 0.2)} conceptual questions (20%): definitions, theory, comparisons in ${topic}
- ${Math.round(QUESTIONS_PER_QUIZ * 0.15)} calculation questions (15%): numeric reasoning or formulas in ${topic}

Return a JSON array of exactly ${QUESTIONS_PER_QUIZ} objects with this structure:
{"id":1,"question":"question about ${topic}?","description":"brief context","question_type":"scenario|practical|conceptual|calculation","answers":{"answer_a":"option","answer_b":"option","answer_c":"option","answer_d":"option"},"multiple_correct_answers":"false","correct_answers":{"answer_a_correct":"false","answer_b_correct":"false","answer_c_correct":"true","answer_d_correct":"false"},"explanation":"why correct answer is right and others are wrong","tip":"memory trick","learning_objective":"specific goal","tags":["${topic.toLowerCase()}","tag2"],"category":"${topic}","difficulty":"${difficultyLabel}"}

RULES:
1. ALL questions must be about "${topic}" — no exceptions
2. One correct answer only; correct_answers values are strings "true"/"false"
3. Wrong answers must be plausible, not obviously wrong
4. Distribute correct answers evenly across answer_a/b/c/d
5. No two questions test the same concept
6. Factually accurate only — do not guess

Return ONLY the JSON array. No markdown. No fences. No commentary.`;
}


export async function fetchQuestionsFromGroq({
  category = "",
  difficulty = "Beginner",
  userWeakness = "",
  previousQuestions = [],
  performance = "average",
  learningObjective = "",
} = {}) {
  const topic = category?.trim() || "Data Analytics";
  const cacheKey = `${topic}__${difficulty}__${performance}__${userWeakness}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (inflightRequest?.key === cacheKey) {
    return inflightRequest.promise;
  }

  const prompt = buildPrompt({ category: topic, difficulty, userWeakness, previousQuestions, performance, learningObjective });

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
          model: "llama-3.1-8b-instant",
          temperature: 0.7,
          max_tokens: 4000,
          messages: [
            {
              role: "system",
              content: `You are a quiz generator for DataEre. You ONLY generate questions about the topic the user specifies. Always respond with valid JSON only — no markdown, no code fences, no commentary.`,
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Groq API error ${response.status}: ${err?.error?.message ?? response.statusText}`);
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content ?? "[]";

      let cleaned = raw.replace(/^```(?:json)?|```$/gm, "").trim();

      let questions;
      try {
        questions = JSON.parse(cleaned);
      } catch {
        const lastBrace = cleaned.lastIndexOf("}");
        if (lastBrace !== -1) {
          cleaned = cleaned.slice(0, lastBrace + 1) + "]";
          cleaned = cleaned.replace(/,\s*]$/, "]");
          questions = JSON.parse(cleaned);
        } else {
          throw new Error("Groq response too truncated to recover.");
        }
      }

      if (!Array.isArray(questions)) throw new Error("Groq did not return a JSON array.");

      cache.set(cacheKey, questions);
      return questions;
    } finally {
      inflightRequest = null;
    }
  })();

  inflightRequest = { key: cacheKey, promise };
  return promise;
}

export function clearQuestionCache({ category = "", difficulty = "Beginner", performance = "average", userWeakness = "" } = {}) {
  const topic = category?.trim() || "Data Analytics";
  const cacheKey = `${topic}__${difficulty}__${performance}__${userWeakness}`;
  cache.delete(cacheKey);
}