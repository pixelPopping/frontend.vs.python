import { useForm } from "react-hook-form";


const LoginFields = ({ onSubmit, loading }) => {
    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm();

    return (
        <main className="outer-signin">
            <section className="inner-signin">
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="email-field">
                        Email:
                        <input
                            type="text"
                            id="email-field"
                            {...register("email", {
                                required: "Email is verplicht",
                                validate: (value) =>
                                    value.includes("@") || 'Email moet een "@" bevatten',
                            })}
                        />
                        {errors.email && (
                            <p className="error">{errors.email.message}</p>
                        )}
                    </label>

                    <label htmlFor="password-field">
                        Password:
                        <input
                            type="password"
                            id="password-field"
                            {...register("password", {
                                required: "Password is obliged",
                                minLength: {
                                    value: 8,
                                    message: "Minimaal 8 characters long",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="error">{errors.password.message}</p>
                        )}
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? "Just one Moment..." : "Log In"}
                    </button>
                </form>
            </section>
        </main>
    );
};

export default LoginFields;
