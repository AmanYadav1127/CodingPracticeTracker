import axios from 'axios';

// This URL must match your Spring Boot port (usually 8080)
// and the @RequestMapping path in your Controller
const API_URL = "http://localhost:8080/api/problems";

export const getAllProblems = () => {
    return axios.get(API_URL);
};

export const addProblem = (problemData) => {
    return axios.post(API_URL, problemData);
};