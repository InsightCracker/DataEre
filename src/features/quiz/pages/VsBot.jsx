import { Box, Text, Flex } from "@chakra-ui/react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { QuizContext } from "../../../util/Contexts";
import { FaRobot, FaArrowLeft } from "react-icons/fa6";
import Navbar from "../../../util/Navbar";
import MultiBoard from "../components/MultiBoard";
import VsBotQuiz from "../components/VsBotPlay";

// ── Animations ────────────────────────────────────────────────────────────────
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const pulseFade = keyframes`
  0%, 100% { opacity: 0.45; }
  50%      { opacity: 1;    }
`;

const botBounce = keyframes`
  0%, 100% { transform: translateY(0)    scale(1);    }
  50%      { transform: translateY(-8px) scale(1.05); }
`;

const VsBot = () => {
  const {
    isLoading,
  } = useContext(QuizContext);

  return isLoading ? (
    <Box
      sx={{
        h: "100vh",
        bgColor: "#f0f4ff",
        color: "#111827",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDir: "column",
        position: "relative",
      }}
    >
      <Flex direction="column" align="center" gap={5}>
        {/* Bot avatar */}
        <Flex
          w="64px" h="64px" borderRadius="full"
          align="center" justify="center"
          bg="rgba(59,110,240,0.09)"
          border="1.5px solid rgba(59,110,240,0.25)"
          color="#3b6ef0"
          fontSize="28px"
          boxShadow="0 8px 28px rgba(59,110,240,0.18)"
          animation={`${botBounce} 1.4s ease-in-out infinite`}
        >
          <FaRobot />
        </Flex>

        {/* Spinner ring */}
        <Box
          w="48px"
          h="48px"
          borderRadius="full"
          border="4px solid rgba(59,110,240,0.12)"
          borderTopColor="#3b6ef0"
          animation={`${spin} 0.8s linear infinite`}
        />

        {/* Pulsing label */}
        <Text
          fontFamily="'Sora', sans-serif"
          fontSize="13px"
          fontWeight={800}
          letterSpacing="0.08em"
          textTransform="uppercase"
          color="#3b6ef0"
          animation={`${pulseFade} 1.6s ease-in-out infinite`}
        >
          Setting up your match...
        </Text>
      </Flex>

      {/* Home link */}
      <Box
        position="absolute"
        bottom="28px"
        left="50%"
        transform="translateX(-50%)"
      >
        <Link to="/quiz/topics">
          <Flex
            align="center" gap={2}
            px={4} py={2}
            borderRadius="10px"
            color="#6b7280"
            fontFamily="'Sora', sans-serif"
            fontSize="14px"
            fontWeight={700}
            transition="all 0.2s"
            _hover={{ color: "#3b6ef0", bg: "rgba(59,110,240,0.07)" }}
          >
            <FaArrowLeft />
            Back
          </Flex>
        </Link>
      </Box>
    </Box>
  ) : (
    <Box sx={{
        minH: '100vh',
        bgColor: '#fff',
        color: '#fff'
      }}>
        <Box sx={{
            maxW: '600px',
            m: '0 auto'
          }}>
            <Navbar />
            <MultiBoard />
            <VsBotQuiz />
        </Box>
      </Box>
  )
}

export default VsBot