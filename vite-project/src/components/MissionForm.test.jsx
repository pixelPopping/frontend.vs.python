import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { vi } from "vitest";
import React from "react";
import MissionForm from "./MissionForm";
import { AuthContext } from "../context/AuthContext";

describe("MissionForm", () => {
  const mockSubmit = vi.fn();

  const mockOptions = {
    rockets: [
      {
        id: 1,
        name: "Falcon 9",
      },
    ],
    ships: [
      {
        id: 1,
        name: "Dragon",
      },
    ],
    launchpads: [
      {
        id: 1,
        name: "LC-39A",
      },
    ],
    landpads: [
      {
        id: 1,
        name: "LZ-1",
      },
    ],
  };

  const mockUsers = [
    {
      id: 1,
      username: "crew1",
      role: "crew",
    },
    {
      id: 2,
      username: "crew2",
      role: "crew",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders form", () => {
    render(
      <AuthContext.Provider
        value={{
          user: {
            username: "captain",
          },
        }}
      >
        <MissionForm
          onSubmit={mockSubmit}
          users={mockUsers}
          options={mockOptions}
          loading={false}
          isSuccess={false}
        />
      </AuthContext.Provider>
    );

    expect(
      screen.getByText(
        "Create Mission"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "Mission Title"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "Destination"
      )
    ).toBeInTheDocument();
  });

  test("renders dropdown values", () => {
    render(
      <AuthContext.Provider
        value={{
          user: {
            username: "captain",
          },
        }}
      >
        <MissionForm
          onSubmit={mockSubmit}
          users={mockUsers}
          options={mockOptions}
          loading={false}
          isSuccess={false}
        />
      </AuthContext.Provider>
    );

    expect(
      screen.getByText("Falcon 9")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Dragon")
    ).toBeInTheDocument();

    expect(
      screen.getByText("crew1")
    ).toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(
      <AuthContext.Provider
        value={{
          user: {
            username: "captain",
          },
        }}
      >
        <MissionForm
          onSubmit={mockSubmit}
          users={mockUsers}
          options={mockOptions}
          loading={true}
          isSuccess={false}
        />
      </AuthContext.Provider>
    );

    expect(
      screen.getByText(
        "Creating..."
      )
    ).toBeInTheDocument();
  });

  test("shows success message", () => {
    render(
      <AuthContext.Provider
        value={{
          user: {
            username: "captain",
          },
        }}
      >
        <MissionForm
          onSubmit={mockSubmit}
          users={mockUsers}
          options={mockOptions}
          loading={false}
          isSuccess={true}
        />
      </AuthContext.Provider>
    );

    expect(
      screen.getByText(
        "Mission created 🚀"
      )
    ).toBeInTheDocument();
  });

  test("submits form", () => {
    render(
      <AuthContext.Provider
        value={{
          user: {
            username: "captain",
          },
        }}
      >
        <MissionForm
          onSubmit={mockSubmit}
          users={mockUsers}
          options={mockOptions}
          loading={false}
          isSuccess={false}
        />
      </AuthContext.Provider>
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Mission Title"
      ),
      {
        target: {
          value: "Mars Mission",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "Destination"
      ),
      {
        target: {
          value: "Mars",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /create mission/i,
      })
    );

    expect(mockSubmit).toHaveBeenCalled();
  });
});