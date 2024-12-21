// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC--qrq6LLVCOqQEd1gCRNryElWmQ6FYVM",
    authDomain: "fir-app-2e08c.firebaseapp.com",
    projectId: "fir-app-2e08c",
    storageBucket: "fir-app-2e08c.firebasestorage.app",
    messagingSenderId: "482442963385",
    appId: "1:482442963385:web:81cb4687a15bdcac4f2e68",
    measurementId: "G-6ZKR2FCJV6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const auth = getAuth(app);

// Google Sign-In Function
export const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log("Google Sign-In Successful:", user);
        return user; // Return user info
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        throw error;
    }
};

// Request Notification Permission
export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");
            return true;
        } else {
            console.warn("Notification permission not granted.");
            return false;
        }
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        throw error;
    }
};

// Request Firebase Token for Notifications
export const requestFirebaseToken = async () => {
    try {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
            console.warn("Unable to get Firebase token without permission.");
            return null;
        }

        // Register service worker for notifications
        const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
        );
        console.log("Service Worker registered successfully:", registration);

        // Get the FCM token
        const token = await getToken(messaging, {
            vapidKey:
                "BGDeV5WaGnIA_hzcp9kd3WVW3SxGKg_qPkuADYhv1fElaBhwolySO3haP0p2bvFJ3XjJ_JWEWSm3MmP-aqWeECY",
            serviceWorkerRegistration: registration,
        });

        if (token) {
            console.log("FCM Token obtained:", token);
            return token;
        }

        console.warn("No registration token available.");
        return null;
    } catch (error) {
        console.error("Error getting Firebase token:", error);
        throw error;
    }
};

// Listen for foreground messages
export const onMessageListener = () =>
    new Promise((resolve, reject) => {
        onMessage(messaging, (payload) => {
            try {
                console.log("Foreground message received:", payload);
                if (Notification.permission === "granted") {
                    const { title, body, image } = payload.notification || {};
                    new Notification(title || "Notification", {
                        body: body || "You have a new message.",
                        icon: image || "/default-icon.png",
                    });
                }
                resolve(payload); // Successfully resolve the payload
            } catch (error) {
                console.error("Error handling foreground message:", error);
                reject(error); // Reject the promise in case of an error
            }
        });
    });

export { auth, messaging };
