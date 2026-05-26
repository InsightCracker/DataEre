// MultiBoard.jsx
import { useContext } from "react";
import { QuizContext } from "../../../util/Contexts";
import { Flex, Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaUserAstronaut, FaRobot } from "react-icons/fa6";

const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(66,99,235,0.4); }
  50%     { box-shadow: 0 0 0 8px rgba(66,99,235,0);  }
`;
const popIn = keyframes`
  from { opacity:0; transform:scale(0.8); }
  to   { opacity:1; transform:scale(1);  }
`;

const PlayerCard = ({ icon, label, score, color, bg, delay, isLeading }) => (
  <Flex
    flexDir="column" align="center" gap={3}
    bg="white"
    border="2px solid"
    borderColor={isLeading ? color : "#e2e8f0"}
    borderRadius="20px"
    p={{ base:"16px 20px", md:"20px 32px" }}
    flex={1}
    boxShadow={isLeading
      ? `0 6px 24px ${color}33`
      : "0 2px 12px rgba(15,27,53,0.06)"}
    animation={`${popIn} 0.45s cubic-bezier(0.34,1.3,0.64,1) ${delay} both`}
    transition="all 0.3s"
    position="relative"
    overflow="hidden"
  >
    {isLeading && (
      <Text position="absolute" top={2} right={3} fontSize="14px">👑</Text>
    )}

    {/* Avatar */}
    <Flex
      w={{ base:"48px", md:"60px" }}
      h={{ base:"48px", md:"60px" }}
      borderRadius="full"
      bg={bg}
      align="center" justify="center"
      fontSize={{ base:"20px", md:"26px" }}
      color={color}
      animation={isLeading ? `${pulse} 2s ease infinite` : "none"}
    >
      {icon}
    </Flex>

    <Text fontWeight={700} fontSize="13px" color="#64748b"
      textTransform="uppercase" letterSpacing="0.08em">
      {label}
    </Text>

    <Flex
      flexDir="column" align="center"
      bg={isLeading ? bg : "#f8fafc"}
      borderRadius="12px" px={5} py={3}
      w="100%"
    >
      <Text fontWeight={800} fontSize={{ base:"28px", md:"36px" }} color={color} lineHeight={1}>
        {score}
      </Text>
      <Text fontSize="12px" color="#94a3b8" mt={1}>Points</Text>
    </Flex>
  </Flex>
);

const MultiBoard = () => {
  const { score, botScore } = useContext(QuizContext);

  const userLeading = score > botScore;
  const botLeading  = botScore > score;

  return (
    <Flex
      align="center"
      justify="center"
      gap={{ base:3, md:4 }}
      px={{ base:4, md:6 }}
      py={4}
      maxW="680px"
      mx="auto"
      w="100%"
    >
      <PlayerCard
        icon={<FaUserAstronaut />}
        label="You"
        score={score}
        color="#4263eb"
        bg="#eef2ff"
        delay="0.05s"
        isLeading={userLeading}
      />

      {/* VS divider */}
      <Flex
        flexDir="column" align="center" gap={1}
        flexShrink={0}
        animation={`${popIn} 0.4s ease 0.1s both`}
      >
        <Box w="1px" h="32px" bg="#e2e8f0" />
        <Text fontWeight={800} fontSize="15px" color="#94a3b8"
          bg="white" border="1.5px solid #e2e8f0"
          borderRadius="full" w="36px" h="36px"
          display="flex" alignItems="center" justifyContent="center">
          VS
        </Text>
        <Box w="1px" h="32px" bg="#e2e8f0" />
      </Flex>

      <PlayerCard
        icon={<FaRobot />}
        label="Bot"
        score={botScore}
        color="#10b981"
        bg="#ecfdf5"
        delay="0.15s"
        isLeading={botLeading}
      />
    </Flex>
  );
};

export default MultiBoard;