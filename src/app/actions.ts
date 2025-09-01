"use server";
import { generateResponse as generateResponseFlow } from "@/ai/flows/generate-response";
import { refineResponse as refineResponseFlow } from "@/ai/flows/refine-response";
import { z } from "zod";

const GenerateInputSchema = z.object({
  letter: z.string(),
  exampleLetters: z.array(z.string()),
});

export async function generateLetterResponse(input: z.infer<typeof GenerateInputSchema>) {
  const parsedInput = GenerateInputSchema.safeParse(input);
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
