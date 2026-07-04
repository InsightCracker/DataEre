import { useContext } from "react";
import { 
  Box, 
  Flex, 
  Text
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import QuizTimer from "./QuizTimer";
import { QuizContext }  from "../contexts/Contexts";
import { TimerContext } from "../contexts/TimerProvider";

const TOTAL_TIME = 300;

const Navbar = () => {
  const { currQuestion, questions } = useContext(QuizContext);
  const { timeLeft } = useContext(TimerContext);

  const progress     = (timeLeft / TOTAL_TIME) * 100;
  const isLow        = progress <= 30;

  return (
    <Box
      as="nav"
      bg="rgba(10, 14, 39, 0.95)"
      px={{ base: 4, md: 8 }}
      py="10px"
      boxShadow="0 1px 8px rgba(0,0,0,0.35)"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex align="center" justify="space-between" gap={4}>

        {/* ── Progress bar ── */}
        <Box
          flex={1}
          h="6px"
          bg="rgba(255,255,255,0.12)"
          borderRadius="99px"
          overflow="hidden"
        >
          <Box
            h="100%"
            w={`${progress}%`}
            bg={isLow
              ? "linear-gradient(90deg,#ef4444,#f87171)"
              : "linear-gradient(90deg,#4263eb,#7c3aed)"
            }
            borderRadius="99px"
            transition="width 1s linear, background 0.4s"
          />
        </Box>

        {/* ── Question counter ── */}
        <Flex
          align="center"
          gap={1}
          fontSize="13px"
          fontWeight={600}
          color="whiteAlpha.800"
          whiteSpace="nowrap"
          flexShrink={0}
        >
          <Text>Question</Text>
          <Text>{currQuestion + 1} of {questions.length}</Text>
        </Flex>

        {/* ── Timer pill (handles its own countdown + navigation) ── */}
        <QuizTimer />

      </Flex>
    </Box>
  );
};

export default Navbar;