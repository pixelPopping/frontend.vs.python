import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { vi } from "vitest";
import React from "react";
import LoginFields from "./LoginFields";

describe("LoginFields", () => {
  test("renders all fields", () => {
    render(
      <LoginFields
        onSubmit={vi.fn()}
        loading={false}
        errorMessage=""
      />
    );

    expect(
      screen.getByText("Username")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Invite Code")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Login",
      })
    ).toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(
      <LoginFields
        onSubmit={vi.fn()}
        loading={true}
        errorMessage=""
      />
    );

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();
  });

  test("shows error message", () => {
    render(
      <LoginFields
        onSubmit={vi.fn()}
        loading={false}
        errorMessage="Invalid credentials"
      />
    );

    expect(
      screen.getByText(
        "Invalid credentials"
      )
    ).toBeInTheDocument();
  });

  test("submits form", () => {
    const onSubmit = vi.fn();

    render(
      <LoginFields
        onSubmit={onSubmit}
        loading={false}
        errorMessage=""
      />
    );

    const textInputs =
      screen.getAllByRole("textbox");

    fireEvent.change(textInputs[0], {
      target: {
        value: "john",
      },
    });

    fireEvent.change(textInputs[1], {
      target: {
        value: "ABC123",
      },
    });

    const password =
      document.querySelector(
        'input[type="password"]'
      );

    fireEvent.change(password, {
      target: {
        value: "secret",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Login",
      })
    );

    expect(onSubmit).toHaveBeenCalled();
  });
});