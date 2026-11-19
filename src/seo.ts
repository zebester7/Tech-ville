import type { Language, NavTab } from "./types";
import { pathForTab } from "./routes";

// Set VITE_SITE_URL at build time (e.g. in .env) to the production origin.
export const SITE_URL: string = (
  (import.meta.env?.VITE_SITE_URL as string | undefined) || "https://techville.eu"
).replace(/\/+$/, "");

export const SITE_NAME = "TechVille";

interface PageMeta {
  title: string;
  description: string;
  breadcrumb: string;
}

export const PAGE_META: Record<NavTab, PageMeta> = {
  home: {
    title: "TechVille | Climate Risk Intelligence for Agriculture & Insurance",
    description:
      "France-based climate risk intelligence for agriculture, insurance and business: drought monitoring, catastrophe analytics and weather station deployment.",
    breadcrumb: "Home",
  },
  about: {
    title: "About Us | TechVille Climate Intelligence",
    description:
      "TechVille is a France-based climate analytics company turning climate science into risk intelligence for businesses, insurers and governments worldwide.",
    breadcrumb: "About Us",
  },
  services: {
    title: "Climate Risk Services | TechVille",
    description:
      "Climate services for agriculture, flood, drought and heatwave risk analytics, catastrophe modelling (AAL/PML) and automatic weather station deployment.",
    breadcrumb: "Services",
  },
  industries: {
    title: "Industries We Serve | TechVille Climate Intelligence",
    description:
      "Climate risk intelligence for agriculture, insurance and reinsurance, energy and utilities, and the public sector, tailored to each sector's exposure.",
    breadcrumb: "Industries",
  },
  insights: {
    title: "Climate Insights & Whitepapers | TechVille",
    description:
      "Articles and whitepapers from TechVille on catastrophe risk modelling, drought and climate adaptation for agriculture and insurance.",
    breadcrumb: "Insights",
  },
  projects: {
    title: "Projects & Case Studies | TechVille Climate Intelligence",
    description:
      "Case studies from TechVille climate risk projects: methodology, data and outcomes across agriculture, insurance and climate adaptation.",
    breadcrumb: "Projects",
  },
  team: {
    title: "Our Team | TechVille Climate Intelligence",
    description:
      "Meet the TechVille team of climate scientists, agronomists, hydrologists and geospatial engineers behind our climate risk analytics.",
    breadcrumb: "Team",
  },
  contact: {
    title: "Contact Us | TechVille Climate Intelligence",
    description:
      "Request a climate risk consultation from TechVille's Paris office. Our analytics team replies to inquiries within 24 hours.",
    breadcrumb: "Contact",
  },
};

export const NOT_FOUND_META = {
  title: "Page Not Found | TechVille",
  description: "The page you were looking for does not exist.",
};

// FAQ content is shown on the Contact page and mirrored in FAQPage schema.
// Answers only restate facts already published elsewhere on the site.
export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: Record<Language, FaqItem[]> = {
  en: [
    {
      q: "What services does TechVille provide?",
      a: "Three service lines: climate services for agriculture (drought monitoring, seasonal forecasting, irrigation optimization and early warning systems); climate risk and catastrophe analytics (flood, drought, heatwave and extreme weather risk, plus AAL and PML modelling); and weather equipment deployment (automatic weather stations, IoT sensor networks, calibration and maintenance).",
    },
    {
      q: "Which industries do you work with?",
      a: "Agriculture and agribusiness, insurance and reinsurance, energy and utilities, and government and the public sector.",
    },
    {
      q: "Where is TechVille based, and do you work internationally?",
      a: "Our headquarters is at 15 Rue de l'Ancienne Comédie, 75006 Paris, France. We deliver projects across Europe, Africa, the Middle East and Asia.",
    },
    {
      q: "How quickly will you respond to my inquiry?",
      a: "Send the consultation form on this page and our senior analytics team will contact you within 24 hours. Office hours are Monday to Friday, 9:00 AM to 6:00 PM (CET).",
    },
  ],
  fr: [
    {
      q: "Quels services propose TechVille ?",
      a: "Trois domaines : services climatiques pour l'agriculture (suivi de la sécheresse, prévisions saisonnières, optimisation de l'irrigation et systèmes d'alerte précoce) ; analyse des risques climatiques et catastrophes (inondation, sécheresse, canicule et événements extrêmes, modélisation AAL et PML) ; et déploiement d'équipements météorologiques (stations météo automatiques, réseaux de capteurs IoT, étalonnage et maintenance).",
    },
    {
      q: "Avec quels secteurs travaillez-vous ?",
      a: "Agriculture et agro-industrie, assurance et réassurance, énergie et services publics, ainsi que les administrations et le secteur public.",
    },
    {
      q: "Où est basé TechVille et intervenez-vous à l'international ?",
      a: "Notre siège est situé au 15 Rue de l'Ancienne Comédie, 75006 Paris, France. Nous menons des projets en Europe, en Afrique, au Moyen-Orient et en Asie.",
    },
    {
      q: "Sous quel délai répondez-vous à une demande ?",
      a: "Envoyez le formulaire de consultation sur cette page : notre équipe d'analystes vous contactera sous 24 heures. Nos bureaux sont ouverts du lundi au vendredi, de 9h00 à 18h00 (CET).",
    },
  ],
};

export function canonicalFor(tab: NavTab): string {
  return SITE_URL + (tab === "home" ? "/" : pathForTab(tab));
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// JSON inside <script> must not be able to close the tag.
function jsonLd(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

export function structuredDataFor(tab: NavTab): object[] {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    email: "info@techville.eu",
    address: {
      "@type": "PostalAddress",
      streetAddress: "15 Rue de l'Ancienne Comédie",
      postalCode: "75006",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
  };

  if (tab === "home") {
    return [
      org,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ];
  }

  const data: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: PAGE_META.home.breadcrumb, item: canonicalFor("home") },
        { "@type": "ListItem", position: 2, name: PAGE_META[tab].breadcrumb, item: canonicalFor(tab) },
      ],
    },
  ];

  if (tab === "contact") {
    data.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.en.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return data;
}

/** Full <head> fragment for a prerendered page. `tab === null` renders the 404 head. */
export function headFor(tab: NavTab | null): string {
  if (!tab) {
    return [
      `<title>${escapeHtml(NOT_FOUND_META.title)}</title>`,
      `<meta name="description" content="${escapeHtml(NOT_FOUND_META.description)}" />`,
      `<meta name="robots" content="noindex" />`,
    ].join("\n    ");
  }
  const meta = PAGE_META[tab];
  const url = canonicalFor(tab);
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/icon-512.png" />`,
    `<meta name="twitter:card" content="summary" />`,
    ...structuredDataFor(tab).map(jsonLd),
  ].join("\n    ");
}

/** Keeps title/description/canonical in sync during client-side navigation. */
export function applyHeadInBrowser(tab: NavTab | null): void {
  const meta = tab ? PAGE_META[tab] : NOT_FOUND_META;
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  let canonical = document.querySelector('link[rel="canonical"]');
  if (tab) {
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalFor(tab));
  }
}
