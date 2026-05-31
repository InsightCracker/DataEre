import { useEffect, useState, useRef } from "react";

const questions = [
  {
    id: 1,
    question: "Which region generated the highest revenue?",
    options: ["North", "South", "East", "West"],
    answer: "West",
    difficulty: "Medium",
    explanation: "West region generated the highest revenue due to bulk enterprise sales closing in Q1.",
  },
  {
    id: 2,
    question: "Which month had the lowest sales?",
    options: ["January", "February", "March", "April"],
    answer: "February",
    difficulty: "Easy",
    explanation: "February had the lowest due to reduced demand and shorter business cycle.",
  },
  {
    id: 3,
    question: "What was the primary driver of Q1 growth?",
    options: ["New clients", "Upsells", "Renewals", "Partnerships"],
    answer: "Upsells",
    difficulty: "Hard",
    explanation: "Upsell campaigns targeting existing customers drove 62% of Q1 incremental growth.",
  },
];

const TOTAL_TIME = 300;

const difficultyConfig = {
  Easy: { color: "#4ade80", bg: "rgba(74,222,128,0.12)", label: "Easy" },
  Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", label: "Medium" },
  Hard: { color: "#f87171", bg: "rgba(248,113,113,0.12)", label: "Hard" },
};

export default function DailyChallengeQuestionPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [optionStates, setOptionStates] = useState({});
  const [cardKey, setCardKey] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
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
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const showToast = (msg, type) => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 2200);
  };

  const handleSubmit = () => {
    if (!selected || submitted) return;
    const correct = selected === questions[current].answer;

    const newStates = {};
    questions[current].options.forEach((opt) => {
      if (opt === questions[current].answer) newStates[opt] = "correct";
      else if (opt === selected && !correct) newStates[opt] = "wrong";
      else newStates[opt] = "dim";
    });
    setOptionStates(newStates);
    setSubmitted(true);

    if (correct) {
      setScore((s) => s + 10);
      showToast("Correct! +10 XP", "success");
    } else {
      showToast("Not quite!", "error");
    }
  };

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected("");
        setSubmitted(false);
        setOptionStates({});
        setCardKey((k) => k + 1);
      } else {
        setFinished(true);
      }
      setAnimating(false);
    }, 350);
  };

  const q = questions[current];
  const progress = ((current + (submitted ? 1 : 0)) / questions.length) * 100;
  const timerDanger = timeLeft < 30;
  const diff = difficultyConfig[q?.difficulty] || difficultyConfig.Medium;

  if (finished) {
    const pct = Math.round((score / (questions.length * 10)) * 100);
    return (
      <div style={styles.root}>
        <div style={{ ...styles.finishCard, animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <div style={styles.trophyRing}>
            <span style={{ fontSize: 44 }}>🏆</span>
          </div>
          <h1 style={styles.finishTitle}>Challenge Complete</h1>
          <p style={styles.finishSub}>Sales Data · Q1 Analysis</p>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreNum}>{score}</span>
            <span style={styles.scoreXp}>XP</span>
          </div>
          <div style={styles.statRow}>
            <Stat label="Accuracy" value={`${pct}%`} />
            <Stat label="Questions" value={`${questions.length}`} />
            <Stat label="Time Left" value={formatTime(timeLeft)} />
          </div>
          <button style={styles.retryBtn} onClick={() => { setCurrent(0); setScore(0); setSelected(""); setSubmitted(false); setOptionStates({}); setTimeLeft(TOTAL_TIME); setFinished(false); setCardKey(0); }}>
            Play Again
          </button>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* Toast */}
      {toastMsg && (
        <div style={{ ...styles.toast, ...(toastMsg.type === "success" ? styles.toastSuccess : styles.toastError), animation: "slideDown 0.3s ease both" }}>
          {toastMsg.type === "success" ? "✓" : "✗"} {toastMsg.msg}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.qCounter}>{current + 1} <span style={{ color: "#6b7280" }}>/ {questions.length}</span></span>
        </div>
        <div style={{ ...styles.timer, ...(timerDanger ? styles.timerDanger : {}) }}>
          {timerDanger && <span style={styles.timerPulse} />}
          ⏱ {formatTime(timeLeft)}
        </div>
        <button style={styles.exitBtn} onClick={() => setFinished(true)}>Exit</button>
      </div>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>

      {/* Context chip */}
      <div style={styles.contextChip}>
        <span style={styles.contextDot} />
        <span>Sales Data · Q1</span>
      </div>

      {/* Question card */}
      <div key={cardKey} style={{ ...styles.card, animation: "fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
        <div style={styles.cardTop}>
          <span style={{ ...styles.diffBadge, color: diff.color, background: diff.bg }}>{diff.label}</span>
          <span style={styles.scoreTag}>🏆 {score} XP</span>
        </div>

        <h2 style={styles.question}>{q.question}</h2>

        <div style={styles.optionList}>
          {q.options.map((opt, i) => {
            const state = optionStates[opt];
            return (
              <button
                key={opt}
                style={{
                  ...styles.option,
                  ...(selected === opt && !submitted ? styles.optionSelected : {}),
                  ...(state === "correct" ? styles.optionCorrect : {}),
                  ...(state === "wrong" ? styles.optionWrong : {}),
                  ...(state === "dim" ? styles.optionDim : {}),
                  animationDelay: `${i * 60}ms`,
                  animation: `fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms both`,
                }}
                onClick={() => !submitted && setSelected(opt)}
                disabled={submitted}
              >
                <span style={{ ...styles.optionLetter, ...(selected === opt && !submitted ? styles.optionLetterSelected : {}), ...(state === "correct" ? styles.optionLetterCorrect : {}), ...(state === "wrong" ? styles.optionLetterWrong : {}) }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={styles.optionText}>{opt}</span>
                {state === "correct" && <span style={styles.checkIcon}>✓</span>}
                {state === "wrong" && <span style={styles.wrongIcon}>✗</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {submitted && (
          <div style={{ ...styles.explanation, animation: "fadeSlideUp 0.35s ease both" }}>
            <div style={styles.explanationIcon}>💡</div>
            <p style={styles.explanationText}>{q.explanation}</p>
          </div>
        )}

        {/* Action button */}
        {!submitted ? (
          <button
            style={{ ...styles.submitBtn, ...(selected ? {} : styles.submitBtnDisabled) }}
            onClick={handleSubmit}
            disabled={!selected}
          >
            Submit Answer
          </button>
        ) : (
          <button style={styles.nextBtn} onClick={handleNext}>
            {current < questions.length - 1 ? "Next Question →" : "See Results →"}
          </button>
        )}
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const keyframes = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
  to   { opacity: 1; transform: translateY(0) translateX(-50%); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(1.5); }
}
`;

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
    position: "relative",
  },
  toast: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 14,
    zIndex: 999,
    letterSpacing: 0.3,
    backdropFilter: "blur(8px)",
  },
  toastSuccess: {
    background: "rgba(74,222,128,0.15)",
    border: "1px solid rgba(74,222,128,0.35)",
    color: "#4ade80",
  },
  toastError: {
    background: "rgba(248,113,113,0.15)",
    border: "1px solid rgba(248,113,113,0.35)",
    color: "#f87171",
  },
  header: {
    width: "100%",
    maxWidth: 580,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  qCounter: {
    fontSize: 15,
    fontWeight: 600,
    color: "#e2e8f0",
  },
  timer: {
    fontSize: 15,
    fontWeight: 600,
    padding: "6px 14px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.3s",
  },
  timerDanger: {
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.3)",
    color: "#f87171",
  },
  timerPulse: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#f87171",
    animation: "pulse 1s infinite",
  },
  exitBtn: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    color: "#9ca3af",
    fontSize: 13,
    cursor: "pointer",
    padding: "6px 14px",
    transition: "all 0.2s",
  },
  progressTrack: {
    width: "100%",
    maxWidth: 580,
    height: 4,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 99,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6366f1, #a78bfa)",
    borderRadius: 99,
  },
  contextChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontWeight: 500,
  },
  contextDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#6366f1",
    display: "inline-block",
  },
  card: {
    width: "100%",
    maxWidth: 580,
    background: "#13151c",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.07)",
    padding: "28px 28px 24px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  diffBadge: {
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: 99,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  scoreTag: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: 500,
  },
  question: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 1.45,
    marginBottom: 24,
    color: "#f0f2f7",
  },
  optionList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 24,
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "14px 16px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    color: "#d1d5db",
    fontSize: 15,
  },
  optionSelected: {
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.45)",
    color: "#a5b4fc",
  },
  optionCorrect: {
    background: "rgba(74,222,128,0.1)",
    border: "1px solid rgba(74,222,128,0.4)",
    color: "#4ade80",
  },
  optionWrong: {
    background: "rgba(248,113,113,0.1)",
    border: "1px solid rgba(248,113,113,0.35)",
    color: "#f87171",
  },
  optionDim: {
    opacity: 0.35,
  },
  optionLetter: {
    minWidth: 28,
    height: 28,
    borderRadius: 8,
    background: "rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    transition: "all 0.2s",
  },
  optionLetterSelected: {
    background: "rgba(99,102,241,0.3)",
    color: "#a5b4fc",
  },
  optionLetterCorrect: {
    background: "rgba(74,222,128,0.25)",
    color: "#4ade80",
  },
  optionLetterWrong: {
    background: "rgba(248,113,113,0.25)",
    color: "#f87171",
  },
  optionText: {
    flex: 1,
    fontWeight: 500,
  },
  checkIcon: {
    marginLeft: "auto",
    fontSize: 16,
    color: "#4ade80",
    fontWeight: 700,
  },
  wrongIcon: {
    marginLeft: "auto",
    fontSize: 16,
    color: "#f87171",
    fontWeight: 700,
  },
  explanation: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    background: "rgba(99,102,241,0.07)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 20,
  },
  explanationIcon: {
    fontSize: 18,
    flexShrink: 0,
    marginTop: 1,
  },
  explanationText: {
    fontSize: 14,
    color: "#a5b4fc",
    lineHeight: 1.6,
    margin: 0,
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: 0.3,
    transition: "opacity 0.2s, transform 0.15s",
  },
  submitBtnDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
  nextBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: 0.3,
    transition: "all 0.2s",
  },
  finishCard: {
    width: "100%",
    maxWidth: 440,
    background: "#13151c",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.07)",
    padding: "40px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginTop: 40,
  },
  trophyRing: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "rgba(99,102,241,0.12)",
    border: "2px solid rgba(99,102,241,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  finishTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 6,
    color: "#f0f2f7",
  },
  finishSub: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 28,
    letterSpacing: 0.3,
  },
  scoreCircle: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
    border: "2px solid rgba(99,102,241,0.4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  scoreNum: {
    fontSize: 36,
    fontWeight: 800,
    color: "#a5b4fc",
    lineHeight: 1,
  },
  scoreXp: {
    fontSize: 13,
    color: "#6366f1",
    fontWeight: 600,
    letterSpacing: 1,
  },
  statRow: {
    display: "flex",
    gap: 16,
    marginBottom: 28,
    width: "100%",
    justifyContent: "center",
  },
  statBox: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: "12px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: "#e2e8f0",
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    fontWeight: 500,
  },
  retryBtn: {
    padding: "13px 32px",
    borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: 0.3,
  },
};