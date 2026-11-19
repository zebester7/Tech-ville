import type { AnchorHTMLAttributes, MouseEvent } from "react";
import type { NavTab } from "../types";
import { pathForTab } from "../routes";

/**
 * Click handler for real <a href> links that navigate client-side.
 * Modified clicks (new tab, middle click, etc.) fall through to the browser.
 */
export function handleNavClick(e: MouseEvent, tab: NavTab, onNavigate: (tab: NavTab) => void) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  onNavigate(tab);
}

interface NavLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> {
  tab: NavTab;
  onNavigate: (tab: NavTab) => void;
}

/** Crawlable internal link: search engines see an href, users get SPA navigation. */
export default function NavLink({ tab, onNavigate, children, ...rest }: NavLinkProps) {
  return (
    <a href={pathForTab(tab)} onClick={(e) => handleNavClick(e, tab, onNavigate)} {...rest}>
      {children}
    </a>
  );
}
