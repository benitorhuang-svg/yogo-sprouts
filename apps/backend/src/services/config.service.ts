import { z } from 'zod';
import * as functions from 'firebase-functions';

const envSchema = z.object({
  line: z.object({
    notify_token: z.string().optional(),
  }).optional(),
});

export function validateConfig() {
  const config = functions.config();
  const result = envSchema.safeParse(config);
  
  if (!result.success) {
    console.error('❌ Invalid Firebase Configuration:', result.error.format());
    return null;
  }
  
  return result.data;
}
