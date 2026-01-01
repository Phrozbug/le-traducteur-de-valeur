import { Example } from "./data";

interface LLMResponse {
  feature: string;
  advantage: string;
  benefit: string;
  emotion: string;
  copy: string;
  social_post: string; // De nieuwe "Lead Magnet" output
}

/**
 * Generate a value ladder using OpenAI API
 * OPTIMIZED PROMPT FOR HIGH-CONVERSION HOSPITALITY COPY + SOCIAL POST
 */
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
        model: "gpt-4o", // Gebruik gpt-4o voor maximale kwaliteit
        messages: [
          {
            role: "system",
            content: `Tu es le Directeur Stratégique d'Agence Cible, expert en marketing pour campings et hôtels.

TA MISSION:
1. Analyser la fonctionnalité (Feature) donnée.
2. Construire une "Échelle de Valeur" stricte (Feature -> Avantage -> Bénéfice -> Émotion).
3. Rédiger un POST SOCIAL MÉDIA prêt à publier (c'est le "bonus" pour l'utilisateur).

RÈGLES POUR L'ÉCHELLE DE VALEUR :
- ADVANTAGE : Le problème immédiat résolu (ex: "Plus de réveils en sueur").
- BENEFIT : La valeur business/financière (ex: "Justifie un tarif Premium", "Réduit les plaintes").
- EMOTION : Le sentiment profond du client ou du propriétaire (ex: "Sérénité", "Fierté").
- COPY : Une phrase courte et percutante pour le site web (max 10 mots).

RÈGLES POUR LE POST SOCIAL (Le "Lead Magnet") :
- Rédige une légende pour Instagram/Facebook.
- Ton : Accueillant, Premium, qui fait rêver.
- Inclus 3-4 emojis pertinents.
- Inclus un Call to Action clair à la fin (ex: "Réservez votre séjour...").
- Ne mets pas de hashtags excessifs, reste élégant.

FORMAT JSON STRICT :
{
  "feature": "...",
  "advantage": "...",
  "benefit": "...",
  "emotion": "...",
  "copy": "...",
  "social_post": "..."
}

Langue de sortie : Français impeccable.`,
          },
          {
            role: "user",
            content: `Transforme cette fonctionnalité en or : "${input}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) return null;

    const parsed: LLMResponse = JSON.parse(content);

    return {
      keywords: [], // LLM heeft geen keywords nodig
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
