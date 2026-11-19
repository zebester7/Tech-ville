import type { Language } from "../types";
import { FAQS } from "../seo";

// Rendered visibly on the Contact page; the same entries feed the FAQPage schema in seo.ts.
export default function FAQ({ language }: { language: Language }) {
  return (
    <section aria-labelledby="faq-heading" className="space-y-6">
      <h2 id="faq-heading" className="text-2xl font-bold text-slate-950 font-sans tracking-tight text-center">
        {language === "fr" ? "Questions fréquentes" : "Frequently Asked Questions"}
      </h2>
      <div className="max-w-3xl mx-auto divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {FAQS[language].map((item) => (
          <details key={item.q} className="group p-5">
            <summary className="cursor-pointer list-none flex justify-between items-center gap-4 font-bold text-slate-950 text-sm">
              <h3>{item.q}</h3>
              <span aria-hidden="true" className="text-blue-800 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
            </summary>
            <p className="pt-3 text-sm text-slate-600 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
