// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview An AI agent that refines a previously generated letter based on user requests.
 *
 * - refineResponse - A function that refines a letter response.
 * - RefineResponseInput - The input type for the refineResponse function.
 * - RefineResponseOutput - The return type for the refineResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineResponseInputSchema = z.object({
  originalResponse: z
    .string()
    .describe('The original letter response that needs to be modified.'),
  refinementRequest: z
    .string()
    .describe('The user\'s instruction on how to modify the letter.'),
});
export type RefineResponseInput = z.infer<typeof RefineResponseInputSchema>;

const RefineResponseOutputSchema = z.object({
  refinedResponse: z
    .string()
    .describe('The full letter with the requested refinement applied.'),
});
export type RefineResponseOutput = z.infer<typeof RefineResponseOutputSchema>;

export async function refineResponse(
  input: RefineResponseInput
): Promise<RefineResponseOutput> {
  return refineResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineResponsePrompt',
  input: {schema: RefineResponseInputSchema},
  output: {schema: RefineResponseOutputSchema},
  prompt: `You are an AI assistant. Your task is to modify the 'Original Letter' by applying the 'Refinement Request'.
You must return the entire letter with the change applied, preserving the exact original formatting.

**Original Letter:**
{{{originalResponse}}}

**Refinement Request:**
{{{refinementRequest}}}

Now, provide the full, refined letter.
`,
});

const refineResponseFlow = ai.defineFlow(
  {
    name: 'refineResponseFlow',
    inputSchema: RefineResponseInputSchema,
    outputSchema: RefineResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
