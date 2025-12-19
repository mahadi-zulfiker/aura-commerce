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

function getHeaders(extraHeaders?: Record<string, string>) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  // Check localStorage manually since we might be outside React context
  // Note: zustand persist saves to localStorage with a specific key structure
  if (typeof window !== "undefined") {
    try {
      const storage = localStorage.getItem("aura-auth-storage");
      if (storage) {
        const { state } = JSON.parse(storage);
        if (state?.accessToken) {
          headers["Authorization"] = `Bearer ${state.accessToken}`;
        }
      }
    } catch (e) {
      // Ignored
    }
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

  return (await response.json()) as T;
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

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
  });

  return handleResponse<T>(response);
}

export async function apiPost<T>(path: string, body: unknown) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, API_URL);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function apiPut<T>(path: string, body: unknown) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, API_URL);

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function apiDelete<T>(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, API_URL);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse<T>(response);
}
