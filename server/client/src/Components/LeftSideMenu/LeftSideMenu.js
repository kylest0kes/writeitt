import React, { useState } from 'react';

import './LeftSideMenu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns, faChevronDown, faChevronUp, faHouse, faPenToSquare, faTableList } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function LeftSideMenu() {
  const navigate = useNavigate();
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  const handleHomeClick = () => {
    navigate("/");
  }

  const handleLibraryDropdownClick = () => {
    setIsLibraryOpen(!isLibraryOpen);
  }

  return (
    <div className="left-menu">
       <ul className="sidebar-menu">
        <li className="menu-item">
          <div className="home-link" onClick={handleHomeClick}>
            <FontAwesomeIcon className="icon home-icon" icon={faHouse}/>
            <span>Home</span>
          </div>
        </li>

        <li className="menu-item">
          <a href="#all">
            <FontAwesomeIcon className="icon all-icon" icon={faTableList} />
            <span>All</span>
          </a>
        </li>
      </ul>

      <hr />

      <ul className="sidebar-section">
        { isLibraryOpen ? (
          <div>
            <li className="section-item library" onClick={handleLibraryDropdownClick}>
              <span>Library</span>
              <FontAwesomeIcon className="icon dropdown-icon" icon={faChevronUp} />
            </li>
            <li className="menu-item">
              <div>
                <FontAwesomeIcon className="icon create-community-icon" icon={faPenToSquare} />
                <span>Start A Story...</span>
              </div>
            </li>
          </div>
        ) : (
          <li className="section-item library" onClick={handleLibraryDropdownClick}>
            <span>Library</span>
            <FontAwesomeIcon className="icon dropdown-icon" icon={faChevronDown} />
          </li>
        )}
      </ul>

    </div>
  )
}

export default LeftSideMenu;
