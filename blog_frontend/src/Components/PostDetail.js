import React, { useEffect, useState } from "react";
import "./PostDetail.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!id) return;

    axios.get(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}` + ""}/api/post_view/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setPost(response.data);
        setComments(response.data.comments || []);
      })
      .catch((error) => {
        console.error("ERROR:", error.response?.data);
      });

  }, [id]); // ✅ VERY IMPORTANT

  // ✅ Submit Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return; // ✅ prevent empty

    const token = localStorage.getItem("access");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}` + ""}/api/post_view/${post.id}/`, // ✅ FIXED URL
        {
          comment: newComment, // ✅ correct field
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ safer update
      setComments((prev) => [...prev, res.data]);
      setNewComment("");

    } catch (error) {
      console.error("COMMENT ERROR:", error.response?.data);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-container">
      <div className="post-box">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-subtitle">{post.sub_title}</p>

        {post.image && (
          <img
            src={`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}` + ""}${post.image}`}
            alt={post.title}
            className="post-image"
          />
        )}

        <div className="post-content">
          <p>{post.content}</p>
        </div>

        <div className="post-meta">
          <span className="author"> {post.author}</span>
          <span className="date">{post.date_added}</span> {/* ✅ FIXED */}
        </div>
      </div>

      {/* ================= COMMENTS SECTION ================= */}

      <div className="comments-section">
        <div className="actions-container">
          <button
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            {liked ? "❤️" : "🤍"} {liked ? "Liked" : "Like"}
          </button>
        </div>

        {/* <h3>Comments</h3> */}

        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="comment"> {/* ✅ FIXED */}

              <p><strong>{c.user}</strong></p>
              <p>{c.comment}</p>
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            rows="1"
          />
          <button type="submit" disabled={!newComment.trim()}>Post</button>
        </form>
      </div>

    </div>
  );
};

export default PostDetail;