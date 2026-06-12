import { useForm } from "react-hook-form";

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
            minLength: 8,
          })}
        />
        {errors.password && (
          <p>Minimum 8 characters</p>
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
        {loading
          ? "Loading..."
          : "Register"}
      </button>

      {errorMessage && (
        <p>{errorMessage}</p>
      )}
    </form>
  );
}

export default RegisterFields;