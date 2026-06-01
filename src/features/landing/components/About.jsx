import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import { BsBarChartFill } from "react-icons/bs";
import { FaFilePdf, FaBrain, FaFileAlt } from "react-icons/fa";
import { C, useFadeIn } from "./Tokens";
import { SectionHeader } from "./Shared";
import { useRef, useEffect, useState } from "react";

/* ── keyframes injected once ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

  @keyframes about-fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes about-fadeLeft { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes about-scaleIn  { from{opacity:0;transform:scale(0.82)} to{opacity:1;transform:scale(1)} }
  @keyframes about-glowSpin {
    0%   { transform:rotate(0deg);   }
    100% { transform:rotate(360deg); }
  }
  @keyframes about-borderTrace {
    0%   { clip-path:inset(0 100% 100% 0); }
    25%  { clip-path:inset(0 0 100% 0);    }
    50%  { clip-path:inset(0 0 0 0);       }
    75%  { clip-path:inset(100% 0 0 0);    }
    100% { clip-path:inset(0 100% 100% 0); }
  }
  @keyframes about-iconFloat {
    0%,100% { transform:translateY(0) rotate(0deg);   }
    33%      { transform:translateY(-5px) rotate(3deg);  }
    66%      { transform:translateY(3px) rotate(-2deg); }
  }
  @keyframes about-numberCount {
    from { opacity:0; transform:translateY(8px) scale(0.9); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes about-lineExpand {
    from { transform:scaleX(0); }
    to   { transform:scaleX(1); }
  }
  @keyframes about-shimmerSlide {
    0%   { left:-100%; }
    100% { left:200%;  }
  }
  @keyframes about-orbPulse {
    0%,100% { transform:scale(1);   opacity:0.5; }
    50%      { transform:scale(1.15); opacity:0.8; }
  }
  @keyframes about-dotPop {
    0%,100% { transform:scale(1);   }
    50%      { transform:scale(1.6); }
  }
  @keyframes about-cardHalo {
    0%   { opacity:0; transform:scale(0.92); }
    100% { opacity:1; transform:scale(1);    }
  }

  .about-card {
    position: relative;
    background: #ffffff;
    border: 1px solid rgba(59,110,240,0.10);
    border-radius: 24px;
    padding: 36px 32px;
    overflow: hidden;
    cursor: default;
    transition: transform 0.4s cubic-bezier(0.34,1.3,0.64,1),
                box-shadow 0.4s ease,
                border-color 0.3s ease;
  }
  .about-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }
  .about-card:hover {
    transform: translateY(-10px) scale(1.01);
    box-shadow: 0 28px 60px rgba(59,110,240,0.14), 0 4px 16px rgba(59,110,240,0.08);
    border-color: rgba(59,110,240,0.28);
  }
  .about-card:hover .about-card-icon-wrap {
    animation: about-iconFloat 2.2s ease-in-out infinite;
  }
  .about-card:hover .about-shimmer-sweep {
    animation: about-shimmerSlide 0.7s ease forwards;
  }
  .about-card:hover .about-card-number {
    color: var(--card-accent);
    transform: scale(1.08);
  }
  .about-card-number {
    font-family: 'Sora', sans-serif;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9ca3af;
    transition: color 0.3s ease, transform 0.3s ease;
    display: inline-block;
    margin-bottom: 20px;
  }
  .about-card-icon-wrap {
    width: 64px; height: 64px;
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 22px;
    position: relative;
  }
  .about-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.08rem;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.3px;
    margin-bottom: 12px;
    line-height: 1.3;
  }
  .about-card-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: #4b5563;
    line-height: 1.75;
  }
  .about-shimmer-sweep {
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
    pointer-events: none;
  }
  .about-stat-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(59,110,240,0.06);
    border: 1px solid rgba(59,110,240,0.12);
    border-radius: 99px;
    padding: 7px 16px;
    transition: all 0.25s ease;
  }
  .about-stat-chip:hover {
    background: rgba(59,110,240,0.1);
    border-color: rgba(59,110,240,0.25);
    transform: translateY(-2px);
  }
`;

/* ── feature data ── */
const aboutFeatures = [
  {
    icon: BsBarChartFill,
    color: "#3b6ef0",
    bg:    "rgba(59,110,240,0.09)",
    title: "Smart Data Quizzes",
    desc:  "Tackle real-world challenges with messy datasets and ambiguous business questions. Practice cleaning data, choosing the right approach, and turning insights into recommendations; just like on the job.",
    stat:  { value: "500+", label: "Real scenarios" },
  },
  {
    icon: FaFilePdf,
    color: "#f87171",
    bg:    "rgba(248,113,113,0.1)",
    title: "PDF to CSV/XLSX Converter",
    desc:  "Instantly convert scanned reports, stakeholder documents, and messy PDFs into structured, analysis-ready Excel files. Practice one of the most frequent and painful tasks analysts face daily.",
    stat:  { value: "99%", label: "Accuracy rate" },
  },
  {
    icon: FaBrain,
    color: "#a78bfa",
    bg:    "rgba(167,139,250,0.1)",
    title: "Data Concepts Mastery",
    desc:  "Build a solid foundation in essential data terms and analytics frameworks. Our interactive lessons make complex ideas simple and practical.",
    stat:  { value: "120+", label: "Core concepts" },
  },
  {
    icon: FaFileAlt,
    color: "#34d399",
    bg:    "rgba(52,211,153,0.1)",
    title: "Instant Report Generator",
    desc:  "Turn your analysis into clear, professional reports that communicate insights effectively to stakeholders in seconds.",
    stat:  { value: "10s", label: "Generation time" },
  },
];

/* ── animated counter hook ── */
const useCounter = (target, visible, duration = 1200) => {
  const [value, setValue] = useState("0");
  useEffect(() => {
    if (!visible) return;
    const isNumeric = /^\d+/.test(target);
    if (!isNumeric) { setValue(target); return; }
    const num = parseInt(target);
    const suffix = target.replace(/^\d+/, "");
    const start = performance.now();
    const tick = (now) => {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setValue(Math.round(eased * num) + suffix);
      if (pct < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);
  return value;
};

/* ── single card ── */
const FeatureCard = ({ icon: Icon, color, bg, tag, title, desc, stat, visible, delay }) => {
  const count = useCounter(stat.value, visible, 1400);
  return (
    <Box
      className="about-card"
      style={{
        "--card-accent": color,
        opacity:    visible ? 1 : 0,
        transform:  visible ? "none" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${delay}`,
      }}
    >
      {/* shimmer on hover */}
      <Box className="about-shimmer-sweep" />

      {/* top-right glow orb */}
      <Box
        position="absolute" top="-30px" right="-30px"
        w="100px" h="100px" borderRadius="full"
        bg={`radial-gradient(circle, ${color}18, transparent 70%)`}
        style={{ animation: "about-orbPulse 3s ease-in-out infinite" }}
        pointerEvents="none"
      />

      {/* icon */}
      <Box
        className="about-card-icon-wrap"
        bg={bg} border={`1px solid ${color}28`}
        boxShadow={`0 6px 20px ${color}20`}
      >
        <Icon size={26} color={color} />
        {/* rotating ring */}
        <Box
          position="absolute" inset="-6px"
          borderRadius="22px"
          border={`1.5px dashed ${color}30`}
          style={{ animation: "about-glowSpin 8s linear infinite" }}
        />
      </Box>

      {/* title */}
      <Text className="about-card-title">{title}</Text>

      {/* desc */}
      <Text className="about-card-desc" mb="20px">{desc}</Text>

      {/* stat chip */}
      <Box className="about-stat-chip" display="inline-flex">
        <Box w="6px" h="6px" borderRadius="full" bg={color}
          style={{ animation: "about-dotPop 2s ease-in-out infinite" }} />
        <Text fontFamily="'Sora',sans-serif" fontSize="0.78rem" fontWeight={800} color={color}>
          {count}
        </Text>
        <Text fontFamily="'Sora',sans-serif" fontSize="0.73rem" fontWeight={600} color="#9ca3af">
          {stat.label}
        </Text>
      </Box>

      {/* bottom accent line */}
      <Box
        position="absolute" bottom={0} left={0} right={0} h="3px"
        bg={`linear-gradient(90deg, ${color}, ${color}40)`}
        borderRadius="0 0 24px 24px"
        transformOrigin="left"
        style={{
          transform:  visible ? "scaleX(1)" : "scaleX(0)",
          transition: `transform 0.8s cubic-bezier(0.34,1.2,0.64,1) ${delay}`,
        }}
      />
    </Box>
  );
};

/* ── section stats row ── */
const sectionStats = [
  { value: "12,000+", label: "Active analysts" },
  { value: "98%",     label: "Satisfaction rate" },
  { value: "4.9★",    label: "User rating" },
];

/* ── main component ── */
const About = () => {
  const [ref, visible] = useFadeIn();
  const hasStyle = useRef(false);

  return (
    <Box
      id="about"
      bg={C.bg1 ?? "#f8faff"}
      py={{ base: "6rem", md: "9rem" }}
      px={{ base: "1.5rem", md: "6%" }}
      position="relative"
      overflow="hidden"
    >
      {/* inject styles once */}
      {!hasStyle.current && (hasStyle.current = true) && (
        <style>{STYLES}</style>
      )}
      <style>{STYLES}</style>

      {/* ── Background decorations ── */}
      <Box
        position="absolute" top="-120px" right="-120px"
        w="480px" h="480px" borderRadius="full"
        bg="radial-gradient(circle,rgba(59,110,240,0.05),transparent 65%)"
        pointerEvents="none"
      />
      <Box
        position="absolute" bottom="-80px" left="-80px"
        w="360px" h="360px" borderRadius="full"
        bg="radial-gradient(circle,rgba(167,139,250,0.07),transparent 65%)"
        pointerEvents="none"
      />

      {/* Subtle grid overlay */}
      <Box
        position="absolute" inset={0} pointerEvents="none" opacity={0.4}
        backgroundImage={`
          linear-gradient(rgba(59,110,240,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,110,240,0.05) 1px, transparent 1px)
        `}
        backgroundSize="64px 64px"
      />

      <Box ref={ref} maxW="1100px" mx="auto" position="relative">

        {/* ── Section header ── */}
        <Box
          textAlign="center" mb={{ base: "3rem", md: "5rem" }}
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? "none" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* badge */}
          <Box
            display="inline-flex" alignItems="center" gap="8px"
            px="1rem" py="0.4rem" borderRadius="full" mb="1.4rem"
            bg="rgba(59,110,240,0.07)" border="1px solid rgba(59,110,240,0.22)"
          >
            <Box w="5px" h="5px" borderRadius="full" bg="#3b6ef0"
              style={{ animation: "about-dotPop 1.8s ease-in-out infinite" }} />
            <Text fontFamily="'Sora',sans-serif" fontSize="0.73rem" fontWeight={800}
              color="#3b6ef0" letterSpacing="0.1em" textTransform="uppercase">
              Who we are
            </Text>
          </Box>

          <Text
            as="h2" fontFamily="'Sora',sans-serif"
            fontSize={{ base: "2.2rem", md: "3rem" }}
            fontWeight={900} color="#111827"
            letterSpacing="-1.5px" lineHeight={1.1} mb="1rem"
          >
            Building a Smarter Way to{" "}
            <Text
              as="span"
              sx={{
                background: "linear-gradient(135deg,#6b96f5 0%,#3b6ef0 45%,#2251cc 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Master Data
            </Text>
          </Text>

          <Text
            fontFamily="'DM Sans',sans-serif"
            fontSize={{ base: "0.95rem", md: "1.05rem" }}
            color="#4b5563" lineHeight={1.8} maxW="560px" mx="auto"
          >
            DataEre helps aspiring and junior data analysts go beyond passive tutorials —
            with real-world quizzes, PDF-to-Excel conversion, and messy scenario challenges.
          </Text>

          {/* divider with glow */}
          <Flex align="center" justify="center" gap="12px" mt="2rem">
            <Box flex={1} maxW="80px" h="1px"
              bg="linear-gradient(90deg, transparent, rgba(59,110,240,0.3))"
              transformOrigin="right"
              style={{
                transform:  visible ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.9s ease 0.3s",
              }}
            />
            <Box w="8px" h="8px" borderRadius="full" bg="#3b6ef0"
              boxShadow="0 0 10px rgba(59,110,240,0.5)" />
            <Box flex={1} maxW="80px" h="1px"
              bg="linear-gradient(90deg, rgba(59,110,240,0.3), transparent)"
              transformOrigin="left"
              style={{
                transform:  visible ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.9s ease 0.3s",
              }}
            />
          </Flex>
        </Box>

        {/* ── Cards grid ── */}
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: "1.4rem", md: "1.8rem" }} mb="3.5rem">
          {aboutFeatures.map((f, i) => (
            <FeatureCard
              key={f.title} {...f}
              visible={visible}
              delay={`${0.08 + i * 0.12}s`}
            />
          ))}
        </SimpleGrid>

        {/* ── Bottom stats strip ── */}
        <Flex
          justify="center" gap={{ base: "1rem", md: "2rem" }}
          flexWrap="wrap"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? "none" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s",
          }}
        >
          {sectionStats.map((s, i) => (
            <Flex
              key={s.label}
              align="center" gap="10px"
              px="20px" py="12px" borderRadius="14px"
              bg="#fff" border="1px solid rgba(59,110,240,0.10)"
              boxShadow="0 2px 12px rgba(59,110,240,0.06)"
              style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "none" : "translateY(12px)",
                transition: `opacity 0.5s ease ${0.55 + i * 0.1}s, transform 0.5s ease ${0.55 + i * 0.1}s`,
              }}
            >
              <Box w="6px" h="6px" borderRadius="full" bg="#3b6ef0"
                style={{ animation: `about-dotPop 2s ease-in-out infinite ${i * 0.3}s` }} />
              <Text fontFamily="'Sora',sans-serif" fontSize="1rem" fontWeight={800}
                color="#111827" letterSpacing="-0.3px">
                {s.value}
              </Text>
              <Box w="1px" h="16px" bg="rgba(59,110,240,0.12)" />
              <Text fontFamily="'Sora',sans-serif" fontSize="0.75rem" fontWeight={600}
                color="#9ca3af" letterSpacing="0.04em">
                {s.label}
              </Text>
            </Flex>
          ))}
        </Flex>

      </Box>
    </Box>
  );
};

export default About;