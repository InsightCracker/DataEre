import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import {
  Box, 
  Flex, 
  Text, 
  Button, 
  SimpleGrid
} from "@chakra-ui/react";
import {
  FaCircleCheck, 
  FaCircleXmark,
  FaHouse, 
  FaShareNodes, 
  FaSpinner, 
  FaTrophy,
} from "react-icons/fa6";

import { QuizContext } from "../../../shared/contexts/Contexts";
import { TimerContext } from "../../../shared/contexts/TimerProvider";
import BottomNav from "../../../shared/components/BottomNav";
import Sidebar from "../../../shared/components/Sidebar";
import QuizShareCard from "./QuizShareCard";

// ── Animations 
const slideUp = keyframes`
  from { opacity:0; transform:translateY(30px) scale(0.97); }
  to   { opacity:1; transform:translateY(0)    scale(1);    }
`;
const popIn = keyframes`
  from { opacity:0; transform:scale(0.85); }
  to   { opacity:1; transform:scale(1);    }
`;

// ── ActionButton helper 
const ActionButton = ({ icon, label, onClick, gradient, color = "#0f1b35", delay = "0s" }) => (
  <Button
    onClick={onClick}
    w="100%"
    h="auto"
    py={4} px={5}
    display="flex"
    alignItems="center"
    justifyContent="flex-start"
    gap={4}
    bg={gradient ? undefined : "white"}
    bgGradient={gradient}
    color={gradient ? "white" : color}
    border={gradient ? "none" : "1.5px solid #e2e8f0"}
    borderRadius="14px"
    fontWeight={600}
    fontSize="15px"
    boxShadow={gradient ? "0 4px 14px rgba(66,99,235,0.25)" : "0 2px 8px rgba(15,27,53,0.05)"}
    animation={`${slideUp} 0.4s ease ${delay} both`}
    _hover={{
      transform: "translateY(-3px)",
      boxShadow: gradient
        ? "0 8px 24px rgba(66,99,235,0.4)"
        : "0 6px 18px rgba(15,27,53,0.1)",
    }}
    _active={{ transform: "scale(0.97)" }}
    transition="all 0.22s cubic-bezier(0.34,1.3,0.64,1)"
  >
    <Flex
      w="36px" h="36px" borderRadius="10px" flexShrink={0}
      align="center" justify="center"
      bg={gradient ? "rgba(255,255,255,0.18)" : "#f1f5f9"}
      fontSize="16px"
      color={gradient ? "white" : "#4263eb"}
    >
      {icon}
    </Flex>
    <Text>{label}</Text>
  </Button>
);

// ── SoloResult 
const SoloResult = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const {
    score, setScore,
    questions,
    setCurrQuestion,
    refresh, setRefresh,
    wrongAnswer, setWrongAnswer,
  } = useContext(QuizContext);

  const total      = questions.length;
  const skipped    = total - score - wrongAnswer;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const emoji      = percentage >= 80 ? "🏆" : percentage >= 50 ? "👍" : "💪";
  const headline   = percentage >= 80 ? "Excellent Work!" : percentage >= 50 ? "Good Job!" : "Keep Practicing!";
  const { setTimeLeft } = useContext(TimerContext);
  const TOTAL_TIME = 300;

  const retryQuiz = () => {
    setScore(0); 
    setWrongAnswer(0); 
    setCurrQuestion(0); 
    setRefresh(!refresh);
    setTimeLeft(TOTAL_TIME);
    navigate("/quiz/solo");
  };

  const tryAnotherQuiz = () => {
    setScore(0); 
    setWrongAnswer(0); 
    setCurrQuestion(0); 
    setRefresh(!refresh);
    setTimeLeft(TOTAL_TIME);
    navigate("/quiz/topics");
  };

  return (
    <Box
      minH="100vh"
      bg="#eef0f7"
      align="center"
      justify="spac"
      p={{ base:5, md: 0}}
      pt={{ base: 5, md: 8 }}
      pb={{ base: "5rem", lg: 0}}
    >
      <Sidebar />

      <Box
        bg="white"
        borderRadius="24px"
        p={{ base: "28px 20px", md: "40px 48px" }}
        maxW="520px"
        w="100%"
        textAlign="center"
        boxShadow="0 8px 40px rgba(15,27,53,0.1)"
        animation={`${popIn} 0.5s cubic-bezier(0.34,1.3,0.64,1) both`}
      >

        {/* ── Header ── */}
        <Text fontSize="52px" mb={2}>{emoji}</Text>
        <Text
          fontWeight={700} fontSize={{ base:"22px", md:"26px" }}
          color="#0f1b35" mb={2}
        >
          {headline}
        </Text>
        <Text fontSize="14px" color="#64748b" mb={7}>
          Here's a breakdown of your performance.
        </Text>

        {/* ── Score ring ── */}
        <Box
          w="120px" h="120px" borderRadius="full"
          mx="auto" mb={6}
          position="relative"
          display="flex" alignItems="center" justifyContent="center"
          style={{
            background: `conic-gradient(#4263eb ${percentage * 3.6}deg, #eef2ff 0)`,
          }}
        >
          <Flex
            w="88px" h="88px" borderRadius="full" bg="white"
            flexDir="column" align="center" justify="center"
            position="absolute"
          >
            <Text fontWeight={700} fontSize="24px" color="#0f1b35" lineHeight={1}>
              {score}/{total}
            </Text>
            <Text fontSize="12px" color="#94a3b8" mt={1}>{percentage}%</Text>
          </Flex>
        </Box>

        {/* ── Stats row ── */}
        <SimpleGrid columns={3} gap={3} mb={8}>
          {[
            { val: score,    label: "Correct",  color: "#10b981", bg: "#ecfdf5", icon: 
              <FaCircleCheck /> },
            { val: wrongAnswer, label: "Wrong", color: "#ef4444", bg: "#fef2f2", icon: 
              <FaCircleXmark /> },
            { val: skipped,  label: "Skipped",  color: "#f59e0b", bg: "#fef9ee", icon: "⏭" },
          ].map((s) => (
            <Flex
              key={s.label}
              flexDir="column" align="center" justify="center"
              bg={s.bg} borderRadius="14px" py={4} px={2}
              gap={1}
            >
              <Text fontSize="18px" color={s.color}>{s.icon}</Text>
              <Text fontWeight={700} fontSize="22px" color={s.color}>{s.val}</Text>
              <Text fontSize="11px" color="#94a3b8">{s.label}</Text>
            </Flex>
          ))}
        </SimpleGrid>

        {/* ── Action buttons ── */}
        <Flex flexDir="column" gap={3}>
          <ActionButton
            icon={<FaSpinner />}
            label="Retake Session"
            onClick={retryQuiz}
            gradient="linear(to-r,#4263eb,#3b5bdb)"
            delay="0.05s"
          />
          <ActionButton
            icon={<FaHouse />}
            label="Take on New Challenge"
            onClick={tryAnotherQuiz}
            delay="0.15s"
          />
          <ActionButton
            icon={<FaTrophy />}
            label="View Leaderboard"
            onClick={() => navigate("/board")}
            delay="0.1s"
          />
          <ActionButton
            icon={<FaShareNodes />}
            label="Share Score"
            onClick={() => setShow(true)}
            delay="0.2s"
          />
        </Flex>
      </Box>

      <QuizShareCard 
        score={score} 
        isOpen={show} 
        onClose={() => setShow(false)} 
      />

      <BottomNav />
    </Box>
  );
};

export default SoloResult;