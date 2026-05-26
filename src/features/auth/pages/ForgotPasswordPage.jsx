import {
  Box,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { LuMail } from "react-icons/lu";
import { useState, useEffect } from "react";
import { showToast } from "../../../util/toastUtil";
import { useNavigate } from "react-router-dom";

// import { forgotPassword } from "../../../util/api";

const C = {
  bg:      "#f0f4ff",
  card:    "#ffffff",
  accent:  "#3b6ef0",
  accent2: "#2251cc",
  accent3: "#6b96f5",
  text:    "#111827",
  muted:   "#4b5563",
  dim:     "#9ca3af",
  border:  "rgba(59,110,240,0.18)",
};

const inputSx = {
  bg: "#f8faff",
  border: `1px solid ${C.border}`,
  borderRadius: "12px",
  color: C.text,
  fontSize: "0.92rem",
  fontFamily: "'DM Sans', sans-serif",
  _placeholder: { color: C.dim },
  _hover: { borderColor: "rgba(59,110,240,0.40)", bg: "#f3f7ff" },
  _focus: {
    borderColor: C.accent,
    bg: "#fff",
    boxShadow: "0 0 0 3px rgba(59,110,240,0.12)",
  },
};

const Orbs = () => (
  <>
    <Box position="absolute" top="-80px" left="-80px" w="360px" h="360px" borderRadius="full"
      bg="radial-gradient(circle, rgba(59,110,240,0.10) 0%, transparent 70%)"
      style={{ animation: "floatA 8s ease-in-out infinite" }} pointerEvents="none" />
    <Box position="absolute" bottom="-60px" right="-60px" w="300px" h="300px" borderRadius="full"
      bg="radial-gradient(circle, rgba(107,150,245,0.12) 0%, transparent 70%)"
      style={{ animation: "floatB 10s ease-in-out infinite" }} pointerEvents="none" />
    <Box position="absolute" top="40%" left="60%" w="200px" h="200px" borderRadius="full"
      bg="radial-gradient(circle, rgba(124,92,252,0.07) 0%, transparent 70%)"
      style={{ animation: "floatA 12s ease-in-out infinite reverse" }} pointerEvents="none" />
  </>
);

const GridBg = () => (
  <Box position="absolute" inset={0} pointerEvents="none" zIndex={0}
    sx={{
      backgroundImage: `radial-gradient(circle, rgba(59,110,240,0.12) 1px, transparent 1px)`,
      backgroundSize: "32px 32px",
      maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
    }} />
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const forgot_password_handler = async () => {
    if (loading) return;

    if (!email) {
      showToast(toast, "warning", "Email is required");
      return;
    }

    setLoading(true);

    try {
      // const res = await forgotPassword(email);

      if (res.success) {
        showToast(toast, "success", "Password reset link sent to your email 📩");
        setTimeout(() => {
          navigate("/users/login");
        }, 1200);
      } else {
        showToast(toast, "error", res.message || "Unable to process request");
      }
    } catch (err) {
      showToast(toast, "error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const anim = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.55s ease ${delay}ms, 
    transform 0.55s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
  });

  return (
    <Box minH="100vh" bg={C.bg} display="flex" alignItems="center" justifyContent="center"
      px="1.5rem" py="2rem" position="relative" overflow="hidden"
      fontFamily="'DM Sans', sans-serif">

      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0) scale(1)} 
        50%{transform:translateY(-18px) scale(1.04)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) scale(1)} 
        50%{transform:translateY(14px) scale(0.97)} }

        @keyframes shimmerText {
          0%{background-position:200% center}
          100%{background-position:-200% center}
        }

        @keyframes pulseRing {
          0%,100%{box-shadow:0 0 0 0 rgba(59,110,240,0.18)}
          50%{box-shadow:0 0 0 8px rgba(59,110,240,0)}
        }
          
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <GridBg />
      <Orbs />

      {/* Decorative spinning rings */}
      <Box position="absolute" top="12%" right="8%"
        w="90px" h="90px" borderRadius="full"
        border="1.5px dashed rgba(59,110,240,0.20)"
        style={{ animation: "spinSlow 18s linear infinite" }} pointerEvents="none" />
      <Box position="absolute" bottom="15%" left="6%"
        w="60px" h="60px" borderRadius="full"
        border="1.5px dashed rgba(107,150,245,0.18)"
        style={{ animation: "spinSlow 24s linear infinite reverse" }} pointerEvents="none" />

      <Box position="relative" zIndex={1} w="100%" maxW="420px">

        {/* Logo */}
        <Box textAlign="center" mb="2rem" style={anim(0)}>
          <Text fontFamily="'Sora', sans-serif" fontSize="1.8rem"
            fontWeight={900} letterSpacing="-1px" color={C.text} cursor="pointer"
            as="a" href="/">
            Data
            <Text as="span" sx={{
              background: "linear-gradient(135deg,#2251cc,#3b6ef0,#6b96f5)",
              backgroundSize: "200% auto",
              animation: "shimmerText 4s linear infinite",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Ere</Text>
          </Text>
        </Box>

        {/* Card */}
        <Box bg={C.card} borderRadius="24px"
          border="1px solid rgba(59,110,240,0.12)"
          boxShadow="0 8px 40px rgba(59,110,240,0.10), 0 2px 8px rgba(0,0,0,0.04)"
          px={{ base: "1.8rem", md: "2.4rem" }} py="2.4rem"
          position="relative" overflow="hidden"
          style={anim(80)}>

          {/* Top accent line */}
          <Box position="absolute" top={0} left="10%" right="10%" h="2px"
            bg="linear-gradient(90deg,transparent,#3b6ef0,#6b96f5,transparent)" borderRadius="full" />

          {/* Badge */}
          <Box display="inline-flex" alignItems="center" gap="6px"
            px="0.85rem" py="0.35rem" borderRadius="full"
            bg="rgba(59,110,240,0.07)" border="1px solid rgba(59,110,240,0.18)"
            mb="1.2rem">
            <Box w="5px" h="5px" borderRadius="full" bg={C.accent}
              boxShadow="0 0 6px rgba(59,110,240,0.6)"
              style={{ animation: "pulseRing 2.5s ease infinite" }} />
            <Text fontSize="0.72rem" fontWeight={700} color={C.accent}
              letterSpacing="0.08em" textTransform="uppercase" fontFamily="'Sora',sans-serif">
              Password Reset
            </Text>
          </Box>

          <Text fontFamily="'Sora', sans-serif" fontSize={{ base: "1.4rem", md: "1.6rem" }}
            fontWeight={800} color={C.text} letterSpacing="-0.5px" mb="0.3rem">
            Forgot your password?
          </Text>
          <Text fontSize="0.88rem" color={C.muted} mb="1.8rem" lineHeight={1.6}>
            Enter your email and we'll send you a reset link.
          </Text>

          {/* Email */}
          <Box mb="1.6rem" style={anim(160)}>
            <Text fontSize="0.8rem" fontWeight={600} color={C.muted} mb="0.45rem"
              letterSpacing="0.02em" fontFamily="'Sora',sans-serif">
              Email address
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none" mt="1px">
                <LuMail color={C.accent} size={15} />
              </InputLeftElement>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outline"
                type="email"
                placeholder="you@example.com"
                sx={inputSx}
              />
            </InputGroup>
          </Box>

          {/* Submit */}
          <Box as="button" onClick={forgot_password_handler} disabled={loading}
            style={anim(220)}
            sx={{
              width: "100%", py: "13px", borderRadius: "12px",
              background: loading
                ? "rgba(59,110,240,0.55)"
                : "linear-gradient(135deg, #2251cc, #3b6ef0)",
              color: "white", fontWeight: 700, fontSize: "0.95rem",
              fontFamily: "'Sora', sans-serif",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 4px 20px rgba(59,110,240,0.28)",
              transition: "all 0.22s",
              _hover: !loading && {
                background: "linear-gradient(135deg, #1a3fa8, #2251cc)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 30px rgba(59,110,240,0.38)",
              },
              _active: { transform: "translateY(0)" },
            }}>
            {loading ? <Spinner size="sm" color="white" /> : "Send Reset Link"}
          </Box>

          {/* Divider */}
          <Flex align="center" gap="0.8rem" my="1.4rem" style={anim(280)}>
            <Box flex={1} h="1px" bg="rgba(59,110,240,0.10)" />
            <Text fontSize="0.78rem" color={C.dim} fontWeight={500}>or</Text>
            <Box flex={1} h="1px" bg="rgba(59,110,240,0.10)" />
          </Flex>

          {/* Back to login */}
          <Box textAlign="center" style={anim(320)}>
            <Text fontSize="0.875rem" color={C.muted}>
              Remember your password?{" "}
              <Text as="a" href="/users/login" color={C.accent} fontWeight={700}
                _hover={{ textDecoration: "underline" }}>
                Back to login
              </Text>
            </Text>
          </Box>
        </Box>

        {/* Footer note */}
        <Box textAlign="center" mt="1.6rem" style={anim(360)}>
          <Text fontSize="0.75rem" color={C.dim}>
            By continuing, you agree to our{" "}
            <Text as="a" href="#" color={C.accent3} _hover={{ textDecoration: "underline" }}>
              Terms of Service
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;