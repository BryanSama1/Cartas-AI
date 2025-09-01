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

Debes analizar los artículos y la forma en que se respondieron en las siguientes cartas de ejemplo y respetar la siguiente estructura.

**Estructura de Respuesta Esperada (Bajo la imagen del encabezado que se añadirá después):**

*   (Alineado a la derecha) San Salvador, [Fecha]
*   (Alineado a la derecha) Oficio SI No. [Número]
*
*   **SEÑORA VICEMINISTRA:** (o título apropiado, EN NEGRITA)
*
*   (Cuerpo del texto)
*   Reciba un cordial saludo y deseos de éxitos en el desempeño de sus funciones.
*
*   [Cuerpo principal de la carta, haciendo referencia a la carta recibida, citando artículos relevantes como el Art. 53-k del RIOE, proporcionando observaciones, etc.]
*
*   En virtud de lo antes expuesto, [párrafo de conclusión].
*
*   Sin más sobre el particular, aprovecho la ocasión para externar mis muestras de consideración y estima.
*
*
*   (Bloque de firma, EN NEGRITA)
*   [NOMBRE DEL FIRMANTE]
*   [CARGO DEL FIRMANTE]
*   [NOMBRE DEL DESTINATARIO]
*   [CARGO DEL DESTINATARIO]
*   [MINISTERIO/ORGANIZACIÓN]
*   E.S.D.O.

**Aquí están las cartas de ejemplo para que aprendas:**

{{#each exampleLetters}}
-- Carta de Ejemplo {{@index}} --
{{{this}}}
{{/each}}
-- Fin de los Ejemplos --

Ahora, usando el estilo, tono y estructura de los ejemplos, genera una respuesta a la siguiente carta:
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
