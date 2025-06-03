// src/ai/flows/generate-combo-suggestion.ts
'use server';

/**
 * @fileOverview Generates combo meal suggestions tailored to specific areas based on sales data.
 *
 * - generateComboSuggestion - A function that generates combo meal suggestions.
 * - GenerateComboSuggestionInput - The input type for the generateComboSuggestion function.
 * - GenerateComboSuggestionOutput - The return type for the generateComboSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateComboSuggestionInputSchema = z.object({
  area: z.string().describe('The specific area (e.g., postcode) for which to generate the combo suggestion.'),
  salesData: z.string().describe('Sales data for the area, including popular items and order history.'),
});
export type GenerateComboSuggestionInput = z.infer<typeof GenerateComboSuggestionInputSchema>;

const GenerateComboSuggestionOutputSchema = z.object({
  comboSuggestion: z.string().describe('A suggested combo meal tailored to the specified area.'),
  reasoning: z.string().describe('The reasoning behind the combo suggestion, based on sales data.'),
});
export type GenerateComboSuggestionOutput = z.infer<typeof GenerateComboSuggestionOutputSchema>;

export async function generateComboSuggestion(input: GenerateComboSuggestionInput): Promise<GenerateComboSuggestionOutput> {
  return generateComboSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateComboSuggestionPrompt',
  input: {schema: GenerateComboSuggestionInputSchema},
  output: {schema: GenerateComboSuggestionOutputSchema},
  prompt: `You are an AI assistant that helps takeaway owners generate combo meal suggestions based on sales data for a specific area.

  Analyze the following sales data for the area: {{{salesData}}}
  The area is: {{{area}}}

  Based on this data, suggest a combo meal that would be popular in this area. Explain your reasoning.
  Return the combo suggestion and reasoning in the output fields.`,
});

const generateComboSuggestionFlow = ai.defineFlow(
  {
    name: 'generateComboSuggestionFlow',
    inputSchema: GenerateComboSuggestionInputSchema,
    outputSchema: GenerateComboSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
