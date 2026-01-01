# Le Traducteur de Valeur

Une application moderne Next.js qui aide les entreprises B2B en France à convertir des "Fonctionnalités" en "Bénéfices" émotionnels.

## Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utilitaire
- **Shadcn/UI** - Composants UI modernes
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes
- **OpenAI API** - Génération dynamique avec LLM (optionnel)

## Installation

```bash
npm install
```

## Configuration LLM (Optionnel)

Pour activer la génération dynamique avec IA, créez un fichier `.env.local` à la racine du projet :

```bash
# OpenAI (recommandé - modèle économique)
OPENAI_API_KEY=votre_clé_api_openai

# OU Anthropic Claude (alternative)
ANTHROPIC_API_KEY=votre_clé_api_anthropic
```

**Où obtenir vos clés API :**
- OpenAI : https://platform.openai.com/api-keys
- Anthropic : https://console.anthropic.com/

**Note :** Sans clé API, l'application utilise automatiquement la base de connaissances statique (60+ exemples).

## Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Build

```bash
npm run build
npm start
```

## Fonctionnalités

- Interface moderne avec design "Digital Agency"
- Traduction de fonctionnalités en bénéfices via l'Échelle de Valeur
- **Base de connaissances statique** : 60+ exemples pour campings, hôtels et activités outdoor
- **Génération dynamique avec IA** : Mode LLM pour créer des traductions uniques on-the-fly
- Animations fluides avec Framer Motion
- Recherche par mots-clés dans les exemples prédéfinis
- Fallback automatique : Si LLM échoue, utilise la base statique
- Design responsive

### Mode Statique vs Mode IA

- **Mode Statique** (par défaut) : Utilise la base de 60+ exemples prédéfinis
- **Mode IA** : Génère des traductions uniques pour n'importe quelle fonctionnalité
  - Toggle disponible dans l'interface
  - Nécessite une clé API (OpenAI ou Anthropic)
  - Fallback automatique si l'API échoue

## Structure

- `app/page.tsx` - Page principale avec la logique de traduction
- `app/api/translate/route.ts` - API route pour la traduction (statique + LLM)
- `lib/data.ts` - Base de données d'exemples (60+ exemples)
- `lib/llm.ts` - Intégration LLM (OpenAI & Anthropic)
- `components/ui/` - Composants Shadcn/UI (Button, Input, Card)

## Coûts LLM

**OpenAI (gpt-4o-mini)** : ~$0.15 par 1M tokens
- Génération moyenne : ~300 tokens
- Coût par traduction : ~$0.000045 (très économique)

**Anthropic Claude** : ~$3 par 1M tokens
- Génération moyenne : ~500 tokens
- Coût par traduction : ~$0.0015

**Recommandation** : Utilisez OpenAI gpt-4o-mini pour un excellent rapport qualité/prix.


