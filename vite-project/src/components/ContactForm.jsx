import React from "react";
import { useForm } from "react-hook-form";
import "./ContactForm.css";

const ContactForm = ({ onSubmit, loading, errorMessage }) => {
    const { register, handleSubmit } = useForm();

    return (
        <div className="contact-outer-form">
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* TITLE (zelfde structuur als Mission) */}
                <div className="contact-text-container">
                    <h1 className="contact-title">Mission Control - Contact</h1>
                </div>

                {/* FORM OUTER */}
                <div className="contact-form-input-outer">

                    {/* INNER CONTAINER (BELANGRIJK: zelfde als Mission) */}
                    <section className="contact-inner-form">

                        {/* FIELDS (zelfde “placeholder” structuur als Mission) */}

                        <label className="contact-placeholder">
                            Username:
                            <input {...register("username")} />
                        </label>

                        <label className="contact-placeholder">
                            Lastname:
                            <input {...register("lastname")} />
                        </label>

                        <label className="contact-placeholder">
                            Email:
                            <input {...register("email")} />
                        </label>

                        <label className="contact-placeholder">
                            Password:
                            <input type="password" {...register("password")} />
                        </label>

                        {/* RADIO GROUP */}
                        <div className="contact-placeholder">
                            Gender:
                            <div className="contact-radio-group">

                                <label>
                                    <input type="radio" value="male" {...register("gender")} />
                                    Male
                                </label>

                                <label>
                                    <input type="radio" value="female" {...register("gender")} />
                                    Female
                                </label>

                                <label>
                                    <input type="radio" value="other" {...register("gender")} />
                                    Other
                                </label>

                            </div>
                        </div>

                        <label className="contact-placeholder">
                            City:
                            <input {...register("city")} />
                        </label>

                        <label className="contact-placeholder">
                            Postalcode:
                            <input {...register("postalcode")} />
                        </label>

                        <label className="contact-placeholder">
                            Phone:
                            <input {...register("phonenumber")} />
                        </label>

                        {/* BUTTONS (exact Mission layout clone) */}
                        <div className="contact-button-outer">
                            <div className="contact-inner-container-submit">

                                <button
                                    type="submit"
                                    className="contact-submit"
                                    disabled={loading}
                                >
                                    Submit
                                </button>

                                <button
                                    type="button"
                                    className="contact-submit-secondary"
                                >
                                    Random
                                </button>

                            </div>
                        </div>

                        {errorMessage && (
                            <p>{errorMessage}</p>
                        )}

                    </section>
                </div>

            </form>
        </div>
    );
};

export default ContactForm;
