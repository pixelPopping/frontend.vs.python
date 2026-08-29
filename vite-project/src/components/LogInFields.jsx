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
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <label>
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

          <label>
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

          <label>
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