import React, { forwardRef } from 'react';
import './UserMenu.scss';

const UserMenu = forwardRef((props, ref) => {
    return (
        <div ref={ref} class="user-menu">

            <div class="user-info">

                <div className="profile-img" ></div>
                <h3 class="name">username</h3>
                <div class="ui btn normal">My Profile</div>

            </div>



            <div class="menu-nav">
                <li><span class="menu-nav-span fa fa-cogs"></span>Settings</li>
                <li><span class="menu-nav-span fa fa-question"></span>Help</li>
                <li onClick={props.onSignOut}><span class="menu-nav-span fa fa-power-off"></span>Sign Out</li>
            </div>
        </div>

    );
});

export default UserMenu;