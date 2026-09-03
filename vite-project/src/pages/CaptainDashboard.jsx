import React, { useContext } from "react";

import MissionForm from "../components/MissionForm";
import MissionDetailCard from "../components/MissionDetailCard";

import styles from "./CaptainDashBoard.module.css";

import "../App.css";

import {
  CaptainContext,
} from "../context/CaptainContext";

function CaptainDashboard() {
  const {
    missions = [],
    users = [],
    options = {},
    loading = false,
    isSuccess = false,
    demoMode = false,
    handleCreateMission,
    handleDeleteMission,
  } = useContext(
    CaptainContext
  );

  const missionList =
    Array.isArray(missions)
      ? missions.filter(Boolean)
      : [];

  return (
    <div
      className={
        styles.dashboard
      }
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <div
        className={
          styles.headerContainer
        }
      >
        <div
          className={
            styles.novilogo
          }
        />
      </div>

      <header
        className={
          styles.captainTitle
        }
      >
        <h1>
          Captain Dashboard
        </h1>
      </header>

      {/* ========================================
          MAIN
      ======================================== */}

      <main
        className={
          styles.missionPage
        }
      >
        <section
          className={
            styles.outerMission
          }
        >

          {/* ======================================
              DEMO MESSAGE
          ====================================== */}

          {demoMode && (
            <div
              className={
                styles.demoMessage
              }
            >
              Demo mode — backend
              unavailable. Your missions
              are stored locally.
            </div>
          )}

          {/* ======================================
              CREATE MISSION
          ====================================== */}

          <article
            className={
              styles.missionOuterForm
            }
          >
            <MissionForm
              onSubmit={
                handleCreateMission
              }
              users={users}
              options={options}
              loading={loading}
              isSuccess={
                isSuccess
              }
            />
          </article>

          {/* ======================================
              NO MISSIONS
          ====================================== */}

          {!loading &&
            missionList.length ===
              0 && (
              <p>
                No missions yet 🚀
              </p>
            )}

          {/* ======================================
              MISSION LIST
          ====================================== */}

          {missionList.length >
            0 && (
            <div
              className={
                styles.outerCardList
              }
            >
              <div
                className={
                  styles.missionList
                }
              >
                {missionList.map(
                  (
                    mission,
                    index
                  ) => (
                    <MissionDetailCard
                      key={
                        mission._id ||
                        mission.id ||
                        `mission-${index}`
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
                )}
              </div>
            </div>
          )}

        </section>
      </main>

      {/* ========================================
          FOOTER
      ======================================== */}

      <div
        className={
          styles.outerFooter
        }
      >
        <section
          className={
            styles.Footer
          }
        >
          <footer
            className={
              styles.innerFooter
            }
          >
            <p>
              pixelpopper@productions
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default CaptainDashboard;