import React from 'react';

import './StoryPageItem.scss';

function StoryPageItem({ label }) {
  return (
    <div className="pill-container">
        <div className="pill">{label}</div>
    </div>
  )
}

export default StoryPageItem
