const BASE_URL = 'https://dataere-main-m9j2if.free.laravel.cloud/api';

const getToken = () => localStorage.getItem('dataere_token');

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerUser = async (firstName, lastName, email, password, password_confirmation) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password, password_confirmation }),
  });
  return res.json();
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
    body: formData,
  });
  return res.json();
};