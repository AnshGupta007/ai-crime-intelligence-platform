const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const BASE_URL = import.meta.env.VITE_API_URL || (
  isLocal
    ? "http://localhost:8000/api/v1"
    : "https://crime-intelligence-backend-50044342058.development.catalystappsail.in/api/v1"
);

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "#/login";
    throw new ApiError("Unauthorized", 401);
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(error.detail || "Request failed", res.status);
  }

  return res.json();
}

const api = {
  get: <T>(path: string, params?: Record<string, unknown>) => {
    const validParams = params
      ? Object.entries(params).filter(
        ([_, v]) => v !== undefined && v !== null && v !== "" && v !== "undefined" && v !== "null"
      )
      : [];
    const qs = validParams.length > 0
      ? "?" + new URLSearchParams(validParams.map(([k, v]) => [k, String(v)])).toString()
      : "";
    return request<T>(`${path}${qs}`);
  },
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export default api;
