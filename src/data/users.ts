// Public demo credentials published on https://www.saucedemo.com
export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  invalid: { username: 'not_a_user', password: 'wrong_password' },
} as const;
