import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import formatCreatedAtTime from '../../Utils/TimeFormatter';
import { useUser } from "../../Contexts/UserContext";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";
import "./PostDetails.scss";

function PostDetails() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const { user, setUser } = useUser();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      setCsrfToken(data.csrfToken);
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/post/${slug}`);
        setPost(res.data);

        setIsAuthor(
          user && res.data.author && res.data.author._id === user._id
        );
      } catch (err) {
        setError("Error fetching Post from Post Details.");
        console.error("Error fetching Post in Post Details: ", err);
      }
    };
    fetchPost();
  }, [slug, user]);

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate("/");
  }

  const handleTitleClick = (e) => {
    e.stopPropagation();
    if (post.story) navigate(`/stories/story/${post.story.slug}`)
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!post) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="post-details">
      <div className="post-details-content">
        <div className="post-details-content-top-banner">
            <img src={post.story.img} alt={post.story.name} className="post-details-content-top-banner-avatar" onClick={handleTitleClick}/>
            <div className="post-details-content-top-banner-detail-container">
                <span className="post-details-content-top-banner-storytitle" onClick={handleTitleClick}>{post.story.slug}</span>
                <span> -- </span>
                <span className="post-details-content-top-banner-time">{formatCreatedAtTime(post.created_at)}</span>
                <br />
                <span className='post-details-content-top-banner-author' onClick={handleAuthorClick}>{post.author.username}</span>
            </div>
        </div>

        <div className="post-details-content-post-title">
          <div>{post.title}</div>
        </div>

        {post.body ? (
          <div className="post-details-content-post-body">
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </div>
        ) : null}

        {post.media && post.media.includes("images") ? (
          <div className="post-details-content-media">
            <img className="post-details-content-media-img" src={post.media} alt={`${post.title}`} />
          </div>
        ) : null}

        {post.media && post.media.includes("videos") ? (
          <div className="post-details-content-media">
            <video className="post-details-content-media-video" controls width="100%">
              <source src={post.media} type="video/*" />
            </video>
          </div>
        ) : null}

        <div className="post-details-content-comments"></div>
      </div>
    </div>
  );
}

export default PostDetails;
