import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./Home.css";

const UserDetail = () => {
  const { userId } = useParams();  // from URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.user_id);
      } catch (e) {
        console.error("Failed to decode token");
      }
    }

    console.log("TOKEN:", token);
    if (!userId) return;  // 🔥 prevents undefined API call

    const fetchUserDetail = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/user_detail/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("access");
      await axios.delete(`http://127.0.0.1:8000/api/post_view/${postId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <>
      <nav className="navbar">
        <div className="logo">Explore.</div>
        <div className="nav-actions">
          <Link to="/home_page" className="create-btn" style={{ background: "transparent", color: "#333", border: "1px solid #ddd" }}>Home</Link>
          <Link to="/create_post" className="create-btn">Create</Link>
        </div>
      </nav>

      <div className="container" style={{ display: "flex", marginTop: "40px" }}>
        {/* USER INFO */}
        <div style={{ width: "25%" }}>
          <div className="section-header" style={{ marginBottom: "40px" }}>
            <h2>{user?.username}'s Profile</h2>
            <p>Email: {user?.email}</p>
          </div>
        </div>

        {/* POSTS */}
        <div className="article-list" style={{ width: "75%", padding: 0, background: "transparent" }}>
          <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>User Posts ({posts.length})</h2>

          {posts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-card-wrapper">
                  <Link to={`/post_view/${post.id}`}>
                    <div className="post-card">
                      {post.image && (
                        <img
                          src={`http://127.0.0.1:8000${post.image}`}
                          alt={post.title}
                          className="post-image"
                        />
                      )}
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-content">{post.content}</p>
                    </div>
                  </Link>

                  {String(currentUserId) === String(userId) && (
                    <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        style={{
                          background: "#ff4d4f",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "14px",
                          transition: "background 0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#d9363e"}
                        onMouseOut={(e) => e.target.style.background = "#ff4d4f"}
                      >
                        Delete Post
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetail;