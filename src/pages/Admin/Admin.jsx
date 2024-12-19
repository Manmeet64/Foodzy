import React, { useState } from "react";
import styles from "./Admin.module.css";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken";

const Admin = () => {
    const idToken = useFirebaseIdToken();
    console.log(idToken);
    const [restaurantData, setRestaurantData] = useState({
        name: "",
        description: "",
        address: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
        },
        contact: {
            phone: "",
            email: "",
        },
        hours: {
            day: "",
            open: "",
            close: "",
        },
        estimatedDeliveryTime: "",
        ratings: {
            average: 0,
            count: 0,
        },
        photos: [
            {
                photoId: "1",
                url: "",
            },
            {
                photoId: "2",
                url: "",
            },
            {
                photoId: "3",
                url: "",
            },
        ],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const cuisineOptions = [
        "Indian",
        "Chinese",
        "Mexican",
        "Japanese",
        "Mediterranean",
        "American",
        "Thai",
    ];

    const [menuItems, setMenuItems] = useState([
        {
            name: "",
            description: "",
            price: "",
            cuisine: "",
            imageUrl: "",
            ratings: { average: 0, count: 0 },
        },
        {
            name: "",
            description: "",
            price: "",
            cuisine: "",
            imageUrl: "",
            ratings: { average: 0, count: 0 },
        },
        {
            name: "",
            description: "",
            price: "",
            cuisine: "",
            imageUrl: "",
            ratings: { average: 0, count: 0 },
        },
    ]);

    const handlePhotoChange = (index, url) => {
        setRestaurantData((prev) => ({
            ...prev,
            photos: prev.photos.map((photo, i) =>
                i === index ? { ...photo, url } : photo
            ),
        }));
    };

    const handleCuisineChange = (cuisine) => {
        setSelectedCuisines((prev) => {
            if (prev.includes(cuisine)) {
                return prev.filter((c) => c !== cuisine);
            }
            return [...prev, cuisine];
        });
    };

    const handleMenuItemChange = (index, field, value) => {
        const newMenuItems = [...menuItems];
        newMenuItems[index][field] = value;
        setMenuItems(newMenuItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const restaurantDataToSubmit = {
                ...restaurantData,
                photos: restaurantData.photos.filter((photo) => photo.url),
            };

            const response = await fetch(
                "http://localhost:8000/admin/restaurants",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify(restaurantDataToSubmit),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create restaurant");
            }

            const restaurantResponse = await response.json();
            const restaurantId = restaurantResponse.restaurant._id;

            const menuData = {
                dishes: menuItems.map((item) => ({
                    name: item.name,
                    description: item.description,
                    price: parseFloat(item.price),
                    cuisine: item.cuisine,
                    ratings: item.ratings,
                    imageUrl: item.imageUrl,
                })),
            };

            const menuResponse = await fetch(
                `http://localhost:8000/menus/${restaurantId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify(menuData),
                }
            );

            if (!menuResponse.ok) throw new Error("Failed to create menu");

            const cuisineResponse = await fetch(
                `http://localhost:8000/cuisines/${restaurantId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ cuisines: selectedCuisines }),
                }
            );

            if (!cuisineResponse.ok)
                throw new Error("Failed to create cuisines");

            setRestaurantData({
                name: "",
                description: "",
                address: {
                    street: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    country: "",
                },
                contact: {
                    phone: "",
                    email: "",
                },
                hours: {
                    day: "",
                    open: "",
                    close: "",
                },
                estimatedDeliveryTime: "",
                ratings: {
                    average: 0,
                    count: 0,
                },
                photos: [
                    {
                        photoId: "1",
                        url: "",
                    },
                    {
                        photoId: "2",
                        url: "",
                    },
                    {
                        photoId: "3",
                        url: "",
                    },
                ],
            });
            setSelectedCuisines([]);
            setMenuItems([
                {
                    name: "",
                    description: "",
                    price: "",
                    cuisine: "",
                    imageUrl: "",
                    ratings: { average: 0, count: 0 },
                },
                {
                    name: "",
                    description: "",
                    price: "",
                    cuisine: "",
                    imageUrl: "",
                    ratings: { average: 0, count: 0 },
                },
                {
                    name: "",
                    description: "",
                    price: "",
                    cuisine: "",
                    imageUrl: "",
                    ratings: { average: 0, count: 0 },
                },
            ]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.adminWrapper}>
            <div className={styles.adminContent}>
                <h2 className={styles.formTitle}>Add New Restaurant</h2>
                <form onSubmit={handleSubmit} className={styles.adminForm}>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Restaurant Name</label>
                            <input
                                type="text"
                                value={restaurantData.name}
                                onChange={(e) =>
                                    setRestaurantData({
                                        ...restaurantData,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Description</label>
                            <textarea
                                value={restaurantData.description}
                                onChange={(e) =>
                                    setRestaurantData({
                                        ...restaurantData,
                                        description: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className={styles.photoSection}>
                            <label>Restaurant Photos (URLs)</label>
                            <div className={styles.photoGrid}>
                                {restaurantData.photos.map((photo, index) => (
                                    <div
                                        key={photo.photoId}
                                        className={styles.inputGroup}
                                    >
                                        <input
                                            type="text"
                                            value={photo.url}
                                            onChange={(e) =>
                                                handlePhotoChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Enter URL for ${photo.description}`}
                                        />
                                        <small>{photo.description}</small>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.addressSection}>
                            <h3>Address</h3>
                            <div className={styles.addressGrid}>
                                {Object.keys(restaurantData.address).map(
                                    (field) => (
                                        <div
                                            key={field}
                                            className={styles.inputGroup}
                                        >
                                            <label>
                                                {field.charAt(0).toUpperCase() +
                                                    field.slice(1)}
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    restaurantData.address[
                                                        field
                                                    ]
                                                }
                                                onChange={(e) =>
                                                    setRestaurantData({
                                                        ...restaurantData,
                                                        address: {
                                                            ...restaurantData.address,
                                                            [field]:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className={styles.contactSection}>
                            <h3>Contact Information</h3>
                            <div className={styles.contactGrid}>
                                <div className={styles.inputGroup}>
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        value={restaurantData.contact.phone}
                                        onChange={(e) =>
                                            setRestaurantData({
                                                ...restaurantData,
                                                contact: {
                                                    ...restaurantData.contact,
                                                    phone: e.target.value,
                                                },
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={restaurantData.contact.email}
                                        onChange={(e) =>
                                            setRestaurantData({
                                                ...restaurantData,
                                                contact: {
                                                    ...restaurantData.contact,
                                                    email: e.target.value,
                                                },
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.hoursSection}>
                            <h3>Operating Hours</h3>
                            <div className={styles.hoursGrid}>
                                <div className={styles.inputGroup}>
                                    <label>Days</label>
                                    <input
                                        type="text"
                                        value={restaurantData.hours.day}
                                        onChange={(e) =>
                                            setRestaurantData({
                                                ...restaurantData,
                                                hours: {
                                                    ...restaurantData.hours,
                                                    day: e.target.value,
                                                },
                                            })
                                        }
                                        placeholder="e.g., Monday-Sunday"
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Opening Time</label>
                                    <input
                                        type="time"
                                        value={restaurantData.hours.open}
                                        onChange={(e) =>
                                            setRestaurantData({
                                                ...restaurantData,
                                                hours: {
                                                    ...restaurantData.hours,
                                                    open: e.target.value,
                                                },
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Closing Time</label>
                                    <input
                                        type="time"
                                        value={restaurantData.hours.close}
                                        onChange={(e) =>
                                            setRestaurantData({
                                                ...restaurantData,
                                                hours: {
                                                    ...restaurantData.hours,
                                                    close: e.target.value,
                                                },
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Estimated Delivery Time</label>
                            <input
                                type="text"
                                value={restaurantData.estimatedDeliveryTime}
                                onChange={(e) =>
                                    setRestaurantData({
                                        ...restaurantData,
                                        estimatedDeliveryTime: e.target.value,
                                    })
                                }
                                placeholder="e.g., 30-45 minutes"
                                required
                            />
                        </div>

                        <div className={styles.cuisineSection}>
                            <h3>Cuisines</h3>
                            <div className={styles.cuisineOptions}>
                                {cuisineOptions.map((cuisine) => (
                                    <div
                                        key={cuisine}
                                        className={`${styles.cuisineOption} ${
                                            selectedCuisines.includes(cuisine)
                                                ? styles.selected
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleCuisineChange(cuisine)
                                        }
                                    >
                                        {cuisine}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.menuSection}>
                            <h3>Menu Items</h3>
                            {menuItems.map((item, index) => (
                                <div key={index} className={styles.menuItem}>
                                    <h4>Dish {index + 1}</h4>
                                    <div className={styles.menuItemGrid}>
                                        <div className={styles.inputGroup}>
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) =>
                                                    handleMenuItemChange(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Description</label>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleMenuItemChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.price}
                                                onChange={(e) =>
                                                    handleMenuItemChange(
                                                        index,
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Cuisine</label>
                                            <select
                                                value={item.cuisine}
                                                onChange={(e) =>
                                                    handleMenuItemChange(
                                                        index,
                                                        "cuisine",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Select Cuisine
                                                </option>
                                                {cuisineOptions.map(
                                                    (cuisine) => (
                                                        <option
                                                            key={cuisine}
                                                            value={cuisine}
                                                        >
                                                            {cuisine}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Dish Image URL</label>
                                            <input
                                                type="text"
                                                value={item.imageUrl}
                                                onChange={(e) =>
                                                    handleMenuItemChange(
                                                        index,
                                                        "imageUrl",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter dish image URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Restaurant"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin;
