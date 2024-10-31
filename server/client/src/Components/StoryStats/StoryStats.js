import React from 'react';

import './StoryStats.scss';

const StoryStats = ({ story }) => {
    const date = new Date(story.created_at);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'});

    return (
        <div className='story-stats'>
            <div className='story-stats-posts'>
                <span className='story-stats-posts-number'>{story.postCount}</span>
                <span className='story-stats-posts-label'> POSTS</span>
            </div>
            <div className='story-stats-subscribers'>
                <span className='story-stats-subscribers-number'>{story.subscriberCount}</span>
                <span className='story-stats-subscribers-label'> SUBSCRIBED</span>
            </div>
            <div className='story-stats-creation-date'>
                <span className='story-stats-creation-date-value'>Created: {formattedDate}</span>
            </div>
            <div className='story-stats-creator'>
                <span className='story-stats-creator-label'>Creator: </span>
                <span className='story-stats-creator-value'>{story.creator.username}</span>
            </div>
        </div>
    )
}

export default StoryStats;
