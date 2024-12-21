import React, { useEffect, useState } from "react";
import { requestFirebaseToken, onMessageListener } from "../../firebase.js";

const NotificationManager = ({ onNewNotification }) => {
    const [token, setToken] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        // Fetch the FCM Token
        const fetchToken = async () => {
            try {
                const token = await requestFirebaseToken();
                console.log("FCM Token fetched successfully:", token);
                setToken(token);
            } catch (error) {
                console.error("Error fetching Firebase token:", error);
            }
        };

        fetchToken();

        // Listen for foreground messages
        const initializeNotificationListener = () => {
            onMessageListener()
                .then((payload) => {
                    console.log("THIS IS ON MESSAGE");
                    console.log("Notification received:", payload);
                    setNotification(payload.notification);

                    // Pass the notification data to the parent component if provided
                    if (onNewNotification) {
                        console.log("THIS IS ON NEW NOTIFICATION PASSING");
                        onNewNotification(payload.notification);
                    }
                })
                .catch((error) => {
                    console.error("Failed to receive message:", error);
                });
        };

        initializeNotificationListener();
    }, [onNewNotification]);

    // For debugging purposes, log any notifications received
    useEffect(() => {
        if (notification) {
            console.log("Current notification:", notification);
        }
    }, [notification]);

    return (
        <div style={{ display: "none" }}>
            {/* This component is invisible and does not render anything */}
        </div>
    );
};

export default NotificationManager;
