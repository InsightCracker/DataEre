import { Box, Badge, Flex, Text, Button } from "@chakra-ui/react";
import { C, glowPulse, useFadeIn } from "./tokens";

const CTA = () => {
  const [ref, visible] = useFadeIn();

  return (
    <Box
      bg={C.bg2}
      py={{ base: "5rem", md: "8rem" }}
      px={{ base: "1.5rem", md: "6%" }}
      position="relative" overflow="hidden"
    >
      <Box
        position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)"
        w="600px" h="300px"
        bg="radial-gradient(ellipse,rgba(48,78,207,0.25),transparent 70%)"
        pointerEvents="none"
      />

      <Flex
        ref={ref}
        direction="column" align="center" textAlign="center"
        maxW="700px" mx="auto" gap="1.5rem"
        opacity={visible ? 1 : 0}
        transform={visible ? "none" : "translateY(24px)"}
        transition="all 0.7s ease"
      >
        <Badge
          px="1rem" py="0.4rem" borderRadius="full"
          bg="rgba(74,158,255,0.08)" border="1px solid rgba(74,158,255,0.25)"
          color={C.accent} fontSize="0.72rem" fontWeight={700}
          letterSpacing="0.08em" textTransform="uppercase"
          fontFamily="'Cabinet Grotesk',sans-serif"
        >
          ✦ Start today — it's free
        </Badge>

        <Text
          fontFamily="'Cabinet Grotesk',sans-serif"
          fontSize={{ base: "2.2rem", md: "3.2rem" }}
          fontWeight={900} color="white" letterSpacing="-1.5px" lineHeight={1.1}
        >
          Ready to Level Up Your{" "}
          <Text
            as="span" fontFamily="'Instrument Serif',serif" fontStyle="italic"
            bgGradient="linear(135deg,#7eb8ff,#4a9eff)" bgClip="text"
          >
            Data Career?
          </Text>
        </Text>

        <Text
          fontFamily="'Cabinet Grotesk',sans-serif"
          fontSize={{ base: "1rem", md: "1.1rem" }}
          color={C.muted} lineHeight={1.8}
        >
          Join thousands of analysts sharpening their skills on DataEre.
          No credit card required.
        </Text>

        <Button
          as="a" href="/users/login" mt="0.5rem"
          bgGradient="linear(135deg,#304ecf,#4a9eff)"
          color="white" fontFamily="'Cabinet Grotesk',sans-serif"
          fontSize="1rem" fontWeight={800}
          px="2.4rem" py="1.6rem" borderRadius="12px"
          boxShadow="0 8px 30px rgba(48,78,207,0.45)"
          animation={`${glowPulse} 3s ease infinite`}
          _hover={{ transform: "translateY(-3px)", boxShadow: "0 16px 40px rgba(48,78,207,0.65)" }}
          transition="all 0.25s"
        >
          Get Started Free →
        </Button>
      </Flex>
    </Box>
  );
};

export default CTA;