import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import axios from "axios";
import SignIn from "./SignIn";
import { AuthContext } from "../context/AuthContext";

vi.mock("axios");

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual(
      "react-router-dom"
    );

  return {
    ...actual,
    useNavigate: () =>
      mockNavigate,
  };
});

vi.mock(
  "../components/LoginFields",
  () => ({
    default: ({
      onSubmit,
    }) => (
      <button
        onClick={() =>
          onSubmit({
            username:
              "testuser",
            password:
              "secret",
            inviteCode:
              "ABC123",
          })
        }
      >
        Mock Login
      </button>
    ),
  })
);

describe("SignIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders page", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            login:
              mockLogin,
          }}
        >
          <SignIn />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Sign In"
      )
    ).toBeInTheDocument();
  });

  test("redirects crew", async () => {
    axios.post.mockResolvedValue({
      data: {
        token:
          "token123",
        user: {
          role:
            "crew",
        },
      },
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            login:
              mockLogin,
          }}
        >
          <SignIn />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(
        "Mock Login"
      )
    );

    await waitFor(() => {
      expect(
        mockNavigate
      ).toHaveBeenCalledWith(
        "/crew-dashboard"
      );
    });
  });

  test("redirects captain", async () => {
    axios.post.mockResolvedValue({
      data: {
        token:
          "token123",
        user: {
          role:
            "captain",
        },
      },
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            login:
              mockLogin,
          }}
        >
          <SignIn />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(
        "Mock Login"
      )
    );

    await waitFor(() => {
      expect(
        mockNavigate
      ).toHaveBeenCalledWith(
        "/captain-dashboard"
      );
    });
  });

  test("shows login error", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          error:
            "Invalid credentials",
        },
      },
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            login:
              mockLogin,
          }}
        >
          <SignIn />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(
        "Mock Login"
      )
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Invalid credentials"
        )
      ).toBeInTheDocument();
    });
  });
});