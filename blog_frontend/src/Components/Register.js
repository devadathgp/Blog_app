import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}` + "/accounts/register/", formData);
      console.log(res.data);
      setMessage("Registration Successful ✅. Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.username ? `Error: ${err.response.data.username[0]}` : "Registration Failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">Sign Up</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="auth-link">
          Already have an account? <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
