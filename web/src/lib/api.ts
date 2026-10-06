import type { SiteContent } from "@/types/content";

export interface AdminState {
  draft: SiteContent;
  draftSavedAt: string;
  publishedAt: string;
  hasChanges: boolean;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin", ...init });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error ?? "Error inesperado", res.status);
  return data as T;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const api = {
  getContent: () => request<SiteContent>("/api/content"),
  authStatus: () => request<{ configured: boolean; authenticated: boolean }>("/api/auth/status"),
  setup: (password: string) => request("/api/auth/setup", json("POST", { password })),
  login: (password: string) => request("/api/auth/login", json("POST", { password })),
  logout: () => request("/api/auth/logout", json("POST")),
  changePassword: (current: string, next: string) => request("/api/auth/password", json("POST", { current, next })),
  getDraft: () => request<AdminState>("/api/admin/draft"),
  saveDraft: (content: SiteContent) => request<AdminState>("/api/admin/draft", json("PUT", content)),
  publish: () => request<AdminState>("/api/admin/publish", json("POST")),
  discard: () => request<AdminState>("/api/admin/discard", json("POST")),
  youtubeInfo: (id: string) => request<{ title: string; author: string }>(`/api/admin/youtube-info?id=${id}`),
  upload: (blob: Blob) =>
    request<{ url: string }>("/api/admin/upload", { method: "POST", headers: { "Content-Type": blob.type || "image/webp" }, body: blob }),
};
