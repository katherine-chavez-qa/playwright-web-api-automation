import { test, expect } from '../../src/fixtures/test';
import { authTokenSchema, parseJson } from '../../src/api/schemas';
import { env } from '../../src/config/env';

test.describe('Auth API', { tag: '@regression' }, () => {
  test('returns a token for valid credentials', async ({ bookingClient }) => {
    const response = await bookingClient.createToken(env.bookerUsername, env.bookerPassword);

    expect(response.status()).toBe(200);
    const { token } = await parseJson(response, authTokenSchema);
    expect(token).toMatch(/^[a-z0-9]+$/i);
  });

  test('rejects invalid credentials', async ({ bookingClient }) => {
    const response = await bookingClient.createToken(env.bookerUsername, 'wrong-password');

    // Known quirk: Restful Booker answers 200 (not 401) and explains the failure in the body.
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ reason: 'Bad credentials' });
  });
});
