import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, MapPin, Briefcase, HelpCircle, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Language } from "../types";
import { translations } from "../translations";

// Custom lightweight Markdown-to-JSX parser to safely and beautifully render Gemini responses without external libraries
function SimpleMarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  
  return (
    <div className="space-y-4 text-slate-800 text-sm leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="text-base font-bold text-slate-900 mt-5 mb-2 font-sans flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-800 rounded-full" />
              {trimmed.replace("### ", "")}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="text-lg font-bold text-slate-950 mt-6 mb-3 border-b border-slate-100 pb-1 font-sans">
              {trimmed.replace("## ", "")}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={idx} className="text-xl font-extrabold text-blue-950 mt-8 mb-4 font-sans">
              {trimmed.replace("# ", "")}
            </h2>
          );
        }

        // Bullet list items
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.substring(2);
          return (
            <ul key={idx} className="list-disc pl-6 space-y-1 my-1">
              <li className="text-slate-700">
                <span dangerouslySetInnerHTML={{ __html: formatBold(content) }} />
              </li>
            </ul>
          );
        }

        // Numbered list items
        if (/^\d+\.\s/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s/, "");
          return (
            <ol key={idx} className="list-decimal pl-6 space-y-1 my-1">
              <li className="text-slate-700">
                <span dangerouslySetInnerHTML={{ __html: formatBold(content) }} />
              </li>
            </ol>
          );
        }

        // Quote blocks
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={idx} className="border-l-4 border-blue-400 bg-slate-50 pl-4 py-2 my-2 text-slate-600 rounded-r-lg font-medium italic">
              {trimmed.replace("> ", "")}
            </blockquote>
          );
        }

        // Empty lines
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-slate-700">
            <span dangerouslySetInnerHTML={{ __html: formatBold(trimmed) }} />
          </p>
        );
      })}
    </div>
  );
}

// Replaces Markdown **text** with HTML <strong>text</strong> safely
function formatBold(str: string): string {
  return str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

const samplePrompts = [
  {
    region: "Bordeaux, France",
    industry: "Agriculture",
    question: "How will projected drought indices affect viticulture in this region by 2040, and what are the best irrigation adaptation steps?",
    questionFr: "Comment l'indice de sécheresse affectera-t-il la viticulture bordelaise d'ici 2040, et quelles sont les meilleures solutions d'irrigation ?"
  },
  {
    region: "Seine Basin, France",
    industry: "Insurance",
    question: "What are the risk factors and probable asset losses for standard logistics structures under severe 100-year flood increases by 2050?",
    questionFr: "Quels sont les facteurs de risques et les pertes d'actifs estimées pour la logistique du bassin de la Seine face aux crues centennales d'ici 2050 ?"
  },
  {
    region: "East Africa Rift Valley",
    industry: "Agriculture",
    question: "Can we design a parametric weather index trigger based on Sentinel soil water index (SWI) to offset maize failure due to late rains?",
    questionFr: "Est-il possible de concevoir un déclencheur d'assurance paramétrique basé sur l'humidité du sol Sentinel (SWI) pour protéger le maïs ?"
  }
];

const loadingSteps = [
  "Inizializing IPCC Scenarios CMIP6 (SSP2-4.5 / SSP5-8.5)...",
  "Downscaling global circulation patterns to regional grids...",
  "Running evaporative water demand and crop coefficients...",
  "Synthesizing historical risk baselines and trendlines...",
  "Formatting expert scientific advisory report..."
];

const loadingStepsFr = [
  "Initialisation des scénarios GIEC CMIP6 (SSP2-4.5 / SSP5-8.5)...",
  "Mise à l'échelle régionale des modèles climatiques mondiaux...",
  "Calcul de l'évapotranspiration et des coefficients de culture...",
  "Synthèse des tendances historiques et projections de risques...",
  "Rédaction du rapport scientifique d'expertise climatique..."
];

interface AIAdvisorProps {
  language: Language;
}

export default function AIAdvisor({ language }: AIAdvisorProps) {
  const [region, setRegion] = useState("");
  const [industry, setIndustry] = useState("Agriculture");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [advisoryReport, setAdvisoryReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  // Rotate loading steps for dynamic climate indicators
  const runLoaderInterval = () => {
    setLoadingStepIdx(0);
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
    return interval;
  };

  const handleApplyShortcut = (prompt: typeof samplePrompts[0]) => {
    setRegion(prompt.region);
    setIndustry(prompt.industry);
    setQuestion(language === "fr" ? prompt.questionFr : prompt.question);
  };

  const handleGenerateAdvisory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region || !industry || !question) return;

    setLoading(true);
    setError(null);
    setAdvisoryReport(null);
    const loaderInterval = runLoaderInterval();

    try {
      const response = await fetch("/api/advisory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          region,
          industry,
          question,
          language
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate advisory from server.");
      }

      setAdvisoryReport(data.response);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred. Please make sure your GEMINI_API_KEY is configured in your Settings secrets.");
    } finally {
      clearInterval(loaderInterval);
      setLoading(false);
    }
  };

  const currentLoadingStep = language === "fr" ? loadingStepsFr[loadingStepIdx] : loadingSteps[loadingStepIdx];

  return (
    <div id="climate-ai-advisor-container" className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm overflow-hidden">
      {/* Advisor Header */}
      <div className="border-b border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-800 p-2 rounded-xl text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-950 font-sans tracking-tight">{t.advisor.title}</h2>
        </div>
        <p className="text-slate-600 text-sm max-w-4xl">{t.advisor.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form panel */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">{t.advisor.formTitle}</h3>
          
          <form onSubmit={handleGenerateAdvisory} className="space-y-4">
            {/* Region field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {t.advisor.region} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder={t.advisor.regionPlaceholder}
                required
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
              />
            </div>

            {/* Sector Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {t.advisor.industry} <span className="text-red-500">*</span>
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 bg-white"
              >
                <option value="Agriculture">{language === "fr" ? "Agriculture" : "Agriculture"}</option>
                <option value="Insurance">{language === "fr" ? "Assurance" : "Insurance"}</option>
                <option value="Energy">{language === "fr" ? "Énergie & Infrastructures" : "Energy & Utilities"}</option>
                <option value="Finance">{language === "fr" ? "Banque & Finance" : "Banking & Finance"}</option>
                <option value="Government">{language === "fr" ? "Secteur Public" : "Government & Policy"}</option>
              </select>
            </div>

            {/* Query / Question textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                {t.advisor.query} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.advisor.queryPlaceholder}
                required
                rows={4}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !region || !question}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                loading || !region || !question
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-blue-800 text-white hover:bg-blue-900 hover:shadow-md cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.common.loading}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.advisor.generate}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Shortcuts / Recommendations */}
          <div className="mt-5 pt-5 border-t border-slate-150">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Scientific Templates</h4>
            <div className="space-y-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyShortcut(p)}
                  className="w-full text-left p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50/50 hover:border-blue-300 transition-all text-slate-700 flex flex-col gap-1 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{p.region}</span>
                    <span className="text-[9px] font-semibold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded uppercase">{p.industry}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {language === "fr" ? p.questionFr : p.question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report / Response panel */}
        <div className="lg:col-span-7 h-full flex flex-col min-h-[460px]">
          <AnimatePresence mode="wait">
            {loading ? (
              /* Beautiful Climate Loader States */
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-slate-950 border border-slate-900 rounded-2xl p-8 flex flex-col justify-center items-center text-center text-slate-200 min-h-[460px]"
              >
                <div className="relative w-20 h-20 mb-6">
                  {/* Outer pulsing ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-pulse" />
                  {/* Central rotating spinner */}
                  <div className="absolute inset-2 rounded-full border-4 border-t-emerald-400 border-r-blue-500 border-b-emerald-400 border-l-blue-500 animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold font-sans tracking-tight mb-2">{t.advisor.generating}</h4>
                <p className="text-sm text-emerald-400 font-mono max-w-sm h-10 transition-all duration-300">
                  {currentLoadingStep}
                </p>
                <p className="text-xs text-slate-500 mt-6 max-w-xs leading-relaxed font-sans border-t border-slate-800 pt-4">
                  Using high-resolution atmospheric projection matrices calibrated to CMIP6 baselines.
                </p>
              </motion.div>
            ) : error ? (
              /* Failure state */
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-red-50 border border-red-200 rounded-2xl p-8 text-center flex flex-col justify-center items-center min-h-[460px]"
              >
                <AlertCircle className="w-12 h-12 text-red-600 mb-4 animate-bounce" />
                <h4 className="text-lg font-bold text-red-950 mb-2">Scientific Generation Halted</h4>
                <p className="text-sm text-red-700 max-w-md mb-6">{error}</p>
                <div className="bg-white p-4 rounded-xl border border-red-200 text-left text-xs text-slate-500 max-w-md">
                  <p className="font-bold text-red-800 mb-1">How to fix this issue:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Open the <strong>Settings</strong> panel of the AI Studio workspace.</li>
                    <li>Ensure you have a valid <strong>GEMINI_API_KEY</strong> environment variable declared.</li>
                    <li>Verify your network connectivity and hit "Generate" again.</li>
                  </ol>
                </div>
              </motion.div>
            ) : advisoryReport ? (
              /* Successfully generated scientific advisory report */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[460px]"
              >
                <div>
                  {/* Report Header */}
                  <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.advisor.resultTitle}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border">
                      GIEC CMIP6 HORIZON 2040-2050
                    </span>
                  </div>

                  {/* Report Body */}
                  <div className="max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                    <SimpleMarkdownRenderer text={advisoryReport} />
                  </div>
                </div>

                {/* Warning disclosure footer */}
                <div className="border-t border-slate-100 pt-4 mt-6 text-[10px] text-slate-400 leading-relaxed font-sans">
                  {t.advisor.warning}
                </div>
              </motion.div>
            ) : (
              /* Empty Placeholder State */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-white border border-slate-200 border-dashed rounded-2xl p-8 text-center flex flex-col justify-center items-center min-h-[460px]"
              >
                <div className="bg-blue-50 p-4 rounded-full border border-blue-100 text-blue-800 mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-2 font-sans">{t.advisor.title}</h4>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                  {t.advisor.emptyState}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-md text-left text-[11px] text-slate-500">
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="font-bold text-slate-900 block mb-1">Interactive IA Core</span>
                    Generates climate downscaling advisory matching specific exposure profiles instantly.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="font-bold text-slate-900 block mb-1">IPCC Frameworks</span>
                    Evaluates thermal indices, drought recurrence and flood elevations scientifically.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
