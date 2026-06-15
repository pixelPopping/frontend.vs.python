import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginFields from "../components/LoginFields";
import { AuthContext } from "../context/AuthContext";
import styles from "./SignIn.module.css";

const API = "http://localhost:5000";

function SignIn() {
  const navigate = useNavigate();

  const { login } =
    useContext(AuthContext);

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function handleSubmit(data) {
    setLoading(true);

    setErrorMessage("");

    try {
      const response =
        await axios.post(
          `${API}/api/login`,
          {
            username:
              data.username,
            password:
              data.password,
            inviteCode:
              data.inviteCode,
          }
        );

      const { token, user } =
        response.data;

      login(user, token);

      if (
        user.role === "captain"
      ) {
        navigate(
          "/captain-dashboard"
        );
      } else {
        navigate(
          "/crew-dashboard"
        );
      }
    } catch (error) {
      const msg =
        error?.response?.data
          ?.error ||
        "Login failed";

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <header className={styles.signinheader}>
      <h1>Sign In</h1>
    </header>
      <main className={styles.signinmain}>
        <section className={styles.signsection}>
          <article className={styles.signarticle}>
      <LoginFields
        onSubmit={handleSubmit}
        loading={loading}
        errorMessage={
          errorMessage
        }
      />
        </article>
      </section>
    </main>
    <div className={styles.footerContainer}>
    <footer className={styles.footer}>
       <p>PixelPopping@Productions</p>
    </footer>
    </div>
    </>
  );
}

export default SignIn;