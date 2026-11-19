<<<<<<< HEAD
export type NavTab = "home" | "about" | "services" | "industries" | "insights" | "projects" | "team" | "contact";

export type Language = "en" | "fr";

=======
export type Language = "en" | "fr";

export type NavTab = "home" | "about" | "services" | "industries" | "insights" | "projects" | "contact" | "advisor" | "dashboard";

>>>>>>> 75b8644c422fb7fc04f7a584f81b9fdac5029a46
export interface ContactFormData {
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

<<<<<<< HEAD
=======
export interface ClimateHazardPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  hazardType: "drought" | "flood" | "heatwave" | "sea_level";
  riskLevel: "low" | "medium" | "high" | "extreme";
  cropImpact?: string;
  cropImpactFr?: string;
  insuranceImpact?: string;
  insuranceImpactFr?: string;
  adaptationStrategy?: string;
  adaptationStrategyFr?: string;
  currentIndex: number;
  projected2030: number;
  projected2050: number;
}

>>>>>>> 75b8644c422fb7fc04f7a584f81b9fdac5029a46
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
