// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp/SignUp";
import SignIn from "./pages/Auth/SignIn/SignIn";
import { ToastContainer } from "react-toastify";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import NotificationManager from "./components/NotificationManager";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Admin from "./pages/Admin/Admin";
import Search from "./pages/Search/Search";
import RestaurantDetail from "./pages/RestaurantDetails/RestaurantDetail";
import Carts from "./pages/Carts/Carts";
import Cart from "./pages/Cart/Cart";
import TrackOrder from "./pages/TrackOrder/TrackOrder";
import Map from "./components/Map/Map";
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
                    {/*This is for testing notification endpoint and getting fcm notifications to send
                    notifications, remember these tokens are refresed every hour*/}
                    <Route
                        path="/notification"
                        element={<NotificationManager />}
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/cart" element={<Carts />} />
                    <Route path="/cart/:restaurantId" element={<Cart />} />
                    <Route
                        path="/search/:restaurantId"
                        element={<RestaurantDetail />}
                    />
                    <Route
                        path="/track/:restaurantId/:orderId"
                        element={<TrackOrder />}
                    />
                    {/* Redirect to SignIn if no matching route is found */}
                    <Route path="/" element={<SignIn />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
