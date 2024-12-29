import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Post.scss'; 

const StoryPost = ({ post, storySlug, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/posts/post/${post.slug}`);
  }
  return (
    <div className="post-container">
      <div className="post-content" onClick={handleClick}>
        <div className="post-header">
          <div className="post-avatar-container">
            { type === "storydetail" ? (
              <img src={post.author.userImg} alt={post.author.username} className='post-avatar' />
            ) : (
              <img src={post.story.img} alt={post.story.name} className="post-avatar"
            />
            )}
          </div>
          <div className='post-header-section'>
            { type === "homepage" ? (
              <div>
                <span className="post-story">{storySlug}</span>
                <br />
              </div>
            ) : (
              null 
            )}
            <span className='post-author'>{post.author.username}</span>
            <br />
            <span className="post-time">9 hr. ago</span>
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
          <span className="post-footerItem"># Upvotes</span>
          <span className='post-footerItem'>|</span>
          <span className="post-footerItem"># Downvotes</span>
          <span className='post-footerItem'>|</span>
          <span className="post-footerItem"># comments</span>
        </div>
      </div>
    </div>
  );
};

export default StoryPost;
