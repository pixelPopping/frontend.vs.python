import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API = "http://localhost:5000";

function Profile() {
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: user?.email || "",
        username: user?.username || "",
        city: user?.city || "",
        phone: user?.phonenumber || "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await axios.put(
                `${API}/api/users/${user.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            setMessage("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">

            <h1>👤 Profile</h1>

            <form onSubmit={handleSubmit} className="profile-form">

                <label>
                    Email
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Username
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    City
                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Phone
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                </button>

            </form>

            {message && <p>{message}</p>}

        </div>
    );
}

export default Profile;