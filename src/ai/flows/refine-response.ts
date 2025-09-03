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
  prompt: `You are an expert assistant specializing in professional correspondence. Your task is to revise the 'Original Letter' based on the 'Refinement Request'.

This is not just about adding text. You must understand the instruction and rewrite the relevant parts of the letter to reflect the requested change logically and coherently. For example, if the original letter denies an invitation and the request is "now accept it", you must change the body of the letter to be an acceptance.

After applying the logical changes, you must return the entire letter with the change applied, preserving the exact original formatting. It is crucial that you respect the structure and use the same markers (like ** for bold text or <div> for alignment).

**Original Letter:**
{{{originalResponse}}}

**Refinement Request:**
{{{refinementRequest}}}

Now, provide the full, refined letter with the logical change correctly implemented and all formatting perfectly preserved.
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
