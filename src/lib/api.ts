const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function clearAuthStore() {
  if (typeof window === "undefined") {
    return;
  }
  const { useAuthStore } = await import("@/store/auth");
  useAuthStore.getState().logout();
}

export async function clearStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("aura-auth-storage");
  await clearAuthStore();
}

export async function logoutUser() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await rawFetch(`${API_URL}/auth/logout`, {
      method: "POST",
    });
  } catch {
    // Ignore network failures on logout.
  }

  await clearStoredAuth();
}

function getHeaders(extraHeaders?: Record<string, string>) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: unknown = undefined;
    try {
      errorData = await response.json();
    } catch {
      errorData = undefined;
    }

    const message =
      typeof errorData === "object" && errorData && "message" in errorData
        ? String((errorData as { message?: string }).message)
        : "Request failed";
    if (response.status === 401 || response.status === 403) {
      await clearStoredAuth();
    }
    throw new ApiError(message, response.status, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const payload = (await response.json()) as {
    success?: boolean;
    data?: T;
    message?: string;
  };

  if (payload && typeof payload === "object" && "success" in payload) {
    return (payload.data ?? payload) as T;
  }

  return payload as T;
}

async function rawFetch(url: string, options: RequestInit) {
  return fetch(url, { credentials: "include", ...options });
}

export async function refreshAuthToken() {
  let response: Response;
  try {
    response = await rawFetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return false;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      await clearStoredAuth();
    }
    return false;
  }

  return true;
}

async function fetchWithAuth(url: string, options: RequestInit) {
  const response = await rawFetch(url, options);
  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshAuthToken();
  if (!refreshed) {
    return response;
  }

  const retryResponse = await rawFetch(url, {
    ...options,
  });

  return retryResponse;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, API_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  const response = await fetchWithAuth(url.toString(), {
    credentials: "include",
    headers: getHeaders(),
  });

  return handleResponse<T>(response);
}

export async function apiPost<T>(path: string, body: unknown) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, API_URL);

  const response = await fetchWithAuth(url.toString(), {
    method: "POST",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function apiPut<T>(path: string, body: unknown) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, API_URL);

  const response = await fetchWithAuth(url.toString(), {
    method: "PUT",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function apiPatch<T>(path: string, body: unknown) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, API_URL);

  const response = await fetchWithAuth(url.toString(), {
    method: "PATCH",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function apiDelete<T>(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, API_URL);

  const response = await fetchWithAuth(url.toString(), {
    method: "DELETE",
    credentials: "include",
    headers: getHeaders(),
  });

  return handleResponse<T>(response);
}
