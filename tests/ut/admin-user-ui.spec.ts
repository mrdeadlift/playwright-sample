import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('Admin user UI interactions', () => {
  test('detail page: delete button opens confirmation modal', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-detail.html'));
    await page.locator('button[data-bs-target="#confirmDeleteModal"]').click();
    const modal = page.locator('#confirmDeleteModal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-body')).toBeVisible();
  });

  test('detail page: change button navigates to edit page', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-detail.html'));
    await page.locator('a[href="admin-user-edit.html"]').first().click();
    await expect(page).toHaveURL(fileUrl('templates/admin-user-edit.html'));
  });

  test('edit page: save opens modal and OK returns to detail', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-edit.html'));
    await page.locator('button[data-bs-target="#confirmSaveModal"]').first().click();
    const modal = page.locator('#confirmSaveModal');
    await expect(modal).toBeVisible();
    // Click the primary action to go back to detail page
    await modal.locator('a.btn.btn-primary').click();
    await expect(page).toHaveURL(fileUrl('templates/admin-user-detail.html'));
  });
});

