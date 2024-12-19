import React, { useState } from "react";
import styles from "./DeliveryAgent.module.css";

const DeliveryAgent = ({ id, name, phone, location, canReview }) => {
    const [showReview, setShowReview] = useState(false);
    const [review, setReview] = useState("");

    const handleSubmitReview = () => {
        // TODO: Implement review submission
        console.log("Review submitted:", review);
        setShowReview(false);
        setReview("");
    };

    return (
        <div className={styles.agentCard}>
            <div className={styles.avatarContainer}>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9_A5tpT-_fVYZJFGZIxL50Vibb8-RTGRx7A&s"
                    alt="Delivery Agent"
                    className={styles.avatar}
                />
            </div>

            <div className={styles.agentInfo}>
                <h3>{name} is delivering your food</h3>
                <div className={styles.details}>
                    <p>
                        <span>📱</span> {phone}
                    </p>
                    <p>
                        <span>📍</span> {location}
                    </p>
                </div>

                {canReview &&
                    (!showReview ? (
                        <button
                            className={styles.reviewButton}
                            onClick={() => setShowReview(true)}
                        >
                            Write Review
                        </button>
                    ) : (
                        <div className={styles.reviewSection}>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Write your review here..."
                                className={styles.reviewInput}
                            />
                            <button
                                className={styles.sendButton}
                                onClick={handleSubmitReview}
                            >
                                Send
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default DeliveryAgent;
