import { type APIResponse } from '@playwright/test';
import { test, expect } from '../../src/fixtures/test';
import { type BookingClient } from '../../src/api/BookingClient';
import { bookingSchema, parseJson } from '../../src/api/schemas';
import { buildBooking } from '../../src/data/bookings';

type ProtectedOperation = (
  client: BookingClient,
  id: number,
  token?: string,
) => Promise<APIResponse>;

const operations: { method: string; send: ProtectedOperation }[] = [
  {
    method: 'PUT',
    send: (client, id, token) => client.update(id, buildBooking({ firstname: 'Hacked' }), token),
  },
  {
    method: 'PATCH',
    send: (client, id, token) => client.partialUpdate(id, { firstname: 'Hacked' }, token),
  },
  {
    method: 'DELETE',
    send: (client, id, token) => client.delete(id, token),
  },
];

const credentials: { description: string; token?: string }[] = [
  { description: 'without a token' },
  { description: 'with an invalid token', token: 'invalid-token' },
];

test.describe('Booking authorization', { tag: '@regression' }, () => {
  for (const { method, send } of operations) {
    for (const { description, token } of credentials) {
      test(`${method} ${description} is rejected and leaves the booking unchanged`, async ({
        bookingClient,
        booking,
      }) => {
        const response = await send(bookingClient, booking.id, token);

        expect(response.status()).toBe(403);
        // A rejected request must not have modified anything.
        const persisted = await parseJson(await bookingClient.get(booking.id), bookingSchema);
        expect(persisted).toEqual(booking.data);
      });
    }
  }
});
