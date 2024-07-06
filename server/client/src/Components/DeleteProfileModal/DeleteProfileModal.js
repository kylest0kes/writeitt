import React from 'react';

import './DeleteProfileModal.scss';

function DeleteProfileModal({ onClose }) {

    return (
        <div id='delete-wrapper'>
            <form>
                <h1 className='delete-heading'>Delete Profile</h1>
            </form>
        </div>
    )
}

export default DeleteProfileModal;