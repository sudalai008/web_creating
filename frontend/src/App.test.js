import React from "react";
import { render, screen } from "@testing-library/react";
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ message: "Hello, my DB is MySQL" })
  });
});

test("renders the existing documentation link", async () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
  expect(await screen.findByText("Hello, my DB is MySQL")).toBeInTheDocument();
});

test("renders the backend response", async () => {
  render(<App />);
  expect(await screen.findByText("Hello, my DB is MySQL")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith("/api/");
});

test("shows an error when the API cannot be reached", async () => {
  global.fetch.mockRejectedValueOnce(new Error("Connection refused"));
  render(<App />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Could not connect to the API or database."
  );
});
