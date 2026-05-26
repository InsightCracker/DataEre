import { 
  useContext, 
  useEffect 
} from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { 
  Flex, 
  Text 
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { TimerContext } from "./TimerProvider";

const timerPulse = keyframes`
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.06); }
`;

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const QuizTimer = () => {
  const { timeLeft, setTimeLeft } = useContext(TimerContext);
  const navigate  = useNavigate();
  const location  = useLocation();

  const isWarning = timeLeft <= 90;
  const isDanger  = timeLeft <= 30;

  useEffect(() => {
  const isOnQuizPage =
    location.pathname === "/quiz/solo" ||
    location.pathname === "/quiz/vsbot";

  // Don't countdown or navigate if not on a quiz page
  if (!isOnQuizPage) return;

  if (timeLeft <= 0) {
    if (location.pathname === "/quiz/solo")  navigate("/quiz/results?mode=solo");
    if (location.pathname === "/quiz/vsbot") navigate("/quiz/results?mode=vsbot");
    return;
  }

  const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
  return () => clearInterval(timer);
}, [timeLeft, navigate, location.pathname, setTimeLeft]);

  return (
    <Flex
      align="center"
      gap="7px"
      bg={
        isDanger  ? "rgba(239,68,68,0.18)"  :
        isWarning ? "rgba(245,158,11,0.18)" :
        "rgba(255,255,255,0.08)"
      }
      border="1px solid"
      borderColor={
        isDanger  ? "#ef4444" :
        isWarning ? "#f59e0b" :
        "rgba(255,255,255,0.12)"
      }
      borderRadius="20px"
      px={4}
      py="6px"
      fontWeight={700}
      fontSize="14px"
      color={isDanger ? "#f87171" : isWarning ? "#fbbf24" : "white"}
      animation={isDanger ? `${timerPulse} 0.8s ease infinite` : "none"}
      transition="all 0.3s"
      whiteSpace="nowrap"
    >
      <Text fontSize="15px">⏱</Text>
      {fmt(timeLeft)}
    </Flex>
  );
};

export default QuizTimer;