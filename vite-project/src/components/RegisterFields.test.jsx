import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import { vi } from "vitest";
import React from "react";
import RegisterFields from "./RegisterFields";

describe("RegisterFields", () => {
  test("renders all fields", () => {
    render(
      <RegisterFields
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
        name: "Register",
      })
    ).toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(
      <RegisterFields
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
      <RegisterFields
        onSubmit={vi.fn()}
        loading={false}
        errorMessage="Username already exists"
      />
    );

    expect(
      screen.getByText(
        "Username already exists"
      )
    ).toBeInTheDocument();
  });

  test("submits form", () => {
    const onSubmit = vi.fn();

    render(
      <RegisterFields
        onSubmit={onSubmit}
        loading={false}
        errorMessage=""
      />
    );

    const textInputs =
      screen.getAllByRole("textbox");

    fireEvent.change(textInputs[0], {
      target: {
        value: "newuser",
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
        value: "secret123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      })
    );

    expect(onSubmit).toHaveBeenCalled();
  });
});