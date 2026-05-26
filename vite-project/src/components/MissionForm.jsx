import { useForm } from "react-hook-form";

function MissionForm({

    onSubmit,

    users = [],

    options = {},

    loading,

}) {

    const {

        register,

        handleSubmit,

    } = useForm();

    async function submitForm(data) {

        const payload = {

            title: data.title,

            rocket: data.rocket,

            launchPad: data.launchPad,

            landingPad: data.landingPad,

            captain: data.captain,

            crew: [

                data.crewMember1,

                data.crewMember2,
            ],
        };

        await onSubmit(payload);
    }

    return (

        <form
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
                            value={rocket.id}
                        >
                            {rocket.name}
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
                            value={pad.id}
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
                            value={pad.id}
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
                            value={user.id}
                        >
                            {user.firstname}
                        </option>

                    ))
                }

            </select>

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
                            value={user.id}
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
                            value={user.id}
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

                Create Mission

            </button>

        </form>
    );
}

export default MissionForm;