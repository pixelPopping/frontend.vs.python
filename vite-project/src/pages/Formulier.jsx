import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SignUpForm = () => {
    const [options, setOptions] = useState({ astronauts: [], rockets: [], landpads: [], launches: [] });
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        fetch("http://localhost:5000/api/mission-options")
            .then(res => res.json())
            .then(data => setOptions(data))
            .catch(err => console.error(err));
    }, []);

    const onSubmit = async (data) => {
        const res = await fetch("http://localhost:5000/api/launch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        alert(result.message);
    };

    // Functie voor de 'Random Mission' (Python optie 4)
    const handleRandomMission = () => {
        const randomRocket = options.rockets[Math.floor(Math.random() * options.rockets.length)];
        const randomCaptain = options.astronauts[Math.floor(Math.random() * options.astronauts.length)];
        if (randomRocket) setValue("rocket", randomRocket.name);
        if (randomCaptain) setValue("captain", randomCaptain.name);
        setValue("city", "Mars");
    };

    return (
        <main className="main-outer-form">
            <div className="outer-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="text-container">
                        <h2>Novi-Naut Mission Control</h2>
                    </div>

                    <div className="form-input-outer">
                        <section className="inner-form">
                            <select {...register("captain")}>
                                <option value="">Select Captain</option>
                                {options.astronauts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                            </select>

                            <select {...register("rocket")}>
                                <option value="">Select Rocket</option>
                                {options.rockets.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>

                            {/* Mars Options (Python optie 7) */}
                            <label>Mars Strategy:</label>
                            <select {...register("marsAction")}>
                                <option value="stay">Op Mars blijven</option>
                                <option value="refuel">Tanken</option>
                                <option value="return">Teruggaan naar Novi Space Hub</option>
                            </select>

                            <input type="text" {...register("city")} placeholder="Destination City" />

                            <div className="submit-container" style={{ display: 'flex', gap: '10px', width: 'auto' }}>
                                <button type="submit" className="submit">Register Mission</button>
                                
                                {/* Extra knoppen uit je menu */}
                                <button type="button" onClick={handleRandomMission} className="submit" style={{ background: 'gray' }}>
                                    Random Mission
                                </button>
                                
                                <button type="button" onClick={() => alert("Printing mission details to Python terminal...")} className="submit" style={{ background: 'blue' }}>
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

export default SignUpForm;



