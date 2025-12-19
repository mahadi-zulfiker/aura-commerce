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

function getStoredAuth() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storage = localStorage.getItem("aura-auth-storage");
    if (!storage) {
      return null;
    }
    const parsed = JSON.parse(storage);
    return parsed?.state ?? null;
  } catch {
    return null;
  }
}

function setStoredAuth(accessToken: string, refreshToken?: string) {
  if (typeof window === "undefined") {
    return;
  }

  const storage = getStoredAuth();
  if (!storage) {
    return;
  }

  const nextState = {
    ...storage,
    accessToken,
    refreshToken: refreshToken ?? storage.refreshToken,
    isAuthenticated: Boolean(accessToken),
  };

  localStorage.setItem(
    "aura-auth-storage",
    JSON.stringify({
      state: nextState,
      version: 0,
    }),
  );
}

function clearStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("aura-auth-storage");
}

function getHeaders(extraHeaders?: Record<string, string>) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  const auth = getStoredAuth();
  if (auth?.accessToken) {
    headers["Authorization"] = `Bearer ${auth.accessToken}`;
  }

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
  return fetch(url, options);
}

async function refreshToken() {
  const auth = getStoredAuth();
  if (!auth?.refreshToken) {
    return false;
  }

  const response = await rawFetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: auth.refreshToken }),
  });

  if (!response.ok) {
    clearStoredAuth();
    return false;
  }

  const data = await response.json();
  const tokens = data?.data ?? data;
  if (!tokens?.accessToken) {
    return false;
  }

  setStoredAuth(tokens.accessToken, tokens.refreshToken);
  return true;
}

async function fetchWithAuth(url: string, options: RequestInit) {
  const response = await rawFetch(url, options);
  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshToken();
  if (!refreshed) {
    return response;
  }

  const retryResponse = await rawFetch(url, {
    ...options,
    headers: getHeaders(options.headers as Record<string, string> | undefined),
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
    headers: getHeaders(),
  });

  return handleResponse<T>(response);
}

export async function apiPost<T>(path: string, body: unknown) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, API_URL);

  const response = await fetchWithAuth(url.toString(), {
    method: "POST",
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
    headers: getHeaders(),
  });

  return handleResponse<T>(response);
}
