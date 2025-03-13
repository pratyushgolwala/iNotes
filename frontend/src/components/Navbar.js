import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    let location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:5002/api/auth/getuser", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"), // Ensure token is sent
                    },
                });

                const json = await response.json();
                if (json.name) {
                    setUser(json);
                    console.log("Logged-in user:", json.name); // ✅ Logs user's name
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        if (localStorage.getItem("token")) {
            fetchUser();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">iNotebook</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                        </li>
                    </ul>

                    <div className="d-flex">
                        {user ? (
                            <>
                                <span className="navbar-text text-white mx-2">Hello, {user.name}</span>
                                <button className="btn btn-danger mx-1" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link className="btn btn-primary mx-1" to="/login">Login</Link>
                                <Link className="btn btn-primary mx-1" to="/signup">Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
