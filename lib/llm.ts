import { Example } from "./data";

interface LLMResponse {
  feature: string;
  advantage: string;
  benefit: string;
  emotion: string;
  copy: string;
  social_post: string;
}

export async function generateWithLLM(
  input: string,
  apiKey: string
): Promise<Example & { social_post?: string } | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", 
        messages: [
          {
            role: "system",
            content: `Tu es le Directeur Créatif d'Agence Cible.

TA MISSION :
Tu dois aider un propriétaire (Camping ou Agent Immobilier) à vendre mieux.
Tu dois faire deux choses distinctes :
1. Lui expliquer la valeur business (B2B).
2. Lui rédiger le texte pour ses clients (B2C).

DÉTECTION DE SECTEUR :
- Si l'input concerne le logement (Maison, Garage, Cuisine) -> IMMOBILIER.
- Si l'input concerne les vacances (Plage, Piscine, Mobil-home) -> TOURISME/HPA.

RÈGLES STRICTES POUR L'ÉCHELLE (B2B - Tu parles au PROPRIÉTAIRE) :
- FEATURE : Ce qu'il a (l'input).
- ADVANTAGE : Le problème logistique résolu (ex: "Plus besoin de voiture", "Sécurité totale").
- BENEFIT (Business) : L'argent ou la réputation. (ex: "Justifie un tarif +20%", "Déclencheur de coup de cœur", "Zéro plainte").
- EMOTION : Ce que le PROPRIÉTAIRE ressent (Fierté, Sérénité, Autorité).

RÈGLES STRICTES POUR LA COPY & SOCIAL (B2C - Tu écris pour le CLIENT FINAL) :
- COPY (Titre Site Web) : DOIT ÊTRE SENSORIEL ET ÉMOTIONNEL.
  * INTERDIT : "Premium", "Offre", "Qualité", "Fonctionnalité".
  * OBLIGATOIRE : Parler des sens (vue, ouïe, toucher) ou du souvenir.
  * EXEMPLE TOP : "Oubliez la voiture, la mer est votre jardin."
  * EXEMPLE NUL : "Accès direct pour un séjour premium."
  
- SOCIAL POST : Engageant, chaleureux, fait rêver le vacancier ou l'acheteur.

FORMAT JSON STRICT :
{
  "feature": "...",
  "advantage": "...",
  "benefit": "...",
  "emotion": "...",
  "copy": "...",
  "social_post": "..."
}

Langue : Français impeccable, style "Copywriting moderne".`,
          },
          {
            role: "user",
            content: `Analyse et sublime : "${input}"`,
          },
        ],
        temperature: 0.9, // Iets creatiever gezet voor betere slogans
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) return null;

    const parsed: LLMResponse = JSON.parse(content);

    return {
      keywords: [],
      feature: parsed.feature,
      advantage: parsed.advantage,
      benefit: parsed.benefit,
      emotion: parsed.emotion,
      copy: parsed.copy,
      social_post: parsed.social_post,
    };
  } catch (error) {
    console.error("Error calling LLM:", error);
    return null;
  }
}

// Claude functie laten we voor nu even zoals hij is, of verwijderen als je alleen OpenAI gebruikt.
export async function generateWithClaude(
  input: string,
  apiKey: string
): Promise<Example | null> {
    // ... (bestaande code of leeg laten)
    return null; 
}
