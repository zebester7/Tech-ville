import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, ShieldCheck, Mail, User, Building2, Globe, FileText, CheckCircle2 } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceName: string;
  resourceType: "profile" | "case_study" | "whitepaper";
  language: Language;
}

export default function LeadModal({ isOpen, onClose, resourceName, resourceType, language }: LeadModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const t = translations[language];

  // Reset state when modal is closed/opened
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setName("");
      setCompany("");
      setCountry("");
      setSubmitted(false);
      setLoading(false);
      setDownloadProgress(0);
      setDownloadComplete(false);
    }
  }, [isOpen]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setLoading(true);

    try {
      // Call backend to log lead details
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          company,
          country,
          type: "download",
          resourceName
        })
      });

      if (response.ok) {
        setSubmitted(true);
        // Start simulated high-fidelity download animation
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setDownloadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setDownloadComplete(true);
            setTimeout(() => {
              onClose();
            }, 2500);
          }
        }, 80);
      }
    } catch (err) {
      console.error("Failed to submit lead:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="lead-generation-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg relative overflow-hidden z-10 p-6 flex flex-col justify-between"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              id="close-lead-modal-btn"
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal content */}
            {!submitted ? (
              <div>
                {/* Header icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-blue-800">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                      {resourceType === "profile" && "Corporate Brief"}
                      {resourceType === "case_study" && "Case Study Brief"}
                      {resourceType === "whitepaper" && "Scientific Whitepaper"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight pr-6">{resourceName}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  {t.insights.downloadCTA} {language === "fr" ? "Vos informations resteront confidentielles et conformes au RGPD." : "Your details will remain secure under TechVille's strict GDPR policy."}
                </p>

                {/* Lead Form */}
                <form onSubmit={handleSubmitLead} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {t.contact.name} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {t.contact.email} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jean.dupont@company.com"
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {t.contact.company}
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="TechVille Corp"
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {t.contact.country}
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="France"
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-800"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !email || !name}
                    className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 mt-2 cursor-pointer transition-all ${
                      loading || !email || !name
                        ? "bg-slate-100 text-slate-400 border cursor-not-allowed"
                        : "bg-blue-800 hover:bg-blue-900 text-white hover:shadow-sm"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === "fr" ? "Débloquer le Téléchargement" : "Access Download"}</span>
                  </button>
                </form>

                {/* Privacy compliance notice */}
                <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GDPR Compliant. One-click unsubscribe from future insights.</span>
                </div>
              </div>
            ) : (
              /* High-fidelity download animation state */
              <div className="py-6 text-center flex flex-col items-center justify-center">
                {!downloadComplete ? (
                  <>
                    <div className="relative w-16 h-16 mb-5">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-blue-800 animate-spin" />
                      <Download className="absolute inset-0 m-auto w-5 h-5 text-blue-800 animate-bounce" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{t.common.downloading}</h3>
                    <p className="text-xs text-slate-500 font-mono mb-4">{downloadProgress}% completed</p>
                    {/* Simulated Loading Bar */}
                    <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden border">
                      <div className="bg-blue-800 h-full rounded-full transition-all duration-75" style={{ width: `${downloadProgress}%` }} />
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="bg-emerald-50 p-3 rounded-full border border-emerald-100 text-emerald-600 mb-4 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-950 mb-1">{t.common.success}</h3>
                    <p className="text-xs text-slate-600 mb-2 max-w-xs">{t.common.downloadSuccess}</p>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      techville_secure_transfer_actived.zip
                    </span>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
