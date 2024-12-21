import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Cart.module.css";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken";
import Item from "../../components/Item/Item";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
    const { restaurantId } = useParams();
    const [order, setOrder] = useState(null);
    const [total, setTotal] = useState(0);
    const idToken = useFirebaseIdToken();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/orders/pending/${restaurantId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${idToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = await response.json();

                if (data.success && data.order) {
                    setOrder(data.order);
                    setTotal(data.order.totalAmount);
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };

        if (idToken) fetchOrder();
    }, [restaurantId, idToken]);

    // Function to update the total cost
    const updateTotal = (updatedOrder) => {
        const newTotal = updatedOrder.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        setTotal(newTotal);
    };

    // Calculate delivery charge based on total price
    const deliveryCharge =
        total <= 250 ? total * 0.25 : total <= 500 ? total * 0.15 : total * 0.1;

    const finalTotal = total + deliveryCharge;

    const handleCheckout = async () => {
        console.log("Proceeding to checkout");
        console.log(order);
        try {
            const response = await fetch(
                `http://localhost:8000/orders/checkout/${order.orderId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: order.items, // Include the items in the body
                        deliveryCharge, // Pass calculated delivery charge
                        restaurantId, // Pass restaurant ID
                        finalTotal,
                    }),
                }
            );

            const data = await response.json();

            if (data.id) {
                // Redirect to Stripe Checkout
                const stripe = await loadStripe(
                    "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3"
                );
                await stripe.redirectToCheckout({ sessionId: data.id });
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    return (
        <div className={styles.cartContainer}>
            <h1 className={styles.cartTitle}>My Cart</h1>
            <div className={styles.cartContent}>
                <div className={styles.itemsSection}>
                    {order?.items?.map((item) => (
                        <Item
                            key={item.id}
                            item={item}
                            restaurantId={restaurantId}
                            idToken={idToken}
                            order={order}
                            setOrder={setOrder}
                            updateTotal={updateTotal}
                        />
                    ))}
                </div>

                <div className={styles.cartActions}>
                    <div className={styles.cartSummary}>
                        <h3>Cart Total</h3>
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>
                                Delivery Charge (
                                {total <= 250
                                    ? "25%"
                                    : total <= 500
                                    ? "15%"
                                    : "10%"}
                                )
                            </span>
                            <span>₹{deliveryCharge.toFixed(2)}</span>
                        </div>
                        <div
                            className={`${styles.summaryRow} ${styles.totalRow}`}
                        >
                            <span>Total Amount</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                        <button
                            className={styles.checkoutButton}
                            onClick={handleCheckout}
                        >
                            Proceed To Checkout
                        </button>
                    </div>
                </div>

                <div className={styles.couponSection}>
                    <input type="text" placeholder="Coupon Code" />
                    <button className={styles.applyCoupon}>
                        Apply Coupon →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
