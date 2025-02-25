import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // External CSS

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manufacturer"); // Default role
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      // Sign-up logic
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      localStorage.setItem("role", role);
      alert("Signup successful! Please log in.");
      setIsSignup(false);
    } else {
      // Login logic
      const storedUsername = localStorage.getItem("username");
      const storedPassword = localStorage.getItem("password");
      const storedRole = localStorage.getItem("role");

      if (username === storedUsername && password === storedPassword) {
        alert("Login successful!");
        navigate(storedRole === "manufacturer" ? "/manufacturer" : "/master");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignup && (
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="manufacturer">Manufacturer</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>

        <p onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "New user? Sign up"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
