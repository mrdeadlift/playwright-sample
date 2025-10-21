import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('templates/sales.html (unit)', () => {
  test('renders list with search form and table', async ({ page }) => {
    await page.goto(fileUrl('templates/sales.html'));
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#s-search-slip')).toBeVisible();
    await expect(page.locator('#s-search-date')).toBeVisible();
    await expect(page.locator('#s-search-customer')).toBeVisible();
    await expect(page.locator('#s-search-amount')).toBeVisible();
    await expect(page.locator('#s-search-status')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('sidebar highlights sales section and page link', async ({ page }) => {
    await page.goto(fileUrl('templates/sales.html'));
    await expect(page.locator('#menuSales.collapse.show')).toBeVisible();
    await expect(page.locator('aside a.active[href="sales.html"]')).toBeVisible();
  });
});
