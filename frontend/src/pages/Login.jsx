import { useState } from "react";
import api from "../api";
import "./Auth.css";

function Login({ onLogin, onShowRegister }) {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      setLoading(true);
      setError("");

      try {
         const response = await api.post(
            "/auth/login",
            formData
         );

         const data = response.data;

         if (data.access_token) {
            localStorage.setItem(
               "access_token",
               data.access_token
            );
         }

         if (data.user) {
            localStorage.setItem(
               "user",
               JSON.stringify(data.user)
            );

            onLogin(data.user);
         } else {
            const user = {
               email: formData.email,
            };

            localStorage.setItem(
               "user",
               JSON.stringify(user)
            );

            onLogin(user);
         }
      } catch (err) {
         console.error("Login error:", err);

         setError(
            err.response?.data?.detail ||
            "Login failed. Please check your email and password."
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="auth-page">

         <div className="auth-card">

            <div className="auth-logo">
               AI
            </div>

            <h1>
               Welcome Back
            </h1>

            <p className="auth-subtitle">
               Sign in to your AI Payment Risk Manager
            </p>

            {error && (
               <div className="auth-error">
                  {error}
               </div>
            )}

            <form onSubmit={handleSubmit}>

               <div className="auth-field">

                  <label>
                     Email
                  </label>

                  <input
                     type="email"
                     name="email"
                     placeholder="Enter your email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                  />

               </div>

               <div className="auth-field">

                  <label>
                     Password
                  </label>

                  <input
                     type="password"
                     name="password"
                     placeholder="Enter your password"
                     value={formData.password}
                     onChange={handleChange}
                     required
                  />

               </div>

               <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
               >
                  {loading
                     ? "Signing in..."
                     : "Sign In"}
               </button>

            </form>

            <div className="auth-switch">

               <span>
                  Don't have an account?
               </span>

               <button
                  type="button"
                  onClick={() => {
                     if (onShowRegister) {
                        onShowRegister();
                     }
                  }}
               >
                  Create Account
               </button>

            </div>

         </div>

      </div>
   );
}

export default Login;