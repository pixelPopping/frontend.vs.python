// src/pages/Profile.jsx

import { useEffect, useState } from "react";
import axios from "axios";


const API = "http://localhost:5000";

function Profile() {

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        async function fetchProfile() {

            try {

                const res = await axios.get(
                    `${API}/api/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProfile(res.data);

            } catch (err) {
                setError("Could not load profile");
            }
        }

        fetchProfile();

    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!profile) {
        return <p>Loading...</p>;
    }

    return (
        <main className="profile-page">

            <section className="profile-card">

                <h1>Profile</h1>

                <p><strong>Name:</strong> {profile.firstname} {profile.lastname}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>City:</strong> {profile.city}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <p><strong>Role:</strong> {profile.role}</p>

            </section>

        </main>
    );
}

export default Profile;