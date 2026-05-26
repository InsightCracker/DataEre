import { 
  Box, 
  Badge, 
  Flex, 
  Text, 
  Button, 
  HStack 
} from "@chakra-ui/react";

import { useEffect, useRef } from "react";

import { C, fadeUp, glowPulse, shimmer, float } from "./Tokens";

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      op: Math.random() * 0.6 + 0.1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = "rgba(59,110,240,0.07)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Connection lines
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(59,110,240,${0.10 * (1 - d / 140)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        })
      );

      // Particles
      pts.forEach((p) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,110,240,${p.op * 0.5})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const stats = ["Free to Start", "PDF → Excel Converter", "Real-Time Reports"];

  return (
    <Box
      id="hero" position="relative" minH="100vh"
      display="flex" alignItems="center" justifyContent="center"
      overflow="hidden" bg={C.bg0}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />

      {/* Ambient orbs */}
      <Box
        position="absolute" top="15%" left="10%"
        w={{ base: "280px", md: "500px" }} h={{ base: "280px", md: "500px" }}
        bg="radial-gradient(circle,rgba(59,110,240,0.06),transparent 70%)"
        borderRadius="full" pointerEvents="none"
      />
      <Box
        position="absolute" bottom="10%" right="8%"
        w={{ base: "200px", md: "380px" }} h={{ base: "200px", md: "380px" }}
        bg="radial-gradient(circle,rgba(74,158,255,0.12),transparent 70%)"
        borderRadius="full" pointerEvents="none"
      />
      <Box
        position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)"
        w={{ base: "400px", md: "700px" }} h={{ base: "400px", md: "700px" }}
        bg="radial-gradient(circle,rgba(59,110,240,0.03),transparent 65%)"
        borderRadius="full" pointerEvents="none"
      />

      {/* Content */}
      <Flex
        direction="column" align="center" textAlign="center"
        px={{ base: "1.5rem", md: "5%" }} position="relative" zIndex={1}
        maxW="960px" gap={{ base: "1.2rem", md: "1.5rem" }}
        pt={{ base: "7rem", md: "8rem" }} pb={{ base: "4rem", md: "5rem" }}
      >
        <Box animation={`${fadeUp} 0.7s ease both`}>
          <Badge
            px="1rem" py="0.4rem" borderRadius="full"
            bg="rgba(59,110,240,0.07)" border="1px solid rgba(59,110,240,0.25)"
            color={C.accent} fontSize="0.75rem" fontWeight={700}
            letterSpacing="0.08em" textTransform="uppercase"
            fontFamily="'Sora',sans-serif"
          >
            ✦ All-in-one data platform
          </Badge>
        </Box>

        <Box animation={`${fadeUp} 0.7s 0.1s ease both`} opacity={0}>
          <Text
            as="h1" fontFamily="'Sora',sans-serif"
            fontSize={{ base: "2.6rem", md: "3.6rem", lg: "4.4rem" }}
            fontWeight={900} lineHeight={1.05} color={C.text} letterSpacing="-2px"
          >
            Build World-Class{" "}
            <Text
              as="span" fontFamily="'DM Sans',sans-serif" fontStyle="italic"
              sx={{
                background: "linear-gradient(135deg,#6b96f5 0%,#3b6ef0 40%,#2251cc 100%)",
                backgroundSize: "200% auto",
                animation: `${shimmer} 4s linear infinite`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Data Skills
            </Text>
          </Text>
        </Box>

        <Box animation={`${fadeUp} 0.7s 0.2s ease both`} opacity={0} maxW="560px">
          <Text
            fontFamily="'Sora',sans-serif"
            fontSize={{ base: "1rem", md: "1.15rem" }}
            color={C.muted} lineHeight={1.8} fontWeight={400}
          >
            Practice real-world scenarios, convert messy PDFs into clean Excel files,
            and generate professional reports; all in one powerful platform built for analysts.
          </Text>
        </Box>

        <HStack
          spacing={{ base: "0.8rem", md: "1rem" }} flexWrap="wrap" justify="center"
          animation={`${fadeUp} 0.7s 0.3s ease both`} opacity={0} mt="0.5rem"
        >
          <Button
            as="a" href="/users/login"
            bgGradient="linear(135deg,#2251cc,#3b6ef0)"
            color="white" fontFamily="'Sora',sans-serif"
            fontSize="0.95rem" fontWeight={800}
            px={{ base: "1.6rem", md: "2.2rem" }} py="1.5rem"
            borderRadius="10px"
            boxShadow="0 8px 30px rgba(59,110,240,0.28)"
            animation={`${glowPulse} 3s ease infinite`}
            _hover={{ 
              transform: "translateY(-3px)", 
              boxShadow: "0 16px 40px rgba(59,110,240,0.42)" 
            }}
            transition="all 0.25s"
          >
            Start Practicing Free
          </Button>
          <Button
            as="a" href="#services"
            bg="rgba(59,110,240,0.04)" color={C.text}
            fontFamily="'Sora',sans-serif"
            fontSize="0.95rem" fontWeight={700}
            px={{ base: "1.6rem", md: "2.2rem" }} py="1.5rem"
            borderRadius="10px" border="1px solid rgba(59,110,240,0.12)"
            backdropFilter="blur(10px)"
            _hover={{ 
              bg: "rgba(59,110,240,0.06)", 
              transform: "translateY(-2px)" 
            }}
            transition="all 0.25s"
          >
            Explore Services
          </Button>
        </HStack>

        {/* Stat pills */}
        <HStack
          spacing={{ base: "0.8rem", md: "2rem" }} mt="1rem" flexWrap="wrap" justify="center"
          animation={`${fadeUp} 0.7s 0.4s ease both`} opacity={0}
        >
          {stats.map((s) => (
            <HStack key={s} spacing="0.5rem">
              <Box 
                w="5px" 
                h="5px" 
                borderRadius="full" 
                bg={C.accent} 
                boxShadow={`0 0 8px ${C.accent}`} 
              />
              <Text
                fontFamily="'Sora',sans-serif"
                fontSize="0.78rem" color={C.dim} fontWeight={600} letterSpacing="0.04em"
              >
                {s}
              </Text>
            </HStack>
          ))}
        </HStack>

        {/* Scroll hint */}
        <Box mt="2rem" animation={`${float} 2.5s ease infinite`} opacity={0.4}>
          <Flex flexDir="column" align="center" gap={1}>
            <Box w="1px" h="40px" bgGradient="linear(to-b,transparent,#3b6ef0)" />
            <Box w="6px" h="6px" borderRadius="full" bg={C.accent} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Hero;