import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('templates/admin-users.html (unit)', () => {
  test('renders list layout with search form and table', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-users.html'));
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('form input#a-search-userid')).toBeVisible();
    await expect(page.locator('form input#a-search-name')).toBeVisible();
    await expect(page.locator('form input#a-search-role')).toBeVisible();
    await expect(page.locator('form input#a-search-lastlogin')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    const rowCount = await page.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('sidebar highlights admin section and page link', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-users.html'));
    await expect(page.locator('#menuAdmin.collapse.show')).toBeVisible();
    await expect(page.locator('aside a.active[href="admin-users.html"]')).toBeVisible();
  });
});
