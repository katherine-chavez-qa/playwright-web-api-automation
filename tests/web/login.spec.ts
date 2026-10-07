import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { users } from '../../src/data/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user can log in and sees the product list', async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    const inventory = new InventoryPage(page);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.items).not.toHaveCount(0);
  });

  test('locked out user sees a blocking error', async () => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

  test('invalid credentials show an error message', async () => {
    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service',
    );
  });

  test('login requires a username', async () => {
    await loginPage.login('', users.standard.password);

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});
