import React from "react";
import { useForm } from "react-hook-form";

const RegisterFields = ({ onSubmit, loading, errorMessage }) => {
    const {
        handleSubmit,
        formState: { errors },
        register,
    } = useForm();

    return (
        <main className="main-outer-form">
            <div className="outer-form">

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="text-container">
                        <h2>Create account</h2>
                        <p>Register to access the system</p>
                    </div>

                    <section className="inner-form">

                        {/* EMAIL */}
                        <label>
                            Email:
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    validate: (v) =>
                                        v.includes("@") || "Invalid email",
                                })}
                            />
                            {errors.email && (
                                <p className="error">{errors.email.message}</p>
                            )}
                        </label>

                        {/* PASSWORD */}
                        <label>
                            Password:
                            <input
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Minimum 8 characters",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="error">{errors.password.message}</p>
                            )}
                        </label>

                        {/* INVITE CODE */}
                        <label>
                            Invite code:
                            <input
                                type="text"
                                placeholder="CAPTAIN123 / CREW123"
                                {...register("inviteCode", {
                                    required: "Invite code is required",
                                })}
                            />
                            {errors.inviteCode && (
                                <p className="error">{errors.inviteCode.message}</p>
                            )}
                        </label>

                        {/* SUBMIT */}
                        <button type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Register"}
                        </button>

                        {/* ERROR */}
                        {errorMessage && (
                            <p className="error">{errorMessage}</p>
                        )}

                    </section>
                </form>
            </div>
        </main>
    );
};

export default RegisterFields;