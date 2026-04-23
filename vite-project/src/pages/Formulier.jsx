import React from 'react';
import { useForm } from "react-hook-form";

const Formulier = ({ onSubmit, options, loading, errorMessage }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const handleRandomMission = () => {
        if (options.rockets.length > 0 && options.astronauts.length > 0) {
            const randomRocket = options.rockets[Math.floor(Math.random() * options.rockets.length)];
            const randomCaptain = options.astronauts[Math.floor(Math.random() * options.astronauts.length)];
            
            setValue("rocket", randomRocket.name);
            setValue("captain", randomCaptain.name);
            setValue("city", "Mars");
        }
    };

    return (
        <main className="main-outer-form">
            <div className="outer-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="text-container">
                        <h2>Novi-Naut Mission Control</h2>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>

                    <div className="form-input-outer">
                        <section className="inner-form">
                            <select {...register("captain", { required: true })}>
                                <option value="">Select Captain</option>
                                {options.astronauts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                            </select>

                            <select {...register("rocket", { required: true })}>
                                <option value="">Select Rocket</option>
                                {options.rockets.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>

                            <label>Mars Strategy:</label>
                            <select {...register("marsAction")}>
                                <option value="stay">Op Mars blijven</option>
                                <option value="refuel">Tanken</option>
                                <option value="return">Teruggaan naar Novi Space Hub</option>
                            </select>

                            <input type="text" {...register("city")} placeholder="Destination City" />

                            <div className="submit-container" style={{ display: 'flex', gap: '10px', width: 'auto' }}>
                                <button type="submit" className="submit" disabled={loading}>
                                    {loading ? "Bezig..." : "Register Mission"}
                                </button>

                                <button type="button" onClick={handleRandomMission} className="submit" style={{ background: 'gray' }}>
                                    Random Mission
                                </button>
                                
                                <button type="button" onClick={() => window.alert("Status verzonden naar terminal.")} className="submit" style={{ background: 'blue' }}>
                                    Show Mission
                                </button>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Formulier;




