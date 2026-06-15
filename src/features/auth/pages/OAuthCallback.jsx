import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../util/AuthContext";
import { fetchCurrentUser } from "../../../util/api";
import { useToast } from "@chakra-ui/react";
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
      } catch {
        showToast(toast, "error", "Could not complete sign-in. Please try again.");
        navigate("/users/login");
      }
    })();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      Signing you in…
    </div>
  );
};

export default OAuthCallback;