import { useForm } from "react-hook-form";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import "./MissionForm.css";

function MissionForm({
  onSubmit,
  users = [],
  options = {},
  loading,
  isSuccess,
}) {
  const { user } =
    useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  async function submitForm(data) {
    const payload = {
      title: data.title,

      city: data.city,

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
        user.username,

      crew: [
        data.crewMember1 && {
          name:
            data.crewMember1,
          accepted: false,
        },

        data.crewMember2 && {
          name:
            data.crewMember2,
          accepted: false,
        },
      ].filter(Boolean),

      status: "pending",
    };

    await onSubmit(payload);

    reset();
  }

  console.log(
  "MISSION FORM OPTIONS:"
);

console.log(options);

console.log(
  "ROCKETS:"
);

console.log(
  options?.rockets
);

console.log(
  "SHIPS:"
);

console.log(
  options?.ships
);

console.log(
  "LAUNCHPADS:"
);

console.log(
  options?.launchpads
);

console.log(
  "LANDPADS:"
);

console.log(
  options?.landpads
);

console.log(
  "USERS:"
);

console.log(users);

  return (
    <form
      className="inner-form-mission"
      onSubmit={handleSubmit(
        submitForm
      )}
    >
      <h2 className="archivo-black-regular">
        Create Mission
      </h2>

      <div className="mission-fields">

        <input
          type="text"
          placeholder="Mission Title"
          {...register("title")}
        />

        <input
          type="text"
          placeholder="Destination"
          {...register("city")}
        />

        <label>
          Launch Date
        </label>

        <input
          type="date"
          {...register(
            "launchDate"
          )}
        />

        <label>
          Return Date
        </label>

        <input
          type="date"
          {...register(
            "returnDate"
          )}
        />

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
                value={
                  rocket.name
                }
              >
                {rocket.name}
              </option>
            )
          )}
        </select>

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
                value={
                  ship.name
                }
              >
                {ship.name}
              </option>
            )
          )}
        </select>

        <select
          {...register(
            "launchPad"
          )}
        >
          <option value="">
            Select Launch Pad
          </option>

          {options?.launchpads?.map(
            (pad) => (
              <option
                key={pad.id}
                value={
                  pad.name
                }
              >
                {pad.name}
              </option>
            )
          )}
        </select>

        <select
          {...register(
            "landingPad"
          )}
        >
          <option value="">
            Select Landing Pad
          </option>

          {options?.landpads?.map(
            (pad) => (
              <option
                key={pad.id}
                value={
                  pad.name
                }
              >
                {pad.name}
              </option>
            )
          )}
        </select>

        <h3>
          Assigned Crew
        </h3>

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
                value={
                  user.username
                }
              >
                {user.username}
              </option>
            ))}
        </select>

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
                value={
                  user.username
                }
              >
                {user.username}
              </option>
            ))}
        </select>

      </div>

      <section className="create-button-container">

        <button
          type="submit"
          className="create-btn"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Mission"}
        </button>

        {isSuccess && (
          <p>
            Mission created 🚀
          </p>
        )}

      </section>
    </form>
  );
}

export default MissionForm;