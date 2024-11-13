import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";
import "../index.css";
import myImage from "../logo.svg";

const Login = () => {
  // State for managing input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // useHistory hook to navigate programmatically
  const history = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "http://localhost/task_management_backend/api/users/login.php",
      {email,password}
    );
    if(response.status===200){
      const {data} =response;
      if(data.success){
        localStorage.setItem("token",data.token);
        history.push("/dashboard");
      }else{
        setError(data.message || "Login failed , Please try again..")
      }
    }else{
      setError("An error occured. Please try again..")
    }
 
};
return (
  <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src={myImage}
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} method="POST" className="space-y-6">
          <div>
            <div className="m-2 ">
              <input
                placeholder="Email"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className=" form-control"
              />
            </div>
          </div>

          <div>
            <div className="m-2">
              <input
                placeholder="Password"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="m-2">
            <button
              type="submit"
              className="btn-primary flex w-full justify-center"
            >
              Sign in
            </button>
          </div>
          {error && <p className="text-danger">{error}</p>}
        </form>

        <div className="register-link">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  </>);
}

export default Login;
