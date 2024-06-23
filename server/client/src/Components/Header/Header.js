/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./Header.scss";
import Modal from "../Modal/Modal";
import SignUp from "../SignUp/SignUp";
import Login from "../Login/Login";
import { useUser } from "../../Contexts/UserContext";
import { useAuth } from "../../Contexts/AuthContext";

function Header() {
    const { user, loading } = useUser();
    const { authToken, logout } = useAuth();

    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openSignUpModal = () => setIsSignUpModalOpen(true);
    const closeSignUpModal = () => setIsSignUpModalOpen(false);
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const handleLogout = () => logout();

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <nav className="navbar">
            <a href="/" className="logo">
                wroteitt
            </a>
            {user && authToken ? (
                <ul className="main-nav" id="js-menu">
                    <li>
                        <a href="" className="pill-btn login">{user.username}</a>
                    </li>
                    <li>
                        <a href="" className="pill-btn" onClick={handleLogout}>logout</a>
                    </li>
                </ul>
            ) : (
            <ul className="main-nav" id="js-menu">
                <li>
                    <a href="#" className="pill-btn signup" onClick={openSignUpModal}>
                        Sign Up
                    </a>
                    <Modal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} className="signup-modal">
                        <SignUp />
                    </Modal>
                </li>
                <li>
                    <a href="#" className="pill-btn login" onClick={openLoginModal}>
                        Log In
                    </a>
                    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
                        <Login onClose={closeLoginModal} />
                    </Modal>
                </li>
            </ul>
            )}



        </nav>
    );
}

export default Header;
