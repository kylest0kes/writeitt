import React from 'react';
import { User } from 'lucide-react';
import './Post.scss'; // Import the SCSS file

const SocialMediaPost = () => {
  return (
    <div className="post-container">
      <div className="post-content">
        <div className="post-header">
          <div className="post-avatar">
            <User color="#a0aec0" size={24} />
          </div>
          <div>
            <h2 className="post-subreddit">r/AITAH</h2>
            <p className="post-time">9 hr. ago</p>
          </div>
          <button className="post-joinButton">Join</button>
        </div>
        <h1 className="post-title">
          Post Title
        </h1>
        <p className="post-text">
          Post Text
        </p>
        <div className="post-footer">
          <span className="post-footerItem">13K Likes</span>
          <span className='post-footerItem'>|</span>
          <span className="post-footerItem">4.9K comments</span>
          <span className='post-footerItem'>|</span>
          <span>Share</span>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPost;
