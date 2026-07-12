// shared/utils/datasetQuizApi.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAccessStatus() {
  const res = await fetch(`${API_BASE}/dataset-quiz/access-status`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Could not check access status");
  return res.json();
}

export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/dataset-quiz/upload`, {
    method: "POST",
    headers: authHeaders(), // do NOT set Content-Type — browser sets multipart boundary
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data; // { datasetId, columns, rowCount }
}

export async function generateDatasetQuiz({ datasetId, tool, difficulty }) {
  const res = await fetch(`${API_BASE}/dataset-quiz/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ datasetId, tool, difficulty }),
  });

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || "Generation failed");
    err.code = data.error; // e.g. 'FREE_LIMIT_REACHED'
    err.resetsOn = data.resetsOn;
    throw err;
  }
  return data; // { questions, remaining }
}

export async function initiateCheckout(planId) {
  const res = await fetch(`${API_BASE}/subscription/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ planId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Checkout failed to start");
  return data; // { processor, checkoutUrl }
}