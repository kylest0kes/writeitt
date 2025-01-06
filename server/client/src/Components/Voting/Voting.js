import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';
import './Voting.scss';

const Voting = ({ postId, initialUpvotes, initialDownvotes, initialUserVotes, commentsCount }) => {
  const { user } = useUser();
  const { authToken } = useAuth();
  const [csrf, setCsrf] = useState("");
  const [upvotes, setUpvotes] = useState(initialUpvotes.length);
  const [downvotes, setDownvotes] = useState(initialDownvotes.length);
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
      const hasUpvoted = initialUpvotes.includes(user._id);
      const hasDownvoted = initialDownvotes.includes(user._id);

      setUserUpvote(hasUpvoted);
      setUserDownvote(hasDownvoted);
    }
  }, [user, initialUpvotes, initialDownvotes]);

  const handleVote = async (e, voteType) => {
    e.stopPropagation();
    if (!user) {
      setError("Must be logged in to vote.");
      return;
    }

    try {
      const res = await axios.post(`/api/posts/post/${postId}/vote`, { voteType }, {
        headers: {
          "csrf-token": csrf,
          Authorization: `Bearer ${authToken}`
        }
      });

      setUpvotes(res.data.upvotesCount);
      setDownvotes(res.data.downvotesCount);

      if (voteType === 'upvote') {
        setUserUpvote(!userUpvote);
        setUserDownvote(false);
      } else if (voteType === 'downvote') {
        setUserUpvote(false);
        setUserDownvote(!userDownvote);
      }
    } catch (e) {
      console.error("Error handling vote: ", e);
      setError(e.message);
    }
  };

  if (error) {
    return <p style={{color: 'red'}}>{error}</p>;
  }

  return (
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
      <span className="post-footerItem">{commentsCount} comments</span>
    </div>
  );
};

export default Voting;