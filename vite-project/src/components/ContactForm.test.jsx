import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import React from "react";
import ContactForm from "./ContactForm";

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

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders page", () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Dear Crewmember,"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Your mission has been launched 🚀"
      )
    ).toBeInTheDocument();
  });

  test("renders dashboard button", () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name:
          /back to dashboard/i,
      })
    ).toBeInTheDocument();
  });

  test("navigates to dashboard", () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name:
          /back to dashboard/i,
      })
    );

    expect(
      mockNavigate
    ).toHaveBeenCalledWith(
      "/crew-dashboard"
    );
  });
});