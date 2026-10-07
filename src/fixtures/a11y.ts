import AxeBuilder from '@axe-core/playwright';
import { test as base } from '@playwright/test';
import { formatViolations, WCAG_TAGS } from '../a11y/report';

interface A11yScan {
  // IDs of the violated axe rules: short enough to read in an assertion diff.
  ruleIds: string[];
  // Human-readable details: impact, rule, help link and affected selectors.
  report: string;
}

interface A11yFixtures {
  scanA11y: () => Promise<A11yScan>;
}

export const test = base.extend<A11yFixtures>({
  // Scans the current page and attaches the readable report to the HTML report.
  // The assertion stays in the test, so each spec decides what "passing" means.
  scanA11y: async ({ page }, use, testInfo) => {
    await use(async () => {
      const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      const report = `Scanned ${page.url()}\n\n${formatViolations(violations)}`;
      await testInfo.attach('accessibility-report', { body: report, contentType: 'text/plain' });
      return { ruleIds: violations.map((violation) => violation.id), report };
    });
  },
});
