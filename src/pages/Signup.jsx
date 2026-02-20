import { useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/v1/auth/register", {
                firstName,
                lastName,
                email,
                password
            });

            login(res.data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error("Signup failed:", err);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>

            <form onSubmit={handleSubmit}>
                <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                />

                <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}