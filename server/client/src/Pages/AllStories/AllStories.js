import React from 'react';

import './AllStories.scss';
import StoryPageItem from '../../Components/StoryPageItem/StoryPageItem';

function AllStories() {
  return (
    <div className='allstories-page'>
      All Stories Page
      <StoryPageItem label="test" />
    </div>
  )
}

export default AllStories;
