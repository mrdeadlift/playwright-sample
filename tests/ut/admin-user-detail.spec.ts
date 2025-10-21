import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('templates/admin-user-detail.html (unit)', () => {
  test('renders detail layout with readonly fields', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-detail.html'));
    await expect(page.locator('h1')).toBeVisible();
    // Check some readonly inputs exist
    const roCount = await page.locator('input[readonly]').count();
    expect(roCount).toBeGreaterThan(0);
    // Back to list link (in main section)
    await expect(page.locator('main a[href="admin-users.html"]')).toBeVisible();
  });

  test('sidebar highlights admin section', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-detail.html'));
    await expect(page.locator('#menuAdmin.collapse.show')).toBeVisible();
    await expect(page.locator('aside a.active[href="admin-user-detail.html"]')).toBeVisible();
  });
});
