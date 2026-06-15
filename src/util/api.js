const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("dataere_token");

const request = async (endpoint, method = "GET", body = null, token = null, isFormData = false) => {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  const authToken = token || getToken();
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : null,
  });
  return res.json();
};

// ─── AUTH 
export const registerUser = (username, email, password) =>
  request("/auth/register", "POST", { username, email, password });

export const loginUser = (identifier, password) =>
  request("/auth/login", "POST", { identifier, password });

export const getMe = () =>
  request("/auth/me", "GET");

export const updateProfile = (username, email) =>
  request("/auth/profile", "PUT", { username, email });

export const deleteAccount = () =>
  request("/auth/account", "DELETE");

export const forgotPassword = (email) =>
  request("/auth/forgot-password", "POST", { email });

export const resetPassword = (token, password) =>
  request(`/auth/reset-password/${token}`, "POST", { password });

export const fetchCurrentUser = async (token) => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to fetch user");
  return data.user;
};

// ─── SCORES 
export const saveScore = ({ topic, score, total, wrong, skipped, mode }) =>
  request("/scores", "POST", { topic, score, total, wrong, skipped, mode });

export const getMyScores = () =>
  request("/scores/me", "GET");

export const getLeaderboard = (topic = "overall") =>
  request(`/scores/leaderboard${topic !== "overall" ? `?topic=${encodeURIComponent(topic)}` : ""}`, "GET");

export const getTopics = () =>
  request("/scores/topics", "GET");

// ─── FILE UPLOAD 
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload", "POST", formData, null, true);
};