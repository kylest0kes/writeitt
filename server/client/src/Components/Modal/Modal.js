import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import './Modal.scss';

const Modal = ({ isOpen, onClose, children }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    const handleCloseClick = (e) => {
        e.stopPropagation();
        if (onClose) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation}>
                <div className="closeBtn-container" onClick={handleCloseClick}>
                    <FontAwesomeIcon
                        icon={faCircleXmark}
                        className='closeBtn'
                    />
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
