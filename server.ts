import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env.local in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // --- ML LOGIC & DATA PIPELINE ---
  
  // Simple Random Forest-like implementation for Emotional Stability
  // In a real scenario, this would be a trained model. 
  // Here we implement the domain logic as a predictive function.
  const predictStability = (sattva: number, rajas: number, tamas: number) => {
    // Normalize inputs (assuming 0-100)
    const s = sattva / 100;
    const r = rajas / 100;
    const t = tamas / 100;

    // Core Logic: 
    // High Sattva increases stability.
    // High Rajas/Tamas increases instability.
    // Stability Score = (Sattva * 1.2) - (Rajas * 0.4) - (Tamas * 0.6)
    // We then scale this to 0-100
    let score = (s * 80) + ( (1-r) * 10) + ( (1-t) * 10);
    
    // Add some "non-linear" interaction noise
    if (r > 0.6 && t > 0.4) score -= 15; // High Rajas + Tamas penalty
    if (s > 0.8) score += 5; // High Sattva bonus
    
    score = Math.max(0, Math.min(100, score));
    
    let category = "Moderate";
    if (score > 75) category = "Stable";
    else if (score < 40) category = "Unstable";
    
    return { score: Math.round(score), category };
  };

  app.post("/api/predict", (req, res) => {
    const { overall } = req.body;
    const { sattva, rajas, tamas } = overall || req.body;
    const result = predictStability(sattva, rajas, tamas);
    res.json(result);
  });

  // --- TEST ENDPOINT TO LIST AVAILABLE MODELS ---
  app.get("/api/test-models", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Try different model names
      const modelsToTry = [
        "gemini-3-flash-preview",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
      ];

      const results = [];
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: "Hi"
          });
          results.push({ model: modelName, status: "success", text: response.text });
        } catch (error: any) {
          results.push({ model: modelName, status: "failed", error: error.message });
        }
      }

      res.json(results);
    } catch (error: any) {
      console.error("Test error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- GEMINI CHAT ENDPOINT ---
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, gunaScores, stabilityResult, isInitial } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const systemInstruction = `
You are an expert in Indian Knowledge Systems (IKS) and Guna Theory.
The user's current Guna scores are: 
Overall - Sattva: ${gunaScores.overall.sattva}, Rajas: ${gunaScores.overall.rajas}, Tamas: ${gunaScores.overall.tamas}.

Category Breakdown (Raw Scores):
Aahara (Diet): Sattva: ${gunaScores.categories.Aahara.sattva}, Rajas: ${gunaScores.categories.Aahara.rajas}, Tamas: ${gunaScores.categories.Aahara.tamas}
Vihara (Lifestyle): Sattva: ${gunaScores.categories.Vihara.sattva}, Rajas: ${gunaScores.categories.Vihara.rajas}, Tamas: ${gunaScores.categories.Vihara.tamas}
Vichara (Thought): Sattva: ${gunaScores.categories.Vichara.sattva}, Rajas: ${gunaScores.categories.Vichara.rajas}, Tamas: ${gunaScores.categories.Vichara.tamas}

Their predicted emotional stability is: ${stabilityResult.score}/100 (${stabilityResult.category}).

**CRITICAL GUIDELINES:**
1. **Keep it Simple:** Use plain language. Avoid overly academic or complex jargon.
2. **Summarize First:** Provide a clear, 2-3 sentence summary of their profile.
3. **Actionable Bullets:** List 3 immediate, simple actions (one for Aahara, Vihara, Vichara).
4. **Clean Formatting:** Use bold text for key terms and bullet points for lists.
5. **Depth on Request:** If the user asks "Why?" or "Tell me more," then provide the deeper philosophical context from Bhagavad Gita/Samkhya.
6. **Empathetic & Grounded:** Maintain a supportive tone.
`;

      let prompt = "";
      if (isInitial) {
        prompt = `${systemInstruction}\n\nPlease provide an initial analysis of my Guna profile and suggest some immediate actions for balance.`;
      } else {
        // Build conversation history
        const chatHistory = messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n\n');
        prompt = `${systemInstruction}\n\nConversation History:\n${chatHistory}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  // --- VITE MIDDLEWARE ---
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
