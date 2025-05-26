import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export const login = async (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const register = async (name: string, email: string, password: string) => {
  return axios.post(`${API_URL}/register`, { name, email, password });
};
