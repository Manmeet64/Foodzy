import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Success from "../../components/Success/Success";
import NotificationManager from "../../components/NotificationManager";
import styles from "./TrackOrder.module.css";
import { requestFirebaseToken } from "../../../firebase.js";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken.jsx";
import Map from "../../components/Map/Map";
import DeliveryAgent from "../../components/DeliveryAgent/DeliveryAgent";

const TrackOrder = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [successRenderedOnce, setSuccessRenderedOnce] = useState(false); // New flag
    const [fcmToken, setFcmToken] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [formattedAddress, setFormattedAddress] = useState("");
    const [origin, setOrigin] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [notificationSent, setNotificationSent] = useState(false); // Prevent duplicate notifications
    const [order, setOrder] = useState(null);
    const idToken = useFirebaseIdToken();
    const { restaurantId, orderId } = useParams();
    const [deliveryAgent, setDeliveryAgent] = useState(null);
    const [orderStatus, setOrderStatus] = useState("preparing"); // Add this new state
    const navigate = useNavigate();

    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };

    const handleNewNotification = (notification) => {
        console.log("Notification received:", notification);
        console.log("Notification displayed successfully.");
    };

    // Fetch FCM Token
    useEffect(() => {
        const fetchFcmToken = async () => {
            try {
                const token = await requestFirebaseToken();
                setFcmToken(token);
            } catch (error) {
                console.error("Error fetching Firebase token:", error);
            }
        };
        fetchFcmToken();
    }, []);

    // Fetch Restaurant Data
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/admin/restaurants/${restaurantId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${idToken}`,
                        },
                    }
                );
                const data = await response.json();
                console.log("data", data);
                setRestaurant(data.restaurant);
                if (data?.restaurant?.address) {
                    const {
                        street,
                        locality,
                        city,
                        state,
                        postalCode,
                        country,
                    } = data.restaurant.address;
                    setFormattedAddress(
                        `${street}, ${locality}, ${city}, ${state}, ${postalCode}, ${country}`
                    );
                }
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
            }
        };
        if (restaurantId && idToken) {
            fetchRestaurant();
        }
    }, [restaurantId, idToken]);

    // Fetch Geocode Data
    useEffect(() => {
        if (formattedAddress) {
            const fetchGeocode = async () => {
                try {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                            formattedAddress
                        )}&key=AIzaSyCi7wvXEC0r0td0KSSoeXzJNrUv5fYMNgw`
                    );
                    const data = await response.json();
                    if (data.status === "OK" && data.results.length > 0) {
                        const { lat, lng } = data.results[0].geometry.location;
                        // Validate lat and lng
                        if (
                            typeof lat === "number" &&
                            typeof lng === "number"
                        ) {
                            setOrigin({ latitude: lat, longitude: lng });
                        } else {
                            console.error("Invalid latitude or longitude");
                        }
                    } else {
                        console.error("No results found for geocoding.");
                    }
                } catch (error) {
                    console.error("Error fetching geocoding data:", error);
                }
            };
            fetchGeocode();
        }
    }, [formattedAddress]);

    // Send Notification and Show Success
    useEffect(() => {
        if (fcmToken && !notificationSent) {
            const sendNotification = async () => {
                try {
                    const response = await fetch(
                        "http://localhost:8000/notification/send-notification",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${idToken}`,
                            },
                            body: JSON.stringify({
                                token: fcmToken,
                                title: "Foodzy",
                                body: "Order Confirmed!!",
                            }),
                        }
                    );
                    if (response.ok) {
                        console.log("Notification sent successfully.");
                        setShowSuccess(true); // Show success after notification is sent
                        setNotificationSent(true); // Avoid duplicate notifications
                    } else {
                        console.error("Failed to send notification");
                    }
                } catch (error) {
                    console.error("Error sending notification:", error);
                }
            };
            sendNotification();
        }
    }, [fcmToken, idToken, notificationSent]);

    // Control Success Rendering
    useEffect(() => {
        if (showSuccess && !successRenderedOnce) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
                setSuccessRenderedOnce(true); // Ensure success renders only once
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [showSuccess, successRenderedOnce]);

    // Control Map Rendering After Success Component
    useEffect(() => {
        if (!showSuccess && successRenderedOnce && origin) {
            setShowMap(true); // Enable map rendering only after success is fully rendered
        }
    }, [showSuccess, successRenderedOnce, origin]);

    // Confirm Order
    useEffect(() => {
        const confirmOrder = async () => {
            try {
                await fetch(`http://localhost:8000/orders/confirm/${orderId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                });
            } catch (error) {
                console.error("Error confirming order:", error);
            }
        };

        if (orderId && idToken) {
            confirmOrder();
        }
    }, [orderId, idToken]);

    // Fetch Order Details
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/orders/${orderId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${idToken}`,
                        },
                    }
                );
                const data = await response.json();
                setOrder(data.order);
            } catch (error) {
                console.error("Error fetching order details:", error);
            }
        };

        if (orderId && idToken) {
            fetchOrder();
        }
    }, [orderId, idToken]);

    // Fetch Delivery Agent Details
    useEffect(() => {
        const fetchDeliveryAgent = async () => {
            console.log("restaurant", restaurant.restaurantId);
            try {
                const response = await fetch(
                    `http://localhost:8000/delivery/${restaurant.restaurantId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = await response.json();
                if (data.success) {
                    console.log("data", data);
                    console.log(data.agent);
                    setDeliveryAgent(data.agent);
                }
            } catch (error) {
                console.error("Error fetching delivery agent:", error);
            }
        };

        if (restaurant?.restaurantId && idToken) {
            fetchDeliveryAgent();
        }
    }, [restaurant, idToken]);

    // Add this new useEffect for status changes
    useEffect(() => {
        // Change to "out for delivery" after 10 seconds
        const deliveryTimer = setTimeout(async () => {
            setOrderStatus("out-for-delivery");

            // Send notification for out for delivery
            try {
                await fetch(
                    "http://localhost:8000/notification/send-notification",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${idToken}`,
                        },
                        body: JSON.stringify({
                            token: fcmToken,
                            title: "Foodzy",
                            body: "Your Order Is Out For Delivery",
                        }),
                    }
                );
            } catch (error) {
                console.error(
                    "Error sending out for delivery notification:",
                    error
                );
            }

            // Change to "delivered" after another 10 seconds
            const completionTimer = setTimeout(async () => {
                setOrderStatus("delivered");

                try {
                    // Send status update request
                    await fetch(
                        `http://localhost:8000/orders/change/${orderId}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${idToken}`,
                            },
                            body: JSON.stringify({ status: "delivered" }),
                        }
                    );

                    // Send delivery notification
                    await fetch(
                        "http://localhost:8000/notification/send-notification",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${idToken}`,
                            },
                            body: JSON.stringify({
                                token: fcmToken,
                                title: "Foodzy",
                                body: "Order is delivered",
                            }),
                        }
                    );
                } catch (error) {
                    console.error("Error updating order status:", error);
                }
            }, 10000);

            return () => clearTimeout(completionTimer);
        }, 10000);

        return () => clearTimeout(deliveryTimer);
    }, [fcmToken, idToken, orderId]); // Added orderId to dependencies

    const handleCancelOrder = async () => {
        try {
            // Send status update request
            await fetch(`http://localhost:8000/orders/change/${orderId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({ status: "cancelled" }),
            });

            // Send cancellation notification
            await fetch(
                "http://localhost:8000/notification/send-notification",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        token: fcmToken,
                        title: "Foodzy",
                        body: "Order cancelled",
                    }),
                }
            );

            // Update local status
            setOrderStatus("cancelled");
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };

    const handleKeepEating = () => {
        navigate("/home"); // Changed to navigate to /home
    };

    return (
        <div className={styles.trackOrderContainer}>
            <NotificationManager onNewNotification={handleNewNotification} />
            {showSuccess && (
                <div className={styles.overlay}>
                    <Success onClose={handleCloseSuccess} />
                </div>
            )}

            {restaurant && (
                <h1 className={styles.restaurantTitle}>
                    {restaurant.name} is preparing your order
                </h1>
            )}

            <div className={styles.orderStatus}>
                <div className={`${styles.statusItem} ${styles.active}`}>
                    <div className={styles.statusIcon}>✓</div>
                    <span>Order Confirmed</span>
                </div>
                <div className={`${styles.statusItem} ${styles.active}`}>
                    <div className={styles.statusIcon}>👨‍🍳</div>
                    <span>Order Preparing</span>
                </div>
                <div
                    className={`${styles.statusItem} ${
                        orderStatus === "out-for-delivery" ||
                        orderStatus === "delivered"
                            ? styles.active
                            : ""
                    }`}
                >
                    <div className={styles.statusIcon}>🚚</div>
                    <span>Out For Delivery</span>
                </div>
                <div
                    className={`${styles.statusItem} ${
                        orderStatus === "delivered" ? styles.active : ""
                    }`}
                >
                    <div className={styles.statusIcon}>📦</div>
                    <span>Delivered</span>
                </div>
            </div>

            <div className={styles.contentWrapper}>
                {origin && showMap && (
                    <div className={styles.mapContainer}>
                        <Map origin={origin} />
                    </div>
                )}

                <div className={styles.orderDetailsSection}>
                    {order && (
                        <div className={styles.orderDetailsCard}>
                            <div className={styles.orderHeader}>
                                <div>
                                    <h2>Order Details</h2>
                                    <span className={styles.orderIdBadge}>
                                        #{order.orderId}
                                    </span>
                                </div>
                                <button
                                    className={styles.cancelOrderBtn}
                                    onClick={handleCancelOrder}
                                    disabled={
                                        orderStatus === "delivered" ||
                                        orderStatus === "cancelled"
                                    }
                                >
                                    Cancel Order
                                </button>
                            </div>
                            <div className={styles.orderItems}>
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className={styles.orderItem}
                                    >
                                        <div className={styles.itemInfo}>
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className={styles.itemImage}
                                            />
                                            <div className={styles.itemDetails}>
                                                <h3>{item.name}</h3>
                                                <p className={styles.cuisine}>
                                                    {item.cuisine}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.itemMetrics}>
                                            <span className={styles.quantity}>
                                                x{item.quantity}
                                            </span>
                                            <span className={styles.price}>
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.orderTotal}>
                                <span>Total Amount</span>
                                <span className={styles.totalAmount}>
                                    ₹{order.totalAmount}
                                </span>
                            </div>
                        </div>
                    )}

                    {deliveryAgent && !showSuccess && successRenderedOnce && (
                        <div className={styles.deliveryAgentCard}>
                            <DeliveryAgent
                                id={deliveryAgent.id}
                                name={deliveryAgent.name}
                                phone={deliveryAgent.phone}
                                location={deliveryAgent.current_location}
                                canReview={orderStatus === "delivered"}
                            />
                        </div>
                    )}
                </div>

                {orderStatus === "delivered" && (
                    <button
                        className={styles.keepEatingButton}
                        onClick={handleKeepEating}
                    >
                        Keep Eating
                    </button>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
