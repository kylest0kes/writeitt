import React from "react";
import "./Header.scss";

function Header() {
  return (
    <nav class="navbar">
      <a href="/" class="logo">
        wroteitt
      </a>
      <ul class="main-nav" id="js-menu">
        <li>
          <a href="/" class="nav-links">
            Sign Up
          </a>
        </li>
        <li>
          <a href="/" class="nav-links">
            Log in
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
