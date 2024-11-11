import React from 'react';

import './HomepagePost.scss';

const HomepagePost = ({ post }) => {
    return (
        <div className="home-post-container">
          <div className="home-post-content">
            <div className="home-post-header">
              <div className="home-post-avatar">
                <img src="" alt="" />
              </div>
              <div className='home-post-header-section'>
                <span className="home-post-story">need name of story</span>
                <br />
                <span className='home-post-author'>{post.author}</span>
                <br />
                <span className="home-post-time">9 hr. ago</span>
              </div>
            </div>
            <div className='home-post-body-section'>
              <h1 className="home-post-title">
                {post.title} 
              </h1>
              { post.body ? (
                <p className="home-post-body">
                  {post.body}
                </p>
              ) : null}
              { post.media && post.media.includes('images') ? (
                <div className="home-post-media">
                  <img src={post.media} alt="need story neame"/>
                </div>
              ) : null
              }
              { post.media && post.media.includes('videos') ? (
                <div className="home-post-media">
                  <video controls width="100%">
                    <source src={post.media} type="video/*" />
                  </video>
                </div>
    
              ) : null}
            </div>
            <div className="home-post-footer">
              <span className="home-post-footerItem"># Upvotes</span>
              <span className='home-post-footerItem'>|</span>
              <span className="home-post-footerItem"># Downvotes</span>
              <span className='home-post-footerItem'>|</span>
              <span className="home-post-footerItem"># comments</span>
            </div>
          </div>
        </div>
    )
}

export default HomepagePost;