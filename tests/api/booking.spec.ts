import { test, expect } from '../../src/fixtures/test';
import {
  bookingIdsSchema,
  bookingSchema,
  createBookingResponseSchema,
  parseJson,
} from '../../src/api/schemas';
import { buildBooking } from '../../src/data/bookings';

test.describe('Booking API', { tag: '@regression' }, () => {
  test('health check responds 201', { tag: '@smoke' }, async ({ bookingClient }) => {
    const response = await bookingClient.ping();

    expect(response.status()).toBe(201);
  });

  test('creates a booking', { tag: '@smoke' }, async ({ bookingClient, authToken }) => {
    const data = buildBooking();

    const response = await bookingClient.create(data);

    expect(response.status()).toBe(200);
    const { bookingid, booking } = await parseJson(response, createBookingResponseSchema);
    expect(booking).toEqual(data);

    const persisted = await parseJson(await bookingClient.get(bookingid), bookingSchema);
    expect(persisted).toEqual(data);

    // Best-effort cleanup; the public API also resets its data periodically.
    await bookingClient.delete(bookingid, authToken);
  });

  test('gets a booking by id', async ({ bookingClient, booking }) => {
    const response = await bookingClient.get(booking.id);

    expect(response.status()).toBe(200);
    expect(await parseJson(response, bookingSchema)).toEqual(booking.data);
  });

  test('lists booking ids including a new booking', async ({ bookingClient, booking }) => {
    const response = await bookingClient.list();

    expect(response.status()).toBe(200);
    expect(await parseJson(response, bookingIdsSchema)).toContainEqual({ bookingid: booking.id });
  });

  test('replaces a booking with PUT', async ({ bookingClient, booking, authToken }) => {
    const updated = buildBooking({ firstname: 'Updated', totalprice: 999, depositpaid: false });

    const response = await bookingClient.update(booking.id, updated, authToken);

    expect(response.status()).toBe(200);
    expect(await parseJson(response, bookingSchema)).toEqual(updated);
    expect(await parseJson(await bookingClient.get(booking.id), bookingSchema)).toEqual(updated);
  });

  test('partially updates a booking with PATCH', async ({ bookingClient, booking, authToken }) => {
    const changes = { firstname: 'Patched', totalprice: 200 };

    const response = await bookingClient.partialUpdate(booking.id, changes, authToken);

    expect(response.status()).toBe(200);
    // Fields not included in the PATCH must keep their original values.
    expect(await parseJson(response, bookingSchema)).toEqual({ ...booking.data, ...changes });
  });

  test('deletes a booking', async ({ bookingClient, booking, authToken }) => {
    const response = await bookingClient.delete(booking.id, authToken);

    // Known quirk: Restful Booker answers 201 Created on a successful delete.
    expect(response.status()).toBe(201);
    expect((await bookingClient.get(booking.id)).status()).toBe(404);
  });

  test('returns 404 for a booking that does not exist', async ({ bookingClient }) => {
    const response = await bookingClient.get(999_999_999);

    expect(response.status()).toBe(404);
  });
});
