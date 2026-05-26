import { useContext } from "react";

import MissionForm from "../components/MissionForm";

import MissionDetailCard from "../components/MissionDetailCard";

import { CaptainContext } from "../context/CaptainContext";

function CaptainDashboard() {

    const {

        missions,

        users,

        options,

        loading,

        isSuccess,

        handleCreateMission,

        handleDeleteMission,

    } = useContext(CaptainContext);

    return (

        <main className="captain-dashboard">

            <h1>
                Captain Dashboard
            </h1>

            <MissionForm

                onSubmit={
                    handleCreateMission
                }

                users={users}

                options={options}

                loading={loading}

                isSuccess={isSuccess}
            />

            <section className="missions-list">

                {(!missions ||

                    missions.length === 0) && (

                    <p>
                        No missions yet 🚀
                    </p>
                )}

                {Array.isArray(missions) &&

                    missions
                        .filter(Boolean)
                        .map(
                            (
                                mission,
                                index
                            ) => (

                                <MissionDetailCard

                                    key={
                                        mission._id
                                    }

                                    mission={
                                        mission
                                    }

                                    index={
                                        index
                                    }

                                    onDelete={
                                        handleDeleteMission
                                    }

                                    isCaptain={
                                        true
                                    }
                                />
                            )
                        )
                }

            </section>

        </main>
    );
}

export default CaptainDashboard;