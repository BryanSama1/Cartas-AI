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

After applying the logical changes, you must return the entire letter with the change applied, preserving the exact original formatting. It is crucial that you respect the following structure and use the same markers.

**Estructura de Respuesta Esperada (Sin incluir encabezados ni pies de página, solo el cuerpo):**

*   (DEJAR 2 LÍNEAS EN BLANCO AL INICIO)
*
*
*   <div style="text-align: right;">San Salvador, [Fecha]</div>
*   <div style="text-align: right;">Oficio SI No. [Número]</div>
*
*   **SEÑOR/A [TÍTULO]:** (EN MAYÚSCULAS Y MARCADO EN NEGRITA CON **)
*
*   (Cuerpo del texto, justificado)
*   Reciba un cordial saludo y deseos de éxitos en el desempeño de sus funciones.
*
*   [Cuerpo principal de la carta, haciendo referencia a la carta recibida, citando artículos relevantes, proporcionando observaciones, etc. El texto debe estar justificado.]
*
*   En virtud de lo antes expuesto, [párrafo de conclusión].
*
*   Sin más sobre el particular, aprovecho la ocasión para externar mis muestras de consideración y estima.
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
