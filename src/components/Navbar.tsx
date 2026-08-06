    import { useState } from "react";
    import { motion, AnimatePresence } from "motion/react";
    import { Globe, Menu, X, Sparkles, Map, PhoneCall, Compass } from "lucide-react";
    import { Language, NavTab } from "../types";
    import { translations } from "../translations";

    interface NavbarProps {
      currentTab: NavTab;
      setTab: (tab: NavTab) => void;
      language: Language;
      setLanguage: (lang: Language) => void;
    }

    export default function Navbar({ currentTab, setTab, language, setLanguage }: NavbarProps) {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

      const t = translations[language];

      const handleTabClick = (tab: NavTab) => {
        setTab(tab);
        setMobileMenuOpen(false);
      };

      const toggleLanguage = () => {
        setLanguage(language === "en" ? "fr" : "en");
      };

      const navItems: { id: NavTab; label: string; icon?: any; highlight?: boolean }[] = [
        { id: "home", label: t.nav.home },
        { id: "about", label: t.nav.about },
        { id: "services", label: t.nav.services },
        { id: "industries", label: t.nav.industries },
        { id: "insights", label: t.nav.insights },
        { id: "projects", label: t.nav.projects },
        { id: "contact", label: t.nav.contact, icon: PhoneCall },
      ];

      return (
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-4">
              
              {/* Logo Branding */}
              <div 
                onClick={() => handleTabClick("home")}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="bg-blue-850 p-2 rounded-xl text-white transition-all group-hover:bg-blue-900 group-hover:scale-105">
                  <Globe className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="text-lg font-extrabold tracking-tight text-slate-950 font-sans">
                    Tech-Ville
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider block text-slate-500 leading-none">
                    Climate Intelligence
                  </span>
                </div>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="hidden xl:flex items-center gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => handleTabClick(item.id)}
                      className={`relative flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                        isActive
                          ? item.highlight 
                            ? "bg-blue-800 text-white shadow-sm"
                            : "bg-slate-100 text-slate-950"
                          : item.highlight
                            ? "bg-amber-50 text-amber-800 border border-amber-200/50 hover:bg-amber-100"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      {Icon && <Icon className={`w-3.5 h-3.5 ${item.highlight && !isActive ? "text-amber-600 animate-pulse" : ""}`} />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Right Hand Actions: Language Selector & CTA */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Multilingual toggle button */}
                <button
                  onClick={toggleLanguage}
                  id="lang-toggle-btn"
                  className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold font-mono tracking-wider text-slate-700 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 uppercase transition-all cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "FR" : "EN"}</span>
                </button>

                {/* Quick Contact CTA */}
                <button
                  onClick={() => handleTabClick("contact")}
                  className="py-2.5 px-4 rounded-lg bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {t.common.requestConsultation}
                </button>
              </div>

              {/* Tablet/Mobile Buttons */}
              <div className="xl:hidden flex items-center gap-2">
                {/* Multilingual toggle */}
                <button
                  onClick={toggleLanguage}
                  className="py-1.5 px-2.5 text-xs font-bold font-mono tracking-wider text-slate-700 bg-slate-50 rounded-lg border border-slate-200 uppercase cursor-pointer"
                >
                  {language === "en" ? "FR" : "EN"}
                </button>

                {/* Hamburger button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  id="mobile-hamburger-btn"
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

            </div>
          </div>

          {/* Mobile Drawer Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="xl:hidden overflow-hidden bg-white border-b border-slate-200 shadow-lg"
              >
                <div className="px-4 pt-2 pb-6 space-y-1.5 max-w-7xl mx-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        id={`mobile-nav-item-${item.id}`}
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all text-left cursor-pointer ${
                          isActive
                            ? item.highlight
                              ? "bg-blue-800 text-white"
                              : "bg-slate-100 text-slate-950"
                            : item.highlight
                              ? "bg-amber-50 text-amber-800 border border-amber-200/50"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  
                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      onClick={() => handleTabClick("contact")}
                      className="w-full text-center py-3 bg-slate-950 text-white text-sm font-bold rounded-xl uppercase tracking-wider"
                    >
                      {t.common.requestConsultation}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      );
    }
