import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import { getReadingStats, ReadingStats } from "../components/ReadingStats";
import { books } from "../data/books";

describe("ReadingStats", () => {
  it("counts read, unread, and favorite books from the provided list", () => {
    const stats = getReadingStats(books);

    expect(stats.totalCount).toBe(12);
    expect(stats.readCount).toBe(7);
    expect(stats.unreadCount).toBe(5);
    expect(stats.favoriteCount).toBe(7);
  });

  it("renders the favorite count so the stats regression scenario is easy to spot", () => {
    render(<ReadingStats books={books} />);

    const stats = screen.getByRole("region", { name: /reading stats/i });
    expect(within(stats).getByText("Favorites")).toBeTruthy();
    expect(within(stats).getByLabelText("Favorites: 7")).toBeTruthy();
  });

  it("shows only the unread fantasy book and updates the unread count", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Genre"), { target: { value: "Fantasy" } });
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "unread" } });

    expect(screen.getByRole("heading", { name: "1 books shown" })).toBeTruthy();
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(
      screen.getByRole("article", { name: "The Night Circus by Erin Morgenstern" })
    ).toBeTruthy();

    const stats = screen.getByRole("region", { name: /reading stats/i });
    expect(within(stats).getByLabelText("Unread: 1")).toBeTruthy();
  });
});
