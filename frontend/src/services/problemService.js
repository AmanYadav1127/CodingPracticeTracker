import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/problems";

export const problemService = {
    // Note the /all and /add suffixes to match your Java @GetMapping and @PostMapping
    getAll: () => axios.get(`${BASE_URL}/all`),
    create: (data) => axios.post(`${BASE_URL}/add`, data),
    delete: (id) => axios.delete(`${BASE_URL}/delete/${id}`),
    update: (id, data) => axios.put(`${BASE_URL}/update/${id}`, data)
};