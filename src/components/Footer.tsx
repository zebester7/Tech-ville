import React, { useState } from "react";
import { Globe, Mail, Linkedin, Twitter, Youtube, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { Language, NavTab } from "../types";
import { translations } from "../translations";

interface FooterProps {
  setTab: (tab: NavTab) => void;
  language: Language;
}

export default function Footer({ setTab, language }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "newsletter"
        })
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail("");
      } else {
        throw new Error("Failed to subscribe.");
      }
    } catch (err) {
      setError(language === "fr" ? "Échec de l'abonnement." : "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-900">
          
          {/* Brand Info & Vision */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-blue-800 p-2 rounded-xl text-white">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight font-sans">TechVille</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {language === "fr" 
                ? "Cabinet d'intelligence et d'analyses des risques climatiques fournissant des solutions scientifiques pour sécuriser l'agriculture, l'assurance, la finance et les infrastructures."
                : "Climate risk intelligence and analytics company providing scientific solutions to safeguard agriculture, insurance, finance, and infrastructure globally."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-500 transition-all cursor-pointer">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {(["home", "about", "services", "industries", "insights", "projects", "contact"] as const).map((tab) => (
                <li key={tab}>
                  <button 
                    onClick={() => { setTab(tab); window.scrollTo(0, 0); }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t.nav[tab === "projects" ? "projects" : tab]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Directory */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">{t.contact.emailsTitle}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">General Inquiries</span>
                <a href="mailto:info@techville.eu" className="hover:text-white transition-colors font-mono font-medium">info@techville.eu</a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Business Development</span>
                <a href="mailto:business@techville.eu" className="hover:text-white transition-colors font-mono font-medium">business@techville.eu</a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Project Delivery</span>
                <a href="mailto:projects@techville.eu" className="hover:text-white transition-colors font-mono font-medium">projects@techville.eu</a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Partnerships</span>
                <a href="mailto:partnerships@techville.eu" className="hover:text-white transition-colors font-mono font-medium">partnerships@techville.eu</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">{t.insights.newsletterTitle}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.insights.newsletterSub}
            </p>
            
            {subscribed ? (
              <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-900/60 text-emerald-400 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.common.subscribed}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.common.emailPlaceholder}
                    className="w-full text-xs bg-slate-900 text-slate-200 border border-slate-800 rounded-lg py-2.5 pl-3.5 pr-10 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800"
                  />
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 rounded bg-blue-800 hover:bg-blue-900 text-white transition-colors cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {error && <p className="text-[10px] text-red-500">{error}</p>}
              </form>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>GDPR compliant cookie & subscription tracking.</span>
            </div>
          </div>

        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TechVille. All Rights Reserved. France Head Office.</p>
          <div className="flex items-center gap-5">
            <button className="hover:text-slate-300 transition-colors">Privacy Policy</button>
            <button className="hover:text-slate-300 transition-colors">Terms & Conditions</button>
            <button className="hover:text-slate-300 transition-colors">Cookie Policy</button>
            <button className="hover:text-slate-300 transition-colors">GDPR Notice</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
