import {
  Box, 
  Text, 
  Input, 
  InputGroup, 
  InputLeftElement,
  InputRightElement, 
  IconButton, 
  Spinner, 
  Flex, 
  useToast
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { LuLock } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../../shared/utils/toastUtil";
import { resetPassword } from "../../../shared/utils/api";

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

const ResetPasswordPage = () => {
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [success, setSuccess]         = useState(false);

  const { token } = useParams();
  const toast     = useToast();
  const navigate  = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const reset_handler = async () => {
    if (loading) return;
    if (!password || !confirm) {
      showToast(toast, "warning", "Both fields are required");
      return;
    }
    if (password.length < 6) {
      showToast(toast, "warning", "Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      showToast(toast, "error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/users/login"), 2500);
      } else {
        showToast(toast, "error", res.message || "Link is invalid or expired");
      }
    } catch {
      showToast(toast, "error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") reset_handler();
  };

  const strengthLabel = password.length === 0 ? "" :
    password.length < 4 ? "Weak" :
    password.length < 7 ? "Fair" : "Strong";

  const strengthColor = password.length < 4 ? "#f87171" :
    password.length < 7 ? "#f59e0b" : "#0ea874";

  const anim = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
  });

  return (
    <Box minH="100vh" bg={C.bg} display="flex" alignItems="center" justifyContent="center"
      px="1.5rem" py="2rem" position="relative" overflow="hidden"
      fontFamily="'DM Sans', sans-serif">

      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(14px) scale(0.97)} }
        @keyframes shimmerText { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pulseRing {
          0%,100%{box-shadow:0 0 0 0 rgba(59,110,240,0.18)}
          50%{box-shadow:0 0 0 8px rgba(59,110,240,0)}
        }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes checkPop {
          0%{transform:scale(0);opacity:0}
          70%{transform:scale(1.2)}
          100%{transform:scale(1);opacity:1}
        }
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
            fontWeight={900} letterSpacing="-1px" color={C.text}
            cursor="pointer" as="a" href="/">
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
          position="relative" overflow="hidden" style={anim(80)}>

          <Box position="absolute" top={0} left="10%" right="10%" h="2px"
            bg="linear-gradient(90deg,transparent,#3b6ef0,#6b96f5,transparent)" borderRadius="full" />

          {success ? (
            /* ── Success state ── */
            <Box textAlign="center" py="1rem">
              <Box
                display="inline-flex" alignItems="center" justifyContent="center"
                w="64px" h="64px" borderRadius="full"
                bg="rgba(14,168,116,0.10)" border="2px solid rgba(14,168,116,0.30)"
                mb="1.2rem"
                style={{ animation: "checkPop 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards" }}>
                <Text fontSize="1.8rem">✅</Text>
              </Box>
              <Text fontFamily="'Sora', sans-serif" fontSize="1.4rem"
                fontWeight={800} color={C.text} mb="0.5rem">
                Password updated!
              </Text>
              <Text fontSize="0.88rem" color={C.muted} lineHeight={1.7} mb="1.8rem">
                Your password has been reset successfully.
                Redirecting you to login...
              </Text>
              <Box as="button" onClick={() => navigate("/users/login")}
                sx={{
                  width: "100%", py: "13px", borderRadius: "12px",
                  background: "linear-gradient(135deg, #2251cc, #3b6ef0)",
                  color: "white", fontWeight: 700, fontSize: "0.95rem",
                  fontFamily: "'Sora', sans-serif", border: "none",
                  cursor: "pointer", boxShadow: "0 4px 20px rgba(59,110,240,0.28)",
                  transition: "all 0.22s",
                  _hover: {
                    background: "linear-gradient(135deg, #1a3fa8, #2251cc)",
                    transform: "translateY(-2px)",
                  },
                }}>
                Go to login
              </Box>
            </Box>
          ) : (
            /* ── Form state ── */
            <>
              {/* Badge */}
              <Box display="inline-flex" alignItems="center" gap="6px"
                px="0.85rem" py="0.35rem" borderRadius="full"
                bg="rgba(59,110,240,0.07)" border="1px solid rgba(59,110,240,0.18)" mb="1.2rem">
                <Box w="5px" h="5px" borderRadius="full" bg={C.accent}
                  boxShadow="0 0 6px rgba(59,110,240,0.6)"
                  style={{ animation: "pulseRing 2.5s ease infinite" }} />
                <Text fontSize="0.72rem" fontWeight={700} color={C.accent}
                  letterSpacing="0.08em" textTransform="uppercase" fontFamily="'Sora',sans-serif">
                  New Password
                </Text>
              </Box>

              <Text fontFamily="'Sora', sans-serif" fontSize={{ base: "1.4rem", md: "1.6rem" }}
                fontWeight={800} color={C.text} letterSpacing="-0.5px" mb="0.3rem">
                Set a new password
              </Text>
              <Text fontSize="0.88rem" color={C.muted} mb="1.8rem" lineHeight={1.6}>
                Choose a strong password for your DataEre account.
              </Text>

              {/* New Password */}
              <Box mb="1.1rem" style={anim(160)}>
                <Text fontSize="0.8rem" fontWeight={600} color={C.muted} mb="0.45rem"
                  letterSpacing="0.02em" fontFamily="'Sora',sans-serif">
                  New password
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" mt="1px">
                    <LuLock color={C.accent} size={15} />
                  </InputLeftElement>
                  <Input value={password} variant="outline"
                    type={showPass ? "text" : "password"}
                    placeholder="At least 6 characters"
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={inputSx} />
                  <InputRightElement>
                    <IconButton size="sm" variant="ghost" onClick={() => setShowPass(!showPass)}
                      icon={showPass ? <ViewOffIcon color={C.dim} /> : <ViewIcon color={C.dim} />}
                      aria-label="Toggle password"
                      _hover={{ bg: "rgba(59,110,240,0.07)" }} />
                  </InputRightElement>
                </InputGroup>
                {/* Strength bar */}
                {password.length > 0 && (
                  <Box mt="0.5rem">
                    <Box h="3px" bg="rgba(59,110,240,0.10)" borderRadius="full" overflow="hidden">
                      <Box h="100%" borderRadius="full"
                        bg={strengthColor}
                        w={`${Math.min((password.length / 12) * 100, 100)}%`}
                        transition="width 0.35s ease, background 0.35s" />
                    </Box>
                    <Text fontSize="0.7rem" color={C.dim} mt="0.25rem">
                      {strengthLabel} password
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Confirm Password */}
              <Box mb="1.6rem" style={anim(220)}>
                <Flex justify="space-between" align="center" mb="0.45rem">
                  <Text fontSize="0.8rem" fontWeight={600} color={C.muted}
                    letterSpacing="0.02em" fontFamily="'Sora',sans-serif">
                    Confirm password
                  </Text>
                  {confirm && (
                    <Text fontSize="0.72rem" fontWeight={600}
                      color={password === confirm ? "#0ea874" : "#f87171"}>
                      {password === confirm ? "✓ Matches" : "✗ No match"}
                    </Text>
                  )}
                </Flex>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" mt="1px">
                    <LuLock color={C.accent} size={15} />
                  </InputLeftElement>
                  <Input value={confirm} variant="outline"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    onChange={(e) => setConfirm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{
                      ...inputSx,
                      borderColor: confirm
                        ? password === confirm
                          ? "rgba(14,168,116,0.50)"
                          : "rgba(248,113,113,0.50)"
                        : C.border,
                    }} />
                  <InputRightElement>
                    <IconButton size="sm" variant="ghost" onClick={() => setShowConfirm(!showConfirm)}
                      icon={showConfirm ? <ViewOffIcon color={C.dim} /> : <ViewIcon color={C.dim} />}
                      aria-label="Toggle confirm password"
                      _hover={{ bg: "rgba(59,110,240,0.07)" }} />
                  </InputRightElement>
                </InputGroup>
              </Box>

              {/* Submit */}
              <Box as="button" onClick={reset_handler} disabled={loading}
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
                {loading ? <Spinner size="sm" color="white" /> : "Reset Password"}
              </Box>

              <Flex align="center" gap="0.8rem" my="1.4rem" style={anim(320)}>
                <Box flex={1} h="1px" bg="rgba(59,110,240,0.10)" />
                <Text fontSize="0.78rem" color={C.dim} fontWeight={500}>or</Text>
                <Box flex={1} h="1px" bg="rgba(59,110,240,0.10)" />
              </Flex>

              <Box textAlign="center" style={anim(360)}>
                <Text fontSize="0.875rem" color={C.muted}>
                  Remember your password?{" "}
                  <Text as="a" href="/users/login" color={C.accent} fontWeight={700}
                    _hover={{ textDecoration: "underline" }}>
                    Back to login
                  </Text>
                </Text>
              </Box>
            </>
          )}
        </Box>

        <Box textAlign="center" mt="1.6rem" style={anim(400)}>
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

export default ResetPasswordPage;