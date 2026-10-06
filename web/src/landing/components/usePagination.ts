import { useState } from "react";

/** Muestra de a `step` elementos con botón "Ver más": evita páginas interminables. */
export function usePagination<T>(items: T[], step: number) {
  const [count, setCount] = useState(step);
  return {
    visible: items.slice(0, count),
    hasMore: count < items.length,
    remaining: Math.max(0, items.length - count),
    showMore: () => setCount((c) => c + step),
  };
}
