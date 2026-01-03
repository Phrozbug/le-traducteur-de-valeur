import { NextRequest, NextResponse } from "next/server";
import { generateWithLLM, generateWithClaude } from "@/lib/llm";
import { findExampleByKeyword, getRandomExample, type Example } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const { input, useLLM = false, llmProvider = "openai" } = await request.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Input is required" },
        { status: 400 }
      );
    }

    // If LLM is enabled, use AI directly (unlimited possibilities!)
    if (useLLM) {
      const apiKey =
        llmProvider === "openai"
          ? process.env.OPENAI_API_KEY
          : process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        // Fallback to static if no API key
        const staticMatch = findExampleByKeyword(input);
        const fallback = staticMatch || getRandomExample();
        return NextResponse.json({
          result: fallback,
          source: "static",
          warning: "LLM API key not configured, using static examples",
        });
      }

      // Try LLM generation first (AI has unlimited possibilities!)
      let llmResult: (Example & { social_post?: string }) | null = null;

      if (llmProvider === "openai") {
        llmResult = await generateWithLLM(input, apiKey);
      } else if (llmProvider === "claude") {
        llmResult = await generateWithClaude(input, apiKey);
      }

      if (llmResult) {
        return NextResponse.json({ result: llmResult, source: "llm" });
      }

      // If LLM fails, fallback to static (safety net)
      const staticMatch = findExampleByKeyword(input);
      const fallback = staticMatch || getRandomExample();
      return NextResponse.json({
        result: fallback,
        source: "static",
        warning: "LLM generation failed, using static example",
      });
    }

    // If LLM is disabled, use static knowledge base
    const staticMatch = findExampleByKeyword(input);
    const result = staticMatch || getRandomExample();
    return NextResponse.json({ result, source: "static" });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

