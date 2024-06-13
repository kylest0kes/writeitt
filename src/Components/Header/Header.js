/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./Header.scss";
import Modal from "../Modal/Modal";
import SignUp from "../SignUp/SignUp";
import Login from "../Login/Login";

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
                    <a href="#" className="pill-btn signup" onClick={openSignUpModal}>
                        Sign Up
                    </a>
                    <Modal isOpen={isSignUpModalOpen} onClose={closeSignUpModal}>
                        <SignUp />
                    </Modal>
                </li>
                <li>
                    <a href="#" className="pill-btn login" onClick={openLoginModal}>
                        Log In
                    </a>
                    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
                        <Login />
                    </Modal>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
