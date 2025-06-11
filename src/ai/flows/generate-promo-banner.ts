
'use server';
/**
 * @fileOverview Generates promotional banner images with text using AI.
 *
 * - generatePromoBanner - A function that handles the banner image generation.
 * - GeneratePromoBannerInput - The input type for the generatePromoBanner function.
 * - GeneratePromoBannerOutput - The return type for the generatePromoBanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GeneratePromoBannerInputSchema = z.object({
  promoText: z.string().min(5, "Promo text must be at least 5 characters").max(100, "Promo text must be 100 characters or less")
    .describe('The text to display prominently on the promotional banner.'),
});
export type GeneratePromoBannerInput = z.infer<typeof GeneratePromoBannerInputSchema>;

export const GeneratePromoBannerOutputSchema = z.object({
  bannerImageUrl: z.string().describe('The generated banner image as a data URI.'),
});
export type GeneratePromoBannerOutput = z.infer<typeof GeneratePromoBannerOutputSchema>;

export async function generatePromoBanner(input: GeneratePromoBannerInput): Promise<GeneratePromoBannerOutput> {
  return generatePromoBannerFlow(input);
}

const generatePromoBannerFlow = ai.defineFlow(
  {
    name: 'generatePromoBannerFlow',
    inputSchema: GeneratePromoBannerInputSchema,
    outputSchema: GeneratePromoBannerOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Only this model supports image generation currently
      prompt: `Create a visually appealing promotional banner suitable for a food delivery or takeaway service. 
The banner MUST prominently display the following text: "${input.promoText}".
Make the banner vibrant, modern, and ensure the text is clear and stands out against the background. 
The banner should be in a landscape orientation, suitable for web use (e.g., aspect ratio around 3:1 or 4:1).`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
         safetySettings: [ // More lenient safety settings for creative content
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed or did not return a valid image URL.');
    }

    return { bannerImageUrl: media.url };
  }
);
