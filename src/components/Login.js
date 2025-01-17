import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Login.css"; // Import CSS file
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Validate form by checking if both email and password are filled
  const validateForm = () => {
    setIsFormValid(email.trim() !== "" && password.trim() !== "");
  };

  // Update state when input changes and validate form
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPassword(value);
    }

    validateForm(); // Validate the form on each input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        { email, password },
        { withCredentials: true } // This ensures cookies are sent and stored properly
      );

      if (response.data.success) {
        // Save user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));

        console.log("Login successful:", response.data.success);
        console.log("User role:", response.data.user.role);

        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        setErrorMessage(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("An error occurred during login.");
    }
  };

  // Run validation on email/password change
  useEffect(() => {
    validateForm();
  }, [email, password]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button
          type="submit"
          className="login-btn"
          disabled={!isFormValid} // Disable if the form is not valid
        >
          Login
        </button>

        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
