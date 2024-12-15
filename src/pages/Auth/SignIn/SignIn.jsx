import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../../../components/GoogleAuth";
import styles from "../SignUp/SignUp.module.css"; // Use the same CSS module as SignUp
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("User logged in:", userCredential.user);
            const idToken = await userCredential.user.getIdToken();
            console.log("Firebase ID Token:", idToken); // Log the ID token
            navigate("/dashboard"); // Redirect to the dashboard or any other page
        } catch (err) {
            console.error("Error signing in:", err);
            setError(err.message);
            // Trigger toast notification on error
            toast.error("Invalid credentials. Please try again."); // Use the toast function to show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.signUpContainer}>
            <div className={styles.formContainer}>
                <div className={styles.formLeft}>
                    <h2>Login</h2>
                    <form onSubmit={handleSignIn} className={styles.signUpForm}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.inputField}
                        />
                        <div className={styles.passwordField}>
                            <input
                                type={passwordVisible ? "text" : "password"} // Toggle between text and password
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
                                } // Toggle password visibility
                            >
                                {passwordVisible ? (
                                    <div className={styles.eye}>
                                        <i class="fa-solid fa-eye"></i>
                                    </div>
                                ) : (
                                    <div className={styles.slasheye}>
                                        <i class="fa-solid fa-eye-slash"></i>
                                    </div>
                                )}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                    <GoogleAuth />
                </div>
                <div className={styles.formRight}>
                    <img
                        src="src/assets/logo/Foodzy3.png"
                        alt="Sign In"
                        className={styles.signUpImage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SignIn;
