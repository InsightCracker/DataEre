const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://dataere-main-m9j2if.free.laravel.cloud/api";

// ─── Token Helper 
const getToken = () => localStorage.getItem("dataere_token");

// ─── Generic Request Helper 
const request = async (
  endpoint,
  method = "GET",
  body = null,
  token = null,
  isFormData = false
) => {
  const headers = {};

  // Only set JSON header if NOT sending FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Attach token if provided or available globally
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

// ─── AUTH ENDPOINTS 
export const registerUser = (firstName, lastName, email, password, password_confirmation) =>
  request("/register", "POST", {
    firstName,
    lastName,
    email,
    password,
    password_confirmation,
  });

export const loginUser = (email, password) =>
  request("/login", "POST", { email, password });

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