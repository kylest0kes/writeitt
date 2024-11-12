import React from 'react';
import { User } from 'lucide-react';
import './StoryPost.scss'; 

const StoryPost = ({ post, slug }) => {
  return (
    <div className="post-container">
      <div className="post-content">
        <div className="post-header">
          <div className="post-avatar-container">
            <img src={post.author.userImg} alt={post.author.username} className='post-avatar' />
          </div>
          <div className='post-header-section'>
            <span className="post-story">{slug}</span>
            <br />
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
            <p className="post-body">
              {post.body}
            </p>
          ) : null}
          { post.media && post.media.includes('images') ? (
            <div className="post-media">
              <img src={post.media} alt={slug}/>
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
