import { test, expect } from '@playwright/test';
import { fileUrl } from '../_helpers';

test.describe('Admin user UI interactions', () => {
  test('detail page: delete button opens confirmation modal', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-detail.html'));
    await page.getByRole('button', { name: '削除' }).click();
    const modal = page.getByRole('dialog', { name: '確認' });
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-body')).toBeVisible();
  });

  test('detail page: change button navigates to edit page', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-detail.html'));
    await page.getByRole('link', { name: '変更' }).click();
    await expect(page).toHaveURL(fileUrl('templates/admin-user-edit.html'));
  });

  test('edit page: save opens modal and OK returns to detail', async ({ page }) => {
    await page.goto(fileUrl('templates/admin-user-edit.html'));
    await page.getByRole('button', { name: '保存' }).first().click();
    const modal = page.getByRole('dialog', { name: '確認' });
    await expect(modal).toBeVisible();
    // Click the primary action to go back to detail page
    await modal.getByRole('link', { name: '保存する' }).click();
    await expect(page).toHaveURL(fileUrl('templates/admin-user-detail.html'));
  });
});
