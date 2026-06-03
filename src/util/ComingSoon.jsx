import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaRocket } from "react-icons/fa6";

const orbit = keyframes`
  from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
`;

const orbitReverse = keyframes`
  from { transform: rotate(0deg) translateX(160px) rotate(0deg); }
  to   { transform: rotate(-360deg) translateX(160px) rotate(360deg); }
`;

const orbitSlow = keyframes`
  from { transform: rotate(45deg) translateX(210px) rotate(-45deg); }
  to   { transform: rotate(405deg) translateX(210px) rotate(-405deg); }
`;

const rocketFloat = keyframes`
  0%   { transform: translateY(0px)   rotate(-30deg); }
  50%  { transform: translateY(-18px) rotate(-24deg); }
  100% { transform: translateY(0px)   rotate(-30deg); }
`;

const flameFlicker = keyframes`
  0%, 100% { transform: scaleX(1) scaleY(1);   opacity: 1; }
  33%       { transform: scaleX(0.8) scaleY(1.2); opacity: 0.85; }
  66%       { transform: scaleX(1.2) scaleY(0.9); opacity: 0.9; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 30px 6px rgba(99,102,241,0.35), 0 0 60px 12px rgba(99,102,241,0.15); }
  50%       { box-shadow: 0 0 50px 12px rgba(99,102,241,0.55), 0 0 90px 24px rgba(168,85,247,0.25); }
`;

const ringPulse = keyframes`
  0%   { transform: scale(0.9); opacity: 0.7; }
  50%  { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
`;

const textGlow = keyframes`
  0%, 100% { text-shadow: 0 0 20px rgba(168,85,247,0.4), 0 0 40px rgba(99,102,241,0.2); }
  50%       { text-shadow: 0 0 30px rgba(168,85,247,0.7), 0 0 60px rgba(99,102,241,0.4); }
`;

const dotBlink = keyframes`
  0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
  40%            { opacity: 1;   transform: scale(1.2); }
`;

const starTwinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50%       { opacity: 1;   transform: scale(1.3); }
`;

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const scanLine = keyframes`
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 0.5; }
  90%  { opacity: 0.5; }
  100% { transform: translateY(600%); opacity: 0; }
`;

// ─── Star dot 

const Star = ({ top, left, size, delay }) => (
  <Box
    position="absolute"
    top={top}
    left={left}
    w={`${size}px`}
    h={`${size}px`}
    borderRadius="full"
    bg="white"
    animation={`${starTwinkle} ${2 + Math.random() * 2}s ${delay}s ease-in-out infinite`}
  />
);

// ─── Orbit dot 

const OrbitDot = ({ color, size, anim, animDuration, delay = "0s" }) => (
  <Box
    position="absolute"
    top="50%"
    left="50%"
    w={`${size}px`}
    h={`${size}px`}
    mt={`-${size / 2}px`}
    ml={`-${size / 2}px`}
    borderRadius="full"
    bg={color}
    boxShadow={`0 0 ${size * 3}px ${size}px ${color}80`}
    animation={`${anim} ${animDuration} ${delay} linear infinite`}
  />
);

// ─── Main Component 

const ComingSoon = () => {
  const stars = [
    { top: "8%",  left: "5%",  size: 2, delay: 0 },
    { top: "15%", left: "20%", size: 1, delay: 0.4 },
    { top: "5%",  left: "40%", size: 3, delay: 0.8 },
    { top: "12%", left: "65%", size: 2, delay: 0.2 },
    { top: "7%",  left: "85%", size: 1, delay: 1.1 },
    { top: "22%", left: "92%", size: 2, delay: 0.6 },
    { top: "75%", left: "8%",  size: 2, delay: 1.4 },
    { top: "82%", left: "25%", size: 1, delay: 0.3 },
    { top: "90%", left: "55%", size: 3, delay: 0.9 },
    { top: "78%", left: "78%", size: 2, delay: 0.5 },
    { top: "88%", left: "93%", size: 1, delay: 1.3 },
    { top: "45%", left: "2%",  size: 2, delay: 0.7 },
    { top: "55%", left: "96%", size: 2, delay: 0.1 },
  ];

  return (
    <Box
      minH="100vh"
      w="full"
      bg="#07060f"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      fontFamily="'Space Grotesk', sans-serif"
    >
      {/* Starfield */}
      {stars.map((s, i) => (
        <Star key={i} {...s} />
      ))}

      {/* Scan line effect */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="2px"
        bgGradient="linear(to-r, transparent, rgba(99,102,241,0.6), transparent)"
        animation={`${scanLine} 6s 1s linear infinite`}
        pointerEvents="none"
        zIndex={1}
      />

      {/* Ambient background glow blobs */}
      <Box
        position="absolute"
        top="15%"
        left="10%"
        w="320px"
        h="320px"
        borderRadius="full"
        bg="rgba(99,102,241,0.07)"
        filter="blur(80px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="8%"
        w="280px"
        h="280px"
        borderRadius="full"
        bg="rgba(168,85,247,0.07)"
        filter="blur(80px)"
        pointerEvents="none"
      />

      {/* Main card */}
      <VStack
        spacing={10}
        position="relative"
        zIndex={2}
        align="center"
        px={6}
      >
        {/* Orbital system */}
        <Box
          position="relative"
          w="260px"
          h="260px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Orbit ring 1 */}
          <Box
            position="absolute"
            w="220px"
            h="220px"
            borderRadius="full"
            border="1px dashed rgba(99,102,241,0.25)"
            animation={`${ringPulse} 3s ease-in-out infinite`}
          />
          {/* Orbit ring 2 */}
          <Box
            position="absolute"
            w="320px"
            h="320px"
            borderRadius="full"
            border="1px dashed rgba(168,85,247,0.15)"
            animation={`${ringPulse} 4s 1s ease-in-out infinite`}
          />

          {/* Orbiting dots — ring 1 */}
          <OrbitDot
            color="#818cf8"
            size={8}
            anim={orbit}
            animDuration="4s"
          />
          <OrbitDot
            color="#a78bfa"
            size={6}
            anim={orbit}
            animDuration="4s"
            delay="2s"
          />

          {/* Orbiting dots — ring 2 */}
          <OrbitDot
            color="#c084fc"
            size={5}
            anim={orbitReverse}
            animDuration="7s"
          />
          <OrbitDot
            color="#60a5fa"
            size={4}
            anim={orbitReverse}
            animDuration="7s"
            delay="3.5s"
          />

          {/* Orbiting dot — ring 3 */}
          <OrbitDot
            color="#f472b6"
            size={5}
            anim={orbitSlow}
            animDuration="11s"
          />

          {/* Central glow disc */}
          <Box
            position="absolute"
            w="90px"
            h="90px"
            borderRadius="full"
            bg="rgba(99,102,241,0.12)"
            animation={`${glowPulse} 3s ease-in-out infinite`}
            display="flex"
            alignItems="center"
            justifyContent="center"
          />

          {/* Rocket */}
          <Box
            position="relative"
            zIndex={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            animation={`${rocketFloat} 3.5s ease-in-out infinite`}
          >
            <Box
              fontSize="52px"
              lineHeight={1}
              color="#e0e7ff"
              filter="drop-shadow(0 0 12px rgba(99,102,241,0.8)) drop-shadow(0 0 24px rgba(168,85,247,0.5))"
              transform="rotate(-30deg)"
            >
              <FaRocket />
            </Box>
            {/* Flame */}
            <Box
              mt="-6px"
              ml="-2px"
              animation={`${flameFlicker} 0.2s ease-in-out infinite`}
              transformOrigin="top center"
              transform="rotate(-30deg)"
            >
              <Box
                w="12px"
                h="20px"
                borderRadius="0 0 60% 60%"
                bgGradient="linear(to-b, #fbbf24, #f97316, #ef444400)"
                filter="blur(2px)"
              />
            </Box>
          </Box>
        </Box>

        {/* Text section */}
        <VStack
          spacing={4}
          animation={`${fadeSlideUp} 0.9s 0.3s ease-out both`}
          textAlign="center"
        >    

          {/* Headline */}
          <Text
            fontSize={["44px", "64px"]}
            fontWeight="800"
            lineHeight={1.05}
            letterSpacing="-0.03em"
            bgGradient="linear(135deg, #e0e7ff, #a78bfa, #818cf8)"
            bgClip="text"
            color="transparent"
            animation={`${textGlow} 3s ease-in-out infinite`}
          >
            Coming Soon
          </Text>

          {/* Subtitle */}
          <Text
            fontSize={["14px", "16px"]}
            color="rgba(148,163,184,0.8)"
            maxW="380px"
            lineHeight={1.7}
          >
            Exciting new features are on the way.{" "}
            <Box as="span" color="#a78bfa">
              Stay tuned!
            </Box>
          </Text>
        </VStack>

        {/* Loading dots */}
        <HStack
          spacing={3}
          animation={`${fadeSlideUp} 0.9s 0.6s ease-out both`}
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              w="8px"
              h="8px"
              borderRadius="full"
              bg="#6366f1"
              animation={`${dotBlink} 1.4s ${i * 0.2}s ease-in-out infinite`}
            />
          ))}
        </HStack>

        {/* Bottom label */}
        <Text
          fontSize="12px"
          letterSpacing="0.15em"
          color="rgba(170, 195, 230, 0.5)"
          textTransform="uppercase"
          animation={`${fadeSlideUp} 0.9s 0.9s ease-out both`}
        >
          In Progress
        </Text>
      </VStack>
    </Box>
  );
};

export default ComingSoon;