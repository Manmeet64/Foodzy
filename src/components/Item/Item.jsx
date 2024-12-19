import React from "react";
import PropTypes from "prop-types";
import styles from "./Item.module.css";

const Item = ({
    item,
    restaurantId,
    idToken,
    order,
    setOrder,
    updateTotal,
}) => {
    const handleAddToCart = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/orders/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        dish: {
                            dishId: item.dishId,
                            name: item.name,
                            quantity: 1, // Always increment by 1
                            price: item.price,
                            cuisine: item.cuisine,
                            imageUrl: item.imageUrl,
                        },
                        restaurantId,
                    }),
                }
            );

            if (response.ok) {
                const updatedOrder = { ...order };
                const itemIndex = updatedOrder.items.findIndex(
                    (orderItem) => orderItem.dishId === item.dishId
                );

                if (itemIndex !== -1) {
                    // Update quantity of the existing item
                    updatedOrder.items[itemIndex].quantity += 1;
                } else {
                    // Add a new item if it doesn't exist
                    updatedOrder.items.push({ ...item, quantity: 1 });
                }

                setOrder(updatedOrder);
                updateTotal(updatedOrder);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const handleRemoveFromCart = async () => {
        if (item.quantity === 0) return;

        try {
            const response = await fetch(
                "http://localhost:8000/orders/delete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        dish: {
                            dishId: item.dishId,
                            name: item.name,
                            quantity: 1, // Always decrement by 1
                            price: item.price,
                            cuisine: item.cuisine,
                            imageUrl: item.imageUrl,
                        },
                        restaurantId,
                    }),
                }
            );

            if (response.ok) {
                const updatedOrder = { ...order };
                const itemIndex = updatedOrder.items.findIndex(
                    (orderItem) => orderItem.dishId === item.dishId
                );

                if (itemIndex !== -1) {
                    const newQuantity =
                        updatedOrder.items[itemIndex].quantity - 1;
                    if (newQuantity === 0) {
                        // Remove the item completely if quantity reaches 0
                        updatedOrder.items.splice(itemIndex, 1);
                    } else {
                        // Update the quantity
                        updatedOrder.items[itemIndex].quantity = newQuantity;
                    }
                }

                setOrder(updatedOrder);
                updateTotal(updatedOrder);
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    return (
        <div className={styles.cartItem}>
            <div className={styles.itemImage}>
                <img
                    src={item.imageUrl || "/default-dish.png"}
                    alt={item.name}
                />
            </div>
            <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
            </div>
            <div className={styles.itemPrice}>
                ₹{(item.price * item.quantity).toFixed(2)}
            </div>
            <div className={styles.quantityControl}>
                <button onClick={handleRemoveFromCart}>-</button>
                <span>{item.quantity}</span>
                <button onClick={handleAddToCart}>+</button>
            </div>
        </div>
    );
};

Item.propTypes = {
    item: PropTypes.shape({
        dishId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        cuisine: PropTypes.string,
        imageUrl: PropTypes.string,
        quantity: PropTypes.number.isRequired,
    }).isRequired,
    restaurantId: PropTypes.string.isRequired,
    idToken: PropTypes.string.isRequired,
    order: PropTypes.shape({
        items: PropTypes.arrayOf(
            PropTypes.shape({
                dishId: PropTypes.string.isRequired,
                quantity: PropTypes.number.isRequired,
            })
        ),
    }).isRequired,
    setOrder: PropTypes.func.isRequired,
    updateTotal: PropTypes.func.isRequired,
};

export default Item;
