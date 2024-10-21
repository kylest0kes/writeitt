import React, { useEffect, useState } from 'react';

import './LeftSideMenu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faHouse, faPenToSquare, faTableList } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';
import CreateStoryModal from '../CreateStoryModal/CreateStoryModal';
import Modal from '../Modal/Modal';

function LeftSideMenu() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { authToken } = useAuth();

  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  useEffect(() => {
    console.log('isCreateModalOpen: ', isCreateModalOpen);
  }, [isCreateModalOpen])

  const handleHomeClick = () => {
    navigate("/");
  }

  const handleAllStoriesClick = () => {
    navigate("/allstories");
  }

  const handleLibraryDropdownClick = () => {
    setIsLibraryOpen(!isLibraryOpen);
  }

  return (
    <div className="left-menu">
       <ul className="sidebar-menu">
        <li className="menu-item" onClick={handleHomeClick}>
          <div className="home-link">
            <FontAwesomeIcon className="icon home-icon" icon={faHouse}/>
            <span>Home</span>
          </div>
        </li>

        <li className="menu-item" onClick={handleAllStoriesClick}>
          <div>
            <FontAwesomeIcon className="icon all-icon" icon={faTableList} />
            <span>All</span>
          </div>
        </li>
      </ul>

      {user && authToken ? (
      <div>
        <hr />

        <ul className="sidebar-section">
          { isLibraryOpen ? (
            <div>
              <li className="section-item library" onClick={handleLibraryDropdownClick}>
                <span>Library</span>
                <FontAwesomeIcon className="icon dropdown-icon" icon={faChevronUp} />
              </li>
              <li className="menu-item" onClick={openCreateModal}>
                <div>
                  <FontAwesomeIcon className="icon create-community-icon" icon={faPenToSquare} />
                  <span>Start A Story...</span>
                </div>
                <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
                  <CreateStoryModal onClose={closeCreateModal} />
                </Modal>
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

      ) : (
        <ul className="sidebar-section">

        </ul>
    )}

    </div>
  )
}

export default LeftSideMenu;
