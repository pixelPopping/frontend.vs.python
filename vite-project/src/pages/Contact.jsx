import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ContactForm from "../components/ContactForm";




function SignUp() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFormSubmit = async (data) => {
        setLoading(true);
        setErrorMessage("");
        console.log("Form data:", data);
        try {
            const response = await axios.post(
                "/api/users",
                {
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
                },
                {
                    headers: {
                        accept: "application/json",
                        "novi-education-project-id": "b72992a3-9bd0-4e8c-84d5-0e24aff4e81b",
                        "content-type": "application/json",
                    },
                }
            );

            console.log("Create succesvol:", response.data);
            navigate("/signin");
        } catch (error) {
            console.error("Fout bij create:", error.message);
            setErrorMessage("Registratie mislukt. Probeer het opnieuw.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
                <section>
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













