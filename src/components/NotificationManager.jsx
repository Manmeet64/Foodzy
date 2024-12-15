import React, { useEffect, useState } from "react";
import { requestFirebaseToken, onMessageListener } from "../../firebase.js";

const NotificationManager = () => {
    const [token, setToken] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await requestFirebaseToken();
                setToken(token);
            } catch (error) {
                console.error("Error fetching Firebase token:", error);
            }
        };

        fetchToken();

        // Listen for foreground messages
        onMessageListener().then((payload) => {
            setNotification(payload.notification);
        });
    }, []);

    return (
        <div>
            <h2>Firebase Notifications</h2>
            {token && <p>FCM Token: {token}</p>}
            {notification && (
                <div>
                    <h3>Notification</h3>
                    <p>
                        <strong>Title:</strong> {notification.title}
                    </p>
                    <p>
                        <strong>Body:</strong> {notification.body}
                    </p>
                </div>
            )}
        </div>
    );
};

export default NotificationManager;
