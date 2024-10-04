import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './AllStories.scss';
import StoryPageItem from '../../Components/StoryPageItem/StoryPageItem';

function AllStories() {
  const [stories, setStories] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
     try {
      const res = await axios.get('/api/stories/all-stories');
      setStories(res.data);
     } catch (err) {
      setErrors(err);
      console.error('Error fetching stories: ', err);
     }
    }
    fetchStories();
  }, []);

  if (errors) {
    return <p style={{color: 'red'}}>{errors}</p>
  }

  if (!stories) {
    return <div className="spinner"></div>
  }

  return (
    <div className='allstories-page'>
      <div className='story-item-container'>
        {stories.map((story) => (
          <StoryPageItem key={story._id} name={story.name} slug={story.slug} />
        ))}
      </div>
    </div>
  )
}

export default AllStories;
