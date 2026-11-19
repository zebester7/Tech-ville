import type { NavTab } from "./types";

// Single source of truth for crawlable URLs. Imported by the client, the
// prerender script and the Node server, so keep it free of Vite-only APIs.
export const ROUTES: NavTab[] = [
  "home",
  "about",
  "services",
  "industries",
  "insights",
  "projects",
  "team",
  "contact",
];

export function pathForTab(tab: NavTab): string {
  return tab === "home" ? "/" : `/${tab}`;
}

/** Returns the tab for an exact path, or null when the path is not a page (404). */
export function tabFromPath(pathname: string): NavTab | null {
  if (pathname === "/" || pathname === "") return "home";
  const slug = pathname.replace(/^\/+/, "");
  if (slug === "home") return null; // "/" is the canonical home URL
  return (ROUTES as string[]).includes(slug) ? (slug as NavTab) : null;
}
