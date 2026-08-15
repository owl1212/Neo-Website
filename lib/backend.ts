// Client-side helper for posting to the Go backend (neo-backend). Used by
// the reseller application and contact/warranty forms, which submit
// directly from the browser — hence NEXT_PUBLIC_ (the Go backend's CORS
// middleware is specifically configured for this).

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080").replace(/\/+$/, "");

export class BackendError extends Error {}

export async function postToBackend(path: string, body: unknown): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new BackendError("Couldn't reach the server. Check your connection and try again.");
  }

  if (!res.ok) {
    const payload: { error?: string } | null = await res.json().catch(() => null);
    throw new BackendError(payload?.error ?? "Something went wrong. Please try again.");
  }
}
