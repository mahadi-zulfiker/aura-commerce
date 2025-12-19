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
    headers: {
      "Content-Type": "application/json",
    },
  });

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

  return (await response.json()) as T;
}
