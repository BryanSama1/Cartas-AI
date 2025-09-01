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
  prompt: `You are an AI business assistant. Your primary task is to modify an existing letter based on a user's specific request. The AI will act as a tool, incorporating only the information it deems appropriate to complete a business response letter.

You must take the "Original Letter" and meticulously apply the "Refinement Request".
It is crucial that you return the *entire letter* with the change applied, preserving the exact original formatting.

**Expected Structure (Reminder):**
*   (DEJAR 2 LÍNEAS EN BLANCO AL INICIO)
*
*
*   <div style="text-align: right;">San Salvador, [Fecha]</div>
*   <div style="text-align: right;">Oficio SI No. [Número]</div>
*
*   **SEÑOR/A [TÍTULO]:** (EN MAYÚSCULAS Y MARCADO EN NEGRITA CON **)
*
*   (Cuerpo del texto, justificado)
*
*   (Bloque de firma - Las siguientes dos líneas van juntas, centradas, sin saltos de línea extra)
*   **[NOMBRE DEL FIRMANTE]** (Centrado y marcado en negrita con **)
*   **[CARGO DEL FIRMANTE]** (Centrado y marcado en negrita con **)
*
*   (Bloque de destinatario - Las siguientes cuatro líneas van juntas, alineadas a la izquierda, sin saltos de línea extra)
*   **[NOMBRE DEL DESTINATARIO]** (Alineado a la izquierda y marcado en negrita con **)
*   **[CARGO DEL DESTINATARIO]** (Alineado a la izquierda y marcado en negrita con **)
*   **[MINISTERIO/ORGANIZACIÓN]** (Alineado a la izquierda y marcado en negrita con **)
*   **E.S.D.O.** (Alineado a la izquierda y marcado en negrita con **)

Do not add any extra formatting. Do not make the changed text bold or uppercase unless specifically asked to. Preserve the exact original formatting, including markdown for bold text (**text**), and any HTML tags like <div style="...">.

**Original Letter:**
{{{originalResponse}}}

**Refinement Request:**
{{{refinementRequest}}}

Now, provide the full, refined letter with only the requested change applied, ensuring it perfectly matches the user's intent and the required structure. Your output must be a valid JSON object matching the output schema, containing the full refined letter in the 'refinedResponse' field.
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
