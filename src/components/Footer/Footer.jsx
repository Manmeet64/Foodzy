// Footer.jsx
import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                {/* Left Section */}
                <div className={styles.footerSection}>
                    <div className={styles.logo}>
                        <span className={styles.foodzy}>Foodzy</span>
                    </div>
                    <p className={styles.footerText}>
                        Discover delicious meals and enjoy a seamless food
                        ordering experience with Foodzy - your ultimate dining
                        companion.
                    </p>
                    <div className={styles.socialIcons}>
                        <a href="#" className={styles.icon}>
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className={styles.icon}>
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className={styles.icon}>
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className={styles.icon}>
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className={styles.footerSection}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li>Home</li>
                        <li>Menu</li>
                        <li>About Us</li>
                        <li>Contact</li>
                    </ul>
                </div>

                {/* Our Menu */}
                <div className={styles.footerSection}>
                    <h4>Our Menu</h4>
                    <ul>
                        <li>Special Offers</li>
                        <li>Popular Items</li>
                        <li>Categories</li>
                        <li>Seasonal Specials</li>
                    </ul>
                </div>

                {/* Help & Support */}
                <div className={styles.footerSection}>
                    <h4>Help & Support</h4>
                    <ul>
                        <li>FAQ</li>
                        <li>Terms of Service</li>
                        <li>Privacy Policy</li>
                        <li>Contact Support</li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className={styles.footerSection}>
                    <h4>Contact Info</h4>
                    <div className={styles.contactInfo}>
                        <p>
                            <i className="fas fa-envelope"></i> info@foodzy.com
                        </p>
                        <p>
                            <i className="fas fa-phone"></i> +1 (555) 123-4567
                        </p>
                        <p>
                            <i className="fas fa-map-marker-alt"></i> 123 Food
                            Street, NY
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className={styles.footerBottom}>
                <p>
                    © {new Date().getFullYear()} <strong>Foodzy</strong>. All
                    Rights Reserved
                </p>
                <div className={styles.paymentIcons}>
                    <img
                        src="https://img.icons8.com/color/48/visa.png"
                        alt="Visa"
                    />
                    <img
                        src="https://img.icons8.com/color/48/mastercard.png"
                        alt="Mastercard"
                    />
                    <img
                        src="https://img.icons8.com/color/48/discover.png"
                        alt="Discover"
                    />
                    <img
                        src="https://img.icons8.com/color/48/amex.png"
                        alt="Amex"
                    />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
