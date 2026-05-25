import { useState } from "react";
import "./MissionForm.css";

export default function MissionForm({
    onSubmit,
    users,
    options,
    loading,
    isSuccess
}) {

    // ---------------- CREW USERS ----------------
    const crewUsers =
        users?.filter(
            (u) => u.role === "crew"
        ) || [];

    // ---------------- FORM STATE ----------------
    const [formData, setFormData] = useState({

        departure: "",

        returnDate: "",

        crewMember1: "",

        crewMember2: "",

        rocket: "",

        launchPad: "",

        landingPad: "",

        city: ""
    });

    // ---------------- HANDLE CHANGE ----------------
    function handleChange(e) {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value
        }));
    }

    // ---------------- SUBMIT ----------------
    function handleSubmit(e) {

        e.preventDefault();

        // crew validation
        if (
            !formData.crewMember1 ||
            !formData.crewMember2
        ) {

            alert(
                "Select exactly 2 crew members"
            );

            return;
        }

        // no duplicate users
        if (
            formData.crewMember1 ===
            formData.crewMember2
        ) {

            alert(
                "Crew members must be different"
            );

            return;
        }

        // ---------------- PAYLOAD ----------------
        const payload = {

            title:
                "Space Mission",

            launchDate:
                formData.departure,

            returnDate:
                formData.returnDate,

            crewMember1:
                formData.crewMember1,

            crewMember2:
                formData.crewMember2,

            rocket:
                formData.rocket,

            launchPad:
                formData.launchPad,

            landingPad:
                formData.landingPad,

            city:
                formData.city
        };

        console.log(
            "MISSION PAYLOAD:",
            payload
        );

        onSubmit(payload);
    }

    return (

        <form
            className="mission-form"
            onSubmit={handleSubmit}
        >

            <h2>
                Create Mission
            </h2>

            {/* ---------------- DEPARTURE ---------------- */}

            <label>

                Departure:

                <input
                    type="date"
                    name="departure"
                    value={formData.departure}
                    onChange={handleChange}
                    required
                />

            </label>

            {/* ---------------- RETURN ---------------- */}

            <label>

                Return Date:

                <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    required
                />

            </label>

            {/* ---------------- CREW 1 ---------------- */}

            <label>

                Crew Member 1:

                <select
                    name="crewMember1"
                    value={formData.crewMember1}
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Crew
                    </option>

                    {crewUsers.map((u) => (

                        <option
                            key={u.id}
                            value={u.id}
                            disabled={
                                u.id ===
                                formData.crewMember2
                            }
                        >

                            {u.firstname}
                            {" "}
                            {u.lastname}

                        </option>

                    ))}

                </select>

            </label>

            {/* ---------------- CREW 2 ---------------- */}

            <label>

                Crew Member 2:

                <select
                    name="crewMember2"
                    value={formData.crewMember2}
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Crew
                    </option>

                    {crewUsers.map((u) => (

                        <option
                            key={u.id}
                            value={u.id}
                            disabled={
                                u.id ===
                                formData.crewMember1
                            }
                        >

                            {u.firstname}
                            {" "}
                            {u.lastname}

                        </option>

                    ))}

                </select>

            </label>

            {/* ---------------- ROCKET ---------------- */}

            <label>

                Rocket:

                <select
                    name="rocket"
                    value={formData.rocket}
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Rocket
                    </option>

                    {options?.rockets?.map((r) => (

                        <option
                            key={r.id}
                            value={r.id}
                        >

                            {r.name}

                        </option>

                    ))}

                </select>

            </label>

            {/* ---------------- LAUNCHPAD ---------------- */}

            <label>

                Launch Pad:

                <select
                    name="launchPad"
                    value={formData.launchPad}
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Launch Pad
                    </option>

                    {options?.launchpads?.map((p) => (

                        <option
                            key={p.id}
                            value={p.id}
                        >

                            {p.name}

                        </option>

                    ))}

                </select>

            </label>

            {/* ---------------- LANDPAD ---------------- */}

            <label>

                Landing Pad:

                <select
                    name="landingPad"
                    value={formData.landingPad}
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Landing Pad
                    </option>

                    {options?.landpads?.map((p) => (

                        <option
                            key={p.id}
                            value={p.id}
                        >

                            {p.name}

                        </option>

                    ))}

                </select>

            </label>

            {/* ---------------- CITY ---------------- */}

            <label>

                Destination:

                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter destination"
                    required
                />

            </label>

            {/* ---------------- BUTTON ---------------- */}

            <button
                type="submit"
                disabled={loading}
            >

                {loading
                    ? "Saving..."
                    : "Create Mission"}

            </button>

            {/* ---------------- SUCCESS ---------------- */}

            {isSuccess && (

                <p className="success">
                    Mission created successfully!
                </p>

            )}

        </form>
    );
}