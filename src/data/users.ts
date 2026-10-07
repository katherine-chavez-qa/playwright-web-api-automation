import { env } from '../config/env';

// Public demo users listed on https://www.saucedemo.com
export const users = {
  standard: { username: 'standard_user', password: env.saucePassword },
  lockedOut: { username: 'locked_out_user', password: env.saucePassword },
  invalid: { username: 'not_a_user', password: 'wrong_password' },
} as const;
