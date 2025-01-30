import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Home.scss';
import Post from '../../Components/Post/Post.js';
import { useUser } from '../../Contexts/UserContext.js';
import { useAuth } from '../../Contexts/AuthContext.js';

function Home() {
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState(null);
  const { user } = useUser();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res;
        if (user) {
          res = await axios.get('/api/posts/get-followed-stories-posts', {
            headers: {
              Authorization: `Bearer ${authToken}` 
            }
          });
        } else {
          res = await axios.get('/api/posts/get-all-posts');
        }
        setPosts(res.data);
      } catch (error) {
        setErrors(error);
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, [user, authToken]);

  const handlePostDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId))
  }
  
  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) => prevPosts.map(post => post._id === updatedPost._id ? { ...updatedPost} : post));
  }

  if (errors) {
    return <p style={{color: 'red'}}>{errors.message}</p>
  }

  if (!posts) {
    return <div className='no-posts'>No Posts gathered. Sorryyyyyy.</div>
  }

  return (
    <div className='home-page'>
      <div className='home-page-posts-container'>
        {posts.map((post) => (
          <Post post={post} key={post._id} storySlug={post.story.slug} type="homepage" onPostDelete={handlePostDelete} onPostUpdated={handlePostUpdate} />
        ))}
      </div>
    </div>
  )
}

export default Home;

