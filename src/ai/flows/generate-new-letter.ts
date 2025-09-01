// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview An AI agent that generates a new letter from scratch based on a user's prompt.
 *
 * - generateNewLetter - A function that generates a new letter.
 * - GenerateNewLetterInput - The input type for the generateNewLetter function.
 * - GenerateNewLetterOutput - The return type for the generateNewLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNewLetterInputSchema = z.object({
  prompt: z.string().describe('The user\'s request for the new letter. e.g., "Write an invitation to the new library opening."'),
});
export type GenerateNewLetterInput = z.infer<typeof GenerateNewLetterInputSchema>;

const GenerateNewLetterOutputSchema = z.object({
  response: z.string().describe('The generated letter.'),
});
export type GenerateNewLetterOutput = z.infer<typeof GenerateNewLetterOutputSchema>;

export async function generateNewLetter(input: GenerateNewLetterInput): Promise<GenerateNewLetterOutput> {
  return generateNewLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNewLetterPrompt',
  input: {schema: GenerateNewLetterInputSchema},
  output: {schema: GenerateNewLetterOutputSchema},
  prompt: `Eres un asistente de IA para la "Secretaría de Innovación". Tu tarea es redactar una carta profesional basada en la instrucción del usuario.

Es muy importante que uses **texto en negrita** para las partes que se indican y respetes la siguiente estructura.

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
*   [Cuerpo principal de la carta, desarrollando la instrucción del usuario. El texto debe estar justificado.]
*
*   Sin más sobre el particular, aprovecho la ocasión para externar mis muestras de consideración y estima.
*
*   (Bloque de firma - Las siguientes dos líneas van juntas, centradas, sin saltos de línea extra)
*   **DANIEL ERNESTO MÉNDEZ CABRERA** (Centrado y marcado en negrita con **)
*   **SECRETARIO DE INNOVACIÓN DE LA PRESIDENCIA** (Centrado y marcado en negrita con **)
*
*   (Bloque de destinatario - Las siguientes cuatro líneas van juntas, alineadas a la izquierda, sin saltos de línea extra)
*   **[NOMBRE DEL DESTINATARIO]** (Alineado a la izquierda y marcado en negrita con **)
*   **[CARGO DEL DESTINATARIO]** (Alineado a la izquierda y marcado en negrita con **)
*   **[MINISTERIO/ORGANIZACIÓN]** (Alineado a la izquierda y marcado en negrita con **)
*   **E.S.D.O.** (Alineado a la izquierda y marcado en negrita con **)

Es crucial que utilices los marcadores de posición exactos "[Fecha]", "[Número]", y los del destinatario, a menos que la instrucción del usuario provea detalles específicos para reemplazarlos.

**Instrucción del Usuario:**
{{{prompt}}}

Ahora, usando la instrucción del usuario y respetando la estructura y formato, genera la carta solicitada. Recuerda usar ** para el texto en negrita y las etiquetas <div> con estilo para la fecha y el oficio.`,
});

const generateNewLetterFlow = ai.defineFlow(
  {
    name: 'generateNewLetterFlow',
    inputSchema: GenerateNewLetterInputSchema,
    outputSchema: GenerateNewLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
