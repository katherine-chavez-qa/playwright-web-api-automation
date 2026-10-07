import { test, expect } from '../../src/fixtures/test';

const newBooking = {
  firstname: 'Ana',
  lastname: 'Tester',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

type Booking = typeof newBooking;

interface CreateBookingResponse {
  bookingid: number;
  booking: Booking;
}

test.describe('Booking API', { tag: '@regression' }, () => {
  test('health check responds 201', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.get('/ping');
    expect(response.status()).toBe(201);
  });

  test('creates a booking and retrieves it by id', { tag: '@smoke' }, async ({ request }) => {
    const createResponse = await request.post('/booking', { data: newBooking });
    expect(createResponse.ok()).toBeTruthy();

    const { bookingid, booking } = (await createResponse.json()) as CreateBookingResponse;
    expect(bookingid).toEqual(expect.any(Number));
    expect(booking).toMatchObject(newBooking);

    const getResponse = await request.get(`/booking/${bookingid}`);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(newBooking);
  });

  test('returns 404 for a booking that does not exist', async ({ request }) => {
    const response = await request.get('/booking/999999999');
    expect(response.status()).toBe(404);
  });
});
