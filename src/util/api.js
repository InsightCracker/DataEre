const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getToken = () => localStorage.getItem("dataere_token");

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

// ─── AUTH 
export const registerUser = (username, email, password) =>
  request("/auth/register", "POST", { username, email, password });

// identifier can be email or username
export const loginUser = (identifier, password) =>
  request("/auth/login", "POST", { identifier, password });

export const forgotPassword = (email) =>
  request("/auth/forgot-password", "POST", { email });

export const resetPassword = (token, password) =>
  request(`/auth/reset-password/${token}`, "POST", { password });

// ─── FILE UPLOAD
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload", "POST", formData, null, true);
};