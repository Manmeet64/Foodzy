import { useEffect, useState } from "react";
import { auth } from "../../firebase.js";
import { onAuthStateChanged, getIdToken } from "firebase/auth";

const useFirebaseIdToken = () => {
    const [idToken, setIdToken] = useState(null);

    useEffect(() => {
        let interval;

        const fetchIdToken = async (user) => {
            try {
                if (user) {
                    const token = await getIdToken(user, true); // Force refresh token
                    setIdToken(token);
                } else {
                    setIdToken(null);
                }
            } catch (error) {
                console.error("Error fetching ID token:", error);
            }
        };

        const startTokenRefresh = (user) => {
            fetchIdToken(user); // Fetch the initial token

            // Set an interval to refresh the token every hour
            interval = setInterval(() => {
                fetchIdToken(user);
            }, 60 * 60 * 1000); // Refresh every hour
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                startTokenRefresh(user);
            } else {
                setIdToken(null);
                clearInterval(interval);
            }
        });

        return () => {
            unsubscribe();
            if (interval) clearInterval(interval);
        };
    }, []);

    return idToken;
};

export default useFirebaseIdToken;
