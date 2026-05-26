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
        bg="radial-gradient(ellipse,rgba(59,110,240,0.10),transparent 70%)"
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
          bg="rgba(59,110,240,0.07)" border="1px solid rgba(59,110,240,0.25)"
          color={C.accent} fontSize="0.72rem" fontWeight={700}
          letterSpacing="0.08em" textTransform="uppercase"
          fontFamily="'Sora',sans-serif"
        >
          ✦ Start today. It's free
        </Badge>

        <Text
          fontFamily="'Sora',sans-serif"
          fontSize={{ base: "2.2rem", md: "3.2rem" }}
          fontWeight={900} color={C.text} letterSpacing="-1.5px" lineHeight={1.1}
        >
          Ready to Level Up Your{" "}
          <Text
            as="span" fontFamily="'DM Sans',sans-serif" fontStyle="italic"
            bgGradient="linear(135deg,#6b96f5,#3b6ef0)" bgClip="text"
          >
            Data Career?
          </Text>
        </Text>

        <Text
          fontFamily="'Sora',sans-serif"
          fontSize={{ base: "1rem", md: "1.1rem" }}
          color={C.muted} lineHeight={1.8}
        >
          Join thousands of analysts sharpening their skills on DataEre.
          No credit card required.
        </Text>

        <Button
          as="a" href="/users/login" mt="0.5rem"
          bgGradient="linear(135deg,#2251cc,#3b6ef0)"
          color="white" fontFamily="'Sora',sans-serif"
          fontSize="1rem" fontWeight={800}
          px="2.4rem" py="1.6rem" borderRadius="12px"
          boxShadow="0 8px 30px rgba(59,110,240,0.28)"
          animation={`${glowPulse} 3s ease infinite`}
          _hover={{ transform: "translateY(-3px)", boxShadow: "0 16px 40px rgba(59,110,240,0.42)" }}
          transition="all 0.25s"
        >
          Get Started Free
        </Button>
      </Flex>
    </Box>
  );
};

export default CTA;