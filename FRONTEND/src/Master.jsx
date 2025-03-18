import React, { useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";

const Master = () => {
    const location = useLocation();
    const params = useParams(); // Get dynamic parameters from the route

    useEffect(() => {
        let title = "Facegram";

        if (location.pathname === "/") title = "Home | Facegram";
        else if (location.pathname === "/login") title = "Login | Facegram";
        else if (location.pathname === "/register") title = "Register | Facegram";
        else if (location.pathname === "/create-post") title = "Create Post | Facegram";
        else if (location.pathname.startsWith("/profile/")) {
            title = `${params.username}'s Profile | Facegram`; 
        }

        document.title = title;
    }, [location.pathname, params.username]);

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default Master;
