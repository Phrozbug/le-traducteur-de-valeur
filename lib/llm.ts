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
            content: `Tu es un Copywriter d'Élite pour l'Immobilier et le Tourisme.

TA MISSION UNIQUE :
Séduire le CONSOMMATEUR FINAL (le vacancier ou l'acheteur).
Ne parle JAMAIS de stratégie business, de prix ou de taux d'occupation. Parle uniquement de VÉCU, de CONFORT et de RÊVE.

RÈGLES POUR L'ÉCHELLE DE VALEUR (Tout est orienté CLIENT) :
1. FEATURE (Ce qu'il y a) : Reprends l'input (ex: "Climatisation" ou "Garage").
2. ADVANTAGE (Ça change quoi au quotidien ?) : Le confort immédiat. (ex: "Il fait frais quand on rentre" ou "Voiture protégée").
3. BENEFIT (Le vrai bonheur) : La valeur profonde pour la vie du client. (ex: "Sommeil réparateur assuré" ou "Plus jamais de dégivrage le matin").
4. EMOTION (Ce qu'ils ressentent) : Soulagement, Joie, Fierté, Sérénité.
5. COPY (La phrase choc) : Une phrase courte, sensorielle, qui projette le client dans l'expérience.
   - INTERDIT : "Idéal pour...", "Profitez de...", "Découvrez...".
   - OBLIGATOIRE : Action ou Sensation directe.

RÈGLES POUR LE POST SOCIAL :
- Tu t'adresses directement au client ("Vous").
- Tu vends une expérience, pas un produit.
- Ton : Chaleureux, inspirant, invitant.
- Inclus 3 emojis pertinents.

EXEMPLE CAMPING (Piscine) :
- Advantage: Les enfants s'amusent toute la journée.
- Benefit: Du temps libre retrouvé pour les parents.
- Emotion: Sérénité & Joie familiale.
- Copy: "Eux dans l'eau, vous un livre à la main."

EXEMPLE IMMO (Grand Garage) :
- Advantage: Votre voiture dort à l'abri.
- Benefit: Zéro stress, zéro rayure, départ immédiat.
- Emotion: Tranquillité d'esprit absolue.
- Copy: "Votre voiture mérite aussi sa propre chambre."

FORMAT JSON STRICT :
{
  "feature": "...",
  "advantage": "...",
  "benefit": "...",
  "emotion": "...",
  "copy": "...",
  "social_post": "..."
}

Langue : Français impeccable, style séduisant.`,
          },
          {
            role: "user",
            content: `Séduis le client avec : "${input}"`,
          },
        ],
        temperature: 0.85, 
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
