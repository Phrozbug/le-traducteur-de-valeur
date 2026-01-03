import { NextResponse } from "next/server";
import { findExampleByKeyword } from "@/lib/data";
import { generateWithLLM } from "@/lib/llm";

export async function POST(request: Request) {
  try {
    const { input, useLLM, llmProvider } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    // 1. PRIORITEIT: AI (Als gebruiker het wil én we een key hebben)
    if (useLLM && apiKey) {
      // Gebruik direct de AI. We kijken NIET eerst in de statische lijst.
      // Dit zorgt voor unieke antwoorden, zelfs voor bekende woorden.
      const llmResult = await generateWithLLM(input, apiKey);
      
      if (llmResult) {
        return NextResponse.json({ 
          result: llmResult, 
          source: "llm" 
        });
      }
      // Als AI faalt (null teruggeeft), vallen we hieronder terug op statisch (fallback)
    }

    // 2. FALLBACK: Statische database
    // (Wordt gebruikt als AI uit staat, geen key heeft, of crashte)
    const staticMatch = findExampleByKeyword(input);
    if (staticMatch) {
      return NextResponse.json({ 
        result: staticMatch, 
        source: "static",
        warning: useLLM && !apiKey ? "Mode IA activé mais clé API manquante. Résultat statique affiché." : undefined
      });
    }

    // 3. Geen match?
    return NextResponse.json(
      { error: "No translation found. Try enabling AI mode." }, 
      { status: 404 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
