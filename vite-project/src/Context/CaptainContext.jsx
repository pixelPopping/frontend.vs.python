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

export const CaptainContext = createContext(null);

function CaptainContextProvider({ children }) {

    const [missions, setMissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState({});

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        initializeDashboard();
    }, []);

    async function initializeDashboard() {
        try {
            setLoading(true);
            setError(null);

            const [missionsData, usersData, optionsData] =
                await Promise.all([
                    getMissions(),
                    getUsers(),
                    getMissionOptions(),
                ]);

            setMissions(missionsData || []);
            setUsers(usersData || []);
            setOptions(optionsData || {});

        } catch (error) {
            console.error("DASHBOARD INIT ERROR:", error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

    async function refreshMissions() {
        try {
            const data = await getMissions();
            setMissions(data || []);

        } catch (error) {
            console.error("MISSIONS ERROR:", error);
        }
    }

    async function handleCreateMission(payload) {
        try {
            setLoading(true);
            setIsSuccess(false);
            setError(null);

            await createMission(payload);

            await refreshMissions();

            setIsSuccess(true);

        } catch (error) {
            console.error("CREATE ERROR:", error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteMission(id) {
        try {
            setLoading(true);
            setError(null);

            await deleteMission(id);

            await refreshMissions();

        } catch (error) {
            console.error("DELETE ERROR:", error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    }

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