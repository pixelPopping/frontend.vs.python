import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RegisterFields from "../components/RegisterFields";
import styles from "./SignUp.module.css";

import client from "../api/client";

function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(data) {
    if (!data) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    console.log("🚀 SENDING DATA:", data);

    try {
      // =============================================
      // ECHTE BACKEND
      // =============================================
      const response = await client.post(
        "/register",
        data,
      );

      console.log(
        "✅ REGISTRATION SUCCESS:",
        response.data,
      );

      // Na registratie naar Sign In
      navigate("/signin");
    } catch (error) {
      console.warn(
        "⚠️ Backend registration unavailable.",
      );

      // =============================================
      // OFFLINE DEMO
      // =============================================
      try {
        const existingUsers = JSON.parse(
          localStorage.getItem(
            "novinaut_demo_registered_users",
          ) || "[]",
        );

        const username =
          data.username?.trim();

        const email =
          data.email?.trim();

        // Controleer of gebruiker al bestaat
        const alreadyExists =
          existingUsers.some(
            (user) =>
              user.username === username ||
              user.email === email,
          );

        if (alreadyExists) {
          setErrorMessage(
            "Username or email already registered.",
          );

          return;
        }

        const demoUser = {
          ...data,
          id: `demo-user-${Date.now()}`,
          role: "user",
        };

        existingUsers.push(demoUser);

        localStorage.setItem(
          "novinaut_demo_registered_users",
          JSON.stringify(existingUsers),
        );

        console.log(
          "✅ DEMO USER REGISTERED:",
          demoUser,
        );

        // Na demo-registratie naar Sign In
        navigate("/signin");
      } catch (storageError) {
        console.error(
          "❌ DEMO REGISTRATION ERROR:",
          storageError,
        );

        setErrorMessage(
          "Registration failed.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className={styles.header}>
        <h1
          className={
            styles.archivoBlackRegular
          }
        >
          Register
        </h1>
      </header>

      <main
        className={
          styles.registerContainer
        }
      >
        <section
          className={
            styles.innerRegisterContainer
          }
        >
          <RegisterFields
            onSubmit={handleSubmit}
            loading={loading}
            errorMessage={errorMessage}
          />
        </section>
      </main>

      <div
        className={
          styles.footerContainer
        }
      >
        <footer
          className={styles.footer}
        >
          <p>
            Pixelpopping@Productions
          </p>
        </footer>
      </div>
    </>
  );
}

export default SignUp;