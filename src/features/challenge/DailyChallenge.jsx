import { useEffect, useState, useRef } from "react";
import { getDailyQuestions } from "../../../api/dailyChallenge";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Spinner,
  CircularProgress,
  CircularProgressLabel,
  useToast,
} from "@chakra-ui/react";

import { keyframes } from "@emotion/react";

const TOTAL_TIME = 300;

const difficultyConfig = {
  Easy:   { color: "green.300",  scheme: "green",  label: "Easy"   },
  Medium: { color: "yellow.300", scheme: "yellow", label: "Medium" },
  Hard:   { color: "red.400",    scheme: "red",    label: "Hard"   },
};

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

export default function DailyChallenge() {
  const [questions, setQuestions]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [current, setCurrent]       = useState(0);
  const [selected, setSelected]     = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [score, setScore]           = useState(0);
  const [timeLeft, setTimeLeft]     = useState(TOTAL_TIME);
  const [finished, setFinished]     = useState(false);
  const [optionStates, setOptionStates] = useState({});
  const timerRef = useRef(null);
  const toast = useToast();

  // ── Load questions ──────────────────────────────────────────
  useEffect(() => {
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

  // ── Timer ───────────────────────────────────────────────────
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

  // ── Helpers ─────────────────────────────────────────────────
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const isReady = !loading && questions.length > 0;
  const q       = questions?.[current];
  const diff    = difficultyConfig[q?.difficulty] || difficultyConfig.Medium;
  const timerPct = (timeLeft / TOTAL_TIME) * 100;
  const timerColor =
    timerPct > 50 ? "green.400" : timerPct > 20 ? "yellow.400" : "red.400";

  // ── Actions ─────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!selected || submitted || !q) return;
    const correct = selected === q.answer;
    const newStates = {};
    q.options.forEach((opt) => {
      if (opt === q.answer)             newStates[opt] = "correct";
      else if (opt === selected)        newStates[opt] = "wrong";
      else                              newStates[opt] = "dim";
    });
    setOptionStates(newStates);
    setSubmitted(true);
    if (correct) {
      setScore((s) => s + 10);
      toast({ title: "Correct! +10 XP", status: "success", duration: 2000, isClosable: true, position: "top" });
    } else {
      toast({ title: "Wrong answer", description: `Correct: ${q.answer}`, status: "error", duration: 2000, isClosable: true, position: "top" });
    }
  };

  const handleNext = () => {
    if (current >= questions.length - 1) { setFinished(true); return; }
    setCurrent((c) => c + 1);
    setSelected("");
    setSubmitted(false);
    setOptionStates({});
  };

  const optionStyle = (opt) => {
    const state = optionStates[opt];
    if (state === "correct") return { bg: "green.800",  borderColor: "green.400",  color: "green.100"  };
    if (state === "wrong")   return { bg: "red.900",    borderColor: "red.400",    color: "red.100"    };
    if (state === "dim")     return { bg: "gray.900",   borderColor: "gray.700",   color: "gray.500"   };
    if (selected === opt)    return { bg: "indigo.900", borderColor: "indigo.400", color: "white"      };
    return                          { bg: "gray.800",   borderColor: "gray.600",   color: "gray.100"   };
  };

  // ── Shared page wrapper ─────────────────────────────────────
  const PageShell = ({ children }) => (
    <Box minH="100vh" bg="gray.950" color="white"
      fontFamily="'DM Sans', system-ui, sans-serif"
      px={4} py={10}
      display="flex" flexDirection="column" alignItems="center">
      {children}
    </Box>
  );

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <PageShell>
        <VStack spacing={4} mt={32} textAlign="center">
          <Spinner size="xl" color="indigo.400" thickness="4px" />
          <Heading size="md" color="gray.100">Generating Daily Challenge…</Heading>
          <Text color="gray.400">Building real-world analytics questions</Text>
        </VStack>
      </PageShell>
    );
  }

  // ── Empty ───────────────────────────────────────────────────
  if (!isReady) {
    return (
      <PageShell>
        <VStack spacing={4} mt={32}>
          <Heading size="md">No questions available</Heading>
          <Button colorScheme="indigo" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </VStack>
      </PageShell>
    );
  }

  // ── Finished ─────────────────────────────────────────────────
  if (finished) {
    const pct = questions.length
      ? Math.round((score / (questions.length * 10)) * 100)
      : 0;
    const grade =
      pct >= 80 ? { label: "Excellent",  color: "green.300"  } :
      pct >= 50 ? { label: "Good",       color: "yellow.300" } :
                  { label: "Keep Going", color: "red.400"    };

    return (
      <PageShell>
        <Box
          w="100%" maxW="520px" bg="gray.900"
          borderRadius="2xl" border="1px solid" borderColor="gray.700"
          p={10} textAlign="center"
        >
          <Text fontSize="4xl" mb={2}>🏁</Text>
          <Heading size="xl" mb={1}>Challenge Complete</Heading>
          <Text color="gray.400" mb={8}>Here's how you did today</Text>

          <HStack justify="center" spacing={12} mb={8}>
            <VStack spacing={0}>
              <Text fontSize="3xl" fontWeight="bold" color="indigo.300">{score} XP</Text>
              <Text fontSize="sm" color="gray.400">Total Score</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="3xl" fontWeight="bold" color={grade.color}>{pct}%</Text>
              <Text fontSize="sm" color="gray.400">Accuracy</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="3xl" fontWeight="bold" color="gray.100">
                {Math.round(score / 10)}/{questions.length}
              </Text>
              <Text fontSize="sm" color="gray.400">Correct</Text>
            </VStack>
          </HStack>

          <Badge colorScheme={grade.color === "green.300" ? "green" : grade.color === "yellow.300" ? "yellow" : "red"}
            fontSize="sm" px={4} py={1} borderRadius="full" mb={8}>
            {grade.label}
          </Badge>

          <Button w="full" colorScheme="blue" size="lg" borderRadius="xl"
            onClick={() => window.location.reload()}>
            Play Again
          </Button>
        </Box>
      </PageShell>
    );
  }

  // ── Main quiz UI ─────────────────────────────────────────────
  return (
    <PageShell>
      {/* Header */}
      <Flex w="100%" maxW="620px" justify="space-between" align="center" mb={5}>
        <HStack spacing={3}>
          <Text color="gray.400" fontSize="sm">Question</Text>
          <Text fontWeight="bold" fontSize="lg">
            {current + 1}
            <Text as="span" color="gray.500" fontWeight="normal">/{questions.length}</Text>
          </Text>
        </HStack>

        {/* Circular timer */}
        <CircularProgress value={timerPct} color={timerColor} trackColor="gray.700" size="56px">
          <CircularProgressLabel>
            <Text fontSize="xs" fontWeight="bold"
              color={timeLeft <= 30 ? "red.400" : "gray.100"}
              animation={timeLeft <= 10 ? `${pulse} 1s infinite` : "none"}>
              {formatTime(timeLeft)}
            </Text>
          </CircularProgressLabel>
        </CircularProgress>

        <HStack spacing={2}>
          <Text color="gray.400" fontSize="sm">Score</Text>
          <Text fontWeight="bold" color="indigo.300">{score} XP</Text>
        </HStack>
      </Flex>

      {/* Progress bar */}
      <Box w="100%" maxW="620px" h="3px" bg="gray.800" borderRadius="full" mb={6} overflow="hidden">
        <Box
          h="full" bg="indigo.500" borderRadius="full"
          w={`${((current) / questions.length) * 100}%`}
          transition="width 0.4s ease"
        />
      </Box>

      {/* Question card */}
      <Box
        w="100%" maxW="620px" bg="gray.900"
        borderRadius="2xl" border="1px solid" borderColor="gray.700"
        p={{ base: 5, md: 8 }}
      >
        {/* Difficulty + category */}
        <HStack mb={4} spacing={2}>
          <Badge colorScheme={diff.scheme} borderRadius="full" px={3} py={0.5} fontSize="xs">
            {q?.difficulty}
          </Badge>
          {q?.category && (
            <Badge variant="subtle" colorScheme="gray" borderRadius="full" px={3} py={0.5} fontSize="xs">
              {q.category}
            </Badge>
          )}
        </HStack>

        {/* Question text */}
        <Heading size="md" mb={7} lineHeight="1.6" color="gray.50">
          {q?.question}
        </Heading>

        {/* Options */}
        <VStack spacing={3} align="stretch" mb={6}>
          {q?.options?.map((opt) => {
            const s = optionStyle(opt);
            return (
              <Button
                key={opt}
                onClick={() => !submitted && setSelected(opt)}
                variant="unstyled"
                h="auto" whiteSpace="normal" textAlign="left"
                px={5} py={4}
                bg={s.bg}
                border="1px solid"
                borderColor={s.borderColor}
                color={s.color}
                borderRadius="xl"
                fontWeight="normal"
                fontSize="sm"
                lineHeight="1.5"
                cursor={submitted ? "default" : "pointer"}
                transition="all 0.15s"
                _hover={!submitted ? { borderColor: "indigo.400", bg: "gray.750" } : {}}
              >
                {opt}
              </Button>
            );
          })}
        </VStack>

        {/* Explanation (after submit) */}
        {submitted && q?.explanation && (
          <Box bg="gray.800" border="1px solid" borderColor="gray.600"
            borderRadius="lg" p={4} mb={5}>
            <Text fontSize="xs" color="indigo.300" fontWeight="bold" mb={1}>Explanation</Text>
            <Text fontSize="sm" color="gray.300">{q.explanation}</Text>
          </Box>
        )}

        {/* Action button */}
        {!submitted ? (
          <Button
            w="full" size="lg" borderRadius="xl"
            colorScheme="blue"
            isDisabled={!selected}
            onClick={handleSubmit}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            w="full" size="lg" borderRadius="xl"
            colorScheme="indigo" variant="outline"
            onClick={handleNext}
          >
            {current >= questions.length - 1 ? "See Results →" : "Next Question →"}
          </Button>
        )}
      </Box>
    </PageShell>
  );
}