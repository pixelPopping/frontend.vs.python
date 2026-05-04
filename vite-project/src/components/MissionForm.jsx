import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import handleRandom from '../Helpers/handleRandom';
import getStrategyFromCity from "../Helpers/getStrategyFromCity";
import './MissionForm.css';

const MissionForm = ({ onSubmit, options, loading, isSuccess }) => {

    const { register, handleSubmit, setValue, reset, watch } = useForm();

    const destination = watch("city");
    const missionAction = watch("missionAction");

    // reset na succes
    useEffect(() => {
        if (isSuccess) reset();
    }, [isSuccess, reset]);

    // helper als suggestie (NIET overschrijven!)
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
             <div className='container-position'>
                <div className='outer'>
                <div className='inner-container-submit'>
                <div className="text-container">
                    <header>
                        <h1 className="unbounded-title-mission">Mission Control</h1>
                    </header>
                </div>
                <section className="button-section">
                    <button 
                        type="submit" 
                        className="submit-mission" 
                        disabled={loading}
                    >
                        Launch
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRandom(options, setValue)}
                        className="submit"
                    >
                        Random
                    </button>
                </section>
                </div>
                </div>
                </div>
                <div className="form-input-outer">
                    <section className="inner-form-mission">
                        <article className='text'>

                            <label className='placeholder'>Captain:
                                <select {...register("captain", { required: true })}>
                                    <option value="">Select</option>
                                    {options?.astronauts?.map(a => (
                                        <option key={a.id} value={a.name}>{a.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className='placeholder'>Crew1:
                                <select {...register("crewMember1", { required: true })}>
                                    <option value="">Select</option>
                                    {options?.astronauts?.map(a => (
                                        <option key={a.id} value={a.name}>{a.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className='placeholder'>Crew2:
                                <select {...register("crewMember2", { required: true })}>
                                    <option value="">Select</option>
                                    {options?.astronauts?.map(a => (
                                        <option key={a.id} value={a.name}>{a.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className='placeholder'>Rocket:
                                <select {...register("rocket", { required: true })}>
                                    <option value="">Select</option>
                                    {options?.rockets?.map(r => (
                                        <option key={r.id} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className='placeholder'>Launch Pad:
                                <select {...register("launchPad", { required: true })}>
                                    <option value="">Select</option>
                                    {options?.launches?.map(l => (
                                        <option key={l.id} value={l.name}>{l.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className='placeholder'>Landing Pad:
                                <select {...register("landingPad", { required: true })}>
                                    <option value="">Select</option>
                                    {options?.landpads?.map(lp => (
                                        <option key={lp.id} value={lp.full_name}>{lp.full_name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className='placeholder'>Mission Action:
                                <select {...register("missionAction", { required: true })}>
                                    <option value="">Select action</option>
                                    <option value="stay">Blijven</option>
                                    <option value="refuel">Tanken</option>
                                    <option value="return">Terugkeren</option>
                                </select>
                            </label>

                            <label className='placeholder'>Destination:
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
