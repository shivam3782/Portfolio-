import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import CommandPalette from "../src/components/CommandPalette";
import ProjectCard from "../src/components/ProjectCard";
import ProjectDetail from "../src/pages/ProjectDetail";
import Contact from "../src/components/sections/Contact";
import ResumeLink from "../src/components/ui/ResumeLink";
import NotFound from "../src/pages/NotFound";
import ErrorBoundary from "../src/components/ErrorBoundary";
import useTheme from "../src/hooks/useTheme";
import { defaultContent, ContentContext } from "../src/lib/content";
import { validateContact } from "../src/lib/contact";
const wrap = (children) => render(<MemoryRouter>{children}</MemoryRouter>);
describe("public components", () => {
  it("keeps the six navigation labels in order and opens mobile navigation", () => {
    wrap(<Navbar theme="dark" onTheme={() => {}} onCommand={() => {}} />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(
      [...nav.querySelectorAll(".nav-links a")].map((a) => a.textContent),
    ).toEqual([
      "About",
      "Projects",
      "Skills",
      "Education",
      "Leadership",
      "Contact",
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
  });
  it("filters commands and runs the first result with Enter", () => {
    const theme = vi.fn(),
      close = vi.fn();
    wrap(<CommandPalette open onTheme={theme} onClose={close} />);
    const input = screen.getByLabelText("Search commands");
    fireEvent.change(input, { target: { value: "theme" } });
    input.focus();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(theme).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledOnce();
  });
  it("renders a real project and hides missing destinations", () => {
    wrap(<ProjectCard project={defaultContent.projects[4]} index={4} />);
    expect(screen.getByText("Screenshot coming soon")).toBeInTheDocument();
    expect(screen.queryByText("Live demo")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Case study\s*: ARNav/ }),
    ).toHaveAttribute("href", "/projects/arnav");
  });
  it("renders detail sections without exposing CMS TODO text", () => {
    render(
      <MemoryRouter initialEntries={["/projects/arnav"]}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "ARNav",
    );
    expect(
      screen.getByRole("heading", { name: "My role" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/TODO:/)).not.toBeInTheDocument();
  });
  it("validates contact input and prevents invalid requests", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    wrap(<Contact />);
    fireEvent.click(
      screen.getByRole("button", { name: "Press start. Say hello." }),
    );
    expect(screen.getByLabelText("Your name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(
      Object.keys(
        validateContact({ name: "", email: "bad", message: "short" }),
      ),
    ).toHaveLength(3);
  });
  it("preserves the contact draft on delivery failure and supports retry", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        Response.json({ error: "Delivery unavailable" }, { status: 503 }),
      )
      .mockResolvedValueOnce(
        Response.json({ message: "Delivered" }, { status: 201 }),
      );
    wrap(<Contact />);
    fireEvent.change(screen.getByLabelText("Your name"), {
      target: { value: "Test sender" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("What’s on your mind?"), {
      target: { value: "An isolated test message." },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Press start. Say hello." }),
    );
    await screen.findByText("Delivery unavailable");
    expect(screen.getByLabelText("Your name")).toHaveValue("Test sender");
    fireEvent.click(
      screen.getByRole("button", { name: "Press start. Say hello." }),
    );
    await screen.findByText("Delivered");
    expect(screen.getByLabelText("Your name")).toHaveValue("");
  });
  it("persists theme selection", async () => {
    function Theme() {
      const [theme, toggle] = useTheme();
      return <button onClick={toggle}>{theme}</button>;
    }
    document.documentElement.dataset.theme = "dark";
    render(<Theme />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(localStorage.getItem("portfolio-theme")).toBe("light"),
    );
  });
  it("uses the CMS resume path and hides an unsafe path", () => {
    const { rerender } = render(<ResumeLink />);
    expect(screen.getByRole("link")).toHaveAttribute("download");
    rerender(
      <ContentContext.Provider
        value={{
          ...defaultContent,
          profile: {
            ...defaultContent.profile,
            resumeUrl: "javascript:alert(1)",
          },
        }}
      >
        <ResumeLink />
      </ContentContext.Provider>,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
  it("offers recovery on a missing route", () => {
    wrap(<NotFound />);
    expect(
      screen.getByRole("link", { name: "Return to title screen" }),
    ).toHaveAttribute("href", "/");
  });
  it("contains a render failure with a useful recovery page", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    function Broken() {
      throw new Error("isolated failure");
    }
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );
    expect(
      screen.getByRole("button", { name: "Reload portfolio" }),
    ).toBeInTheDocument();
  });
});
