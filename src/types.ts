export type NavTab = "home" | "about" | "services" | "industries" | "insights" | "projects" | "team" | "contact";

export type Language = "en" | "fr";

export interface ContactFormData {
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  titleFr: string;
  category: string;
  categoryFr: string;
  summary: string;
  summaryFr: string;
  overview: string;
  overviewFr: string;
  methodology: string;
  methodologyFr: string;
  outcome: string;
  outcomeFr: string;
  pdfSize: string;
}

export interface InsightArticle {
  id: string;
  title: string;
  titleFr: string;
  category: string;
  categoryFr: string;
  readTime: string;
  readTimeFr: string;
  date: string;
  summary: string;
  summaryFr: string;
  content: string[];
  contentFr: string[];
}
