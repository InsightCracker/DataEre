import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, 
  Text, 
  Input, 
  InputGroup, 
  useToast,
  InputLeftElement, 
  InputRightElement, 
  IconButton, 
  Spinner, 
  Flex, 
  SimpleGrid,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { LuMail, LuLock, LuUser } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { showToast } from "../../../shared/utils/toastUtil";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { registerUser } from "../../../shared/utils/api";

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

const API_BASE_URL = import.meta.env?.VITE_API_URL || "/api"

const Orbs = () => (
  <>
    <Box position="absolute" top="-100px" right="-80px" w="400px" h="400px" borderRadius="full"
      bg="radial-gradient(circle, rgba(59,110,240,0.09) 0%, transparent 70%)"
      style={{ animation: "floatA 9s ease-in-out infinite" }} pointerEvents="none" />
    <Box position="absolute" bottom="-80px" left="-60px" w="320px" h="320px" borderRadius="full"
      bg="radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)"
      style={{ animation: "floatB 11s ease-in-out infinite" }} pointerEvents="none" />
    <Box position="absolute" top="30%" right="5%" w="160px" h="160px" borderRadius="full"
      bg="radial-gradient(circle, rgba(107,150,245,0.10) 0%, transparent 70%)"
      style={{ animation: "floatA 7s ease-in-out infinite reverse" }} pointerEvents="none" />
  </>
);

const GridBg = () => (
  <Box position="absolute" inset={0} pointerEvents="none" zIndex={0}
    sx={{
      backgroundImage: `radial-gradient(circle, rgba(59,110,240,0.11) 1px, transparent 1px)`,
      backgroundSize: "32px 32px",
      maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
    }} />
);

const ProgressDots = ({ step, total }) => (
  <Flex gap="6px" justify="center" mb="1.6rem">
    {Array.from({ length: total }).map((_, i) => (
      <Box key={i} h="4px" borderRadius="full"
        bg={i < step ? C.accent : "rgba(59,110,240,0.15)"}
        w={i < step ? "24px" : "16px"}
        transition="all 0.35s ease" />
    ))}
  </Flex>
);

// Reusable social sign-up button (Google, GitHub, etc.)
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

const SignUpPage = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const filledFields = [
    firstName,
    lastName,
    email,
    password,
    passwordConfirmation,
  ].filter(Boolean).length;

  const togglePassword = () => setShow(!show);
  const { login } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const signup_handler = async () => {
    if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
      showToast(toast, "warning", "All fields are required"); return;
    }
    if (password.length < 6) {
      showToast(toast, "warning", "Password must be at least 6 characters"); return;
    }
    if (password !== passwordConfirmation) {
      showToast(toast, "warning", "Passwords do not match"); return;
    }

    // Combine first + last into a single username for the backend
    const username = `${firstName.trim()} ${lastName.trim()}`;

    setLoading(true);
    try {
      const res = await registerUser(username, email, password);
      if (res.token) {
        showToast(toast, "success", "Account created successfully 🎉");
        login(res.user, res.token);
        setTimeout(() => navigate("/users/profile"), 800);
      } else {
        showToast(toast, "error", res.message || "Registration failed. Please try again.");
      }
    } catch {
      showToast(toast, "error", "Unable to register. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const socialSignupHandler = (provider) => {
  setSocialLoading(provider);
  try {
    const redirectTo = `${window.location.origin}/users/oauth/callback`;
    const url = `${API_BASE_URL}/auth/${provider}?redirect=${encodeURIComponent(redirectTo)}`;
    window.location.href = url;
  } catch {
    showToast(toast, "error", "Unable to sign up. Please try again.");
    setSocialLoading(null);
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
      px="1.5rem" py="2.5rem" position="relative" overflow="hidden"
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
        @keyframes checkIn {
          0%{transform:scale(0) rotate(-45deg);opacity:0}
          70%{transform:scale(1.2) rotate(5deg)}
          100%{transform:scale(1) rotate(0deg);opacity:1}
        }
      `}</style>

      <GridBg />
      <Orbs />

      {/* Decorative rings */}
      <Box position="absolute" top="8%" left="5%" w="80px" h="80px" borderRadius="full"
        border="1.5px dashed rgba(59,110,240,0.18)"
        style={{ animation: "spinSlow 20s linear infinite" }} pointerEvents="none" />
      <Box position="absolute" bottom="10%" right="4%" w="55px" h="55px" borderRadius="full"
        border="1.5px dashed rgba(107,150,245,0.15)"
        style={{ animation: "spinSlow 28s linear infinite reverse" }} pointerEvents="none" />

      {/* Floating benefit badges */}
      <Box position="absolute" top="18%" left={{ base: "-150px", lg: "3%" }}
        display={{ base: "none", xl: "flex" }}
        alignItems="center" gap="8px"
        bg="white" borderRadius="12px" px="1rem" py="0.6rem"
        border="1px solid rgba(59,110,240,0.12)"
        boxShadow="0 4px 20px rgba(59,110,240,0.10)"
        style={{ animation: "floatA 6s ease-in-out infinite" }}>
        <Box w="8px" h="8px" borderRadius="full" bg="#0ea874" />
        <Text fontSize="0.78rem" fontWeight={600} color={C.muted}>Free to get started</Text>
      </Box>

      <Box position="absolute" bottom="22%" right={{ base: "-150px", lg: "3%" }}
        display={{ base: "none", xl: "flex" }}
        alignItems="center" gap="8px"
        bg="white" borderRadius="12px" px="1rem" py="0.6rem"
        border="1px solid rgba(59,110,240,0.12)"
        boxShadow="0 4px 20px rgba(59,110,240,0.10)"
        style={{ animation: "floatB 7s ease-in-out infinite" }}>
        <Box w="8px" h="8px" borderRadius="full" bg={C.accent} />
        <Text fontSize="0.78rem" fontWeight={600} color={C.muted}>Real-world practice</Text>
      </Box>

      <Box position="relative" zIndex={1} w="100%" maxW="460px">

        {/* Logo */}
        <Box textAlign="center" mb="1.8rem" style={anim(0)}>
          <Text fontFamily="'Sora', sans-serif" fontSize="1.8rem"
            fontWeight={900} letterSpacing="-1px" color={C.text}
            as="a" href="/" cursor="pointer">
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
              Get started for free
            </Text>
          </Box>

          <Text fontFamily="'Sora', sans-serif" fontSize={{ base: "1.35rem", md: "1.55rem" }}
            fontWeight={800} color={C.text} letterSpacing="-0.5px" mb="0.3rem">
            Create your DataEre account
          </Text>
          <Text fontSize="0.88rem" color={C.muted} mb="1.4rem" lineHeight={1.6}>
            Join thousands of analysts building real skills
          </Text>

          {/* Social signup options */}
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="0.7rem" mb="1.4rem" style={anim(100)}>
            <SocialButton
              icon={<FcGoogle size={18} />}
              label="Google"
              loading={socialLoading === "google"}
              onClick={() => socialSignupHandler("google")}
            />
            <SocialButton
              icon={<FaGithub size={18} color={C.text} />}
              label="GitHub"
              loading={socialLoading === "github"}
              onClick={() => socialSignupHandler("github")}
            />
          </SimpleGrid>

          {/* Divider */}
          <Flex align="center" gap="0.8rem" mb="1.4rem" style={anim(120)}>
            <Box flex={1} h="1px" bg="rgba(59,110,240,0.10)" />
            <Text fontSize="0.78rem" color={C.dim} fontWeight={500}>sign up with email</Text>
            <Box flex={1} h="1px" bg="rgba(59,110,240,0.10)" />
          </Flex>

          {/* Progress indicator */}
          <Box style={anim(140)}>
            <ProgressDots step={filledFields} total={5} />
          </Box>

          {/* First + Last name */}
          <SimpleGrid columns={2} spacing="0.8rem" mb="1rem" style={anim(160)}>
            <Box>
              <Text fontSize="0.8rem" fontWeight={600} color={C.muted} mb="0.45rem"
                letterSpacing="0.02em" fontFamily="'Sora',sans-serif">First name</Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none" mt="1px">
                  <LuUser color={C.accent} size={14} />
                </InputLeftElement>
                <Input value={firstName} variant="outline" type="text" placeholder="John"
                  onChange={(e) => setFirstName(e.target.value)} sx={inputSx} />
              </InputGroup>
            </Box>
            <Box>
              <Text fontSize="0.8rem" fontWeight={600} color={C.muted} mb="0.45rem"
                letterSpacing="0.02em" fontFamily="'Sora',sans-serif">Last name</Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none" mt="1px">
                  <LuUser color={C.accent} size={14} />
                </InputLeftElement>
                <Input value={lastName} variant="outline" type="text" placeholder="Doe"
                  onChange={(e) => setLastName(e.target.value)} sx={inputSx} />
              </InputGroup>
            </Box>
          </SimpleGrid>

          {/* Email */}
          <Box mb="1rem" style={anim(210)}>
            <Text fontSize="0.8rem" fontWeight={600} color={C.muted} mb="0.45rem"
              letterSpacing="0.02em" fontFamily="'Sora',sans-serif">Email address</Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none" mt="1px">
                <LuMail color={C.accent} size={15} />
              </InputLeftElement>
              <Input value={email} variant="outline" type="email" placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)} sx={inputSx} />
            </InputGroup>
          </Box>

          {/* Password */}
          <Box mb="1rem" style={anim(260)}>
            <Text fontSize="0.8rem" fontWeight={600} color={C.muted} mb="0.45rem"
              letterSpacing="0.02em" fontFamily="'Sora',sans-serif">Password</Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none" mt="1px">
                <LuLock color={C.accent} size={15} />
              </InputLeftElement>
              <Input value={password} variant="outline"
                type={show ? "text" : "password"} placeholder="Create a password (6+ chars)"
                onChange={(e) => setPassword(e.target.value)} sx={inputSx} />
              <InputRightElement>
                <IconButton size="sm" variant="ghost" onClick={togglePassword}
                  icon={show ? <ViewOffIcon color={C.dim} /> : <ViewIcon color={C.dim} />}
                  aria-label="Toggle password" _hover={{ bg: "rgba(59,110,240,0.07)" }} />
              </InputRightElement>
            </InputGroup>
            {/* Password strength bar */}
            {password.length > 0 && (
              <Box mt="0.5rem">
                <Box h="3px" bg="rgba(59,110,240,0.10)" borderRadius="full" overflow="hidden">
                  <Box h="100%" borderRadius="full"
                    bg={password.length < 4 ? "#f87171" : password.length < 7 ? "#f59e0b" : "#0ea874"}
                    w={`${Math.min((password.length / 12) * 100, 100)}%`}
                    transition="width 0.35s ease, background 0.35s" />
                </Box>
                <Text fontSize="0.7rem" color={C.dim} mt="0.25rem">
                  {password.length < 4 ? "Weak" : password.length < 7 ? "Fair" : "Strong"} password
                </Text>
              </Box>
            )}
          </Box>

          {/* Confirm password */}
          <Box mb="1.6rem" style={anim(310)}>
            <Flex justify="space-between" align="center" mb="0.45rem">
              <Text fontSize="0.8rem" fontWeight={600} color={C.muted}
                letterSpacing="0.02em" fontFamily="'Sora',sans-serif">Confirm password</Text>
              {passwordConfirmation && (
                <Text fontSize="0.72rem"
                  color={password === passwordConfirmation ? "#0ea874" : "#f87171"}
                  fontWeight={600}>
                  {password === passwordConfirmation ? "✓ Matches" : "✗ No match"}
                </Text>
              )}
            </Flex>
            <InputGroup>
              <InputLeftElement pointerEvents="none" mt="1px">
                <LuLock color={C.accent} size={15} />
              </InputLeftElement>
              <Input value={passwordConfirmation} variant="outline"
                type={show ? "text" : "password"} placeholder="Repeat your password"
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                sx={{
                  ...inputSx,
                  borderColor: passwordConfirmation
                    ? (password === passwordConfirmation
                      ? "rgba(14,168,116,0.50)"
                      : "rgba(248,113,113,0.50)")
                    : C.border,
                }} />
            </InputGroup>
          </Box>

          {/* Submit */}
          <Box as="button" onClick={signup_handler} disabled={loading}
            style={anim(360)}
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
            {loading ? <Spinner size="sm" color="white" /> : "Create Account"}
          </Box>

          {/* Login nudge */}
          <Box textAlign="center" mt="1.4rem" style={anim(430)}>
            <Text fontSize="0.875rem" color={C.muted}>
              Already a member?{" "}
              <Text as="a" href="/users/login" color={C.accent} fontWeight={700}
                _hover={{ textDecoration: "underline" }}>
                Log in
              </Text>
            </Text>
          </Box>
        </Box>

        {/* Footer note */}
        <Box textAlign="center" mt="1.6rem" style={anim(460)}>
          <Text fontSize="0.75rem" color={C.dim}>
            By signing up, you agree to our{" "}
            <Text as="a" href="#" color={C.accent3} _hover={{ textDecoration: "underline" }}>
              Terms of Service
            </Text>{" "}and{" "}
            <Text as="a" href="#" color={C.accent3} _hover={{ textDecoration: "underline" }}>
              Privacy Policy
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpPage;