import { type APIResponse } from '@playwright/test';
import { z } from 'zod';

// Required fields and types are enforced; unknown extra fields are tolerated,
// because adding a field is a non-breaking change for API consumers.
export const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.iso.date(),
    checkout: z.iso.date(),
  }),
  additionalneeds: z.string().optional(),
});

export const createBookingResponseSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: bookingSchema,
});

export const bookingIdsSchema = z.array(z.object({ bookingid: z.number().int().positive() }));

export const authTokenSchema = z.object({ token: z.string().min(1) });

export type Booking = z.infer<typeof bookingSchema>;

// Validates a response body against a schema and returns it fully typed.
export async function parseJson<T extends z.ZodType>(
  response: APIResponse,
  schema: T,
): Promise<z.infer<T>> {
  const result = schema.safeParse(await response.json());
  if (!result.success) {
    throw new Error(
      `Response from ${response.url()} does not match the schema:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}
