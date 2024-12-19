import React, { useEffect, useState } from "react";
import { requestFirebaseToken, onMessageListener } from "../../firebase.js";

const NotificationManager = ({ onNewNotification }) => {
    const [token, setToken] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        // const fetchToken = async () => {
        //     try {
        //         const token = await requestFirebaseToken();
        //         setToken(token);
        //     } catch (error) {
        //         console.error("Error fetching Firebase token:", error);
        //     }
        // };

        // fetchToken();

        // Listen for foreground messages
        console.log("hello outiside");
        const unsubscribe = onMessageListener()
            .then((payload) => {
                console.log("hello");
                setNotification(payload.notification);
                if (onNewNotification) {
                    onNewNotification(payload.notification);
                }
            })
            .catch((err) => console.log("Failed to receive message", err));

        // No need for cleanup since Firebase handles it internally
        // So we can simply return nothing here or leave the return empty
    }, [onNewNotification]); // Effect runs once when the component mounts

    return null; // This component does not render anything
};

export default NotificationManager;
