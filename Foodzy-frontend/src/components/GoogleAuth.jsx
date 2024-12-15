import React from "react";
import { googleSignIn } from "../../firebase.js";
import styles from "../pages/Auth/SignUp/SignUp.module.css";

const GoogleAuth = () => {
    const handleGoogleSignIn = async () => {
        try {
            const user = await googleSignIn();
            console.log("User signed in:", user);

            // Retrieve the Firebase ID token
            const idToken = await user.getIdToken(true);
            console.log("Firebase ID Token google:", idToken);
            alert(`Welcome, ${user.displayName}!`);
        } catch (error) {
            console.error("Sign-In Error:", error);
            alert("Failed to sign in with Google.");
        }
    };

    return (
        <button onClick={handleGoogleSignIn} className={styles.submitButton}>
            Sign in with <i class="fa-brands fa-google"></i>
        </button>
    );
};

export default GoogleAuth;
