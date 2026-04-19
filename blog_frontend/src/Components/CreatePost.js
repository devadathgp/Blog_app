import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";
import "./Create.css";

function Create() {
  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    content: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_id);
      } catch (e) {
        console.error("Failed to decode token");
      }
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("title", formData.title);
    data.append("sub_title", formData.sub_title);
    data.append("content", formData.content);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const token = localStorage.getItem("access");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}` + "/api/create_post/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      setMessage("✅ Blog created successfully!");

    } catch (error) {
      console.log("BACKEND ERROR:", error.response?.data);
      setMessage(JSON.stringify(error.response?.data));
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">Explore.</div>
        <div className="nav-actions">
          <Link to="/home_page" className="create-btn" style={{ background: "transparent", color: "#333", border: "1px solid #ddd" }}>Home</Link>
          {userId && <Link to={`/user/${userId}`} className="create-btn">Profile</Link>}
        </div>
      </nav>

      <div className="create-wrapper" style={{ minHeight: "calc(100vh - 80px)", paddingTop: "40px", paddingBottom: "40px" }}>
        <div className="create-card dual-layout">

          <div className="layout-left">
            <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Post Image</h3>
            <label className="file-label large-file-label">
              {formData.image ? (
                <div className="image-preview-overlay">
                  <span className="file-name">{formData.image.name}</span>
                  <p>Click to change</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📁</span>
                  <p>Click to Upload Image</p>
                </div>
              )}
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                required
              />
            </label>
          </div>

          <div className="layout-right">
            <h2 style={{ marginTop: 0, textAlign: "left" }}>Create New Blog</h2>
            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter blog title..."
                value={formData.title}
                onChange={handleChange}
                required
              />
              <label>Subtitle</label>
              <input
                type="text"
                name="sub_title"
                placeholder="Enter subtitle..."
                value={formData.sub_title}
                onChange={handleChange}
                required
              />

              <label>Content</label>
              <textarea
                name="content"
                placeholder="Write your story..."
                value={formData.content}
                onChange={handleChange}
                required
              />

              <button type="submit">Publish Blog</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Create;