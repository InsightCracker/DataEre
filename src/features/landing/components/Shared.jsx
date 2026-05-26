import { Box, Badge, Text, Flex } from "@chakra-ui/react";
import { C } from "./Tokens";

// ─── SectionHeader
export const SectionHeader = ({ badge, title, highlight, sub, visible, delay = "0s" }) => (
  <Flex direction="column" align="center" textAlign="center" mb={{ base: "3rem", md: "4.5rem" }}>
    <Box
      opacity={visible ? 1 : 0}
      transform={visible ? "none" : "translateY(20px)"}
      transition={`all 0.6s ease ${delay}`}
    >
      <Badge
        px="1rem" py="0.4rem" borderRadius="full"
        bg="rgba(59,110,240,0.07)" border="1px solid rgba(59,110,240,0.25)"
        color={C.accent} fontSize="0.72rem" fontWeight={700}
        letterSpacing="0.08em" textTransform="uppercase"
        fontFamily="'Sora',sans-serif" mb="1.2rem"
      >
        ✦ {badge}
      </Badge>
    </Box>

    <Box
      opacity={visible ? 1 : 0}
      transform={visible ? "none" : "translateY(20px)"}
      transition={`all 0.6s ease calc(${delay} + 0.1s)`}
    >
      <Text
        as="h2" fontFamily="'Sora',sans-serif"
        fontSize={{ base: "2rem", md: "2.8rem", lg: "3.2rem" }}
        fontWeight={900} color={C.text} letterSpacing="-1.5px" mb="1rem" lineHeight={1.1}
      >
        {title}{" "}
        <Text
          as="span" fontFamily="'DM Sans',sans-serif" fontStyle="italic"
          bgGradient="linear(135deg,#6b96f5,#3b6ef0,#2251cc)" bgClip="text"
        >
          {highlight}
        </Text>
      </Text>
    </Box>

    {sub && (
      <Box
        opacity={visible ? 1 : 0}
        transform={visible ? "none" : "translateY(20px)"}
        transition={`all 0.6s ease calc(${delay} + 0.2s)`}
      >
        <Text
          fontFamily="'Sora',sans-serif"
          fontSize={{ base: "0.95rem", md: "1.05rem" }}
          color={C.muted} maxW="520px" lineHeight={1.8} fontWeight={400}
        >
          {sub}
        </Text>
      </Box>
    )}
  </Flex>
);

// ─── FeatureCard
export const FeatureCard = ({ icon: Icon, color, title, desc, visible, delay }) => (
  <Box
    bg="rgba(59,110,240,0.03)"
    border="1px solid rgba(59,110,240,0.08)"
    borderRadius="20px"
    p={{ base: "1.8rem", md: "2.2rem" }}
    position="relative" overflow="hidden"
    opacity={visible ? 1 : 0}
    transform={visible ? "none" : "translateY(28px)"}
    transition={`all 0.6s cubic-bezier(0.34,1.2,0.64,1) ${delay}`}
    _hover={{
      border: "1px solid rgba(59,110,240,0.35)",
      bg: "rgba(74,158,255,0.04)",
      transform: "translateY(-6px)",
      boxShadow: "0 16px 40px rgba(59,110,240,0.15)",
    }}
    sx={{
      "&::before": {
        content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg,transparent,${color},transparent)`,
        opacity: 0, transition: "opacity 0.3s",
      },
      "&:hover::before": { opacity: 1 },
    }}
  >
    <Box
      position="absolute" top="-30px" right="-30px"
      w="120px" h="120px" borderRadius="full"
      bg={`${color}10`} filter="blur(30px)" pointerEvents="none"
    />

    <Box
      display="inline-flex" alignItems="center" justifyContent="center"
      w="52px" h="52px" borderRadius="14px"
      bg={`${color}12`} border={`1px solid ${color}25`} mb="1.4rem"
    >
      <Icon size={22} color={color} />
    </Box>

    <Text
      fontFamily="'Sora',sans-serif"
      fontSize={{ base: "1rem", md: "1.1rem" }}
      fontWeight={800} color={C.text} mb="0.7rem" letterSpacing="-0.3px"
    >
      {title}
    </Text>
    <Text
      fontFamily="'Sora',sans-serif"
      fontSize={{ base: "0.87rem", md: "0.9rem" }}
      color={C.muted} lineHeight={1.75}
    >
      {desc}
    </Text>
  </Box>
);