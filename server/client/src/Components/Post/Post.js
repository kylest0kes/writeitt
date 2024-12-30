import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import formatCreatedAtTime from '../../Utils/TimeFormatter';
import './Post.scss'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../Contexts/UserContext';
import axios from 'axios';
import { useAuth } from '../../Contexts/AuthContext';

const Post = ({ post, storySlug, type }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { authToken } = useAuth();
  const [csrf, setCsrf] = useState("");
  const [upvotes, setUpvotes] = useState(post.upvotes.length);
  const [downvotes, setDownvotes] = useState(post.downvotes.length);
  const [userUpvote, setUserUpvote] = useState(false);
  const [userDownvote, setUserDownvote] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      setCsrf(data.csrfToken);
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    if (user) {
      const hasUpvoted = post.upvotes.includes(user._id);
      const hasDownvoted = post.downvotes.includes(user._id);

      setUserUpvote(hasUpvoted);
      setUserDownvote(hasDownvoted);
    }
  }, [user, post]);

  const handleVote = async (e, voteType) => {
    e.stopPropagation();
    if (!user) {
      setError("Must be logged in to vote.");
      return;
    }

    try {
      const res = await axios.post(`/api/posts/post/${post._id}/vote`, { voteType }, {
        headers: {
          "csrf-token": csrf,
          Authorization: `Bearer ${authToken}`
        }
      });

      setUpvotes(res.data.upvotesCount);
      setDownvotes(res.data.downvotesCount);

      if (voteType === 'upvote') {
        setUserUpvote(true);
        setUserDownvote(false);
      } else if (voteType === 'downvote') {
        setUserUpvote(false);
        setUserDownvote(true);
      }
    } catch (e) {
      console.error("Error handling vote: ", e);
      setError(e.message);
    }

  }

  const handlePostClick = () => {
    navigate(`/posts/post/${post.slug}`);
  }

  const handleStoryTitleClick = (e) => {
    e.stopPropagation();
    navigate(`/stories/story/${storySlug}`);
  }

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    navigate(`/`);
  }

  if (error) {
    return <p style={{color: 'red'}}>{error}</p>
  }

  return (
    <div className="post-container">
      <div className="post-content" onClick={handlePostClick}>
        <div className="post-header">
          <div className="post-avatar-container">
            { type === "storydetail" ? (
              <img src={post.author.userImg} alt={post.author.username} className='post-avatar' onClick={handleAuthorClick} />
            ) : (
              <img src={post.story.img} alt={post.story.name} className="post-avatar" onClick={handleStoryTitleClick}/>
            )}
          </div>
          <div className='post-header-section'>
            { type === "homepage" ? (
              <div>
                <span className="post-story" onClick={handleStoryTitleClick}>{storySlug}</span>
                <br />
              </div>
            ) : (
              null 
            )}
            <span className='post-author' onClick={handleAuthorClick}>{post.author.username}</span>
            <br />
            <span className="post-time">{formatCreatedAtTime(post.created_at)}</span>
          </div>
        </div>
        <div className='post-body-section'>
          <h1 className="post-title">
            {post.title} 
          </h1>
          { post.body ? (
            <div className="post-body" dangerouslySetInnerHTML={{__html: post.body}}/>
          ) : null}
          { post.media && post.media.includes('images') ? (
            <div className="post-media">
              <img src={post.media} alt={storySlug}/>
            </div>
          ) : null
          }
          { post.media && post.media.includes('videos') ? (
            <div className="post-media">
              <video controls width="100%">
                <source src={post.media} type="video/*" />
              </video>
            </div>

          ) : null}
        </div>
        <div className="post-footer">
          <span className="post-footerItem" onClick={(e) => handleVote(e, 'upvote')}>
            <FontAwesomeIcon className={`vote-arrow up ${userUpvote ? 'active' : ''}`} icon={faArrowUp} />
            {upvotes} Upvotes
          </span>
          <span className='post-footerItem'>|</span>
          <span className="post-footerItem" onClick={(e) => handleVote(e, 'downvote')}>
            <FontAwesomeIcon className={`vote-arrow down ${userDownvote ? 'active' : ''}`} icon={faArrowDown} />   
            {downvotes} Downvotes
          </span>
          <span className='post-footerItem'>|</span>
          <span className="post-footerItem">{post.comments.length} comments</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
