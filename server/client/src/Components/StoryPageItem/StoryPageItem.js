import React from 'react';

import './StoryPageItem.scss';

function StoryPageItem({ label }) {
  return (
    <div class="pill-container">
        <div class="pill">{label}</div>
    </div>
  )
}

export default StoryPageItem
