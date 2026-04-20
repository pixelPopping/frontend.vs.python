import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SignUpForm = () => {
    const [options, setOptions] = useState({ astronauts: [], rockets: [], landpads: [], launches: [] });
    const { register, handleSubmit } = useForm();

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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <select {...register("captain")}>
                <option value="">Select Captain</option>
                {options.astronauts.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>

            <select {...register("rocket")}>
                <option value="">Select Rocket</option>
                {options.rockets.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>

            <select {...register("launch")}>
                <option value="">Select Launch Pad</option>
                {options.launches.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>

            <select {...register("landingPad")}>
                <option value="">Select Landing Pad</option>
                {options.landpads.map(p => <option key={p.id} value={p.full_name}>{p.full_name}</option>)}
            </select>

            <input type="text" {...register("city")} placeholder="City" />
            <button type="submit">Register Mission</button>
        </form>
    );
};

export default SignUpForm;


