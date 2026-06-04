import { useNavigate } from "react-router-dom";
import { Box, Flex, VStack, HStack, Text, Button } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const slideUp = keyframes`
  from { opacity:0; transform:translateY(30px) scale(0.97); }
  to   { opacity:1; transform:translateY(0)    scale(1);    }
`;

/**
 * DailyResult
 * Props:
 *   correctCount  {number}
 *   wrongCount    {number}
 *   totalQuestions {number}
 *   onPlayAgain   {function}  — called when "Play Again" is clicked
 */
export default function DailyResult({ correctCount, wrongCount, totalQuestions, onPlayAgain }) {
  const skipped = totalQuestions - correctCount - wrongCount;
  const pct     = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const navigate = useNavigate()

  const grade =
    pct >= 80 ? { label: "Excellent 🏆", bg: "#ecfdf5", color: "#059669", border: "#6ee7b7" } :
    pct >= 50 ? { label: "Good Work 👍", bg: "#fef9ee", color: "#b45309", border: "#fcd34d" } :
    { label: "Keep Going 💪", bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" };

  return (
    <Box
      minH="100vh" bg="#f8fafc"
      display="flex" flexDirection="column"
      alignItems="center" justifyContent="center"
      px={4}
    >
      <Box
        bg="white" borderRadius="20px"
        p={{ base: "28px 20px", md: "40px 48px" }}
        maxW="520px" w="100%"
        boxShadow="0 4px 32px rgba(15,27,53,0.10)"
        textAlign="center"
        animation={`${slideUp} 0.45s cubic-bezier(0.34,1.3,0.64,1) both`}
      >
        <Text fontWeight={700} fontSize="22px" color="#0f1b35" mb={1}>
          Daily Challenge Complete
        </Text>
        <Text fontSize="14px" color="#64748b" mb={8}>Here's how you did today</Text>

        {/* Stats row */}
        <HStack justify="center" spacing={{ base: 4, md: 10 }} mb={6} flexWrap="wrap">
          <VStack spacing={0}>
            <Text fontSize="32px" fontWeight={800} color="#4263eb">{correctCount}</Text>
            <Text fontSize="12px" color="#64748b" fontWeight={600}>Correct</Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize="32px" fontWeight={800} color="#dc2626">{wrongCount}</Text>
            <Text fontSize="12px" color="#64748b" fontWeight={600}>Wrong</Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize="32px" fontWeight={800} color="#94a3b8">{skipped}</Text>
            <Text fontSize="12px" color="#64748b" fontWeight={600}>Skipped</Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize="32px" fontWeight={800} color="#0f1b35">{pct}%</Text>
            <Text fontSize="12px" color="#64748b" fontWeight={600}>Accuracy</Text>
          </VStack>
        </HStack>

        {/* Grade badge */}
        <Flex
          align="center" justify="center"
          bg={grade.bg} border="1.5px solid" borderColor={grade.border}
          borderRadius="full" px={5} py={2} mb={8} display="inline-flex"
        >
          <Text fontSize="14px" fontWeight={700} color={grade.color}>
            {grade.label}
          </Text>
        </Flex>

        {/* XP earned */}
        <Box
          bg="#eef2ff" borderRadius="14px" p="14px 20px" mb={7}
          border="1.5px solid #c7d2fe"
        >
          <Text fontSize="13px" color="#4263eb" fontWeight={700} mb={1}>
            ⚡ XP Earned Today
          </Text>
          <Text fontSize="28px" fontWeight={800} color="#0f1b35">
            +{correctCount} XP
          </Text>
        </Box>

        <Button
          w="full" size="lg" borderRadius="12px"
          bgGradient="linear(to-r,#4263eb,#3b5bdb)"
          color="white" fontWeight={700}
          boxShadow="0 4px 14px rgba(66,99,235,0.4)"
          _hover={{ boxShadow: "0 8px 22px rgba(66,99,235,0.55)", transform: "translateY(-2px)" }}
          _active={{ transform: "scale(0.97)" }}
          transition="all 0.22s"

          onClick={() => navigate("/users/profile")}
        >
          Come Back Tomorrow
        </Button>
      </Box>
    </Box>
  );
}