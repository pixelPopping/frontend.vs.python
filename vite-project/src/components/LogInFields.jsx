import { useForm } from "react-hook-form";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
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

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>

      {errorMessage && (
        <p>{errorMessage}</p>
      )}
    </form>
  );
}

export default LoginFields;