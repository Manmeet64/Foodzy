import React, { useState, useEffect } from "react";
import styles from "./Search.module.css";
import Restaurant from "../../components/Restaurant/Restaurant";

const Search = () => {
    const [name, setName] = useState("");
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [minRating, setMinRating] = useState(0.0);
    const [restaurants, setRestaurants] = useState([]);

    const cuisines = [
        "Indian",
        "Chinese",
        "Mexican",
        "Japanese",
        "Mediterranean",
        "American",
        "Thai",
    ];

    const handleCuisineChange = (cuisine) => {
        setSelectedCuisines((prev) => {
            if (prev.includes(cuisine)) {
                return prev.filter((c) => c !== cuisine);
            }
            return [...prev, cuisine];
        });
    };

    const fetchRestaurants = async (
        searchName = "",
        cuisines = selectedCuisines,
        rating = minRating
    ) => {
        const query = `
        query GetRestaurants($name: String, $cuisine: [String], $minRating: Float) {
            getRestaurants(name: $name, cuisine: $cuisine, minRating: $minRating) {
                _id
                name
                description
                photos {
                    url
                }
                cuisines{
                    cuisines
                }
                ratings {
                    average
                }
            }
        }
        `;

        const variables = {
            name: searchName,
            cuisine: cuisines,
            minRating: parseFloat(rating),
        };

        try {
            const response = await fetch("http://localhost:8000/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, variables }),
            });

            const jsonResponse = await response.json();
            console.log("GraphQL Response:", jsonResponse);

            if (jsonResponse.errors) {
                console.error("GraphQL Errors:", jsonResponse.errors);
                throw new Error("Error in GraphQL response");
            }

            if (jsonResponse.data && jsonResponse.data.getRestaurants) {
                setRestaurants(jsonResponse.data.getRestaurants);
            } else {
                console.warn(
                    "No restaurants found or response structure invalid."
                );
                setRestaurants([]);
            }
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    // Live Search Effect
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            fetchRestaurants(name); // Only pass the name for live search
        }, 300); // Add a debounce delay to prevent excessive calls

        return () => clearTimeout(debounceTimeout); // Cleanup timeout on every render
    }, [name]);

    const handleSearch = () => {
        fetchRestaurants(name, selectedCuisines, minRating); // Trigger search with all filters
    };

    return (
        <div className={styles.container}>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search for restaurants"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.searchBar}
            />

            {/* Content */}
            <div className={styles.content}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <h3>Filter Search</h3>

                    {/* Cuisines */}
                    <div className={styles.filterSection}>
                        <h4>Cuisines</h4>
                        <div className={styles.cuisineOptions}>
                            {cuisines.map((cuisine) => (
                                <div
                                    key={cuisine}
                                    className={styles.cuisineOption}
                                >
                                    <input
                                        type="checkbox"
                                        id={cuisine}
                                        checked={selectedCuisines.includes(
                                            cuisine
                                        )}
                                        onChange={() =>
                                            handleCuisineChange(cuisine)
                                        }
                                    />
                                    <label htmlFor={cuisine}>{cuisine}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ratings */}
                    <div className={styles.filterSection}>
                        <h4>Ratings</h4>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                            className={styles.ratingSlider}
                        />
                        <span>Min Rating: {minRating}</span>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className={styles.searchButton}
                    >
                        Search
                    </button>
                </div>

                {/* Results */}
                <div className={styles.results}>
                    {restaurants.length > 0 ? (
                        restaurants.map((restaurant) => (
                            <Restaurant
                                key={restaurant._id}
                                restaurantId={restaurant._id}
                                name={restaurant.name}
                                description={restaurant.description}
                                photos={[restaurant.photos?.[0]?.url || ""]}
                                ratings={restaurant.ratings.average}
                                cuisines={restaurant.cuisines}
                            />
                        ))
                    ) : (
                        <p className={styles.noResults}>
                            No restaurants match your search criteria.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
