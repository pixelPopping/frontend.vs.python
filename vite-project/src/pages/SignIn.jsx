import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginFields from "../components/LogInFields";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import styles from "./SignIn.module.css";

const DEMO_USERS = [
  {
    id: "demo-captain",
    username: "demoCaptain",
    password: "demo123",
    email: "captain@novinaut.demo",
    role: "captain",
  },
  {
    id: "demo-crew",
    username: "demoCrew",
    password: "demo123",
    email: "crew@novinaut.demo",
    role: "crew",
  },
];

function SignIn() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(data) {
    if (!data) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const username = data.username?.trim();
    const password = data.password?.trim();

    try {
      // =================================================
      // 1. ECHTE BACKEND LOGIN
      // =================================================
      const response = await client.post("/login", {
        username,
        password,
        inviteCode: data.inviteCode,
      });

      const { token, user } = response.data;

      login(user, token);

      if (user.role === "captain") {
        navigate("/captain-dashboard");
      } else {
        navigate("/crew-dashboard");
      }

      return;
    } catch (error) {
      console.warn(
        "⚠️ Backend login unavailable. Trying demo login.",
      );
    }

    // =================================================
    // 2. VASTE DEMO ACCOUNTS
    // =================================================
    const demoUser = DEMO_USERS.find(
      (user) =>
        user.username === username &&
        user.password === password,
    );

    if (demoUser) {
      const { password: _, ...userWithoutPassword } =
        demoUser;

      const demoToken = `demo-token-${demoUser.role}`;

      login(
        userWithoutPassword,
        demoToken,
      );

      console.log(
        "✅ Logged in with demo account",
      );

      if (demoUser.role === "captain") {
        navigate("/captain-dashboard");
      } else {
        navigate("/crew-dashboard");
      }

      setLoading(false);
      return;
    }

    // =================================================
    // 3. GEREGISTREERDE OFFLINE DEMO USER
    // =================================================
    try {
      const registeredUsers = JSON.parse(
        localStorage.getItem(
          "novinaut_demo_registered_users",
        ) || "[]",
      );

      const registeredUser =
        registeredUsers.find(
          (user) =>
            user.username === username &&
            user.password === password,
        );

      if (registeredUser) {
        const {
          password: _,
          ...userWithoutPassword
        } = registeredUser;

        const demoToken = `demo-token-user`;

        login(
          userWithoutPassword,
          demoToken,
        );

        console.log(
          "✅ Logged in with registered demo account",
        );

        navigate("/crew-dashboard");

        setLoading(false);
        return;
      }
    } catch (error) {
      console.error(
        "DEMO LOGIN ERROR:",
        error,
      );
    }

    // =================================================
    // 4. LOGIN MISLUKT
    // =================================================
    setErrorMessage(
      "Login failed. Check your username and password.",
    );

    setLoading(false);
  }

  return (
    <>
      <header className={styles.signinheader}>
        <h1
          className={
            styles.archivoBlackRegular
          }
        >
          Sign In
        </h1>
      </header>

      <main className={styles.signinmain}>
        <section className={styles.signsection}>
          <article className={styles.signarticle}>
            <LoginFields
              onSubmit={handleSubmit}
              loading={loading}
              errorMessage={errorMessage}
            />

            <div
              style={{
                marginTop: "20px",
              }}
            >
              <p>
                <strong>
                  Portfolio demo
                </strong>
              </p>

              <p>
                Captain:
                <br />
                <strong>
                  demoCaptain
                </strong>
                <br />
                Password:
                <br />
                <strong>
                  demo123
                </strong>
              </p>

              <p>
                Crew:
                <br />
                <strong>
                  demoCrew
                </strong>
                <br />
                Password:
                <br />
                <strong>
                  demo123
                </strong>
              </p>
            </div>
          </article>
        </section>
      </main>

      <div className={styles.footerContainer}>
        <footer className={styles.footer}>
          <p>
            PixelPopping@Productions
          </p>
        </footer>
      </div>
    </>
  );
}

export default SignIn;