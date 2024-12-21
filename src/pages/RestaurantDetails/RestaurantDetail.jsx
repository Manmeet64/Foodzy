import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./RestaurantDetail.module.css";
import {
    Container,
    Box,
    Typography,
    Tab,
    Rating,
    Paper,
    Grid,
    TextField,
    Button,
    Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Dish from "../../components/Dish/Dish";
import Navbar from "../../components/Navbar/Navbar";

const HeroSection = styled(Box)({
    position: "relative",
    height: "45vh",
    width: "90%",
    margin: "20px auto 0",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
});

const HeroOverlay = styled(motion.div)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
        "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
    zIndex: 1,
});

const HeroImage = styled("img")({
    width: "100%",
    height: "100%",
    objectFit: "cover",
});

const RestaurantInfoSection = styled(motion.div)({
    background: "white",
    borderRadius: "20px",
    padding: "32px",
    margin: "-60px 5% 0",
    position: "relative",
    zIndex: 2,
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
});

const RestaurantName = styled(Typography)({
    background: "linear-gradient(135deg, #2d3436 0%, #5e8777 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    fontSize: "2.5rem",
    marginBottom: "24px",
    textAlign: "center",
});

const InfoChip = styled(motion.div)(({ theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 16px",
    borderRadius: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    color: "#5e8777",
    margin: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    "& svg": {
        marginRight: "8px",
        color: "#5e8777",
    },
}));

const TabContainer = styled(Paper)({
    position: "sticky",
    top: 70,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    marginBottom: 24,
});

const StyledTab = styled(Tab)({
    color: "#333",
    fontWeight: 600,
    fontSize: "1rem",
    textTransform: "none",
    "&.Mui-selected": {
        color: "#5e8777",
    },
});

const ReviewCard = styled(motion.div)(({ rating }) => ({
    padding: "24px",
    marginBottom: "16px",
    borderRadius: "16px",
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: `2px solid ${
        rating >= 4 ? "#4CAF50" : rating >= 3 ? "#FFC107" : "#FF5252"
    }`,
    transition: "transform 0.2s ease",
    "&:hover": {
        transform: "translateY(-4px)",
    },
}));

const RatingBadge = styled(Box)(({ rating }) => ({
    padding: "6px 12px",
    borderRadius: "12px",
    color: "white",
    fontWeight: "600",
    backgroundColor:
        rating >= 4 ? "#4CAF50" : rating >= 3 ? "#FFC107" : "#FF5252",
}));

const RestaurantDetail = () => {
    const { restaurantId } = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    if (!restaurant) {
        return (
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h5">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.container}>
            <Navbar />

            <div className={styles.header}>
                <img
                    src={restaurant.photos?.[0]?.url || "/default-image.jpg"}
                    alt={restaurant.name}
                    className={styles.restaurantImage}
                />
            </div>

            <div className={styles.restaurantInfo}>
                <Container maxWidth="lg">
                    <RestaurantName variant="h3">
                        {restaurant.name}
                    </RestaurantName>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                                mb: 3,
                            }}
                        >
                            <InfoChip variants={itemVariants}>
                                <RatingBadge
                                    rating={restaurant.ratings.average}
                                >
                                    <StarIcon sx={{ fontSize: 18, mr: 0.5 }} />
                                    {restaurant.ratings.average}
                                </RatingBadge>
                            </InfoChip>
                            <InfoChip variants={itemVariants}>
                                <AccessTimeIcon />
                                {restaurant.estimatedDeliveryTime} min
                            </InfoChip>
                            <InfoChip variants={itemVariants}>
                                <LocationOnIcon />
                                {`${restaurant.address.street}, ${restaurant.address.city}`}
                            </InfoChip>
                        </Box>
                    </motion.div>
                </Container>
            </div>

            <Container
                maxWidth="lg"
                sx={{ mt: -8, position: "relative", zIndex: 2, pb: 8 }}
            >
                <TabContainer elevation={0}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <StyledTab
                            label="Menu"
                            onClick={() => setActiveTab(0)}
                        />
                        <StyledTab
                            label="Reviews"
                            onClick={() => setActiveTab(1)}
                        />
                    </Box>
                </TabContainer>

                <AnimatePresence mode="wait">
                    {activeTab === 0 && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Grid container spacing={3}>
                                {restaurant.menu.map((dish, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={dish.dishId}
                                    >
                                        <motion.div
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Dish
                                                {...dish}
                                                restaurantId={restaurantId}
                                            />
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    )}

                    {activeTab === 1 && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Box
                                sx={{ mb: 4 }}
                                className={styles.reviewInputContainer}
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Share your experience..."
                                    className={styles.reviewInput}
                                />
                                <Rating
                                    name="rating"
                                    value={rating}
                                    onChange={(event, newValue) => {
                                        setRating(newValue);
                                    }}
                                    sx={{ my: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    className={styles.submitButton}
                                >
                                    Submit Review
                                </Button>
                            </Box>

                            <Box className={styles.reviewCategories}>
                                {/* High Ratings (4-5) */}
                                {restaurant.reviews.some(
                                    (review) => review.rating >= 4
                                ) && (
                                    <div className={styles.ratingCategory}>
                                        <Typography
                                            variant="h6"
                                            className={styles.categoryTitle}
                                        >
                                            <StarIcon
                                                sx={{ color: "#4CAF50" }}
                                            />{" "}
                                            Excellent Reviews
                                        </Typography>
                                        {restaurant.reviews
                                            .filter(
                                                (review) => review.rating >= 4
                                            )
                                            .map((review, index) => (
                                                <ReviewCard
                                                    rating={review.rating}
                                                    key={index}
                                                    {...review}
                                                />
                                            ))}
                                    </div>
                                )}

                                {/* Medium Ratings (3) */}
                                {restaurant.reviews.some(
                                    (review) => review.rating === 3
                                ) && (
                                    <div className={styles.ratingCategory}>
                                        <Typography
                                            variant="h6"
                                            className={styles.categoryTitle}
                                        >
                                            <StarHalfIcon
                                                sx={{ color: "#FFC107" }}
                                            />{" "}
                                            Average Reviews
                                        </Typography>
                                        {restaurant.reviews
                                            .filter(
                                                (review) => review.rating === 3
                                            )
                                            .map((review, index) => (
                                                <ReviewCard
                                                    rating={review.rating}
                                                    key={index}
                                                    {...review}
                                                />
                                            ))}
                                    </div>
                                )}

                                {/* Low Ratings (1-2) */}
                                {restaurant.reviews.some(
                                    (review) => review.rating < 3
                                ) && (
                                    <div className={styles.ratingCategory}>
                                        <Typography
                                            variant="h6"
                                            className={styles.categoryTitle}
                                        >
                                            <StarBorderIcon
                                                sx={{ color: "#FF5252" }}
                                            />{" "}
                                            Critical Reviews
                                        </Typography>
                                        {restaurant.reviews
                                            .filter(
                                                (review) => review.rating < 3
                                            )
                                            .map((review, index) => (
                                                <ReviewCard
                                                    rating={review.rating}
                                                    key={index}
                                                    {...review}
                                                />
                                            ))}
                                    </div>
                                )}
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>
        </Box>
    );
};

export default RestaurantDetail;
