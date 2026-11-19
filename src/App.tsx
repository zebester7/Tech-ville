<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, ArrowRight, ShieldCheck, Mail, Phone, MapPin, Download, CheckCircle2, 
  ChevronRight, ArrowDown, Activity, Sparkles, AlertCircle, BookOpen, Clock, 
  User, Building2, HelpCircle, FileText, Compass, Star, Database, Award, Map, 
  Briefcase, Send, ShieldAlert, CheckSquare, RefreshCw, Users, Target, Eye,
  GraduationCap, Microscope, ClipboardCheck, Cloud, Droplets, TreePine, 
  Waves, Brain, LineChart, BarChart3, Settings, Zap, Search, Layers
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ClimateDashboard from "./components/ClimateDashboard";
import AIAdvisor from "./components/AIAdvisor";
import LeadModal from "./components/LeadModal";
import NavLink, { handleNavClick } from "./components/NavLink";
import Breadcrumbs from "./components/Breadcrumbs";
import FAQ from "./components/FAQ";
import NotFound from "./components/NotFound";
import { Language, NavTab, ContactFormData, CaseStudy, InsightArticle } from "./types";
import { translations, caseStudiesData, insightArticlesData } from "./translations";
import { pathForTab, tabFromPath } from "./routes";
import { applyHeadInBrowser } from "./seo";

interface AppProps {
  /** Page resolved from the URL (by the server when prerendering, by main.tsx on the client). */
  initialTab: NavTab;
  notFound?: boolean;
}

export default function App({ initialTab, notFound: initialNotFound = false }: AppProps) {
  const [currentTab, setTab] = useState<NavTab>(initialTab);
  const [notFound, setNotFound] = useState(initialNotFound);
  const [language, setLanguage] = useState<Language>("en");
  
  // Lead Generation state
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{
    name: string;
    type: "profile" | "case_study" | "whitepaper";
  }>({ name: "", type: "profile" });

  // Contact Form state
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: "",
    company: "",
    country: "",
    email: "",
    phone: "",
    service: "Select a service...",
    message: ""
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  // Active blog article state
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);

  // Interactive Project Map (Contact Tab) selected marker
  const [selectedMapPoint, setSelectedMapPoint] = useState<string | null>("hq");

  const t = translations[language];

  // Navigate without a page reload. This is the only place that pushes history,
  // so each click creates exactly one history entry.
  const handleTabChange = (tab: NavTab) => {
    const url = pathForTab(tab);
    if (window.location.pathname !== url || notFound) {
      window.history.pushState({ tab }, "", url);
    }
    setTab(tab);
    setNotFound(false);
    setActiveArticle(null);
    window.scrollTo(0, 0);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const tab = tabFromPath(window.location.pathname);
      setNotFound(tab === null);
      setTab(tab ?? "home");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Keep <title>, meta description and canonical in sync after client-side navigation
  useEffect(() => {
    applyHeadInBrowser(notFound ? null : currentTab);
  }, [currentTab, notFound]);

  const handleOpenDownload = (name: string, type: "profile" | "case_study" | "whitepaper") => {
    setSelectedResource({ name, type });
    setLeadModalOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactSuccess(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactForm,
          type: "consultation"
        })
      });

      const data = await response.json();
      if (response.ok) {
        setContactSuccess(data.message);
        setContactForm({
          name: "",
          company: "",
          country: "",
          email: "",
          phone: "",
          service: "Select a service...",
          message: ""
        });
      }
    } catch (err) {
      console.error(err);
      setContactSuccess(language === "fr" 
        ? "Désolé, une erreur s'est produite lors de l'envoi." 
        : "Sorry, an error occurred during submission. Please try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleServiceInquiry = (serviceName: string) => {
    setContactForm(prev => ({ ...prev, service: serviceName }));
    handleTabChange("contact");
    setTimeout(() => {
      document.getElementById("contact-form-section")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-800/10 selection:text-blue-900 font-sans">
      
      {/* Header Navigation Wrapper */}
      <Navbar 
        currentTab={currentTab} 
        setTab={handleTabChange} 
        language={language} 
        setLanguage={setLanguage} 
      />

      {/* Main Page Render router */}
      <main className="flex-grow">
        {!notFound && <Breadcrumbs tab={currentTab} language={language} onNavigate={handleTabChange} />}
        {/* initial={false}: the first page renders fully visible (server HTML and first paint), only later navigations animate */}
        <AnimatePresence mode="wait" initial={false}>

          {notFound && (
            <motion.div key="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <NotFound language={language} onNavigate={handleTabChange} />
            </motion.div>
          )}

          {/* HOME VIEW */}
          {!notFound && currentTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-20 pb-20"
            >
              {/* Premium Hero Section */}
              <section className="relative bg-slate-950 text-white py-24 px-4 overflow-hidden border-b border-slate-900 min-h-[500px] flex items-center">
                {/* (Removed: background referenced /assets/hero-bg.jpg, which does not exist and returned 404.
                    To restore, add the image under public/ and set width/height-stable CSS.) */}

                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/60 to-slate-950/40" />
                
                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight font-sans text-slate-50 drop-shadow-lg">
                    {t.home.heroTitle}
                  </h1>
                  
                  <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    {t.home.heroSub}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
                    <motion.button
                      onClick={() => handleTabChange("contact")}
                      className="w-full sm:w-auto py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider cursor-pointer relative overflow-hidden group shadow-lg shadow-blue-600/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(59, 130, 246, 0)",
                          "0 0 30px 10px rgba(59, 130, 246, 0.3)",
                          "0 0 0 0 rgba(59, 130, 246, 0)"
                        ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {t.common.requestConsultation}
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut"
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </span>
                    </motion.button>
                  </div>
                </div>
              </section>

              {/* Who We Are Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg relative overflow-hidden"
                >
                  <motion.div
                    className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
                  />
                  <motion.div
                    className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "loop", delay: 1 }}
                  />
                  
                  <div className="relative z-10 text-center space-y-5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider font-mono bg-blue-50 px-4 py-2 rounded-full border border-blue-100"
                    >
                      <Award className="w-4 h-4" />
                      <span>{t.home.whoWeAreTitle}</span>
                    </motion.div>
                    
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight"
                    >
                      {language === "fr" ? "Expertise Scientifique pour un Avenir Résilient" : "Scientific Solutions for an Adaptive World"}
                    </motion.h2>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      <p className="text-slate-650 leading-relaxed text-sm max-w-3xl mx-auto">
                        {t.home.whoWeAreText1}
                      </p>
                      <p className="text-slate-650 leading-relaxed text-sm max-w-3xl mx-auto">
                        {t.home.whoWeAreText2}
                      </p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="pt-2"
                    >
                      <motion.button
                        onClick={() => handleTabChange("about")}
                        className="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 px-6 py-3 rounded-lg transition-all cursor-pointer shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.05, x: 3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{t.common.learnMore}</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              </section>

              {/* Core Services Highlights */}
              <section className="bg-slate-100/60 py-20 border-y border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Solutions</span>
                    <h2 className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight">{t.home.servicesTitle}</h2>
                    <p className="text-slate-600 text-sm">Translating spatial observations and deep climate forecasts into tailored strategic operations.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Agriculture */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl w-fit border border-emerald-100">
                          <Activity className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-950 font-sans">{t.home.servicesAgriTitle}</h3>
                        <p className="text-slate-650 text-sm leading-relaxed">
                          {t.home.servicesAgriText}
                        </p>
                      </div>
                      <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                        <button 
                          onClick={() => handleTabChange("services")}
                          className="text-xs font-bold text-blue-800 uppercase tracking-wider hover:text-blue-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{language === "fr" ? "Voir tous les services agricoles" : "View agricultural services"}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Cat Risk */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="bg-blue-50 text-blue-800 p-3 rounded-xl w-fit border border-blue-100">
                          <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-950 font-sans">{t.home.servicesRiskTitle}</h3>
                        <p className="text-slate-650 text-sm leading-relaxed">
                          {t.home.servicesRiskText}
                        </p>
                      </div>
                      <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                        <button 
                          onClick={() => handleTabChange("services")}
                          className="text-xs font-bold text-blue-800 uppercase tracking-wider hover:text-blue-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{language === "fr" ? "Voir tous les services de risques" : "View catastrophe analytics"}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Weather Equipment Deployment */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="bg-amber-50 text-amber-800 p-3 rounded-xl w-fit border border-amber-100">
                          <Activity className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-950 font-sans">
                          {t.home.servicesEquipmentTitle}
                        </h3>
                        <p className="text-slate-650 text-sm leading-relaxed">
                          {t.home.servicesEquipmentText}
                        </p>
                      </div>
                      <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                        <button 
                          onClick={() => handleTabChange("services")}
                          className="text-xs font-bold text-blue-800 uppercase tracking-wider hover:text-blue-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{t.common.viewEquipmentServices}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Why Choose TechVille */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Value Proposition</span>
                  <h2 className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight">{t.home.whyUsTitle}</h2>
                  <p className="text-slate-650 text-sm">Engineered with scientific precision to build structural and commercial resilience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {t.home.whyUsList.map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs transition-all duration-300"
                    >
                      <h3 className="text-base font-bold text-slate-950 font-sans mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Industries We Serve */}
              <section className="bg-slate-950 text-white py-20 px-4 border-t border-slate-900">
                <div className="max-w-7xl mx-auto space-y-12">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">Focal Industries</span>
                    <h2 className="text-3xl font-bold text-slate-50 tracking-tight font-sans">{t.home.industriesTitle}</h2>
                    <p className="text-slate-400 text-sm">{t.home.industriesSub}</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { id: "agriculture", label: language === "fr" ? "Agriculture" : "Agriculture", count: "40+ Projects" },
                      { id: "insurance", label: language === "fr" ? "Assurances" : "Insurance", count: "25+ Portfolios" },
                      { id: "energy", label: language === "fr" ? "Énergie & Eau" : "Energy & Utilities", count: "15+ Utilities" }
                    ].map((ind) => (
                      <div 
                        key={ind.id}
                        onClick={() => handleTabChange("industries")}
                        className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-emerald-500 transition-all cursor-pointer text-center space-y-2 group"
                      >
                        <Globe className="w-8 h-8 text-emerald-400 mx-auto transition-transform group-hover:scale-110" />
                        <h3 className="text-sm font-bold font-sans text-slate-200">{ind.label}</h3>
                        <p className="text-[10px] font-mono text-slate-500 font-semibold">{ind.count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Client Engagement Section */}
              <section className="max-w-4xl mx-auto text-center px-4 space-y-6 pt-10">
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight font-sans">
                  {t.home.ctaTitle}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
                  {t.home.ctaSub}
                </p>
                <button
                  onClick={() => handleTabChange("contact")}
                  className="py-3 px-6 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider shadow hover:shadow-md cursor-pointer transition-all"
                >
                  {t.common.requestConsultation}
                </button>
              </section>

            </motion.div>
          )}

          {/* ABOUT VIEW */}
          {!notFound && currentTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Expertise</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.about.title}</h1>
                <p className="text-slate-600 text-sm">{t.about.subtitle}</p>
              </div>

              <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <h2 className="text-xl font-bold text-slate-950 font-sans border-b border-slate-100 pb-2">{t.about.overviewTitle}</h2>
                  <p className="text-slate-650 text-sm leading-relaxed">
                    {t.about.overviewText}
                  </p>
                </div>
                <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">{t.about.expertiseTitle}</h3>
                  <ul className="space-y-2 text-xs font-semibold text-slate-700 font-mono">
                    {t.about.expertiseList.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="bg-blue-50 text-blue-800 p-2.5 rounded-lg w-fit border border-blue-100">
                      <Star className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 font-sans">{t.about.missionTitle}</h3>
                    <p className="text-slate-650 text-xs leading-relaxed">{t.about.missionText}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg w-fit border border-emerald-100">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 font-sans">{t.about.visionTitle}</h3>
                    <p className="text-slate-650 text-xs leading-relaxed">{t.about.visionText}</p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* TEAM VIEW - With Proper Content */}
          {!notFound && currentTab === "team" && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
            >
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">Meet Our People</span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight font-sans">Our Team</h1>
                <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                  World-class climate scientists, agronomists, and geospatial engineers dedicated to building climate resilience.
                </p>
                <div className="w-20 h-1 bg-blue-800 mx-auto rounded-full mt-4" />
              </div>

              {/* Intro Section */}
              <section className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <p className="text-slate-650 text-sm leading-relaxed max-w-4xl mx-auto text-center">
                    Our team combines decades of expertise in climate science, risk analytics, agronomy, and geospatial engineering. 
                    We are united by a common mission: to translate complex climate data into actionable intelligence that helps 
                    organizations build resilient futures.
                  </p>
                </div>
              </section>

              {/* Leadership Team Section */}
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-950 font-sans tracking-tight text-center mb-3">Leadership Team</h2>
                <p className="text-center text-slate-500 text-sm mb-10">Experts driving climate intelligence innovation</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Team Member 1 - Dr. Jean Dupont */}
                  <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:shadow-xl transition-all">
                        JD
                      </div>
                      <div className="absolute -bottom-1 right-1/2 translate-x-1/2 bg-emerald-100 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                        Founder
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 font-sans text-center">Dr. Jean Dupont</h3>
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider text-center mb-2">Chief Climate Scientist</p>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">PhD in Atmospheric Sciences, 20+ years experience in climate modeling and downscaling. Former lead researcher at CNRS. Published 45+ peer-reviewed papers.</p>
                  </div>

                  {/* Team Member 2 - Dr. Sophie Martin */}
                  <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:shadow-xl transition-all">
                        SM
                      </div>
                      <div className="absolute -bottom-1 right-1/2 translate-x-1/2 bg-emerald-100 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
                        Co-Founder
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 font-sans text-center">Dr. Sophie Martin</h3>
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider text-center mb-2">Head of Agronomy & Remote Sensing</p>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">PhD in Agricultural Science, specializing in satellite-based crop monitoring and precision agriculture systems. 15+ years of international field experience.</p>
                  </div>

                  {/* Team Member 3 - Dr. Pierre Lefèvre */}
                  <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-600 to-orange-500 mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:shadow-xl transition-all">
                        PL
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 font-sans text-center">Dr. Pierre Lefèvre</h3>
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider text-center mb-2">Director of Catastrophe Risk Analytics</p>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">PhD in Environmental Economics, expert in climate risk modeling, parametric insurance design, and PML/AAL calibration. 18 years in reinsurance.</p>
                  </div>

                  {/* Team Member 4 - Dr. Anne Lambert */}
                  <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 to-violet-500 mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:shadow-xl transition-all">
                        AL
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 font-sans text-center">Dr. Anne Lambert</h3>
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider text-center mb-2">Lead Geospatial Intelligence</p>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">PhD in Geography, expert in Sentinel radar processing, GIS platforms, and high-resolution terrain analysis for flood modeling. 12+ years in geospatial analytics.</p>
                  </div>

                  {/* Team Member 5 - Dr. Thomas Rousseau */}
                  <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-600 to-pink-500 mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:shadow-xl transition-all">
                        TR
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 font-sans text-center">Dr. Thomas Rousseau</h3>
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider text-center mb-2">Head of Hydrological Modeling</p>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">PhD in Hydrology, specialist in flood risk assessment, extreme precipitation modeling, and coastal storm surge prediction. 16 years of research experience.</p>
                  </div>

                  {/* Team Member 6 - Dr. Claire Moreau */}
                  <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-600 to-blue-500 mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:shadow-xl transition-all">
                        CM
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 font-sans text-center">Dr. Claire Moreau</h3>
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider text-center mb-2">Data Science & AI Lead</p>
                    <p className="text-xs text-slate-500 leading-relaxed text-center">PhD in Computer Science, expert in machine learning, climate data fusion, and building decision-support systems with large-scale datasets. 10+ years in AI.</p>
                  </div>
                </div>
              </section>

              {/* Areas of Expertise Section */}
              <section className="bg-slate-50 rounded-2xl border border-slate-200 p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-950 font-sans tracking-tight">Areas of Expertise</h2>
                  <p className="text-slate-500 text-sm mt-2">Our multidisciplinary capabilities</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {[
                    { icon: <Cloud className="w-4 h-4" />, label: "Climate Science & Atmospheric Modeling" },
                    { icon: <TreePine className="w-4 h-4" />, label: "Agronomy & Crop Systems" },
                    { icon: <Satellite className="w-4 h-4" />, label: "Geospatial Intelligence & Remote Sensing" },
                    { icon: <LineChart className="w-4 h-4" />, label: "Risk Analytics & Catastrophe Modeling" },
                    { icon: <Droplets className="w-4 h-4" />, label: "Hydrology & Water Resource Management" },
                    { icon: <Brain className="w-4 h-4" />, label: "Data Science & Machine Learning" },
                    { icon: <ClipboardCheck className="w-4 h-4" />, label: "Environmental Policy & Sustainability" },
                    { icon: <Zap className="w-4 h-4" />, label: "Weather Forecasting & Seasonal Prediction" },
                    { icon: <Compass className="w-4 h-4" />, label: "Climate Adaptation Strategies" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm hover:shadow-md transition-all hover:border-blue-400 group">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-xs font-medium text-slate-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Our Values Section */}
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-950 font-sans tracking-tight text-center mb-8">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center hover:shadow-md transition-all">
                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 mx-auto mb-4 flex items-center justify-center">
                      <Target className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-950 font-sans mb-2">Scientific Excellence</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">We are committed to the highest standards of scientific rigor, ensuring our climate intelligence is accurate, reliable, and actionable.</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center hover:shadow-md transition-all">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-950 font-sans mb-2">Collaborative Innovation</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">We believe in the power of collaboration—across disciplines, sectors, and borders—to develop innovative climate solutions.</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center hover:shadow-md transition-all">
                    <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 mx-auto mb-4 flex items-center justify-center">
                      <Eye className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-950 font-sans mb-2">Impact-Driven</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Our work is driven by the desire to make a tangible difference—helping organizations build climate resilience and protect communities.</p>
                  </div>
                </div>
              </section>

              {/* Join Our Team Section */}
              <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-8 md:p-12 text-center border border-blue-800 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight mb-3">Join Our Team</h2>
                  <p className="text-sm text-blue-200 leading-relaxed max-w-2xl mx-auto mb-6">
                    We're always looking for talented climate scientists, data engineers, and geospatial analysts to join our mission. 
                    If you're passionate about climate resilience and scientific innovation, we'd love to hear from you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:careers@techville.eu"
                      className="px-6 py-3 bg-white text-blue-900 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-blue-50 transition-all cursor-pointer shadow-md hover:shadow-lg"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        careers@techville.eu
                      </span>
                    </a>
                    {/* "View Open Positions" removed: it opened /careers, which does not exist (404). */}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* SERVICES VIEW */}
          {!notFound && currentTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Services Portal</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.services.title}</h1>
                <p className="text-slate-600 text-sm">{t.services.subtitle}</p>
              </div>

              <section className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl font-bold text-slate-950 font-sans">{t.services.agriTitle}</h2>
                  <p className="text-slate-500 text-xs mt-1">{t.services.agriSubtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {t.services.agriList.map((srv, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-900 font-sans">{srv.name}</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">{srv.desc}</p>
                      </div>
                      <button 
                        onClick={() => handleServiceInquiry(srv.name)}
                        className="text-[10px] font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider pt-4 border-t border-slate-100 mt-4 text-left cursor-pointer"
                      >
                        Inquire Service
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl font-bold text-slate-950 font-sans">{t.services.catTitle}</h2>
                  <p className="text-slate-500 text-xs mt-1">{t.services.catSubtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {t.services.catList.map((srv, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-900 font-sans">{srv.name}</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">{srv.desc}</p>
                      </div>
                      <button 
                        onClick={() => handleServiceInquiry(srv.name)}
                        className="text-[10px] font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider pt-4 border-t border-slate-100 mt-4 text-left cursor-pointer"
                      >
                        Inquire Service
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg border border-emerald-100">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-950 font-sans">{t.services.equipmentTitle}</h2>
                      <p className="text-slate-500 text-xs mt-1">{t.services.equipmentSubtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {t.services.equipmentList.map((srv, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-emerald-400"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <h3 className="text-sm font-bold text-slate-900 font-sans group-hover:text-emerald-700 transition-colors">{srv.name}</h3>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed pl-4">{srv.desc}</p>
                      </div>
                      <button 
                        onClick={() => handleServiceInquiry(srv.name)}
                        className="text-[10px] font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider pt-4 border-t border-slate-100 mt-4 text-left cursor-pointer flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        <span>Inquire Service</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* INDUSTRIES VIEW */}
          {!notFound && currentTab === "industries" && (
            <motion.div
              key="industries"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Target Industries</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.industries.title}</h1>
                <p className="text-slate-600 text-sm">{t.industries.subtitle}</p>
              </div>

              <section className="space-y-12">
                {t.industries.list.map((ind, idx) => (
                  <div 
                    key={ind.id}
                    id={`industry-section-${ind.id}`}
                    className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-800 p-2.5 rounded-lg border border-blue-100">
                          <Globe className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-950 font-sans tracking-tight">{ind.title}</h2>
                      </div>
                      <p className="text-slate-650 text-sm leading-relaxed">
                        {ind.desc}
                      </p>
                      
                      <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Primary Scientific Deliverables:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {ind.points.map((pt, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border">
                              <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </motion.div>
          )}

          {/* INSIGHTS VIEW */}
          {!notFound && currentTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Climate Insights</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.insights.title}</h1>
                <p className="text-slate-650 text-sm">{t.insights.subtitle}</p>
              </div>

              <AnimatePresence mode="wait">
                {activeArticle ? (
                  <motion.article
                    key="article-reader"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 max-w-4xl mx-auto"
                  >
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
                      <button 
                        onClick={() => setActiveArticle(null)}
                        className="text-xs font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider pr-4 border-r border-slate-200 cursor-pointer"
                      >
                        {t.common.backToInsights}
                      </button>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-150 px-2 py-0.5 rounded">
                        {language === "fr" ? activeArticle.categoryFr : activeArticle.category}
                      </span>
                      <span className="text-xs text-slate-450">{activeArticle.date}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 font-sans tracking-tight leading-tight">
                      {language === "fr" ? activeArticle.titleFr : activeArticle.title}
                    </h2>

                    <div className="space-y-4 text-slate-700 text-sm leading-relaxed max-w-3xl">
                      {(language === "fr" ? activeArticle.contentFr : activeArticle.content).map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-sans">
                      <span>{t.common.author}</span>
                      <span className="font-mono">{language === "fr" ? activeArticle.readTimeFr : activeArticle.readTime}</span>
                    </div>
                  </motion.article>
                ) : (
                  <div key="insights-list" className="max-w-4xl mx-auto space-y-6">
                    {insightArticlesData.map((art) => (
                      <div 
                        key={art.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="font-bold text-blue-800 uppercase tracking-wider font-mono">
                            {language === "fr" ? art.categoryFr : art.category}
                          </span>
                          <span>•</span>
                          <span>{art.date}</span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-950 font-sans tracking-tight">
                          {language === "fr" ? art.titleFr : art.title}
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                          {language === "fr" ? art.summaryFr : art.summary}
                        </p>
                        <div className="pt-2 flex justify-between items-center text-xs">
                          <button
                            onClick={() => setActiveArticle(art)}
                            className="font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <span>{t.common.readArticle}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <span className="text-slate-400 font-mono">{language === "fr" ? art.readTimeFr : art.readTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* PROJECTS VIEW - Graph Removed */}
          {!notFound && currentTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Case Studies</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{language === "fr" ? "Études de Projets & Cas" : "Project Experience & Case Studies"}</h1>
                <p className="text-slate-650 text-sm">{language === "fr" ? "Démonstration d'analyses de risques climatiques appliquées à l'échelle internationale." : "Demonstrating applied climate risk solutions and modeling methodology across global ecosystems."}</p>
              </div>

              <section className="space-y-16">
                {caseStudiesData.map((project, idx) => (
                  <div 
                    key={project.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                  >
                    <div className="lg:col-span-8 space-y-5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {language === "fr" ? project.categoryFr : project.category}
                        </span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-950 font-sans tracking-tight">
                        {language === "fr" ? project.titleFr : project.title}
                      </h2>
                      <p className="text-slate-650 text-sm leading-relaxed font-sans italic border-l-4 border-emerald-500 pl-4 bg-emerald-50/20 py-2 rounded-r-lg">
                        {language === "fr" ? project.summaryFr : project.summary}
                      </p>

                      <div className="space-y-4 pt-2">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Project Overview</h4>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {language === "fr" ? project.overviewFr : project.overview}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Methodology & Framework</h4>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {language === "fr" ? project.methodologyFr : project.methodology}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Operational Outcome</h4>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {language === "fr" ? project.outcomeFr : project.outcome}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 h-full flex flex-col justify-between">
                      <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 font-mono text-[9px] text-slate-400 h-32 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex justify-between items-center text-[8px]">
                          <span>SYS_ID: {project.id}</span>
                          <span className="text-emerald-400">● LIVE</span>
                        </div>
                        
                        {/* GRAPH REMOVED - Showing system info only */}
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-[10px] text-slate-500 font-mono">DATA MODEL ACTIVE</span>
                        </div>

                        <div className="flex justify-between text-[7px] text-slate-500">
                          <span>UNIFIED DATA MODEL</span>
                          <span>CALIBRATION SUCCEEDED</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <p className="text-[10px] text-slate-500 font-mono">FILE ATTACHMENT: {project.pdfSize}</p>
                        <button
                          onClick={() => handleOpenDownload(
                            language === "fr" ? project.titleFr : project.title, 
                            "case_study"
                          )}
                          className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>{t.common.downloadBrief}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </motion.div>
          )}

          {/* CONTACT VIEW - Graph Removed */}
          {!notFound && currentTab === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Connect</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.contact.title}</h1>
                <p className="text-slate-650 text-sm">{t.contact.subtitle}</p>
              </div>

              <div id="contact-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950 font-sans tracking-tight">{t.contact.formTitle}</h2>
                    <p className="text-slate-500 text-xs mt-1">{t.contact.formSub}</p>
                  </div>

                  {contactSuccess ? (
                    <div className="bg-emerald-950/90 border border-emerald-800 text-slate-100 p-5 rounded-xl text-xs space-y-2 flex flex-col items-center text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 animate-bounce" />
                      <p className="font-bold text-sm">{t.common.success}</p>
                      <p className="leading-relaxed text-slate-300 max-w-md">{contactSuccess}</p>
                      <button
                        onClick={() => setContactSuccess(null)}
                        className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-slate-950 rounded font-bold cursor-pointer transition-all"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.name} <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="Jean Dupont"
                            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.email} <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="jean.dupont@company.com"
                            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.company}</label>
                          <input
                            type="text"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                            placeholder="AgriCorp France"
                            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.country}</label>
                          <input
                            type="text"
                            value={contactForm.country}
                            onChange={(e) => setContactForm({ ...contactForm, country: e.target.value })}
                            placeholder="France"
                            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.phone}</label>
                          <input
                            type="text"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="+33 1 23 45 67 89"
                            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.service} <span className="text-red-500">*</span></label>
                          <select
                            value={contactForm.service}
                            onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800 bg-white"
                          >
                            <option disabled value="Select a service...">{t.contact.serviceOpts.select}</option>
                            <option value="Agriculture">{t.contact.serviceOpts.agri}</option>
                            <option value="Catastrophe Risk">{t.contact.serviceOpts.risk}</option>
                            <option value="Consulting">{t.contact.serviceOpts.consulting}</option>
                            <option value="General Inquiry">{t.contact.serviceOpts.other}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.message} <span className="text-red-500">*</span></label>
                        <textarea
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          rows={4}
                          placeholder="Describe your climate risk assessment needs..."
                          className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={contactSubmitting}
                        className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          contactSubmitting
                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                            : "bg-blue-800 text-white hover:bg-blue-900 hover:shadow-sm"
                        }`}
                      >
                        {contactSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{t.contact.submitting}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{t.contact.submit}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 text-blue-800 p-2 rounded-lg border border-blue-100">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-950 font-sans tracking-tight">{t.contact.officeTitle}</h3>
                    </div>
                    <p className="text-xs text-slate-650 font-sans leading-relaxed">
                      {t.contact.officeSub}
                    </p>
                    <div className="text-xs font-medium space-y-1.5 pt-2 text-slate-750">
                      <p className="font-mono text-[11px] text-slate-600">{t.contact.officeAddr}</p>
                      <p className="text-slate-500">{t.contact.officeHours}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">{t.contact.emailsTitle}</h3>
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500 font-semibold">General Support:</span>
                        <a href="mailto:info@techville.eu" className="font-mono text-blue-850 hover:underline">info@techville.eu</a>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500 font-semibold">Business Dev:</span>
                        <a href="mailto:business@techville.eu" className="font-mono text-blue-850 hover:underline">business@techville.eu</a>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500 font-semibold">Active Projects:</span>
                        <a href="mailto:projects@techville.eu" className="font-mono text-blue-850 hover:underline">projects@techville.eu</a>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500 font-semibold">Partnerships:</span>
                        <a href="mailto:partnerships@techville.eu" className="font-mono text-blue-850 hover:underline">partnerships@techville.eu</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Map Section */}
              <section className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 relative shadow-inner overflow-hidden">
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono tracking-wider font-semibold">
                  TECHVILLE PROJECT TOUCHPOINTS INDEX MAP
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
                  <div className="lg:col-span-7 flex justify-center items-center">
                    <svg viewBox="0 0 800 400" className="w-full opacity-85 max-h-[280px]" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" fill="none">
                        <line x1="0" y1="100" x2="800" y2="100" />
                        <line x1="0" y1="200" x2="800" y2="200" />
                        <line x1="0" y1="300" x2="800" y2="300" />
                        <line x1="200" y1="0" x2="200" y2="400" />
                        <line x1="400" y1="0" x2="400" y2="400" />
                        <line x1="600" y1="0" x2="600" y2="400" />
                      </g>

                      <g fill="#1e293b" stroke="#334155" strokeWidth="1.5">
                        <path d="M 50 120 Q 80 90 150 80 T 250 70 T 320 110 T 350 170 T 300 200 T 200 180 Z" />
                        <path d="M 120 190 Q 200 200 250 240 T 240 350 T 280 440 T 240 450 T 160 350 T 110 270 Z" />
                        <path d="M 280 170 Q 340 180 380 200 T 390 260 T 330 250 Z" />
                        <path d="M 350 120 Q 550 90 700 100 T 850 150 T 800 290 T 650 320 T 450 270 Z" />
                      </g>

                      {[
                        { id: "hq", name: "France HQ", x: 140, y: 100, color: "#3b82f6" },
                        { id: "vietnam", name: "Vietnam Rail Project", x: 530, y: 220, color: "#f97316" },
                        { id: "kenya", name: "Kenya Drought Index", x: 230, y: 260, color: "#10b981" },
                        { id: "belgium", name: "Belgium Coastline", x: 155, y: 88, color: "#a855f7" }
                      ].map((marker) => {
                        const isPointSelected = selectedMapPoint === marker.id;
                        return (
                          <g key={marker.id} className="cursor-pointer" onClick={() => setSelectedMapPoint(marker.id)}>
                            {isPointSelected && (
                              <circle cx={marker.x} cy={marker.y} r="16" fill="none" stroke={marker.color} strokeWidth="1" className="animate-ping opacity-45" />
                            )}
                            <circle cx={marker.x} cy={marker.y} r={isPointSelected ? "8" : "5"} fill={marker.color} className="transition-all duration-300" />
                            <text x={marker.x} y={marker.y - 12} fill="#e2e8f0" textAnchor="middle" className="text-[8px] font-mono font-bold tracking-tight bg-slate-950/80 px-1 rounded">
                              {marker.name}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[220px]">
                    <AnimatePresence mode="wait">
                      {selectedMapPoint === "hq" && (
                        <motion.div key="hq" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                          <span className="text-[9px] font-bold font-mono text-blue-400 uppercase tracking-wider bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-900">Headquarters</span>
                          <h4 className="text-sm font-bold font-sans text-slate-100">Paris Operations Center</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            Our primary research operations, super-computing arrays, downscaling servers, and administrative offices are located in the heart of Paris, France. Coordinates for data ingestion are managed on site.
                          </p>
                        </motion.div>
                      )}
                      {selectedMapPoint === "vietnam" && (
                        <motion.div key="vietnam" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                          <span className="text-[9px] font-bold font-mono text-orange-400 uppercase tracking-wider bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-900 font-semibold">Active Project</span>
                          <h4 className="text-sm font-bold font-sans text-slate-100">Mekong Delta Rail Corridor</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            Conducting daily flood recurrence simulations, monsoon rainfall downscaling, and drafting coastal resilience design briefs for high-speed rail operators. Saves €140M in estimated life-cycle repair losses.
                          </p>
                        </motion.div>
                      )}
                      {selectedMapPoint === "kenya" && (
                        <motion.div key="kenya" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                          <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-900 font-semibold">Active Project</span>
                          <h4 className="text-sm font-bold font-sans text-slate-100">Rift Valley Agriculture</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            Continuous 10m grid soil moisture indices (SWI) compiled via Sentinel SAR satellite radar. Automatically triggers micro-finance payouts for 250,000 smallholder farmers during severe drought conditions.
                          </p>
                        </motion.div>
                      )}
                      {selectedMapPoint === "belgium" && (
                        <motion.div key="belgium" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                          <span className="text-[9px] font-bold font-mono text-purple-400 uppercase tracking-wider bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-900 font-semibold">Active Project</span>
                          <h4 className="text-sm font-bold font-sans text-slate-100">Flanders Coastal Dunes</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            Modeling extreme storm surge inundation ratios and drafting sandy dune adaptive protection strategies for local commercial property portfolios and polder horticultural regions.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </section>

              <FAQ language={language} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer setTab={handleTabChange} language={language} />

      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        resourceName={selectedResource.name}
        resourceType={selectedResource.type}
        language={language}
      />

    </div>
  );
}
=======
  import React, { useState } from "react";
  import { motion, AnimatePresence } from "motion/react";
  import { 
    Globe, ArrowRight, ShieldCheck, Mail, Phone, MapPin, Download, CheckCircle2, 
    ChevronRight, ArrowDown, Activity, Sparkles, AlertCircle, BookOpen, Clock, 
    User, Building2, HelpCircle, FileText, Compass, Star, Database, Award, Map, 
    Briefcase, Send, ShieldAlert, CheckSquare, RefreshCw 
  } from "lucide-react";
  import Navbar from "./components/Navbar";
  import Footer from "./components/Footer";
  import ClimateDashboard from "./components/ClimateDashboard";
  import AIAdvisor from "./components/AIAdvisor";
  import LeadModal from "./components/LeadModal";
  import { Language, NavTab, ContactFormData, CaseStudy, InsightArticle } from "./types";
  import { translations, caseStudiesData, insightArticlesData } from "./translations";

  export default function App() {
    const [currentTab, setTab] = useState<NavTab>("home");
    const [language, setLanguage] = useState<Language>("en");
    
    // Lead Generation state
    const [leadModalOpen, setLeadModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<{
      name: string;
      type: "profile" | "case_study" | "whitepaper";
    }>({ name: "", type: "profile" });

    // Contact Form state
    const [contactForm, setContactForm] = useState<ContactFormData>({
      name: "",
      company: "",
      country: "",
      email: "",
      phone: "",
      service: "Select a service...",
      message: ""
    });
    const [contactSubmitting, setContactSubmitting] = useState(false);
    const [contactSuccess, setContactSuccess] = useState<string | null>(null);

    // Active blog article state
    const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);

    // Interactive Project Map (Contact Tab) selected marker
    const [selectedMapPoint, setSelectedMapPoint] = useState<string | null>("hq");

    const t = translations[language];

    const handleOpenDownload = (name: string, type: "profile" | "case_study" | "whitepaper") => {
      setSelectedResource({ name, type });
      setLeadModalOpen(true);
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setContactSubmitting(true);
      setContactSuccess(null);

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...contactForm,
            type: "consultation"
          })
        });

        const data = await response.json();
        if (response.ok) {
          setContactSuccess(data.message);
          setContactForm({
            name: "",
            company: "",
            country: "",
            email: "",
            phone: "",
            service: "Select a service...",
            message: ""
          });
        }
      } catch (err) {
        console.error(err);
        setContactSuccess(language === "fr" 
          ? "Désolé, une erreur s'est produite lors de l'envoi." 
          : "Sorry, an error occurred during submission. Please try again.");
      } finally {
        setContactSubmitting(false);
      }
    };

    const handleServiceInquiry = (serviceName: string) => {
      setContactForm(prev => ({ ...prev, service: serviceName }));
      setTab("contact");
      setTimeout(() => {
        document.getElementById("contact-form-section")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    };

    return (
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-800/10 selection:text-blue-900 font-sans">
        
        {/* Header Navigation Wrapper */}
        <Navbar 
          currentTab={currentTab} 
          setTab={setTab} 
          language={language} 
          setLanguage={setLanguage} 
        />

        {/* Main Page Render router */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            
            {/* HOME VIEW */}
            {currentTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-20 pb-20"
              >
                {/* Premium Geo-grid Hero Section */}
                <section className="relative bg-slate-950 text-white py-24 px-4 overflow-hidden border-b border-slate-900">
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
                  
                  <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight font-sans text-slate-50">
                      {t.home.heroTitle}
                    </h1>
                    
                    <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                      {t.home.heroSub}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
                      <motion.button
                        onClick={() => setTab("contact")}
                        className="w-full sm:w-auto py-3 px-6 rounded-lg bg-blue-800 text-white font-bold text-sm uppercase tracking-wider cursor-pointer relative overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ 
                          boxShadow: [
                            "0 0 0 0 rgba(59, 130, 246, 0)",
                            "0 0 20px 5px rgba(59, 130, 246, 0.3)",
                            "0 0 0 0 rgba(59, 130, 246, 0)"
                          ]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {t.common.requestConsultation}
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              repeatType: "loop",
                              ease: "easeInOut"
                            }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.span>
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </section>

                {/* Who We Are Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
                    />
                    <motion.div
                      className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{ duration: 5, repeat: Infinity, repeatType: "loop", delay: 1 }}
                    />
                    
                    <div className="relative z-10 text-center space-y-5">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider font-mono bg-blue-50 px-4 py-2 rounded-full border border-blue-100"
                      >
                        <Award className="w-4 h-4" />
                        <span>{t.home.whoWeAreTitle}</span>
                      </motion.div>
                      
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight"
                      >
                        {language === "fr" ? "Expertise Scientifique pour un Avenir Résilient" : "Scientific Solutions for an Adaptive World"}
                      </motion.h2>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                      >
                        <p className="text-slate-650 leading-relaxed text-sm max-w-3xl mx-auto">
                          {t.home.whoWeAreText1}
                        </p>
                        <p className="text-slate-650 leading-relaxed text-sm max-w-3xl mx-auto">
                          {t.home.whoWeAreText2}
                        </p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="pt-2"
                      >
                        <motion.button
                          onClick={() => setTab("about")}
                          className="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 px-6 py-3 rounded-lg transition-all cursor-pointer shadow-md hover:shadow-lg"
                          whileHover={{ scale: 1.05, x: 3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>{t.common.learnMore}</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                </section>

                {/* Core Services Highlights */}
                <section className="bg-slate-100/60 py-20 border-y border-slate-200/50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Solutions</span>
                      <h2 className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight">{t.home.servicesTitle}</h2>
                      <p className="text-slate-600 text-sm">Translating spatial observations and deep climate forecasts into tailored strategic operations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Agriculture */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl w-fit border border-emerald-100">
                            <Activity className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-950 font-sans">{t.home.servicesAgriTitle}</h3>
                          <p className="text-slate-650 text-sm leading-relaxed">
                            {t.home.servicesAgriText}
                          </p>
                        </div>
                        <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                          <button 
                            onClick={() => setTab("services")}
                            className="text-xs font-bold text-blue-800 uppercase tracking-wider hover:text-blue-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{language === "fr" ? "Voir tous les services agricoles" : "View agricultural services"}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Cat Risk */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="bg-blue-50 text-blue-800 p-3 rounded-xl w-fit border border-blue-100">
                            <ShieldAlert className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-950 font-sans">{t.home.servicesRiskTitle}</h3>
                          <p className="text-slate-650 text-sm leading-relaxed">
                            {t.home.servicesRiskText}
                          </p>
                        </div>
                        <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                          <button 
                            onClick={() => setTab("services")}
                            className="text-xs font-bold text-blue-800 uppercase tracking-wider hover:text-blue-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{language === "fr" ? "Voir tous les services de risques" : "View catastrophe analytics"}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Weather Equipment Deployment */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="bg-amber-50 text-amber-800 p-3 rounded-xl w-fit border border-amber-100">
                            <Activity className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-950 font-sans">
                            {t.home.servicesEquipmentTitle}
                          </h3>
                          <p className="text-slate-650 text-sm leading-relaxed">
                            {t.home.servicesEquipmentText}
                          </p>
                        </div>
                        <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                          <button 
                            onClick={() => setTab("services")}
                            className="text-xs font-bold text-blue-800 uppercase tracking-wider hover:text-blue-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{t.common.viewEquipmentServices}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Why Choose TechVille */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Value Proposition</span>
                    <h2 className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight">{t.home.whyUsTitle}</h2>
                    <p className="text-slate-650 text-sm">Engineered with scientific precision to build structural and commercial resilience.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {t.home.whyUsList.map((item, idx) => (
                      <div 
                        key={idx}
                        className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs transition-all duration-300"
                      >
                        <h3 className="text-base font-bold text-slate-950 font-sans mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                          {item.title}
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Industries We Serve */}
                <section className="bg-slate-950 text-white py-20 px-4 border-t border-slate-900">
                  <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">Focal Industries</span>
                      <h2 className="text-3xl font-bold text-slate-50 tracking-tight font-sans">{t.home.industriesTitle}</h2>
                      <p className="text-slate-400 text-sm">{t.home.industriesSub}</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { id: "agriculture", label: language === "fr" ? "Agriculture" : "Agriculture", count: "40+ Projects" },
                        { id: "insurance", label: language === "fr" ? "Assurances" : "Insurance", count: "25+ Portfolios" },
                        { id: "energy", label: language === "fr" ? "Énergie & Eau" : "Energy & Utilities", count: "15+ Utilities" }
                      ].map((ind) => (
                        <div 
                          key={ind.id}
                          onClick={() => setTab("industries")}
                          className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-emerald-500 transition-all cursor-pointer text-center space-y-2 group"
                        >
                          <Globe className="w-8 h-8 text-emerald-400 mx-auto transition-transform group-hover:scale-110" />
                          <h3 className="text-sm font-bold font-sans text-slate-200">{ind.label}</h3>
                          <p className="text-[10px] font-mono text-slate-500 font-semibold">{ind.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Client Engagement Section */}
                <section className="max-w-4xl mx-auto text-center px-4 space-y-6 pt-10">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight font-sans">
                    {t.home.ctaTitle}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
                    {t.home.ctaSub}
                  </p>
                  <button
                    onClick={() => setTab("contact")}
                    className="py-3 px-6 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider shadow hover:shadow-md cursor-pointer transition-all"
                  >
                    {t.common.requestConsultation}
                  </button>
                </section>

              </motion.div>
            )}

            {/* ABOUT VIEW */}
            {currentTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
              >
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Expertise</span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.about.title}</h1>
                  <p className="text-slate-600 text-sm">{t.about.subtitle}</p>
                </div>

                <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <h2 className="text-xl font-bold text-slate-950 font-sans border-b border-slate-100 pb-2">{t.about.overviewTitle}</h2>
                    <p className="text-slate-650 text-sm leading-relaxed">
                      {t.about.overviewText}
                    </p>
                  </div>
                  <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">{t.about.expertiseTitle}</h3>
                    <ul className="space-y-2 text-xs font-semibold text-slate-700 font-mono">
                      {t.about.expertiseList.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="bg-blue-50 text-blue-800 p-2.5 rounded-lg w-fit border border-blue-100">
                        <Star className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 font-sans">{t.about.missionTitle}</h3>
                      <p className="text-slate-650 text-xs leading-relaxed">{t.about.missionText}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg w-fit border border-emerald-100">
                        <Globe className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 font-sans">{t.about.visionTitle}</h3>
                      <p className="text-slate-650 text-xs leading-relaxed">{t.about.visionText}</p>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {/* SERVICES VIEW */}
            {currentTab === "services" && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
              >
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Services Portal</span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.services.title}</h1>
                  <p className="text-slate-600 text-sm">{t.services.subtitle}</p>
                </div>

                <section className="space-y-6">
                  <div className="border-b border-slate-200 pb-3">
                    <h2 className="text-xl font-bold text-slate-950 font-sans">{t.services.agriTitle}</h2>
                    <p className="text-slate-500 text-xs mt-1">{t.services.agriSubtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {t.services.agriList.map((srv, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-slate-900 font-sans">{srv.name}</h3>
                          <p className="text-slate-600 text-xs leading-relaxed">{srv.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleServiceInquiry(srv.name)}
                          className="text-[10px] font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider pt-4 border-t border-slate-100 mt-4 text-left cursor-pointer"
                        >
                          Inquire Service
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="border-b border-slate-200 pb-3">
                    <h2 className="text-xl font-bold text-slate-950 font-sans">{t.services.catTitle}</h2>
                    <p className="text-slate-500 text-xs mt-1">{t.services.catSubtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {t.services.catList.map((srv, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-slate-900 font-sans">{srv.name}</h3>
                          <p className="text-slate-600 text-xs leading-relaxed">{srv.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleServiceInquiry(srv.name)}
                          className="text-[10px] font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider pt-4 border-t border-slate-100 mt-4 text-left cursor-pointer"
                        >
                          Inquire Service
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg border border-emerald-100">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-950 font-sans">{t.services.equipmentTitle}</h2>
                        <p className="text-slate-500 text-xs mt-1">{t.services.equipmentSubtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {t.services.equipmentList.map((srv, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-emerald-400"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <h3 className="text-sm font-bold text-slate-900 font-sans group-hover:text-emerald-700 transition-colors">{srv.name}</h3>
                          </div>
                          <p className="text-slate-600 text-xs leading-relaxed pl-4">{srv.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleServiceInquiry(srv.name)}
                          className="text-[10px] font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider pt-4 border-t border-slate-100 mt-4 text-left cursor-pointer flex items-center gap-1 group-hover:gap-2 transition-all"
                        >
                          <span>Inquire Service</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* INDUSTRIES VIEW - AI Assistant removed */}
            {currentTab === "industries" && (
              <motion.div
                key="industries"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
              >
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Target Industries</span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.industries.title}</h1>
                  <p className="text-slate-600 text-sm">{t.industries.subtitle}</p>
                </div>

                <section className="space-y-12">
                  {t.industries.list.map((ind, idx) => (
                    <div 
                      key={ind.id}
                      id={`industry-section-${ind.id}`}
                      className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 text-blue-800 p-2.5 rounded-lg border border-blue-100">
                            <Globe className="w-5 h-5" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-950 font-sans tracking-tight">{ind.title}</h2>
                        </div>
                        <p className="text-slate-650 text-sm leading-relaxed">
                          {ind.desc}
                        </p>
                        
                        <div className="pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Primary Scientific Deliverables:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {ind.points.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border">
                                <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </motion.div>
            )}

            {/* INSIGHTS VIEW - Whitepapers removed */}
            {currentTab === "insights" && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
              >
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Climate Insights</span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.insights.title}</h1>
                  <p className="text-slate-650 text-sm">{t.insights.subtitle}</p>
                </div>

                <AnimatePresence mode="wait">
                  {activeArticle ? (
                    <motion.article
                      key="article-reader"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 max-w-4xl mx-auto"
                    >
                      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
                        <button 
                          onClick={() => setActiveArticle(null)}
                          className="text-xs font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider pr-4 border-r border-slate-200 cursor-pointer"
                        >
                          {t.common.backToInsights}
                        </button>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-150 px-2 py-0.5 rounded">
                          {language === "fr" ? activeArticle.categoryFr : activeArticle.category}
                        </span>
                        <span className="text-xs text-slate-450">{activeArticle.date}</span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 font-sans tracking-tight leading-tight">
                        {language === "fr" ? activeArticle.titleFr : activeArticle.title}
                      </h2>

                      <div className="space-y-4 text-slate-700 text-sm leading-relaxed max-w-3xl">
                        {(language === "fr" ? activeArticle.contentFr : activeArticle.content).map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-sans">
                        <span>{t.common.author}</span>
                        <span className="font-mono">{language === "fr" ? activeArticle.readTimeFr : activeArticle.readTime}</span>
                      </div>
                    </motion.article>
                  ) : (
                    <div key="insights-list" className="max-w-4xl mx-auto space-y-6">
                      {insightArticlesData.map((art) => (
                        <div 
                          key={art.id}
                          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3"
                        >
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="font-bold text-blue-800 uppercase tracking-wider font-mono">
                              {language === "fr" ? art.categoryFr : art.category}
                            </span>
                            <span>•</span>
                            <span>{art.date}</span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-950 font-sans tracking-tight">
                            {language === "fr" ? art.titleFr : art.title}
                          </h3>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                            {language === "fr" ? art.summaryFr : art.summary}
                          </p>
                          <div className="pt-2 flex justify-between items-center text-xs">
                            <button
                              onClick={() => setActiveArticle(art)}
                              className="font-bold text-blue-800 hover:text-blue-900 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                            >
                              <span>{t.common.readArticle}</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <span className="text-slate-400 font-mono">{language === "fr" ? art.readTimeFr : art.readTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* PROJECTS VIEW */}
            {currentTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
              >
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Case Studies</span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{language === "fr" ? "Études de Projets & Cas" : "Project Experience & Case Studies"}</h1>
                  <p className="text-slate-650 text-sm">{language === "fr" ? "Démonstration d'analyses de risques climatiques appliquées à l'échelle internationale." : "Demonstrating applied climate risk solutions and modeling methodology across global ecosystems."}</p>
                </div>

                <section className="space-y-16">
                  {caseStudiesData.map((project, idx) => (
                    <div 
                      key={project.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                    >
                      <div className="lg:col-span-8 space-y-5">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {language === "fr" ? project.categoryFr : project.category}
                          </span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-950 font-sans tracking-tight">
                          {language === "fr" ? project.titleFr : project.title}
                        </h2>
                        <p className="text-slate-650 text-sm leading-relaxed font-sans italic border-l-4 border-emerald-500 pl-4 bg-emerald-50/20 py-2 rounded-r-lg">
                          {language === "fr" ? project.summaryFr : project.summary}
                        </p>

                        <div className="space-y-4 pt-2">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Project Overview</h4>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {language === "fr" ? project.overviewFr : project.overview}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Methodology & Framework</h4>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {language === "fr" ? project.methodologyFr : project.methodology}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Operational Outcome</h4>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {language === "fr" ? project.outcomeFr : project.outcome}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 h-full flex flex-col justify-between">
                        <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 font-mono text-[9px] text-slate-400 h-32 flex flex-col justify-between relative overflow-hidden">
                          <div className="flex justify-between items-center text-[8px]">
                            <span>SYS_ID: {project.id}</span>
                            <span className="text-emerald-400">● LIVE</span>
                          </div>
                          
                          <svg viewBox="0 0 100 40" className="w-full h-16 opacity-80 mt-2">
                            {project.id === "case-drought" && (
                              <>
                                <path d="M 0 35 Q 20 15 40 28 T 80 5 T 100 20" fill="none" stroke="#22c55e" strokeWidth="1" />
                                <path d="M 0 30 Q 30 5 60 38 T 100 15" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,1" />
                                <text x="2" y="38" fill="#475569" className="text-[5px]">Soil Moisture Ind</text>
                              </>
                            )}
                            {project.id === "case-insurance" && (
                              <>
                                <rect x="10" y="10" width="15" height="30" fill="#3b82f6" opacity="0.6" />
                                <rect x="40" y="5" width="15" height="35" fill="#ef4444" opacity="0.6" />
                                <rect x="70" y="25" width="15" height="15" fill="#22c55e" opacity="0.6" />
                                <line x1="0" y1="20" x2="100" y2="20" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2,2" />
                                <text x="2" y="38" fill="#475569" className="text-[5px]">PML Exposure Calibration</text>
                              </>
                            )}
                            {project.id === "case-flood" && (
                              <>
                                <path d="M0 40 L30 10 L60 25 L100 5 L100 40 Z" fill="#334155" opacity="0.2" />
                                <path d="M0 40 L30 10 L60 25 L100 5" fill="none" stroke="#f97316" strokeWidth="1" />
                                <line x1="30" y1="10" x2="30" y2="40" stroke="#f97316" strokeWidth="0.5" strokeDasharray="1,1" />
                                <text x="2" y="38" fill="#475569" className="text-[5px]">100-Yr Hydrological Runoff</text>
                              </>
                            )}
                          </svg>

                          <div className="flex justify-between text-[7px] text-slate-500">
                            <span>UNIFIED DATA MODEL</span>
                            <span>CALIBRATION SUCCEEDED</span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <p className="text-[10px] text-slate-500 font-mono">FILE ATTACHMENT: {project.pdfSize}</p>
                          <button
                            onClick={() => handleOpenDownload(
                              language === "fr" ? project.titleFr : project.title, 
                              "case_study"
                            )}
                            className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Download className="w-4 h-4" />
                            <span>{t.common.downloadBrief}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </motion.div>
            )}

            {/* CONTACT VIEW */}
            {currentTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
              >
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">Connect</span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-sans">{t.contact.title}</h1>
                  <p className="text-slate-650 text-sm">{t.contact.subtitle}</p>
                </div>

                <div id="contact-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950 font-sans tracking-tight">{t.contact.formTitle}</h2>
                      <p className="text-slate-500 text-xs mt-1">{t.contact.formSub}</p>
                    </div>

                    {contactSuccess ? (
                      <div className="bg-emerald-950/90 border border-emerald-800 text-slate-100 p-5 rounded-xl text-xs space-y-2 flex flex-col items-center text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 animate-bounce" />
                        <p className="font-bold text-sm">{t.common.success}</p>
                        <p className="leading-relaxed text-slate-300 max-w-md">{contactSuccess}</p>
                        <button
                          onClick={() => setContactSuccess(null)}
                          className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-slate-950 rounded font-bold cursor-pointer transition-all"
                        >
                          Send Another Message
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.name} <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              value={contactForm.name}
                              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                              placeholder="Jean Dupont"
                              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.email} <span className="text-red-500">*</span></label>
                            <input
                              type="email"
                              required
                              value={contactForm.email}
                              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                              placeholder="jean.dupont@company.com"
                              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.company}</label>
                            <input
                              type="text"
                              value={contactForm.company}
                              onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                              placeholder="AgriCorp France"
                              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.country}</label>
                            <input
                              type="text"
                              value={contactForm.country}
                              onChange={(e) => setContactForm({ ...contactForm, country: e.target.value })}
                              placeholder="France"
                              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.phone}</label>
                            <input
                              type="text"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                              placeholder="+33 1 23 45 67 89"
                              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.service} <span className="text-red-500">*</span></label>
                            <select
                              value={contactForm.service}
                              onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800 bg-white"
                            >
                              <option disabled value="Select a service...">{t.contact.serviceOpts.select}</option>
                              <option value="Agriculture">{t.contact.serviceOpts.agri}</option>
                              <option value="Catastrophe Risk">{t.contact.serviceOpts.risk}</option>
                              <option value="Consulting">{t.contact.serviceOpts.consulting}</option>
                              <option value="General Inquiry">{t.contact.serviceOpts.other}</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">{t.contact.message} <span className="text-red-500">*</span></label>
                          <textarea
                            required
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            rows={4}
                            placeholder="Describe your climate risk assessment needs..."
                            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={contactSubmitting}
                          className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            contactSubmitting
                              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                              : "bg-blue-800 text-white hover:bg-blue-900 hover:shadow-sm"
                          }`}
                        >
                          {contactSubmitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>{t.contact.submitting}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>{t.contact.submit}</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-50 text-blue-800 p-2 rounded-lg border border-blue-100">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-950 font-sans tracking-tight">{t.contact.officeTitle}</h3>
                      </div>
                      <p className="text-xs text-slate-650 font-sans leading-relaxed">
                        {t.contact.officeSub}
                      </p>
                      <div className="text-xs font-medium space-y-1.5 pt-2 text-slate-750">
                        <p className="font-mono text-[11px] text-slate-600">{t.contact.officeAddr}</p>
                        <p className="text-slate-500">{t.contact.officeHours}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">{t.contact.emailsTitle}</h3>
                      <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500 font-semibold">General Support:</span>
                          <a href="mailto:info@techville.eu" className="font-mono text-blue-850 hover:underline">info@techville.eu</a>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500 font-semibold">Business Dev:</span>
                          <a href="mailto:business@techville.eu" className="font-mono text-blue-850 hover:underline">business@techville.eu</a>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500 font-semibold">Active Projects:</span>
                          <a href="mailto:projects@techville.eu" className="font-mono text-blue-850 hover:underline">projects@techville.eu</a>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500 font-semibold">Partnerships:</span>
                          <a href="mailto:partnerships@techville.eu" className="font-mono text-blue-850 hover:underline">partnerships@techville.eu</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 relative shadow-inner overflow-hidden">
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono tracking-wider font-semibold">
                    TECHVILLE PROJECT TOUCHPOINTS INDEX MAP
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
                    <div className="lg:col-span-7 flex justify-center items-center">
                      <svg viewBox="0 0 800 400" className="w-full opacity-85 max-h-[280px]" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" fill="none">
                          <line x1="0" y1="100" x2="800" y2="100" />
                          <line x1="0" y1="200" x2="800" y2="200" />
                          <line x1="0" y1="300" x2="800" y2="300" />
                          <line x1="200" y1="0" x2="200" y2="400" />
                          <line x1="400" y1="0" x2="400" y2="400" />
                          <line x1="600" y1="0" x2="600" y2="400" />
                        </g>

                        <g fill="#1e293b" stroke="#334155" strokeWidth="1.5">
                          <path d="M 50 120 Q 80 90 150 80 T 250 70 T 320 110 T 350 170 T 300 200 T 200 180 Z" />
                          <path d="M 120 190 Q 200 200 250 240 T 240 350 T 280 440 T 240 450 T 160 350 T 110 270 Z" />
                          <path d="M 280 170 Q 340 180 380 200 T 390 260 T 330 250 Z" />
                          <path d="M 350 120 Q 550 90 700 100 T 850 150 T 800 290 T 650 320 T 450 270 Z" />
                        </g>

                        {[
                          { id: "hq", name: "France HQ", x: 140, y: 100, color: "#3b82f6" },
                          { id: "vietnam", name: "Vietnam Rail Project", x: 530, y: 220, color: "#f97316" },
                          { id: "kenya", name: "Kenya Drought Index", x: 230, y: 260, color: "#10b981" },
                          { id: "belgium", name: "Belgium Coastline", x: 155, y: 88, color: "#a855f7" }
                        ].map((marker) => {
                          const isPointSelected = selectedMapPoint === marker.id;
                          return (
                            <g key={marker.id} className="cursor-pointer" onClick={() => setSelectedMapPoint(marker.id)}>
                              {isPointSelected && (
                                <circle cx={marker.x} cy={marker.y} r="16" fill="none" stroke={marker.color} strokeWidth="1" className="animate-ping opacity-45" />
                              )}
                              <circle cx={marker.x} cy={marker.y} r={isPointSelected ? "8" : "5"} fill={marker.color} className="transition-all duration-300" />
                              <text x={marker.x} y={marker.y - 12} fill="#e2e8f0" textAnchor="middle" className="text-[8px] font-mono font-bold tracking-tight bg-slate-950/80 px-1 rounded">
                                {marker.name}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[220px]">
                      <AnimatePresence mode="wait">
                        {selectedMapPoint === "hq" && (
                          <motion.div key="hq" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                            <span className="text-[9px] font-bold font-mono text-blue-400 uppercase tracking-wider bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-900">Headquarters</span>
                            <h4 className="text-sm font-bold font-sans text-slate-100">Paris Operations Center</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              Our primary research operations, super-computing arrays, downscaling servers, and administrative offices are located in the heart of Paris, France. Coordinates for data ingestion are managed on site.
                            </p>
                          </motion.div>
                        )}
                        {selectedMapPoint === "vietnam" && (
                          <motion.div key="vietnam" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                            <span className="text-[9px] font-bold font-mono text-orange-400 uppercase tracking-wider bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-900 font-semibold">Active Project</span>
                            <h4 className="text-sm font-bold font-sans text-slate-100">Mekong Delta Rail Corridor</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              Conducting daily flood recurrence simulations, monsoon rainfall downscaling, and drafting coastal resilience design briefs for high-speed rail operators. Saves €140M in estimated life-cycle repair losses.
                            </p>
                          </motion.div>
                        )}
                        {selectedMapPoint === "kenya" && (
                          <motion.div key="kenya" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                            <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-900 font-semibold">Active Project</span>
                            <h4 className="text-sm font-bold font-sans text-slate-100">Rift Valley Agriculture</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              Continuous 10m grid soil moisture indices (SWI) compiled via Sentinel SAR satellite radar. Automatically triggers micro-finance payouts for 250,000 smallholder farmers during severe drought conditions.
                            </p>
                          </motion.div>
                        )}
                        {selectedMapPoint === "belgium" && (
                          <motion.div key="belgium" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                            <span className="text-[9px] font-bold font-mono text-purple-400 uppercase tracking-wider bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-900 font-semibold">Active Project</span>
                            <h4 className="text-sm font-bold font-sans text-slate-100">Flanders Coastal Dunes</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              Modeling extreme storm surge inundation ratios and drafting sandy dune adaptive protection strategies for local commercial property portfolios and polder horticultural regions.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        <Footer setTab={setTab} language={language} />

        <LeadModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          resourceName={selectedResource.name}
          resourceType={selectedResource.type}
          language={language}
        />

      </div>
    );
  }
>>>>>>> 75b8644c422fb7fc04f7a584f81b9fdac5029a46
