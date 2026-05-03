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
  LuUser,
} from "react-icons/lu";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from '../../../util/toastUtil';
import { useAuth } from "../../../util/AuthContext";
import { registerUser } from "../../../util/api";

const SignupPage = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const togglePassword = () => setShow(!show);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const signup_handler = async () => {
    if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
      showToast(toast, "warning", "All fields are required");
      return;
    }

    // 🔐 Password strength check
    if (password.length < 6) {
      showToast(
        toast,
        "warning",
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== passwordConfirmation) {
      showToast(toast, "warning", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(firstName, lastName, email, password, passwordConfirmation);

      if (res.token) {
        showToast(toast, "success", "Account created successfully 🎉");

        login(res.data, res.token);

        // slight delay so user sees feedback
        setTimeout(() => {
          navigate("/users/profile");
        }, 800);
      } else {
        showToast(
          toast,
          "error",
          res.message || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      showToast(
        toast,
        "error",
        "Unable to register. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
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
  };

  return (
    <Box className="login-page" id="signup">

      {/* Logo */}
      <Text className="logo">
        Data<span className="dataxo">Ere</span>
      </Text>

      {/* Main card */}
      <Box className="login-card">

        <Box className="login-badge">✦ Get started for free</Box>
        
        <Text className="auth-heading">Create your DataEre account</Text>

        <div className="form">

          {/* First Name & Last Name */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="field-group" style={{ flex: 1 }}>
              <p className="field-label">First name</p>
              <div className="input">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <LuUser color="#4a6fa5" />
                  </InputLeftElement>
                  <Input
                    value={firstName}
                    variant="outline"
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    placeholder="John"
                    sx={inputSx}
                  />
                </InputGroup>
              </div>
            </div>

            <div className="field-group" style={{ flex: 1 }}>
              <p className="field-label">Last name</p>
              <div className="input">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <LuUser color="#4a6fa5" />
                  </InputLeftElement>
                  <Input
                    value={lastName}
                    variant="outline"
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    placeholder="Doe"
                    sx={inputSx}
                  />
                </InputGroup>
              </div>
            </div>
          </div>

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
                  sx={inputSx}
                />
              </InputGroup>
            </div>
          </div>

          {/* Password */}
          <div className="field-group">
            <p className="field-label">Password</p>
            <div className="input">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LuLock color="#4a6fa5" />
                </InputLeftElement>
                <Input
                  value={password}
                  variant="outline"
                  type={show ? "text" : "password"}
                  placeholder="Create a password"
                  onChange={(e) => setPassword(e.target.value)}
                  sx={inputSx}
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

          {/* Confirm Password */}
          <div className="field-group">
            <p className="field-label">Confirm password</p>
            <div className="input">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LuLock color="#4a6fa5" />
                </InputLeftElement>
                <Input
                  value={passwordConfirmation}
                  variant="outline"
                  type={show ? "text" : "password"}
                  placeholder="Repeat your password"
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  sx={inputSx}
                />
              </InputGroup>
            </div>
          </div>

          {/* Submit */}
          <Box
            as="button"
            onClick={signup_handler}
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
            {loading ? <Spinner size="sm" color="white" /> : "Create Account"}
          </Box>

          {/* Divider */}
          <Box className="login-divider">
            <Box className="divider-line" />
            <Text className="divider-text">or</Text>
            <Box className="divider-line" />
          </Box>

          {/* Login nudge */}
          <Box className="login-signup-row">
            <Text>
              Already a member?{" "}
              <a href="/users/login" className="login-link">Log in to your account</a>
            </Text>
          </Box>

        </div>
      </Box>
    </Box>
  );
};

export default SignupPage;