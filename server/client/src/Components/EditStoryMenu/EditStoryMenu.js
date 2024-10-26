import React, { forwardRef } from 'react';

import './EditStoryMenu.scss';

const EditStoryMenu = forwardRef((props, ref) => {
  return (
    <div className='edit-story-menu'>
        <div className='edit-story-menu-nav'>
            <div className='edit-story-menu-nav-item'>
                <span className='edit-story-menu-nav-item-span'>
                    Edit Story
                </span>
            </div>
            <div className='edit-story-menu-nav-item delete-story'>
                <span className='edit-story-menu-nav-item-span'>
                    Delete Story
                </span>
            </div>
        </div>
    </div>
  )
})

export default EditStoryMenu;
