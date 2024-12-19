import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./RestaurantDetail.module.css";
import Dish from "../../components/Dish/Dish";
import Navbar from "../../components/Navbar/Navbar";

const RestaurantDetail = () => {
    const { restaurantId } = useParams(); // Getting the restaurant id from the URL params
    console.log(restaurantId);
    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            const query = `
                query Query($getRestaurantByIdId: ID!) {
                    getRestaurantById(id: $getRestaurantByIdId) {
                        _id
                        name
                        description
                        photos {
                            url
                        }
                        cuisines {
                            cuisines
                        }
                        reviews {
                            comment
                            rating
                        }
                        address {
                            city
                            street
                            state
                        }
                        menu {
                            name
                            price
                            imageUrl
                            dishId
                            description
                            ratings {
                                average
                            }
                            cuisine
                        }
                        estimatedDeliveryTime
                        contact {
                            phone
                            email
                        }
                        ratings {
                            average
                        }
                        hours {
                            day
                            close
                            open
                        }
                    }
                }
            `;
            const variables = { getRestaurantByIdId: restaurantId };

            try {
                const response = await fetch("http://localhost:8000/graphql", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query, variables }),
                });

                const result = await response.json();
                setRestaurant(result.data.getRestaurantById);
            } catch (error) {
                console.error("Error fetching restaurant details:", error);
            }
        };

        fetchRestaurantDetails();
    }, [restaurantId]);

    if (!restaurant) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                {/* Restaurant Details */}
                <div className={styles.header}>
                    <img
                        src={
                            restaurant.photos?.[0]?.url || "/default-image.jpg"
                        }
                        alt={restaurant.name}
                        className={styles.restaurantImage}
                    />
                    <h1 className={styles.restaurantName}>{restaurant.name}</h1>
                    <div className={styles.address}>
                        <p>
                            {restaurant.address.street},{" "}
                            {restaurant.address.city},{" "}
                            {restaurant.address.state}
                        </p>
                    </div>
                    <div className={styles.rating}>
                        <span>Rating: {restaurant.ratings.average}</span>
                        <span>
                            {" "}
                            | Estimated Delivery Time:{" "}
                            {restaurant.estimatedDeliveryTime} min
                        </span>
                    </div>
                </div>

                {/* Navbar to toggle between tabs */}
                <div className={styles.navbar}>
                    <button
                        className={
                            activeTab === "details" ? styles.activeTab : ""
                        }
                        onClick={() => setActiveTab("details")}
                    >
                        Restaurant Details & Menu
                    </button>
                    <button
                        className={
                            activeTab === "reviews" ? styles.activeTab : ""
                        }
                        onClick={() => setActiveTab("reviews")}
                    >
                        Reviews
                    </button>
                </div>

                {/* Render Tab Content */}
                {activeTab === "details" && (
                    <div className={styles.details}>
                        <div className={styles.description}>
                            <h2>Description</h2>
                            <p>{restaurant.description}</p>
                        </div>

                        <div className={styles.menuSection}>
                            <h2>Menu</h2>
                            <div className={styles.menu}>
                                {restaurant.menu.map((dish) => (
                                    <Dish
                                        dishId={dish.dishId}
                                        name={dish.name}
                                        price={dish.price}
                                        imageUrl={dish.imageUrl}
                                        description={dish.description}
                                        averageRating={dish.ratings.average}
                                        restaurantId={restaurantId}
                                        cuisine={dish.cuisine}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div className={styles.reviewsSection}>
                        <h2>Reviews</h2>
                        <div className={styles.reviews}>
                            {restaurant.reviews.map((review, index) => (
                                <div key={index} className={styles.review}>
                                    <p>{review.comment}</p>
                                    <p>Rating: {review.rating}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.addReview}>
                            <textarea placeholder="Write your review..." />
                            <button>Submit Review</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default RestaurantDetail;
