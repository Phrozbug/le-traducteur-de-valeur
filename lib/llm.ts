// Update Agency Grade Logic - Force Push
import { Example } from "./data";
// ... de rest van de code ...
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
        model: "gpt-4o", // We gebruiken het slimste model
        messages: [
          {
            role: "system",
            content: `Tu es le Directeur de Création d'une agence de publicité de luxe.
Ta spécialité : Le "Neuro-Copywriting" pour l'Hôtellerie de Plein Air (Camping) et l'Immobilier de Prestige.

TA MISSION :
Transformer une fonctionnalité banale en une scène de film qui déclenche de la dopamine chez le client.

RÈGLES D'OR (VARIABLES DE QUALITÉ) :
1. "SHOW, DON'T TELL" : Ne dis pas "C'est confortable". Décris la sensation du matelas ou la fraîcheur de l'air.
2. INTERDIT (BLACKLIST) : N'utilise JAMAIS les mots faibles : "Premium", "Qualité", "Idéal", "Grand", "Beau", "Unique", "Inoubliable". Ces mots sont pour les amateurs.
3. CIBLE : Tu parles au CŒUR du client (le parent fatigué qui veut la paix, ou l'acheteur qui veut impressionner ses amis).

ANALYSE DU CONTEXTE (VARIABLES DYNAMIQUES) :
- Si l'input est "Piscine/Plage/Nature" -> Active l'archétype "L'EXPLORATEUR". Ton : Vibrant, Ensoleillé, Libérateur.
- Si l'input est "Garage/Sécurité/Isolation" -> Active l'archétype "LE PROTECTEUR". Ton : Rassurant, Solide, Serein.
- Si l'input est "Vue mer/Suite/Terrasse" -> Active l'archétype "LE HÉDONISTE". Ton : Exclusif, Sensoriel, Épicurien.

STRUCTURE DE LA RÉPONSE (ÉCHELLE DE VALEUR) :
1. FEATURE : L'input utilisateur (le fait brut).
2. ADVANTAGE : La conséquence immédiate et pratique. (Pas de jargon).
3. BENEFIT : La valeur ultime pour la vie du client (Le temps gagné, le stress perdu, l'ego flatté).
4. EMOTION : Le sentiment exact ressenti (ex: "Lâcher-prise total", "Fierté silencieuse").
5. COPY (HEADLINE) : Une phrase de 8 mots max. Doit être une image mentale forte. Pas de point d'exclamation !
6. SOCIAL POST : Un petit storytelling (3-4 lignes). Commence par une question ou une situation vécue. Finis par un appel à l'émotion.

EXEMPLE (Input: "Grand garage") :
- Advantage: "Votre voiture est protégée des intempéries et des regards."
- Benefit: "Vous dormez sur vos deux oreilles, votre investissement est en sécurité."
- Emotion: "Sérénité absolue."
- Copy: "Votre voiture mérite aussi sa propre chambre."
- Social: "Vous détestez gratter le pare-brise en hiver ? ❄️ Imaginez partir chaque matin sans manteau, directement depuis votre salon. Ce garage de 40m² n'est pas un luxe, c'est votre confort quotidien. Venez visiter."

EXEMPLE (Input: "Camping bord de mer") :
- Advantage: "La plage est accessible sans traverser de route."
- Benefit: "Une liberté totale pour vos enfants, la tranquillité pour vous."
- Emotion: "Liberté pure."
- Copy: "Le petit-déjeuner, les pieds dans le sable."
- Social: "Combien de temps perdez-vous à charger la voiture pour aller à la plage ? 🚗 Ici, la réponse est : zéro. Ouvrez la porte, marchez 50 mètres, plongez. C'est ça, les vraies vacances. Qui vient avec vous ?"

FORMAT JSON STRICT :
{
  "feature": "...",
  "advantage": "...",
  "benefit": "...",
  "emotion": "...",
  "copy": "...",
  "social_post": "..."
}

Langue : Français sophistiqué, fluide et percutant.`,
          },
          {
            role: "user",
            content: `Fais-moi rêver avec cet élément : "${input}"`,
          },
        ],
        temperature: 1.0, // Maximale creativiteit
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
