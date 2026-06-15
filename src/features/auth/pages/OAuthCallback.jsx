import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

import { useAuth } from "../../../util/AuthContext";
import { fetchCurrentUser } from "../../../util/api";
import { showToast } from "../../../util/toastUtil";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      showToast(toast, "error", "Social sign-in failed. Please try again.");
      navigate("/users/login");
      return;
    }

    (async () => {
      try {
        const user = await fetchCurrentUser(token);
        login(user, token);
        navigate("/users/profile");
      } catch (err) {
        console.error("OAuth callback error:", err);
        showToast(toast, "error", "Could not complete sign-in. Please try again.");
        navigate("/users/login");
      }
    })();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f0f4ff",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.97); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "48px 56px",
          boxShadow: "0 8px 40px rgba(59,110,240,0.10)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "pulse 2.4s ease-in-out infinite",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "4px solid rgba(59,110,240,0.18)",
            borderTopColor: "#3b6ef0",
            borderRightColor: "#2251cc",
            animation: "spin 0.9s linear infinite",
            marginBottom: "24px",
          }}
        />

        <p
          style={{
            margin: "0 0 4px",
            fontSize: "22px",
            fontWeight: 900,
            letterSpacing: "-1px",
            color: "#111827",
          }}
        >
          Data<span style={{ color: "#3b6ef0" }}>Ere</span>
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
          <span style={{ fontSize: "15px", color: "#4b5563", fontWeight: 500 }}>
            Signing you in
          </span>
        </div>

        <div style={{
            marginTop: ".3rem"
        }}>
            <span style={{ display: "flex", gap: "3px" }}>
            {[0, 1, 2].map((i) => (
              <span
                    key={i}
                    style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#3b6ef0",
                    animation: "dotBounce 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                    }}
                />
                ))}
            </span>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;