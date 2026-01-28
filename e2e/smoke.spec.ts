import { expect, test } from '@playwright/test';

test('home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByAltText('国漫世界 Logo')).toBeVisible();
  await expect(page.getByRole('navigation', { name: '底部导航' })).toBeVisible();
});

test('can navigate to search', async ({ page }) => {
  await page.goto('/');

  const dock = page.getByRole('navigation', { name: '底部导航' });
  await dock.getByRole('link', { name: '搜索', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: '搜索' })).toBeVisible();
});
