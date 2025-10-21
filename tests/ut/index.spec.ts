import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('templates/index.html (unit)', () => {
  test('renders navbar, sidebar and main heading', async ({ page }) => {
    await page.goto(fileUrl('templates/index.html'));
    await expect(page.locator('nav.navbar')).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('main h1')).toBeVisible();
  });

  test('TOP link active in sidebar and logout link exists', async ({ page }) => {
    await page.goto(fileUrl('templates/index.html'));
    await expect(page.locator('aside a.active[href="index.html"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /logout|ログアウト/i })).toBeVisible();
  });

  test('thymeleaf replace attributes present on header/footer', async ({ page }) => {
    await page.goto(fileUrl('templates/index.html'));
    await expect(page.locator('nav[th\\:replace]')).toHaveCount(1);
    await expect(page.locator('footer[th\\:replace]')).toHaveCount(1);
  });
});
