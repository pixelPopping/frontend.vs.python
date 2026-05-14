// MissionForm.jsx

import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import handleRandom from '../Helpers/handleRandom';
import getStrategyFromCity from "../Helpers/getStrategyFromCity";
import axios from "axios";
import './MissionForm.css';

const API = "http://localhost:5000";

const MissionForm = ({ onSubmit, options, loading, isSuccess }) => {

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch
    } = useForm();

    const [crewMembers, setCrewMembers] = useState([]);

    const destination = watch("city");
    const missionAction = watch("missionAction");

    const token = localStorage.getItem("token");

    // GET CREW USERS

    useEffect(() => {

        axios.get(
            `${API}/api/users?role=crew`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(res => setCrewMembers(res.data))
        .catch(err => console.error(err));

    }, []);

    // RESET

    useEffect(() => {

        if (isSuccess) {
            reset();
        }

    }, [isSuccess, reset]);

    // AUTO ACTION

    useEffect(() => {

        if (!destination) return;

        const suggestion = getStrategyFromCity(destination);

        if (!missionAction) {
            setValue("missionAction", suggestion);
        }

    }, [destination, missionAction, setValue]);

    return (

        <div className="outer-form">

            <form onSubmit={handleSubmit(onSubmit)}>

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
                        🚀 Launch Mission
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRandom(options, setValue)}
                        className="random-mission"
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

                                <select {...register("captain")}>

                                    <option value="">
                                        Select Captain
                                    </option>

                                    {options?.astronauts?.map(a => (

                                        <option
                                            key={a.id}
                                            value={a.name}
                                        >
                                            {a.name}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* CREW 1 */}

                            <label className="placeholder">

                                Assign Crew Member 1:

                                <select {...register("crewMember1")}>

                                    <option value="">
                                        Select Crew Member
                                    </option>

                                    {crewMembers.map(c => (

                                        <option
                                            key={c.id}
                                            value={c.id}
                                        >
                                            {c.firstname} {c.lastname}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* CREW 2 */}

                            <label className="placeholder">

                                Assign Crew Member 2:

                                <select {...register("crewMember2")}>

                                    <option value="">
                                        Select Crew Member
                                    </option>

                                    {crewMembers.map(c => (

                                        <option
                                            key={c.id}
                                            value={c.id}
                                        >
                                            {c.firstname} {c.lastname}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* ROCKET */}

                            <label className="placeholder">

                                Rocket:

                                <select {...register("rocket")}>

                                    <option value="">
                                        Select Rocket
                                    </option>

                                    {options?.rockets?.map(r => (

                                        <option
                                            key={r.id}
                                            value={r.name}
                                        >
                                            {r.name}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* LAUNCHPAD */}

                            <label className="placeholder">

                                Launch Pad:

                                <select {...register("launchpad")}>

                                    <option value="">
                                        Select Launch Pad
                                    </option>

                                    {options?.launchpads?.map(lp => (

                                        <option
                                            key={lp.id}
                                            value={lp.full_name}
                                        >
                                            {lp.full_name}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* LANDPAD */}

                            <label className="placeholder">

                                Landing Pad:

                                <select {...register("landpad")}>

                                    <option value="">
                                        Select Landing Pad
                                    </option>

                                    {options?.landpads?.map(lp => (

                                        <option
                                            key={lp.id}
                                            value={lp.full_name}
                                        >
                                            {lp.full_name}
                                        </option>

                                    ))}

                                </select>

                            </label>

                            {/* ACTION */}

                            <label className="placeholder">

                                Mission Action:

                                <select {...register("missionAction")}>

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
                                    {...register("city")}
                                    placeholder="Destination City"
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