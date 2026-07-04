import { keyframes } from "@emotion/react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { Box, Text, Flex } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";

import { QuizContext } from "../../../shared/contexts/Contexts";
import Navbar from "../../../shared/components/Navbar"; 
import Sidebar from "../../../shared/components/Sidebar";
import SoloPlay from "../components/SoloPlay";



const dotBounce = keyframes`
  0%, 80%, 100% { transform: scale(1);             opacity: 0.5; }
  40%           { transform: scale(1.7) translateY(-5px); opacity: 1; }
`;

const pulseFade = keyframes`
  0%, 100% { opacity: 0.45; }
  50%      { opacity: 1;    }
`;

const QuickPlay = () => {
  const { 
    isLoading,
  } = useContext(QuizContext);

  return isLoading ? (
    <Box
      className="question-page"
      sx={{
        minH: '100vh',
        bgColor: '#f0f4ff',
        color: '#111827',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDir: 'column',
        position: 'relative',
      }}
    >
      <Flex direction="column" align="center" gap={4}>
        <Text
          fontFamily="'Sora', sans-serif"
          fontSize="13px"
          fontWeight={800}
          letterSpacing="0.08em"
          textTransform="uppercase"
          color="#3b6ef0"
          animation={`${pulseFade} 1.6s ease-in-out infinite`}
        >
          Please wait
        </Text>

        <Flex gap="6px">
          {[0, 0.2, 0.4].map((d, i) => (
            <Box
              key={i}
              w="8px" h="8px" borderRadius="full" bg="#3b6ef0"
              animation={`${dotBounce} 1.3s ease-in-out infinite ${d}s`}
            />
          ))}
        </Flex>

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
      </Flex>
    </Box>
  ) : (
    <Box sx={{
      minH: '100vh',
      bgColor: '#fff',
      color: '#000'
    }}>
      <Box>
        <Sidebar />

          <Box className="main" sx={{
            maxW: '600px',
            m: '0 auto'
          }}>
            <Navbar />
            <SoloPlay />
        </Box>
      </Box>
    </Box>
  )
}

export default QuickPlay