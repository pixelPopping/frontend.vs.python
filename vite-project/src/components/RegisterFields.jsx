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
    <section
      className={styles.outerRegisterContainer}
    >
      <article className={styles.formContainer}>
        <form
          className={styles.registerFields}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Username */}
          <label className={styles.label}>
            <span>Username</span>

            <input
              type="text"
              placeholder="Choose a username"
              autoComplete="username"
              {...register("username", {
                required: "Username required",
              })}
            />
          </label>

          {errors.username && (
            <p>{errors.username.message}</p>
          )}

          {/* Password */}
          <label className={styles.label}>
            <span>Password</span>

            <input
              type="password"
              placeholder="Choose a password (minimum 8 characters)"
              autoComplete="new-password"
              {...register("password", {
                required: "Password required",
                minLength: {
                  value: 8,
                  message:
                    "Minimum 8 characters",
                },
              })}
            />
          </label>

          {errors.password && (
            <p>{errors.password.message}</p>
          )}

          {/* Invite Code */}
          <label className={styles.label}>
            <span>Invite Code</span>

            <input
              type="text"
              placeholder="Enter invite code (optional)"
              {...register("inviteCode")}
            />
          </label>

          {errorMessage && (
            <p>{errorMessage}</p>
          )}

          {/* Register button */}
          <div
            className={
              styles.outerbuttonContainer
            }
          >
            <section
              className={
                styles.buttonContainer
              }
            >
              <button
                className={
                  styles.registerButton
                }
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : "Register"}
              </button>
            </section>
          </div>
        </form>
      </article>
    </section>
  );
}

export default RegisterFields;