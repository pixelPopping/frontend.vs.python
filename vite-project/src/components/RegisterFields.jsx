import React from "react";
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
    <section className={styles.outerRegisterContainer}>
      <article className={styles.formContainer}>
        <form
          className={styles.registerFields}
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
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
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
          <div className={styles.outerbuttonContainer}>
          <section className={styles.buttonContainer}>
          <button
            className={styles.registerButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
          </section>
          </div>
        </form>
      </article>
    </section>
  );
}

export default RegisterFields;