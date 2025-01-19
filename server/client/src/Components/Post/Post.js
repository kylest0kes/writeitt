import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import formatCreatedAtTime from '../../Utils/TimeFormatter';
import './Post.scss';
import Voting from '../Voting/Voting.js';
import { useUser } from '../../Contexts/UserContext.js';
import { useAuth } from '../../Contexts/AuthContext.js';
import EditPostMenu from '../EditPostMenu/EditPostMenu.js';

const Post = ({ post, storySlug, type, onPostDelete }) => {
  const navigate = useNavigate();
  const [isCreator, setIsCreator] = useState(false);
  const [isEditPostMenuVisible, setIsEditPostMenuVisible] = useState(false);
  const { user } = useUser();
  const { authToken } = useAuth();

  const editPostMenuRef = useRef(null);

  useEffect(() => {
    if (user && post.author && user._id === post.author._id) {
      setIsCreator(true);
    } 
  }, [user, post]);

  useEffect(() => {
    if (isEditPostMenuVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick); // Clean up
    };
  }, [isEditPostMenuVisible]);

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

  const handleOutsideClick = (e) => {
    const modalElements = document.querySelectorAll(
      ".edit-post-menu-container, .delete-post-modal-wrapper"
    );
    const isClickInsideModal = Array.from(modalElements).some((element) =>
      element.contains(e.target)
    );
  
    if (!isClickInsideModal) {
      setIsEditPostMenuVisible(false); // Close the EditPostMenu
    }
  };

  const handlePostDelete = (postId) => {
    onPostDelete(postId);
  }

  const toggleEditPostMenu = (e) => {
    e.stopPropagation();
    setIsEditPostMenuVisible((prev) => !prev);
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
            ) : null }
            <span className='post-author' onClick={handleAuthorClick}>{post.author.username}</span>
            <br />
            <span className="post-time">{formatCreatedAtTime(post.created_at)}</span>
          </div>
          {isCreator && authToken ? (
            <div className='edit-post-menu-container' ref={editPostMenuRef}>
              <button className='more-post-details' onClick={toggleEditPostMenu}>•••</button>
              {isEditPostMenuVisible && <EditPostMenu post={post} ref={editPostMenuRef} onDeleteSuccess={handlePostDelete} />}
            </div>
          ) : (null)}
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
          ) : null }
          { post.media && post.media.includes('videos') ? (
            <div className="post-media">
              <video controls width="100%">
                <source src={post.media} type="video/*" />
              </video>
            </div>
          ) : null}
        </div>
        <Voting 
          postId={post._id}
          initialUpvotes={post.upvotes}
          initialDownvotes={post.downvotes}
          commentsCount={post.comments.length}
        />
      </div>
    </div>
  );
};

export default Post;