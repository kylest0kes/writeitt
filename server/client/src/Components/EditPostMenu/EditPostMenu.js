import React, { useState, forwardRef } from "react";
import Modal from "../Modal/Modal";
import EditPostModal from "../EditPostModal/EditPostModal";

import "./EditPostMenu.scss";
import DeletePostModal from "../DeletePostModal/DeletePostModal";

const EditPostMenu = forwardRef(({ post, onPostUpdated, onDeleteSuccess, onCloseMenu }, ref) => {
    const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
    const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);

    const openEditPostModal = (e) => {
        e.stopPropagation();
        setIsEditPostModalOpen(true)
    };
    const closeEditPostModal = () => {
        setIsEditPostModalOpen(false)
        if (onCloseMenu) onCloseMenu();
    };

    const openDeletePostModal = (e) => {
        e.stopPropagation();
        setIsDeletePostModalOpen(true)
    };
    const closeDeletePostModal = () => setIsDeletePostModalOpen(false);

    return (
        <div className="edit-post-menu" ref={ref} onClick={(e) => e.stopPropagation()}>
            <div className="edit-post-menu-nav">
                <div className="edit-post-menu-nav-item" onClick={openEditPostModal}>
                    <span className="edit-post-menu-nav-item-span">
                        Edit Post
                    </span>
                </div>
                <Modal isOpen={isEditPostModalOpen} onClose={closeEditPostModal}>
                    <EditPostModal post={post} onClose={closeEditPostModal} postUpdated={(updatedPost) => {
                        onPostUpdated(updatedPost)
                        closeEditPostModal();
                    }} />
                </Modal>
                <div className="edit-post-menu-nav-item delete-post" onClick={openDeletePostModal}>
                    <span className="edit-post-menu-nav-item-span">
                        Delete Post
                    </span>
                </div>
                <Modal isOpen={isDeletePostModalOpen} onClose={closeDeletePostModal}>
                    <DeletePostModal postId={post._id} onClose={closeDeletePostModal} onDeleteSuccess={onDeleteSuccess}  />
                </Modal>
            </div>
        </div>
    );
});

export default EditPostMenu;
