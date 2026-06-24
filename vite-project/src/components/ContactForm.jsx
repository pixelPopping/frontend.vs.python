import { useNavigate } from "react-router-dom";
import styles from "./ContactForm.module.css";

const ContactForm = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.outercontainer}>
      <header className={styles.headercontainer}>
        <h1 className={styles.contactTitle}>
          Dear Crewmember,
        </h1>
      </header>

      <main>
        <section className={styles.contentouter}>
          <article className={styles.contentinner}>
            <h2>
              Your mission has been launched 🚀
            </h2>

            <p>
              You can return to your dashboard
              to monitor your active mission
              and future assignments.
            </p>
          </article>
        </section>

        <div className={styles.buttongroup}>
          <section className={styles.innerbutton}>
            <button
              className={styles.crewDashboard}
              type="button"
              onClick={() =>
                navigate("/crew-dashboard")
              }
            >
              ← Back to Dashboard
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ContactForm;