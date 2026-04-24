import { useForm } from "react-hook-form";

const ContactForm = ({ onSubmit, loading, errorMessage }) => {
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
                        <h2>Contact Details</h2>
                        <p>Make a new account and start your your Space Journey!</p>
                        <p>Personal Information</p>
                    </div>

                    <div className="form-input-outer">
                        <section className="inner-form">
                            <div className="gender-group">
                                <label htmlFor="gender-men">
                                    Male:
                                    <input
                                        {...register("gender", { required: "Select a gender" })}
                                        type="radio"
                                        name="gender"
                                        value="men"
                                        id="gender-men"
                                    />
                                </label>

                                <label htmlFor="gender-woman">
                                    Female:
                                    <input
                                        {...register("gender", { required: "Select a gender" })}
                                        type="radio"
                                        name="gender"
                                        value="woman"
                                        id="gender-woman"
                                    />
                                </label>

                                <label htmlFor="gender-neutral">
                                    Neutral:
                                    <input
                                        {...register("gender", { required: "Select a gender" })}
                                        type="radio"
                                        name="gender"
                                        value="neutral"
                                        id="gender-neutral"
                                    />
                                </label>

                                {errors.gender && (
                                    <p className="error">{errors.gender.message}</p>
                                )}
                            </div>

                            <label htmlFor="username-field">
                                First name:
                                <input
                                    type="text"
                                    id="username-field"
                                    {...register("username", { required: "First name is obliged" })}
                                />
                                {errors.username && (
                                    <p className="error">{errors.username.message}</p>
                                )}
                            </label>

                            <label htmlFor="lastname-field">
                                Last name:
                                <input
                                    type="text"
                                    id="lastname-field"
                                    {...register("lastname", { required: "Last name is obliged" })}
                                />
                                {errors.lastname && (
                                    <p className="error">{errors.lastname.message}</p>
                                )}
                            </label>

                            <label htmlFor="postalcode-field">
                                Postal code:
                                <input
                                    type="text"
                                    id="postalcode-field"
                                    {...register("postalcode", { required: "Postal code is obliged" })}
                                />
                                {errors.postalcode && (
                                    <p className="error">{errors.postalcode.message}</p>
                                )}
                            </label>

                            <label htmlFor="unit-field">
                                Unit:
                                <input
                                    type="number"
                                    id="unit-field"
                                    {...register("unit", { required: "Unit is obliged" })}
                                />
                                {errors.unit && <p className="error">{errors.unit.message}</p>}
                            </label>

                            <label htmlFor="homeadress-field">
                                Street name:
                                <input
                                    type="text"
                                    id="homeadress-field"
                                    {...register("homeadress", {
                                        required: "Street name is obliged",
                                    })}
                                />
                                {errors.homeadress && (
                                    <p className="error">{errors.homeadress.message}</p>
                                )}
                            </label>

                            <label htmlFor="city-field">
                                City:
                                <input
                                    type="text"
                                    id="city-field"
                                    {...register("city", { required: "City is obliged" })}
                                />
                                {errors.city && <p className="error">{errors.city.message}</p>}
                            </label>

                            <label htmlFor="phonenumber-field">
                                Phone number:
                                <input
                                    type="tel"
                                    id="phonenumber-field"
                                    {...register("phonenumber", {
                                        required: "Phone number is obliged",
                                    })}
                                />
                                {errors.phonenumber && (
                                    <p className="error">{errors.phonenumber.message}</p>
                                )}
                            </label>

                            <label htmlFor="date-field">
                                Date of Birth:
                                <input
                                    type="date"
                                    id="date-field"
                                    {...register("date", { required: "Date of Birth is obliged" })}
                                />
                                {errors.date && <p className="error">{errors.date.message}</p>}
                            </label>

                            <h3>Account Information</h3>

                            <label htmlFor="email-field">
                                Email:
                                <input
                                    type="email"
                                    id="email-field"
                                    {...register("email", {
                                        required: "Email is verplicht",
                                        validate: (value) =>
                                            value.includes("@") || "Email is not valid",
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
                                            message: "Minimum 8 characters long",
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p className="error">{errors.password.message}</p>
                                )}
                            </label>

                            <div className="submit-container">
                                <button className="submit" type="submit" disabled={loading}>
                                    {loading ? "Please wait..." : "Register"}
                                </button>
                            </div>

                            {errorMessage && <p className="error">{errorMessage}</p>}
                        </section>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ContactForm;