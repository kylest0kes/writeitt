import React from 'react';

import './DeleteStoryModal.scss';

const DeleteStoryModal = ({ onClose }) => {
  return (
    <div className='delete-story-modal-wrapper'>
        <h1 className='delete-story-heading'>Are You Sure?</h1>

        <p className='delete-story-subheading'>
            This action cannot be undone. All data associated with this Story will be deleted if you proceed.
        </p>

        <div className='delete-story-btns-container'>
                    <button className='delete-story-cancel-btn' type='submit' onClick={() => onClose()}>Cancel</button>
                    <button className='delete-story-submit-btn' type='submit'>Submit</button>
                </div>
    </div>
  )
}

export default DeleteStoryModal;
