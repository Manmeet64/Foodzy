import React from "react";
import styles from "./Banner.module.css";

const Banner = () => {
    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <h1>Be The Fastest In Delivering Your Food</h1>
                <p>
                    Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed
                    Do Eiusm Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.
                </p>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Sylhet, Bangladesh"
                        className={styles.locationInput}
                    />
                    <button className={styles.getStartedButton}>
                        Get Started
                    </button>
                </div>
            </div>
            <div className={styles.foodImages}>
                <img
                    src="https://via.placeholder.com/350x350.png?text=Main+Dish"
                    alt="Main Dish"
                    className={styles.mainImage}
                />
                <img
                    src="https://via.placeholder.com/100x100.png?text=Small+Dish"
                    alt="Small Dish"
                    className={styles.smallImageTop}
                />
                <img
                    src="https://via.placeholder.com/80x80.png?text=Salad"
                    alt="Salad"
                    className={styles.smallImageBottom}
                />
            </div>
        </div>
    );
};

export default Banner;
