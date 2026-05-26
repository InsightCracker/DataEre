// VsBotPlay.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../../util/Contexts";

import {
  Box, Flex, VStack, Text, Badge, Button
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRobot, FaUser } from "react-icons/fa6";

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
const botThink = keyframes`
  0%,100% { opacity:0.3; transform:scale(0.85); }
  50%     { opacity:1;   transform:scale(1.1);  }
`;

const LETTERS = ["A", "B", "C", "D"];

const difficultyConfig = {
  Beginner:     { bg:"#ecfdf5", color:"#059669" },
  Intermediate: { bg:"#fef9ee", color:"#b45309" },
  Advanced:     { bg:"#fef2f2", color:"#dc2626" },
};

// ── BotStatusBar 
const BotStatusBar = ({ botAnswer, correctKey, answerKeys, answerValues, revealed }) => {
  const botCorrect = botAnswer === correctKey;
  const botIdx     = answerKeys.indexOf(botAnswer);
  const botText    = botIdx >= 0 ? answerValues[botIdx] : "";

  return (
    <Flex
      align="center" gap={3}
      bg={
        !revealed ? "rgba(15,27,53,0.04)" :
        botCorrect ? "#ecfdf5" : "#fef2f2"
      }
      border="1.5px solid"
      borderColor={
        !revealed ? "#e2e8f0" :
        botCorrect ? "#6ee7b7" : "#fca5a5"
      }
      borderRadius="14px"
      p="12px 18px"
      maxW="680px" w="100%"
      transition="all 0.4s"
      animation={`${feedbackIn} 0.4s ease both`}
    >
      {/* Bot avatar */}
      <Flex
        w="36px" h="36px" borderRadius="full" flexShrink={0}
        align="center" justify="center"
        bg={!revealed ? "#f1f5f9" : botCorrect ? "#10b981" : "#ef4444"}
        color="white" fontSize="15px"
        transition="background 0.3s"
      >
        <FaRobot />
      </Flex>

      <Box flex={1}>
        <Text fontSize="12px" fontWeight={700} color="#64748b"
          textTransform="uppercase" letterSpacing="0.06em" mb="2px">
          Bot's Answer
        </Text>
        {!revealed ? (
          /* thinking dots */
          <Flex align="center" gap="5px" h="20px">
            {[0,1,2].map(i => (
              <Box key={i} w="7px" h="7px" borderRadius="full" bg="#4263eb"
                animation={`${botThink} 1s ease ${i * 0.2}s infinite`} />
            ))}
          </Flex>
        ) : (
          <Text fontSize="14px" fontWeight={600}
            color={botCorrect ? "#065f46" : "#991b1b"}>
            {LETTERS[botIdx] ?? "?"}.&nbsp;{botText}
            &nbsp;{botCorrect ? "✅" : "❌"}
          </Text>
        )}
      </Box>

      {revealed && (
        <Text fontSize="22px">{botCorrect ? "🤖✨" : "🤖💔"}</Text>
      )}
    </Flex>
  );
};

// ── OptionButton 
const OptionButton = ({
  label, text, index, userAnswer, botAnswer, correctKey, answerKey,
  revealed, onSelect,
}) => {
  const isUserPick   = userAnswer === answerKey;
  const isBotPick    = revealed && botAnswer === answerKey;
  const isCorrect    = revealed && answerKey === correctKey;
  const isUserWrong  = revealed && isUserPick && answerKey !== correctKey;

  const borderColor = isCorrect   ? "#10b981"
                    : isUserWrong ? "#ef4444"
                    : isUserPick  ? "#4263eb"
                    : "#e2e8f0";

  const bg = isCorrect   ? "#ecfdf5"
           : isUserWrong ? "#fef2f2"
           : isUserPick  ? "#eef2ff"
           : "white";

  const letterBg    = isCorrect   ? "#10b981"
                    : isUserWrong ? "#ef4444"
                    : isUserPick  ? "#4263eb"
                    : "#f1f5f9";

  const letterColor = (isCorrect || isUserWrong || isUserPick) ? "white" : "#64748b";

  const animation = isCorrect
    ? `${correctPop} 0.4s cubic-bezier(0.34,1.56,0.64,1) both`
    : isUserWrong
    ? `${shakeAnim} 0.4s ease both`
    : `${optionIn} 0.45s ease ${(index + 1) * 0.05}s both`;

  return (
    <Flex
      as="button"
      align="center" gap={4}
      w="100%" textAlign="left"
      bg={bg}
      border="1.5px solid" borderColor={borderColor}
      borderRadius="14px" p="14px 18px"
      cursor={revealed ? "default" : "pointer"}
      onClick={() => !revealed && onSelect(answerKey)}
      animation={animation}
      transition="all 0.22s cubic-bezier(0.34,1.3,0.64,1)"
      transform={(isCorrect || isUserWrong || isUserPick) ? "translateX(6px)" : "none"}
      boxShadow={(isUserPick || isCorrect) ? "0 4px 16px rgba(66,99,235,0.12)" : "none"}
      _hover={!revealed ? {
        borderColor:"#4263eb",
        transform:"translateX(6px)",
        boxShadow:"0 4px 16px rgba(66,99,235,0.12)",
      } : {}}
    >
      {/* Letter badge */}
      <Flex
        w="36px" h="36px" borderRadius="full" flexShrink={0}
        align="center" justify="center"
        bg={letterBg} color={letterColor}
        fontWeight={700} fontSize="14px"
        transition="all 0.2s"
      >
        {label}
      </Flex>

      <Text fontSize="15px" fontWeight={500} color="#1e293b"
        flex={1} lineHeight={1.4} textTransform="capitalize">
        {text}
      </Text>

      {/* Badges: You / Bot */}
      <Flex gap={1} flexShrink={0}>
        {isUserPick && (
          <Badge bg="#4263eb" color="white" borderRadius="20px"
            px={2} py="2px" fontSize="10px" fontWeight={700}>
            <Flex align="center" gap="3px"><FaUser size={9} /> You</Flex>
          </Badge>
        )}
        {isBotPick && (
          <Badge
            bg={isCorrect ? "#10b981" : "#ef4444"}
            color="white" borderRadius="20px"
            px={2} py="2px" fontSize="10px" fontWeight={700}>
            <Flex align="center" gap="3px"><FaRobot size={9} /> Bot</Flex>
          </Badge>
        )}
        {(isCorrect || isUserWrong) && (
          <Text fontSize="16px" ml={1}>{isCorrect ? "✅" : "❌"}</Text>
        )}
      </Flex>
    </Flex>
  );
};

// ── VsBotPlay 
const VsBotPlay = () => {
  const navigate = useNavigate();

  const {
    currQuestion, setCurrQuestion,
    setBotScore,
    questions,
    setScore,
    difficulty,
  } = useContext(QuizContext);

  const [userAnswer, setUserAnswer] = useState(null);
  const [botAnswer,  setBotAnswer]  = useState(null);
  const [revealed,   setRevealed]   = useState(false);
  const [animKey,    setAnimKey]    = useState(0);

  const q           = questions[currQuestion];
  const answerKeys  = Object.keys(q?.answers || {});
  const answerValues = answerKeys.map((k) => q.answers[k]);

  const correctKey = Object.keys(q?.correct_answers || {})
    .find((k) => q.correct_answers[k] === "true")
    ?.replace("_correct", "");

  const diff    = difficultyConfig[difficulty] ?? difficultyConfig.Beginner;
  const isLast  = currQuestion === questions.length - 1;

  // ── Bot logic ──
  const getSmartBotAnswer = () => {
    const chance = Math.random();
    const thresh = difficulty === "Beginner" ? 0.5
                 : difficulty === "Advanced" ? 0.85 : 0.7;
    if (chance < thresh) return correctKey;
    const wrong = answerKeys.filter((k) => k !== correctKey);
    return wrong[Math.floor(Math.random() * wrong.length)];
  };

  const handleUserSelect = (key) => {
    if (revealed) return;
    setUserAnswer(key);
    setBotAnswer(getSmartBotAnswer());
    setRevealed(true);
  };

  // ── Navigation ──
  const advance = () => {
    if (userAnswer === correctKey) setScore((p) => p + 1);
    if (botAnswer  === correctKey) setBotScore((p) => p + 1);
    setCurrQuestion(currQuestion + 1);
    setUserAnswer(null); setBotAnswer(null); setRevealed(false);
    setAnimKey((k) => k + 1);
  };

  const finishQuiz = () => {
    if (userAnswer === correctKey) setScore((p) => p + 1);
    if (botAnswer  === correctKey) setBotScore((p) => p + 1);
    setCurrQuestion(0);
    navigate("/quiz/results?mode=vsbot");
  };

  const userCorrect = revealed && userAnswer === correctKey;
  const userWrong   = revealed && userAnswer !== correctKey;

  return (
    <Box minH="calc(100vh - 56px)" bg="#eef0f7">
      <Flex
        key={animKey}
        flexDir="column"
        align="center"
        justify="center"
        p={{ base:5, md:8 }}
        gap={6}
        minH="calc(100vh - 56px - 72px)"
      >

        {/* ── Question card ── */}
        <Box
          bg="white" borderRadius="20px"
          p={{ base:"22px 18px", md:"32px 36px" }}
          maxW="680px" w="100%"
          boxShadow="0 4px 24px rgba(15,27,53,0.08)"
          animation={`${slideUp} 0.45s cubic-bezier(0.34,1.3,0.64,1) both`}
        >
          <Flex align="center" justify="space-between" mb={5} flexWrap="wrap" gap={2}>
            <Badge bg="#eef2ff" color="#4263eb" px={3} py={1}
              borderRadius="20px" fontSize="11px" fontWeight={700}
              textTransform="uppercase" letterSpacing="0.06em">
              🤖 VS Bot
            </Badge>
            <Badge bg={diff.bg} color={diff.color} px={3} py={1}
              borderRadius="20px" fontSize="11px" fontWeight={700}
              textTransform="uppercase" letterSpacing="0.06em">
              {difficulty ?? "Beginner"}
            </Badge>
          </Flex>
          <Text fontWeight={600} fontSize={{ base:"15px", md:"17px" }}
            color="#0f1b35" lineHeight={1.65}>
            {q.question}
          </Text>
        </Box>

        {/* ── Options ── */}
        <VStack spacing={3} maxW="680px" w="100%">
          {answerKeys.map((key, i) => (
            <OptionButton
              key={key}
              label={LETTERS[i]}
              text={answerValues[i]}
              index={i}
              answerKey={key}
              userAnswer={userAnswer}
              botAnswer={botAnswer}
              correctKey={correctKey}
              revealed={revealed}
              onSelect={handleUserSelect}
            />
          ))}
        </VStack>

        {/* ── Bot status bar ── */}
        {userAnswer && (
          <BotStatusBar
            botAnswer={botAnswer}
            correctKey={correctKey}
            answerKeys={answerKeys}
            answerValues={answerValues}
            revealed={revealed}
          />
        )}

        {/* ── User feedback banner ── */}
        {revealed && (
          <Flex
            maxW="680px" w="100%"
            borderRadius="14px" p="14px 20px"
            align="center" gap={3}
            bg={userCorrect ? "#ecfdf5" : "#fef2f2"}
            border="1.5px solid"
            borderColor={userCorrect ? "#6ee7b7" : "#fca5a5"}
            animation={`${feedbackIn} 0.35s cubic-bezier(0.34,1.56,0.64,1) both`}
          >
            <Text fontSize="20px" flexShrink={0}>{userCorrect ? "🎉" : "📖"}</Text>
            <Box flex={1}>
              <Text fontSize="14px" fontWeight={600}
                color={userCorrect ? "#065f46" : "#991b1b"}>
                {userCorrect
                  ? "Great answer! You got it right."
                  : "Not quite — check the correct answer highlighted above."}
              </Text>
              <Text fontSize="12px" mt={1} opacity={0.75}
                color={userCorrect ? "#065f46" : "#991b1b"}>
                {userCorrect
                  ? userAnswer === botAnswer
                    ? "You and the bot both got this one. 🤝"
                    : "You outsmarted the bot! 🎯"
                  : botAnswer === correctKey
                    ? "The bot got this one right. Keep going! 💪"
                    : "Both you and the bot missed this one."}
              </Text>
            </Box>
          </Flex>
        )}
      </Flex>

      {/* ── Bottom nav bar ── */}
      <Flex
        bg="#0f1b35" px={{ base:4, md:7 }} py={4}
        align="center" justify="center" gap={4}
        position="sticky" bottom={0}
      >
        {isLast ? (
          <Button
            onClick={finishQuiz}
            rightIcon={<FaRegCheckCircle />}
            bgGradient="linear(to-r,#10b981,#059669)"
            color="white" borderRadius="10px" px={8} py={6}
            fontWeight={600} fontSize="14px"
            boxShadow="0 4px 14px rgba(16,185,129,0.4)"
            isDisabled={!revealed}
            _hover={{ boxShadow:"0 8px 22px rgba(16,185,129,0.55)", transform:"translateY(-3px)" }}
            _active={{ transform:"scale(0.96)" }}
            _disabled={{ opacity:0.4, cursor:"not-allowed", transform:"none" }}
            transition="all 0.22s"
          >
            Finish
          </Button>
        ) : (
          <Button
            onClick={advance}
            rightIcon={<ArrowRightIcon />}
            bgGradient="linear(to-r,#4263eb,#3b5bdb)"
            color="white" borderRadius="10px" px={8} py={6}
            fontWeight={600} fontSize="14px"
            boxShadow="0 4px 14px rgba(66,99,235,0.4)"
            isDisabled={!revealed}
            _hover={{ boxShadow:"0 8px 22px rgba(66,99,235,0.55)", transform:"translateY(-3px)" }}
            _active={{ transform:"scale(0.96)" }}
            _disabled={{ opacity:0.4, cursor:"not-allowed", transform:"none" }}
            transition="all 0.22s"
          >
            Next
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default VsBotPlay;