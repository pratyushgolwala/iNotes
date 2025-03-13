import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // ✅ Use useHistory for React Router v5

const Signup = () => {
    const [credentials, setCredentials] = useState({ email: "", name: "", password: "" });
    const history = useHistory(); // ✅ useHistory instead of useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted", credentials);
    
        try {
            const response = await fetch("http://localhost:5002/api/auth/createuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
                credentials: "include"
            });
    
            const json = await response.json();
            console.log(json);
    
            if (json.authtoken) {
                localStorage.setItem("token", json.authtoken);
                localStorage.setItem("name", credentials.name);
    
                alert("Signup Successful!");
                history.push("/"); // ✅ Redirect using useHistory
            } else {
                throw new Error(json.error || "Signup failed");
            }
    
        } catch (error) {
            console.error("Error:", error.message);
            alert("Signup Failed: " + error.message);
        }
    };
    
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label> 
                    <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
