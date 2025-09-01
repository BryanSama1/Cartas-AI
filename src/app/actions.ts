"use server";
import { generateResponse as generateResponseFlow } from "@/ai/flows/generate-response";
import { refineResponse as refineResponseFlow } from "@/ai/flows/refine-response";
import { generateNewLetter as generateNewLetterFlow } from "@/ai/flows/generate-new-letter";
import { z } from "zod";

const GenerateResponseInputSchema = z.object({
  letter: z.string(),
  exampleLetters: z.array(z.string()),
});

export async function generateLetterResponse(input: z.infer<typeof GenerateResponseInputSchema>) {
  const parsedInput = GenerateResponseInputSchema.safeParse(input);
  if (!parsedInput.success) {
    return { error: "Invalid input." };
  }
  try {
    const result = await generateResponseFlow(parsedInput.data);
    return { response: result.response };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate AI response." };
  }
}

const GenerateNewLetterInputSchema = z.object({
  prompt: z.string(),
});

export async function generateNewLetter(input: z.infer<typeof GenerateNewLetterInputSchema>) {
  const parsedInput = GenerateNewLetterInputSchema.safeParse(input);
  if (!parsedInput.success) {
    return { error: "Invalid input." };
  }
  try {
    const result = await generateNewLetterFlow(parsedInput.data);
    return { response: result.response };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate AI response." };
  }
}

const RefineInputSchema = z.object({
  originalResponse: z.string(),
  refinementRequest: z.string(),
});

export async function refineLetterResponse(input: z.infer<typeof RefineInputSchema>) {
    const parsedInput = RefineInputSchema.safeParse(input);
    if (!parsedInput.success) {
        return { error: "Invalid input." };
    }
    try {
        const result = await refineResponseFlow(parsedInput.data);
        return { refinedResponse: result.refinedResponse };
    } catch (e) {
        console.error(e);
        return { error: "Failed to refine AI response." };
    }
}
