import type { AnchorHTMLAttributes } from "react";
import { isExternal, safeUrl } from "@/lib/url";

/** <a> que abre links externos en pestaña nueva y descarta URLs inseguras. */
export function SmartLink({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const url = safeUrl(href);
  const external = isExternal(url);
  return (
    <a href={url || undefined} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}
