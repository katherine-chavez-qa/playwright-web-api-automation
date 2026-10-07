import { test, expect } from '../../src/fixtures/test';
import { customers } from '../../src/data/customers';
import { products } from '../../src/data/products';

test.describe('Checkout', { tag: '@regression' }, () => {
  test(
    'customer buys products and gets an order confirmation',
    { tag: '@smoke' },
    async ({
      page,
      inventoryPage,
      cartPage,
      checkoutInfoPage,
      checkoutOverviewPage,
      checkoutCompletePage,
    }) => {
      const selected = [products.backpack, products.onesie];
      let expectedSubtotal = 0;

      await test.step('add products to the cart', async () => {
        await inventoryPage.goto();
        for (const name of selected) {
          expectedSubtotal += await inventoryPage.getPrice(name);
          await inventoryPage.addToCart(name);
        }
      });

      await test.step('review the cart', async () => {
        await inventoryPage.openCart();
        await expect(cartPage.itemNames).toHaveText(selected);
        await cartPage.checkout();
      });

      await test.step('enter customer information', async () => {
        await checkoutInfoPage.submit(customers.valid);
        await expect(page).toHaveURL(/checkout-step-two\.html/);
      });

      await test.step('verify the order summary', async () => {
        await expect(checkoutOverviewPage.itemNames).toHaveText(selected);
        const { subtotal, tax, total } = await checkoutOverviewPage.getTotals();
        expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
        expect(total).toBeCloseTo(subtotal + tax, 2);
      });

      await test.step('finish the order', async () => {
        await checkoutOverviewPage.finish();
        await expect(page).toHaveURL(/checkout-complete\.html/);
        await expect(checkoutCompletePage.header).toHaveText('Thank you for your order!');
        await expect(inventoryPage.cartBadge).toBeHidden();
      });
    },
  );

  test.describe('customer information validation', () => {
    const missingFieldCases = [
      {
        field: 'first name',
        customer: { ...customers.valid, firstName: '' },
        error: 'Error: First Name is required',
      },
      {
        field: 'last name',
        customer: { ...customers.valid, lastName: '' },
        error: 'Error: Last Name is required',
      },
      {
        field: 'postal code',
        customer: { ...customers.valid, postalCode: '' },
        error: 'Error: Postal Code is required',
      },
    ];

    for (const { field, customer, error } of missingFieldCases) {
      test(`requires the ${field}`, async ({ page, checkoutInfoPage }) => {
        await checkoutInfoPage.goto();
        await checkoutInfoPage.submit(customer);

        await expect(checkoutInfoPage.errorMessage).toHaveText(error);
        await expect(page).toHaveURL(/checkout-step-one\.html/);
      });
    }
  });
});
