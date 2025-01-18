import React, { useState } from "react";
import Modal from "../Modal/Modal";
import EditPostModal from "../EditPostModal/EditPostModal";

import "./EditPostMenu.scss";

const EditPostMenu = ({ post, onPostUpdate }) => {
    const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
    const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);

    const openEditPostModal = (e) => {
        e.stopPropagation();
        setIsEditPostModalOpen(true)
    };
    const closeEditPostModal = () => setIsEditPostModalOpen(false);

    const openDeletePostModal = (e) => {
        e.stopPropagation();
        setIsDeletePostModalOpen(true)
    };
    const closeDeletePostModal = () => setIsDeletePostModalOpen(false);

    return (
        <div className="edit-post-menu">
            <div className="edit-post-menu-nav">
                <div className="edit-post-menu-nav-item" onClick={openEditPostModal}>
                    <span className="edit-post-menu-nav-item-span">
                        Edit Post
                    </span>
                </div>
                <Modal isOpen={isEditPostModalOpen} onClose={closeEditPostModal}>
                    <EditPostModal post={post} onClose={closeEditPostModal} postUpdate={(updatedPost) => {
                        onPostUpdate(updatedPost)
                        closeEditPostModal();
                    }} />
                </Modal>
                <div className="edit-post-menu-nav-item delete-post" onClick={openDeletePostModal}>
                    <span className="edit-post-menu-nav-item-span">
                        Delete Post
                    </span>
                </div>
                <Modal isOpen={isDeletePostModalOpen} onClose={closeDeletePostModal}>
                    <EditPostModal onClose={closeEditPostModal}  />
                </Modal>
            </div>
        </div>
    );
};

export default EditPostMenu;
