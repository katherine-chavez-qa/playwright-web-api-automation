import { test, expect } from '../../src/fixtures/test';
import { users } from '../../src/data/users';

test.describe('Login', { tag: '@regression' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'standard user can log in and sees the product list',
    { tag: '@smoke' },
    async ({ page, loginPage, inventoryPage }) => {
      await loginPage.login(users.standard.username, users.standard.password);

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.items).not.toHaveCount(0);
    },
  );

  test('locked out user sees a blocking error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

  test('invalid credentials show an error message', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service',
    );
  });

  test('login requires a username', async ({ loginPage }) => {
    await loginPage.login('', users.standard.password);

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});
