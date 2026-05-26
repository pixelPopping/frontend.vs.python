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

        await onSubmit(data);
    }

    return (

        <form
            onSubmit={handleSubmit(submitForm)}
        >

            <h2>
                Create Mission
            </h2>

            {/* TITLE */}
            <input
                type="text"
                placeholder="Title"
                {...register("title")}
            />

            {/* ROCKET */}
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

            {/* CAPTAIN */}
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

            {/* CREW */}
            <select
                {...register("crew")}
            >

                <option value="">
                    Select Crew
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