// src/components/Navbar.jsx
import React from "react";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/signin"); // Redirect to SignIn page after logging out
        } catch (err) {
            console.error("Error signing out:", err);
        }
    };

    return (
        <nav>
            <button onClick={handleSignOut}>Sign Out</button>
        </nav>
    );
};

export default Navbar;
