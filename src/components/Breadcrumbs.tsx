import { ChevronRight } from "lucide-react";
import type { Language, NavTab } from "../types";
import { translations } from "../translations";
import NavLink from "./NavLink";

interface BreadcrumbsProps {
  tab: NavTab;
  language: Language;
  onNavigate: (tab: NavTab) => void;
}

export default function Breadcrumbs({ tab, language, onNavigate }: BreadcrumbsProps) {
  if (tab === "home") return null;
  const t = translations[language].nav;

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <ol className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <li>
          <NavLink tab="home" onNavigate={onNavigate} className="hover:text-blue-800 transition-colors">
            {t.home}
          </NavLink>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>
        <li aria-current="page" className="text-slate-900">
          {t[tab]}
        </li>
      </ol>
    </nav>
  );
}
