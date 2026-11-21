globalThis.IntersectionObserver = class {
  observe() {}
  disconnect() {}
};
// Isolated virtual-DOM unit tests. These do not render CSS, use a browser, or touch MongoDB.
import test, { after, afterEach } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { createServer } from "vite";

const dom = new Window({ url: "http://unit-test.local/" });
for (const name of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLTextAreaElement",
  "HTMLSelectElement",
  "Node",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "MutationObserver",
])
  globalThis[name] =
    name === "window" ? dom : name === "document" ? dom.document : dom[name];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;
globalThis.localStorage = dom.localStorage;
const { createElement: h, act, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { createMemoryRouter, RouterProvider } = await import("react-router-dom");
const vite = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});
const { default: TechnologyPicker } = await vite.ssrLoadModule(
  "/src/components/admin/TechnologyPicker.jsx",
);
const { default: ProjectEditor } = await vite.ssrLoadModule(
  "/src/components/admin/ProjectEditor.jsx",
);
const { default: ProjectMedia } = await vite.ssrLoadModule(
  "/src/components/admin/ProjectMedia.jsx",
);
const { default: AdminPanel } = await vite.ssrLoadModule(
  "/src/components/AdminPanel.jsx",
);
const { default: Navbar } = await vite.ssrLoadModule(
  "/src/components/Navbar.jsx",
);
const { default: CommandPalette } = await vite.ssrLoadModule(
  "/src/components/CommandPalette.jsx",
);
const { default: useTheme } = await vite.ssrLoadModule(
  "/src/hooks/useTheme.js",
);
const originalFetch = globalThis.fetch;
let root, router;
const projects = [
  {
    _id: "insurance",
    name: "Proactive Insurance Policy Guardian",
    description: "An insurance document assistant.",
    summary: "",
    tech: ["Python", "FAISS"],
    position: 1,
    order: 0,
    orderLocked: "first",
  },
  {
    _id: "hangman",
    name: "The HangMan Game",
    description: "Learn database concepts through play.",
    summary: "",
    tech: ["Python", "Pygame"],
    position: 2,
    order: 1000,
  },
  {
    _id: "krushi",
    name: "KrushiPal",
    description: "A farmer to consumer marketplace.",
    summary: "",
    tech: ["React"],
    position: 3,
    order: 2000,
  },
  {
    _id: "cultivate",
    name: "CultivateConnect",
    description: "A crop prediction experiment.",
    summary: "",
    tech: ["Flask"],
    position: 4,
    order: 3000,
  },
  {
    _id: "arnav",
    name: "ARNav",
    description: "Indoor navigation.",
    summary: "",
    tech: ["Flutter"],
    position: 5,
    order: 4000,
    orderLocked: "last",
  },
];

async function mount(element, entries) {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  if (entries) {
    router = createMemoryRouter(entries.routes, {
      initialEntries: [entries.path],
    });
    element = h(RouterProvider, { router });
  }
  await act(async () => root.render(element));
}
async function click(element) {
  assert.ok(element, "Expected a control to click");
  await act(async () =>
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
    ),
  );
}
async function type(element, value) {
  assert.ok(element, "Expected an input");
  const prototype =
    element.tagName === "TEXTAREA"
      ? HTMLTextAreaElement.prototype
      : element.tagName === "SELECT"
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, "value").set.call(
      element,
      value,
    );
    element.dispatchEvent(
      new Event(element.tagName === "SELECT" ? "change" : "input", {
        bubbles: true,
      }),
    );
  });
}
async function key(element, value) {
  await act(async () =>
    element.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: value,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
}
async function submit() {
  await act(async () =>
    document
      .querySelector("form")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
}
const button = (text) =>
  [...document.querySelectorAll("button")].find(
    (element) => element.textContent.trim() === text,
  );
async function editor(
  api = async () => ({}),
  onSaved = () => {},
  onUnauthorized = () => {},
  path = "/admin/projects/krushi/edit",
) {
  await mount(null, {
    path,
    routes: [
      {
        path: "/admin/projects/new",
        element: h(ProjectEditor, { projects, api, onSaved, onUnauthorized }),
      },
      {
        path: "/admin/projects/:id/edit",
        element: h(ProjectEditor, { projects, api, onSaved, onUnauthorized }),
      },
      { path: "/admin/projects", element: h("p", null, "Library destination") },
    ],
  });
}
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  root = null;
  router?.dispose();
  router = null;
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("data-theme");
  localStorage.clear();
  globalThis.fetch = originalFetch;
});
after(async () => {
  await vite.close();
  await dom.happyDOM.close();
});

test("picker opens at the first option when reopened with ArrowDown", async () => {
  await mount(
    h(TechnologyPicker, {
      value: [],
      options: ["Flask", "React"],
      onChange() {},
    }),
  );
  const input = document.querySelector("[role=combobox]");
  await act(async () => input.focus());
  await key(input, "Escape");
  await key(input, "ArrowDown");
  assert.equal(
    document.querySelector("[data-active=true]").textContent,
    "Flask+",
  );
});

test("picker adds and removes custom technology, and Escape closes its menu", async () => {
  function Harness() {
    const [value, onChange] = useState([]);
    return h(TechnologyPicker, { value, onChange, options: ["React"] });
  }
  await mount(h(Harness));
  const input = document.querySelector("[role=combobox]");
  await act(async () => input.focus());
  await type(input, "WebGPU");
  await key(input, "Enter");
  assert.ok(document.querySelector('[aria-label="Remove WebGPU"]'));
  await key(input, "Escape");
  assert.equal(document.querySelector("[role=listbox]"), null);
  await click(document.querySelector('[aria-label="Remove WebGPU"]'));
  assert.equal(document.querySelector('[aria-label="Remove WebGPU"]'), null);
});

test("a picker disabled during an open menu cannot change the form", async () => {
  let calls = 0;
  const props = {
    value: [],
    options: ["React"],
    onChange() {
      calls++;
    },
  };
  await mount(h(TechnologyPicker, props));
  await act(async () => document.querySelector("[role=combobox]").focus());
  await act(async () =>
    root.render(h(TechnologyPicker, { ...props, disabled: true })),
  );
  const option = document.querySelector("[role=option]");
  if (option) await click(option);
  assert.equal(calls, 0);
  assert.equal(document.querySelector("[role=listbox]"), null);
});

test("empty editor validation focuses the first invalid field and makes no API write", async () => {
  let writes = 0;
  await editor(
    async () => {
      writes++;
    },
    () => {},
    () => {},
    "/admin/projects/new",
  );
  await submit();
  await act(async () => new Promise((resolve) => setTimeout(resolve, 5)));
  assert.equal(writes, 0);
  assert.equal(document.activeElement.id, "editor-name");
  assert.match(document.body.textContent, /Give this project a name/);
});

test("a failed save keeps values and can be retried successfully", async () => {
  let writes = 0,
    saved = 0,
    payload;
  await editor(
    async (path, options) => {
      writes++;
      payload = JSON.parse(options.body);
      if (writes === 1) throw new Error("isolated failure");
      return {};
    },
    () => saved++,
  );
  await type(document.querySelector("#editor-summary"), "A revised summary");
  await submit();
  assert.equal(
    document.querySelector("#editor-summary").value,
    "A revised summary",
  );
  assert.equal(saved, 0);
  assert.equal(router.state.location.pathname, "/admin/projects/krushi/edit");
  await submit();
  assert.equal(writes, 2);
  assert.equal(saved, 1);
  assert.equal(payload.summary, "A revised summary");
  assert.equal(payload.position, 3);
  assert.equal(router.state.location.pathname, "/admin/projects");
});

test("unsaved navigation supports Keep editing and explicit Discard", async () => {
  await editor();
  await type(document.querySelector("#editor-summary"), "Uncommitted draft");
  await act(async () => router.navigate("/admin/projects"));
  assert.match(
    document.querySelector("dialog").textContent,
    /Leave without saving/,
  );
  await click(button("Keep editing"));
  assert.equal(
    document.querySelector("#editor-summary").value,
    "Uncommitted draft",
  );
  await act(async () => router.navigate("/admin/projects"));
  await click(button("Discard changes"));
  assert.equal(router.state.location.pathname, "/admin/projects");
});

test("an unauthorized save keeps the draft and asks for access verification", async () => {
  let requests = 0;
  await editor(
    async () => {
      const error = new Error("unauthorized");
      error.status = 401;
      throw error;
    },
    () => {},
    () => requests++,
  );
  await type(
    document.querySelector("#editor-description"),
    "My work is still here.",
  );
  await submit();
  assert.equal(requests, 1);
  assert.equal(
    document.querySelector("#editor-description").value,
    "My work is still here.",
  );
  assert.match(document.body.textContent, /Access needs to be verified/);
});

test("image error events replace a broken preview with labeled concept artwork", async () => {
  await mount(
    h(ProjectMedia, {
      url: "https://example.invalid/image.png",
      name: "KrushiPal",
    }),
  );
  assert.match(document.body.textContent, /Loading preview/);
  await act(async () =>
    document.querySelector("img").dispatchEvent(new Event("error")),
  );
  assert.equal(document.querySelector("img"), null);
  assert.match(document.body.textContent, /CONCEPT ILLUSTRATION/);
  assert.match(document.body.textContent, /could not be loaded/);
});

test("admin login, temporary sorting, edit/cancel and locking work with an isolated fake API", async () => {
  const methods = [];
  globalThis.fetch = async (url, options = {}) => {
    methods.push(options.method || "GET");
    return Response.json(
      String(url).endsWith("/session") ? { authenticated: true } : projects,
    );
  };
  await mount(null, {
    path: "/admin",
    routes: [
      {
        path: "/admin/*",
        element: h(AdminPanel, { theme: "dark", onTheme() {}, onCommand() {} }),
      },
    ],
  });
  await type(document.querySelector("#admin-key"), "isolated-key");
  await submit();
  assert.match(document.body.textContent, /Workspace overview/);
  const rows = () =>
    [...document.querySelectorAll(".project-cell-copy > a")].map(
      (a) => a.textContent,
    );
  assert.deepEqual(
    rows(),
    projects.map((p) => p.name),
  );
  await type(document.querySelector(".library-sort select"), "name");
  assert.equal(rows()[0], "ARNav");
  await type(document.querySelector(".library-sort select"), "portfolio");
  assert.deepEqual(
    rows(),
    projects.map((p) => p.name),
  );
  await type(document.querySelector("#admin-project-search"), "farmer");
  assert.deepEqual(rows(), ["KrushiPal"]);
  await click(document.querySelector(".project-cell-copy a"));
  assert.equal(document.querySelector("#editor-name").value, "KrushiPal");
  await click(document.querySelector(".editor-savebar a"));
  assert.equal(router.state.location.pathname, "/admin/projects");
  await click(document.querySelector('a[href="/admin/lock"]'));
  assert.ok(document.querySelector("#admin-key"));
  assert.equal(document.querySelector("#admin-key").value, "");
  assert.ok(methods.every((method) => method === "GET"));
  assert.deepEqual(
    projects.map((p) => p.order),
    [0, 1000, 2000, 3000, 4000],
  );
});

test("theme changes update the root and persist the selected value in isolated storage", async () => {
  function Harness() {
    const [theme, toggle] = useTheme();
    return h("button", { onClick: toggle }, theme);
  }
  document.documentElement.dataset.theme = "dark";
  await mount(h(Harness));
  assert.equal(document.documentElement.dataset.theme, "dark");
  await click(button("dark"));
  assert.equal(document.documentElement.dataset.theme, "light");
  assert.equal(localStorage.getItem("portfolio-theme"), "light");
  await click(button("light"));
  assert.equal(localStorage.getItem("portfolio-theme"), "dark");
});

test("palette search and Enter navigate to Leadership in the isolated router", async () => {
  function Harness() {
    const [open, setOpen] = useState(true);
    return open
      ? h(CommandPalette, {
          open,
          onClose: () => setOpen(false),
          onTheme() {},
          onMotion() {},
        })
      : h("p", null, "Palette closed");
  }
  await mount(null, {
    path: "/",
    routes: [{ path: "*", element: h(Harness) }],
  });
  await type(document.querySelector("#command-search"), "leadership");
  assert.equal(document.querySelectorAll(".command-results button").length, 1);
  await key(document.querySelector("#command-search"), "Enter");
  assert.equal(router.state.location.hash, "#mentoring");
  assert.equal(document.querySelector("dialog"), null);
});

test("mobile-menu Leadership action closes the dialog and navigates to the correct anchor", async () => {
  const menuStates = [];
  await mount(null, {
    path: "/",
    routes: [
      {
        path: "*",
        element: h(Navbar, {
          theme: "dark",
          onTheme() {},
          onCommand() {},
          onMenu: (value) => menuStates.push(value),
        }),
      },
    ],
  });
  await click(document.querySelector(".menu-toggle"));
  assert.equal(document.querySelector("#mobile-menu").open, true);
  await click(document.querySelector('#mobile-menu a[href="/#mentoring"]'));
  assert.equal(document.querySelector("#mobile-menu").open, false);
  assert.equal(router.state.location.hash, "#mentoring");
  assert.deepEqual(menuStates, [true, false]);
});

test("before-unload prevention starts only after a draft changes", async () => {
  await editor();
  const clean = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(clean);
  assert.equal(clean.defaultPrevented, false);
  await type(document.querySelector("#editor-summary"), "Unsaved draft");
  const dirty = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(dirty);
  assert.equal(dirty.defaultPrevented, true);
});

test("navigation during a pending save offers no discard and completes after the save", async () => {
  let finish;
  await editor(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  await type(document.querySelector("#editor-summary"), "Pending save");
  await submit();
  await act(async () => router.navigate("/admin/projects"));
  assert.match(
    document.querySelector("dialog").textContent,
    /save is in progress/,
  );
  assert.equal(button("Discard changes"), undefined);
  await act(async () => finish({}));
  assert.equal(router.state.location.pathname, "/admin/projects");
  assert.equal(document.querySelector("dialog"), null);
});

test("delete requires confirmation, cancellation performs no write, and confirmation touches only the fake store", async () => {
  let store = structuredClone(projects),
    deletes = 0;
  globalThis.fetch = async (url, options = {}) => {
    if (String(url).endsWith("/session"))
      return Response.json({ authenticated: true });
    if (options.method === "DELETE") {
      deletes++;
      store = store.filter((p) => p._id !== "krushi");
      return Response.json({ message: "Deleted fake record" });
    }
    return Response.json(
      store.map((p, index) => ({ ...p, position: index + 1 })),
    );
  };
  await mount(null, {
    path: "/admin",
    routes: [
      {
        path: "/admin/*",
        element: h(AdminPanel, { theme: "dark", onTheme() {}, onCommand() {} }),
      },
    ],
  });
  await type(document.querySelector("#admin-key"), "isolated-key");
  await submit();
  await click(document.querySelector('[aria-label="Delete KrushiPal"]'));
  assert.equal(deletes, 0);
  await click(button("Cancel"));
  assert.equal(deletes, 0);
  await click(document.querySelector('[aria-label="Delete KrushiPal"]'));
  await click(button("Delete project"));
  assert.equal(deletes, 1);
  assert.equal(store.length, 4);
  assert.equal(document.querySelector('[aria-label="Delete KrushiPal"]'), null);
  assert.equal(projects.length, 5);
});

test("the console can lock even when its project refresh fails", async () => {
  globalThis.fetch = async (url) => {
    if (String(url).endsWith("/session"))
      return Response.json({ authenticated: true });
    throw new Error("isolated outage");
  };
  await mount(null, {
    path: "/admin",
    routes: [
      {
        path: "/admin/*",
        element: h(AdminPanel, { theme: "dark", onTheme() {}, onCommand() {} }),
      },
    ],
  });
  await type(document.querySelector("#admin-key"), "isolated-key");
  await submit();
  assert.match(document.body.textContent, /reconnect the library/);
  await click(document.querySelector('a[href="/admin/lock"]'));
  assert.ok(document.querySelector("#admin-key"));
});
