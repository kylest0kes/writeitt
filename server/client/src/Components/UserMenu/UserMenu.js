import React, { forwardRef } from 'react';
import './UserMenu.scss';

const UserMenu = forwardRef((props, ref) => {
    return (
        <div ref={ref} className='test-container'>
            <h3 className='test-h3'>Test</h3>
        </div>
    );
});

export default UserMenu;