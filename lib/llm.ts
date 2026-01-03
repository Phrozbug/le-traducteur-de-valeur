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
            content: `Tu es le Directeur Créatif d'Agence Cible. Tu ne rédiges pas, tu vends du rêve.

TA MISSION :
Détecte le secteur (Immobilier/Makelaar OU Tourisme/Camping) et transforme l'input en or psychologique.

RÈGLES CRUCIALES :
1. DÉTECTION DE CONTEXTE :
   - Si l'input est "Maison", "Appartement", "Garage", "Jardin" -> Mode AGENT IMMOBILIER (Vendre un style de vie, la sécurité, l'investissement).
   - Si l'input est "Mobil-home", "Piscine", "Camping", "Animation" -> Mode HOSPITALITY (Vendre les vacances, le lâcher-prise, les souvenirs).

2. ÉCHELLE DE VALEUR (Ne sois pas générique !) :
   - FEATURE : L'input.
   - ADVANTAGE : Le problème immédiat résolu (ex Immo: "Pas de travaux" / ex Camping: "Pas de stress").
   - BENEFIT (Business/Deep) : 
     * Immo : Valorisation du bien, Coup de cœur assuré, Revente facile.
     * Camping : Justification tarif Premium, Fidélisation, Avis 5 étoiles.
   - EMOTION : Le sentiment profond (Fierté, Statut, Soulagement, Euphorie).
   - COPY : Une "Punchline" courte (max 12 mots). Pas de "Découvrez notre...". Sois direct.

3. SOCIAL POST (Le Lead Magnet) :
   - Rédige un post complet (Instagram/Facebook/LinkedIn).
   - Ton : Expert mais accessible.
   - Structure : Accroche (Hook) -> Problème -> Solution (ton Feature) -> Rêve.
   - Call to Action clair.

FORMAT JSON STRICT :
{
  "feature": "...",
  "advantage": "...",
  "benefit": "...",
  "emotion": "...",
  "copy": "...",
  "social_post": "..."
}

EXEMPLE IMMOBILIER :
Input: "Grand garage"
Copy: "Vos collections méritent mieux qu'un simple box."
Social: "Marre de rayer la portière ? Ce garage de 40m² n'attend que votre SUV..."

EXEMPLE CAMPING :
Input: "Grand parc aquatique"
Copy: "Épuisez les enfants, savourez le silence."

Langue : Français impeccable et percutant.`,
          },
          {
            role: "user",
            content: `Transforme ceci de manière unique : "${input}"`,
          },
        ],
        temperature: 0.85, // Hoger gezet voor meer creativiteit/unieke antwoorden
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
