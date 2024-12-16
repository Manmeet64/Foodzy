import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Banner from "../../components/Banner/Banner";
import Feature from "../../components/Features/Feature";

function Home() {
    //Navbar and footer components to be used here
    return (
        <div>
            <Navbar />
            <Banner />
            <Feature />
            Home
            <Footer />
        </div>
    );
}

export default Home;
