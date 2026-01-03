/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Copy, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { type Example } from "@/lib/data";

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
      
    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur est survenue.");
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
        { label: "1. La Fonctionnalité", value: result.feature, step: 1 },
        { label: "2. L'Avantage (Expérience)", value: result.advantage, step: 2 },
        { label: "3. Le Bénéfice (Business)", value: result.benefit, step: 3 },
        { label: "4. L'Émotion (Déclencheur)", value: result.emotion, step: 4 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-16 text-center max-w-4xl flex-grow-0">
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
            Pour l&apos;Immobilier & l&apos;Hôtellerie.<br className="hidden md:block"/>
            <span className="font-semibold text-slate-800">Transformez des &quot;murs&quot; en émotion pure.</span>
          </p>
        </motion.div>
      </header>

      {/* Input Section */}
      <section className="container mx-auto px-4 pb-8 max-w-3xl flex-grow-0">
        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              type="text"
              placeholder="Ex: Piscine, Garage double, Vue mer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleTranslate()}
              className="flex-1 text-lg h-14 md:h-16 border-transparent focus:border-transparent focus:ring-0 bg-slate-50 rounded-xl px-6"
            />
            <Button
              onClick={handleTranslate}
              disabled={isLoading || !input.trim()}
              size="lg"
              className="h-14 md:h-16 px-8 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-200"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Révéler"}
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
           <button 
             onClick={() => setUseLLM(!useLLM)} 
             className={`text-xs flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${useLLM ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-400'}`}
           >
              <Sparkles className="w-3 h-3" />
              {useLLM ? "✨ Mode IA : Créativité Unique (Activé)" : "📚 Mode Base de Données (Statique)"}
           </button>
        </div>
      </section>

      {/* Output Section */}
      <section className="container mx-auto px-4 pb-24 max-w-4xl flex-grow">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col justify-center items-center py-20"
            >
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
              <p className="text-slate-500 font-medium mt-4">Analyse du potentiel...</p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Headline */}
              <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-indigo-50">
                <p className="text-2xl md:text-4xl font-serif text-slate-900 italic leading-tight">
                  &quot;{result.copy}&quot;
                </p>
              </div>

              {/* Ladder */}
              <div className="space-y-4">
                  {ladderSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-none shadow-sm bg-white">
                        <div className={`h-1 w-full ${index === 0 ? "bg-slate-300" : index === 1 ? "bg-indigo-300" : index === 2 ? "bg-indigo-500" : "bg-indigo-700"}`} />
                        <CardContent className="p-6">
                          <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">{step.label}</h4>
                          <p className="text-lg font-medium text-slate-800">{step.value}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>

              {/* Social Post */}
              {result.social_post && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-1 shadow-xl"
                >
                   <div className="bg-white rounded-[20px] overflow-hidden">
                        <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
                           <div className="flex items-center gap-2">
                              <Sparkles className="text-indigo-600 w-5 h-5" />
                              <span className="font-bold text-slate-900">Post Réseaux Sociaux</span>
                           </div>
                           <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.social_post!)}>
                              {copied ? <Check size={16} /> : <Copy size={16} />}
                           </Button>
                        </div>
                        <div className="p-8 whitespace-pre-wrap text-slate-700 font-medium">
                           {result.social_post}
                        </div>
                   </div>
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
      
      {/* Clean Footer */}
      <footer className="py-8 text-center bg-white border-t border-slate-100 mt-auto">
        <a 
          href="https://agencecible.fr" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm"
        >
          © {new Date().getFullYear()} Agence Cible
        </a>
      </footer>
    </div>
  );
}
