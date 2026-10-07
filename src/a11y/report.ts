import type AxeBuilder from '@axe-core/playwright';

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;
type Violation = AxeResults['violations'][number];

// WCAG 2.0, 2.1 and 2.2 at levels A and AA. axe "best-practice" rules are
// advisory (not WCAG requirements), so they are intentionally left out of the gate.
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Turns axe results into a short, human-readable report:
// [serious] color-contrast: Elements must meet minimum color contrast ratio thresholds (2 nodes)
//   https://dequeuniversity.com/rules/axe/4.13/color-contrast
//   - #login-button
export function formatViolations(violations: Violation[]): string {
  if (violations.length === 0) {
    return 'No accessibility violations found.';
  }
  return violations
    .map((violation) => {
      const nodes = violation.nodes.map((node) => `  - ${node.target.join(' ')}`).join('\n');
      return [
        `[${violation.impact ?? 'unknown'}] ${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`,
        `  ${violation.helpUrl}`,
        nodes,
      ].join('\n');
    })
    .join('\n\n');
}
