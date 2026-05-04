export function buildDailyChallengePrompt({ date, category, difficulty }) {
  const seed = `${date}-${category}-${difficulty}`; // ensures same challenge for the whole day

  return `You are a data analytics challenge generator for DataEre, a professional learning platform.

DAILY CHALLENGE — ${date}
Seed: ${seed} (use this to ensure consistency — same date always produces same challenge)

TASK:
Generate ONE complete daily challenge package for the topic "${category}" at ${difficulty} level.
The challenge must simulate a real workplace data analytics scenario.

═══════════════════════════════════════
PART 1 — DATASET
═══════════════════════════════════════
Generate a realistic sample dataset relevant to "${category}" with:
- A clear dataset name and business context
- 8-10 rows of realistic sample data (not random — tell a story)
- 4-6 columns with appropriate headers and data types
- At least one data quality issue hidden in the data (missing value, duplicate, outlier, or formatting inconsistency) that the analyst must find
- A brief description of what the dataset represents and where it came from

Return the dataset as a JSON array of row objects.

═══════════════════════════════════════
PART 2 — BUSINESS BRIEF
═══════════════════════════════════════
Write a short (3-5 sentence) business brief as if from a manager:
- Who is asking (job title, company type)
- What business problem they are trying to solve
- What decision will be made based on the analysis
- What the deadline/urgency is

═══════════════════════════════════════  
PART 3 — CHALLENGE QUESTIONS (5 questions)
═══════════════════════════════════════
Generate exactly 5 questions based strictly on the dataset and business brief above.
Distribution:
- 2 x scenario: "Based on the dataset, what would you do to..."
- 1 x practical: "Which formula/function would you use to..."
- 1 x conceptual: "What does [pattern in the data] indicate about..."
- 1 x calculation: Use actual numbers from the dataset

Each question must:
- Reference specific columns, values, or rows from the dataset above
- Be answerable using the provided data — no external knowledge required
- Have 4 answer options where wrong answers are plausible given the data

═══════════════════════════════════════
OUTPUT FORMAT — Return a single JSON object:
═══════════════════════════════════════
{
  "challenge_id": "${seed}",
  "date": "${date}",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "dataset": {
    "name": "dataset name",
    "context": "where this data came from and what it represents",
    "columns": ["col1", "col2", "col3"],
    "rows": [
      { "col1": "value", "col2": "value", "col3": "value" }
    ],
    "data_quality_issue": "description of the hidden issue in the data"
  },
  "business_brief": {
    "requestor": "Senior Marketing Analyst",
    "company": "mid-size e-commerce retailer",
    "problem": "We need to understand why Q3 revenue dropped 18% despite increased traffic.",
    "decision": "Whether to reallocate budget from paid ads to retention campaigns.",
    "urgency": "Board presentation in 3 days"
  },
  "questions": [
    {
      "id": 1,
      "question": "question referencing specific data?",
      "description": "brief context",
      "question_type": "scenario|practical|conceptual|calculation",
      "answers": {
        "answer_a": "option",
        "answer_b": "option",
        "answer_c": "option",
        "answer_d": "option"
      },
      "multiple_correct_answers": "false",
      "correct_answers": {
        "answer_a_correct": "false",
        "answer_b_correct": "true",
        "answer_c_correct": "false",
        "answer_d_correct": "false"
      },
      "explanation": "explanation referencing the actual dataset values",
      "tip": "memory trick or shortcut"
    }
  ]
}

STRICT RULES:
1. Dataset rows must tell a coherent business story — not random values
2. Questions must be answerable from the dataset — no guessing
3. The data quality issue must be subtle — not immediately obvious
4. Calculations must use actual numbers from the dataset rows
5. correct_answers values are strings "true"/"false" — never booleans
6. One correct answer per question only
7. Return ONLY the JSON object — no markdown, no fences, no commentary
8. The challenge_id ensures the same date always returns the same challenge`;
}