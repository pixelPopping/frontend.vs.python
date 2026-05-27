import {

    createContext,

    useEffect,

    useState,

} from "react";

import {

    getMissions,

    createMission,

    deleteMission,

} from "../api/missions";

import {

    getUsers,

} from "../api/users";

import {

    getMissionOptions,

} from "../api/missionOptions";

export const CaptainContext =
    createContext(null);

function CaptainContextProvider({

    children,

}) {

    // =================================================
    // STATE
    // =================================================
    const [

        missions,

        setMissions,

    ] = useState([]);

    const [

        users,

        setUsers,

    ] = useState([]);

    const [

        options,

        setOptions,

    ] = useState({});

    const [

        loading,

        setLoading,

    ] = useState(false);

    const [

        isSuccess,

        setIsSuccess,

    ] = useState(false);

    const [

        error,

        setError,

    ] = useState(null);

    // =================================================
    // INIT
    // =================================================
    useEffect(() => {

        initializeDashboard();

    }, []);

    // =================================================
    // INITIALIZE
    // =================================================
    async function initializeDashboard() {

        try {

            setLoading(true);

            setError(null);

            const [

                missionsData,

                usersData,

                optionsData,

            ] = await Promise.all([

                getMissions(),

                getUsers(),

                getMissionOptions(),
            ]);

            setMissions(
                missionsData || []
            );

            setUsers(
                usersData || []
            );

            setOptions(
                optionsData || {}
            );

        } catch (error) {

            console.error(
                "DASHBOARD ERROR:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    }

    // =================================================
    // CREATE MISSION
    // =================================================
    async function handleCreateMission(
        missionData
    ) {

        try {

            setLoading(true);

            setError(null);

            setIsSuccess(false);

            await createMission(
                missionData
            );

            const updatedMissions =
                await getMissions();

            setMissions(
                updatedMissions
            );

            setIsSuccess(true);

        } catch (error) {

            console.error(
                "CREATE MISSION ERROR:",
                error
            );

            setError(
                error.message
            );

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

            await deleteMission(id);

            const updatedMissions =
                await getMissions();

            setMissions(
                updatedMissions
            );

        } catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );

            setError(
                error.message
            );

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

                error,

                isSuccess,

                handleCreateMission,

                handleDeleteMission,
            }}
        >

            {children}

        </CaptainContext.Provider>
    );
}

export default CaptainContextProvider;