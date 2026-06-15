import { useForm } from "react-hook-form";
import styles from "./LoginFields.module.css";

function LoginFields({
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
    <main>
      <section className={styles.outerSignin}>
        <article className={styles.Signin}>
    <form onSubmit={handleSubmit(onSubmit)}>
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

      <label>
        Password
        <input
          type="password"
          {...register("password", {
            required: "Password required",
          })}
        />
        {errors.password && (
          <p>{errors.password.message}</p>
        )}
      </label>

      <label>
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
    </form>
     <section className={styles.outerLoginButton}>
      <div className={styles.buttonLoginContainer}>
      <button  className={styles.loginButton}
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Loading..."
          : "Login"}
      </button>
      </div>
      </section>
    </article>
    </section>
    </main>
  );
}

export default LoginFields;