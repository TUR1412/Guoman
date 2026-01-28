import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { Result } from 'axe-core';

const formatViolations = (violations: Result[]) =>
  violations
    .map((v) => {
      const nodes = (v.nodes || []).slice(0, 6).map((node) => {
        const targets = Array.isArray(node.target)
          ? node.target.join(', ')
          : String(node.target || '');
        return `- ${targets}`;
      });
      return [`[${v.id}] ${v.help}`, `impact: ${v.impact || 'unknown'}`, ...nodes].join('\n');
    })
    .join('\n\n');

const expectNoA11yViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations, formatViolations(results.violations)).toEqual([]);
};

test('a11y: home', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByAltText('国漫世界 Logo')).toBeVisible();
  await expectNoA11yViolations(page);
});

test('a11y: search', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: '底部导航' })
    .getByRole('link', { name: '搜索' })
    .click();
  await expect(page.getByRole('heading', { level: 1, name: '搜索' })).toBeVisible();
  await expectNoA11yViolations(page);
});
