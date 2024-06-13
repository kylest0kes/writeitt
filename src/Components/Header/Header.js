/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./Header.scss";
import Modal from "../Modal/Modal";

function Header() {
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openSignUpModal = () => {
        setIsSignUpModalOpen(true);
    }

    const closeSignUpModal = () => {
        setIsSignUpModalOpen(false);
    }

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    }

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    }


    return (
        <nav className="navbar">
            <a href="/" className="logo">
                wroteitt
            </a>
            <ul className="main-nav" id="js-menu">
                <li>
                    <a href="#" className="nav-links" onClick={openSignUpModal}>
                        Sign Up
                    </a>
                    <Modal isOpen={isSignUpModalOpen} onClose={closeSignUpModal}>
                        <h1 className="test">Sign Up</h1>
                    </Modal>
                </li>
                <li>
                    <a href="#" className="nav-links" onClick={openLoginModal}>
                        Log In
                    </a>
                    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
                        <h1 className="test">Log In</h1>
                    </Modal>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
