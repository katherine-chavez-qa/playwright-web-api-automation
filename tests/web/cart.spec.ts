import { test, expect } from '../../src/fixtures/test';
import { products } from '../../src/data/products';

test.describe('Cart', { tag: '@regression' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('adding a product updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(
      inventoryPage.item(products.backpack).getByRole('button', { name: 'Remove' }),
    ).toBeVisible();
  });

  test('added products are listed in the cart', async ({ inventoryPage, cartPage }) => {
    const selected = [products.backpack, products.bikeLight, products.onesie];
    for (const name of selected) {
      await inventoryPage.addToCart(name);
    }

    await expect(inventoryPage.cartBadge).toHaveText(String(selected.length));
    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText(selected);
  });

  test('removing products from the inventory updates the badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.onesie);

    await inventoryPage.removeFromCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(products.onesie);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('removing a product from the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.onesie);
    await inventoryPage.openCart();

    await cartPage.removeItem(products.backpack);

    await expect(cartPage.itemNames).toHaveText([products.onesie]);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
