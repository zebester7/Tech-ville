import type { Language, NavTab } from "../types";
import NavLink from "./NavLink";

export default function NotFound({ language, onNavigate }: { language: Language; onNavigate: (tab: NavTab) => void }) {
  const fr = language === "fr";
  return (
    <section className="max-w-3xl mx-auto px-4 py-28 text-center space-y-5">
      <p className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">404</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">
        {fr ? "Page introuvable" : "Page not found"}
      </h1>
      <p className="text-slate-600 text-sm">
        {fr ? "La page que vous cherchez n'existe pas ou a été déplacée." : "The page you are looking for does not exist or has moved."}
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <NavLink tab="home" onNavigate={onNavigate} className="py-3 px-6 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider">
          {fr ? "Accueil" : "Go to homepage"}
        </NavLink>
        <NavLink tab="contact" onNavigate={onNavigate} className="py-3 px-6 rounded-lg border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-100">
          {fr ? "Contact" : "Contact us"}
        </NavLink>
      </div>
    </section>
  );
}
