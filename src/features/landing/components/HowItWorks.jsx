import { Box, Flex, Text, SimpleGrid, Badge } from "@chakra-ui/react";
import { FaBook, FaLaptopCode, FaChartLine } from "react-icons/fa";

const steps = [
  {
    number: "1",
    icon: FaBook,
    color: "#4a9eff",
    title: "Choose Your Quiz Journey",
    desc: "Pick what you want to master — quizzes on Excel, Power BI, Tableau, SQL, Python or real-world projects. Start where your curiosity takes you.",
  },
  {
    number: "2",
    icon: FaLaptopCode,
    color: "#b388ff",
    title: "Learn & Test Your Skills",
    desc: "Dive into interactive lessons, hands-on quizzes, and real-world challenges. Practice, get instant feedback, and sharpen your knowledge step by step.",
  },
  {
    number: "3",
    icon: FaChartLine,
    color: "#69f0ae",
    title: "Track Progress & Show Off",
    desc: "Monitor your performance, see your ranking on the leaderboard, and share your quiz results with peers or colleagues to showcase your skills.",
  },
];

const HowItWorks = () => {
  return (
    <Box
      id="services"
      bg="#0d1234"
      py={{ base: "5rem", md: "7rem" }}
      px={{ base: "1.5rem", md: "5%" }}
    >
      <Flex direction="column" align="center" textAlign="center" mb="4rem">
        <Badge
          px="1rem"
          py="0.4rem"
          borderRadius="full"
          bg="rgba(74, 158, 255, 0.1)"
          border="1px solid rgba(74, 158, 255, 0.3)"
          color="#4a9eff"
          fontSize="0.78rem"
          fontWeight="600"
          letterSpacing="0.05em"
          textTransform="none"
          mb="1.2rem"
        >
          ✦ How it works
        </Badge>

        <Text
          as="h2"
          fontSize={{ base: "2rem", md: "2.8rem" }}
          fontWeight="800"
          color="white"
          letterSpacing="-0.5px"
          mb="1rem"
          lineHeight="1.2"
        >
          Get Started in{" "}
          <Text
            as="span"
            bgGradient="linear(135deg, #304ecf, #4a9eff)"
            bgClip="text"
          >
            Three Steps
          </Text>
        </Text>

        <Text
          fontSize={{ base: "0.95rem", md: "1.1rem" }}
          color="rgba(255,255,255,0.6)"
          maxW="500px"
          lineHeight="1.8"
        >
          Everything you need to go from beginner to confident data professional.
        </Text>
      </Flex>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing={{ base: "2rem", md: "1.5rem" }}
        maxW="1100px"
        mx="auto"
      >
        {steps.map((step) => (
          <Box
            key={step.number}
            position="relative"
            bg="rgba(255,255,255,0.04)"
            border="1px solid rgba(74, 158, 255, 0.15)"
            borderRadius="20px"
            p={{ base: "2rem", md: "2.5rem" }}
            textAlign="center"
            transition="all 0.3s"
            _hover={{
              border: "1px solid rgba(74, 158, 255, 0.4)",
              transform: "translateY(-6px)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
            }}
          >
            {/* Step number bubble */}
            <Box
              position="absolute"
              top="-18px"
              left="50%"
              transform="translateX(-50%)"
              w="36px"
              h="36px"
              borderRadius="full"
              bg="linear-gradient(135deg, #304ecf, #4a9eff)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 12px rgba(19, 44, 207, 0.5)"
            >
              <Text fontSize="0.85rem" fontWeight="800" color="white">
                {step.number}
              </Text>
            </Box>

            {/* Icon */}
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w="64px"
              h="64px"
              borderRadius="16px"
              bg={`${step.color}15`}
              mb="1.5rem"
              mt="0.5rem"
            >
              <step.icon size={28} color={step.color} />
            </Box>

            <Text
              fontSize={{ base: "1rem", md: "1.1rem" }}
              fontWeight="700"
              color={step.color}
              mb="0.8rem"
            >
              {step.title}
            </Text>
            <Text
              fontSize={{ base: "0.88rem", md: "0.92rem" }}
              color="rgba(255,255,255,0.6)"
              lineHeight="1.7"
            >
              {step.desc}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HowItWorks;