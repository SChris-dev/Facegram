import React from "react";
import { Link, useNavigate } from "react-router";

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const isLoggedIn = !!localStorage.getItem('login_token');

    const handleLogout = () => {
        localStorage.removeItem('login_token');
        navigate('/login');
    }

    return (
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/">Facegram</Link>

                <div className="navbar-nav">
                    {isLoggedIn ? (
                        <>
                            <Link className="nav-link" to={'profile/' + username}>{username}</Link>
                            <button className="nav-link btn btn-link" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">Login</Link>
                            <Link className="nav-link" to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
        </>
    )
}

export default Navbar;