import { Box, Text } from "@chakra-ui/react";

const ProfileLoadingSkeleton = ({ firstName, level }) => {
  return (
    <Box
      minH="100vh"
      bg="#f0f4ff"
      fontFamily="'DM Sans', sans-serif"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      <style>{`
        @keyframes orbDrift1  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(30px,20px)} }
        @keyframes orbDrift2  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-20px,-30px)} }
        @keyframes orbDrift3  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(15px,-20px)} }
        @keyframes ringPulse  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.07);opacity:0.45} }
        @keyframes trophyFloat{ 0%,100%{transform:translateY(0)}    50%{transform:translateY(-7px)} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotBounce  {
          0%,80%,100%{ transform:scale(1);                    background:#3b6ef0; }
          40%         { transform:scale(1.5) translateY(-6px); background:#6d8ff5; }
        }
        @keyframes shimmer {
          0%   { transform:translateX(-100%); }
          100% { transform:translateX(100%); }
        }
        .pf-orb { position:absolute; border-radius:50%; pointer-events:none; }
        .pf-shimmer { position:relative; overflow:hidden; background:rgba(255,255,255,0.75); }
        .pf-shimmer::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg, transparent 0%, rgba(59,110,240,0.08) 50%, transparent 100%);
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Floating orbs */}
      <Box className="pf-orb" w="340px" h="340px" bg="#3b6ef0" opacity="0.13"
        top="-90px" left="-90px" style={{ animation: "orbDrift1 7s ease-in-out infinite" }} />
      <Box className="pf-orb" w="220px" h="220px" bg="#6d8ff5" opacity="0.11"
        bottom="-50px" right="-50px" style={{ animation: "orbDrift2 9s ease-in-out infinite" }} />
      <Box className="pf-orb" w="120px" h="120px" bg="#3b6ef0" opacity="0.10"
        bottom="80px" left="80px" style={{ animation: "orbDrift3 6s ease-in-out infinite" }} />

      {/* Trophy + pulse rings */}
      <Box position="relative" w="88px" h="88px" mb="24px">
        {["-22px", "-10px", "0px"].map((inset, i) => (
          <Box key={i} position="absolute"
            top={inset} left={inset} right={inset} bottom={inset}
            borderRadius="full"
            border={`${1.5 - i * 0.4}px solid rgba(59,110,240,${0.07 + i * 0.09})`}
            style={{ animation: `ringPulse 2s ease-in-out infinite ${i * 0.35}s` }}
          />
        ))}
        <Box position="absolute" inset="0" borderRadius="full"
          bg="rgba(59,110,240,0.09)"
          display="flex" alignItems="center" justifyContent="center" fontSize="2.2rem"
          style={{ animation: "trophyFloat 3s ease-in-out infinite" }}
        >
          {level.emoji}
        </Box>
      </Box>

      {/* Title */}
      <Text fontSize="1.5rem" fontWeight={800} color="#111827" letterSpacing="-0.5px" mb="4px"
        style={{ animation: "fadeUp 0.5s ease both" }}>
        Hi 👋, {firstName}
      </Text>
      <Text fontSize="0.85rem" color="#4b5563" mb="32px" style={{ animation: "fadeUp 0.5s ease 0.08s both" }}>
        Loading your profile…
      </Text>

      <Box display="flex" gap="12px" mb="20px" w="100%" maxW="480px" px="1rem"
        style={{ animation: "fadeUp 0.5s ease 0.16s both" }}>
        {[{ label: "Daily Streak" }, { label: "Total XP" }].map((c, i) => (
          <Box key={i} className="pf-shimmer" flex="1" h="72px" borderRadius="14px" border="1px solid rgba(59,110,240,0.12)">
            <Box p="10px 14px">
              <Box w="60%" h="10px" bg="rgba(59,110,240,0.08)" borderRadius="6px" mb="8px" />
              <Box w="40%" h="18px" bg="rgba(59,110,240,0.10)" borderRadius="6px" />
            </Box>
          </Box>
        ))}
      </Box>

      <Box w="100%" maxW="480px" px="1rem" mb="20px" style={{ animation: "fadeUp 0.5s ease 0.22s both" }}>
        <Box className="pf-shimmer" h="76px" borderRadius="16px" border="1px solid rgba(59,110,240,0.12)">
          <Box p="14px 18px">
            <Box display="flex" justifyContent="space-between" mb="10px">
              <Box w="44px" h="44px" borderRadius="full" bg="rgba(59,110,240,0.08)" border="2px solid rgba(59,110,240,0.15)" />
              <Box w="60px" h="22px" bg="rgba(59,110,240,0.08)" borderRadius="99px" />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box w="100%" maxW="480px" px="1rem" mb="28px" style={{ animation: "fadeUp 0.5s ease 0.28s both" }}>
        <Box display="flex" gap="12px">
          <Box className="pf-shimmer" flex="1.3" h="110px" borderRadius="16px" border="1px solid rgba(59,110,240,0.12)" p="14px">
            <Box w="55%" h="11px" bg="rgba(59,110,240,0.09)" borderRadius="6px" mb="8px" />
            <Box w="80%" h="9px" bg="rgba(59,110,240,0.06)" borderRadius="6px" mb="16px" />
            <Box w="100%" h="32px" bg="rgba(59,110,240,0.10)" borderRadius="10px" />
          </Box>
          <Box className="pf-shimmer" flex="1" h="110px" borderRadius="16px" border="1px solid rgba(59,110,240,0.12)" p="14px">
            {[70, 55, 45, 35].map((w, i) => (
              <Box key={i} display="flex" alignItems="center" gap="8px" mb="8px">
                <Box w="18px" h="18px" borderRadius="full" bg="rgba(59,110,240,0.09)" flexShrink={0} />
                <Box flex="1" h="9px" bg="rgba(59,110,240,0.07)" borderRadius="6px" style={{ width: `${w}%` }} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box display="flex" gap="16px" style={{ animation: "fadeUp 0.5s ease 0.34s both" }}>
        {[0, 0.2, 0.4, 0.6].map((delay, i) => (
          <Box key={i} w="9px" h="9px" borderRadius="full" bg="#3b6ef0"
            style={{ animation: `dotBounce 1.2s ease-in-out infinite ${delay}s` }} />
        ))}
      </Box>
    </Box>
  );
};

export default ProfileLoadingSkeleton;