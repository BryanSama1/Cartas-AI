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
  prompt: `Eres un asistente de IA para la "Secretaría de Innovación". Tu tarea es redactar una carta o comunicado profesional basado en la instrucción del usuario.

Es muy importante que uses **texto en negrita** para las partes que se indican y respetes la siguiente estructura, incluyendo referencias a normativas cuando sea apropiado.

**Estructura de Respuesta Esperada (Sin incluir encabezados ni pies de página, solo el cuerpo):**

*   (DEJAR 2 LÍNEAS EN BLANCO AL INICIO)
*
*
*   <div style="text-align: right;">San Salvador, [Fecha]</div>
*   <div style="text-align: right;">Oficio SI No. [Número]</div>
*
*   **Señores (as)** (Alineado a la izquierda y marcado en negrita con **)
*   **Ministros, Secretarios, Presidentes y** (Alineado a la izquierda y marcado en negrita con **)
*   **Directores de Instituciones Descentralizadas,** (Alineado a la izquierda y marcado en negrita con **)
*   **Presentes.** (Alineado a la izquierda y marcado en negrita con **)
*
*
*   Reciban un cordial saludo y deseos de éxitos en el desempeño de sus funciones.
*
*   Hago referencia a lo establecido en los numerales 1 y 2 del artículo 53-K del Reglamento Interno del Órgano Ejecutivo, referente a las atribuciones de la Secretaría de Innovación de la Presidencia de promover la adopción de tecnologías de la información y comunicación (TIC) para mejorar la eficiencia de los servicios públicos.
*
*   [Párrafos de desarrollo, explicando el motivo de la carta según la instrucción del usuario. El texto debe estar justificado y ser coherente con el marco legal mencionado.]
*
*   [Párrafo de llamado a la acción, si es necesario. Por ejemplo, solicitar apoyo, pedir que se llenen encuestas, etc.]
*
*   Sin más sobre el particular, aprovecho la ocasión para externarles mis muestras de consideración y estima.
*
*   (Bloque de firma - Las siguientes dos líneas van juntas, centradas, sin saltos de línea extra)
*   **DANIEL ERNESTO MÉNDEZ CABRERA** (Centrado y marcado en negrita con **)
*   **SECRETARIO DE INNOVACIÓN DE LA PRESIDENCIA** (Centrado y marcado en negrita con **)

Es crucial que utilices los marcadores de posición exactos "[Fecha]" y "[Número]". No generes imágenes ni códigos QR.

**Instrucción del Usuario:**
{{{prompt}}}

Ahora, usando la instrucción del usuario y respetando la estructura, formato y tono formal, genera la carta solicitada. Recuerda usar ** para el texto en negrita y las etiquetas <div> con estilo para la fecha y el oficio.`,
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
