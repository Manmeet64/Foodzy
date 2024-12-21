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
            <div
                className={styles.logoContainer}
                onClick={() => navigate("/home")}
            >
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
                    className={styles.navItem}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <span>
                        <i className="fas fa-th-large"></i> Quick Access{" "}
                        <i className="fas fa-chevron-down"></i>
                    </span>
                    {showDropdown && (
                        <ul className={styles.dropdown}>
                            <li onClick={() => navigate("/admin")}>
                                <i className="fas fa-user-shield"></i> Admin
                                Portal
                            </li>
                            <li onClick={() => navigate("/delivery")}>
                                <i className="fas fa-truck"></i> Delivery
                                Partner
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
                    onClick={() => navigate("/search")}
                    className={styles.navItem}
                >
                    <i className="fas fa-store"></i> Restaurants
                </li>
                <li className={styles.mobileIcons}>
                    <div
                        onClick={() => navigate("/search")}
                        className={styles.mobileIcon}
                    >
                        <i className="fas fa-search"></i>
                        <span>Search</span>
                    </div>
                    <div
                        onClick={() => navigate("/cart")}
                        className={styles.mobileIcon}
                    >
                        <i className="fas fa-shopping-cart"></i>
                        <span>Cart</span>
                    </div>
                    <div
                        onClick={() => navigate("/profile")}
                        className={styles.mobileIcon}
                    >
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </div>
                </li>
            </ul>
            <div className={styles.icons}>
                <div
                    className={styles.iconWrapper}
                    onClick={() => navigate("/search")}
                >
                    <i className="fas fa-search"></i>
                </div>
                <div
                    className={styles.iconWrapper}
                    onClick={() => navigate("/cart")}
                >
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
