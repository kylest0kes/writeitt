import React from 'react';
import { useNavigate } from 'react-router-dom';

import './StoryPageItem.scss';

function StoryPageItem({ name, slug }) {
  const navigate = useNavigate();

  const handlePillClick = () => {
    navigate(`/stories/story/${slug}`);
  }

  return (
    <div>
        <div onClick={handlePillClick} className="pill">{name}</div>
    </div>
  )
}

export default StoryPageItem
