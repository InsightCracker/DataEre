import { useEffect, useState, useRef } from "react";
import { fetchQuestionsFromGemini } from "../../../../api/gemini";

const TOTAL_TIME = 300;

const difficultyConfig = {
  Easy: { color: "#4ade80", bg: "rgba(74,222,128,0.12)", label: "Easy" },
  Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", label: "Medium" },
  Hard: { color: "#f87171", bg: "rgba(248,113,113,0.12)", label: "Hard" },
};

export default function DailyChallengeQuestionPage() {
  // =========================
  // STATE
  // =========================
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [finished, setFinished] = useState(false);

  const [optionStates, setOptionStates] = useState({});
  const [toastMsg, setToastMsg] = useState(null);

  const timerRef = useRef(null);

  // =========================
  // LOAD QUESTIONS (GEMINI)
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const data = await fetchQuestionsFromGemini();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading questions:", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // =========================
  // TIMER (ONLY WHEN READY)
  // =========================
  useEffect(() => {
    if (loading || questions.length === 0 || finished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, questions, finished]);

  // =========================
  // HELPERS
  // =========================
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const showToast = (msg, type) => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 2000);
  };

  // =========================
  // SAFETY GUARDS
  // =========================
  const isReady = !loading && questions.length > 0;
  const q = questions?.[current];

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div style={styles.root}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h2>Generating DataEre Challenge...</h2>
          <p>Building real-world analytics questions...</p>
        </div>
      </div>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!isReady) {
    return (
      <div style={styles.root}>
        <h2>No questions available</h2>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // =========================
  // FINISH STATE
  // =========================
  if (finished) {
    const pct = questions.length
      ? Math.round((score / (questions.length * 10)) * 100)
      : 0;

    return (
      <div style={styles.root}>
        <div style={styles.finishCard}>
          <h1>Challenge Complete</h1>
          <p>Score: {score} XP</p>
          <p>Accuracy: {pct}%</p>

          <button onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // ACTIONS
  // =========================
  const handleSubmit = () => {
    if (!selected || submitted || !q) return;

    const correct = selected === q.answer;

    const newStates = {};
    q.options.forEach((opt) => {
      if (opt === q.answer) newStates[opt] = "correct";
      else if (opt === selected && !correct) newStates[opt] = "wrong";
      else newStates[opt] = "dim";
    });

    setOptionStates(newStates);
    setSubmitted(true);

    if (correct) {
      setScore((s) => s + 10);
      showToast("Correct! +10 XP", "success");
    } else {
      showToast("Wrong answer", "error");
    }
  };

  const handleNext = () => {
    if (current >= questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrent((c) => c + 1);
    setSelected("");
    setSubmitted(false);
    setOptionStates({});
  };

  const diff = difficultyConfig[q?.difficulty] || difficultyConfig.Medium;

  // =========================
  // MAIN UI
  // =========================
  return (
    <div style={styles.root}>
      {/* Toast */}
      {toastMsg && (
        <div style={styles.toast}>
          {toastMsg.msg}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <h3>
          Question {current + 1} / {questions.length}
        </h3>
        <div>⏱ {formatTime(timeLeft)}</div>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <span style={{ color: diff.color }}>
          {q?.difficulty}
        </span>

        <h2>{q?.question}</h2>

        {/* Options */}
        <div>
          {q?.options?.map((opt) => (
            <button
              key={opt}
              onClick={() => !submitted && setSelected(opt)}
              style={{
                width: "100%",
                margin: "8px 0",
                padding: "10px",
                background:
                  selected === opt ? "#6366f1" : "#1f2937",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Actions */}
        {!submitted ? (
          <button
            disabled={!selected}
            onClick={handleSubmit}
          >
            Submit
          </button>
        ) : (
          <button onClick={handleNext}>
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0b0d12",
    color: "#f0f2f7",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: "24px 16px 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  header: {
    width: "100%",
    maxWidth: 600,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  card: {
    width: "100%",
    maxWidth: 600,
    background: "#13151c",
    padding: 24,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
  },

  loadingCard: {
    marginTop: 100,
    textAlign: "center",
  },

  spinner: {
    width: 40,
    height: 40,
    border: "4px solid rgba(255,255,255,0.1)",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    margin: "0 auto 16px",
    animation: "spin 1s linear infinite",
  },

  finishCard: {
    marginTop: 80,
    padding: 30,
    borderRadius: 16,
    background: "#13151c",
    textAlign: "center",
  },

  toast: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1f2937",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
  },
};