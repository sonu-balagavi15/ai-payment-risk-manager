import axios from "axios";

const API_URL = "https://ai-payment-risk-manager-0jyv.onrender.com";

const api = axios.create({
   baseURL: API_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

// Add JWT token automatically to every request
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("access_token");

      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Handle expired/invalid login
api.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401) {
         localStorage.removeItem("access_token");
         localStorage.removeItem("user");
         window.location.href = "/";
      }

      return Promise.reject(error);
   }
);

export default api;