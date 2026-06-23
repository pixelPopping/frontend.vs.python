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
import SignUp from "./SignUp";

vi.mock("axios");

const mockNavigate = vi.fn();

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
  "../components/RegisterFields",
  () => ({
    default: ({
      onSubmit,
    }) => (
      <button
        onClick={() =>
          onSubmit({
            username:
              "newuser",
            password:
              "secret123",
            inviteCode:
              "ABC123",
          })
        }
      >
        Mock Register
      </button>
    ),
  })
);

describe("SignUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders page", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Register"
      )
    ).toBeInTheDocument();
  });

  test("redirects after registration", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(
        "Mock Register"
      )
    );

    await waitFor(() => {
      expect(
        mockNavigate
      ).toHaveBeenCalledWith(
        "/signin"
      );
    });
  });

  test("shows backend error", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          error:
            "Username already exists",
        },
      },
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(
        "Mock Register"
      )
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Username already exists"
        )
      ).toBeInTheDocument();
    });
  });
});