import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('templates/admin-user-create.html (unit)', () => {
  test('renders form with required fields', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-create.html'));
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#au-userid')).toBeVisible();
    await expect(page.locator('#au-name')).toBeVisible();
    await expect(page.locator('#au-email[type="email"]')).toBeVisible();
    await expect(page.locator('#au-password[type="password"]')).toBeVisible();
    await expect(page.locator('#au-role')).toBeVisible();
    // At least one primary action button is visible (label may vary/localize)
    await expect(page.locator('button.btn.btn-primary').first()).toBeVisible();
  });

  test('sidebar highlights admin section and create page', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-create.html'));
    await expect(page.locator('#menuAdmin.collapse.show')).toBeVisible();
    await expect(page.locator('aside a.active[href="admin-user-create.html"]')).toBeVisible();
  });
});
