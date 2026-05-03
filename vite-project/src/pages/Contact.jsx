import React, { useState } from "react";
import axios from "axios";
import ContactForm from "../components/ContactForm";
import "./Contact.css";

function SignUp() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFormSubmit = async (data) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post("/api/users", {
                username: data.username,
                lastname: data.lastname,
                gender: data.gender,
                email: data.email,
                password: data.password,
                postalcode: data.postalcode,
                unit: data.unit,
                homeadress: data.homeadress,
                city: data.city,
                phonenumber: data.phonenumber,
                dateOfBirth: data.date,
                roles: ["user"],
                cart: [],
            });

            console.log("Success:", response.data);
        } catch (error) {
            setErrorMessage("Registratie mislukt.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="contact-page">
            <section className="contact-wrapper">
                <ContactForm
                    onSubmit={handleFormSubmit}
                    loading={loading}
                    errorMessage={errorMessage}
                />
            </section>
        </main>
    );
}

export default SignUp;












