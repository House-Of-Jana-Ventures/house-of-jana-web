import "server-only";

/**
 * Calls to the Jana API on a buyer's behalf, from this site's server only
 * (the token never reaches the browser). Never cached: every answer is
 * personal. The public catalogue has its own cached reader (lib/shop/api).
 */
export function apiBase(): string {
  return (process.env.API_URL ?? "http://localhost:4100/api/v1").replace(/\/+$/, "");
}

export interface FieldError {
  field: string;
  messages: string[];
}

/** An error answer from the API (or no answer at all: status 0). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly errors: FieldError[] = [],
    readonly data: unknown = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiRequest {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
}

/** Calls the API and returns `data`. */
export async function api<T>(path: string, request: ApiRequest = {}): Promise<T> {
  return (await call(path, request)).data as T;
}

/** A list endpoint: the items and how many pages there are. */
export async function apiPage<T>(path: string, request: ApiRequest = {}): Promise<{ items: T[]; totalPages: number }> {
  const { data, meta } = await call(path, request);
  return { items: data as T[], totalPages: meta?.totalPages ?? 1 };
}

async function call(path: string, request: ApiRequest): Promise<{ data: unknown; meta?: { totalPages: number } }> {
  let response: Response;
  try {
    response = await fetch(`${apiBase()}${path}`, {
      method: request.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(request.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(request.token ? { Authorization: `Bearer ${request.token}` } : {}),
        ...request.headers,
      },
      body: request.body === undefined ? undefined : JSON.stringify(request.body),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new ApiError(0, "UNREACHABLE", "The shop can't be reached right now.");
  }
  let body: {
    success?: boolean;
    data?: unknown;
    meta?: { totalPages: number };
    code?: string;
    message?: string;
    errors?: FieldError[];
  };
  try {
    body = await response.json();
  } catch {
    throw new ApiError(response.status || 502, "BAD_RESPONSE", "The shop sent an unreadable answer.");
  }
  if (!response.ok || body.success !== true) {
    throw new ApiError(
      response.status,
      body.code ?? "ERROR",
      body.message ?? "Request failed",
      Array.isArray(body.errors) ? body.errors : [],
      body.data ?? null,
    );
  }
  return { data: body.data, meta: body.meta };
}
