// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                // Redirect or show message for non-authenticated users
            }
        });

        return () => unsubscribe(); // Clean up on unmount
    }, []);

    return (
        <div>{user ? <h2>Welcome, {user.email}</h2> : <p>Loading...</p>}</div>
    );
};

export default Dashboard;
