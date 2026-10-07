import { test, expect } from '../../src/fixtures/test';
import { authFile } from '../../src/config/paths';
import { users } from '../../src/data/users';

// Logs in once through the UI and saves the session for every web test that needs it.
test('authenticate as standard user', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);

  await page.context().storageState({ path: authFile });
});
