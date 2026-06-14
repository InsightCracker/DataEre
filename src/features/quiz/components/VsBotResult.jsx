import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../../util/Contexts";
import { keyframes } from "@emotion/react";

import {
  Box, Flex, Text, Button, SimpleGrid
} from "@chakra-ui/react";

import {
  FaShareNodes, FaHouse, FaTrophy,
  FaRobot, FaUserAstronaut, FaHandshake, FaSpinner,
} from "react-icons/fa6";

import Sidebar from "../../../util/Sidebar";
import BottomNav from "../../../util/BottomNav";
import QuizShareCard from "./QuizShareCard";

// ── Animations 
const popIn = keyframes`
  from { opacity:0; transform:scale(0.85); }
  to   { opacity:1; transform:scale(1);    }
`;

const slideUp = keyframes`
  from { opacity:0; transform:translateY(24px); }
  to   { opacity:1; transform:translateY(0);    }
`;

const crownBounce = keyframes`
  0%, 100% { transform:translateY(0)    rotate(0deg); }
  30%     { transform:translateY(-8px) rotate(-6deg); }
  60%     { transform:translateY(-4px) rotate(4deg);  }
`;

// ── ActionButton 
const ActionButton = ({ icon, label, onClick, gradient, delay = "0s" }) => (
  <Button
    onClick={onClick}
    w="100%" h="auto" py={4} px={5}
    display="flex" alignItems="center" justifyContent="flex-start" gap={4}
    bg={gradient ? undefined : "white"}
    bgGradient={gradient}
    color={gradient ? "white" : "#0f1b35"}
    border={gradient ? "none" : "1.5px solid #e2e8f0"}
    borderRadius="14px"
    fontWeight={600} fontSize="15px"
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
      fontSize="16px" color={gradient ? "white" : "#4263eb"}
    >
      {icon}
    </Flex>
    <Text>{label}</Text>
  </Button>
);

const VsBotResult = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const {
    score, setScore,
    botScore, setBotScore,
    refresh, setRefresh,
    setWrongAnswer,
    questions,
    setCurrQuestion,
  } = useContext(QuizContext);

  const total      = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const userWon = score > botScore;
  const botWon  = botScore > score;
  const tied    = score === botScore;

  const outcome = userWon
    ? { emoji:"🏆", icon:<FaUserAstronaut />, 
      label:"You Won!", color:"#4263eb", bg:"#eef2ff", sub:"Outstanding! You outscored the bot." 
    }
    : botWon
    ? { emoji:"🤖", icon:<FaRobot />,         
      label:"Bot Won!",  color:"#ef4444", bg:"#fef2f2", sub:"The bot got you this time. Try again!" 
    }
    : { emoji:"🤝", icon:<FaHandshake />,      
      label:"It's a Tie!", color:"#f59e0b", bg:"#fef9ee", sub:"Neck and neck - a perfect draw!" 
    };

  const retryQuiz = () => {
    setScore(0); 
    setBotScore(0); 
    setWrongAnswer(0); 
    setCurrQuestion(0); 
    setRefresh(!refresh);
    navigate("/quiz/vsbot");
  };
  const tryAnotherQuiz = () => {
    setScore(0); 
    setBotScore(0); 
    setWrongAnswer(0); 
    setCurrQuestion(0); 
    setRefresh(!refresh);
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
        bg="white" borderRadius="24px"
        p={{ base:"28px 20px", md:"40px 48px" }}
        maxW="520px" w="100%" textAlign="center"
        boxShadow="0 8px 40px rgba(15,27,53,0.1)"
        animation={`${popIn} 0.5s cubic-bezier(0.34,1.3,0.64,1) both`}
      >

        {/* ── Outcome badge ── */}
        <Text fontSize="52px" mb={2}
          animation={`${crownBounce} 1.2s ease 0.3s both`}
          display="inline-block">
          {outcome.emoji}
        </Text>
        <Text fontWeight={700} fontSize={{ base:"22px", md:"26px" }}
          color="#0f1b35" mb={2}>
          {outcome.label}
        </Text>
        <Text fontSize="14px" color="#64748b" mb={7}>{outcome.sub}</Text>

        {/* ── Score comparison ── */}
        <SimpleGrid columns={2} gap={4} mb={8}>
          {/* You */}
          <Flex flexDir="column" align="center"
            bg={userWon ? "#eef2ff" : "#f8fafc"}
            border="2px solid" borderColor={userWon ? "#4263eb" : "#e2e8f0"}
            borderRadius="16px" py={5} px={3}
            boxShadow={userWon ? "0 4px 16px rgba(66,99,235,0.15)" : "none"}
            animation={`${slideUp} 0.4s ease 0.1s both`}
            position="relative"
          >
            {userWon && (
              <Text position="absolute" top={2} right={2} fontSize="14px">👑</Text>
            )}
            <Text fontSize="22px" color="#4263eb" mb={2}><FaUserAstronaut /></Text>
            <Text fontWeight={700} fontSize="11px" color="#64748b"
              textTransform="uppercase" letterSpacing="0.08em" mb={2}>You</Text>
            <Text fontWeight={800} fontSize="36px" color="#4263eb" lineHeight={1}>{score}</Text>
            <Text fontSize="12px" color="#94a3b8" mt={1}>Points</Text>
          </Flex>

          {/* Bot */}
          <Flex flexDir="column" align="center"
            bg={botWon ? "#ecfdf5" : "#f8fafc"}
            border="2px solid" borderColor={botWon ? "#10b981" : "#e2e8f0"}
            borderRadius="16px" py={5} px={3}
            boxShadow={botWon ? "0 4px 16px rgba(16,185,129,0.15)" : "none"}
            animation={`${slideUp} 0.4s ease 0.15s both`}
            position="relative"
          >
            {botWon && (
              <Text position="absolute" top={2} right={2} fontSize="14px">👑</Text>
            )}
            <Text fontSize="22px" color="#10b981" mb={2}><FaRobot /></Text>
            <Text fontWeight={700} fontSize="11px" color="#64748b"
              textTransform="uppercase" letterSpacing="0.08em" mb={2}>Bot</Text>
            <Text fontWeight={800} fontSize="36px" color="#10b981" lineHeight={1}>{botScore}</Text>
            <Text fontSize="12px" color="#94a3b8" mt={1}>Points</Text>
          </Flex>
        </SimpleGrid>

        {/* ── Score bar comparison ── */}
        <Box mb={8}>
          <Flex justify="space-between" fontSize="12px" color="#94a3b8" mb={2}>
            <Text>You</Text>
            <Text>Bot</Text>
          </Flex>
          <Flex h="10px" borderRadius="99px" overflow="hidden" bg="#f1f5f9">
            <Box
              h="100%"
              w={`${total > 0 ? (score / total) * 100 : 0}%`}
              bg="linear-gradient(90deg,#4263eb,#7c3aed)"
              borderRadius="99px 0 0 99px"
              transition="width 0.8s ease 0.4s"
            />
            <Box
              h="100%"
              w={`${total > 0 ? (botScore / total) * 100 : 0}%`}
              bg="linear-gradient(90deg,#10b981,#059669)"
              borderRadius="0 99px 99px 0"
              transition="width 0.8s ease 0.5s"
            />
          </Flex>
          <Flex justify="space-between" fontSize="12px" color="#94a3b8" mt={2}>
            <Text>{total > 0 ? Math.round((score/total)*100) : 0}%</Text>
            <Text>{total > 0 ? Math.round((botScore/total)*100) : 0}%</Text>
          </Flex>
        </Box>

        {/* ── Actions ── */}
        <Flex flexDir="column" gap={3}>
          <ActionButton icon={<FaSpinner />} label="Retake Session" onClick={retryQuiz}        gradient="linear(to-r,#4263eb,#3b5bdb)" delay="0.05s" />
          <ActionButton icon={<FaHouse />} label="Take on New Challenge" onClick={tryAnotherQuiz} delay="0.2s" />
          <ActionButton icon={<FaTrophy />} label="View Leaderboard" onClick={() => navigate("/board")} delay="0.1s" />
          <ActionButton icon={<FaShareNodes />} label="Share Score" onClick={() => setShow(true)} delay="0.15s" />
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

export default VsBotResult;