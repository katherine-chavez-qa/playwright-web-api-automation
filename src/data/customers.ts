export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const customers = {
  valid: { firstName: 'Ana', lastName: 'Tester', postalCode: '050001' },
} as const satisfies Record<string, Customer>;
