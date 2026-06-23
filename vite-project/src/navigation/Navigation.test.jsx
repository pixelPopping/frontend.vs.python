import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import Navigation from "./Navigation";
import { AuthContext } from "../context/AuthContext";

describe("Navigation", () => {
  test("shows Home link", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuth: false,
            user: null,
            logout: vi.fn(),
          }}
        >
          <Navigation />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Home")
    ).toBeInTheDocument();
  });

  test("shows Login and Register when not authenticated", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuth: false,
            user: null,
            logout: vi.fn(),
          }}
        >
          <Navigation />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Login")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Register")
    ).toBeInTheDocument();
  });

  test("shows Crew Dashboard for crew user", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuth: true,
            user: {
              role: "crew",
            },
            logout: vi.fn(),
          }}
        >
          <Navigation />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Crew Dashboard"
      )
    ).toBeInTheDocument();
  });

  test("shows Captain Dashboard for captain user", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuth: true,
            user: {
              role: "captain",
            },
            logout: vi.fn(),
          }}
        >
          <Navigation />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Captain Dashboard"
      )
    ).toBeInTheDocument();
  });

  test("shows Logout button when authenticated", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuth: true,
            user: {
              role: "crew",
            },
            logout: vi.fn(),
          }}
        >
          <Navigation />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Logout")
    ).toBeInTheDocument();
  });
});