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
            content: `Tu es le Directeur Stratégique d'Agence Cible, expert en copywriting et marketing pour :
- Campings et hôtels (hospitality)
- Agences immobilières et promoteurs (real estate)
- Activités outdoor et tourisme

TA MISSION : Créer une "Échelle de Valeur" UNIQUE et PERCUTANTE qui transforme une fonctionnalité banale en argument de vente irrésistible.

RÈGLES STRICTES POUR L'ÉCHELLE DE VALEUR :

1. FEATURE (La Fonctionnalité) :
   - Reformule de manière élégante et professionnelle
   - Évite les termes techniques froids
   - Exemple : "Piscine chauffée" → "Espace aquatique chauffé toute l'année"

2. ADVANTAGE (L'Avantage - Le "Comment") :
   - Décris le problème RÉEL résolu pour le client final
   - Sois SPÉCIFIQUE et CONCRET
   - Évite les généralités comme "meilleure expérience"
   - Exemples BONS : "Fini les réveils en sueur", "Plus besoin de chercher un parking", "Vos enfants ne s'ennuient jamais"
   - Exemples MAUVAIS : "Confort amélioré", "Service de qualité"

3. BENEFIT (Le Bénéfice Business) :
   - Chiffre CONCRET si possible (%, €, heures économisées)
   - Impact business mesurable
   - Exemples : "Justifie un prix premium de 30%", "Réduit les annulations de 60%", "Augmente le panier moyen de 45€"

4. EMOTION (L'Émotion - Le "Pourquoi") :
   - Émotion RESSENTIE par le client final OU le propriétaire
   - Sois PRÉCIS : pas juste "bonheur" mais "Sérénité & Contrôle total" ou "Fierté & Réputation"
   - Combine 2 émotions si pertinent

5. COPY (La Phrase d'Accroche) :
   - MAX 10 mots
   - PERCUTANTE, mémorable
   - Évite les clichés
   - Exemples : "La piscine qui justifie votre tarif haut de gamme", "Le parking qui rassure avant même l'arrivée"

6. SOCIAL_POST (Le Post Social) :
   - 80-120 mots
   - Ton : Premium, accueillant, qui fait RÊVER
   - Structure : Hook émotionnel → Bénéfice → CTA
   - 3-4 emojis STRATÉGIQUES (pas de spam)
   - CTA clair et actionnable
   - Pas de hashtags excessifs

CONTEXTE PAR SECTEUR :

HOSPITALITY (Campings/Hôtels) :
- Focus sur : expérience mémorable, confort, tranquillité, moments partagés
- Émotions : Sérénité, Fierté, Joie, Évasion, Confort

REAL ESTATE (Makelaars/Promoteurs) :
- Focus sur : sécurité financière, qualité de vie, investissement, tranquillité d'esprit
- Émotions : Sécurité, Fierté, Sérénité, Accomplissement, Liberté
- Bénéfices : Plus-value, économies énergétiques, localisation stratégique

OUTDOOR (Activités) :
- Focus sur : aventure, découverte, accomplissement, souvenirs
- Émotions : Liberté, Accomplissement, Découverte, Fierté

IMPORTANT : Sois CRÉATIF et UNIQUE. Chaque réponse doit être sur-mesure, pas générique. Évite les phrases toutes faites.

FORMAT JSON STRICT :
{
  "feature": "...",
  "advantage": "...",
  "benefit": "...",
  "emotion": "...",
  "copy": "...",
  "social_post": "..."
}

Langue : Français impeccable, sans anglicismes inutiles.`,
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
