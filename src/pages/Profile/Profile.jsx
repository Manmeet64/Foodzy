import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaEdit,
    FaSave,
    FaTimes,
    FaSignOutAlt, // Icon for sign-out button
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import styles from "./Profile.module.css";
import { auth } from "../../../firebase.js"; // Import Firebase auth (ensure you have this configuration in your project)

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const idToken = useFirebaseIdToken();
    const navigate = useNavigate(); // Hook to navigate after sign-out

    useEffect(() => {
        if (idToken) {
            fetchUserProfile();
        }
    }, [idToken]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/auth/find", {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                const userData = {
                    ...result.data,
                    profilePicture: result.data.profilePicture || null,
                };
                setUser(userData);
                setEditedUser(userData);
            } else {
                toast.error(result.message || "Failed to fetch user data.");
            }
        } catch (error) {
            toast.error("Error fetching profile");
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setEditedUser((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setEditedUser((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddressChange = (e, index) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            address: prev.address.map((addr, i) =>
                i === index ? { ...addr, [name]: value } : addr
            ),
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProfilePicture(reader.result); // Store the base64 string
            };
            reader.readAsDataURL(file); // Convert file to base64 string
        }
    };

    const handleSave = async () => {
        try {
            const updatedUser = {
                ...editedUser,
                profilePicture: newProfilePicture || user.profilePicture,
            };

            const response = await fetch("http://localhost:8000/auth/edit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(updatedUser),
            });

            const result = await response.json();
            if (response.ok) {
                setUser(result.data);
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            } else {
                toast.error(result.message || "Failed to update profile.");
            }
        } catch (error) {
            toast.error("Error updating profile");
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut(); // Firebase sign-out method
            toast.success("Successfully signed out.");
            navigate("/signin"); // Redirect to sign-in page after sign-out
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    if (!idToken)
        return (
            <div className={styles.noUser}>
                <FaUser size={40} /> No logged-in user
            </div>
        );

    if (loading)
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                Loading profile...
            </div>
        );

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={
                                user.profilePicture
                                    ? user.profilePicture
                                    : "https://via.placeholder.com/150"
                            }
                            alt="Profile Avatar"
                            className={styles.avatar}
                        />
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <h2>{`${user.name.firstName} ${user.name.lastName}`}</h2>
                    <div className={styles.infoItem}>
                        <FaEnvelope className={styles.icon} />
                        <p className={styles.email}>{user.email}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <FaPhone className={styles.icon} />
                        <p className={styles.phone}>{user.phone}</p>
                    </div>
                </div>

                {isEditing ? (
                    <div className={styles.editSection}>
                        <h3>Edit Profile</h3>
                        <div className={styles.formGroup}>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="name.firstName"
                                value={editedUser.name.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="name.lastName"
                                value={editedUser.name.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={editedUser.email}
                                disabled
                                className={styles.disabledInput}
                            />
                            <small className={styles.emailNote}>
                                Email cannot be changed
                            </small>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={editedUser.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <h3>Address</h3>
                        {editedUser.address.map((addr, index) => (
                            <div key={index} className={styles.addressCard}>
                                <h4>Address {index + 1}</h4>
                                <div className={styles.addressFields}>
                                    <div className={styles.formGroup}>
                                        <label>Street</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={addr.street}
                                            onChange={(e) =>
                                                handleAddressChange(e, index)
                                            }
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={addr.city}
                                            onChange={(e) =>
                                                handleAddressChange(e, index)
                                            }
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={addr.state}
                                            onChange={(e) =>
                                                handleAddressChange(e, index)
                                            }
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={addr.postalCode}
                                            onChange={(e) =>
                                                handleAddressChange(e, index)
                                            }
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={addr.country}
                                            onChange={(e) =>
                                                handleAddressChange(e, index)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className={styles.formGroup}>
                            <label>Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className={styles.buttonGroup}>
                            <button
                                onClick={handleSave}
                                className={styles.saveBtn}
                            >
                                <FaSave /> Save
                            </button>
                            <button
                                onClick={handleEditToggle}
                                className={styles.cancelBtn}
                            >
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleEditToggle}
                        className={styles.editBtn}
                    >
                        <FaEdit /> Edit Profile
                    </button>
                )}

                <button onClick={handleSignOut} className={styles.signOutBtn}>
                    <FaSignOutAlt /> Sign Out
                </button>
            </div>
        </div>
    );
}

export default Profile;
