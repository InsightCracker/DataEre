const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ─── Token Helper ─────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("dataere_token");

// ─── Generic Request Helper ───────────────────────────────────────────────────
const request = async (
  endpoint,
  method = "GET",
  body = null,
  token = null,
  isFormData = false
) => {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const authToken = token || getToken();
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : null,
  });

  return res.json();
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const registerUser = (username, email, password) =>
  request("/auth/register", "POST", { username, email, password });

export const loginUser = (identifier, password) =>
  request("/auth/login", "POST", { identifier, password });

export const forgotPassword = (email) =>
  request("/auth/forgot-password", "POST", { email });

export const resetPassword = (token, password) =>
  request(`/auth/reset-password/${token}`, "POST", { password });

// ─── SCORES ───────────────────────────────────────────────────────────────────

// Save a score after finishing a quiz
export const saveScore = ({ topic, score, total, wrong, skipped, mode }) =>
  request("/scores", "POST", { topic, score, total, wrong, skipped, mode });

// Get logged-in user's scores + stats (for profile page)
export const getMyScores = () =>
  request("/scores/me", "GET");

// Get leaderboard (public)
export const getLeaderboard = () =>
  request("/scores/leaderboard", "GET");

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────────
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload", "POST", formData, null, true);
};