import { type Locator, type Page } from '@playwright/test';
import { parsePrice } from '../utils/price';

export class CheckoutOverviewPage {
  readonly itemNames: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.itemNames = page.getByTestId('inventory-item-name');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async getTotals(): Promise<{ subtotal: number; tax: number; total: number }> {
    return {
      subtotal: parsePrice(await this.subtotalLabel.innerText()),
      tax: parsePrice(await this.taxLabel.innerText()),
      total: parsePrice(await this.totalLabel.innerText()),
    };
  }

  async finish() {
    await this.finishButton.click();
  }
}
