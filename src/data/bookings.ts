import { type Booking } from '../api/schemas';

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Ana',
    lastname: 'Tester',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
