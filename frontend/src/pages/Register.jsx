import { useState } from "react";
import api from "../api";
import "./Auth.css";

function Register({
   onRegister,
   onShowLogin,
}) {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
   });

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

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
      setSuccess("");

      try {
         await api.post(
            "/auth/register",
            formData
         );

         setSuccess(
            "Registration successful! Please login."
         );

         setTimeout(() => {
            if (onRegister) {
               onRegister();
            }
         }, 1000);
      } catch (err) {
         console.error("Registration error:", err);

         setError(
            err.response?.data?.detail ||
            "Registration failed. Please try again."
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
               Create Account
            </h1>

            <p className="auth-subtitle">
               Start managing payment risks with AI
            </p>

            {error && (
               <div className="auth-error">
                  {error}
               </div>
            )}

            {success && (
               <div className="auth-success">
                  {success}
               </div>
            )}

            <form onSubmit={handleSubmit}>

               <div className="auth-field">

                  <label>
                     Full Name
                  </label>

                  <input
                     type="text"
                     name="name"
                     placeholder="Enter your name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                  />

               </div>

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
                     placeholder="Create a password"
                     value={formData.password}
                     onChange={handleChange}
                     minLength={6}
                     required
                  />

               </div>

               <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
               >
                  {loading
                     ? "Creating Account..."
                     : "Create Account"}
               </button>

            </form>

            <div className="auth-switch">

               <span>
                  Already have an account?
               </span>

               <button
                  type="button"
                  onClick={() => {
                     if (onShowLogin) {
                        onShowLogin();
                     }
                  }}
               >
                  Sign In
               </button>

            </div>

         </div>

      </div>
   );
}

export default Register;