import '../styles/auth.css'

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
} from "@chakra-ui/react";

import {
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";

import {
  LuMail,
  LuLock,
} from "react-icons/lu";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../../util/Contexts";

const LoginPage = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const togglePassword = () => setShow(!show);

  const {
    email,
    setEmail,
    password,
    setPassword,
  } = useContext(QuizContext);

  const toast = useToast();
  const navigate = useNavigate();

  const login = async () => {
    if (email === "") {
      toast({
        description: "Please enter your details",
        status: "error",
        duration: 2000,
        position: "bottom-left",
      });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // remove when wiring real API
    setLoading(false);
    navigate("/users/profile");
  };

  return (
    <Box className="login-page" id="login">

      {/* Logo */}
      <Text className="logo">
        Data<span className="dataxo">Ere</span>
      </Text>

      {/* Main card */}
      <Box className="login-card">

        <Box className="login-badge">✦ Welcome back</Box>

        <h2>Log in to DataEre</h2>
        <p className="login-subtitle">
          Don't have an account?{" "}
          <a href="/users/signup" className="login-link">Sign up free</a>
        </p>

        <div className="form">

          {/* Email */}
          <div className="field-group">
            <p className="field-label">Email address</p>
            <div className="input">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LuMail color="#4a6fa5" />
                </InputLeftElement>
                <Input
                  value={email}
                  variant="outline"
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="login-input"
                  sx={{
                    bg: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "white",
                    _placeholder: { color: "rgba(255,255,255,0.25)" },
                    _hover: { borderColor: "rgba(59,130,246,0.4)" },
                    _focus: {
                      borderColor: "rgba(59,130,246,0.7)",
                      bg: "rgba(59,130,246,0.06)",
                      boxShadow: "none",
                    },
                  }}
                />
              </InputGroup>
            </div>
          </div>

          {/* Password */}
          <div className="field-group">
            <div className="field-label-row">
              <p className="field-label">Password</p>
              <a href="/users/forgot-password" className="forgot-link">
                Forgot password?
              </a>
            </div>
            <div className="input">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LuLock color="#4a6fa5" />
                </InputLeftElement>
                <Input
                  value={password}
                  variant="outline"
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  sx={{
                    bg: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "white",
                    _placeholder: { color: "rgba(255,255,255,0.25)" },
                    _hover: { borderColor: "rgba(59,130,246,0.4)" },
                    _focus: {
                      borderColor: "rgba(59,130,246,0.7)",
                      bg: "rgba(59,130,246,0.06)",
                      boxShadow: "none",
                    },
                  }}
                />
                <InputRightElement>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    onClick={togglePassword}
                    icon={show ? <ViewOffIcon color="#4a6fa5" /> : <ViewIcon color="#4a6fa5" />}
                    aria-label="Toggle password visibility"
                    _hover={{ bg: "rgba(255,255,255,0.08)" }}
                  />
                </InputRightElement>
              </InputGroup>
            </div>
          </div>

          {/* Submit */}
          <Box
            as="button"
            className="login-btn"
            onClick={login}
            disabled={loading}
            sx={{
              width: "100%",
              mt: "8px",
              py: "13px",
              borderRadius: "50px",
              bg: loading ? "rgba(59,130,246,0.6)" : "#3b82f6",
              color: "white",
              fontWeight: 700,
              fontSize: "15px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
              _hover: !loading && {
                bg: "#2563eb",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
              },
              _active: { transform: "translateY(0)", boxShadow: "none" },
            }}
          >
            {loading ? <Spinner size="sm" color="white" /> : "Log In"}
          </Box>

          {/* Divider */}
          <Box className="login-divider">
            <Box className="divider-line" />
            <Text className="divider-text">or</Text>
            <Box className="divider-line" />
          </Box>

          {/* Sign up nudge */}
          <Box className="login-signup-row">
            <Text>
              New to DataEre?{" "}
              <a href="/users/signup" className="login-link">Create a free account →</a>
            </Text>
          </Box>

        </div>
      </Box>
    </Box>
  );
};

export default LoginPage;