import { useForm } from "react-hook-form";

const SelectField = ({ name, register, options, placeholder }) => (
    <select {...register(name)}>
        <option value="">{placeholder}</option>
        {options?.map((item) => (
            <option key={item.id} value={item.id}>{item.name || item.full_name}</option>
        ))}
    </select>
);

const MissionForm = ({ onSubmit, options, loading }) => {
    const { register, handleSubmit, setValue } = useForm();

    const handleRandomMission = () => {
        if (options?.rockets?.length > 0 && options?.astronauts?.length > 0) {
            const rRocket = options.rockets[Math.floor(Math.random() * options.rockets.length)];
            const rCaptain = options.astronauts[Math.floor(Math.random() * options.astronauts.length)];
            const rLaunch = options.launchpads[Math.floor(Math.random() * options.launchpads.length)];
            
            setValue("rocket", rRocket.name);
            setValue("captain", rCaptain.name);
            setValue("launchpad", rLaunch.id);
            setValue("city", "Mars");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <main className="main-outer-form">
            <div className="outer-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="text-container"><h2>Novi-Naut Mission Control</h2></div>
                    <div className="form-input-outer">
                        <section className="inner-form">
                            <SelectField name="captain" register={register} options={options?.astronauts} placeholder="Select Captain" />
                            <SelectField name="rocket" register={register} options={options?.rockets} placeholder="Select Rocket" />
                            <SelectField name="launchpad" register={register} options={options?.launchpads} placeholder="Select Launch Pad" />
                            <SelectField name="landpad_id" register={register} options={options?.landpads} placeholder="Select Landing Pad" />
                            
                            <label>Mars Strategy:</label>
                            <select {...register("marsAction")}>
                                <option value="stay">Op Mars blijven</option>
                                <option value="refuel">Tanken</option>
                                <option value="return">Teruggaan naar Novi Space Hub</option>
                            </select>
                            
                            <input type="text" {...register("city")} placeholder="Destination City" />
                            
                            <div className="submit-container" style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="submit">Register Mission</button>
                                <button type="button" onClick={handleRandomMission} className="submit" style={{ background: 'gray' }}>Random Mission</button>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default MissionForm;

