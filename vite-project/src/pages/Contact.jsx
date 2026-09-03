
import React, { useState } from "react";
import ContactForm from "../components/ContactForm";
import client from "../api/client";
import styles from "./Contact.module.css";

function Contact() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const userData = {
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
    };

    try {
      // ---------------------------------------------
      // Eerst proberen we de echte backend
      // ---------------------------------------------
      const response = await client.post(
        "/users",
        userData,
      );

      console.log(
        "Registration success:",
        response.data,
      );

      setSuccessMessage(
        "Registration successful! 🚀",
      );
    } catch (error) {
      console.warn(
        "⚠️ Backend unavailable.",
      );

      // ---------------------------------------------
      // Offline portfolio demo
      // ---------------------------------------------
      try {
        const demoUsers = JSON.parse(
          localStorage.getItem(
            "novinaut_demo_users",
          ) || "[]",
        );

        const newDemoUser = {
          ...userData,
          id: `demo-user-${Date.now()}`,
          role: "user",
        };

        demoUsers.push(newDemoUser);

        localStorage.setItem(
          "novinaut_demo_users",
          JSON.stringify(demoUsers),
        );

        console.log(
          "✅ Demo user saved locally",
        );

        setSuccessMessage(
          "Registration successful! 🚀",
        );
      } catch (storageError) {
        console.error(
          "DEMO REGISTRATION ERROR:",
          storageError,
        );

        setErrorMessage(
          "Registration failed.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main
        className={
          styles.outerContactContainer
        }
      >
        <section
          className={styles.innercontainer}
        >
          <ContactForm
            onSubmit={handleFormSubmit}
            loading={loading}
            errorMessage={errorMessage}
          />

          {successMessage && (
            <p>{successMessage}</p>
          )}
        </section>
      </main>

      <footer>
        <p>
          Pixelpopping@productions
        </p>
      </footer>
    </>
  );
}

export default Contact;