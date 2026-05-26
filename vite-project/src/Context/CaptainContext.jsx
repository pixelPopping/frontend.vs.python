import React, {
    createContext,
    useEffect,
    useState,
} from "react";

import {
    getMissions,
    createMission,
    deleteMission,
} from "../api/missions";

import { getUsers } from "../api/users";

import { getMissionOptions } from "../api/options";

// =====================================================
// CONTEXT
// =====================================================
export const CaptainContext = createContext({

    missions: [],

    users: [],

    options: {},

    loading: false,

    isSuccess: false,

    error: null,

    refreshMissions: async () => {},

    handleCreateMission: async () => {},

    handleDeleteMission: async () => {},
});

// =====================================================
// PROVIDER
// =====================================================
function CaptainContextProvider({ children }) {

    // =================================================
    // STATE
    // =================================================
    const [missions, setMissions] =
        useState([]);

    const [users, setUsers] =
        useState([]);

    const [options, setOptions] =
        useState({

            rockets: [],

            launchpads: [],

            landpads: [],
        });

    const [loading, setLoading] =
        useState(false);

    const [isSuccess, setIsSuccess] =
        useState(false);

    const [error, setError] =
        useState(null);

    // =================================================
    // INIT
    // =================================================
    useEffect(() => {

        initializeDashboard();

    }, []);

    // =================================================
    // INITIALIZE DASHBOARD
    // =================================================
    async function initializeDashboard() {

        try {

            setLoading(true);

            setError(null);

            // =========================================
            // MISSIONS
            // =========================================
            let missionsData = [];

            try {

                missionsData =
                    await getMissions();

                console.log(
                    "MISSIONS DATA:",
                    missionsData
                );

            } catch (error) {

                console.error(
                    "MISSIONS ERROR:",
                    error
                );
            }

            // =========================================
            // USERS
            // =========================================
            let usersData = [];

            try {

                usersData =
                    await getUsers();

                console.log(
                    "USERS DATA:",
                    usersData
                );

            } catch (error) {

                console.error(
                    "USERS ERROR:",
                    error
                );
            }

            // =========================================
            // OPTIONS
            // =========================================
            let optionsData = {

                rockets: [],

                launchpads: [],

                landpads: [],
            };

            try {

                optionsData =
                    await getMissionOptions();

                console.log(
                    "OPTIONS DATA:",
                    optionsData
                );

            } catch (error) {

                console.error(
                    "OPTIONS ERROR:",
                    error
                );
            }

            // =========================================
            // SET STATE
            // =========================================
            console.log(
                "SETTING MISSIONS:",
                missionsData
            );

            console.log(
                "SETTING USERS:",
                usersData
            );

            console.log(
                "SETTING OPTIONS:",
                optionsData
            );

            setMissions(
                missionsData || []
            );

            setUsers(
                usersData || []
            );

            setOptions({

                rockets:
                    optionsData?.rockets || [],

                launchpads:
                    optionsData?.launchpads || [],

                landpads:
                    optionsData?.landpads || [],
            });

        } catch (error) {

            console.error(
                "DASHBOARD INIT ERROR:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }

    // =================================================
    // REFRESH MISSIONS
    // =================================================
    async function refreshMissions() {

        try {

            const data =
                await getMissions();

            console.log(
                "REFRESH MISSIONS:",
                data
            );

            setMissions(data || []);

        } catch (error) {

            console.error(
                "REFRESH ERROR:",
                error
            );
        }
    }

    // =================================================
    // CREATE MISSION
    // =================================================
    async function handleCreateMission(
        payload
    ) {

        try {

            setLoading(true);

            setError(null);

            setIsSuccess(false);

            console.log(
                "CREATE PAYLOAD:",
                payload
            );

            await createMission(payload);

            console.log(
                "MISSION CREATED SUCCESS"
            );

            await refreshMissions();

            setIsSuccess(true);

        } catch (error) {

            console.error(
                "CREATE ERROR:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }

    // =================================================
    // DELETE MISSION
    // =================================================
    async function handleDeleteMission(
        id
    ) {

        try {

            setLoading(true);

            setError(null);

            console.log(
                "DELETE MISSION:",
                id
            );

            await deleteMission(id);

            await refreshMissions();

        } catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }

    // =================================================
    // PROVIDER
    // =================================================
    return (

        <CaptainContext.Provider
            value={{

                missions,

                users,

                options,

                loading,

                isSuccess,

                error,

                refreshMissions,

                handleCreateMission,

                handleDeleteMission,
            }}
        >

            {children}

        </CaptainContext.Provider>
    );
}

export default CaptainContextProvider;