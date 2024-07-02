import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.scss';

const UserMenu = forwardRef((props, ref) => {
    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate('/settings');
    }

    const handleHelpClick = () => {
        navigate('/help');
    }

    return (
        <div ref={ref} className="user-menu">

            <div className="user-info">

                <div className="profile-img" ></div>
                <h3 className="name">{props.username}</h3>
                <div className="ui btn normal">View Profile</div>

            </div>



            <div className="menu-nav">
                <li onClick={handleSettingsClick}><span className="menu-nav-span"></span>Settings</li>
                <li onClick={handleHelpClick}><span className="menu-nav-span"></span>Help</li>
                <li onClick={props.onSignOut}><span className="menu-nav-span"></span>Sign Out</li>
            </div>
        </div>

    );
});

export default UserMenu;