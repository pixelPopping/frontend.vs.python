import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import handleRandom from '../Helpers/handleRandom';
import './MissionForm.css'

const MissionForm = ({ onSubmit, options, loading, isSuccess }) => {

    const { register, handleSubmit, setValue, reset, watch } = useForm();

    
    const destination = watch("city");

    
    useEffect(() => {
        if (isSuccess) reset();
    }, [isSuccess, reset]);

    useEffect(() => {
        if (!destination) return;

        const city = destination.toLowerCase();

        if (city.includes("mars")) {
            setValue("marsAction", "refuel");
        } else if (city.includes("olympus")) {
            setValue("marsAction", "stay");
        } else if (city.includes("phobos")) {
            setValue("marsAction", "return");
        } else {
            setValue("marsAction", "stay"); // standaardstrategie
        }
    }, [destination, setValue]);

    return (
        <div className="outer-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="text-container">
                    <h2>Mission Control</h2>
                </div>

                <div className="form-input-outer">
                    <section className="inner-form-mission">
                        <label className='placeholder'>Captain:
                            <select {...register("captain", { required: true })}>
                                <option value="">Select</option>
                                {options.astronauts.map(a => (
                                    <option key={a.id} value={a.name}>{a.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className='placeholder'>Crew 1:
                            <select {...register("crewMember1", { required: true })}>
                                <option value="">Select</option>
                                {options.astronauts.map(a => (
                                    <option key={a.id} value={a.name}>{a.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className='placeholder'>Crew 2:
                            <select {...register("crewMember2", { required: true })}>
                                <option value="">Select</option>
                                {options.astronauts.map(a => (
                                    <option key={a.id} value={a.name}>{a.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className='placeholder'>Rocket:
                            <select {...register("rocket", { required: true })}>
                                <option value="">Select</option>
                                {options.rockets.map(r => (
                                    <option key={r.id} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className='placeholder'>Launch Pad:
                            <select {...register("launchPad", { required: true })}>
                                <option value="">Select</option>
                                {options.launches.map(l => (
                                    <option key={l.id} value={l.name}>{l.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className='placeholder'>Landing Pad:
                            <select {...register("landingPad", { required: true })}>
                                <option value="">Select</option>
                                {options.landpads.map(lp => (
                                    <option key={lp.id} value={lp.full_name}>{lp.full_name}</option>
                                ))}
                            </select>
                        </label>
                        <label className='placeholder'>Mars Strategy:
                            <select {...register("marsAction", { required: true })}>
                                <option value="stay">Op Mars blijven</option>
                                <option value="refuel">Tanken</option>
                                <option value="return">Teruggaan naar Hub</option>
                            </select>
                        </label>
                        <label className='placeholder'>Destination:
                        <input type="text" {...register("city")} placeholder="Destination City" />
                        </label>
                        <div className='button-outer'>
                        <div className='inner-container-submit'>
                            <button type="submit" className="submit-mission" disabled={loading}>Launch</button>

                            <button
                                type="button"
                                onClick={() => handleRandom(options, setValue)}
                                className="submit"
                                style={{ background: '#555' }}
                            >
                                Random
                            </button>
                        </div>
                        </div>

                    </section>
                </div>
            </form>
        </div>
    );
};

export default MissionForm;




