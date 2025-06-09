'use server';
/**
 * @fileOverview Analyzes order failure data to identify problematic items/categories and suggest operational improvements.
 *
 * - generateFailureAnalysis - A function that performs the failure analysis.
 * - GenerateFailureAnalysisInput - The input type for the generateFailureAnalysis function.
 * - GenerateFailureAnalysisOutput - The return type for the generateFailureAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFailureAnalysisInputSchema = z.object({
  failureDataJSON: z.string().describe(
    'A JSON string containing structured order failure data. This should include details like failureDataByArea (postcode, type, count, reason) and commonFailureReasons (reason, occurrences, impact).'
  ),
});
export type GenerateFailureAnalysisInput = z.infer<typeof GenerateFailureAnalysisInputSchema>;

const ProblematicItemSchema = z.object({
  itemOrCategoryGuess: z.string().describe(
    'A guess of a specific item or a broader category that seems to be related to failures (e.g., "Pizza", "Spicy Dishes", "Item often marked unavailable").'
  ),
  associatedFailureReason: z.string().describe(
    'The primary failure reason observed in connection with this item or category (e.g., "Item unavailable", "Customer complaint - too spicy").'
  ),
  suggestedAction: z.string().describe(
    'A concrete, actionable suggestion to address the issue related to this item/category (e.g., "Review stock levels for popular pizzas daily.", "Offer spice level options for curries and clearly label them.").'
  ),
});

const GenerateFailureAnalysisOutputSchema = z.object({
  problematicItems: z.array(ProblematicItemSchema).describe(
    'A list of specific items or categories that appear to be frequently associated with order failures, along with reasons and actionable suggestions for each.'
  ),
  overallSuggestions: z.array(z.string()).describe(
    'Broader operational or strategic suggestions to reduce overall order failures, improve customer satisfaction, and address systemic issues like delivery delays or restaurant capacity problems.'
  ),
});
export type GenerateFailureAnalysisOutput = z.infer<typeof GenerateFailureAnalysisOutputSchema>;

export async function generateFailureAnalysis(input: GenerateFailureAnalysisInput): Promise<GenerateFailureAnalysisOutput> {
  return generateFailureAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFailureAnalysisPrompt',
  input: {schema: GenerateFailureAnalysisInputSchema},
  output: {schema: GenerateFailureAnalysisOutputSchema},
  prompt: `You are an expert operations analyst for a takeaway restaurant chain. Your goal is to help restaurant owners understand why orders are failing and how to improve.

Analyze the following order failure data:
{{{failureDataJSON}}}

Based on this data:
1.  Identify specific food items or categories that seem to be disproportionately causing cancellations, rejections, or refunds.
    *   For each identified item/category, clearly state the most common associated failure reason (e.g., "Item unavailable", "Incorrect item sent", "Customer complaint - quality").
    *   Provide a concise, actionable suggestion for each to mitigate future failures related to that item/category.
    *   If direct item names are not in the data, make reasonable inferences based on failure reasons (e.g., "Item unavailable" might point to popular dishes or specific ingredients). Phrase these as "Potential issue with [Category/Item Type]".

2.  Provide a list of overall operational suggestions to improve order fulfillment and reduce failure rates. These should address broader patterns like:
    *   Reasons for food not reaching customers as expected (e.g., delivery delays, food quality issues upon arrival).
    *   Systemic issues (e.g., restaurant being too busy, payment problems).

Focus on practical and actionable advice. Ensure your output strictly adheres to the 'problematicItems' and 'overallSuggestions' schema.
If the data is sparse for item-specific analysis, focus more on robust overallSuggestions based on the commonFailureReasons provided.
Output valid JSON.
`,
});

const generateFailureAnalysisFlow = ai.defineFlow(
  {
    name: 'generateFailureAnalysisFlow',
    inputSchema: GenerateFailureAnalysisInputSchema,
    outputSchema: GenerateFailureAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI analysis did not return an output.');
    }
    // Ensure the output matches the schema, especially the arrays.
    // Sometimes the model might return a single object instead of an array if only one item is found.
    // Or it might return null/undefined if nothing is found.
    return {
        problematicItems: output.problematicItems || [],
        overallSuggestions: output.overallSuggestions || [],
    };
  }
);
