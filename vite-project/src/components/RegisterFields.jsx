import { useForm } from "react-hook-form";
import styles from "./RegisterFields.module.css";

function RegisterFields({
  onSubmit,
  loading,
  errorMessage,
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  return (
    <main className={styles.outerRegisterContainer}>
      <section className={styles.innerRegisterContainer}>
        <article className={styles.formContainer}>
    <form className={styles.registerFields}onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.label}>
        Username
        <input
          type="text"
          {...register("username", {
            required: "Username required",
          })}
        />
        {errors.username && (
          <p>{errors.username.message}</p>
        )}
      </label>

      <label className={styles.label}>
        Password
        <input
          type="password"
          {...register("password", {
            required: "Password required",
            minLength: 8,
          })}
        />
        {errors.password && (
          <p>Minimum 8 characters</p>
        )}
      </label>

      <label className={styles.label}>
        Invite Code
        <input
          type="text"
          {...register("inviteCode", {
            required: "Invite code required",
          })}
        />
        {errors.inviteCode && (
          <p>{errors.inviteCode.message}</p>
        )}
      </label>
      <section className={styles.outerButton}>
      <div className={styles.buttonContainer}>
      <button  className={styles.registerButton}
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Loading..."
          : "Register"}
      </button>
      </div>
      </section>

      {errorMessage && (
        <p>{errorMessage}</p>
      )}
    </form>
    </article>
    </section>
    </main>
  );
}

export default RegisterFields;