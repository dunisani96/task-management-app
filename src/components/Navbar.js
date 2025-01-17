import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import '../styles/Navbar.css';

const Navbar = () => {
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  // Fetch the logged-in user's data from localStorage and API
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser || !savedUser.id) {
      // If no user data in localStorage, redirect to login
      console.error("No user found in localStorage. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchUserRole = async () => {
      try {
        // Fetch user role from API with credentials
        const userResponse = await axiosInstance.get(`/users/${savedUser.id}`, { 
          withCredentials: true  // Include credentials (cookies)
        });
        console.log("User Response:", userResponse.data);

        if (userResponse.data && userResponse.data.success && userResponse.data.user) {
          setUserRole(userResponse.data.user.role); // Set the user's role if the user object exists
        } else {
          console.error("Failed to fetch user role:", userResponse.data.message);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        navigate("/login"); // Redirect to login if the API call fails or unauthorized
      }
    };

    fetchUserRole();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data from localStorage
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/dashboard">Task Manager</Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          {/* Conditionally render Task Management and User Management links for admin */}
          {userRole === "admin" && (
            <>
              <li>
                <Link to="/task-management">Task Management</Link>
              </li>
              <li>
                <Link to="/user-management">User Management</Link>
              </li>
            </>
          )}

          <li>
            <Link to="/login" onClick={handleLogout}>Logout</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
