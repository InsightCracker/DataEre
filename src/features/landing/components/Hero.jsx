import { Box, Flex, Text, Button, Badge, HStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 158, 255, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      id="hero"
      position="relative"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      bg="linear-gradient(180deg, #0a0e27 0%, #0d1234 100%)"
    >
      {/* Animated particles */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Glow orbs */}
      <Box
        position="absolute"
        top="20%"
        left="15%"
        w={{ base: "250px", md: "400px" }}
        h={{ base: "250px", md: "400px" }}
        bg="rgba(48, 78, 207, 0.15)"
        borderRadius="full"
        filter="blur(80px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="15%"
        w={{ base: "200px", md: "350px" }}
        h={{ base: "200px", md: "350px" }}
        bg="rgba(74, 158, 255, 0.1)"
        borderRadius="full"
        filter="blur(80px)"
        pointerEvents="none"
      />

      {/* Content */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: "1.5rem", md: "5%" }}
        position="relative"
        zIndex="1"
        maxW="850px"
        gap="1.5rem"
        pt={{ base: "5rem", md: "6rem" }}
        pb={{ base: "2rem", md: "3rem" }}
      >
        {/* Badge */}
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
        >
          ✦ All-in-one data platform
        </Badge>

        {/* Headline */}
        <Text
          as="h1"
          fontSize={{ base: "2.6rem", md: "4rem", lg: "4.5rem" }}
          fontWeight="800"
          lineHeight="1.15"
          color="white"
          letterSpacing="-1px"
        >
          Your Data Workflow,{" "}
          <Text
            as="span"
            bgGradient="linear(135deg, #304ecf, #4a9eff)"
            bgClip="text"
          >
            All in One Hub
          </Text>
        </Text>

        {/* Subtext */}
        <Text
          fontSize={{ base: "1rem", md: "1.2rem" }}
          color="rgba(255,255,255,0.65)"
          maxW="580px"
          lineHeight="1.7"
        >
          Engage with quizzes, convert PDFs to Excel, and generate reports —
          seamlessly.
        </Text>

        {/* Buttons */}
        <HStack spacing="1rem" flexWrap="wrap" justify="center" mt="0.5rem">
          <Button
            as="a"
            href="/users/login"
            bg="linear-gradient(135deg, #304ecf, #4a9eff)"
            color="white"
            fontWeight="700"
            fontSize="0.95rem"
            px="2rem"
            py="1.4rem"
            borderRadius="full"
            boxShadow="0 8px 25px rgba(19, 44, 207, 0.5)"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 12px 30px rgba(19, 44, 207, 0.7)",
            }}
            transition="all 0.2s"
          >
            Start Now
          </Button>
          <Button
            as="a"
            href="#services"
            bg="rgba(255,255,255,0.06)"
            color="white"
            fontWeight="600"
            fontSize="0.95rem"
            px="2rem"
            py="1.4rem"
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.15)"
            backdropFilter="blur(10px)"
            _hover={{
              bg: "rgba(255,255,255,0.1)",
              transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
          >
            Explore Services
          </Button>
        </HStack>

        {/* Stat pills */}
        <HStack
          spacing={{ base: "0.8rem", md: "1.5rem" }}
          mt="1rem"
          flexWrap="wrap"
          justify="center"
        >
          {["Interactive Quizzes", "PDF to Excel", "Real-time Reports"].map(
            (stat) => (
              <HStack key={stat} spacing="0.4rem">
                <Box w="6px" h="6px" borderRadius="full" bg="#4a9eff" />
                <Text
                  fontSize="0.8rem"
                  color="rgba(255,255,255,0.45)"
                  fontWeight="500"
                >
                  {stat}
                </Text>
              </HStack>
            ),
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Hero;
