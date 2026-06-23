import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import MissionDetailCard from "./MissionDetailCard";

vi.mock("../Helpers/getStrategyFromCity", () => ({
  default: () => "Test Strategy",
}));

describe("MissionDetailCard", () => {
  const mission = {
    _id: "123",
    captain: "Captain Kirk",
    rocket: "Falcon 9",
    ship: "Dragon",
    launchPad: "LC-39A",
    landingPad: "LZ-1",
    city: "Mars",
    launchDate: "2026-01-01",
    returnDate: "2026-12-31",
    status: "pending",
    crew: [
      { name: "John" },
      { name: "Jane" },
    ],
  };

  test("shows loading state", () => {
    render(<MissionDetailCard mission={null} />);

    expect(
      screen.getByText("Loading mission...")
    ).toBeInTheDocument();
  });

  test("renders mission information", () => {
    render(
      <MissionDetailCard
        mission={mission}
        index={0}
      />
    );

    expect(
      screen.getByText("Mission 1")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Captain Kirk/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Falcon 9/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Dragon/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Mars/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Test Strategy/)
    ).toBeInTheDocument();
  });

  test("shows crew members", () => {
    render(
      <MissionDetailCard
        mission={mission}
        index={0}
      />
    );

    expect(
      screen.getByText(/John & Jane/)
    ).toBeInTheDocument();
  });

  test("shows delete button for captain", () => {
    render(
      <MissionDetailCard
        mission={mission}
        index={0}
        isCaptain={true}
      />
    );

    expect(
      screen.getByText("Delete")
    ).toBeInTheDocument();
  });

  test("calls onDelete", () => {
    const onDelete = vi.fn();

    render(
      <MissionDetailCard
        mission={mission}
        index={0}
        isCaptain={true}
        onDelete={onDelete}
      />
    );

    fireEvent.click(
      screen.getByText("Delete")
    );

    expect(onDelete).toHaveBeenCalledWith(
      "123"
    );
  });

  test("hides delete button for non captain", () => {
    render(
      <MissionDetailCard
        mission={mission}
        index={0}
        isCaptain={false}
      />
    );

    expect(
      screen.queryByText("Delete")
    ).not.toBeInTheDocument();
  });
});