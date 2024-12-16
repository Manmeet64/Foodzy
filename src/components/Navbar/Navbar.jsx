// Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../assets/logo/Foodzy3.png"; // Add your logo image

const Navbar = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer} onClick={() => navigate("/")}>
                <img
                    src={logo}
                    alt="Foodzy Logo"
                    className={styles.logoImage}
                />
                <span className={styles.logoText}>Foodzy</span>
            </div>

            {/* Mobile Menu Button */}
            <div
                className={styles.mobileMenuButton}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
                <i
                    className={`fas ${showMobileMenu ? "fa-times" : "fa-bars"}`}
                ></i>
            </div>

            <ul
                className={`${styles.navLinks} ${
                    showMobileMenu ? styles.showMobileMenu : ""
                }`}
            >
                <li
                    onClick={() => navigate("/dashboard")}
                    className={styles.navItem}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <span>
                        <i className="fas fa-th-large"></i> Dashboard{" "}
                        <i className="fas fa-chevron-down"></i>
                    </span>
                    {showDropdown && (
                        <ul className={styles.dropdown}>
                            <li onClick={() => navigate("/admin")}>
                                <i className="fas fa-user-shield"></i> Admin
                            </li>
                            <li onClick={() => navigate("/delivery")}>
                                <i className="fas fa-truck"></i> Delivery
                            </li>
                        </ul>
                    )}
                </li>
                <li
                    onClick={() => navigate("/offers")}
                    className={styles.navItem}
                >
                    <i className="fas fa-gift"></i> Events
                </li>
                <li
                    onClick={() => navigate("/aura")}
                    className={styles.navItem}
                >
                    <i className="fas fa-robot"></i> Aura AI
                </li>
                <li
                    onClick={() => navigate("/services")}
                    className={styles.navItem}
                >
                    <i className="fas fa-store"></i> Restaurants
                </li>
                <li
                    onClick={() => navigate("/about")}
                    className={styles.navItem}
                >
                    <i className="fas fa-info-circle"></i> About
                </li>
            </ul>
            <div className={styles.icons}>
                <div className={styles.searchWrapper}>
                    <input type="text" placeholder="Search..." />
                    <i className="fas fa-search"></i>
                </div>
                <div className={styles.iconWrapper}>
                    <i className="fas fa-heart"></i>
                </div>
                <div className={styles.iconWrapper}>
                    <i className="fas fa-shopping-cart"></i>
                </div>
                <div
                    className={styles.iconWrapper}
                    onClick={() => navigate("/profile")}
                >
                    <i className="fas fa-user"></i>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
