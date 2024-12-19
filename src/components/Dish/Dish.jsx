import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Dish.module.css";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken"; // Custom hook to get Firebase ID token

const Dish = ({
    dishId,
    name,
    price,
    description,
    imageUrl,
    ratings,
    restaurantId,
    cuisine,
}) => {
    const [quantity, setQuantity] = useState(0); // Initially, the quantity is 0
    const idToken = useFirebaseIdToken(); // Get the Firebase ID token from the custom hook
    console.log(idToken);
    const handleAddToCart = async () => {
        if (quantity === 0) {
            setQuantity(1); // Start from 1 when clicked "Add to Cart"
        } else {
            setQuantity(quantity + 1); // Increment the quantity by 1
        }

        // Send a POST request to create the order or update the order
        try {
            const response = await fetch(
                "http://localhost:8000/orders/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`, // Add authorization token
                    },
                    body: JSON.stringify({
                        dish: {
                            dishId,
                            name,
                            description,
                            quantity: 1, // Always add 1 when adding to cart
                            price,
                            cuisine, // You may want to adjust this based on your data
                            imageUrl,
                        },
                        restaurantId,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                console.log("Order created/updated:", data);
            } else {
                console.error("Error creating/updating order:", data);
            }
        } catch (error) {
            console.error("Error creating/updating order:", error);
        }
    };

    const handleRemoveFromCart = async () => {
        if (quantity === 0) return; // If quantity is 0, don't do anything

        // Decrease quantity by 1 if it's greater than 1, otherwise set quantity to 0
        const newQuantity = quantity > 1 ? quantity - 1 : 0;
        setQuantity(newQuantity); // Update the local state

        try {
            const response = await fetch(
                "http://localhost:8000/orders/delete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`, // Add authorization token
                    },
                    body: JSON.stringify({
                        restaurantId,
                        dish: {
                            dishId,
                            name,
                            description,
                            quantity: 1, // Pass the updated quantity (0 if removed)
                            price,
                            cuisine,
                            imageUrl,
                        },
                    }),
                }
            );

            // Check if the response is ok (status 200-299)
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting order item:", error);
        }
    };

    return (
        <div className={styles.card}>
            <img
                src={imageUrl || "https://via.placeholder.com/200"}
                alt={name}
                className={styles.image}
            />
            <div className={styles.details}>
                <h2 className={styles.name}>{name}</h2>
                <p className={styles.description}>{description}</p>
                <div className={styles.ratings}>
                    <span>Rating: {ratings?.average} ⭐</span>
                </div>
                <div className={styles.price}>
                    <span>₹{price.toFixed(2)}</span>
                </div>

                {/* Button functionality */}
                <div className={styles.buttonContainer}>
                    {quantity === 0 ? (
                        <button
                            className={styles.addToCartButton}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <div className={styles.quantityControls}>
                            <span className={styles.quantityGroup}>
                                <button
                                    className={styles.changeQuantityButton}
                                    onClick={handleRemoveFromCart}
                                >
                                    -
                                </button>
                                <span className={styles.quantity}>
                                    {quantity}
                                </span>
                                <button
                                    className={styles.changeQuantityButton}
                                    onClick={handleAddToCart}
                                >
                                    +
                                </button>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

Dish.propTypes = {
    dishId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    ratings: PropTypes.shape({
        average: PropTypes.number.isRequired,
    }).isRequired,
    restaurantId: PropTypes.string.isRequired, // Ensure restaurantId is passed as a prop
};

Dish.defaultProps = {
    imageUrl: "https://via.placeholder.com/200", // Placeholder image if not provided
};

export default Dish;
