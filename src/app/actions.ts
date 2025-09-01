"use server";
import { generateResponse as generateResponseFlow } from "@/ai/flows/generate-response";
import { z } from "zod";

const InputSchema = z.object({
  letter: z.string(),
  exampleLetters: z.array(z.string()),
});

export async function generateLetterResponse(input: z.infer<typeof InputSchema>) {
  const parsedInput = InputSchema.safeParse(input);
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
