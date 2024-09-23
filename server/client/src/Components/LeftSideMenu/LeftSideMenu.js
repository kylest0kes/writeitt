import React from 'react';

import './LeftSideMenu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns, faHouse, faPenToSquare, faTableList } from '@fortawesome/free-solid-svg-icons';

function LeftSideMenu() {
  return (
    <div className="left-menu">
       <ul className="sidebar-menu">
        <li className="menu-item">
          <a href="#home">
            <FontAwesomeIcon className="icon home-icon" icon={faHouse}/>
            <span>Home</span>
          </a>
        </li>

        <li className="menu-item">
          <a href="#all">
            <FontAwesomeIcon className="icon all-icon" icon={faTableList} />
            <span>All</span>
          </a>
        </li>
      </ul>

      <ul className="sidebar-section">
        <li className="section-item">
          <span>Library</span>
          <FontAwesomeIcon className="icon dropdown-icon" icon={faBuildingColumns} />
        </li>
        <li className="menu-item">
          <a href="#create-story">
            <FontAwesomeIcon className="icon create-community-icon" icon={faPenToSquare} />
            <span>Start A Story...</span>
          </a>
        </li>
      </ul>

    </div>
  )
}

export default LeftSideMenu;
