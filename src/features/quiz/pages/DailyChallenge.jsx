import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Progress,
  VStack,
  HStack,
  Badge,
  useToast,
  ChakraProvider,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// ---- Fake Question Data ----
const questions = [
  {
    id: 1,
    question: "Which region generated the highest revenue?",
    options: ["North", "South", "East", "West"],
    answer: "West",
    explanation:
      "West region generated the highest revenue due to bulk enterprise sales.",
  },
  {
    id: 2,
    question: "Which month had the lowest sales?",
    options: ["January", "February", "March", "April"],
    answer: "February",
    explanation: "February had the lowest due to reduced demand.",
  },
];

export default function DailyChallengeQuestionPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);

  const toast = useToast();
  const navigate = useNavigate();

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (!selected) return;

    if (selected === questions[current].answer) {
      setScore(score + 10);
      toast({ title: "Correct! +10 XP 🎉", status: "success" });
    } else {
      toast({ title: "Wrong answer ❌", status: "error" });
    }

    setShowResult(true);
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected("");
      setShowResult(false);
    } else {
      navigate("/results?mode=daily");
    }
  };

  const q = questions[current];

  return (
    <ChakraProvider>
      <Box bg="gray.900" minH="100vh" color="white" p={6}>
        {/* Top Bar */}
        <Flex justify="space-between" align="center" mb={4}>
          <Text>
            Question {current + 1} of {questions.length}
          </Text>
          <Text color={timeLeft < 30 ? "red.400" : "white"}>
            ⏳ {formatTime(timeLeft)}
          </Text>
          <Button size="sm" onClick={() => navigate("/")}>Exit</Button>
        </Flex>

        <Progress value={((current + 1) / questions.length) * 100} mb={6} />

        {/* Dataset Context */}
        <Box bg="gray.800" p={4} borderRadius="xl" mb={6}>
          <Heading size="sm">Dataset: Sales Data (Q1)</Heading>
          <Text fontSize="sm" color="gray.400">
            You are analyzing company sales performance across regions.
          </Text>
        </Box>

        {/* Question */}
        <Box bg="gray.800" p={6} borderRadius="xl" mb={6}>
          <Flex justify="space-between">
            <Heading size="md">{q.question}</Heading>
            <Badge colorScheme="yellow">Medium</Badge>
          </Flex>

          <RadioGroup mt={4} onChange={setSelected} value={selected}>
            <VStack align="start" spacing={3}>
              {q.options.map((opt) => (
                <Radio key={opt} value={opt} size="lg">
                  {opt}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>

          {!showResult ? (
            <Button mt={6} onClick={handleSubmit} isDisabled={!selected}>
              Submit Answer
            </Button>
          ) : (
            <Box mt={6}>
              <Text
                color={
                  selected === q.answer ? "green.400" : "red.400"
                }
              >
                {selected === q.answer
                  ? "Correct!"
                  : `Wrong. Correct answer: ${q.answer}`}
              </Text>

              <Text mt={2} color="gray.300">
                {q.explanation}
              </Text>

              <Button mt={4} onClick={nextQuestion}>
                Next Question →
              </Button>
            </Box>
          )}
        </Box>

        {/* Score */}
        <Box>
          <Text>🏆 Score: {score} XP</Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
