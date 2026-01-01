# Configuration de l'API LLM

Pour activer la génération dynamique avec IA, suivez ces étapes :

## 1. Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec :

```bash
# Option 1: OpenAI (recommandé - économique)
OPENAI_API_KEY=votre_clé_api_openai_ici

# Option 2: Anthropic Claude (alternative)
ANTHROPIC_API_KEY=votre_clé_api_anthropic_ici
```

## 2. Obtenir une clé API

### OpenAI (Recommandé)
1. Allez sur https://platform.openai.com/api-keys
2. Créez un compte ou connectez-vous
3. Créez une nouvelle clé API
4. Copiez-la dans `.env.local`

**Modèle utilisé** : `gpt-4o-mini` (très économique, ~$0.000045 par traduction)

### Anthropic Claude (Alternative)
1. Allez sur https://console.anthropic.com/
2. Créez un compte ou connectez-vous
3. Créez une nouvelle clé API
4. Copiez-la dans `.env.local`

## 3. Redémarrer le serveur

Après avoir ajouté la clé API, redémarrez le serveur de développement :

```bash
npm run dev
```

## 4. Utiliser le mode IA

Dans l'interface, activez le toggle "Mode IA (LLM)" pour générer des traductions dynamiques.

**Note** : Sans clé API, l'application utilise automatiquement la base de connaissances statique (60+ exemples).

## Sécurité

- Le fichier `.env.local` est déjà dans `.gitignore` et ne sera pas commité
- Ne partagez jamais vos clés API publiquement
- Pour la production, configurez les variables d'environnement sur votre plateforme d'hébergement (Vercel, etc.)

