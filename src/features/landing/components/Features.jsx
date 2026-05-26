import { Box, SimpleGrid } from "@chakra-ui/react";
import { FaRocket, FaBrain, FaGlobe, FaLightbulb } from "react-icons/fa";
import { C, useFadeIn } from "./tokens";
import { SectionHeader, FeatureCard } from "./shared";

const featureItems = [
  {
    icon: FaRocket,
    color: "#3b6ef0",
    title: "Real-World Practice, Not Passive Learning",
    desc: "Engaging scenario-based quizzes with messy, realistic datasets that mirror actual analyst work; so you can move beyond tutorials and build real confidence.",
  },
  {
    icon: FaBrain,
    color: "#a78bfa",
    title: "Beyond Tools - Real Thinking",
    desc: "Go beyond clicking buttons. Develop strong analytical reasoning, decision-making, and problem-solving skills that help you handle ambiguity and deliver actionable insights.",
  },
  {
    icon: FaGlobe,
    color: "#34d399",
    title: "Built for Real Progress",
    desc: "Whether you're an aspiring analyst, career switcher, student, or junior professional. DataEre helps you learn faster, retain more, and perform better in real job situations.",
  },
  {
    icon: FaLightbulb,
    color: "#fbbf24",
    title: "Instant Feedback & Progress Tracking",
    desc: "Receive smart, actionable feedback after every challenge so you clearly understand your strengths and exactly what to improve no guessing, just growth.",
  },
];

const Features = () => {
  const [ref, visible] = useFadeIn();

  return (
    <Box
      id="features" bg={C.bg3}
      py={{ base: "6rem", md: "9rem" }}
      px={{ base: "1.5rem", md: "6%" }}
      position="relative" overflow="hidden"
    >
      {/* Top & bottom border accents */}
      <Box
        position="absolute" top={0} left={0} right={0} h="1px"
        bg="linear-gradient(90deg,transparent,rgba(59,110,240,0.20),transparent)"
      />
      <Box
        position="absolute" bottom={0} left={0} right={0} h="1px"
        bg="linear-gradient(90deg,transparent,rgba(59,110,240,0.20),transparent)"
      />

      <Box ref={ref} maxW="1100px" mx="auto">
        <SectionHeader
          badge="Why DataEre"
          title="Why Choose"
          highlight="DataEre?"
          sub="We don't just teach you tools. We train you to think and solve problems like a professional data analyst."
          visible={visible}
        />
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: "1.2rem", md: "1.8rem" }}>
          {featureItems.map((f, i) => (
            <FeatureCard
              key={f.title} {...f}
              visible={visible}
              delay={`${0.1 + i * 0.1}s`}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Features;