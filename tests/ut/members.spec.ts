import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('templates/members.html (unit)', () => {
  test('renders list with search form and table', async ({ page }) => {
    await page.goto(fileUrl('templates/members.html'));
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#m-search-id')).toBeVisible();
    await expect(page.locator('#m-search-name')).toBeVisible();
    await expect(page.locator('#m-search-email')).toBeVisible();
    await expect(page.locator('#m-search-registered')).toBeVisible();
    await expect(page.locator('#m-search-status')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('sidebar highlights members section and page link', async ({ page }) => {
    await page.goto(fileUrl('templates/members.html'));
    await expect(page.locator('#menuMembers.collapse.show')).toBeVisible();
    await expect(page.locator('aside a.active[href="members.html"]')).toBeVisible();
  });
});
