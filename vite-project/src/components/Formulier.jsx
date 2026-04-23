
const Formulier = ({onSubmit, alert, loading, errorMessage, }) => {

     const { register, 
             handleSubmit, 
             setValue, 
             formState: {errors},
     } = useForm();

    return (
        <>
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
        </>
    )
}

export default Formulier