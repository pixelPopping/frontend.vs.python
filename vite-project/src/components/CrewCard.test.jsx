import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import React from "react";
import CrewCard from "./CrewCard";
import { AuthContext } from "../context/AuthContext";

describe("CrewCard", () => {
  const mission = {
    _id: "1234",
    title: "Mars Mission",
    description: "Explore Mars",
    captain: "Captain Kirk",
    rocket: "Falcon 9",
    ship: "Dragon",
    launchPad: "LC-39A",
    landingPad: "LZ-1",
    city: "Mars",
    launchDate: "2026-01-01",
    returnDate: "2026-12-31",
    crew: [
      {
        name: "testuser",
        accepted: false,
      },
    ],
  };

  test("shows loading state", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: {
              username:
                "testuser",
            },
          }}
        >
          <CrewCard />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Loading mission..."
      )
    ).toBeInTheDocument();
  });

  test("renders mission title", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: {
              username:
                "testuser",
            },
          }}
        >
          <CrewCard mission={mission} />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Mars Mission"
      )
    ).toBeInTheDocument();
  });

  test("shows accept button", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: {
              username:
                "testuser",
            },
          }}
        >
          <CrewCard mission={mission} />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Accept Mission 🚀"
      )
    ).toBeInTheDocument();
  });

  test("calls onAccept", () => {
    const onAccept = vi.fn();

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: {
              username:
                "testuser",
            },
          }}
        >
          <CrewCard
            mission={mission}
            onAccept={onAccept}
          />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(
        "Accept Mission 🚀"
      )
    );

    expect(
      onAccept
    ).toHaveBeenCalledWith(
      "1234"
    );
  });

  test("shows active mission", () => {
    const acceptedMission = {
      ...mission,
      crew: [
        {
          name: "testuser",
          accepted: true,
        },
      ],
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: {
              username:
                "testuser",
            },
          }}
        >
          <CrewCard
            mission={
              acceptedMission
            }
          />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "🚀 Mission Active"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Mission Control 🚀"
      )
    ).toBeInTheDocument();
  });
});