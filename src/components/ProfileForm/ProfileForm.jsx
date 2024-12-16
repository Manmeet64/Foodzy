import React, { useState, useEffect } from "react";
import styles from "./ProfileForm.module.css";
import NotificationManager from "../NotificationManager";
import { requestFirebaseToken } from "../../../firebase.js";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });
    const token = localStorage.getItem("token");
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fcmToken, setFcmToken] = useState(null);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const cuisineOptions = [
        "Italian",
        "Chinese",
        "Mexican",
        "Japanese",
        "Mediterranean",
        "American",
        "Thai",
    ];

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

    const handleNewNotification = (notification) => {
        setNotification(notification);
        navigate("/home");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
    };

    const handleCuisineChange = (cuisine) => {
        setSelectedCuisines((prev) => {
            if (prev.includes(cuisine)) {
                return prev.filter((c) => c !== cuisine);
            }
            return [...prev, cuisine];
        });
    };

    const handleImageClick = () => {
        setProfilePicture(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (
            !firstName ||
            !lastName ||
            !address.street ||
            !address.city ||
            !address.state ||
            !address.postalCode ||
            !address.country ||
            selectedCuisines.length === 0
        ) {
            setError(
                "Please fill in all required fields and select at least one cuisine preference."
            );
            setLoading(false);
            return;
        }

        const user = {
            name: { firstName, lastName },
            phone,
            address: [address],
            preferences: {
                cuisines: selectedCuisines,
            },
        };

        try {
            const response = await fetch("http://localhost:8000/auth/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const userData = await response.json();

                if (profilePicture) {
                    const formData = new FormData();
                    formData.append("profilePicture", profilePicture);

                    const uploadResponse = await fetch(
                        "http://localhost:8000/user/profile-picture",
                        {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                        }
                    );

                    if (uploadResponse.ok) {
                        if (fcmToken) {
                            const notificationResponse = await fetch(
                                "http://localhost:8000/notification/send-notification",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        token: fcmToken,
                                        title: "Foodzy",
                                        body: `Welcome ${firstName}`,
                                    }),
                                }
                            );

                            if (!notificationResponse.ok) {
                                console.error("Failed to send notification");
                            }
                        }
                    } else {
                        setError("Failed to upload profile picture.");
                    }
                }
                navigate("/home");
            } else {
                const data = await response.json();
                setError(data.message || "Something went wrong.");
            }
        } catch (err) {
            setError("An error occurred while updating the profile.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.profileFormWrapper}>
            <NotificationManager onNewNotification={handleNewNotification} />
            <div className={styles.profileFormContent}>
                <h2 className={styles.formTitle}>Complete Your Profile</h2>
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                    <div className={styles.profileImageWrapper}>
                        <div className={styles.profileImageContainer}>
                            {profilePicture ? (
                                <img
                                    src={URL.createObjectURL(profilePicture)}
                                    alt="Profile"
                                    className={styles.profileImage}
                                    onClick={handleImageClick}
                                />
                            ) : (
                                <div
                                    className={styles.profileImagePlaceholder}
                                    onClick={() =>
                                        document
                                            .getElementById("profilePicture")
                                            .click()
                                    }
                                >
                                    <span className={styles.plusIcon}>+</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={styles.inputFile}
                            style={{ display: "none" }}
                        />
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.inputFieldWrapper}>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.inputFieldWrapper}>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className={styles.inputField}
                            />
                        </div>
                    </div>

                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="street">Street Address</label>
                        <input
                            type="text"
                            id="street"
                            value={address.street}
                            onChange={(e) =>
                                setAddress({
                                    ...address,
                                    street: e.target.value,
                                })
                            }
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            value={address.city}
                            onChange={(e) =>
                                setAddress({ ...address, city: e.target.value })
                            }
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="state">State</label>
                        <input
                            type="text"
                            id="state"
                            value={address.state}
                            onChange={(e) =>
                                setAddress({
                                    ...address,
                                    state: e.target.value,
                                })
                            }
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="postalCode">Postal Code</label>
                        <input
                            type="text"
                            id="postalCode"
                            value={address.postalCode}
                            onChange={(e) =>
                                setAddress({
                                    ...address,
                                    postalCode: e.target.value,
                                })
                            }
                            required
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            value={address.country}
                            onChange={(e) =>
                                setAddress({
                                    ...address,
                                    country: e.target.value,
                                })
                            }
                            required
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.cuisinePreferencesSection}>
                        <label>Cuisine Preferences</label>
                        <div className={styles.cuisineOptions}>
                            {cuisineOptions.map((cuisine) => (
                                <div
                                    key={cuisine}
                                    className={`${styles.cuisineOption} ${
                                        selectedCuisines.includes(cuisine)
                                            ? styles.selected
                                            : ""
                                    }`}
                                    onClick={() => handleCuisineChange(cuisine)}
                                >
                                    {cuisine}
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? "Updating..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
