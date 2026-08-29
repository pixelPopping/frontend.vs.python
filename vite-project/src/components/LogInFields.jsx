import React from "react";
import { useForm } from "react-hook-form";
import styles from "./LogInFields.module.css";

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
    <section className={styles.formOuter}>
      <article className={styles.signin}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className={styles.label}>
            <span>Username</span>
            <input
              type="text"
              {...register("username", {
                required: "Username required",
              })}
            />
          </label>

          {errors.username && (
            <p>{errors.username.message}</p>
          )}

          <label className={styles.label}>
            <span>Password</span>
            <input
              type="password"
              {...register("password", {
                required: "Password required",
              })}
            />
          </label>

          {errors.password && (
            <p>{errors.password.message}</p>
          )}

          <label className={styles.label}>
            <span>Invite Code</span>
            <input
              type="text"
              {...register("inviteCode", {
                required: "Invite code required",
              })}
            />
          </label>

          {errors.inviteCode && (
            <p>{errors.inviteCode.message}</p>
          )}

          {errorMessage && (
            <p>{errorMessage}</p>
          )}
          <div className={styles.outerLogin}>
          <section className={styles.innerLogin}>
          <button className={styles.loginButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          </section>
          </div>
        </form>
      </article>
    </section>
  );
}

export default LoginFields;