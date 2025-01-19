import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Home.scss';
import Post from '../../Components/Post/Post.js';

function Home() {
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/posts/get-all-posts');
        setPosts(res.data);
      } catch (error) {
        setErrors(error);
        console.error("Error fetching posts: ", error);
      }
    }
    fetchPosts();
  }, []);

  const handlePostDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId))
  }

  if (errors) {
    return <p style={{color: 'red'}}>{errors}</p>
  }

  if (!posts) {
    return <div className='no-posts'>No Posts gathered. Sorryyyyyy.</div>
  }

  return (
    <div className='home-page'>
      <div className='home-page-posts-container'>
        {posts.map((post) => (
          <Post post={post} key={post._id} storySlug={post.story.slug} type="homepage" onPostDelete={handlePostDelete} />
        ))}
      </div>
    </div>
  )
}

export default Home;

