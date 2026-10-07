import { existsSync } from 'node:fs';
import path from 'node:path';

// TEST_ENV=staging loads `.env.staging`; without TEST_ENV, an optional `.env` is used.
// Variables already set in the shell or CI always win over the file.
const testEnv = process.env.TEST_ENV;
const envFile = path.resolve(__dirname, '../..', testEnv ? `.env.${testEnv}` : '.env');

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
} else if (testEnv) {
  throw new Error(`TEST_ENV is "${testEnv}" but ${envFile} does not exist`);
}

// Empty values fall back to the default, so a blank line in `.env` is harmless.
function read(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const env = {
  webBaseUrl: read('WEB_BASE_URL', 'https://www.saucedemo.com'),
  apiBaseUrl: read('API_BASE_URL', 'https://restful-booker.herokuapp.com'),
  saucePassword: read('SAUCE_PASSWORD', 'secret_sauce'),
} as const;
