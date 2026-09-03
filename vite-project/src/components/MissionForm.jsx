import React, { useContext } from "react";
import { useForm } from "react-hook-form";

import { AuthContext } from "../context/AuthContext";

import styles from "./MissionForm.module.css";

function MissionForm({
  onSubmit,
  users = [],
  options = {},
  loading = false,
  isSuccess = false,
}) {
  const { user } =
    useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  async function submitForm(data) {
    const crewUsers =
      Array.isArray(users)
        ? users
        : [];

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

      // ==========================================
      // CAPTAIN
      // ==========================================

      captain:
        user?.username ||
        user?.email ||
        "Demo Captain",

      // ==========================================
      // CREW
      // ==========================================

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

    try {
      await onSubmit(payload);

      reset();
    } catch (error) {
      console.error(
        "Mission creation failed:",
        error
      );
    }
  }

  // ==========================================
  // SAFE OPTIONS
  // ==========================================

  const rockets =
    Array.isArray(
      options?.rockets
    )
      ? options.rockets
      : [];

  const ships =
    Array.isArray(
      options?.ships
    )
      ? options.ships
      : [];

  const launchpads =
    Array.isArray(
      options?.launchpads
    )
      ? options.launchpads
      : [];

  const landpads =
    Array.isArray(
      options?.landpads
    )
      ? options.landpads
      : [];

  const crewUsers =
    users.filter(
      (crewUser) =>
        crewUser?.role ===
        "crew"
    );

  return (
    <form
      className={
        styles.innerFormMission
      }
      onSubmit={handleSubmit(
        submitForm
      )}
    >
      <h2
        className={
          styles.archivoBlackRegular
        }
      >
        Create Mission
      </h2>

      <div
        className={
          styles.missionFields
        }
      >
        {/* ========================================
            MISSION
        ======================================== */}

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

        {/* ========================================
            DATES
        ======================================== */}

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

        {/* ========================================
            ROCKET
        ======================================== */}

        <select
          {...register("rocket")}
        >
          <option value="">
            Select Rocket
          </option>

          {rockets.map(
            (rocket) => (
              <option
                key={
                  rocket.id ||
                  rocket.name
                }
                value={
                  rocket.name
                }
              >
                {rocket.name}
              </option>
            )
          )}
        </select>

        {/* ========================================
            SHIP
        ======================================== */}

        <select
          {...register("ship")}
        >
          <option value="">
            Select Ship
          </option>

          {ships.map(
            (ship) => (
              <option
                key={
                  ship.id ||
                  ship.name
                }
                value={
                  ship.name
                }
              >
                {ship.name}
              </option>
            )
          )}
        </select>

        {/* ========================================
            LAUNCH PAD
        ======================================== */}

        <select
          {...register(
            "launchPad"
          )}
        >
          <option value="">
            Select Launch Pad
          </option>

          {launchpads.map(
            (pad) => (
              <option
                key={
                  pad.id ||
                  pad.name
                }
                value={
                  pad.name
                }
              >
                {pad.name}
              </option>
            )
          )}
        </select>

        {/* ========================================
            LANDING PAD
        ======================================== */}

        <select
          {...register(
            "landingPad"
          )}
        >
          <option value="">
            Select Landing Pad
          </option>

          {landpads.map(
            (pad) => (
              <option
                key={
                  pad.id ||
                  pad.name
                }
                value={
                  pad.name
                }
              >
                {pad.name}
              </option>
            )
          )}
        </select>

        {/* ========================================
            CREW
        ======================================== */}

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

          {crewUsers.map(
            (crewUser) => (
              <option
                key={
                  crewUser.id ||
                  crewUser.username
                }
                value={
                  crewUser.username
                }
              >
                {
                  crewUser.username
                }
              </option>
            )
          )}
        </select>

        <select
          {...register(
            "crewMember2"
          )}
        >
          <option value="">
            Select Crew Member 2
          </option>

          {crewUsers.map(
            (crewUser) => (
              <option
                key={
                  crewUser.id ||
                  crewUser.username
                }
                value={
                  crewUser.username
                }
              >
                {
                  crewUser.username
                }
              </option>
            )
          )}
        </select>
      </div>

      {/* ========================================
          SUBMIT
      ======================================== */}

      <section
        className={
          styles.createButtonContainer
        }
      >
        <button
          type="submit"
          className={
            styles.createbtn
          }
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