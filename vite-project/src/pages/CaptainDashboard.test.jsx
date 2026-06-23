import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CaptainDashboard from "./CaptainDashboard";
import { CaptainContext } from "../context/CaptainContext";

vi.mock("../components/MissionForm", () => ({
  default: () => (
    <div>MissionForm Component</div>
  ),
}));

vi.mock(
  "../components/MissionDetailCard",
  () => ({
    default: ({ mission }) => (
      <div>
        MissionCard: {mission.title}
      </div>
    ),
  })
);

describe("CaptainDashboard", () => {
  test("renders dashboard title", () => {
    render(
      <CaptainContext.Provider
        value={{
          missions: [],
          users: [],
          options: {},
          loading: false,
          isSuccess: false,
          handleCreateMission:
            vi.fn(),
          handleDeleteMission:
            vi.fn(),
        }}
      >
        <CaptainDashboard />
      </CaptainContext.Provider>
    );

    expect(
      screen.getByText(
        "Captain Dashboard"
      )
    ).toBeInTheDocument();
  });

  test("renders mission form", () => {
    render(
      <CaptainContext.Provider
        value={{
          missions: [],
          users: [],
          options: {},
          loading: false,
          isSuccess: false,
          handleCreateMission:
            vi.fn(),
          handleDeleteMission:
            vi.fn(),
        }}
      >
        <CaptainDashboard />
      </CaptainContext.Provider>
    );

    expect(
      screen.getByText(
        "MissionForm Component"
      )
    ).toBeInTheDocument();
  });

  test("shows empty state", () => {
    render(
      <CaptainContext.Provider
        value={{
          missions: [],
          users: [],
          options: {},
          loading: false,
          isSuccess: false,
          handleCreateMission:
            vi.fn(),
          handleDeleteMission:
            vi.fn(),
        }}
      >
        <CaptainDashboard />
      </CaptainContext.Provider>
    );

    expect(
      screen.getByText(
        "No missions yet 🚀"
      )
    ).toBeInTheDocument();
  });

  test("renders missions", () => {
    render(
      <CaptainContext.Provider
        value={{
          users: [],
          options: {},
          loading: false,
          isSuccess: false,
          handleCreateMission:
            vi.fn(),
          handleDeleteMission:
            vi.fn(),
          missions: [
            {
              _id: "1",
              title: "Mars Mission",
            },
            {
              _id: "2",
              title: "Moon Mission",
            },
          ],
        }}
      >
        <CaptainDashboard />
      </CaptainContext.Provider>
    );

    expect(
      screen.getByText(
        "MissionCard: Mars Mission"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "MissionCard: Moon Mission"
      )
    ).toBeInTheDocument();
  });
});