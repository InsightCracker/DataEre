import {
  Box, 
  Text, Input, InputGroup, useToast,
  InputLeftElement, InputRightElement, IconButton, Spinner, Flex, SimpleGrid,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { LuUser, LuLock } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState, useEffect } from "react";
import { showToast } from "../../../util/toastUtil";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../util/AuthContext";
import { loginUser } from "../../../util/api";

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

// Base URL for backend OAuth redirect endpoints.
const API_BASE = import.meta.env?.VITE_API_URL || "/api";

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

// Reusable social login button (Google, GitHub, etc.)
const SocialButton = ({ icon, label, onClick, loading }) => (
  <Box as="button" type="button" onClick={onClick} disabled={loading}
    sx={{
      width: "100%",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
      py: "11px", borderRadius: "12px",
      bg: "#fff",
      border: `1px solid ${C.border}`,
      color: C.text,
      fontWeight: 600, fontSize: "0.9rem",
      fontFamily: "'DM Sans', sans-serif",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.6 : 1,
      transition: "all 0.2s ease",
      _hover: !loading && {
        borderColor: "rgba(59,110,240,0.40)",
        bg: "#f8faff",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 14px rgba(59,110,240,0.10)",
      },
      _active: { transform: "translateY(0)" },
    }}>
    {icon}
    <Text as="span">{label}</Text>
  </Box>
);

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]     = useState("");
  const [show, setShow]             = useState(false);
  const [loading, setLoading]       = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // "google" | "github" | null
  const [mounted, setMounted]       = useState(false);

  const { login } = useAuth();
  const toast     = useToast();
  const navigate  = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const login_handler = async () => {
    if (!identifier || !password) {
      showToast(toast, "warning", "Please enter your email/username and password");
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(identifier, password);
      if (res.token) {
        showToast(toast, "success", "Login successful");
        login(res.user, res.token);
        navigate("/users/profile");
      } else {
        showToast(toast, "error", res.message || "Incorrect credentials");
      }
    } catch {
      showToast(toast, "error", "Unable to login. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialLoginHandler = (provider) => {
    setSocialLoading(provider);
    try {
      const redirectTo = `${window.location.origin}/users/oauth/callback`;
      window.location.href =
        `${API_BASE}/auth/${provider}?redirect=${encodeURIComponent(redirectTo)}`;
    } catch {
      showToast(toast, "error", "Unable to start login. Please try again.");
      setSocialLoading(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login_handler();
  };

  const anim = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.55s ease ${delay}ms, 
      transform 0.55s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
  });

  return (
    <Box 
      minH="100vh" bg={C.bg} display="flex" alignItems="center" justifyContent="center"
      px="1.5rem" py="2rem" position="relative" overflow="hidden"
      fontFamily="'DM Sans', sans-serif">

      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(14px) scale(0.97)} }
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

      <Box position="absolute" top="12%" right="8%" w="90px" h="90px" borderRadius="full"
        border="1.5px dashed rgba(59,110,240,0.20)"
        style={{ animation: "spinSlow 18s linear infinite" }} pointerEvents="none" />
      <Box position="absolute" bottom="15%" left="6%" w="60px" h="60px" borderRadius="full"
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
              Welcome back
            </Text>
          </Box>

          <Text fontFamily="'Sora', sans-serif" fontSize={{ base: "1.4rem", md: "1.6rem" }}
            fontWeight={800} color={C.text} letterSpacing="-0.5px" mb="0.3rem">
            Log in to DataEre
          </Text>
          <Text fontSize="0.88rem" color={C.muted} mb="1.4rem" lineHeight={1.6}>
            Continue your data learning journey
          </Text>

          {/* Social login options */}
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="0.7rem" mb="1.4rem" style={anim(100)}>
            <SocialButton
              icon={<FcGoogle size={18} />}
              label="Google"
              loading={socialLoading === "google"}
              onClick={() => socialLoginHandler("google")}
            />
            <SocialButton
              icon={<FaGithub size={18} color={C.text} />}
              label="GitHub"
              loading={socialLoading === "github"}
              onClick={() => socialLoginHandler("github")}
            />
          </SimpleGrid>

          {/* Divider */}
          <Flex align="center" gap="0.8rem" mb="1.4rem" style={anim(120)}>
            <Box flex={1} h="1px" bg="rgba(59,110,240,0.10)" />
            <Text fontSize="0.78rem" color={C.dim} fontWeight={500}>or log in with email</Text>
            <Box flex={1} h="1px" bg="rgba(59,110,240,0.10)" />
          </Flex>

          {/* Email or Username */}
          <Box mb="1.1rem" style={anim(160)}>
            <Text fontSize="0.8rem" fontWeight={600} color={C.muted} mb="0.45rem"
              letterSpacing="0.02em" fontFamily="'Sora',sans-serif">
              Email or username
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none" mt="1px">
                <LuUser color={C.accent} size={15} />
              </InputLeftElement>
              <Input
                value={identifier}
                variant="outline"
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={inputSx}
              />
            </InputGroup>
          </Box>

          {/* Password */}
          <Box mb="1.6rem" style={anim(220)}>
            <Flex justify="space-between" align="center" mb="0.45rem">
              <Text fontSize="0.8rem" fontWeight={600} color={C.muted}
                letterSpacing="0.02em" fontFamily="'Sora',sans-serif">
                Password
              </Text>
              <Text as="a" href="/users/forgot-password"
                fontSize="0.78rem" color={C.accent} fontWeight={600}
                _hover={{ textDecoration: "underline" }}>
                Forgot password?
              </Text>
            </Flex>
            <InputGroup>
              <InputLeftElement pointerEvents="none" mt="1px">
                <LuLock color={C.accent} size={15} />
              </InputLeftElement>
              <Input
                value={password}
                variant="outline"
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={inputSx}
              />
              <InputRightElement>
                <IconButton size="sm" variant="ghost" onClick={() => setShow(!show)}
                  icon={show ? <ViewOffIcon color={C.dim} /> : <ViewIcon color={C.dim} />}
                  aria-label="Toggle password visibility"
                  _hover={{ bg: "rgba(59,110,240,0.07)" }} />
              </InputRightElement>
            </InputGroup>
          </Box>

          {/* Submit */}
          <Box as="button" onClick={login_handler} disabled={loading}
            style={anim(280)}
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
            {loading ? <Spinner size="sm" color="white" /> : "Log In"}
          </Box>

          {/* Sign up nudge */}
          <Box textAlign="center" mt="1.4rem" style={anim(380)}>
            <Text fontSize="0.875rem" color={C.muted}>
              New to DataEre?{" "}
              <Text as="a" href="/users/signup" color={C.accent} fontWeight={700}
                _hover={{ textDecoration: "underline" }}>
                Create a free account
              </Text>
            </Text>
          </Box>
        </Box>

        {/* Footer note */}
        <Box textAlign="center" mt="1.6rem" style={anim(420)}>
          <Text fontSize="0.75rem" color={C.dim}>
            By logging in, you agree to our{" "}
            <Text as="a" href="#" color={C.accent3} _hover={{ textDecoration: "underline" }}>
              Terms of Service
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;