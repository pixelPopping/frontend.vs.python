import { useForm } from "react-hook-form";
import "./MissionForm.css";

function MissionForm({

    onSubmit,

    users = [],

    options = {},

    loading,

    isSuccess,

}) {

    const {

        register,

        handleSubmit,

        reset,

    } = useForm();

    // =================================================
    // SUBMIT
    // =================================================
    async function submitForm(data) {

        const payload = {

            title:
                data.title,

            city:
                data.city,

            launchDate:
                data.launchDate,

            returnDate:
                data.returnDate,

            rocket:
                data.rocket,

            ship:
                data.ship,

            launchPad:
                data.launchPad,

            landingPad:
                data.landingPad,

            captain:
                data.captain,

            crew: [

                data.crewMember1,

                data.crewMember2,
            ],
        };

        await onSubmit(payload);

        reset();
    }

    // =================================================
    // RENDER
    // =================================================
    return (

        <form
            className="inner-form-mission"
            onSubmit={handleSubmit(submitForm)}
        >

            <h2>
                Create Mission
            </h2>

            {/* ================================================= */}
            {/* TITLE */}
            {/* ================================================= */}
            <input
                type="text"
                placeholder="Mission Title"
                {...register("title")}
            />

            {/* ================================================= */}
            {/* DESTINATION */}
            {/* ================================================= */}
            <input
                type="text"
                placeholder="Destination"
                {...register("city")}
            />

            {/* ================================================= */}
            {/* LAUNCH DATE */}
            {/* ================================================= */}
            <label>
                Launch Date
            </label>

            <input
                type="date"
                {...register("launchDate")}
            />

            {/* ================================================= */}
            {/* RETURN DATE */}
            {/* ================================================= */}
            <label>
                Return Date
            </label>

            <input
                type="date"
                {...register("returnDate")}
            />

            {/* ================================================= */}
            {/* ROCKET */}
            {/* ================================================= */}
            <select
                {...register("rocket")}
            >

                <option value="">
                    Select Rocket
                </option>

                {options?.rockets?.map(
                    (rocket) => (

                        <option
                            key={rocket.id}
                            value={rocket.name}
                        >
                            {rocket.name}
                        </option>

                    )
                )}

            </select>

            {/* ================================================= */}
            {/* SHIP */}
            {/* ================================================= */}
            <select
                {...register("ship")}
            >

                <option value="">
                    Select Ship
                </option>

                {options?.ships?.map(
                    (ship) => (

                        <option
                            key={ship.id}
                            value={ship.name}
                        >
                            {ship.name}
                        </option>

                    )
                )}

            </select>

            {/* ================================================= */}
            {/* LAUNCHPAD */}
            {/* ================================================= */}
            <select
                {...register("launchPad")}
            >

                <option value="">
                    Select Launchpad
                </option>

                {options?.launchpads?.map(
                    (pad) => (

                        <option
                            key={pad.id}
                            value={pad.name}
                        >
                            {pad.name}
                        </option>

                    )
                )}

            </select>

            {/* ================================================= */}
            {/* LANDINGPAD */}
            {/* ================================================= */}
            <select
                {...register("landingPad")}
            >

                <option value="">
                    Select Landing Pad
                </option>

                {options?.landpads?.map(
                    (pad) => (

                        <option
                            key={pad.id}
                            value={pad.name}
                        >
                            {pad.name}
                        </option>

                    )
                )}

            </select>

            {/* ================================================= */}
            {/* CAPTAIN */}
            {/* ================================================= */}
            <select
                {...register("captain")}
            >

                <option value="">
                    Select Captain
                </option>

                {users
                    ?.filter(
                        (user) =>
                            user.role ===
                            "captain"
                    )
                    ?.map((user) => (

                        <option
                            key={user.id}
                            value={user.firstname}
                        >
                            {user.firstname}
                        </option>

                    ))
                }

            </select>

            {/* ================================================= */}
            {/* ASSIGNED CREW */}
            {/* ================================================= */}
            <h3>
                Assigned Crew
            </h3>

            {/* ================================================= */}
            {/* CREW MEMBER 1 */}
            {/* ================================================= */}
            <select
                {...register(
                    "crewMember1"
                )}
            >

                <option value="">
                    Select Crew Member 1
                </option>

                {users
                    ?.filter(
                        (user) =>
                            user.role ===
                            "crew"
                    )
                    ?.map((user) => (

                        <option
                            key={user.id}
                            value={user.firstname}
                        >
                            {user.firstname}
                        </option>

                    ))
                }

            </select>

            {/* ================================================= */}
            {/* CREW MEMBER 2 */}
            {/* ================================================= */}
            <select
                {...register(
                    "crewMember2"
                )}
            >

                <option value="">
                    Select Crew Member 2
                </option>

                {users
                    ?.filter(
                        (user) =>
                            user.role ===
                            "crew"
                    )
                    ?.map((user) => (

                        <option
                            key={user.id}
                            value={user.firstname}
                        >
                            {user.firstname}
                        </option>

                    ))
                }

            </select>

            {/* ================================================= */}
            {/* BUTTON */}
            {/* ================================================= */}
            <button
                type="submit"
                disabled={loading}
            >

                {loading
                    ? "Creating..."
                    : "Create Mission"}

            </button>

            {/* ================================================= */}
            {/* SUCCESS */}
            {/* ================================================= */}
            {isSuccess && (

                <p>
                    Mission created 🚀
                </p>
            )}

        </form>
    );
}

export default MissionForm;