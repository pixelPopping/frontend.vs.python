
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "../context/AuthContext";

describe("ProtectedRoute", () => {
  test("renders children when authenticated", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuth: true,
            user: { role: "crew" },
          }}
        >
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Protected Content"
      )
    ).toBeInTheDocument();
  });

  test("redirects unauthenticated users", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuth: false,
            user: null,
          }}
        >
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.queryByText(
        "Protected Content"
      )
    ).not.toBeInTheDocument();
  });

  test("allows correct role", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuth: true,
            user: {
              role: "captain",
            },
          }}
        >
          <ProtectedRoute role="captain">
            <div>Captain Page</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Captain Page"
      )
    ).toBeInTheDocument();
  });

  test("blocks wrong role", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuth: true,
            user: {
              role: "crew",
            },
          }}
        >
          <ProtectedRoute role="captain">
            <div>Captain Page</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.queryByText(
        "Captain Page"
      )
    ).not.toBeInTheDocument();
  });
});