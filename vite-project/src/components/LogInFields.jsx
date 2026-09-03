import React from "react";
import { useForm } from "react-hook-form";

function LogInFields({
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
    <section>
      <article>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <label>
            <span>Username</span>

            <input
              type="text"
              placeholder="Enter your username"
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
          <label>
            <span>Password</span>

            <input
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password", {
                required: "Password required",
              })}
            />
          </label>

          {errors.password && (
            <p>{errors.password.message}</p>
          )}

          {/* Invite Code */}
          <label>
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

          {/* Login button */}
          <div>
            <section>
              <button
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

export default LogInFields;