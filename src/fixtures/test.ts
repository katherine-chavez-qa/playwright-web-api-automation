import { test as base } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

interface PageObjects {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
}

// Fixtures are lazy: a page object (and the browser page behind it) is only
// created when a test asks for it, so API tests can share this `test` for free.
export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
