/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./Header.scss";
import Modal from "../Modal/Modal";

function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }


    return (
        <nav class="navbar">
        <a href="/" class="logo">
            wroteitt
        </a>
        <ul class="main-nav" id="js-menu">
            <li>
            <a href="#" class="nav-links" onClick={openModal}>
                Sign Up
            </a>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h1>test</h1>
            </Modal>
            </li>
            <li>
            <a href="#" class="nav-links" onClick={openModal}>
                Log in
            </a>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h1>login</h1>
            </Modal>
            </li>
        </ul>
        </nav>
    );
}

export default Header;
