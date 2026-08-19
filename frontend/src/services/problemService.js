import axios from 'axios';

const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/problems`;

const getUser = () => localStorage.getItem("user") || "";

export const problemService = {
  getAll:      ()         => axios.get(`${BASE}/all`, { params: { username: getUser() } }),
  create:      (data)     => axios.post(`${BASE}/add`, { ...data, username: getUser() }),
  delete:      (id)       => axios.delete(`${BASE}/delete/${id}`),
  update:      (id, data) => axios.put(`${BASE}/update/${id}`, data),
  getStreak:   ()         => axios.get(`${BASE}/streak`, { params: { username: getUser() } }).catch(() => ({ data: {} })),
};
