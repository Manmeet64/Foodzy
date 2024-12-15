// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp/SignUp";
import SignIn from "./pages/Auth/SignIn/SignIn";
import { ToastContainer } from "react-toastify";
import ProfileForm from "./components/ProfileForm/ProfileForm";

const App = () => {
    return (
        <Router>
            <div className="container">
                <ToastContainer />
                <Routes>
                    {/* Define the routes */}
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/profileform" element={<ProfileForm />} />
                    {/* Redirect to SignIn if no matching route is found */}
                    <Route path="/" element={<SignIn />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
