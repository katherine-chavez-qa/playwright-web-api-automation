import { test as base } from '@playwright/test';
import { BookingClient } from '../api/BookingClient';
import {
  authTokenSchema,
  createBookingResponseSchema,
  parseJson,
  type Booking,
} from '../api/schemas';
import { env } from '../config/env';
import { buildBooking } from '../data/bookings';

interface ApiFixtures {
  bookingClient: BookingClient;
  booking: { id: number; data: Booking };
}

interface ApiWorkerFixtures {
  authToken: string;
}

export const test = base.extend<ApiFixtures, ApiWorkerFixtures>({
  // One token per worker instead of one per test: it stays valid for the whole run.
  authToken: [
    async ({ playwright }, use) => {
      const request = await playwright.request.newContext({
        baseURL: env.apiBaseUrl,
        extraHTTPHeaders: { Accept: 'application/json' },
      });
      const response = await new BookingClient(request).createToken(
        env.bookerUsername,
        env.bookerPassword,
      );
      const { token } = await parseJson(response, authTokenSchema);
      await request.dispose();
      await use(token);
    },
    { scope: 'worker' },
  ],

  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  // A fresh booking created through the API and removed after the test,
  // so tests never depend on (or pollute) shared data on the public API.
  booking: async ({ bookingClient, authToken }, use) => {
    const data = buildBooking();
    const { bookingid } = await parseJson(
      await bookingClient.create(data),
      createBookingResponseSchema,
    );
    await use({ id: bookingid, data });
    // Best effort: the test itself may already have deleted it.
    await bookingClient.delete(bookingid, authToken);
  },
});
