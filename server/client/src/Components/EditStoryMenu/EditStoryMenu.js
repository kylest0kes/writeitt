import React, { useState, forwardRef } from 'react';

import './EditStoryMenu.scss';
import Modal from '../Modal/Modal';
import EditStoryModal from '../EditStoryModal/EditStoryModal';
import DeleteStoryModal from '../DeleteStoryModal/DeleteStoryModal';

const EditStoryMenu = forwardRef(({story, onStoryUpdate}, ref) => {
    const [isEditStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const [isDeleteStoryModalOpen, setIsDeleteStoryModalOpen] = useState(false);

    const openEditStoryModal = () => setIsStoryModalOpen(true);
    const closeEditStoryModal = () => setIsStoryModalOpen(false);

    const openDeleteStoryModal = () => setIsDeleteStoryModalOpen(true);
    const closeDeleteStoryModal = () => setIsDeleteStoryModalOpen(false);

  return (
    <div className='edit-story-menu'>
        <div className='edit-story-menu-nav'>
            <div className='edit-story-menu-nav-item' onClick={openEditStoryModal}>
                <span className='edit-story-menu-nav-item-span'>
                    Edit Story
                </span>
            </div>
            <Modal isOpen={isEditStoryModalOpen} onClose={closeEditStoryModal}>
                <EditStoryModal story={story} onClose={closeEditStoryModal} storyUpdate={(updatedStory) => {
                            onStoryUpdate(updatedStory);
                            closeEditStoryModal();
                        }}  />
            </Modal>
            <div className='edit-story-menu-nav-item delete-story' onClick={openDeleteStoryModal}>
                <span className='edit-story-menu-nav-item-span'>
                    Delete Story
                </span>
            </div>
            <Modal isOpen={isDeleteStoryModalOpen} onClose={closeDeleteStoryModal}>
                <DeleteStoryModal onClose={closeDeleteStoryModal}/>
            </Modal>
        </div>
    </div>
  )
});

export default EditStoryMenu;
