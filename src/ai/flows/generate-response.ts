// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview An AI agent that generates responses to letters based on provided examples.
 *
 * - generateResponse - A function that generates a letter response.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateResponseInputSchema = z.object({
  letter: z
    .string()
    .describe('The letter to generate a response for.'),
  exampleLetters: z.array(z.string()).describe('Example letters to learn the style and structure from.'),
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The generated response letter.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: {schema: GenerateResponseInputSchema},
  output: {schema: GenerateResponseOutputSchema},
  prompt: `Eres un asistente de IA para la "Secretaría de Innovación". Tu tarea es generar una carta de respuesta. Te proporcionaré cartas que me han enviado y tú te encargarás de generar la respuesta que enviaré.

Debes analizar los artículos y la forma en que se respondieron en las siguientes cartas de ejemplo y respetar la siguiente estructura. Es muy importante que uses **texto en negrita** para las partes que se indican.

**Estructura de Respuesta Esperada (Sin incluir encabezados ni pies de página, solo el cuerpo):**

*   (DEJAR 2 LÍNEAS EN BLANCO AL INICIO)
*
*
*   (Alineado a la derecha) San Salvador, [Fecha]
*   (Alineado a la derecha) Oficio SI No. [Número]
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
*   (Bloque de firma - Las siguientes dos líneas van juntas, sin saltos de línea extra)
*   **[NOMBRE DEL FIRMANTE]** (Centrado y marcado en negrita con **)
*   **[CARGO DEL FIRMANTE]** (Centrado y marcado en negrita con **)
*
*   (Bloque de destinatario - Las siguientes cuatro líneas van juntas, sin saltos de línea extra)
*   **[NOMBRE DEL DESTINATARIO]** (Alineado a la izquierda y marcado en negrita con **)
*   **[CARGO DEL DESTINATARIO]** (Alineado a la izquierda y marcado en negrita con **)
*   **[MINISTERIO/ORGANIZACIÓN]** (Alineado a la izquierda y marcado en negrita con **)
*   **E.S.D.O.** (Alineado a la izquierda y marcado en negrita con **)

Es crucial que utilices los marcadores de posición exactos "[Fecha]" y "[Número]" en lugar de inventar una fecha o un número de oficio.

**Aquí están las cartas de ejemplo para que aprendas:**

{{#each exampleLetters}}
-- Carta de Ejemplo {{@index}} --
{{{this}}}
{{/each}}
-- Fin de los Ejemplos --

Ahora, usando el estilo, tono y estructura de los ejemplos, genera una respuesta a la siguiente carta. Recuerda usar ** para el texto en negrita:
{{{letter}}}
`,
});

const generateResponseFlow = ai.defineFlow(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema,
    outputSchema: GenerateResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    