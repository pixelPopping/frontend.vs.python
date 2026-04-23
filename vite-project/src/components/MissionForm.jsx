import { useForm } from "react-hook-form";

const SelectField = ({ label, name, register, options, placeholder }) => (
    <>
        {label && <label>{label}</label>}
        <select {...register(name)}>
            <option value="">{placeholder}</option>
            {options?.map((item) => (
                <option key={item.id || item.name} value={item.name}>
                    {item.name}
                </option>
            ))}
        </select>
    </>
);

const MissionForm = ({ onSubmit, options, loading }) => {
    const { register, handleSubmit, setValue } = useForm();

    const handleRandomMission = () => {
        const astronauts = options?.astronauts || [];
        const rockets = options?.rockets || [];

        if (rockets.length > 0 && astronauts.length > 0) {
            const randomRocket = rockets[Math.floor(Math.random() * rockets.length)];
            const randomCaptain = astronauts[Math.floor(Math.random() * astronauts.length)];
            
            setValue("rocket", randomRocket.name);
            setValue("captain", randomCaptain.name);
            setValue("city", "Mars");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <main className="main-outer-form">
            <div className="outer-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="text-container">
                        <h2>Novi-Naut Mission Control</h2>
                    </div>

                    <div className="form-input-outer">
                        <section className="inner-form">
                            <SelectField 
                                name="captain" 
                                register={register} 
                                options={options?.astronauts} 
                                placeholder="Select Captain" 
                            />

                            <SelectField 
                                name="rocket" 
                                register={register} 
                                options={options?.rockets} 
                                placeholder="Select Rocket" 
                            />

                            <label>Mars Strategy:</label>
                            <select {...register("marsAction")}>
                                <option value="stay">Op Mars blijven</option>
                                <option value="refuel">Tanken</option>
                                <option value="return">Teruggaan naar Novi Space Hub</option>
                            </select>

                            <input type="text" {...register("city")} placeholder="Destination City" />

                            <div className="submit-container" style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="submit">Register Mission</button>
                                <button type="button" onClick={handleRandomMission} className="submit" style={{ background: 'gray' }}>
                                    Random Mission
                                </button>
                                <button type="button" onClick={() => alert("Showing mission data...")} className="submit" style={{ background: 'blue' }}>
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

export default MissionForm;
