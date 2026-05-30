import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, 
  Flex, 
  VStack, 
  Text, 
  Badge, 
  Button
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import { FaRegCheckCircle } from "react-icons/fa";
import { QuizContext } from "../../../util/Contexts";
import { saveScore } from "../../../util/api";

// ── Animations 
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

const LETTERS = ["A", "B", "C", "D"];

const difficultyConfig = {
  beginner:     { bg:"#ecfdf5", color:"#059669" },
  intermediate: { bg:"#fef9ee", color:"#b45309" },
  advanced:     { bg:"#fef2f2", color:"#dc2626" },
};

// ── OptionButton 
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
      align="center"
      gap={4}
      w="100%"
      bg={bg}
      border="1.5px solid"
      borderColor={borderColor}
      borderRadius="14px"
      p="14px 18px"
      textAlign="left"
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
        fontWeight={700} fontSize="14px"
        transition="all 0.2s"
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

const SoloPlay = () => {
  const navigate = useNavigate();

  const {
    score, setScore,
    currQuestion, setCurrQuestion,
    questions,
    wrongAnswer, setWrongAnswer,
  } = useContext(QuizContext);

  const [optionChosenKey, setOptionChosenKey] = useState("");
  const [revealed, setRevealed]               = useState(false);
  const [pointsHistory, setPointsHistory]     = useState([]);
  const [animKey, setAnimKey]                 = useState(0);

  // ── Clear stale completion flag when quiz mounts
  // This prevents instant redirect on a new quiz session
  useEffect(() => {
    localStorage.removeItem("soloQuizCompleted");
  }, []); // empty deps = runs once on mount only

  const q = questions[currQuestion];

  const optionKeys = ["A", "B", "C", "D"];

  const getOptionText   = (key) => q.answers?.[`answer_${key.toLowerCase()}`] ?? "";
  const isOptionCorrect = (key) =>
    (q.correct_answers?.[`answer_${key.toLowerCase()}_correct`] ?? "false") === "true";

  const chosenIsCorrect = optionChosenKey ? isOptionCorrect(optionChosenKey) : false;

  // ── Navigation helpers 
  function advance(pointsEarned) {
    setPointsHistory((h) => [...h, pointsEarned]);
    setOptionChosenKey("");
    setRevealed(false);
    setAnimKey((k) => k + 1);
    setCurrQuestion(currQuestion + 1);
  }

  const nextQuestion = () => {
    if (chosenIsCorrect) setScore(score + 1);
    else setWrongAnswer(wrongAnswer + 1);
    advance(chosenIsCorrect ? 1 : 0);
  };

  const prevQuestion = () => {
    const prev = pointsHistory.length > 0 ? pointsHistory[pointsHistory.length - 1] : 0;
    setPointsHistory((h) => h.slice(0, -1));
    if (prev === 1) setScore(score - 1);
    setOptionChosenKey("");
    setRevealed(false);
    setAnimKey((k) => k + 1);
    setCurrQuestion(currQuestion - 1);
  };

  const skipQuestion = () => {
    setPointsHistory((h) => [...h, 0]);
    setOptionChosenKey("");
    setRevealed(false);
    setAnimKey((k) => k + 1);
    setCurrQuestion(currQuestion + 1);
  };

  const finishQuiz = async () => {
    const finalScore = chosenIsCorrect ? score + 1 : score;
    const finalWrong = chosenIsCorrect ? wrongAnswer : wrongAnswer + 1;

    if (chosenIsCorrect) setScore(finalScore);
    else setWrongAnswer(finalWrong);

    // Save score to backend
    try {
      await saveScore({
        topic:   q.topic ?? q.category ?? "General",
        score:   finalScore,
        total:   questions.length,
        wrong:   finalWrong,
        skipped: questions.length - finalScore - finalWrong,
        mode:    "solo",
      });
    } catch (err) {
      console.error("Failed to save score:", err);
    }

    localStorage.setItem("soloQuizCompleted", "true");
    setOptionChosenKey("");
    setCurrQuestion(0);
    navigate("/quiz/results?mode=solo");
  };

  const isLast  = currQuestion === questions.length - 1;
  const isFirst = currQuestion === 0;
  const diff    = difficultyConfig[q.difficulty] ?? difficultyConfig.beginner;

  return (
    <Box className="quiz-container">
      <Flex
        key={animKey}
        flexDir="column"
        align="center"
        justify="center"
        p={{ base: 5, md: 8 }}
        gap={6}
        overflowY="auto"
        minH="calc(100vh - 56px - 72px)"
      >
        {/* ── Question card ── */}
        <Box
          bg="white"
          borderRadius="20px"
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
              📘 {q.topic ?? q.category ?? "Quiz"}
            </Badge>
            {q.difficulty && (
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
          <Text
            fontWeight={600}
            fontSize={{ base: "15px", md: "17px" }}
            color="#0f1b35"
            lineHeight={1.65}
          >
            {q.question}
          </Text>
        </Box>

        {/* ── Options ── */}
        <VStack spacing={3} maxW="680px" w="100%">
          {optionKeys.map((key, i) => {
            const text = getOptionText(key);
            if (!text) return null;
            const isSelected = optionChosenKey === key && !revealed;
            const isCorrect  = revealed && isOptionCorrect(key);
            const isWrong    = revealed && optionChosenKey === key && !isOptionCorrect(key);
            return (
              <OptionButton
                key={key}
                label={key}
                text={text}
                index={i}
                revealed={revealed}
                isSelected={isSelected}
                isCorrect={isCorrect}
                isWrong={isWrong}
                onSelect={() => {
                  setOptionChosenKey(key);
                  setRevealed(true);
                }}
              />
            );
          })}
        </VStack>

        {/* ── Feedback banner ── */}
        {revealed && (
          <Flex
            maxW="680px" w="100%"
            borderRadius="14px" p="14px 20px"
            align="center" gap={3}
            bg={chosenIsCorrect ? "#ecfdf5" : "#fef2f2"}
            border="1.5px solid"
            borderColor={chosenIsCorrect ? "#6ee7b7" : "#fca5a5"}
            animation={`${feedbackIn} 0.35s cubic-bezier(0.34,1.56,0.64,1) both`}
          >
            <Text fontSize="20px" flexShrink={0}>{chosenIsCorrect ? "🎉" : "📖"}</Text>
            <Box>
              <Text
                fontSize="14px" fontWeight={600}
                color={chosenIsCorrect ? "#065f46" : "#991b1b"}
              >
                {chosenIsCorrect
                  ? "Great answer! That's correct."
                  : "Not quite. Review the correct option highlighted above."}
              </Text>
              <Text
                fontSize="12px" mt={1} opacity={0.75}
                color={chosenIsCorrect ? "#065f46" : "#991b1b"}
              >
                {chosenIsCorrect
                  ? "You earned +1 point for this question."
                  : "Review this topic to strengthen your understanding."}
              </Text>
            </Box>
          </Flex>
        )}
      </Flex>

      {/* ── Bottom navigation bar ── */}
      <Flex
        bg="#0f1b35"
        px={{ base: 4, md: 7 }}
        py={4}
        align="center"
        justify="center"
        gap={4}
        flexShrink={0}
        position="sticky"
        bottom={0}
      >
        <Button
          leftIcon={<ArrowLeftIcon />}
          onClick={prevQuestion}
          isDisabled={isFirst}
          bg="#1e3058" color="whiteAlpha.700"
          borderRadius="10px" px={6} py={6}
          fontWeight={600} fontSize="14px"
          _hover={{ bg: "#263d6b", color: "white", transform: "translateY(-3px)" }}
          _active={{ transform: "scale(0.96)" }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed", transform: "none" }}
          transition="all 0.22s"
        >
          Prev
        </Button>

        {!isLast && (
          <Button
            onClick={skipQuestion}
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
            onClick={finishQuiz}
            bgGradient="linear(to-r,#10b981,#059669)"
            color="white"
            borderRadius="10px" px={6} py={6}
            fontWeight={600} fontSize="14px"
            boxShadow="0 4px 14px rgba(16,185,129,0.4)"
            _hover={{ boxShadow: "0 8px 22px rgba(16,185,129,0.55)", transform: "translateY(-3px)" }}
            _active={{ transform: "scale(0.96)" }}
            transition="all 0.22s"
          >
            Finish
          </Button>
        ) : (
          <Button
            rightIcon={<ArrowRightIcon />}
            onClick={nextQuestion}
            bgGradient="linear(to-r,#4263eb,#3b5bdb)"
            color="white"
            borderRadius="10px" px={6} py={6}
            fontWeight={600} fontSize="14px"
            boxShadow="0 4px 14px rgba(66,99,235,0.4)"
            _hover={{ boxShadow: "0 8px 22px rgba(66,99,235,0.55)", transform: "translateY(-3px)" }}
            _active={{ transform: "scale(0.96)" }}
            transition="all 0.22s"
          >
            Next
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default SoloPlay;