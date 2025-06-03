'use server';

/**
 * @fileOverview Generates smart insights for takeaway owners, such as optimal times for ad boosts in specific postcodes.
 *
 * - generateAdBoostTimeSuggestion - A function that generates ad boost time suggestions.
 * - GenerateAdBoostTimeSuggestionInput - The input type for the generateAdBoostTimeSuggestion function.
 * - GenerateAdBoostTimeSuggestionOutput - The return type for the generateAdBoostTimeSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdBoostTimeSuggestionInputSchema = z.object({
  postcode: z.string().describe('The postcode to analyze.'),
  orderData: z.string().describe('Order data, as a JSON string.'),
});
export type GenerateAdBoostTimeSuggestionInput = z.infer<
  typeof GenerateAdBoostTimeSuggestionInputSchema
>;

const GenerateAdBoostTimeSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('The suggested time for an ad boost.'),
  reasoning: z.string().describe('The reasoning behind the suggestion.'),
});
export type GenerateAdBoostTimeSuggestionOutput = z.infer<
  typeof GenerateAdBoostTimeSuggestionOutputSchema
>;

export async function generateAdBoostTimeSuggestion(
  input: GenerateAdBoostTimeSuggestionInput
): Promise<GenerateAdBoostTimeSuggestionOutput> {
  return generateAdBoostTimeSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdBoostTimeSuggestionPrompt',
  input: {schema: GenerateAdBoostTimeSuggestionInputSchema},
  output: {schema: GenerateAdBoostTimeSuggestionOutputSchema},
  prompt: `You are an expert marketing consultant for takeaway businesses.

  Analyze the following order data for the given postcode and suggest the optimal time to run an ad boost to increase sales. Provide a clear reasoning for your suggestion.

  Postcode: {{{postcode}}}
  Order Data: {{{orderData}}}

  Format your output as a JSON object with 'suggestion' and 'reasoning' fields.
  `,
});

const generateAdBoostTimeSuggestionFlow = ai.defineFlow(
  {
    name: 'generateAdBoostTimeSuggestionFlow',
    inputSchema: GenerateAdBoostTimeSuggestionInputSchema,
    outputSchema: GenerateAdBoostTimeSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
