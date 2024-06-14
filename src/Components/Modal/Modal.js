import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import './Modal.scss'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal">
                <FontAwesomeIcon icon={faCircleXmark} onClick={onClose} className='closeBtn'/>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;