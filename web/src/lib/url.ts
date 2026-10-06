// Solo se renderizan links http(s), mailto, tel, anchors y rutas internas. El servidor aplica la misma regla.
const SAFE = /^(https?:\/\/|mailto:|tel:|\/|#)/i;
export const safeUrl = (url: string | undefined): string => (url && SAFE.test(url.trim()) ? url.trim() : "");
export const isExternal = (url: string) => /^https?:\/\//i.test(url);
