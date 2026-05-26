import { Box, SimpleGrid } from "@chakra-ui/react";
import { BsBarChartFill } from "react-icons/bs";
import { FaFilePdf, FaBrain, FaFileAlt } from "react-icons/fa";
import { C, useFadeIn } from "./Tokens";
import { SectionHeader, FeatureCard } from "./Shared";

const aboutFeatures = [
  {
    icon: BsBarChartFill,
    color: "#3b6ef0",
    title: "Smart Data Quizzes",
    desc: "Tackle real-world challenges with messy datasets and ambiguous business questions. Practice cleaning data, choosing the right approach, and turning insights into recommendations; just like on the job.",
  },
  {
    icon: FaFilePdf,
    color: "#f87171",
    title: "PDF to CSV/XLSX Converter",
    desc: "Instantly convert scanned reports, stakeholder documents, and messy PDFs into structured, analysis-ready Excel files. Practice one of the most frequent and painful tasks analysts face daily.",
  },
  {
    icon: FaBrain,
    color: "#a78bfa",
    title: "Data Concepts Mastery",
    desc: "Build a solid foundation in essential data terms and analytics frameworks. Our interactive lessons make complex ideas simple and practical.",
  },
  {
    icon: FaFileAlt,
    color: "#34d399",
    title: "Instant Report Generator",
    desc: "Turn your analysis into clear, professional reports that communicate insights effectively to stakeholders in seconds.",
  },
];

const About = () => {
  const [ref, visible] = useFadeIn();

  return (
    <Box
      id="about" bg={C.bg1}
      py={{ base: "6rem", md: "9rem" }}
      px={{ base: "1.5rem", md: "6%" }}
      position="relative" overflow="hidden"
    >
      {/* Background accent */}
      <Box
        position="absolute" bottom={0} right={0} w="400px" h="400px"
        bg="radial-gradient(circle,rgba(59,110,240,0.04),transparent 70%)"
        pointerEvents="none"
      />

      <Box ref={ref} maxW="1100px" mx="auto">
        <SectionHeader
          badge="Who we are"
          title="Building a Smarter Way to"
          highlight="Master Data"
          sub="DataEre helps aspiring and junior data analysts go beyond passive tutorials, with real-world quizzes, PDF-to-Excel conversion, and messy scenario challenges."
          visible={visible}
        />
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: "1.2rem", md: "1.8rem" }}>
          {aboutFeatures.map((f, i) => (
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

export default About;