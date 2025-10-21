import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('templates/sale-detail.html (unit)', () => {
  test('renders detail with readonly fields and back link', async ({ page }) => {
    await page.goto(fileUrl('templates/sale-detail.html'));
    await expect(page.locator('h1')).toBeVisible();
    const roCount = await page.locator('input[readonly]').count();
    expect(roCount).toBeGreaterThan(0);
    await expect(page.locator('main a[href="sales.html"]')).toBeVisible();
  });

  test('sidebar highlights sales section and detail page', async ({ page }) => {
    await page.goto(fileUrl('templates/sale-detail.html'));
    await expect(page.locator('#menuSales.collapse.show')).toBeVisible();
    await expect(page.locator('aside a.active[href="sale-detail.html"]')).toBeVisible();
  });
});
