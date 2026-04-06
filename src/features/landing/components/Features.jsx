import { Box, Flex, Text, SimpleGrid, Badge } from "@chakra-ui/react";
import { FaRocket, FaBrain, FaGlobe, FaLightbulb } from "react-icons/fa";

const features = [
  {
    icon: FaRocket,
    color: "#4a9eff",
    title: "Fast-Track Your Learning",
    desc: "Engaging quizzes and practical challenges that accelerate your journey from beginner to confident data professional.",
  },
  {
    icon: FaBrain,
    color: "#b388ff",
    title: "Beyond Tools — Real Thinking",
    desc: "We help you master concepts, critical reasoning, and problem-solving — not just software buttons.",
  },
  {
    icon: FaGlobe,
    color: "#69f0ae",
    title: "Learn From Anywhere",
    desc: "Accessible to students, analysts, and aspiring data scientists across the world at your own pace.",
  },
  {
    icon: FaLightbulb,
    color: "#ffd740",
    title: "Smart Feedback & Guidance",
    desc: "Actionable insights on your progress so you always know what to improve and why.",
  },
];

const Features = () => {
  return (
    <Box
      id="features"
      bg="#0a0f23"
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
          ✦ Why DataEre
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
          Why Choose{" "}
          <Text
            as="span"
            bgGradient="linear(135deg, #304ecf, #4a9eff)"
            bgClip="text"
          >
            DataEre?
          </Text>
        </Text>

        <Text
          fontSize={{ base: "0.95rem", md: "1.1rem" }}
          color="rgba(255,255,255,0.6)"
          maxW="500px"
          lineHeight="1.8"
        >
          Building a smarter way to learn data — for everyone, everywhere.
        </Text>
      </Flex>

      <SimpleGrid
        columns={{ base: 1, sm: 2 }}
        spacing={{ base: "1rem", md: "1.5rem" }}
        maxW="1000px"
        mx="auto"
      >
        {features.map((f) => (
          <Box
            key={f.title}
            bg="rgba(19, 44, 207, 0.06)"
            border="1px solid rgba(74, 158, 255, 0.12)"
            borderRadius="16px"
            p={{ base: "1.5rem", md: "2rem" }}
            transition="all 0.3s"
            _hover={{
              border: "1px solid rgba(74, 158, 255, 0.35)",
              bg: "rgba(19, 44, 207, 0.12)",
              transform: "translateY(-4px)",
              boxShadow: "0 12px 30px rgba(19, 44, 207, 0.15)",
            }}
          >
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w="48px"
              h="48px"
              borderRadius="12px"
              bg={`${f.color}18`}
              mb="1.2rem"
            >
              <f.icon size={22} color={f.color} />
            </Box>

            <Text
              fontSize={{ base: "1rem", md: "1.1rem" }}
              fontWeight="700"
              color="white"
              mb="0.6rem"
            >
              {f.title}
            </Text>
            <Text
              fontSize={{ base: "0.88rem", md: "0.92rem" }}
              color="rgba(255,255,255,0.6)"
              lineHeight="1.7"
            >
              {f.desc}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Features;