import { useEffect, useState, useRef, useContext } from "react";
import { getDailyQuestions } from "../../../api/dailyChallenge";
import { QuizContext } from "../../util/Contexts";
import { saveScore } from "../../util/api";
import { useAuth } from "../../util/AuthContext";
import {
  Box,
  Flex,
  VStack,
  Text,
  Badge,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaRegCheckCircle } from "react-icons/fa";
import { ArrowRightIcon } from "@chakra-ui/icons";
import DailyResult   from "./DailyResult";
import DailyComeBack from "./DailyComeBack";

// ── Animations ───────────────────────────────────────────────
const slideUp = keyframes`
  from { opacity:0; transform:translateY(30px) scale(0.97); }
  to   { opacity:1; transform:translateY(0)    scale(1);    }
`;
const optionIn = keyframes`
  from { opacity:0; transform:translateX(-18px); }
  to   { opacity:1; transform:translateX(0);     }
`;
const feedbackIn = keyframes`
  from { opacity:0; transform:translateY(12px) scale(0.95); }
  to   { opacity:1; transform:translateY(0)    scale(1);    }
`;
const correctPop = keyframes`
  0%  { transform:translateX(6px) scale(1);    }
  50% { transform:translateX(6px) scale(1.03); }
  100%{ transform:translateX(6px) scale(1);    }
`;
const shakeAnim = keyframes`
  0%,100%{ transform:translateX(6px); }
  20%    { transform:translateX(0);   }
  40%    { transform:translateX(10px);}
  60%    { transform:translateX(2px); }
  80%    { transform:translateX(8px); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

const TOTAL_TIME = 300;

const difficultyConfig = {
  Easy:         { bg: "#ecfdf5", color: "#059669" },
  Medium:       { bg: "#fef9ee", color: "#b45309" },
  Hard:         { bg: "#fef2f2", color: "#dc2626" },
  beginner:     { bg: "#ecfdf5", color: "#059669" },
  intermediate: { bg: "#fef9ee", color: "#b45309" },
  advanced:     { bg: "#fef2f2", color: "#dc2626" },
};

// ── localStorage helpers ─────────────────────────────────────
const STORAGE_KEY = "dailyChallenge_completedDate";
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const markCompletedToday = () => localStorage.setItem(STORAGE_KEY, todayStr());
const hasCompletedToday  = () => localStorage.getItem(STORAGE_KEY) === todayStr();

// ── OptionButton ─────────────────────────────────────────────
const OptionButton = ({ label, text, index, revealed, isSelected, isCorrect, isWrong, onSelect }) => {
  const borderColor = isCorrect ? "#10b981" : isWrong
    ? "#ef4444" : isSelected ? "#4263eb" : "#e2e8f0";
  const bg          = isCorrect ? "#ecfdf5" : isWrong
    ? "#fef2f2" : isSelected ? "#eef2ff" : "white";
  const letterBg    = isCorrect ? "#10b981" : isWrong
    ? "#ef4444" : isSelected ? "#4263eb" : "#f1f5f9";
  const letterColor = (isCorrect || isWrong || isSelected) ? "white" : "#64748b";

  const animation = isCorrect
    ? `${correctPop} 0.4s cubic-bezier(0.34,1.56,0.64,1) both`
    : isWrong
    ? `${shakeAnim} 0.4s ease both`
    : `${optionIn} 0.45s ease ${(index + 1) * 0.05}s both`;

  return (
    <Flex
      as="button"
      align="center" gap={4} w="100%"
      bg={bg} border="1.5px solid" borderColor={borderColor}
      borderRadius="14px" p="14px 18px" textAlign="left"
      cursor={revealed ? "default" : "pointer"}
      onClick={() => !revealed && onSelect()}
      animation={animation}
      transition="all 0.22s cubic-bezier(0.34,1.3,0.64,1)"
      transform={(isCorrect || isWrong || isSelected) ? "translateX(6px)" : "none"}
      boxShadow={(isSelected || isCorrect) ? "0 4px 16px rgba(66,99,235,0.12)" : "none"}
      _hover={!revealed ? {
        borderColor: "#4263eb",
        transform: "translateX(6px)",
        boxShadow: "0 4px 16px rgba(66,99,235,0.12)",
      } : {}}
    >
      <Flex
        w="36px" h="36px" borderRadius="full" flexShrink={0}
        align="center" justify="center"
        bg={letterBg} color={letterColor}
        fontWeight={700} fontSize="14px" transition="all 0.2s"
      >
        {label}
      </Flex>
      <Text fontSize="15px" fontWeight={500} color="#1e293b" flex={1} lineHeight={1.4} textTransform="capitalize">
        {text}
      </Text>
      {(isCorrect || isWrong) && (
        <Text fontSize="18px" ml="auto" flexShrink={0}>{isCorrect ? "✅" : "❌"}</Text>
      )}
    </Flex>
  );
};

// ── Timer pill ───────────────────────────────────────────────
const TimerPill = ({ timeLeft }) => {
  const isWarning = timeLeft <= 60;
  const isDanger  = timeLeft <= 30;
  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <Flex
      align="center" gap={2}
      bg={isDanger ? "#fef2f2" : isWarning ? "#fef9ee" : "#eef2ff"}
      border="1.5px solid"
      borderColor={isDanger ? "#fca5a5" : isWarning ? "#fcd34d" : "#c7d2fe"}
      borderRadius="full" px={4} py="6px"
      animation={isDanger ? `${pulse} 1s infinite` : "none"}
    >
      <Text fontSize="13px" fontWeight={700}
        color={isDanger ? "#dc2626" : isWarning ? "#b45309" : "#4263eb"}>
        ⏱ {mins}:{secs}
      </Text>
    </Flex>
  );
};

// ── Main Component ───────────────────────────────────────────
export default function DailyChallenge() {
  const [questions, setQuestions]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [current, setCurrent]               = useState(0);
  const [revealed, setRevealed]             = useState(false);
  const [chosen, setChosen]                 = useState("");
  const [timeLeft, setTimeLeft]             = useState(TOTAL_TIME);
  const [finished, setFinished]             = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [correctCount, setCorrectCount]     = useState(0);
  const [wrongCount, setWrongCount]         = useState(0);
  const [animKey, setAnimKey]               = useState(0);
  const timerRef = useRef(null);

  const { score, setScore } = useContext(QuizContext);
  const { token, isLoggedIn } = useAuth();

  // ── Load questions (skip if already done today)
  useEffect(() => {
    if (hasCompletedToday()) {
      setAlreadyCompleted(true);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const data = await getDailyQuestions();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading questions:", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Timer 
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

  const isReady = !loading && questions.length > 0;
  const q       = questions?.[current];
  const isLast  = current === questions.length - 1;

  // ── Detect question format 
  const isSoloFormat = q && q.answers && q.correct_answers;

  const getOptions = () => {
    if (!q) return [];
    if (isSoloFormat) {
      return ["A", "B", "C", "D"].map((k) => ({
        key: k,
        text: q.answers?.[`answer_${k.toLowerCase()}`] ?? "",
        isCorrect: (q.correct_answers?.[`answer_${k.toLowerCase()}_correct`] ?? "false") === "true",
      })).filter((o) => o.text);
    }
    return (q.options ?? []).map((opt, i) => ({
      key: String(i),
      text: opt,
      isCorrect: opt === q.answer,
    }));
  };

  const options = getOptions();
  const chosenOption  = options.find((o) => o.key === chosen);
  const chosenCorrect = chosenOption?.isCorrect ?? false;

  // ── Navigation
  const advance = (wasCorrect) => {
    if (wasCorrect) {
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 3);
    } else {
      setWrongCount((w) => w + 1);
    }
    setChosen("");
    setRevealed(false);
    setAnimKey((k) => k + 1);
    setCurrent((c) => c + 1);
  };

  const handleNext = () => advance(chosenCorrect);
  const handleSkip = () => {
    setChosen("");
    setRevealed(false);
    setAnimKey((k) => k + 1);
    setCurrent((c) => c + 1);
  };

  const handleFinish = async () => {
    const finalCorrect = chosenCorrect ? correctCount + 3 : correctCount;
    const finalWrong   = chosenCorrect ? wrongCount : wrongCount + 1;
    const finalSkipped = questions.length - finalCorrect - finalWrong;

    if (chosenCorrect) setScore((s) => s + 3);

    if (isLoggedIn) {
      try {
        await saveScore({
          topic:   q?.topic ?? q?.category ?? "Daily Challenge",
          score:   finalCorrect,
          total:   questions.length,
          wrong:   finalWrong,
          skipped: finalSkipped,
          mode:    "daily",
        }, token); // ← context token, bypasses localStorage entirely
        markCompletedToday();
      } catch (err) {
        console.error("Failed to save score:", err);
      }
    }

    setFinished(true);
  };

  // ── Empty
  if (!isReady) {
    return (
      <Box className="quiz-container" minH="100vh" bg="#f8fafc"
        display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text fontSize="2xl">😕</Text>
          <Text fontWeight={600} color="#0f1b35">Sorry, something went wrong while setting up your daily challenge.</Text>
          <Button colorScheme="blue" borderRadius="10px"
            onClick={() => window.location.reload()}>
            Please Try Again
          </Button>
        </VStack>
      </Box>
    );
  }

  // ── Finished → DailyResult 
  if (finished) {
    return (
      <DailyResult
        correctCount={correctCount}
        wrongCount={wrongCount}
        totalQuestions={questions.length}
      />
    );
  }

  // ── Main quiz UI 
  const diff = difficultyConfig[q?.difficulty] ?? difficultyConfig.beginner;

  return (
    <Box className="quiz-container">
      <Flex
        key={animKey}
        flexDir="column" align="center" justify="center"
        p={{ base: 5, md: 8 }} gap={6}
        overflowY="auto" minH="calc(100vh - 56px - 72px)"
      >
        {/* ── Header: progress / timer / score ── */}
        <Flex w="100%" maxW="680px" align="center" justify="space-between" gap={3}>
          <Badge
            bg="#eef2ff" color="#4263eb"
            px={3} py={1} borderRadius="20px"
            fontSize="11px" fontWeight={700}
            textTransform="uppercase" letterSpacing="0.06em"
          >
            {current + 1} / {questions.length}
          </Badge>

          <TimerPill timeLeft={timeLeft} />

          <Flex align="center" gap={1}
            bg="#f8fafc" border="1.5px solid #e2e8f0"
            borderRadius="full" px={3} py="5px">
            <Text fontSize="13px" color="#64748b" fontWeight={600}>XP</Text>
            <Text fontSize="13px" color="#4263eb" fontWeight={800}>{score}</Text>
          </Flex>
        </Flex>

        {/* Progress bar */}
        <Box w="100%" maxW="680px" h="3px" bg="#e2e8f0" borderRadius="full" overflow="hidden">
          <Box
            h="full" bg="#4263eb" borderRadius="full"
            w={`${(current / questions.length) * 100}%`}
            transition="width 0.4s ease"
          />
        </Box>

        {/* ── Question card ── */}
        <Box
          bg="white" borderRadius="20px"
          p={{ base: "22px 18px", md: "32px 36px" }}
          maxW="680px" w="100%"
          boxShadow="0 4px 24px rgba(15,27,53,0.08)"
          animation={`${slideUp} 0.45s cubic-bezier(0.34,1.3,0.64,1) both`}
        >
          <Flex align="center" justify="space-between" mb={5} flexWrap="wrap" gap={2}>
            <Badge
              bg="#eef2ff" color="#4263eb"
              px={3} py={1} borderRadius="20px"
              fontSize="11px" fontWeight={700}
              textTransform="uppercase" letterSpacing="0.06em"
            >
              📅 {q?.topic ?? q?.category ?? "Daily Challenge"}
            </Badge>
            {q?.difficulty && (
              <Badge
                bg={diff.bg} color={diff.color}
                px={3} py={1} borderRadius="20px"
                fontSize="11px" fontWeight={700}
                textTransform="uppercase" letterSpacing="0.06em"
              >
                {q.difficulty}
              </Badge>
            )}
          </Flex>
          <Text fontWeight={600} fontSize={{ base: "15px", md: "17px" }}
            color="#0f1b35" lineHeight={1.65}>
            {q?.question}
          </Text>
        </Box>

        {/* ── Options ── */}
        <VStack spacing={3} maxW="680px" w="100%">
          {options.map((opt, i) => (
            <OptionButton
              key={opt.key}
              label={["A","B","C","D"][i] ?? opt.key}
              text={opt.text}
              index={i}
              revealed={revealed}
              isSelected={chosen === opt.key && !revealed}
              isCorrect={revealed && opt.isCorrect}
              isWrong={revealed && chosen === opt.key && !opt.isCorrect}
              onSelect={() => { setChosen(opt.key); setRevealed(true); }}
            />
          ))}
        </VStack>

        {/* ── Explanation ── */}
        {revealed && q?.explanation && (
          <Flex
            maxW="680px" w="100%"
            borderRadius="14px" p="14px 20px"
            align="flex-start" gap={3}
            bg="#f0f9ff" border="1.5px solid #bae6fd"
            animation={`${feedbackIn} 0.35s cubic-bezier(0.34,1.56,0.64,1) both`}
          >
            <Text fontSize="18px" flexShrink={0}>💡</Text>
            <Box>
              <Text fontSize="13px" fontWeight={700} color="#0369a1" mb={1}>Explanation</Text>
              <Text fontSize="13px" color="#0c4a6e" lineHeight={1.6}>{q.explanation}</Text>
            </Box>
          </Flex>
        )}

        {/* ── Feedback banner ── */}
        {revealed && (
          <Flex
            maxW="680px" w="100%"
            borderRadius="14px" p="14px 20px"
            align="center" gap={3}
            bg={chosenCorrect ? "#ecfdf5" : "#fef2f2"}
            border="1.5px solid"
            borderColor={chosenCorrect ? "#6ee7b7" : "#fca5a5"}
            animation={`${feedbackIn} 0.35s cubic-bezier(0.34,1.56,0.64,1) both`}
          >
            <Text fontSize="20px" flexShrink={0}>{chosenCorrect ? "🎉" : "📖"}</Text>
            <Box>
              <Text fontSize="14px" fontWeight={600}
                color={chosenCorrect ? "#065f46" : "#991b1b"}>
                {chosenCorrect
                  ? "Great answer! That's correct."
                  : "Not quite. Review the correct option highlighted above."}
              </Text>
              <Text fontSize="12px" mt={1} opacity={0.75}
                color={chosenCorrect ? "#065f46" : "#991b1b"}>
                {chosenCorrect
                  ? "You earned +1 point for this question."
                  : "Review this topic to strengthen your understanding."}
              </Text>
            </Box>
          </Flex>
        )}
      </Flex>

      {/* ── Bottom nav bar ── */}
      <Flex
        bg="#0f1b35" px={{ base: 4, md: 7 }} py={4}
        align="center" justify="center" gap={4}
        flexShrink={0} position="sticky" bottom={0}
      >
        {!isLast && (
          <Button
            onClick={handleSkip}
            bg="#2d3748" color="whiteAlpha.600"
            borderRadius="10px" px={6} py={6}
            fontWeight={600} fontSize="14px"
            _hover={{ bg: "#374151", color: "white", transform: "translateY(-3px)" }}
            _active={{ transform: "scale(0.96)" }}
            transition="all 0.22s"
          >
            Skip
          </Button>
        )}

        {isLast ? (
          <Button
            rightIcon={<FaRegCheckCircle />}
            onClick={handleFinish}
            bgGradient="linear(to-r,#10b981,#059669)"
            color="white" borderRadius="10px" px={6} py={6}
            fontWeight={600} fontSize="14px"
            boxShadow="0 4px 14px rgba(16,185,129,0.4)"
            _hover={{ boxShadow: "0 8px 22px rgba(16,185,129,0.55)", transform: "translateY(-3px)" }}
            _active={{ transform: "scale(0.96)" }}
            transition="all 0.22s"
            isDisabled={!revealed}
          >
            Finish
          </Button>
        ) : (
          <Button
            rightIcon={<ArrowRightIcon />}
            onClick={handleNext}
            bgGradient="linear(to-r,#4263eb,#3b5bdb)"
            color="white" borderRadius="10px" px={6} py={6}
            fontWeight={600} fontSize="14px"
            boxShadow="0 4px 14px rgba(66,99,235,0.4)"
            _hover={{ boxShadow: "0 8px 22px rgba(66,99,235,0.55)", transform: "translateY(-3px)" }}
            _active={{ transform: "scale(0.96)" }}
            transition="all 0.22s"
            isDisabled={!revealed}
          >
            Next
          </Button>
        )}
      </Flex>
    </Box>
  );
}