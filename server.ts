import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// In-memory data store for lead management (Contact forms, consultations, newsletters)
interface Lead {
  id: string;
  type: "contact" | "consultation" | "newsletter" | "download";
  name?: string;
  email: string;
  company?: string;
  country?: string;
  phone?: string;
  service?: string;
  resourceName?: string;
  message?: string;
  timestamp: string;
}

const leads: Lead[] = [];

// Initialize Gemini SDK lazily if key exists
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your Secrets settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route: Climate Risk AI Advisory Assistant
  app.post("/api/advisory", async (req, res) => {
    try {
      const { region, industry, question, language = "en" } = req.body;
      
      if (!region || !industry || !question) {
        return res.status(400).json({ error: "Missing required fields: region, industry, question" });
      }

      const ai = getGeminiClient();
      
      const systemPrompt = language === "fr" 
        ? "Vous êtes un scientifique principal des risques climatiques chez TechVille, cabinet d'intelligence sur les risques climatiques de premier plan en France. Répondez avec autorité scientifique, clarté technique, et pragmatisme professionnel. Utilisez un langage sophistiqué mais accessible. Structurez votre réponse avec des sections claires (Analyse de Risque, Recommandations Stratégiques, Prochaines Étapes)."
        : "You are a Senior Climate Risk Scientist at TechVille, a leading global climate risk intelligence firm based in France. Provide a response with scientific authority, technical precision, and practical business relevance. Use professional, clean styling. Structure your response with clear sections (Risk Assessment, Strategic Recommendations, Actionable Next Steps).";

      const userPrompt = language === "fr"
        ? `Évaluez le risque climatique suivant pour le secteur "${industry}" dans la région "${region}".
           Question de l'utilisateur : "${question}"
           
           Fournissez une analyse détaillée comprenant les impacts potentiels, les indicateurs clés (comme l'indice de sécheresse, l'exposition aux inondations ou le stress thermique) et des stratégies d'adaptation robustes.`
        : `Evaluate the following climate risk for the "${industry}" sector in the "${region}" region.
           User Query: "${question}"
           
           Provide a high-resolution analytics overview including prospective hazard exposure, vulnerability indices (e.g., drought, precipitation extremes, heat strain), and robust climate adaptation solutions.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const text = response.text || (language === "fr" ? "Erreur de génération du contenu." : "Unable to generate advisory at this moment.");
      res.json({ response: text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: error.message || "An error occurred while generating your climate risk assessment. Please check your Gemini API configuration." 
      });
    }
  });

  // API Route: Qualified consultation and contact submissions
  app.post("/api/contact", (req, res) => {
    try {
      const { name, company, country, email, phone, service, message, type = "contact" } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const newLead: Lead = {
        id: Math.random().toString(36).substring(2, 9),
        type: type === "consultation" ? "consultation" : "contact",
        name,
        email,
        company,
        country,
        phone,
        service,
        message,
        timestamp: new Date().toISOString(),
      };

      leads.push(newLead);
      console.log(`[TechVille Lead Generated] Type: ${type}, Email: ${email}, Company: ${company}`);

      res.status(201).json({
        success: true,
        message: "Thank you. Your request has been successfully recorded. A TechVille climate scientist will contact you shortly.",
        lead: newLead
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to submit request" });
    }
  });

  // API Route: Resource downloads and newsletters (Lead magnet)
  app.post("/api/leads", (req, res) => {
    try {
      const { email, type, resourceName } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const newLead: Lead = {
        id: Math.random().toString(36).substring(2, 9),
        type: type || "newsletter",
        email,
        resourceName,
        timestamp: new Date().toISOString(),
      };

      leads.push(newLead);
      console.log(`[TechVille Subscription] Type: ${type}, Email: ${email}, Resource: ${resourceName || "None"}`);

      res.status(201).json({
        success: true,
        message: type === "download" 
          ? `Access granted! Your download link for "${resourceName}" has been simulated and activated.` 
          : "Subscription confirmed. Welcome to TechVille Climate Insights.",
        lead: newLead
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // Serve static assets & build files or delegate to Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TechVille Full-Stack Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
