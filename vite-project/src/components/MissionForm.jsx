import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";

const MissionForm = ({ onSubmit, options, loading, isSuccess }) => {
    const { register, handleSubmit, setValue, reset } = useForm();

    useEffect(() => {
        if (isSuccess) reset();
    }, [isSuccess, reset]);

    const handleRandom = () => {
        if (options.rockets.length > 0 && options.astronauts.length > 2) {
            const randomR = options.rockets[Math.floor(Math.random() * options.rockets.length)];
            const shuffledCrew = [...options.astronauts].sort(() => 0.5 - Math.random());
            const randomLaunch = options.launches[Math.floor(Math.random() * options.launches.length)];
            const randomLand = options.landpads[Math.floor(Math.random() * options.landpads.length)];
            const actions = ["stay", "refuel", "return"];

            setValue("rocket", randomR.name);
            setValue("captain", shuffledCrew[0].name);
            setValue("crewMember1", shuffledCrew[1].name);
            setValue("crewMember2", shuffledCrew[2].name);
            setValue("launchPad", randomLaunch.name);
            setValue("landingPad", randomLand.full_name);
            setValue("marsAction", actions[Math.floor(Math.random() * actions.length)]);
            setValue("city", "Mars Base");
        }
    };

    return (
        <div className="outer-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="text-container">
                    <h2>Mission Control</h2>
                </div>
                <div className="form-input-outer">
                    <section className="inner-form">
                        <label>Captain:
                            <select {...register("captain", { required: true })}>
                                <option value="">Select</option>
                                {options.astronauts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                            </select>
                        </label>

                        <label>Crew 1:
                            <select {...register("crewMember1", { required: true })}>
                                <option value="">Select</option>
                                {options.astronauts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                            </select>
                        </label>

                        <label>Crew 2:
                            <select {...register("crewMember2", { required: true })}>
                                <option value="">Select</option>
                                {options.astronauts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                            </select>
                        </label>

                        <label>Rocket:
                            <select {...register("rocket", { required: true })}>
                                <option value="">Select</option>
                                {options.rockets.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                        </label>

                        <label>Launch Pad:
                            <select {...register("launchPad", { required: true })}>
                                <option value="">Select</option>
                                {options.launches.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                            </select>
                        </label>

                        <label>Landing Pad:
                            <select {...register("landingPad", { required: true })}>
                                <option value="">Select</option>
                                {options.landpads.map(lp => <option key={lp.id} value={lp.full_name}>{lp.full_name}</option>)}
                            </select>
                        </label>

                        <label>Mars Strategy:
                            <select {...register("marsAction", { required: true })}>
                                <option value="stay">Op Mars blijven</option>
                                <option value="refuel">Tanken</option>
                                <option value="return">Teruggaan naar Hub</option>
                            </select>
                        </label>

                        <input type="text" {...register("city")} placeholder="City" />

                        <div className="submit-container" style={{ display: 'flex', gap: '10px', width: '100%' }}>
                            <button type="submit" className="submit" disabled={loading}>Launch</button>
                            <button type="button" onClick={handleRandom} className="submit" style={{ background: '#555' }}>Random</button>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
};

export default MissionForm;




