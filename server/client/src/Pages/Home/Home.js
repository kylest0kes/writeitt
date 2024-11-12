import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Home.scss';
import HomepagePost from '../../Components/HomepagePost/HomepagePost';

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
          <HomepagePost post={post} key={post._id} />
        ))}
      </div>
    </div>
  )
}

export default Home
