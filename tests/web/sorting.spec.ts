import { test, expect } from '../../src/fixtures/test';
import { type SortOption } from '../../src/pages/InventoryPage';
import { parsePrice } from '../../src/utils/price';

const byName = (a: string, b: string) => a.localeCompare(b);
const byPrice = (a: string, b: string) => parsePrice(a) - parsePrice(b);

// Each case starts from a different order (`from`) so the test proves the list
// actually changes; otherwise "A to Z" would pass trivially on the default view.
const sortCases: {
  option: SortOption;
  from: SortOption;
  label: string;
  field: 'itemNames' | 'itemPrices';
  compare: (a: string, b: string) => number;
}[] = [
  { option: 'az', from: 'za', label: 'Name (A to Z)', field: 'itemNames', compare: byName },
  {
    option: 'za',
    from: 'az',
    label: 'Name (Z to A)',
    field: 'itemNames',
    compare: (a, b) => byName(b, a),
  },
  {
    option: 'lohi',
    from: 'hilo',
    label: 'Price (low to high)',
    field: 'itemPrices',
    compare: byPrice,
  },
  {
    option: 'hilo',
    from: 'lohi',
    label: 'Price (high to low)',
    field: 'itemPrices',
    compare: (a, b) => byPrice(b, a),
  },
];

test.describe('Product sorting', { tag: '@regression' }, () => {
  for (const { option, from, label, field, compare } of sortCases) {
    test(`sorts products by ${label}`, async ({ inventoryPage }) => {
      await inventoryPage.goto();
      await inventoryPage.sortBy(from);

      const values = inventoryPage[field];
      await expect(values).not.toHaveCount(0);
      // The oracle is the UI's own data sorted in the test, not a hardcoded list.
      const expected = [...(await values.allTextContents())].sort(compare);

      await inventoryPage.sortBy(option);

      await expect(inventoryPage.activeSortOption).toHaveText(label);
      await expect(values).toHaveText(expected);
    });
  }
});
