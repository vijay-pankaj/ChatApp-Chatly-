// api.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const publicPaths = ["/auth/login", "/auth/signup"];
  if (!publicPaths.includes(req.url)) {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Public
export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Protected
export const getChatHistory = (userId) => API.get(`/msg/${userId}`);
export const getAllUsers = () => API.get("/user/getusers");
