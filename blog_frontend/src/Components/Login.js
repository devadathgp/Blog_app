import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Add CSS import

function Login() {

    const navigate=useNavigate()
    const [formData,setFromData]=useState({
        'username':"",
        'password':""
    });
    const [message, setMessage] = useState("");

    const handleChange=(e)=>{
        setFromData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    };

    const handleSubmit=async(e)=>{
        e.preventDefault()

        try{
            const res=await axios.post(`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}` + "/accounts/login/",
            formData
        );
        console.log(res.data);
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        console.log("Token saved:", res.data.access);

        setMessage("Login Successful ✅");
        navigate("/home_page")
    }catch (err) {
      console.log(err);
      setMessage("Login Failed ❌");
    }

    }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>

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
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">Sign In</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="auth-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
