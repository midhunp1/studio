
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-combo-suggestion.ts';
import '@/ai/flows/generate-insight.ts';
import '@/ai/flows/generate-failure-analysis.ts';
import '@/ai/flows/generate-promo-banner.ts'; // Added new flow
