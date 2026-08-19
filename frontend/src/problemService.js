import axios from 'axios';

const API_URL = "http://localhost:8080/api/problems";

export const problemService = {
  getAll: () => axios.get(`${API_URL}/all`),
  getStats: () => axios.get(`${API_URL}/stats`),
  getStreak: () => axios.get(`${API_URL}/streak`),
  getActivity: () => axios.get(`${API_URL}/activity`),

  // POST request for adding
  create: (data) => axios.post(`${API_URL}/add`, data),

  // PUT request for updating - ID pehle aayega fir data
  update: (id, data) => axios.put(`${API_URL}/update/${id}`, data),

  // DELETE request
  delete: (id) => axios.delete(`${API_URL}/delete/${id}`)
};