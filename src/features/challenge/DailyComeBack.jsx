import { useState, useEffect } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const slideUp = keyframes`
  from { opacity:0; transform:translateY(30px) scale(0.97); }
  to   { opacity:1; transform:translateY(0)    scale(1);    }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

// Returns ms until next midnight in local time
const msUntilMidnight = () => {
  const now       = new Date();
  const midnight  = new Date();
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return midnight - now;
};

const formatCountdown = (ms) => {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};


export default function DailyComeBack() {
  const [remaining, setRemaining] = useState(msUntilMidnight());

  // Tick every second
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(msUntilMidnight());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const isLastHour = remaining <= 60 * 60 * 1000;

  return (
    <Box
      minH="100vh" bg="#f8fafc"
      display="flex" flexDirection="column"
      alignItems="center" justifyContent="center"
      px={4}
    >
      <Box
        bg="white" borderRadius="20px"
        p={{ base: "10px 24px", md: "48px 56px" }}
        maxW="460px" w="100%"
        boxShadow="0 4px 32px rgba(15,27,53,0.10)"
        textAlign="center"
        animation={`${slideUp} 0.45s cubic-bezier(0.34,1.3,0.64,1) both`}
      >
        <Text fontSize="52px" mb={4}>🌙</Text>

        <Text fontWeight={800} fontSize="22px" color="#0f1b35" mb={2}>
          Come Back Tomorrow
        </Text>
        <Text fontSize="14px" color="#64748b" lineHeight={1.7} mb={8}>
          You've already completed today's Daily Challenge.
          A new challenge unlocks at tomorrow. Stay sharp!
        </Text>

        {/* Live countdown */}
        <Box
          bg={isLastHour ? "#fef2f2" : "#eef2ff"}
          border="1.5px solid"
          borderColor={isLastHour ? "#fca5a5" : "#c7d2fe"}
          borderRadius="16px"
          px={6} py={5} mb={6}
          animation={isLastHour ? `${pulse} 1.2s ease-in-out infinite` : "none"}
        >
          <Text
            fontSize="11px" fontWeight={700}
            color={isLastHour ? "#dc2626" : "#4263eb"}
            textTransform="uppercase" letterSpacing="0.08em" mb={2}
          >
            Next challenge in
          </Text>
          <Text
            fontSize="36px" fontWeight={800}
            color={isLastHour ? "#dc2626" : "#0f1b35"}
            letterSpacing="0.04em"
            fontFamily="monospace"
          >
            {formatCountdown(remaining)}
          </Text>
        </Box>

        {/* Motivational footer */}
        <Flex
          align="center" justify="center" gap={2}
          bg="#f8fafc" border="1.5px solid #e2e8f0"
          borderRadius="full" px={4} py={2}
          display="inline-flex"
        >
          <Text fontSize="12px" color="#64748b" fontWeight={600}>
            🔥 Keep your streak alive. Don't miss tomorrow
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}