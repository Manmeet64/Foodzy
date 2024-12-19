import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Carts.module.css";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken"; // Assuming this hook gets Firebase ID token

const Carts = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const idToken = useFirebaseIdToken(); // Get the Firebase ID token from the custom hook

    useEffect(() => {
        // Fetch the pending orders of the user from the API
        const fetchOrders = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/orders/pending",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${idToken}`, // Pass Firebase ID token in headers
                        },
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    setOrders(data.orders); // Set the orders received from the API
                } else {
                    console.error("Error fetching orders:", data.message);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        // Only fetch if idToken is available
        if (idToken) {
            fetchOrders();
        } else {
            console.error("No Firebase ID token found");
        }
    }, [idToken]); // Dependency on idToken, re-fetch orders when it changes

    const handleViewCart = (restaurantId) => {
        navigate(`/cart/${restaurantId}`); // Navigate to the cart page of the selected restaurant
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>My Carts</h1>
            {orders.length > 0 ? (
                <div className={styles.ordersList}>
                    {orders.map((order) => (
                        <div key={order._id} className={styles.cartRow}>
                            <div className={styles.restaurantInfo}>
                                <img
                                    src={
                                        order.restaurantImage ||
                                        "https://via.placeholder.com/50"
                                    }
                                    alt={order.restaurantName}
                                    className={styles.restaurantImage}
                                />
                                <div className={styles.restaurantName}>
                                    {order.restaurantName}
                                </div>
                            </div>
                            <button
                                className={styles.viewCartButton}
                                onClick={() =>
                                    handleViewCart(order.restaurantId)
                                }
                            >
                                View Cart
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyCart}>
                    You have no pending orders!
                </div>
            )}
        </div>
    );
};

export default Carts;
