// import { fetchQuestionsFromGemini } from "./gemini";

// export async function getDailyQuestions() {
//   // 1. Check backend for cached questions
//   const res = await fetch("/api/dailychallenge");
//   const data = await res.json();

//   if (data.questions) return data.questions;

//   // 2. Generate from Gemini
//   const questions = await fetchQuestionsFromGemini();

//   // 3. Save to backend
//   const saveRes = await fetch("/api/dailychallenge", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ questions }),
//   });

//   const saved = await saveRes.json();
//   return saved.questions;
// }

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function transformQuestion(q) {
  const options = Object.values(q.answers);
  const correctKey = Object.keys(q.correct_answers).find(
    (key) => q.correct_answers[key] === "true"
  );
  const answerIndex = correctKey?.replace("_correct", "").replace("answer_", "");
  const answer = q.answers[`answer_${answerIndex}`];

  return {
    question: q.question,
    options,
    answer,
    difficulty: q.difficulty || "Medium",
    explanation: q.explanation || "",
    category: q.category || "",
  };
}

export async function getDailyQuestions() {
  // 1. Check backend
  const res = await fetch(`${API_BASE}/api/dailychallenge`);
  const data = await res.json();
  if (data.questions) return data.questions;

  // 2. Fetch from public folder
  const jsonRes = await fetch("/questions.json");
  const text = await jsonRes.text();
  const cleaned = text.trim().replace(/^\/\/.*$/gm, "").trim();
  const allQuestions = JSON.parse(cleaned);

  // 3. Transform and pick 10 random
  const transformed = allQuestions.map(transformQuestion);
  const questions = [...transformed]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  // 4. Save to backend
  const saveRes = await fetch(`${API_BASE}/api/dailychallenge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions }),
  });

  const saved = await saveRes.json();
  return saved.questions;
}