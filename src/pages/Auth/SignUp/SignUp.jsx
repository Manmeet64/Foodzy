import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../../../components/GoogleAuth";
import styles from "./SignUp.module.css"; // Import the modular CSS file

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idToken, setIdToken] = useState(""); // State for storing the ID token
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateEmail(email)) {
            setError("Invalid email format. Please enter a valid email.");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("User registered:", userCredential.user);

            // Get the ID token after user registration
            const idToken = await userCredential.user.getIdToken(true);
            console.log("Firebase ID Token:", idToken); // Log the ID token

            setIdToken(idToken); // Set the ID token in state
            // Store the token in localStorage
            localStorage.setItem("token", idToken);

            // Navigate to the profile form page with the ID token as a query parameter
            navigate(`/profileform`);
        } catch (err) {
            console.error("Error signing up:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.signUpContainer}>
            <div className={styles.formContainer}>
                <div className={styles.formLeft}>
                    <h2>Create Account</h2>
                    <form onSubmit={handleSignUp} className={styles.signUpForm}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.inputField}
                        />
                        <div className={styles.passwordField}>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.inputField}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() =>
                                    setPasswordVisible(!passwordVisible)
                                }
                            >
                                {passwordVisible ? (
                                    <div className={styles.eye}>
                                        <i className="fa-solid fa-eye"></i>
                                    </div>
                                ) : (
                                    <div className={styles.slasheye}>
                                        <i className="fa-solid fa-eye-slash"></i>
                                    </div>
                                )}
                            </button>
                        </div>
                        {error && (
                            <p className={styles.errorMessage}>{error}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>
                    <GoogleAuth />
                </div>
                <div className={styles.formRight}>
                    <img
                        src="src/assets/logo/Foodzy3.png"
                        alt="Sign Up"
                        className={styles.signUpImage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
