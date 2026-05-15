import { z } from 'zod';
import * as functions from 'firebase-functions';
import { logger } from '../utils/logger';

const envSchema = z.object({
  line: z
    .object({
      notify_token: z.string().optional(),
    })
    .optional(),
});

export function validateConfig() {
  const config = functions.config();
  const result = envSchema.safeParse(config);

  if (!result.success) {
    logger.error({ errors: result.error.format() }, '❌ Invalid Firebase Configuration');
    return null;
  }

  return result.data;
}
