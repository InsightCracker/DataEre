const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "/groq/openai/v1/chat/completions"; // proxied via vite.config.js to avoid CORS
const QUESTIONS_PER_QUIZ = 5; // 5 questions ~2500 tokens — safe within 100k TPD free limit

const DIFFICULTY_LABELS = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
};


// Cache key includes all adaptive inputs so different user contexts get unique sets
const cache = new Map();
let inflightRequest = null;

/**
 * Builds the adaptive DataEre prompt with all dynamic variables injected.
 *
 * @param {object} params
 * @param {string} params.category        - Main topic (e.g. "SQL", "Excel")
 * @param {string} params.subtopic        - Subtopic focus (e.g. "GROUP BY", "VLOOKUP")
 * @param {string} params.difficulty      - "Beginner" | "Intermediate" | "Advanced"
 * @param {string} params.userWeakness    - Concept the user struggles with
 * @param {string[]} params.previousQuestions - Question texts already seen by the user
 * @param {string} params.performance     - "low" | "average" | "high"
 * @param {string} params.learningObjective - Target learning goal
 */

function buildPrompt({
  category,
  difficulty,
  userWeakness,
  previousQuestions,
  performance,
  learningObjective,
}) {
  const difficultyLabel = DIFFICULTY_LABELS[difficulty] ?? "Beginner";
  const categoryClause = category
    ? `about the topic "${category}"`
    : "covering a broad range of data analytics topics";

  const prevQList =
    previousQuestions?.length > 0
      ? previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")
      : "None";

  return `You are an expert quiz database generator for a data analytics learning platform called DataEre. Your task is to generate exactly ${QUESTIONS_PER_QUIZ} high-quality, unique, and accurate multiple-choice questions ${categoryClause} at a ${difficultyLabel} difficulty level.

CONTEXT INPUTS:
* Topic: ${category || "Data Analytics"}
* User Weakness: ${userWeakness || "Unknown — generate a balanced mix across all subtopics"}
* Previous Questions (DO NOT repeat or closely mirror these):
${prevQList}
* Performance Level: ${performance || "average"} (low | average | high)
* Target Learning Objective: ${learningObjective || "Build well-rounded understanding of the topic"}

ADAPTIVE RULES:
* Prioritize testing the user's weakness: ${userWeakness || "unknown — cover all subtopics evenly"}
* Avoid generating questions similar in concept, structure, or wording to the previous questions listed above
* If performance is "low" → simplify slightly but maintain learning value
* If performance is "high" → increase complexity, include edge cases or multi-step reasoning
* If performance is "average" → balanced mix of straightforward and moderately challenging questions
* Ensure a mix of conceptual, practical, and scenario-based questions
* Add a "question_type" field: "conceptual" | "practical" | "scenario"

QUESTION REQUIREMENTS:
Each question must be:
* Factually accurate and verifiable
* Clear, concise, and unambiguous
* Unique (no duplicate or similar questions)
* Appropriately challenging for the ${difficultyLabel} difficulty level
* Suitable for a professional quiz/learning platform

OUTPUT FORMAT:
Return a JSON array. Each element must have EXACTLY this structure:
{
  "id": 1,
  "question": "Clear, specific question text ending with a question mark?",
  "description": "Brief context or topic area this question covers",
  "question_type": "conceptual | practical | scenario",
  "answers": {
    "answer_a": "Plausible but incorrect option",
    "answer_b": "Plausible but incorrect option",
    "answer_c": "The correct answer",
    "answer_d": "Plausible but incorrect option"
  },
  "multiple_correct_answers": "false",
  "correct_answers": {
    "answer_a_correct": "false",
    "answer_b_correct": "false",
    "answer_c_correct": "true",
    "answer_d_correct": "false"
  },
  "explanation": "Detailed explanation of why the correct answer is right and why others are wrong",
  "tip": "A mnemonic, shortcut, or memory trick to remember this concept",
  "learning_objective": "${learningObjective || 'Understand core concepts of the topic'}",
  "tags": ["topic", "subtopic", "keyword"],
  "category": "${category || 'data-analytics'}",
  "difficulty": "${difficultyLabel}"
}

STRICT RULES:
1. ACCURACY — Every correct answer must be factually correct. Do not guess.
2. DISTRACTORS — Wrong answers must be plausible, not obviously wrong.
3. UNIQUENESS — No two questions should test the same concept.
4. SINGLE ANSWER — Only one answer is correct. multiple_correct_answers is always "false".
5. STRING BOOLEANS — correct_answers values must be "true" or "false" as strings, never booleans.
6. ANSWER DISTRIBUTION — Evenly distribute correct answers across answer_a, answer_b, answer_c, answer_d (roughly 5 each).
7. EXPLANATION — Must explain why the correct answer is right AND briefly why the others are wrong.
8. TAGS — Use 2–4 lowercase, specific, searchable keywords per question.
9. DIFFICULTY CALIBRATION:
   * Beginner → definitions, basic usage, foundational concepts
   * Intermediate → applied problem-solving, comparisons, multi-step tasks
   * Advanced → edge cases, deep internals, complex reasoning scenarios

Return ONLY the JSON array. No markdown. No code fences. No commentary.`;
}

/**
 * Generates adaptive quiz questions via Groq for the DataEre platform.
 *
 * @param {object} params
 * @param {string}   params.category         
 * @param {string}   params.subtopic           
 * @param {string}   params.difficulty      
 * @param {string}   params.userWeakness     
 * @param {string[]} params.previousQuestions 
 * @param {string}   params.performance     
 * @param {string}   params.learningObjective  
 * @returns {Promise<Array>}
 */

export async function fetchQuestionsFromGroq({
  category = "",
  difficulty = "Beginner",
  userWeakness = "",
  previousQuestions = [],
  performance = "average",
  learningObjective = "",
} = {}) {

  // Cache key includes all adaptive params so unique contexts get unique question sets
  const cacheKey = `${category}__${difficulty}__${performance}__${userWeakness}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (inflightRequest?.key === cacheKey) {
    return inflightRequest.promise;
  }

  const prompt = buildPrompt({
    category,
    difficulty,
    userWeakness,
    previousQuestions,
    performance,
    learningObjective,
  });

  const promise = (async () => {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", 
          temperature: 0.7,
          max_tokens: 4000, 
          messages: [
            {
              role: "system",
              content:
                "You are an expert quiz generator for a data analytics learning platform called DataEre. Always respond with valid JSON only — no markdown, no code fences, no commentary.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          `Groq API error ${response.status}: ${err?.error?.message ?? response.statusText}`
        );
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content ?? "[]";

      let cleaned = raw.replace(/^```(?:json)?|```$/gm, "").trim();

      let questions;
      try {
        questions = JSON.parse(cleaned);
      } catch {

        // Find the last complete question object (ends with "}")
        const lastBrace = cleaned.lastIndexOf("}");
        if (lastBrace !== -1) {
          cleaned = cleaned.slice(0, lastBrace + 1) + "]";

          // Remove any trailing comma before the closing bracket
          cleaned = cleaned.replace(/,\s*\]$/, "]");
          questions = JSON.parse(cleaned);

          console.warn("[Groq] Response was truncated — recovered", questions.length, "questions.");
        } else {
          throw new Error("Groq response was too truncated to recover.");
        }
      }

      if (!Array.isArray(questions)) {
        throw new Error("Groq did not return a JSON array.");
      }

      console.log("[Groq] Questions fetched successfully:", questions);

      cache.set(cacheKey, questions);
      return questions;
    } finally {
      inflightRequest = null;
    }
  })();

  inflightRequest = { key: cacheKey, promise };
  return promise;
}

export function clearQuestionCache({
  category = "",
  difficulty = "Beginner",
  performance = "average",
  userWeakness = "",
} = {}) {
  const cacheKey = `${category}__${difficulty}__${performance}__${userWeakness}`;
  cache.delete(cacheKey);
}