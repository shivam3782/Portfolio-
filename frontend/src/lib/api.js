import { resolveApiOrigin } from "../../config/api-config.js";

export async function projectRequest(path = "", options = {}) {
  const base = resolveApiOrigin(
    import.meta.env.VITE_API_URL,
    import.meta.env.PROD,
  );
  const response = await fetch(`${base}/api/projects${path}`, options);
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    const error = new Error(
      response.status === 401
        ? "That admin key was not accepted. Please enter it again."
        : "The project service couldn’t complete this request. Please try again.",
    );
    error.status = response.status;
    error.fields = details.errors || {};
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}
export function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/** Request a same-origin or environment-configured portfolio API endpoint. */
export async function contentRequest(path, options = {}) {
  const base = resolveApiOrigin(
    import.meta.env.VITE_API_URL,
    import.meta.env.PROD,
  );
  const response = await fetch(`${base}/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    signal: options.signal || AbortSignal.timeout(12000),
  });
  const data =
    response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data?.error || "The service is unavailable. Please try again.",
    );
    error.fields = data?.errors || {};
    error.status = response.status;
    throw error;
  }
  return data;
}
