import React from "react";
import { googleSignIn } from "../../firebase.js";
import styles from "../pages/Auth/SignUp/SignUp.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const GoogleAuth = () => {
    const navigate = useNavigate();
    const handleGoogleSignIn = async () => {
        try {
            const user = await googleSignIn();
            console.log("User signed in:", user);
            navigate("/home");
            // Retrieve the Firebase ID token
            const idToken = await user.getIdToken(true);
            console.log("Firebase ID Token google:", idToken);
        } catch (error) {
            console.error("Sign-In Error:", error);
            toast.error("Failed to sign in with google");
        }
    };

    return (
        <button onClick={handleGoogleSignIn} className={styles.submitButton}>
            Sign in with <i class="fa-brands fa-google"></i>
        </button>
    );
};

export default GoogleAuth;
