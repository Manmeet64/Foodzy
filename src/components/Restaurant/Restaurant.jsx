// Restaurant.jsx
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./Restaurant.module.css";

const Restaurant = ({
    restaurantId,
    name,
    description,
    photos,
    ratings,
    cuisines,
}) => {
    const navigate = useNavigate();

    const handleViewMenus = () => {
        navigate(`/search/${restaurantId}`);
    };

    return (
        <div className={styles.card}>
            <img
                src={photos?.[0] || "https://via.placeholder.com/400x220"}
                alt={`${name}`}
                className={styles.image}
            />
            <div className={styles.content}>
                <div>
                    <h2 className={styles.title}>{name}</h2>
                    {cuisines && cuisines.length > 0 && (
                        <div className={styles.cuisineContainer}>
                            {cuisines.map((cuisine, index) => (
                                <span key={index} className={styles.cuisineTag}>
                                    {cuisine}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className={styles.infoSection}>
                        <p className={styles.description}>{description}</p>
                        <div className={styles.ratings}>
                            <i className="fas fa-star"></i>
                            <span className={styles.ratingValue}>
                                {ratings.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    className={styles.viewMenusButton}
                    onClick={handleViewMenus}
                >
                    View Menus
                </button>
            </div>
        </div>
    );
};

Restaurant.propTypes = {
    restaurantId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    photos: PropTypes.arrayOf(PropTypes.string),
    ratings: PropTypes.number.isRequired,
    cuisines: PropTypes.arrayOf(PropTypes.string),
};

Restaurant.defaultProps = {
    description: "No description available.",
    photos: [],
    cuisines: [],
};

export default Restaurant;
