import '../styles/auth.css';

import {
  Box,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import { LuMail } from "react-icons/lu";

import { useState } from "react";
import { showToast } from "../../../util/toastUtil";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const forgot_password_handler = async () => {
    if (loading) return;

    if (!email) {
      showToast(toast, "warning", "Email is required");
      return;
    }

    setLoading(true);

    try {
    //   const res = await forgotPassword(email);

      if (res.success) {
        showToast(
          toast,
          "success",
          "Password reset link sent to your email 📩"
        );

        // Delay so user sees feedback
        setTimeout(() => {
          navigate("/users/login");
        }, 1200);
      } else {
        showToast(
          toast,
          "error",
          res.message || "Unable to process request"
        );
      }
    } catch (err) {
      showToast(
        toast,
        "error",
        "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-page">

      {/* Logo */}
      <Text className="logo">
        Data<span className="dataxo">Ere</span>
      </Text>

      {/* Card */}
      <Box className="login-card">

        <Box className="login-badge">🔑 Reset Password</Box>

        <Text className="auth-heading">Forgot your password?</Text>

        <Text
          fontSize="sm"
          mt="5px"
          mb="20px"
          color="rgba(255,255,255,0.6)"
        >
          Enter your email and we’ll send you a reset link.
        </Text>

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

          {/* Submit */}
          <Box
            as="button"
            className="login-btn"
            onClick={forgot_password_handler}
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
              transition: "background 0.2s",
              _hover: !loading && {
                bg: "#2563eb",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
              },
              _active: { transform: "translateY(0)", boxShadow: "none" },
            }}
          >
            {loading ? <Spinner size="sm" color="white" /> : "Send Reset Link"}
          </Box>

          {/* Divider */}
            <Box className="login-divider">
                <Box className="divider-line" />
                <Text className="divider-text">or</Text>
                <Box className="divider-line" />
            </Box>

          {/* Back to login */}
          <Box className="login-signup-row">
            <Text>
              Remember your password?{" "}
              <a href="/users/login" className="login-link">
                Back to login
              </a>
            </Text>
          </Box>

        </div>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;