import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaComment, FaPen, FaUser } from "react-icons/fa"; // Added FaHeart for liked state
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPost] = useState([]);
  const [userId, setUserId] = useState(null);
  const [liked, setLikedPosts] = useState({});
  const [bannerIndex, setBannerIndex] = useState(0);

  const handleLikeUnlike = async (postId) => {
    const token = localStorage.getItem("access");
    const previouslyLiked = liked[postId];

    // 1. Optimistic UI Update
    setLikedPosts((prev) => ({ ...prev, [postId]: !previouslyLiked }));

    // Update the local post count immediately for better UX
    setPost((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? { ...p, total_likes: previouslyLiked ? p.total_likes - 1 : p.total_likes + 1 }
          : p
      )
    );

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}` + ""}/api/posts/${postId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Sync with precise backend data
      setLikedPosts((prev) => ({ ...prev, [postId]: response.data.is_liked }));
      setPost((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, total_likes: response.data.likes_count } : p
        )
      );
    } catch (error) {
      console.error("Error liking post:", error.response?.data);
      // 3. Rollback on failure
      setLikedPosts((prev) => ({ ...prev, [postId]: previouslyLiked }));
      alert("Could not update like. Please try again.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");

    axios
      .get(`${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}` + "/api/home_page/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const fetchedPosts = response.data;
        setPost(fetchedPosts);

        // ✅ Initialize the 'liked' state based on 'is_liked' from serializer
        const initialLikes = {};
        fetchedPosts.forEach((p) => {
          initialLikes[p.id] = p.is_liked;
        });
        setLikedPosts(initialLikes);

        if (fetchedPosts && fetchedPosts.length > 0) {
          setBannerIndex(Math.floor(Math.random() * fetchedPosts.length));
        }
      })
      .catch((error) => console.error("ERROR:", error.response?.data));

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_id);
      } catch (e) {
        console.error("Failed to decode token");
      }
    }
  }, []);

  const currentBanner = posts[bannerIndex];
  const dynamicStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
    backgroundColor: '#1a1a1a',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div>
      <section className="hero-banner" style={dynamicStyle}>
        <div className="banner-overlay">
          <div className="navbar transparent-nav">
            <div className="logo">Explore.</div>
            <div className="nav-actions">
              <Link to="/create_post" className="create-btn">
                <FaPen style={{ marginRight: '8px' }} /> Write
              </Link>
              {userId && (
                <Link to={`/user/${userId}`} className="create-btn">
                  <FaUser style={{ marginRight: '8px' }} /> View Profile
                </Link>
              )}
            </div>
          </div>

          <div className="banner-content">
            {/* <h1>{currentBanner ? currentBanner.title : "Welcome to Our Vision"}</h1> */}
            <p>Experience the seamless blend of design and functionality.</p>
            <button className="banner-button">Explore More</button>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="article-list">
          <div className="section-header">
            <h2>Mark your Trip</h2>
          </div>

          {posts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-card-wrapper">
                  <Link to={`/post_view/${post.id}`}>
                    <div className="post-card">
                      {post.image && (
                        <img src={`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}` + ""}${post.image}`} alt={post.title} className="post-image" />
                      )}
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-content">{post.content}</p>
                    </div>
                  </Link>

                  <div className="post-actions">
                    <button
                      className={`likebtn ${liked[post.id] ? "Liked" : ""}`}
                      onClick={() => handleLikeUnlike(post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      {/* Switch between filled and outline heart */}
                      {liked[post.id] ? <FaHeart color="red" /> : <CiHeart />}
                      <span>{post.total_likes || 0}</span>
                    </button>
                    <button><FaComment /> Comment</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;