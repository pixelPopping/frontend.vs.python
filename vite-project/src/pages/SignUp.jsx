import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterFields from "../components/RegisterFields";
import styles from "./SignUp.module.css";

const API = "http://localhost:5000";

function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(data) {
    if (!data) return;

    setLoading(true);
    setErrorMessage("");

    console.log("🚀 SENDING DATA:", data);

    try {
      const response = await axios.post(`${API}/api/register`, data);

      console.log("✅ SUCCESS:", response.data);

      // Na registratie → naar SignIn
      navigate("/signin");
    } catch (error) {
      console.log("❌ FULL ERROR:", error.response);

      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Registration failed";

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <header>
       <h1>Register</h1>
    </header>
    <main className={styles.registerContainer}>
      <section className={styles.innerRegisterContainer}>
      <RegisterFields
        onSubmit={handleSubmit}
        loading={loading}
        errorMessage={errorMessage}
      />
      </section>
    </main>
    <footer>
      <p>Pixelpopping@Productions</p>
    </footer>
    </>
  );
}

export default SignUp;
