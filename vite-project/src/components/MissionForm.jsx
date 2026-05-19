// MissionForm.jsx

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import handleRandom from "../Helpers/handleRandom";
import getStrategyFromCity from "../Helpers/getStrategyFromCity";

import "./MissionForm.css";

// Gebruik overal 127.0.0.1
const API = "http://127.0.0.1:5000";

// Axios instance
const api = axios.create({
    baseURL: API,
    headers: {
        "Content-Type": "application/json"
    }
});

// Token automatisch toevoegen
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const MissionForm = ({
    onSubmit,
    options,
    loading,
    isSuccess
}) => {

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch
    } = useForm();

    const [crewMembers, setCrewMembers] = useState([]);

    // WATCHERS

    const destination = watch("city");
    const missionAction = watch("missionAction");

    // -----------------------------------
    // LOAD CREW MEMBERS
    // -----------------------------------

    useEffect(() => {

        async function loadCrewMembers() {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await api.get(
                    "/api/users?role=crew"
                );

                console.log(
                    "CREW MEMBERS:",
                    response.data
                );

                setCrewMembers(response.data);

            } catch (error) {

                console.error(
                    "Crew fetch error:",
                    error.response?.data || error.message
                );

            }
        }

        loadCrewMembers();

    }, []);

    // -----------------------------------
    // RESET FORM
    // -----------------------------------

    useEffect(() => {

        if (isSuccess) {

            reset();

        }

    }, [isSuccess, reset]);

    // -----------------------------------
    // AUTO STRATEGY
    // -----------------------------------

    useEffect(() => {

        if (!destination) return;

        const suggestion =
            getStrategyFromCity(destination);

        if (!missionAction) {

            setValue(
                "missionAction",
                suggestion
            );
        }

    }, [
        destination,
        missionAction,
        setValue
    ]);

    // -----------------------------------
    // SUBMIT
    // -----------------------------------

    function submitMission(data) {

        const payload = {

            title: `${data.city} Mission`,

            description: `
                Captain: ${data.captain}
                Rocket: ${data.rocket}
                Launchpad: ${data.launchpad}
                Landing Pad: ${data.landpad}
                Action: ${data.missionAction}
            `,

            launchDate: new Date(),

            crew: [
                data.crewMember1,
                data.crewMember2
            ].filter(Boolean),

            captain: data.captain,
            rocket: data.rocket,
            launchpad: data.launchpad,
            landpad: data.landpad,
            missionAction: data.missionAction,
            city: data.city
        };

        console.log(
            "MISSION PAYLOAD:",
            payload
        );

        onSubmit(payload);
    }

    // -----------------------------------
    // UI
    // -----------------------------------

    return (

        <div className="outer-form">

            <form onSubmit={handleSubmit(submitMission)}>

                {/* TITLE */}

                <div className="text-container">

                    <header>

                        <h1 className="unbounded-title-mission">
                            Mission Control
                        </h1>

                    </header>

                </div>

                {/* BUTTONS */}

                <div className="button-section">

                    <button
                        type="submit"
                        className="submit-mission"
                        disabled={loading}
                    >
                        {loading
                            ? "Loading..."
                            : "🚀 Launch Mission"}
                    </button>

                    <button
                        type="button"
                        className="random-mission"
                        onClick={() =>
                            handleRandom(
                                options,
                                setValue
                            )
                        }
                    >
                        🎲 Random Mission
                    </button>

                </div>

                {/* FORM */}

                <div className="form-input-outer">

                    <section className="inner-form-mission">

                        <article className="text">

                            {/* CAPTAIN */}

                            <label className="placeholder">

                                Captain:

                                <select
                                    {...register("captain")}
                                >

                                    <option value="">
                                        Select Captain
                                    </option>

                                    {options?.astronauts?.map((a) => (

                                        <option
                                            key={a.id}
                                            value={a.name}
                                        >
                                            {a.name}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* CREW MEMBER 1 */}

                            <label className="placeholder">

                                Assign Crew Member 1:

                                <select
                                    {...register("crewMember1")}
                                >

                                    <option value="">
                                        Select Crew Member
                                    </option>

                                    {crewMembers.map((crew) => (

                                        <option
                                            key={crew.id}
                                            value={crew.id}
                                        >
                                            {crew.firstname}{" "}
                                            {crew.lastname}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* CREW MEMBER 2 */}

                            <label className="placeholder">

                                Assign Crew Member 2:

                                <select
                                    {...register("crewMember2")}
                                >

                                    <option value="">
                                        Select Crew Member
                                    </option>

                                    {crewMembers.map((crew) => (

                                        <option
                                            key={crew.id}
                                            value={crew.id}
                                        >
                                            {crew.firstname}{" "}
                                            {crew.lastname}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* ROCKET */}

                            <label className="placeholder">

                                Rocket:

                                <select
                                    {...register("rocket")}
                                >

                                    <option value="">
                                        Select Rocket
                                    </option>

                                    {options?.rockets?.map((rocket) => (

                                        <option
                                            key={rocket.id}
                                            value={rocket.name}
                                        >
                                            {rocket.name}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* LAUNCHPAD */}

                            <label className="placeholder">

                                Launch Pad:

                                <select
                                    {...register("launchpad")}
                                >

                                    <option value="">
                                        Select Launch Pad
                                    </option>

                                    {options?.launchpads?.map((launchpad) => (

                                        <option
                                            key={launchpad.id}
                                            value={launchpad.full_name}
                                        >
                                            {launchpad.full_name}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* LANDPAD */}

                            <label className="placeholder">

                                Landing Pad:

                                <select
                                    {...register("landpad")}
                                >

                                    <option value="">
                                        Select Landing Pad
                                    </option>

                                    {options?.landpads?.map((landpad) => (

                                        <option
                                            key={landpad.id}
                                            value={landpad.full_name}
                                        >
                                            {landpad.full_name}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* ACTION */}

                            <label className="placeholder">

                                Mission Action:

                                <select
                                    {...register("missionAction")}
                                >

                                    <option value="">
                                        Select Action
                                    </option>

                                    <option value="stay">
                                        Stay
                                    </option>

                                    <option value="refuel">
                                        Refuel
                                    </option>

                                    <option value="return">
                                        Return
                                    </option>

                                </select>

                            </label>

                            {/* DESTINATION */}

                            <label className="placeholder">

                                Destination:

                                <input
                                    type="text"
                                    placeholder="Destination City"
                                    {...register("city")}
                                />

                            </label>

                        </article>

                    </section>

                </div>

            </form>

        </div>
    );
};

export default MissionForm;