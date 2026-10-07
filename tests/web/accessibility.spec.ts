import { test, expect } from '../../src/fixtures/test';
import { customers } from '../../src/data/customers';
import { products } from '../../src/data/products';
import { users } from '../../src/data/users';

test.describe('Accessibility (WCAG 2.2 A/AA)', { tag: ['@a11y', '@regression'] }, () => {
  test.describe('without a session', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('login page', async ({ loginPage, scanA11y }) => {
      await loginPage.goto();
      await expect(loginPage.loginButton).toBeVisible();

      const { ruleIds, report } = await scanA11y();

      expect(ruleIds, report).toEqual([]);
    });

    test('login page showing an error message', async ({ loginPage, scanA11y }) => {
      await loginPage.goto();
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);
      await expect(loginPage.errorMessage).toBeVisible();

      const { ruleIds, report } = await scanA11y();

      expect(ruleIds, report).toEqual([]);
    });
  });

  test('inventory page', async ({ inventoryPage, scanA11y }) => {
    await inventoryPage.goto();
    await expect(inventoryPage.items).not.toHaveCount(0);

    const { ruleIds, report } = await scanA11y();

    expect(ruleIds, report).toEqual([]);
  });

  test('checkout form showing validation errors', async ({ checkoutInfoPage, scanA11y }) => {
    await checkoutInfoPage.goto();
    await checkoutInfoPage.submit({ firstName: '', lastName: '', postalCode: '' });
    await expect(checkoutInfoPage.errorMessage).toBeVisible();

    const { ruleIds, report } = await scanA11y();

    expect(ruleIds, report).toEqual([]);
  });

  test('checkout overview with products', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    scanA11y,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.onesie);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutInfoPage.submit(customers.valid);
    await expect(checkoutOverviewPage.itemNames).toHaveCount(2);

    const { ruleIds, report } = await scanA11y();

    expect(ruleIds, report).toEqual([]);
  });
});
