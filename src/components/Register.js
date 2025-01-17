import React, { useState } from "react";
import axios from "axios";
import '../styles/Register.css'; // Import CSS for the register form
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    occupation: "",
    role: "", 
    password: ""
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate= useNavigate();

  // Validate the form to ensure all fields are filled
  const validateForm = () => {
    const { firstname, lastname, email, phone, occupation, role, password } = formData;
    if (firstname && lastname && email && phone && occupation && role && password) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  // Handle input changes and validate form
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      // Make the API request to register a new user (adjust the URL as needed)
      const response = await axios.post("http://localhost:8000/api/users", formData);

      if (response.data.success) {
        console.log("Registration successful");
        // You can redirect to login or perform other actions on success
        navigate("/login");
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Registration failed", error);
      setErrorMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="occupation">Occupation</label>
          <input
            type="text"
            id="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Disable the button if the form is not valid */}
        <button
          type="submit"
          className="register-btn"
          disabled={!isFormValid}  // Disable if form is not valid
        >
          Register
        </button>

        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
