import React from 'react';
import { useNavigate } from 'react-router-dom';
import formatCreatedAtTime from '../../Utils/TimeFormatter';
import './Post.scss'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const StoryPost = ({ post, storySlug, type }) => {
  const navigate = useNavigate();

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
            <span className='post-author'>{post.author.username}</span>
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
          <span className="post-footerItem">
            <FontAwesomeIcon className='vote-arrow up' icon={faArrowUp} />
            {post.upvotes} Upvotes
          </span>
          <span className='post-footerItem'>|</span>
          <span className="post-footerItem">
            <FontAwesomeIcon className='vote-arrow down' icon={faArrowDown} />   
            {post.downvotes} Downvotes
          </span>
          <span className='post-footerItem'>|</span>
          <span className="post-footerItem">{post.comments.length} comments</span>
        </div>
      </div>
    </div>
  );
};

export default StoryPost;
