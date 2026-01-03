
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Loader2, Sparkles, Copy, Check, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { type Example } from "@/lib/data";

// Type uitbreiden voor de social post
type ExtendedExample = Example & { social_post?: string };

interface LadderStep {
  label: string;
  value: string;
  step: number;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ExtendedExample | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useLLM, setUseLLM] = useState(true); 
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          useLLM: useLLM,
          llmProvider: "openai",
        }),
      });

      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      setResult(data.result);
      
      if (data.warning) console.warn(data.warning);

    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ladderSteps: LadderStep[] = result
    ? [
        { label: "1. La Fonctionnalité (Ce que vous avez)", value: result.feature, step: 1 },
        { label: "2. L'Avantage (L'expérience client)", value: result.advantage, step: 2 },
        { label: "3. Le Bénéfice (La valeur business)", value: result.benefit, step: 3 },
        { label: "4. L'Émotion (Pourquoi ils achètent)", value: result.emotion, step: 4 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header - High End Agency Style */}
      <header className="container mx-auto px-4 py-16 md:py-24 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-indigo-600 font-bold tracking-widest text-xs md:text-sm uppercase mb-6 block">
            Propulsé par Agence Cible
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Le Traducteur de <span className="text-indigo-600">Valeur</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Arrêtez de vendre des &quot;lits&quot; et des &quot;murs&quot;. <br className="hidden md:block"/>
            <span className="font-semibold text-slate-800">Commencez à vendre du sommeil, du rêve et des souvenirs.</span>
          </p>
        </motion.div>
      </header>

      {/* Input Section */}
      <section className="container mx-auto px-4 pb-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white p-3 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-200"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              type="text"
              placeholder="Ex: Piscine chauffée, WiFi gratuit, Restaurant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleTranslate()}
              className="flex-1 text-lg h-14 md:h-16 border-transparent focus:border-transparent focus:ring-0 bg-slate-50 rounded-xl px-6 placeholder:text-slate-400"
            />
            <Button
              onClick={handleTranslate}
              disabled={isLoading || !input.trim()}
              size="lg"
              className="h-14 md:h-16 px-8 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-200"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                "Révéler la Valeur"
              )}
            </Button>
          </div>
        </motion.div>
        
        {/* Subtle LLM Indicator */}
        <div className="flex justify-center mt-6">
           <button 
             onClick={() => setUseLLM(!useLLM)} 
             className={`text-xs flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${useLLM ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-400 hover:text-slate-600'}`}
           >
              <Sparkles className="w-3 h-3" />
              {useLLM ? "Mode IA Activé (Génération illimitée)" : "Mode Base de Données"}
           </button>
        </div>
      </section>

      {/* Output Section */}
      <section className="container mx-auto px-4 pb-24 max-w-4xl">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col justify-center items-center py-20 space-y-4"
            >
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
              <p className="text-slate-500 font-medium animate-pulse">
                Analyse de votre potentiel marketing...
              </p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              {/* The "Money Headline" */}
              <div className="text-center bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-indigo-50">
                <h3 className="text-xs md:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">
                  Votre nouvelle phrase d&apos;accroche
                </h3>
                <p className="text-2xl md:text-5xl font-serif text-slate-900 italic leading-tight">
                  &quot;{result.copy}&quot;
                </p>
              </div>

              {/* The Ladder Visualization */}
              <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-200 to-indigo-600 hidden md:block" />

                <div className="space-y-8">
                  {ladderSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="relative md:pl-24"
                    >
                      {/* Step Number Bubble */}
                      <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-white border-2 border-indigo-50 rounded-full items-center justify-center text-xl font-bold text-indigo-600 shadow-sm z-10">
                        {step.step}
                      </div>

                      <Card className="border-none shadow-lg shadow-slate-100 hover:shadow-xl transition-shadow bg-white overflow-hidden group">
                        <div className={`h-1.5 w-full transition-all duration-500 ${
                          index === 0 ? "bg-slate-300 group-hover:bg-slate-400" :
                          index === 1 ? "bg-indigo-300 group-hover:bg-indigo-400" :
                          index === 2 ? "bg-indigo-500 group-hover:bg-indigo-600" : "bg-indigo-700 group-hover:bg-indigo-800"
                        }`} />
                        <CardContent className="p-6 md:p-8">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            {step.label}
                          </h4>
                          <p className="text-xl md:text-2xl font-medium text-slate-800">
                            {step.value}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Arrow for mobile */}
                      {index < ladderSteps.length - 1 && (
                        <div className="md:hidden flex justify-center py-4 text-indigo-200">
                          <ArrowDown size={24} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* BONUS: SOCIAL MEDIA POST (THE LEAD MAGNET) */}
              {result.social_post && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-16"
                >
                   <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-1 shadow-2xl shadow-indigo-200">
                     <div className="bg-white rounded-[20px] overflow-hidden">
                        <div className="bg-indigo-50/50 p-6 border-b border-indigo-50 flex flex-col md:flex-row justify-between items-center gap-4">
                           <div className="flex items-center gap-4">
                              <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-200">
                                <Sparkles size={24} />
                              </div>
                              <div className="text-center md:text-left">
                                <h3 className="font-bold text-slate-900 text-lg">Bonus : Votre Post Social</h3>
                                <p className="text-sm text-slate-500">Prêt à copier-coller pour Instagram & Facebook</p>
                              </div>
                           </div>
                           <Button 
                              variant="outline" 
                              onClick={() => copyToClipboard(result.social_post!)}
                              className="border-indigo-200 hover:bg-indigo-50 text-indigo-700 gap-2 w-full md:w-auto"
                           >
                              {copied ? <Check size={18} /> : <Copy size={18} />}
                              {copied ? "Copié !" : "Copier le texte"}
                           </Button>
                        </div>
                        
                        <div className="p-8 md:p-10 bg-slate-50/50">
                           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                               <p className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-lg">
                                  {result.social_post}
                               </p>
                           </div>
                        </div>

                        <div className="bg-white p-6 text-center border-t border-slate-100">
                           <p className="text-sm text-slate-500 flex flex-col md:flex-row items-center justify-center gap-2">
                              <Info size={16} className="text-indigo-400" />
                              <span>Vous voulez des visuels professionnels pour accompagner ce texte ?</span>
                              <a href="https://agencecible.fr" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4 transition-all">
                                Contactez Agence Cible
                              </a>
                           </p>
                        </div>
                     </div>
                   </div>
                </motion.div>
              )}

            {/* STAP 3: DE WHITEPAPER UPSELL (De Brug naar Video) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-8 bg-slate-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden"
              >
                {/* Decoratieve achtergrond cirkel */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                      Étape Suivante
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                      Vous avez le texte... <br/>
                      <span className="text-indigo-400">Maintenant, créez la vidéo.</span>
                    </h3>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      Une bonne accroche ne suffit pas. Sur Instagram & LinkedIn, c&apos;est la vidéo qui arrête le scroll.
                      Téléchargez notre guide gratuit : <strong>&quot;Le Guide Ultime de la Vidéo à Haute Conversion.&quot;</strong>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Button 
                        size="lg" 
                        className="bg-white text-slate-900 hover:bg-indigo-50 font-bold gap-2"
                        onClick={() => window.open('/AgenceCible.pdf', '_blank')} 
                      >
                        <Download size={18} />
                        Télécharger le Guide PDF
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-slate-400 hover:text-white"
                        onClick={() => window.open('https://agencecible.fr', '_blank')}
                      >
                        Ou laissez-nous filmer pour vous &rarr;
                      </Button>
                    </div>
                  </div>
                  
                  {/* Visuele representatie van de PDF (Mockup) */}
                  <div className="w-40 h-56 bg-white rounded shadow-2xl transform rotate-3 flex items-center justify-center flex-shrink-0 border-r-4 border-b-4 border-slate-200">
                    <div className="text-center p-4">
                      <span className="text-4xl">📄</span>
                      <p className="text-slate-900 font-bold mt-4 text-xs tracking-widest uppercase">Guide Vidéo</p>
                      <p className="text-indigo-600 font-bold text-lg leading-tight mt-1">Haute<br/>Conversion</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
      
      {/* Footer minimaliste */}
      <footer className="py-12 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
        <p>© {new Date().getFullYear()} Agence Cible - Perpignan & Pays-Bas</p>
      </footer>
    </div>
  );
}