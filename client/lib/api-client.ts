import { getTokenFromCookie } from "./auth";
import { decodeJwt } from "./jwt";

export interface ApiClientConfig {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  endpoint: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  fetchOptions?: RequestInit;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
  responseType?: "json" | "blob" | "text";
}

export async function apiClient<T>(
  config: ApiClientConfig
): Promise<T> {
  const {
    method,
    endpoint,
    query = {},
    body,
    fetchOptions,
    cache,
    next,
    responseType = "json",
  } = config;

  const token = (await getTokenFromCookie()) ?? undefined;

  /* -------------------- Build query string -------------------- */
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}${
    searchParams.toString() ? `?${searchParams}` : ""
  }`;
  console.log("Prepared url: ", url);


  /* -------------------- Headers -------------------- */
  const headers: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(fetchOptions?.headers instanceof Headers
      ? Object.fromEntries(fetchOptions.headers.entries())
      : (fetchOptions?.headers as Record<string, string>)),
  };

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  /* -------------------- Fetch -------------------- */
  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
    ...fetchOptions,
    ...(next ? { next } : {}),
    ...(cache ? { cache } : {}),
  });

  /* -------------------- Error handling -------------------- */
  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    let parsedError: any = null;

    try {
      if (contentType.includes("application/json")) {
        parsedError = await response.json();
      } else {
        parsedError = await response.text();
      }
    } catch {
      parsedError = null;
    }

    const message =
      parsedError?.message ||
      parsedError?.error ||
      (typeof parsedError === "string" && parsedError) ||
      `Request failed with status ${response.status}`;

    /* ---- Token expiration handling ---- */
    if (response.status === 401) {
      const tokenError = handleTokenExpiration(token);
      if (tokenError?.expired) {
        throw new Error(
          `Session expired at ${tokenError.expiredAt?.toLocaleString()}`
        );
      }
    }

    throw new Error(message);
  }

  /* -------------------- Success -------------------- */
  switch (responseType) {
    case "blob":
      return (await response.blob()) as T;
    case "text":
      return (await response.text()) as T;
    default:
      return (await response.json()) as T;
  }
}

/* -------------------- Token helper -------------------- */
function handleTokenExpiration(token?: string) {
  if (!token) return null;

  const payload = decodeJwt(token);
  if (!payload?.exp) return null;

  const expirationTime = payload.exp * 1000;
  const now = Date.now();
  const buffer = 30_000;

  return {
    expired: expirationTime < now - buffer,
    expiredAt: new Date(expirationTime),
  };
}
