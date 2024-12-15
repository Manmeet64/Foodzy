import React, { useState } from "react";
import styles from "./ProfileForm.module.css";

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
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    const [preferences, setPreferences] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setProfilePicture(URL.createObjectURL(e.target.files[0]));
    };

    const handlePreferenceChange = (e) => {
        setPreferences(e.target.value);
    };

    const handleImageClick = () => {
        setProfilePicture(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation
        if (
            !firstName ||
            !lastName ||
            !address.street ||
            !address.city ||
            !address.state ||
            !address.postalCode ||
            !address.country
        ) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        const user = {
            name: { firstName, lastName },
            phone,
            profilePicture: profilePicture ? profilePicture.name : "",
            address: [address],
            preferences,
        };
        console.log(token);
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
                alert("Profile updated successfully");
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
            <div className={styles.profileFormContent}>
                <h2 className={styles.formTitle}>Complete Your Profile</h2>
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                    <div className={styles.profileImageWrapper}>
                        <div className={styles.profileImageContainer}>
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
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
                    <div className={styles.inputFieldWrapper}>
                        <label htmlFor="preferences">Preferences</label>
                        <select
                            id="preferences"
                            value={preferences}
                            onChange={handlePreferenceChange}
                            className={styles.inputField}
                        >
                            <option value="">Select Preference</option>
                            <option value="Italian">Italian</option>
                            <option value="Indian">Indian</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Mediterranean">Mediterranean</option>
                            <option value="American">American</option>
                        </select>
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
