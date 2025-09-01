import { config } from 'dotenv';
config();

import '@/ai/flows/generate-response.ts';
import '@/ai/flows/refine-response.ts';
import '@/ai/flows/generate-new-letter.ts';
