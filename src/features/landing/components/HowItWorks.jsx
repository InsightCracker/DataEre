import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import { FaBook, FaLaptopCode, FaChartLine } from "react-icons/fa";
import { C, lineGrow, useFadeIn } from "./tokens";
import { SectionHeader } from "./shared";

const steps = [
  {
    number: "01",
    icon: FaBook,
    color: "#4a9eff",
    title: "Choose Your Journey",
    desc: "Pick what you want to master — Excel, SQL, Power BI, Python, or real-world projects. Start where your curiosity takes you.",
  },
  {
    number: "02",
    icon: FaLaptopCode,
    color: "#a78bfa",
    title: "Learn & Test Your Skills",
    desc: "Dive into interactive lessons, hands-on quizzes, and real-world challenges. Get instant feedback and sharpen your knowledge step by step.",
  },
  {
    number: "03",
    icon: FaChartLine,
    color: "#34d399",
    title: "Track Progress & Share",
    desc: "Monitor your performance, climb the leaderboard, and share your quiz results to showcase your skills to peers and employers.",
  },
];

const HowItWorks = () => {
  const [ref, visible] = useFadeIn();

  return (
    <Box
      id="services" bg={C.bg2}
      py={{ base: "6rem", md: "9rem" }}
      px={{ base: "1.5rem", md: "6%" }}
      position="relative" overflow="hidden"
    >
      <Box
        position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)"
        w="800px" h="800px"
        bg="radial-gradient(circle,rgba(48,78,207,0.05),transparent 60%)"
        borderRadius="full" pointerEvents="none"
      />

      <Box ref={ref} maxW="1100px" mx="auto">
        <SectionHeader
          badge="How it works"
          title="Get Started in"
          highlight="Three Steps"
          sub="Everything you need to go from beginner to confident data professional."
          visible={visible}
        />

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: "2.5rem", md: "2rem" }}>
          {steps.map((step, i) => (
            <Box
              key={step.number}
              position="relative"
              opacity={visible ? 1 : 0}
              transform={visible ? "none" : "translateY(32px)"}
              transition={`all 0.65s cubic-bezier(0.34,1.2,0.64,1) ${0.1 + i * 0.15}s`}
            >
              {/* Connector line between steps */}
              {i < 2 && (
                <Box
                  display={{ base: "none", md: "block" }}
                  position="absolute" top="36px"
                  left="calc(50% + 60px)"
                  w="calc(100% - 120px + 2rem)" h="1px"
                  bg="linear-gradient(90deg,rgba(74,158,255,0.4),rgba(74,158,255,0.1))"
                  zIndex={1}
                  sx={{
                    transformOrigin: "left",
                    animation: visible
                      ? `${lineGrow} 0.8s ease ${0.3 + i * 0.2}s both`
                      : "none",
                  }}
                />
              )}

              <Flex
                flexDir="column" align="center" textAlign="center"
                bg="rgba(255,255,255,0.025)"
                border="1px solid rgba(74,158,255,0.1)"
                borderRadius="24px"
                p={{ base: "2rem", md: "2.5rem" }}
                position="relative" overflow="hidden"
                _hover={{
                  border: "1px solid rgba(74,158,255,0.35)",
                  transform: "translateY(-6px)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                }}
                transition="all 0.3s ease"
              >
                {/* Step number badge */}
                <Flex
                  w="52px" h="52px" borderRadius="full"
                  bgGradient="linear(135deg,#304ecf,#4a9eff)"
                  align="center" justify="center"
                  boxShadow="0 6px 20px rgba(48,78,207,0.45)" mb="1.8rem"
                  fontFamily="'Cabinet Grotesk',sans-serif"
                  fontSize="0.8rem" fontWeight={900} color="white" letterSpacing="0.05em"
                >
                  {step.number}
                </Flex>

                {/* Icon */}
                <Flex
                  w="64px" h="64px" borderRadius="16px"
                  bg={`${step.color}15`} border={`1px solid ${step.color}25`}
                  align="center" justify="center" mb="1.5rem"
                >
                  <step.icon size={26} color={step.color} />
                </Flex>

                <Text
                  fontFamily="'Cabinet Grotesk',sans-serif"
                  fontSize={{ base: "1rem", md: "1.1rem" }}
                  fontWeight={800} color={step.color} mb="0.8rem" letterSpacing="-0.3px"
                >
                  {step.title}
                </Text>
                <Text
                  fontFamily="'Cabinet Grotesk',sans-serif"
                  fontSize={{ base: "0.87rem", md: "0.9rem" }}
                  color={C.muted} lineHeight={1.75}
                >
                  {step.desc}
                </Text>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default HowItWorks;